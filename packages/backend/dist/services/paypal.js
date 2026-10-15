"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutPlatformEarnings = payoutPlatformEarnings;
exports.pendingPlatformTotal = pendingPlatformTotal;
/**
 * PayPal Payouts — sends accumulated platform earnings (the 30% cut)
 * to the platform owner's PayPal account.
 *
 * Env required:
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_OWNER_EMAIL
 *   PAYPAL_MODE = 'sandbox' | 'live' (default sandbox)
 */
const db_1 = require("../db");
const MODE = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
const BASE = MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
async function getAccessToken() {
    const id = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!id || !secret)
        return null;
    const res = await fetch(`${BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
        console.warn('[paypal] token request failed:', res.status);
        return null;
    }
    const data = (await res.json());
    return data.access_token ?? null;
}
/**
 * Sends all pending platform earnings to the owner's PayPal in one batch.
 * Marks each earning row as sent with the PayPal batch id.
 */
async function payoutPlatformEarnings() {
    const ownerEmail = process.env.PAYPAL_OWNER_EMAIL;
    if (!ownerEmail)
        return { ok: false, note: 'PAYPAL_OWNER_EMAIL is not set' };
    const { rows } = await db_1.pool.query(`SELECT id, platform_cents FROM platform_earnings WHERE paypal_status = 'pending'`);
    if (!rows.length)
        return { ok: false, note: 'No pending platform earnings' };
    const totalCents = rows.reduce((s, r) => s + Number(r.platform_cents), 0);
    if (totalCents <= 0)
        return { ok: false, note: 'Nothing to pay out' };
    const token = await getAccessToken();
    if (!token)
        return { ok: false, note: 'PayPal is not configured (missing client id/secret)' };
    const batchId = `bigface-${Date.now()}`;
    const res = await fetch(`${BASE}/v1/payments/payouts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sender_batch_header: {
                sender_batch_id: batchId,
                email_subject: 'Big Face platform earnings',
            },
            items: [
                {
                    recipient_type: 'EMAIL',
                    amount: { value: (totalCents / 100).toFixed(2), currency: 'USD' },
                    receiver: ownerEmail,
                    note: `Big Face 30% platform share — ${rows.length} payout(s)`,
                    sender_item_id: batchId,
                },
            ],
        }),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.warn('[paypal] payout failed:', res.status, text.slice(0, 200));
        await db_1.pool.query(`UPDATE platform_earnings SET paypal_status = 'failed' WHERE paypal_status = 'pending'`);
        return { ok: false, note: `PayPal payout failed (${res.status})` };
    }
    const data = (await res.json());
    const paypalBatchId = data.batch_header?.payout_batch_id ?? batchId;
    await db_1.pool.query(`UPDATE platform_earnings SET paypal_status = 'sent', paypal_batch_id = $1 WHERE paypal_status = 'pending'`, [paypalBatchId]);
    return { ok: true, batchId: paypalBatchId, totalCents };
}
/** Total platform earnings awaiting PayPal payout. */
async function pendingPlatformTotal() {
    const { rows } = await db_1.pool.query(`SELECT COALESCE(SUM(platform_cents), 0)::int AS total FROM platform_earnings WHERE paypal_status = 'pending'`);
    return Number(rows[0].total);
}
