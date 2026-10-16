import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { RANKS, rankForLevel, levelForXp } from '../services/xp';

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
    const currentRank = rankForLevel(level);
    const currentIndex = RANKS.indexOf(currentRank);
    const nextRank = RANKS[currentIndex + 1] || null;

    res.json({
      ranks: RANKS,
      current: currentRank,
      currentIndex,
      next: nextRank,
      level,
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
