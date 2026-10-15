"use strict";
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
