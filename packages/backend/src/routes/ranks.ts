import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { RANKS, rankForLevel, levelForXp, xpForLevel } from '../services/xp';

const router = Router();

/** Get all ranks with user's current rank and progress */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT xp, level FROM users WHERE id = $1', [
      req.user!.id,
    ]);
    const level = rows[0]?.level || 1;
    const xp = Number(rows[0]?.xp || 0);
    const currentRank = rankForLevel(level);
    const currentIndex = RANKS.indexOf(currentRank);
    const nextRank = RANKS[currentIndex + 1] || null;

    // Progress to next rank
    let xpProgress = null;
    if (nextRank) {
      const xpNeeded = xpForLevel(nextRank.minLevel);
      const xpAtCurrent = xpForLevel(currentRank.minLevel);
      const total = xpNeeded - xpAtCurrent;
      const done = Math.max(0, xp - xpAtCurrent);
      xpProgress = {
        current: xp,
        needed: xpNeeded,
        remaining: Math.max(0, xpNeeded - xp),
        percent: total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 100,
      };
    }

    res.json({
      ranks: RANKS,
      current: currentRank,
      currentIndex,
      next: nextRank,
      level,
      xpProgress,
    });
  })
);

/** Get rank leaderboard — top users by rank/level */
router.get(
  '/leaderboard',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, username, display_name, level, xp, profile_color
       FROM users WHERE level > 1
       ORDER BY level DESC, xp DESC LIMIT 50`
    );
    const ranked = rows.map((u) => ({
      ...u,
      rank: rankForLevel(u.level),
    }));
    res.json({ leaders: ranked });
  })
);

export default router;
