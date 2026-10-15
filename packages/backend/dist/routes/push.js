"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const push_1 = require("../services/push");
const router = (0, express_1.Router)();
// Get VAPID public key for subscription.
router.get('/vapid-key', (_req, res) => {
    res.json({ publicKey: (0, push_1.getVapidPublicKey)() });
});
// Subscribe a device for push notifications.
router.post('/subscribe', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { endpoint, p256dh, auth, lang } = zod_1.z.object({
        endpoint: zod_1.z.string().url(),
        p256dh: zod_1.z.string(),
        auth: zod_1.z.string(),
        lang: zod_1.z.string().optional(),
    }).parse(req.body);
    await db_1.pool.query(`INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE SET user_id = $1, p256dh = $3, auth = $4`, [req.user.id, endpoint, p256dh, auth]);
    // Save user's language for localized notifications.
    if (lang) {
        await db_1.pool.query('UPDATE users SET preferred_lang = $1 WHERE id = $2', [lang, req.user.id]);
    }
    res.json({ ok: true });
}));
// Unsubscribe a device.
router.post('/unsubscribe', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { endpoint } = zod_1.z.object({ endpoint: zod_1.z.string() }).parse(req.body);
    await db_1.pool.query('DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2', [req.user.id, endpoint]);
    res.json({ ok: true });
}));
// Test notification (for the user to verify it works).
router.post('/test', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const sent = await (0, push_1.pushToUser)(req.user.id, {
        title: '👑 Big Face',
        body: 'Notifications are on! You\'ll hear from us every day.',
        url: '/',
    });
    res.json({ ok: true, sent });
}));
exports.default = router;
