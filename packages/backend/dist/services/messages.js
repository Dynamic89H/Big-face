"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shapeMessages = shapeMessages;
exports.createMessage = createMessage;
const db_1 = require("../db");
const util_1 = require("../util");
const moderation_1 = require("../middleware/moderation");
function iso(v) {
    return v == null ? new Date().toISOString() : new Date(v).toISOString();
}
/**
 * Shapes raw message rows (each must carry a `sender` JSON object) into the
 * contract's message shape, batch-loading reactions and read receipts.
 */
async function shapeMessages(rows, viewerId) {
    const ids = rows.map((r) => r.id);
    const reactionsByMsg = new Map();
    const readersByMsg = new Map();
    if (ids.length) {
        const { rows: reactions } = await db_1.pool.query(`SELECT message_id, emoji, COUNT(*)::int AS count, BOOL_OR(user_id = $2) AS reacted_by_me
       FROM message_reactions WHERE message_id = ANY($1)
       GROUP BY message_id, emoji`, [ids, viewerId]);
        for (const r of reactions) {
            const list = reactionsByMsg.get(r.message_id) ?? [];
            list.push({ emoji: r.emoji, count: r.count, reactedByMe: Boolean(r.reacted_by_me) });
            reactionsByMsg.set(r.message_id, list);
        }
        const { rows: reads } = await db_1.pool.query(`SELECT message_id, ARRAY_AGG(user_id)::text[] AS readers
       FROM message_reads WHERE message_id = ANY($1) GROUP BY message_id`, [ids]);
        for (const r of reads)
            readersByMsg.set(r.message_id, r.readers ?? []);
    }
    return rows.map((m) => ({
        id: String(m.id),
        roomId: String(m.room_id),
        sender: (0, util_1.toUser)(m.sender),
        body: m.body ?? '',
        attachments: (m.attachments ?? []),
        reactions: reactionsByMsg.get(m.id) ?? [],
        readBy: readersByMsg.get(m.id) ?? [],
        createdAt: iso(m.created_at),
    }));
}
/**
 * Persists a message after membership + DM block checks and profanity filtering.
 * Shared by the REST endpoint and the Socket.io `message:send` handler so both
 * enforce identical rules.
 */
async function createMessage(input) {
    const { roomId, senderId } = input;
    const body = (input.body ?? '').trim();
    const attachments = input.attachments ?? [];
    if (!body && attachments.length === 0) {
        throw new util_1.HttpError(400, 'Message must have a body or at least one attachment');
    }
    const roomRes = await db_1.pool.query('SELECT id, is_dm FROM rooms WHERE id = $1', [roomId]);
    if (!roomRes.rows.length)
        throw new util_1.HttpError(404, 'Room not found');
    const member = await db_1.pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
        roomId,
        senderId,
    ]);
    if (!member.rows.length)
        throw new util_1.HttpError(403, 'Not a member of this room');
    if (roomRes.rows[0].is_dm) {
        // In a DM, a block in either direction silences the conversation.
        const other = await db_1.pool.query('SELECT user_id FROM room_members WHERE room_id = $1 AND user_id <> $2 LIMIT 1', [roomId, senderId]);
        if (other.rows.length) {
            const otherId = other.rows[0].user_id;
            const blocked = await db_1.pool.query(`SELECT 1 FROM blocks
         WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)
         LIMIT 1`, [senderId, otherId]);
            if (blocked.rows.length)
                throw new util_1.HttpError(403, 'Cannot message this user');
        }
    }
    const { text, flagged } = (0, moderation_1.cleanText)(body);
    const inserted = await db_1.pool.query(`INSERT INTO messages (room_id, sender_id, body, attachments, is_flagged)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`, [roomId, senderId, text, JSON.stringify(attachments), flagged]);
    const senderRes = await db_1.pool.query('SELECT * FROM users WHERE id = $1', [senderId]);
    const [shaped] = await shapeMessages([{ ...inserted.rows[0], sender: senderRes.rows[0] }], senderId);
    return shaped;
}
