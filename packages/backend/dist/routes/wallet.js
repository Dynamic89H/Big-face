"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const stripe_1 = require("../services/stripe");
const tokens_1 = require("../services/tokens");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const balance = await (0, tokens_1.getBalance)(req.user.id);
    const { rows } = await db_1.pool.query(`SELECT id, amount, kind, reference, created_at
       FROM token_transactions WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`, [req.user.id]);
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
}));
const purchaseSchema = zod_1.z.object({
    packId: zod_1.z.enum(['starter', 'popular', 'whale']),
});
router.post('/purchase', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { packId } = purchaseSchema.parse(req.body);
    const { clientSecret, paymentIntentId } = await (0, stripe_1.createTokenPackPaymentIntent)(req.user.id, packId);
    res.json({ clientSecret, paymentIntentId });
}));
const confirmSchema = zod_1.z.object({ paymentIntentId: zod_1.z.string().min(1) });
router.post('/confirm', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { paymentIntentId } = confirmSchema.parse(req.body);
    const balance = await (0, stripe_1.confirmTokenPurchase)(req.user.id, paymentIntentId);
    res.json({ balance });
}));
exports.default = router;
