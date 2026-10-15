"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const legendary_1 = require("../services/legendary");
const paypal_1 = require("../services/paypal");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
// Auto-payout processor — service-key auth (for cron), registered BEFORE the
// admin middleware below. Processes every user with auto-payout enabled whose
// token balance meets their threshold. Failures are logged, tokens stay put.
router.post('/process-auto-payouts', (0, util_1.asyncHandler)(async (req, res) => {
    const apiKey = req.header('x-admin-key');
    const expected = process.env.ADMIN_API_KEY;
    if (!expected || apiKey !== expected) {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const { createPayout } = await Promise.resolve().then(() => __importStar(require('../services/stripe')));
    const { rows: users } = await db_1.pool.query(`SELECT id, token_balance, auto_payout_threshold_cents
       FROM users
       WHERE auto_payout_enabled = true
         AND stripe_connect_account_id IS NOT NULL
         AND token_balance >= auto_payout_threshold_cents`);
    const results = [];
    for (const u of users) {
        const amountCents = Math.min(Number(u.token_balance), Number(u.auto_payout_threshold_cents));
        try {
            await createPayout(String(u.id), amountCents);
            results.push({ userId: String(u.id), ok: true });
        }
        catch (e) {
            results.push({ userId: String(u.id), ok: false, note: e?.message ?? 'unknown' });
        }
    }
    res.json({ processed: results.length, results });
}));
router.use(auth_1.requireAuth, auth_1.requireAdmin);
const crownWeekSchema = zod_1.z.object({
    weekStart: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'weekStart must be YYYY-MM-DD'),
});
/** Top user of a gender by (xp + profile likes received). */
async function topByGender(gender) {
    const { rows } = await db_1.pool.query(`SELECT u.*, COUNT(pl.id)::int AS like_count
     FROM users u
     LEFT JOIN profile_likes pl ON pl.liked_user_id = u.id
     WHERE u.gender = $1
     GROUP BY u.id
     ORDER BY (u.xp + COUNT(pl.id)) DESC
     LIMIT 1`, [gender]);
    return rows[0] ?? null;
}
router.post('/crown-week', (0, util_1.asyncHandler)(async (req, res) => {
    const { weekStart } = crownWeekSchema.parse(req.body);
    const king = await topByGender('male');
    const queen = await topByGender('female');
    const colorOfWeek = await (0, legendary_1.getColorOfWeek)();
    // Upsert so re-running a week corrects rather than duplicates.
    await db_1.pool.query(`INSERT INTO legendary_weeks (week_start, king_id, queen_id, color_of_week_user_id, announced_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (week_start) DO UPDATE SET
         king_id = EXCLUDED.king_id,
         queen_id = EXCLUDED.queen_id,
         color_of_week_user_id = EXCLUDED.color_of_week_user_id,
         announced_at = now()`, [
        weekStart,
        king ? king.id : null,
        queen ? queen.id : null,
        colorOfWeek.user ? colorOfWeek.user.id : null,
    ]);
    const result = {
        king: king ? (0, util_1.toUser)(king) : null,
        queen: queen ? (0, util_1.toUser)(queen) : null,
        colorOfWeek: colorOfWeek.user,
        weekStart,
    };
    // Red carpet moment for everyone connected.
    (0, sockets_1.emitToAll)('red:carpet', { king: result.king, queen: result.queen, weekStart });
    res.json({ result });
}));
router.get('/reports', (0, util_1.asyncHandler)(async (req, res) => {
    const status = req.query.status;
    const allowed = ['open', 'reviewed', 'actioned', 'dismissed'];
    const values = [];
    let where = '';
    if (status) {
        if (!allowed.includes(status))
            throw new util_1.HttpError(400, `Invalid status: ${status}`);
        values.push(status);
        where = 'WHERE r.status = $1';
    }
    const { rows } = await db_1.pool.query(`SELECT r.*, to_jsonb(u) AS reporter
       FROM reports r LEFT JOIN users u ON u.id = r.reporter_id
       ${where} ORDER BY r.created_at DESC LIMIT 200`, values);
    res.json({
        reports: rows.map((r) => ({
            id: String(r.id),
            reporter: r.reporter ? (0, util_1.toUser)(r.reporter) : null,
            targetType: r.target_type,
            targetId: String(r.target_id),
            reason: r.reason,
            status: r.status,
            createdAt: new Date(r.created_at).toISOString(),
        })),
    });
}));
exports.default = router;
// ---- Platform revenue share ----
router.get('/platform-earnings', (0, util_1.asyncHandler)(async (req, res) => {
    const pending = await (0, paypal_1.pendingPlatformTotal)();
    const { rows } = await db_1.pool.query(`SELECT COALESCE(SUM(platform_cents), 0)::int AS lifetime FROM platform_earnings`);
    res.json({ pendingCents: pending, lifetimeCents: Number(rows[0].lifetime) });
}));
router.post('/platform-payout', (0, util_1.asyncHandler)(async (req, res) => {
    const result = await (0, paypal_1.payoutPlatformEarnings)();
    if (!result.ok)
        return res.status(400).json({ error: result.note });
    res.json({ batchId: result.batchId, totalCents: result.totalCents });
}));
