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
    const { rows: u } = await db_1.pool.query('SELECT token_balance FROM users WHERE id = $1', [me]);
    const { rows: e } = await db_1.pool.query(`SELECT COALESCE(SUM(amount), 0)::int AS earned
       FROM token_transactions
       WHERE user_id = $1 AND amount > 0 AND kind IN ('gift_received', 'bonus')`, [me]);
    const { rows: g } = await db_1.pool.query('SELECT COUNT(*)::int AS c FROM gifts WHERE receiver_id = $1', [me]);
    const { rows: p } = await db_1.pool.query(`SELECT COALESCE(SUM(amount_cents), 0)::int AS total
       FROM payouts WHERE user_id = $1 AND status = 'paid'`, [me]);
    res.json({
        tokenBalance: Number(u[0].token_balance),
        earnedTokens: e[0].earned,
        giftsReceived: g[0].c,
        payoutsTotal: p[0].total,
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
exports.default = router;
