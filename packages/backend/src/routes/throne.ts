import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { tierForLevel, xpForLevel } from '../services/xp';
import { getLatestLegendary } from '../services/legendary';

const router = Router();

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT xp, level,
              (SELECT COUNT(*)::int + 1 FROM users WHERE xp > u.xp) AS rank
       FROM users u WHERE u.id = $1`,
      [me]
    );
    const xp = Number(rows[0].xp);
    const level = Number(rows[0].level);
    res.json({
      level,
      tier: tierForLevel(level),
      xp,
      xpForNext: xpForLevel(level + 1) - xp,
      rank: rows[0].rank,
    });
  })
);

router.get(
  '/legendary',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await getLatestLegendary());
  })
);

export default router;
