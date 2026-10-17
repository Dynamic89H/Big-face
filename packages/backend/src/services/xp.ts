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
  /** XP actually awarded after multiplier */
  awarded?: number;
  /** Active multiplier that was applied (1 = none) */
  multiplier?: number;
  /** Current XP streak in days */
  streak?: number;
  /** Milestones newly hit by this award */
  newMilestones?: number[];
}

/** XP milestones that trigger celebrations */
export const XP_MILESTONES = [1000, 10000, 50000, 100000, 250000];

/** Streak milestone tiers: day => { xp, tokens, freezes } */
export const STREAK_MILESTONES: Record<number, { xp: number; tokens: number; freezes: number }> = {
  7: { xp: 100, tokens: 500, freezes: 0 },
  14: { xp: 250, tokens: 1000, freezes: 0 },
  30: { xp: 500, tokens: 2500, freezes: 1 },
  60: { xp: 1000, tokens: 5000, freezes: 2 },
  100: { xp: 2500, tokens: 15000, freezes: 3 },
};

/** Returns the highest currently-active XP multiplier for a user (1 if none).
 *  Considers both global multipliers and user-scoped ones (e.g. comeback boost). */
export async function getActiveMultiplier(userId?: string): Promise<{ multiplier: number; name: string | null }> {
  try {
    const { rows } = await pool.query(
      `SELECT multiplier, name FROM xp_multipliers
       WHERE starts_at <= now() AND (ends_at IS NULL OR ends_at > now())
         AND (user_id IS NULL OR ($1::uuid IS NOT NULL AND user_id = $1))
       ORDER BY multiplier DESC LIMIT 1`,
      [userId ?? null]
    );
    if (rows.length) {
      return { multiplier: Number(rows[0].multiplier), name: rows[0].name };
    }
  } catch {
    /* table may not exist yet */
  }
  return { multiplier: 1, name: null };
}

/** Updates the user's consecutive-days-earning-XP streak. Returns current streak.
 *  A streak freeze (inventory item) is auto-consumed when a day is missed,
 *  preserving the streak. */
export async function updateXpStreak(userId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  try {
    const { rows } = await pool.query(
      'SELECT xp_streak, best_xp_streak, last_xp_date, streak_freezes FROM users WHERE id = $1', [userId]
    );
    const u = rows[0];
    if (!u) return 0;
    const lastDate = u.last_xp_date ? new Date(u.last_xp_date).toISOString().slice(0, 10) : null;
    let streak = u.xp_streak ?? 0;
    let freezeUsed = false;
    if (lastDate === today) {
      return streak; // Already counted today
    } else if (lastDate === yesterday) {
      streak += 1;
    } else if (lastDate !== null && Number(u.streak_freezes ?? 0) > 0) {
      // Missed at least one day — auto-consume a streak freeze to save it
      await pool.query('UPDATE users SET streak_freezes = streak_freezes - 1 WHERE id = $1', [userId]);
      await pool.query(
        `INSERT INTO streak_freeze_uses (user_id, frozen_date) VALUES ($1, $2::date)
         ON CONFLICT (user_id, frozen_date) DO NOTHING`,
        [userId, yesterday]
      ).catch(() => undefined);
      streak += 1;
      freezeUsed = true;
    } else {
      streak = 1;
    }
    const best = Math.max(u.best_xp_streak ?? 0, streak);
    await pool.query(
      'UPDATE users SET xp_streak = $1, best_xp_streak = $2, last_xp_date = $3 WHERE id = $4',
      [streak, best, today, userId]
    );

    if (freezeUsed) {
      try {
        const { emitToUser } = await import('../sockets');
        emitToUser(userId, 'xp:streak-frozen', { streak });
      } catch { /* best-effort */ }
    }

    // Streak milestone rewards: XP + tokens + bonus freezes
    const milestone = STREAK_MILESTONES[streak];
    if (milestone) {
      await pool.query(
        'UPDATE users SET xp = xp + $1, streak_freezes = streak_freezes + $2 WHERE id = $3',
        [milestone.xp, milestone.freezes, userId]
      );
      await pool.query(
        `INSERT INTO xp_ledger (user_id, amount, reason) VALUES ($1, $2, $3)`,
        [userId, milestone.xp, `xp_streak_${streak}_bonus`]
      ).catch(() => undefined);
      if (milestone.tokens > 0) {
        try {
          const { addTokens } = await import('./tokens');
          await addTokens(userId, milestone.tokens, 'bonus', { reference: `streak_${streak}_bonus` });
        } catch { /* best-effort */ }
      }
      try {
        const { emitToUser } = await import('../sockets');
        emitToUser(userId, 'xp:streak-milestone', {
          streak,
          xp: milestone.xp,
          tokens: milestone.tokens,
          freezes: milestone.freezes,
        });
      } catch { /* best-effort */ }
    }
    return streak;
  } catch {
    return 0;
  }
}

/** Checks for newly-hit XP milestones. Returns array of milestone values just hit. */
export async function checkMilestones(userId: string, totalXp: number): Promise<number[]> {
  const hit: number[] = [];
  try {
    for (const m of XP_MILESTONES) {
      if (totalXp >= m) {
        const { rows } = await pool.query(
          'SELECT 1 FROM user_xp_milestones WHERE user_id = $1 AND milestone_xp = $2',
          [userId, m]
        );
        if (!rows.length) {
          await pool.query(
            'INSERT INTO user_xp_milestones (user_id, milestone_xp) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, m]
          );
          hit.push(m);
        }
      }
    }
    if (hit.length) {
      try {
        const { rows: u } = await pool.query(
          'SELECT display_name FROM users WHERE id = $1', [userId]
        );
        const { emitToAll } = await import('../sockets');
        for (const m of hit) {
          emitToAll('xp:milestone', {
            userId,
            displayName: u[0]?.display_name || 'Someone',
            milestone: m,
          });
        }
        await pool.query(
          `INSERT INTO win_feed (user_id, kind, amount_tokens, detail)
           VALUES ($1, 'milestone', 0, $2)`,
          [userId, `🌟 ${u[0]?.display_name || 'Someone'} hit ${Math.max(...hit).toLocaleString()} XP!`]
        ).catch(() => undefined);
      } catch { /* best-effort */ }
    }
  } catch {
    /* best-effort */
  }
  return hit;
}

/**
 * Adds XP to a user and bumps their stored level when they cross a threshold.
 * Applies any active XP multiplier, logs to xp_ledger, updates XP streak,
 * and checks for milestone celebrations.
 * `reason` is logged in the ledger (used for streaks, period leaderboards, first-win-of-day).
 */
export async function awardXp(userId: string, amount: number, _reason: string): Promise<AwardXpResult> {
  // Apply active multiplier (global + user-scoped, e.g. comeback boost)
  const { multiplier, name: multName } = await getActiveMultiplier(userId);

  // Apply equipped ability XP boost (e.g. Fire Aura +5%, Lion's Roar +20%)
  let abilityBoost = 0;
  let abilityName: string | null = null;
  try {
    const { rows: ab } = await pool.query(
      `SELECT a.effect_type, a.effect_value, a.name FROM abilities a
       JOIN user_abilities ua ON ua.ability_id = a.id
       WHERE ua.user_id = $1 AND ua.equipped = true
         AND a.effect_type IN ('xp_boost') LIMIT 1`,
      [userId]
    );
    if (ab.length) {
      abilityBoost = Number(ab[0].effect_value) / 100;
      abilityName = ab[0].name;
    }
  } catch {
    /* abilities table may not exist yet */
  }
  const finalAmount = Math.round(amount * multiplier * (1 + abilityBoost));

  const { rows } = await pool.query(
    `UPDATE users SET xp = xp + $1, updated_at = now() WHERE id = $2 RETURNING xp, level`,
    [finalAmount, userId]
  );
  if (!rows.length) throw new Error('User not found');
  const xp = Number(rows[0].xp);
  const newLevel = levelForXp(xp);

  // Log to ledger (powers streaks, period leaderboards, first-win-of-day)
  const boostNote =
    (multiplier > 1 ? ` (x${multiplier} ${multName})` : '') +
    (abilityBoost > 0 ? ` (+${Math.round(abilityBoost * 100)}% ${abilityName})` : '');
  await pool.query(
    `INSERT INTO xp_ledger (user_id, amount, reason) VALUES ($1, $2, $3)`,
    [userId, finalAmount, _reason + boostNote]
  ).catch(() => undefined);

  // Update XP streak (consecutive days earning XP)
  const streak = await updateXpStreak(userId);

  // Check for milestone celebrations
  const newMilestones = await checkMilestones(userId, xp);

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

  const oldLevel = Number(rows[0].level);
  if (newLevel > oldLevel) {
    await pool.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);

    // ---- Level-up rewards (every level-up, every XP path) ----
    // Token reward: level × 50 (idempotent — never pays twice for same level)
    try {
      const { rows: existing } = await pool.query(
        'SELECT 1 FROM level_rewards WHERE user_id = $1 AND level = $2',
        [userId, newLevel]
      );
      if (!existing.length) {
        const { addTokens } = await import('./tokens');
        const tokens = newLevel * 50;
        await addTokens(userId, tokens, 'level_up_reward', { reference: `level:${newLevel}` });
        await pool.query(
          'INSERT INTO level_rewards (user_id, level, tokens_awarded) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [userId, newLevel, tokens]
        );
      }
    } catch {
      /* reward is best-effort */
    }

    // REFERRAL MILESTONE: referred user hit Level 5 — both sides get the big reward.
    // reward_claimed is flipped first so nested awardXp calls can't double-award.
    if (newLevel >= 5) {
      try {
        const { rows: ref } = await pool.query(
          `SELECT referrer_id FROM referrals WHERE referred_id = $1 AND reward_claimed = false LIMIT 1`,
          [userId]
        );
        if (ref.length) {
          await pool.query(
            `UPDATE referrals SET reward_claimed = true WHERE referred_id = $1 AND reward_claimed = false`,
            [userId]
          );
          const referrerId: string = ref[0].referrer_id;
          const { addTokens } = await import('./tokens');
          // Referrer: 1,000 tokens + 200 XP
          await addTokens(referrerId, 1000, 'bonus', { reference: `referral_level5:${userId}` }).catch(() => undefined);
          await awardXp(referrerId, 200, 'referral_level5_bonus').catch(() => undefined);
          // Referred: 500 tokens + 100 XP
          await addTokens(userId, 500, 'bonus', { reference: 'referral_level5_welcome' }).catch(() => undefined);
          await awardXp(userId, 100, 'referral_level5_welcome').catch(() => undefined);
          const { emitToUser } = await import('../sockets');
          emitToUser(referrerId, 'referral:level5', { referredId: userId, tokens: 1000, xp: 200 });
          emitToUser(userId, 'referral:level5', { referrerId, tokens: 500, xp: 100 });
          const { rows: ru } = await pool.query(
            'SELECT display_name FROM users WHERE id = $1', [userId]
          ).catch(() => ({ rows: [] as any[] }));
          await pool.query(
            `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'referral', 1000, $2)`,
            [referrerId, `🤝 ${ru[0]?.display_name || 'Your invite'} hit Level 5 — 1,000 tokens earned!`]
          ).catch(() => undefined);
        }
      } catch { /* best-effort */ }
    }

    // 2. Broadcast to all players + detect rank boundary crossing
    try {
      const { rows: u } = await pool.query(
        'SELECT display_name, gender FROM users WHERE id = $1', [userId]
      );
      const displayName = u[0]?.display_name || 'Someone';
      const gender = u[0]?.gender;
      const { emitToAll } = await import('../sockets');
      const newRank = rankForLevel(newLevel, gender);
      const oldRank = rankForLevel(oldLevel, gender);
      const rankChanged = newRank.name !== oldRank.name;

      emitToAll('user:rank-up', {
        userId,
        displayName,
        level: newLevel,
        tier: tierForLevel(newLevel),
        rank: newRank.name,
        rankIcon: newRank.icon,
        tokensWon: newLevel * 50,
        rankChanged,
      });

      // 3. RANK-UP: crossing into a new tier = special announcement + bonus
      if (rankChanged) {
        const rankIndex = RANKS.findIndex((r) => r.name === newRank.name || (newRank.name === 'Face Queen' && r.name === 'Face King'));
        const rankBonus = 100 * Math.max(1, rankIndex);
        try {
          const { addTokens } = await import('./tokens');
          await addTokens(userId, rankBonus, 'level_up_reward', { reference: `rankup:${newRank.name}:${newLevel}` });
        } catch {
          /* bonus is best-effort */
        }
        emitToAll('rank:tier-up', {
          userId,
          displayName,
          oldRank: oldRank.name,
          newRank: newRank.name,
          rankIcon: newRank.icon,
          rankColor: newRank.color,
          level: newLevel,
          bonusTokens: rankBonus,
        });
        // Permanent feed post so the rank-up lives beyond the socket toast
        await pool.query(
          `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'level', $2, $3)`,
          [userId, rankBonus, `${newRank.icon} ${displayName} ranked up to ${newRank.name}!`]
        ).catch(() => undefined);
      }
    } catch {
      /* broadcast is best-effort */
    }

    // OFFICIAL CROWNING: hitting level 40 = Face King/Queen — announce to ALL players
    if (newLevel >= 40 && oldLevel < 40) {
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

    // Engagement: every level-up hits the live ticker + a push to the player.
    try {
      const { rows: lu } = await pool.query(
        'SELECT display_name, username FROM users WHERE id = $1', [userId]
      );
      const luName = lu[0]?.display_name || lu[0]?.username || 'Someone';
      const { publishActivity } = await import('../routes/engagement');
      await publishActivity(userId, 'level_up', `⬆️ ${luName} reached Level ${newLevel}!`);
      const { pushToUser } = await import('./push');
      await pushToUser(userId, {
        title: `⬆️ Level ${newLevel}!`,
        body: `You leveled up on Big Face! Check your rewards.`,
        url: '/ranks',
      }).catch(() => undefined);
    } catch {
      /* engagement is best-effort */
    }

    return { leveledUp: true, level: newLevel, xp, awarded: finalAmount, multiplier, streak, newMilestones };
  }
  return { leveledUp: false, level: Number(rows[0].level), xp, awarded: finalAmount, multiplier, streak, newMilestones };
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
    const { addTokens } = await import('./tokens');
    await addTokens(userId, 100, 'bonus', { reference: 'weekly_streak_bonus' }).catch(() => undefined);
  }

  return { awarded: true, streak, xp };
}
