import Stripe from 'stripe';
import { config } from '../config';
import { pool } from '../db';
import { HttpError } from '../util';
import { addTokens } from './tokens';
import { recordPlatformRevenue } from './platformRevenue';

/** Token packs from API_CONTRACT.md: packId -> { tokens, price in cents }. */
export const TOKEN_PACKS = {
  starter: { tokens: 100, amountCents: 99, label: 'Starter Pack' },
  popular: { tokens: 550, amountCents: 499, label: 'Popular Pack' },
  whale: { tokens: 1200, amountCents: 999, label: 'Whale Pack' },
} as const;
export type TokenPackId = keyof typeof TOKEN_PACKS;

let stripe: Stripe | null = null;
let warnedMissingKey = false;

/**
 * Lazily initialized so the app boots and runs fine without Stripe keys
 * (dev/test). Every public function throws 503 when Stripe is unavailable.
 */
function getStripe(): Stripe | null {
  if (!config.stripeSecretKey) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn('[stripe] STRIPE_SECRET_KEY is not set — Stripe features are disabled.');
    }
    return null;
  }
  if (!stripe) stripe = new Stripe(config.stripeSecretKey);
  return stripe;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

/** Creates a PaymentIntent for a token pack; the client confirms it with Stripe.js. */
export async function createTokenPackPaymentIntent(
  userId: string,
  packId: string
): Promise<PaymentIntentResult> {
  const pack = (TOKEN_PACKS as Record<string, { tokens: number; amountCents: number; label: string }>)[
    packId
  ];
  if (!pack) throw new HttpError(400, `Unknown token pack: ${packId}`);
  const client = getStripe();
  if (!client) throw new HttpError(503, 'Payments are not configured');

  const { rows } = await pool.query('SELECT stripe_customer_id, email FROM users WHERE id = $1', [
    userId,
  ]);
  if (!rows.length) throw new HttpError(404, 'User not found');

  let customerId = rows[0].stripe_customer_id as string | null;
  if (!customerId) {
    // TODO(prod): set proper billing/shipping defaults and tax behavior per region.
    const customer = await client.customers.create({
      email: rows[0].email,
      metadata: { userId },
    });
    customerId = customer.id;
    await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, userId]);
  }

  // TODO(prod): add idempotency keys on retries and statement descriptors for clarity.
  const pi = await client.paymentIntents.create({
    amount: pack.amountCents,
    currency: 'usd',
    customer: customerId,
    metadata: { userId, packId, tokens: String(pack.tokens) },
    automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
  });
  if (!pi.client_secret) throw new HttpError(500, 'Stripe did not return a client secret');
  return { clientSecret: pi.client_secret, paymentIntentId: pi.id };
}

/**
 * Verifies the webhook signature and credits tokens on payment_intent.succeeded.
 * Idempotent: a payment intent already present in token_transactions is skipped,
 * so webhook retries and the manual /wallet/confirm endpoint can't double-credit.
 */
export async function handleWebhook(
  rawBody: Buffer,
  signature: string | undefined
): Promise<{ received: boolean; type: string }> {
  const client = getStripe();
  if (!client) throw new HttpError(503, 'Payments are not configured');
  if (!config.stripeWebhookSecret) throw new HttpError(500, 'Stripe webhook secret is not configured');
  if (!signature) throw new HttpError(400, 'Missing Stripe signature');

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
  } catch {
    throw new HttpError(400, 'Webhook signature verification failed');
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    const userId = pi.metadata?.userId;
    const packId = pi.metadata?.packId ?? 'unknown';
    const tokens = parseInt(pi.metadata?.tokens ?? '0', 10);
    if (userId && tokens > 0) {
      const existing = await pool.query(
        'SELECT id FROM token_transactions WHERE stripe_payment_intent_id = $1 LIMIT 1',
        [pi.id]
      );
      if (!existing.rows.length) {
        await addTokens(userId, tokens, 'purchase', {
          reference: `pack:${packId}`,
          stripePaymentIntentId: pi.id,
        });
        console.log(`[stripe] credited ${tokens} tokens to ${userId} (pi ${pi.id})`);
      } else {
        console.log(`[stripe] duplicate webhook for pi ${pi.id} — already credited, skipping`);
      }
    } else {
      console.warn(`[stripe] payment_intent.succeeded ${pi.id} missing metadata; not credited`);
    }
  }

  return { received: true, type: event.type };
}

/**
 * Manual confirmation path: verifies the PaymentIntent with Stripe, then credits
 * tokens. Idempotent — the same payment_intent id can never credit twice, so this
 * is safe to call alongside the webhook.
 */
export async function confirmTokenPurchase(
  userId: string,
  paymentIntentId: string
): Promise<number> {
  const client = getStripe();
  if (!client) throw new HttpError(503, 'Payments are not configured');

  const pi = await client.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== 'succeeded') throw new HttpError(400, 'Payment has not completed');
  if (pi.metadata?.userId !== userId) throw new HttpError(403, 'Payment belongs to another user');

  const existing = await pool.query(
    'SELECT id FROM token_transactions WHERE stripe_payment_intent_id = $1 LIMIT 1',
    [pi.id]
  );
  if (existing.rows.length) {
    const { rows } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [userId]);
    return Number(rows[0].token_balance);
  }
  const tokens = parseInt(pi.metadata?.tokens ?? '0', 10);
  if (!tokens || tokens <= 0) throw new HttpError(400, 'Payment has no token amount');

  // Dweezy gets 100% of token pack sales (minus Stripe's cut) — recorded.
  const packCents = pi.amount_received ?? pi.amount ?? 0;
  await recordPlatformRevenue('token_purchase', packCents, {
    userId,
    reference: `pack:${pi.metadata?.packId ?? 'unknown'}:${pi.id}`,
    grossCents: packCents,
  });

  return addTokens(userId, tokens, 'purchase', {
    reference: `pack:${pi.metadata?.packId ?? 'unknown'}`,
    stripePaymentIntentId: pi.id,
  });
}

/** Exposed for the wallet confirm endpoint; null when Stripe is not configured. */
export function getStripePublic(): Stripe | null {
  return getStripe();
}

/**
 * Creates (if needed) a Stripe Connect Express account for payouts and returns
 * an onboarding link. The account id is stored on the user.
 */
export async function createConnectOnboardingLink(userId: string): Promise<{ onboardingUrl: string }> {
  const client = getStripe();
  if (!client) throw new HttpError(503, 'Payments are not configured');

  const { rows } = await pool.query(
    'SELECT stripe_connect_account_id, email FROM users WHERE id = $1',
    [userId]
  );
  if (!rows.length) throw new HttpError(404, 'User not found');

  let accountId = rows[0].stripe_connect_account_id as string | null;
  if (!accountId) {
    // TODO(prod): collect the user's country during onboarding instead of assuming US,
    // and set business_type / TOS acceptance per compliance review.
    const account = await client.accounts.create({
      type: 'express',
      country: 'US',
      email: rows[0].email,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      metadata: { userId },
    });
    accountId = account.id;
    await pool.query('UPDATE users SET stripe_connect_account_id = $1 WHERE id = $2', [
      accountId,
      userId,
    ]);
  }

  // TODO(prod): point these at real frontend routes and handle the refresh flow UX.
  const returnUrl = `${config.frontendUrl}/earnings?connect=done`;
  const refreshUrl = `${config.frontendUrl}/earnings?connect=refresh`;
  const link = await client.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });
  return { onboardingUrl: link.url };
}

export interface PayoutResult {
  payout: {
    id: string;
    userId: string;
    amountCents: number;
    status: string;
    stripeTransferId: string | null;
    createdAt: string;
  };
  transferred: boolean;
  note?: string;
}

/** 100 tokens = $1.00, minimum payout $10.00. */
const MIN_PAYOUT_CENTS = 1000;

/**
 * Requests a payout: debits tokens (ledger row included), records the payout,
 * then attempts a Stripe transfer to the user's Connect account.
 * On transfer failure the payout is marked failed AND the tokens are refunded —
 * the debit is never lost.
 */
export async function createPayout(userId: string, amountCents: number): Promise<PayoutResult> {
  if (!Number.isInteger(amountCents) || amountCents < MIN_PAYOUT_CENTS) {
    throw new HttpError(400, 'Minimum payout is $10.00');
  }
  // 100 tokens = $1.00 = 100¢, so tokens owed == cents owed.
  const tokensNeeded = amountCents;

  const db = await pool.connect();
  let payoutRow: any;
  try {
    await db.query('BEGIN');
    const userRes = await db.query(
      'SELECT token_balance, stripe_connect_account_id FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );
    if (!userRes.rows.length) throw new HttpError(404, 'User not found');
    if (Number(userRes.rows[0].token_balance) < tokensNeeded) {
      throw new HttpError(400, 'Insufficient token balance');
    }
    const connectAccountId = userRes.rows[0].stripe_connect_account_id as string | null;

    await addTokens(userId, -tokensNeeded, 'payout', { client: db });
    // 30% platform fee — creator gets 70%.
    const platformCents = Math.round((amountCents * 30) / 100);
    const creatorCents = amountCents - platformCents;
    const inserted = await db.query(
      `INSERT INTO payouts (user_id, amount_cents, status) VALUES ($1, $2, 'pending') RETURNING *`,
      [userId, creatorCents]
    );
    payoutRow = inserted.rows[0];
    await db.query(
      `INSERT INTO platform_earnings (payout_id, user_id, gross_cents, platform_cents, creator_cents)
       VALUES ($1, $2, $3, $4, $5)`,
      [payoutRow.id, userId, amountCents, platformCents, creatorCents]
    );
    await db.query('COMMIT');

    // Also log to unified revenue ledger — Dweezy's 30% on every payout.
    await recordPlatformRevenue('payout_fee', platformCents, {
      userId,
      reference: `payout:${payoutRow.id}`,
      grossCents: amountCents,
    });

    const shape = () => ({
      id: String(payoutRow.id),
      userId: String(payoutRow.user_id),
      amountCents: Number(payoutRow.amount_cents),
      status: payoutRow.status as string,
      stripeTransferId: (payoutRow.stripe_transfer_id as string | null) ?? null,
      createdAt: new Date(payoutRow.created_at).toISOString(),
    });

    const fail = async (note: string): Promise<PayoutResult> => {
      // Mark failed and refund the debited tokens — the user never loses money silently.
      await pool.query(`UPDATE payouts SET status = 'failed' WHERE id = $1`, [payoutRow.id]);
      await addTokens(userId, tokensNeeded, 'bonus', { reference: `payout_refund:${payoutRow.id}` });
      payoutRow.status = 'failed';
      console.warn(`[stripe] payout ${payoutRow.id} failed: ${note} (tokens refunded)`);
      return { payout: shape(), transferred: false, note };
    };

    const client = getStripe();
    if (!client) return fail('Stripe is not configured');
    if (!connectAccountId) return fail('No Stripe Connect account — complete onboarding first');

    try {
      // TODO(prod): use a real destination (bank/debit) with proper currency handling,
      // idempotency keys, and transfer grouping for reconciliation.
      const transfer = await client.transfers.create({
        amount: creatorCents,
        currency: 'usd',
        destination: connectAccountId,
        metadata: { userId, payoutId: String(payoutRow.id), platformFeeCents: String(platformCents) },
      });
      await pool.query(`UPDATE payouts SET status = 'paid', stripe_transfer_id = $1 WHERE id = $2`, [
        transfer.id,
        payoutRow.id,
      ]);
      payoutRow.status = 'paid';
      payoutRow.stripe_transfer_id = transfer.id;
      return { payout: shape(), transferred: true };
    } catch (err: any) {
      return fail(`Stripe transfer failed: ${err?.message ?? 'unknown error'}`);
    }
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  } finally {
    db.release();
  }
}
