import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { getActiveMultiplier, XP_MILESTONES } from '../services/xp';

const router = Router();

/** Get user's XP streak info */
router.get(
  '/streak',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'SELECT xp_streak, best_xp_streak, last_xp_date FROM users WHERE id = $1',
      [req.user!.id]
    );
    const u = rows[0] || { xp_streak: 0, best_xp_streak: 0, last_xp_date: null };
    res.json({
      streak: u.xp_streak ?? 0,
      best: u.best_xp_streak ?? 0,
      lastDate: u.last_xp_date,
      // Next streak milestone bonus
      nextMilestone: (u.xp_streak ?? 0) < 7 ? 7 : (u.xp_streak ?? 0) < 30 ? 30 : null,
    });
  })
);

/** Get currently active XP multipliers */
router.get(
  '/multipliers',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, name, description, multiplier, starts_at, ends_at
       FROM xp_multipliers
       WHERE starts_at <= now() AND (ends_at IS NULL OR ends_at > now())
         AND (user_id IS NULL OR user_id = $1)
       ORDER BY multiplier DESC`,
      [req.user!.id]
    );
    const { multiplier } = await getActiveMultiplier(req.user!.id);
    res.json({
      active: rows,
      currentMultiplier: multiplier,
      currentName: multiplier > 1 ? `${multiplier}x XP Event` : 'Standard',
    });
  })
);

/** Get user's milestone progress */
router.get(
  '/milestones',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: u } = await pool.query('SELECT xp FROM users WHERE id = $1', [req.user!.id]);
    const xp = Number(u[0]?.xp || 0);
    const { rows: claimed } = await pool.query(
      'SELECT milestone_xp FROM user_xp_milestones WHERE user_id = $1',
      [req.user!.id]
    );
    const claimedSet = new Set(claimed.map((r) => Number(r.milestone_xp)));
    const milestones = XP_MILESTONES.map((m) => ({
      xp: m,
      hit: xp >= m,
      claimed: claimedSet.has(m),
      progress: Math.min(1, xp / m),
    }));
    // Next milestone
    const next = XP_MILESTONES.find((m) => xp < m) || null;
    res.json({ xp, milestones, next });
  })
);

/**
 * XP leaderboard by time period.
 * ?period=daily|weekly|monthly|alltime (default: weekly)
 * Daily = today, Weekly = last 7 days, Monthly = last 30 days, Alltime = total XP
 */
router.get(
  '/leaderboard',
  requireAuth,
  asyncHandler(async (req, res) => {
    const period = (req.query.period as string) || 'weekly';
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    let leaders: any[] = [];
    if (period === 'alltime') {
      const { rows } = await pool.query(
        `SELECT id, username, display_name, level, xp, profile_color
         FROM users WHERE xp > 0
         ORDER BY xp DESC LIMIT $1`,
        [limit]
      );
      leaders = rows.map((r) => ({
        id: r.id,
        username: r.username,
        displayName: r.display_name,
        level: r.level,
        xp: Number(r.xp),
        periodXp: Number(r.xp),
        profileColor: r.profile_color,
      }));
    } else {
      const days = period === 'daily' ? 1 : period === 'monthly' ? 30 : 7;
      const { rows } = await pool.query(
        `SELECT u.id, u.username, u.display_name, u.level, u.profile_color,
                COALESCE(SUM(l.amount), 0)::int AS period_xp
         FROM users u
         LEFT JOIN xp_ledger l ON l.user_id = u.id
           AND l.created_at > now() - ($1 || ' days')::interval
         GROUP BY u.id
         HAVING COALESCE(SUM(l.amount), 0) > 0
         ORDER BY period_xp DESC
         LIMIT $2`,
        [days, limit]
      );
      leaders = rows.map((r) => ({
        id: r.id,
        username: r.username,
        displayName: r.display_name,
        level: r.level,
        xp: 0, // not needed for period view
        periodXp: Number(r.period_xp),
        profileColor: r.profile_color,
      }));
    }

    // Find current user's rank in this period
    const meId = req.user!.id;
    const myEntry = leaders.findIndex((l) => l.id === meId);
    res.json({
      period,
      leaders,
      myRank: myEntry >= 0 ? myEntry + 1 : null,
    });
  })
);

/** Check if user has already gotten first-win-of-day bonus today */
router.get(
  '/first-win',
  requireAuth,
  asyncHandler(async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const { rows } = await pool.query(
      `SELECT id FROM xp_ledger
       WHERE user_id = $1 AND reason = 'first_win_of_day'
       AND created_at::date = $2::date LIMIT 1`,
      [req.user!.id, today]
    );
    res.json({ claimed: rows.length > 0 });
  })
);

export default router;
