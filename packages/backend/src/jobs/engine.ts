/**
 * Big Face engagement engine — background jobs that keep the app alive
 * when nobody's watching.
 *
 * These run via the /api/admin/engine/* endpoints (service-key auth),
 * triggered by an external scheduler (cron). Each function is idempotent:
 * safe to re-run.
 */
import { pool } from '../db';
import { pushToUser } from '../services/push';

const BOT_EMAIL_PATTERN = 'bot_%@bigface.local';

// ---------------------------------------------------------------------------
// 1. Daily reset — run at midnight
// ---------------------------------------------------------------------------
export async function runDailyReset(): Promise<Record<string, number>> {
  // Prune old spin history (keep 30 days)
  const spins = await pool.query(
    `DELETE FROM daily_spins WHERE spun_at < now() - interval '30 days'`
  );

  // Reset daily challenge progress (weekly challenges survive)
  const challenges = await pool.query(
    `DELETE FROM user_challenge_progress
     WHERE challenge_id IN (SELECT id FROM season_challenges WHERE challenge_type = 'daily')`
  );

  // Break login streaks for users who missed more than a day
  // (last_login_date = yesterday means the streak is still alive today)
  const streaks = await pool.query(
    `UPDATE users SET login_streak = 0
     WHERE login_streak > 0
       AND (last_login_date IS NULL OR last_login_date < CURRENT_DATE - 1)
     RETURNING id`
  );

  // Break xp streaks the same way (awardXp self-heals on next award, this is belt-and-braces)
  const xpStreaks = await pool.query(
    `UPDATE users SET xp_streak = 0
     WHERE xp_streak > 0
       AND (last_xp_date IS NULL OR last_xp_date < CURRENT_DATE - 1)
     RETURNING id`
  );

  return {
    spinsPruned: spins.rowCount ?? 0,
    dailyChallengesReset: challenges.rowCount ?? 0,
    loginStreaksBroken: streaks.rowCount ?? 0,
    xpStreaksBroken: xpStreaks.rowCount ?? 0,
  };
}

// ---------------------------------------------------------------------------
// 2. Tournament scheduler — resolve finished, create next weekly + weekend
// Tournament tiers: Rookie -> Pros -> Legend -> Boss -> Masters
const TOURNAMENT_TIERS = ['Rookie', 'Pros', 'Legend', 'Boss', 'Masters'] as const;

function nextTier(tier: string): string {
  const idx = TOURNAMENT_TIERS.indexOf(tier as (typeof TOURNAMENT_TIERS)[number]);
  return idx >= 0 && idx < TOURNAMENT_TIERS.length - 1 ? TOURNAMENT_TIERS[idx + 1] : tier;
}

export async function runWeeklyTournament(): Promise<Record<string, unknown>> {
  const { addTokens } = await import('../services/tokens');
  const { awardXp } = await import('../services/xp');
  const { emitToAll } = await import('../sockets');

  // Resolve tournaments that ended (weekly + weekend)
  const { rows: ended } = await pool.query(
    `SELECT id, name, tier, schedule, prize_pool FROM tournaments
     WHERE ends_at <= now() AND status != 'finished'`
  );
  const resolved: Array<{ id: string; name: string; tier: string; winner: string | null; prize: number }> = [];
  for (const t of ended) {
    const { rows: top } = await pool.query(
      `SELECT te.user_id, u.display_name, u.tournament_tier
       FROM tournament_entries te JOIN users u ON u.id = te.user_id
       WHERE te.tournament_id = $1
       ORDER BY te.score DESC, te.wins DESC LIMIT 1`,
      [t.id]
    );
    const winner = top[0] ?? null;
    const prize = Number(t.prize_pool) || 0;
    if (winner && prize > 0) {
      await addTokens(winner.user_id, prize, 'tournament_win', {
        reference: `tournament:${t.id}`,
      }).catch(() => undefined);
      // Winner gets XP + moves up a tournament tier
      await awardXp(winner.user_id, 500, 'tournament_win').catch(() => undefined);
      const newTier = nextTier(winner.tournament_tier || 'Rookie');
      await pool.query('UPDATE users SET tournament_tier = $1 WHERE id = $2', [
        newTier,
        winner.user_id,
      ]).catch(() => undefined);
      // Hall of fame entry for tournament champions
      await pool.query(
        `INSERT INTO hall_of_fame (user_id, achievement, detail) VALUES ($1, $2, $3)`,
        [
          winner.user_id,
          `🏆 ${t.name} Champion (${t.tier})`,
          `Won ${prize.toLocaleString()} tokens${newTier !== (winner.tournament_tier || 'Rookie') ? ` — promoted to ${newTier}!` : ''}`,
        ]
      ).catch(() => undefined);
    }
    await pool.query(
      `UPDATE tournaments SET status = 'finished', winner_id = $2 WHERE id = $1`,
      [t.id, winner ? winner.user_id : null]
    );
    resolved.push({
      id: String(t.id),
      name: t.name,
      tier: t.tier,
      winner: winner ? winner.display_name : null,
      prize,
    });
    emitToAll('competition:tournament-finished', {
      tournamentId: String(t.id),
      name: t.name,
      tier: t.tier,
      winner: winner ? winner.display_name : null,
      prize,
    });
  }

  // Create next weekly tournament if none is open (runs Monday -> Sunday)
  const { rows: openWeekly } = await pool.query(
    `SELECT id FROM tournaments WHERE schedule = 'weekly' AND status = 'open' AND ends_at > now() LIMIT 1`
  );
  // Create weekend tournament if none is open (runs Friday -> Monday)
  const { rows: openWeekend } = await pool.query(
    `SELECT id FROM tournaments WHERE schedule = 'weekend' AND status = 'open' AND ends_at > now() LIMIT 1`
  );

  const created: Array<{ id: string; schedule: string }> = [];
  if (!openWeekly.length) {
    const { rows } = await pool.query(
      `INSERT INTO tournaments (name, kind, tier, schedule, entry_fee, max_players, status, starts_at, ends_at)
       VALUES ('Weekly Showdown 🎲', 'dice', 'Rookie', 'weekly', 500, 64, 'open', now(), now() + interval '7 days')
       RETURNING id`
    );
    created.push({ id: String(rows[0].id), schedule: 'weekly' });
    emitToAll('competition:tournament-created', { tournamentId: String(rows[0].id), schedule: 'weekly' });
  }
  if (!openWeekend.length) {
    const { rows } = await pool.query(
      `INSERT INTO tournaments (name, kind, tier, schedule, entry_fee, max_players, status, starts_at, ends_at)
       VALUES ('Weekend Clash ⚡', 'dice', 'Rookie', 'weekend', 250, 32, 'open', now(), now() + interval '3 days')
       RETURNING id`
    );
    created.push({ id: String(rows[0].id), schedule: 'weekend' });
    emitToAll('competition:tournament-created', { tournamentId: String(rows[0].id), schedule: 'weekend' });
  }

  return { resolved, created };
}

// ---------------------------------------------------------------------------
// 3. Streak checker — warn users whose streak dies at midnight
// ---------------------------------------------------------------------------
export async function runStreakCheck(): Promise<{ warned: number }> {
  // Login streak at risk: streak >= 2, last login was yesterday → dies tonight
  const { rows } = await pool.query(
    `SELECT u.id, u.display_name, u.login_streak, u.preferred_lang
     FROM users u JOIN push_subscriptions ps ON ps.user_id = u.id
     WHERE u.login_streak >= 2
       AND u.last_login_date = CURRENT_DATE - 1
       AND u.email NOT LIKE '${BOT_EMAIL_PATTERN}'
     GROUP BY u.id`
  );
  let warned = 0;
  for (const u of rows) {
    try {
      const n = await pushToUser(String(u.id), {
        title: '🔥 Streak at risk!',
        body: `${u.display_name}, your ${u.login_streak}-day streak dies at midnight! Open Big Face to keep it alive.`,
        url: '/',
      });
      warned += n > 0 ? 1 : 0;
    } catch {
      /* best-effort */
    }
  }
  return { warned };
}

// ---------------------------------------------------------------------------
// 4. Inactive user re-engagement — 3+ days quiet, ping at most weekly
// ---------------------------------------------------------------------------
export async function runReengage(): Promise<{ pinged: number }> {
  const { rows } = await pool.query(
    `SELECT DISTINCT u.id, u.display_name
     FROM users u JOIN push_subscriptions ps ON ps.user_id = u.id
     WHERE u.updated_at < now() - interval '3 days'
       AND (u.last_reengage_push_at IS NULL OR u.last_reengage_push_at < now() - interval '7 days')
       AND u.email NOT LIKE '${BOT_EMAIL_PATTERN}'`
  );
  let pinged = 0;
  const CONCURRENCY = 20;
  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (u) => {
        const n = await pushToUser(String(u.id), {
          title: '👋 Big Face misses you!',
          body: `${u.display_name}, your daily spin is waiting and the tables are hot. Come back and roll! 🎲`,
          url: '/',
        });
        if (n > 0) {
          await pool.query(`UPDATE users SET last_reengage_push_at = now() WHERE id = $1`, [u.id]);
        }
        return n;
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value > 0) pinged++;
    }
  }
  return { pinged };
}

// ---------------------------------------------------------------------------
// 5. Crew war resolver — end expired wars, crown winners
// (moved from routes/crews.ts so the scheduler can call it too)
// ---------------------------------------------------------------------------
export async function resolveExpiredWars(): Promise<{ resolved: number }> {
  const { awardXp } = await import('../services/xp');
  const { emitToAll } = await import('../sockets');
  const { rows: expired } = await pool.query(
    `SELECT id, challenger_crew_id, defender_crew_id, challenger_score, defender_score
     FROM crew_wars WHERE status = 'live' AND ends_at IS NOT NULL AND ends_at <= now()`
  );
  for (const w of expired) {
    const cScore = Number(w.challenger_score);
    const dScore = Number(w.defender_score);
    const winnerId = cScore > dScore ? w.challenger_crew_id : w.defender_crew_id;
    await pool.query(`UPDATE crew_wars SET status = 'ended', winner_crew_id = $2 WHERE id = $1`, [
      w.id,
      winnerId,
    ]);
    await pool.query(`UPDATE crews SET wins = wins + 1 WHERE id = $1`, [winnerId]);
    const { rows: members } = await pool.query('SELECT user_id FROM crew_members WHERE crew_id = $1', [
      winnerId,
    ]);
    for (const m of members) {
      await awardXp(m.user_id, 100, 'crew_war_victory').catch(() => undefined);
    }
    emitToAll('crew:war-ended', {
      warId: w.id,
      winnerCrewId: winnerId,
      challengerScore: cScore,
      defenderScore: dScore,
    });
  }
  return { resolved: expired.length };
}

// ---------------------------------------------------------------------------
// 6. Leaderboard snapshot — daily top-50 for historical tracking
// ---------------------------------------------------------------------------
export async function runLeaderboardSnapshot(): Promise<{ snapshotDate: string; players: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const { rows: top } = await pool.query(
    `SELECT id, display_name, level, xp, token_balance
     FROM users
     WHERE email NOT LIKE '${BOT_EMAIL_PATTERN}'
     ORDER BY level DESC, xp DESC LIMIT 50`
  );
  let inserted = 0;
  for (let i = 0; i < top.length; i++) {
    const u = top[i];
    await pool
      .query(
        `INSERT INTO leaderboard_snapshots (snapshot_date, rank, user_id, display_name, level, xp, token_balance)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (snapshot_date, user_id) DO UPDATE SET
           rank = EXCLUDED.rank, level = EXCLUDED.level, xp = EXCLUDED.xp,
           token_balance = EXCLUDED.token_balance`,
        [today, i + 1, u.id, u.display_name, u.level, u.xp, u.token_balance]
      )
      .then(() => inserted++)
      .catch(() => undefined);
  }
  // Prune snapshots older than 90 days
  await pool
    .query(`DELETE FROM leaderboard_snapshots WHERE snapshot_date < CURRENT_DATE - 90`)
    .catch(() => undefined);
  return { snapshotDate: today, players: inserted };
}

// ---------------------------------------------------------------------------
// Run everything — one cron hit for the full daily engine
// ---------------------------------------------------------------------------
export async function runEngineAll(): Promise<Record<string, unknown>> {
  const [reset, tournament, streak, reengage, wars, snapshot] = await Promise.all([
    runDailyReset().catch((e) => ({ error: String(e?.message ?? e) })),
    runWeeklyTournament().catch((e) => ({ error: String(e?.message ?? e) })),
    runStreakCheck().catch((e) => ({ error: String(e?.message ?? e) })),
    runReengage().catch((e) => ({ error: String(e?.message ?? e) })),
    resolveExpiredWars().catch((e) => ({ error: String(e?.message ?? e) })),
    runLeaderboardSnapshot().catch((e) => ({ error: String(e?.message ?? e) })),
  ]);
  return { reset, tournament, streak, reengage, wars, snapshot };
}

