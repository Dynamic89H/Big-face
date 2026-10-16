import { pool } from '../db';

/** level = floor(sqrt(xp / 100)) + 1  (per API_CONTRACT.md) */
export function levelForXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

/** Total XP required to *reach* a given level (level 1 needs 0). */
export function xpForLevel(level: number): number {
  return 100 * Math.pow(Math.max(0, level - 1), 2);
}

/** Throne tier derived from level (per API_CONTRACT.md). */
export function tierForLevel(level: number): string {
  if (level <= 2) return 'Rising';
  if (level <= 4) return 'Seat';
  if (level <= 6) return 'Throne';
  if (level <= 9) return 'Golden Throne';
  return 'Legendary Throne';
}

/** Rank system for the come up — visible progression with perks. */
export interface Rank {
  name: string;
  icon: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  perk: string;
}

export const RANKS: Rank[] = [
  { name: 'Rookie', icon: '🥉', minLevel: 1, maxLevel: 2, color: '#cd7f32', perk: 'Welcome to Big Face' },
  { name: 'Grinder', icon: '🥈', minLevel: 3, maxLevel: 5, color: '#c0c0c0', perk: 'Unlocks crew battles' },
  { name: 'Hustler', icon: '🥇', minLevel: 6, maxLevel: 10, color: '#ffd700', perk: '1.5x spin rewards, unlocks tournaments' },
  { name: 'Boss', icon: '💎', minLevel: 11, maxLevel: 20, color: '#00d4ff', perk: 'Unlocks marketplace selling, gold name' },
  { name: 'Kingpin', icon: '👑', minLevel: 21, maxLevel: 30, color: '#ff6b00', perk: 'Host live streams, 2x tip earnings' },
  { name: 'Legend', icon: '🌟', minLevel: 31, maxLevel: 39, color: '#ff00ff', perk: 'Featured on homepage, crown everywhere' },
  { name: 'Face King', icon: '🤴', minLevel: 40, maxLevel: 999, color: '#ffd700', perk: 'OFFICIAL Face King — crowned live for all players to see' },
];

export function rankForLevel(level: number, gender?: string): Rank {
  const rank = RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) || RANKS[0];
  // Face Queen for female users at the top rank
  if (rank.name === 'Face King' && gender === 'female') {
    return { ...rank, name: 'Face Queen', icon: '👸' };
  }
  return rank;
}

export interface AwardXpResult {
  leveledUp: boolean;
  level: number;
  xp: number;
}

/**
 * Adds XP to a user and bumps their stored level when they cross a threshold.
 * `reason` is informational (a future xp_ledger could consume it).
 */
export async function awardXp(userId: string, amount: number, _reason: string): Promise<AwardXpResult> {
  const { rows } = await pool.query(
    `UPDATE users SET xp = xp + $1, updated_at = now() WHERE id = $2 RETURNING xp, level`,
    [amount, userId]
  );
  if (!rows.length) throw new Error('User not found');
  const xp = Number(rows[0].xp);
  const newLevel = levelForXp(xp);

  // Crew XP: member's gains count toward their crew (and active wars).
  try {
    const { rows: cm } = await pool.query(
      'SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1', [userId]
    );
    if (cm.length && amount > 0) {
      await pool.query('UPDATE crews SET total_xp = total_xp + $1 WHERE id = $2', [amount, cm[0].crew_id]);
      await pool.query(
        `UPDATE crew_wars SET
           challenger_score = challenger_score + CASE WHEN challenger_crew_id = $2 THEN $1 ELSE 0 END,
           defender_score = defender_score + CASE WHEN defender_crew_id = $2 THEN $1 ELSE 0 END
         WHERE status = 'live' AND (challenger_crew_id = $2 OR defender_crew_id = $2)`,
        [amount, cm[0].crew_id]
      );
    }
  } catch {
    /* crew XP is best-effort */
  }

  if (newLevel > Number(rows[0].level)) {
    await pool.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);

    // OFFICIAL CROWNING: hitting level 40 = Face King/Queen — announce to ALL players
    if (newLevel >= 40 && Number(rows[0].level) < 40) {
      try {
        const { rows: u } = await pool.query(
          'SELECT display_name, gender FROM users WHERE id = $1', [userId]
        );
        const title = u[0]?.gender === 'female' ? 'Face Queen 👸' : 'Face King 🤴';
        const { emitToAll } = await import('../sockets');
        emitToAll('rank:crowned', {
          userId,
          displayName: u[0]?.display_name || 'Someone',
          title,
          level: newLevel,
        });
        // Also post to win feed so it's permanent
        await pool.query(
          `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'crown', 0, $2)`,
          [userId, `👑 CROWNED ${title}!`]
        ).catch(() => undefined);
      } catch {
        /* crowning is best-effort */
      }
    }

    return { leveledUp: true, level: newLevel, xp };
  }
  return { leveledUp: false, level: Number(rows[0].level), xp };
}

/**
 * Awards the daily-login +10 XP, at most once per calendar day.
 * Idempotency is tracked with a zero-amount `bonus` ledger row
 * (`daily_login:YYYY-MM-DD`) — cheap and survives restarts.
 * Note: two concurrent logins could theoretically double-award; the
 * window is tiny and the consequence is +10 XP, so no lock is taken.
 */
export async function awardDailyLoginXp(userId: string): Promise<{ awarded: boolean; streak: number; xp: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const reference = `daily_login:${today}`;
  const { rows } = await pool.query(
    `SELECT id FROM token_transactions WHERE user_id = $1 AND kind = 'bonus' AND reference = $2 LIMIT 1`,
    [userId, reference]
  );
  if (rows.length) {
    const { rows: u } = await pool.query('SELECT login_streak FROM users WHERE id = $1', [userId]);
    return { awarded: false, streak: u[0]?.login_streak ?? 0, xp: 0 };
  }

  // Streak logic: consecutive days increment, gap resets to 1.
  const { rows: u } = await pool.query(
    'SELECT login_streak, last_login_date FROM users WHERE id = $1',
    [userId]
  );
  const prev = u[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let streak = 1;
  if (prev?.last_login_date) {
    const last = new Date(prev.last_login_date).toISOString().slice(0, 10);
    if (last === yesterday) streak = (prev.login_streak ?? 0) + 1;
    else if (last === today) streak = prev.login_streak ?? 1;
  }

  // Escalating rewards: base 10 XP + 5 per streak day, capped at +50. Weekly bonus at 7.
  const xp = Math.min(10 + (streak - 1) * 5, 50);
  await awardXp(userId, xp, 'daily login streak');
  await pool.query(
    `INSERT INTO token_transactions (user_id, amount, kind, reference) VALUES ($1, 0, 'bonus', $2)`,
    [userId, reference]
  );
  await pool.query(
    'UPDATE users SET login_streak = $1, last_login_date = $2 WHERE id = $3',
    [streak, today, userId]
  );

  // 7-day streak bonus: 100 tokens.
  if (streak % 7 === 0) {
    await pool.query(
      `INSERT INTO wallet_transactions (user_id, kind, amount, reason)
       VALUES ($1, 'credit', 100, 'weekly_streak_bonus')`,
      [userId]
    ).catch(() => undefined);
  }

  return { awarded: true, streak, xp };
}
