import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';

const router = Router();

const BOOSTS: Record<string, { cost: number; label: string }> = {
  xp_2x_1h: { cost: 500, label: '2X XP Boost (1 hour)' },
  profile_featured: { cost: 1000, label: 'Featured Profile (24h)' },
  gold_name: { cost: 2000, label: 'Gold Name (7 days)' },
};

const buySchema = z.object({ boostId: z.string() });

router.post(
  '/boost',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { boostId } = buySchema.parse(req.body);
    const boost = BOOSTS[boostId];
    if (!boost) throw new HttpError(400, 'Unknown boost');

    // Check balance
    const { rows: user } = await pool.query(
      'SELECT token_balance FROM users WHERE id = $1',
      [req.user!.id]
    );
    if (Number(user[0].token_balance) < boost.cost) {
      throw new HttpError(400, 'Not enough tokens');
    }

    // Deduct tokens
    await addTokens(req.user!.id, -boost.cost, 'bonus', { reference: `boost:${boostId}` });

    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(req.user!.id, boost.cost, 'shop').catch(() => undefined);

    // Record the boost purchase
    const expiresAt = new Date();
    if (boostId === 'xp_2x_1h') expiresAt.setHours(expiresAt.getHours() + 1);
    else if (boostId === 'profile_featured') expiresAt.setHours(expiresAt.getHours() + 24);
    else if (boostId === 'gold_name') expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      `INSERT INTO user_boosts (user_id, boost_id, expires_at) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, boost_id) DO UPDATE SET expires_at = $3, purchased_at = now()`,
      [req.user!.id, boostId, expiresAt]
    );

    res.json({ ok: true, label: boost.label, expiresAt: expiresAt.toISOString() });
  })
);

// Check active boosts
router.get(
  '/boosts/active',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT boost_id, expires_at FROM user_boosts
       WHERE user_id = $1 AND expires_at > now()`,
      [req.user!.id]
    );
    res.json({ boosts: rows });
  })
);

export default router;
