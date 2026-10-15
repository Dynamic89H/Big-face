"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const stripe_1 = require("../services/stripe");
const router = (0, express_1.Router)();
router.get('/summary', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows: u } = await db_1.pool.query('SELECT token_balance, xp, level FROM users WHERE id = $1', [me]);
    const { rows: e } = await db_1.pool.query(`SELECT COALESCE(SUM(amount), 0)::int AS earned
       FROM token_transactions
       WHERE user_id = $1 AND amount > 0 AND kind IN ('gift_received', 'bonus', 'level_up_reward', 'track_tip_received')`, [me]);
    const { rows: g } = await db_1.pool.query('SELECT COUNT(*)::int AS c FROM gifts WHERE receiver_id = $1', [me]);
    const { rows: p } = await db_1.pool.query(`SELECT COALESCE(SUM(amount_cents), 0)::int AS total
       FROM payouts WHERE user_id = $1 AND status = 'paid'`, [me]);
    const { rows: lr } = await db_1.pool.query(`SELECT COALESCE(SUM(tokens_awarded), 0)::int AS total, MAX(level)::int AS max_level
       FROM level_rewards WHERE user_id = $1`, [me]);
    // Next level reward preview.
    const nextLevel = (u[0]?.level ?? 1) + 1;
    res.json({
        tokenBalance: Number(u[0].token_balance),
        xp: Number(u[0]?.xp ?? 0),
        level: Number(u[0]?.level ?? 1),
        earnedTokens: e[0].earned,
        giftsReceived: g[0].c,
        payoutsTotal: p[0].total,
        levelRewardsTotal: lr[0].total,
        nextLevelReward: nextLevel * 50,
        nextLevel,
    });
}));
router.post('/connect', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { onboardingUrl } = await (0, stripe_1.createConnectOnboardingLink)(req.user.id);
    res.json({ onboardingUrl });
}));
const payoutSchema = zod_1.z.object({
    amountCents: zod_1.z.number().int().positive(), // 100 tokens = $1.00, min $10
});
router.post('/payout', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { amountCents } = payoutSchema.parse(req.body);
    const result = await (0, stripe_1.createPayout)(req.user.id, amountCents);
    res.status(201).json({ payout: result.payout });
}));
// Payout history — full transparency, every payout with its status.
router.get('/payouts', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query(`SELECT id, amount_cents, status, stripe_transfer_id, created_at
       FROM payouts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [req.user.id]);
    res.json({
        payouts: rows.map((r) => ({
            id: String(r.id),
            amountCents: Number(r.amount_cents),
            status: r.status,
            createdAt: new Date(r.created_at).toISOString(),
        })),
    });
}));
const autoPayoutSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    thresholdCents: zod_1.z.number().int().min(1000).max(1000000).optional(), // min $10
});
// Auto-payout settings: money hits the account automatically when the threshold is reached.
router.post('/auto-payout', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { enabled, thresholdCents } = autoPayoutSchema.parse(req.body);
    const { rows: u } = await db_1.pool.query('SELECT stripe_connect_account_id FROM users WHERE id = $1', [req.user.id]);
    if (enabled && !u[0]?.stripe_connect_account_id) {
        throw new util_1.HttpError(400, 'Connect a payout account first before enabling auto-payout');
    }
    await db_1.pool.query(`UPDATE users SET auto_payout_enabled = $1,
        auto_payout_threshold_cents = COALESCE($2, auto_payout_threshold_cents)
       WHERE id = $3`, [enabled, thresholdCents ?? null, req.user.id]);
    const { rows } = await db_1.pool.query('SELECT auto_payout_enabled, auto_payout_threshold_cents FROM users WHERE id = $1', [req.user.id]);
    res.json({
        autoPayoutEnabled: rows[0].auto_payout_enabled,
        autoPayoutThresholdCents: Number(rows[0].auto_payout_threshold_cents),
    });
}));
router.get('/auto-payout', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('SELECT auto_payout_enabled, auto_payout_threshold_cents FROM users WHERE id = $1', [req.user.id]);
    res.json({
        autoPayoutEnabled: rows[0]?.auto_payout_enabled ?? false,
        autoPayoutThresholdCents: Number(rows[0]?.auto_payout_threshold_cents ?? 5000),
    });
}));
exports.default = router;
