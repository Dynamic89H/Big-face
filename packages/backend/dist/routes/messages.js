"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const messages_1 = require("../services/messages");
const xp_1 = require("../services/xp");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
async function requireMember(roomId, userId) {
    const mem = await db_1.pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
        roomId,
        userId,
    ]);
    if (!mem.rows.length)
        throw new util_1.HttpError(403, 'Not a member of this room');
}
async function roomOfMessage(messageId) {
    const { rows } = await db_1.pool.query('SELECT room_id FROM messages WHERE id = $1', [messageId]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Message not found');
    return rows[0].room_id;
}
const attachmentSchema = zod_1.z.object({
    url: zod_1.z.string().min(1).max(2000),
    name: zod_1.z.string().max(255),
    mime: zod_1.z.string().max(128),
    size: zod_1.z.number().int().nonnegative(),
});
router.get('/rooms/:id/messages', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await requireMember(req.params.id, req.user.id);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10) || 50, 1), 100);
    const before = req.query.before;
    const values = [req.params.id, limit];
    let beforeClause = '';
    if (before) {
        const cursor = new Date(before);
        if (Number.isNaN(cursor.getTime()))
            throw new util_1.HttpError(400, 'Invalid before cursor');
        values.push(cursor.toISOString());
        beforeClause = 'AND m.created_at < $3';
    }
    const { rows } = await db_1.pool.query(`SELECT m.*, to_jsonb(u) AS sender
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.room_id = $1 ${beforeClause}
       ORDER BY m.created_at DESC LIMIT $2`, values);
    res.json({ messages: await (0, messages_1.shapeMessages)(rows, req.user.id) });
}));
const sendMessageSchema = zod_1.z.object({
    body: zod_1.z.string().max(5000).optional(),
    attachments: zod_1.z.array(attachmentSchema).max(10).optional(),
});
router.post('/rooms/:id/messages', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const parsed = sendMessageSchema.parse(req.body);
    const message = await (0, messages_1.createMessage)({
        roomId: req.params.id,
        senderId: req.user.id,
        body: parsed.body,
        attachments: parsed.attachments,
    });
    // Message sent: +5 XP.
    const xpRes = await (0, xp_1.awardXp)(req.user.id, 5, 'message sent');
    (0, sockets_1.emitToRoom)(req.params.id, 'message:new', { message });
    (0, sockets_1.maybeEmitRankUp)(req.user.id, xpRes);
    res.status(201).json({ message });
}));
router.post('/rooms/:id/read', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await requireMember(req.params.id, req.user.id);
    await db_1.pool.query('UPDATE room_members SET last_read_at = now() WHERE room_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.status(204).end();
}));
const reactionSchema = zod_1.z.object({ emoji: zod_1.z.string().min(1).max(16) });
router.post('/messages/:id/reactions', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { emoji } = reactionSchema.parse(req.body);
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user.id);
    const inserted = await db_1.pool.query(`INSERT INTO message_reactions (message_id, user_id, emoji) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING message_id`, [messageId, req.user.id, emoji]);
    if (inserted.rows.length) {
        // Reaction received: +2 XP to the message author (not for self-reactions).
        const { rows } = await db_1.pool.query('SELECT sender_id FROM messages WHERE id = $1', [messageId]);
        const senderId = rows[0].sender_id;
        if (senderId !== req.user.id) {
            (0, sockets_1.maybeEmitRankUp)(senderId, await (0, xp_1.awardXp)(senderId, 2, 'reaction received'));
        }
        (0, sockets_1.emitToRoom)(roomId, 'message:reaction', {
            messageId,
            emoji,
            userId: req.user.id,
            action: 'added',
        });
    }
    res.json({ ok: true });
}));
router.delete('/messages/:id/reactions/:emoji', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user.id);
    const deleted = await db_1.pool.query('DELETE FROM message_reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3', [messageId, req.user.id, req.params.emoji]);
    if (deleted.rowCount) {
        (0, sockets_1.emitToRoom)(roomId, 'message:reaction', {
            messageId,
            emoji: req.params.emoji,
            userId: req.user.id,
            action: 'removed',
        });
    }
    res.status(204).end();
}));
router.post('/messages/:id/read', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user.id);
    await db_1.pool.query('INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [messageId, req.user.id]);
    (0, sockets_1.emitToRoom)(roomId, 'read:update', { messageId, userId: req.user.id });
    res.status(204).end();
}));
exports.default = router;
