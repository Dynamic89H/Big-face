import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
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

// Payout history — full transparency, every payout with its status.
router.get(
  '/payouts',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, amount_cents, status, stripe_transfer_id, created_at
       FROM payouts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user!.id]
    );
    res.json({
      payouts: rows.map((r) => ({
        id: String(r.id),
        amountCents: Number(r.amount_cents),
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      })),
    });
  })
);

const autoPayoutSchema = z.object({
  enabled: z.boolean(),
  thresholdCents: z.number().int().min(1000).max(1000000).optional(), // min $10
});

// Auto-payout settings: money hits the account automatically when the threshold is reached.
router.post(
  '/auto-payout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { enabled, thresholdCents } = autoPayoutSchema.parse(req.body);
    const { rows: u } = await pool.query(
      'SELECT stripe_connect_account_id FROM users WHERE id = $1',
      [req.user!.id]
    );
    if (enabled && !u[0]?.stripe_connect_account_id) {
      throw new HttpError(400, 'Connect a payout account first before enabling auto-payout');
    }
    await pool.query(
      `UPDATE users SET auto_payout_enabled = $1,
        auto_payout_threshold_cents = COALESCE($2, auto_payout_threshold_cents)
       WHERE id = $3`,
      [enabled, thresholdCents ?? null, req.user!.id]
    );
    const { rows } = await pool.query(
      'SELECT auto_payout_enabled, auto_payout_threshold_cents FROM users WHERE id = $1',
      [req.user!.id]
    );
    res.json({
      autoPayoutEnabled: rows[0].auto_payout_enabled,
      autoPayoutThresholdCents: Number(rows[0].auto_payout_threshold_cents),
    });
  })
);

router.get(
  '/auto-payout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'SELECT auto_payout_enabled, auto_payout_threshold_cents FROM users WHERE id = $1',
      [req.user!.id]
    );
    res.json({
      autoPayoutEnabled: rows[0]?.auto_payout_enabled ?? false,
      autoPayoutThresholdCents: Number(rows[0]?.auto_payout_threshold_cents ?? 5000),
    });
  })
);

export default router;
