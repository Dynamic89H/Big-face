import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { createTokenPackPaymentIntent, confirmTokenPurchase } from '../services/stripe';
import { getBalance } from '../services/tokens';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const balance = await getBalance(req.user!.id);
    const { rows } = await pool.query(
      `SELECT id, amount, kind, reference, created_at
       FROM token_transactions WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [req.user!.id]
    );
    res.json({
      balance,
      transactions: rows.map((t) => ({
        id: String(t.id),
        amount: Number(t.amount),
        kind: t.kind,
        reference: t.reference,
        createdAt: new Date(t.created_at).toISOString(),
      })),
    });
  })
);

const purchaseSchema = z.object({
  packId: z.enum(['starter', 'popular', 'whale']),
});

router.post(
  '/purchase',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { packId } = purchaseSchema.parse(req.body);
    const { clientSecret, paymentIntentId } = await createTokenPackPaymentIntent(
      req.user!.id,
      packId
    );
    res.json({ clientSecret, paymentIntentId });
  })
);

const confirmSchema = z.object({ paymentIntentId: z.string().min(1) });

router.post(
  '/confirm',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { paymentIntentId } = confirmSchema.parse(req.body);
    const balance = await confirmTokenPurchase(req.user!.id, paymentIntentId);
    res.json({ balance });
  })
);

export default router;
