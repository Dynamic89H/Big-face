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

// Get user's challenges with progress
router.get(
  '/challenges',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: season } = await pool.query(
      `SELECT id FROM seasons WHERE status = 'active' LIMIT 1`
    );
    if (!season[0]) {
      res.json({ challenges: [] });
      return;
    }
    const { rows } = await pool.query(
      `SELECT sc.*, COALESCE(ucp.progress, 0) AS progress, COALESCE(ucp.completed, false) AS completed
       FROM season_challenges sc
       LEFT JOIN user_challenge_progress ucp
         ON ucp.challenge_id = sc.id AND ucp.user_id = $2
       WHERE sc.season_id = $1
       ORDER BY sc.challenge_type, sc.xp_reward DESC`,
      [season[0].id, req.user!.id]
    );
    res.json({ challenges: rows });
  })
);

// Track challenge progress (called from game actions)
export async function trackChallenge(
  userId: string,
  action: string
): Promise<void> {
  try {
    const { rows: season } = await pool.query(
      `SELECT id FROM seasons WHERE status = 'active' LIMIT 1`
    );
    if (!season[0]) return;

    // Find matching incomplete challenges
    const { rows: challenges } = await pool.query(
      `SELECT sc.id, sc.target_count, sc.xp_reward,
              COALESCE(ucp.progress, 0) AS progress
       FROM season_challenges sc
       LEFT JOIN user_challenge_progress ucp
         ON ucp.challenge_id = sc.id AND ucp.user_id = $2
       WHERE sc.season_id = $1 AND sc.action = $3
         AND COALESCE(ucp.completed, false) = false`,
      [season[0].id, userId, action]
    );

    for (const c of challenges) {
      const newProgress = c.progress + 1;
      const completed = newProgress >= c.target_count;
      await pool.query(
        `INSERT INTO user_challenge_progress (user_id, challenge_id, progress, completed, completed_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, challenge_id)
         DO UPDATE SET progress = $3, completed = $4, completed_at = $5`,
        [userId, c.id, newProgress, completed, completed ? new Date() : null]
      );
      if (completed) {
        // Award season XP bonus
        await pool.query(
          `INSERT INTO season_xp (season_id, user_id, xp) VALUES ($1, $2, $3)
           ON CONFLICT (season_id, user_id) DO UPDATE SET xp = season_xp.xp + $3`,
          [season[0].id, userId, c.xp_reward]
        );
      }
    }
  } catch {
    /* best-effort */
  }
}

export default router;
