"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/rooms/:id/video/start', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const mem = await db_1.pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
        req.params.id,
        req.user.id,
    ]);
    if (!mem.rows.length)
        throw new util_1.HttpError(403, 'Not a member of this room');
    const { rows } = await db_1.pool.query('INSERT INTO video_sessions (room_id, started_by) VALUES ($1, $2) RETURNING id', [req.params.id, req.user.id]);
    res.json({ sessionId: String(rows[0].id) });
}));
router.post('/video/sessions/:id/end', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('UPDATE video_sessions SET ended_at = now() WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Session not found');
    res.status(204).end();
}));
exports.default = router;
