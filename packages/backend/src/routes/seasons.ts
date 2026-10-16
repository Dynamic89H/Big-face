import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';

const router = Router();

/** Get active season */
async function getActiveSeason() {
  const { rows } = await pool.query(
    `SELECT * FROM seasons WHERE status = 'active' ORDER BY starts_at DESC LIMIT 1`
  );
  return rows[0] || null;
}

// Current season info
router.get(
  '/current',
  requireAuth,
  asyncHandler(async (req, res) => {
    const season = await getActiveSeason();
    if (!season) {
      res.json({ season: null });
      return;
    }

    // User's season XP and rank
    const { rows: mine } = await pool.query(
      `SELECT xp FROM season_xp WHERE season_id = $1 AND user_id = $2`,
      [season.id, req.user!.id]
    );
    const { rows: rankRows } = await pool.query(
      `SELECT COUNT(*)::int + 1 AS rank FROM season_xp
       WHERE season_id = $1 AND xp > COALESCE((SELECT xp FROM season_xp WHERE season_id = $1 AND user_id = $2), 0)`,
      [season.id, req.user!.id]
    );

    // Season gifts
    const { rows: gifts } = await pool.query(
      `SELECT gift_key, gift_label, token_cost, emoji FROM season_gifts WHERE season_id = $1`,
      [season.id]
    );

    // Season rewards
    const { rows: rewards } = await pool.query(
      `SELECT rank_required, reward_type, reward_value, label FROM season_rewards
       WHERE season_id = $1 ORDER BY rank_required ASC`,
      [season.id]
    );

    // Top 10 leaderboard
    const { rows: leaders } = await pool.query(
      `SELECT u.display_name, u.username, sx.xp
       FROM season_xp sx JOIN users u ON u.id = sx.user_id
       WHERE sx.season_id = $1 ORDER BY sx.xp DESC LIMIT 10`,
      [season.id]
    );

    res.json({
      season: {
        id: season.id,
        name: season.name,
        theme: season.theme,
        endsAt: season.ends_at,
      },
      myXp: mine[0]?.xp || 0,
      myRank: rankRows[0]?.rank || null,
      gifts,
      rewards,
      leaders,
    });
  })
);

// Award season XP (called alongside regular XP)
export async function awardSeasonXp(userId: string, amount: number): Promise<void> {
  try {
    const season = await getActiveSeason();
    if (!season) return;
    await pool.query(
      `INSERT INTO season_xp (season_id, user_id, xp) VALUES ($1, $2, $3)
       ON CONFLICT (season_id, user_id) DO UPDATE SET xp = season_xp.xp + $3`,
      [season.id, userId, amount]
    );
  } catch {
    /* best-effort */
  }
}

export default router;
