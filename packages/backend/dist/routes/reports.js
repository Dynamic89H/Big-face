"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const createReportSchema = zod_1.z.object({
    targetType: zod_1.z.enum(['user', 'message', 'media']),
    targetId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().min(1).max(1000),
});
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const body = createReportSchema.parse(req.body);
    const { rows } = await db_1.pool.query(`INSERT INTO reports (reporter_id, target_type, target_id, reason)
       VALUES ($1, $2, $3, $4) RETURNING *`, [req.user.id, body.targetType, body.targetId, body.reason]);
    const r = rows[0];
    res.status(201).json({
        report: {
            id: String(r.id),
            reporterId: String(r.reporter_id),
            targetType: r.target_type,
            targetId: String(r.target_id),
            reason: r.reason,
            status: r.status,
            createdAt: new Date(r.created_at).toISOString(),
        },
    });
}));
exports.default = router;
