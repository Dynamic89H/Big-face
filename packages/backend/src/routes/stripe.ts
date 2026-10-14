import { Router } from 'express';
import { asyncHandler } from '../util';
import { handleWebhook } from '../services/stripe';

const router = Router();

/**
 * Stripe webhook endpoint. Must receive the RAW request body (mounted in
 * index.ts with express.raw before express.json), otherwise signature
 * verification fails. No auth — Stripe signs the payload instead.
 */
router.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'] as string | undefined;
    const result = await handleWebhook(req.body as Buffer, signature);
    res.json(result);
  })
);

export default router;
