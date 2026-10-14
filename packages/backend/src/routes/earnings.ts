import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { createConnectOnboardingLink, createPayout } from '../services/stripe';

const router = Router();

router.get(
  '/summary',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows: u } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [me]);
    const { rows: e } = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::int AS earned
       FROM token_transactions
       WHERE user_id = $1 AND amount > 0 AND kind IN ('gift_received', 'bonus')`,
      [me]
    );
    const { rows: g } = await pool.query(
      'SELECT COUNT(*)::int AS c FROM gifts WHERE receiver_id = $1',
      [me]
    );
    const { rows: p } = await pool.query(
      `SELECT COALESCE(SUM(amount_cents), 0)::int AS total
       FROM payouts WHERE user_id = $1 AND status = 'paid'`,
      [me]
    );
    res.json({
      tokenBalance: Number(u[0].token_balance),
      earnedTokens: e[0].earned,
      giftsReceived: g[0].c,
      payoutsTotal: p[0].total,
    });
  })
);

router.post(
  '/connect',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { onboardingUrl } = await createConnectOnboardingLink(req.user!.id);
    res.json({ onboardingUrl });
  })
);

const payoutSchema = z.object({
  amountCents: z.number().int().positive(), // 100 tokens = $1.00, min $10
});

router.post(
  '/payout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { amountCents } = payoutSchema.parse(req.body);
    const result = await createPayout(req.user!.id, amountCents);
    res.status(201).json({ payout: result.payout });
  })
);

export default router;
