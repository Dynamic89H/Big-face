"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const util_1 = require("../util");
const stripe_1 = require("../services/stripe");
const router = (0, express_1.Router)();
/**
 * Stripe webhook endpoint. Must receive the RAW request body (mounted in
 * index.ts with express.raw before express.json), otherwise signature
 * verification fails. No auth — Stripe signs the payload instead.
 */
router.post('/webhook', (0, util_1.asyncHandler)(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const result = await (0, stripe_1.handleWebhook)(req.body, signature);
    res.json(result);
}));
exports.default = router;
