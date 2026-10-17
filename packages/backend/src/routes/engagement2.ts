import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { awardXp, STREAK_MILESTONES } from '../services/xp';
import { emitToAll } from '../sockets';

const router = Router();

// ============ STREAKS ============
// Streak status: current flame count, freezes, milestone progress
router.get(
  '/streak',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT xp_streak, best_xp_streak, streak_freezes, last_xp_date FROM users WHERE id = $1`,
      [req.user!.id]
    );
    const u = rows[0] || {};
    const milestones = Object.entries(STREAK_MILESTONES).map(([day, r]) => ({
      day: Number(day),
      ...r,
      reached: Number(u.xp_streak ?? 0) >= Number(day),
    }));
    const next = milestones.find((m) => !m.reached) || null;
    res.json({
      streak: Number(u.xp_streak ?? 0),
      best: Number(u.best_xp_streak ?? 0),
      freezes: Number(u.streak_freezes ?? 0),
      lastActiveDate: u.last_xp_date,
      milestones,
      nextMilestone: next,
    });
  })
);

// Buy a streak freeze (1,000 tokens) — protects your streak for one missed day
const FREEZE_PRICE = 1000;
router.post(
  '/streak-freeze/buy',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: bal } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [req.user!.id]);
    if (Number(bal[0]?.token_balance ?? 0) < FREEZE_PRICE) {
      throw new HttpError(400, `Not enough tokens (need ${FREEZE_PRICE.toLocaleString()})`);
    }
    await addTokens(req.user!.id, -FREEZE_PRICE, 'purchase', { reference: 'streak_freeze' });
    const { rows: u } = await pool.query(
      'UPDATE users SET streak_freezes = streak_freezes + 1 WHERE id = $1 RETURNING streak_freezes',
      [req.user!.id]
    );
    res.json({ ok: true, freezes: Number(u[0].streak_freezes) });
  })
);

// ============ WEEKLY XP TOURNAMENT ============
// Auto-created every Monday. Free entry. Score = XP earned during the week.
// Resolved lazily: when a new week is ensured, last week's tournament is finalized.

function weekBounds(d: Date = new Date()): { start: Date; end: Date } {
  const day = (d.getDay() + 6) % 7; // Monday = 0
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return { start, end };
}

async function resolveWeeklyTournament(t: any): Promise<void> {
  try {
    // Score = total XP earned during tournament week, entrants only
    const { rows: scores } = await pool.query(
      `SELECT te.user_id, COALESCE(SUM(l.amount), 0)::int AS score
       FROM tournament_entries te
       LEFT JOIN xp_ledger l
         ON l.user_id = te.user_id AND l.created_at >= $2 AND l.created_at <= $3
       WHERE te.tournament_id = $1
       GROUP BY te.user_id
       ORDER BY score DESC
       LIMIT 50`,
      [t.id, t.starts_at, t.ends_at]
    );
    // Batch update all scores in ONE query instead of N (was N+1)
    if (scores.length) {
      const values = scores.map((s: any, i: number) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ');
      const params: any[] = [t.id];
      for (const s of scores) params.push(s.user_id, s.score);
      await pool.query(
        `UPDATE tournament_entries AS te SET score = v.score
         FROM (VALUES ${values}) AS v(tid, uid, score)
         WHERE te.tournament_id = v.tid::uuid AND te.user_id = v.uid::uuid`,
        params
      );
    }
    // House-funded prize pool: 15k / 7k / 3k + trophies + XP
    const prizes = [
      { tokens: 15000, xp: 500 },
      { tokens: 7000, xp: 200 },
      { tokens: 3000, xp: 100 },
    ];
    let winnerId: string | null = null;
    for (let i = 0; i < Math.min(3, scores.length); i++) {
      const s = scores[i];
      if (i === 0) winnerId = s.user_id;
      await addTokens(s.user_id, prizes[i].tokens, 'bonus', {
        reference: `tournament:${t.id}:place${i + 1}`,
      }).catch(() => undefined);
      await awardXp(s.user_id, prizes[i].xp, `tournament_place_${i + 1}`).catch(() => undefined);
    }
    if (winnerId) {
      await pool.query('UPDATE users SET trophies = trophies + 1 WHERE id = $1', [winnerId]);
    }
    await pool.query(`UPDATE tournaments SET status = 'finished', winner_id = $1 WHERE id = $2`, [
      winnerId,
      t.id,
    ]);
    if (winnerId) {
      const { rows: w } = await pool.query('SELECT display_name FROM users WHERE id = $1', [winnerId]);
      emitToAll('competition:tournament-finished', {
        tournamentId: t.id,
        name: t.name,
        winnerId,
        winnerName: w[0]?.display_name || 'Someone',
        topScore: scores[0]?.score ?? 0,
      });
      await pool.query(
        `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'tournament', 15000, $2)`,
        [winnerId, `🏆 ${w[0]?.display_name || 'Someone'} won the ${t.name}!`]
      ).catch(() => undefined);
    }
  } catch {
    /* resolution is best-effort */
  }
}

async function ensureWeeklyTournament(): Promise<any> {
  // Finalize any finished weekly tournaments first
  try {
    const { rows: expired } = await pool.query(
      `SELECT * FROM tournaments
       WHERE kind = 'weekly_xp' AND status IN ('open', 'running') AND ends_at <= now()`
    );
    for (const t of expired) await resolveWeeklyTournament(t);
  } catch { /* best-effort */ }

  const { start, end } = weekBounds();
  const { rows: cur } = await pool.query(
    `SELECT * FROM tournaments WHERE kind = 'weekly_xp' AND starts_at = $1 LIMIT 1`,
    [start.toISOString()]
  );
  if (cur.length) return cur[0];
  const name = `Weekly XP Showdown — w/c ${start.toISOString().slice(0, 10)}`;
  const { rows: created } = await pool.query(
    `INSERT INTO tournaments (name, kind, entry_fee, prize_pool, max_players, status, starts_at, ends_at)
     VALUES ($1, 'weekly_xp', 0, 25000, 1000, 'open', $2, $3)
     RETURNING *`,
    [name, start.toISOString(), end.toISOString()]
  );
  return created[0];
}

// Current weekly tournament (auto-creates every Monday) + user's standing
router.get(
  '/weekly',
  requireAuth,
  asyncHandler(async (req, res) => {
    const t = await ensureWeeklyTournament();
    const { rows: cnt } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM tournament_entries WHERE tournament_id = $1`,
      [t.id]
    );
    const { rows: mine } = await pool.query(
      `SELECT * FROM tournament_entries WHERE tournament_id = $1 AND user_id = $2`,
      [t.id, req.user!.id]
    );
    let myScore = 0;
    let myRank: number | null = null;
    if (mine.length) {
      const { rows: r } = await pool.query(
        `WITH ranked AS (
           SELECT te.user_id, COALESCE(SUM(l.amount), 0)::int AS score
           FROM tournament_entries te
           LEFT JOIN xp_ledger l
             ON l.user_id = te.user_id AND l.created_at >= $2 AND l.created_at <= $3
           WHERE te.tournament_id = $1
           GROUP BY te.user_id
         )
         SELECT
           (SELECT score FROM ranked WHERE user_id = $4) AS my_score,
           (SELECT COUNT(*)::int + 1 FROM ranked
            WHERE score > (SELECT score FROM ranked WHERE user_id = $4)) AS my_rank`,
        [t.id, t.starts_at, t.ends_at, req.user!.id]
      );
      myScore = Number(r[0]?.my_score ?? 0);
      myRank = r[0]?.my_rank != null ? Number(r[0].my_rank) : null;
    }
    // Top 5 preview
    const { rows: top } = await pool.query(
      `SELECT te.user_id, u.display_name, u.profile_color, COALESCE(SUM(l.amount), 0)::int AS score
       FROM tournament_entries te
       JOIN users u ON u.id = te.user_id
       LEFT JOIN xp_ledger l
         ON l.user_id = te.user_id AND l.created_at >= $2 AND l.created_at <= $3
       WHERE te.tournament_id = $1
       GROUP BY te.user_id, u.display_name, u.profile_color
       ORDER BY score DESC LIMIT 5`,
      [t.id, t.starts_at, t.ends_at]
    );
    res.json({
      tournament: { ...t, player_count: cnt[0].c },
      entered: mine.length > 0,
      myScore,
      myRank,
      top,
    });
  })
);

// Join the weekly tournament (free entry)
router.post(
  '/weekly/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const t = await ensureWeeklyTournament();
    if (t.status !== 'open') throw new HttpError(400, 'Tournament is not open');
    await pool.query(
      `INSERT INTO tournament_entries (tournament_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [t.id, req.user!.id]
    );
    await awardXp(req.user!.id, 20, 'tournament entered');
    emitToAll('competition:tournament-update', { tournamentId: t.id });
    res.json({ ok: true, tournamentId: t.id });
  })
);

export default router;
