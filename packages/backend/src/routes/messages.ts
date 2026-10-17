import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { createMessage, shapeMessages, Attachment } from '../services/messages';
import { awardXp } from '../services/xp';
import { emitToRoom, maybeEmitRankUp } from '../sockets';

const router = Router();

async function requireMember(roomId: string, userId: string): Promise<void> {
  const mem = await pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
    roomId,
    userId,
  ]);
  if (!mem.rows.length) throw new HttpError(403, 'Not a member of this room');
}

async function roomOfMessage(messageId: string): Promise<string> {
  const { rows } = await pool.query('SELECT room_id FROM messages WHERE id = $1', [messageId]);
  if (!rows.length) throw new HttpError(404, 'Message not found');
  return rows[0].room_id as string;
}

const attachmentSchema = z.object({
  url: z.string().min(1).max(2000),
  name: z.string().max(255),
  mime: z.string().max(128),
  size: z.number().int().nonnegative(),
});

router.get(
  '/rooms/:id/messages',
  requireAuth,
  asyncHandler(async (req, res) => {
    await requireMember(req.params.id, req.user!.id);
    const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '50', 10) || 50, 1), 100);
    const before = req.query.before as string | undefined;
    const values: unknown[] = [req.params.id, limit];
    let beforeClause = '';
    if (before) {
      const cursor = new Date(before);
      if (Number.isNaN(cursor.getTime())) throw new HttpError(400, 'Invalid before cursor');
      values.push(cursor.toISOString());
      beforeClause = 'AND m.created_at < $3';
    }
    const { rows } = await pool.query(
      `SELECT m.*, to_jsonb(u) AS sender
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.room_id = $1 ${beforeClause}
       ORDER BY m.created_at DESC LIMIT $2`,
      values
    );
    res.json({ messages: await shapeMessages(rows, req.user!.id) });
  })
);

const sendMessageSchema = z.object({
  body: z.string().max(5000).optional(),
  attachments: z.array(attachmentSchema).max(10).optional(),
});

router.post(
  '/rooms/:id/messages',
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = sendMessageSchema.parse(req.body);
    const message = await createMessage({
      roomId: req.params.id,
      senderId: req.user!.id,
      body: parsed.body,
      attachments: parsed.attachments as Attachment[] | undefined,
    });
    // Message sent: +5 XP, rate-limited to 50 XP/hour to prevent botting.
    const { rows: recentXp } = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::int AS total FROM xp_transactions
       WHERE user_id = $1 AND reason = 'message sent'
       AND created_at > now() - interval '1 hour'`,
      [req.user!.id]
    ).catch(() => ({ rows: [{ total: 0 }] }));
    let xpRes = { leveledUp: false, level: 0, xp: 0 };
    if (Number(recentXp[0]?.total || 0) < 50) {
      xpRes = await awardXp(req.user!.id, 5, 'message sent');
    }
    emitToRoom(req.params.id, 'message:new', { message });
    maybeEmitRankUp(req.user!.id, xpRes);
    res.status(201).json({ message });
  })
);

router.post(
  '/rooms/:id/read',
  requireAuth,
  asyncHandler(async (req, res) => {
    await requireMember(req.params.id, req.user!.id);
    await pool.query(
      'UPDATE room_members SET last_read_at = now() WHERE room_id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );
    res.status(204).end();
  })
);

const reactionSchema = z.object({ emoji: z.string().min(1).max(16) });

router.post(
  '/messages/:id/reactions',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { emoji } = reactionSchema.parse(req.body);
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user!.id);

    const inserted = await pool.query(
      `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING message_id`,
      [messageId, req.user!.id, emoji]
    );
    if (inserted.rows.length) {
      // Reaction received: +2 XP to the message author (not for self-reactions).
      const { rows } = await pool.query('SELECT sender_id FROM messages WHERE id = $1', [messageId]);
      const senderId = rows[0].sender_id as string;
      if (senderId !== req.user!.id) {
        maybeEmitRankUp(senderId, await awardXp(senderId, 2, 'reaction received'));
      }
      emitToRoom(roomId, 'message:reaction', {
        messageId,
        emoji,
        userId: req.user!.id,
        action: 'added',
      });
    }
    res.json({ ok: true });
  })
);

router.delete(
  '/messages/:id/reactions/:emoji',
  requireAuth,
  asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user!.id);
    const deleted = await pool.query(
      'DELETE FROM message_reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3',
      [messageId, req.user!.id, req.params.emoji]
    );
    if (deleted.rowCount) {
      emitToRoom(roomId, 'message:reaction', {
        messageId,
        emoji: req.params.emoji,
        userId: req.user!.id,
        action: 'removed',
      });
    }
    res.status(204).end();
  })
);

router.post(
  '/messages/:id/read',
  requireAuth,
  asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const roomId = await roomOfMessage(messageId);
    await requireMember(roomId, req.user!.id);
    await pool.query(
      'INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [messageId, req.user!.id]
    );
    emitToRoom(roomId, 'read:update', { messageId, userId: req.user!.id });
    res.status(204).end();
  })
);

export default router;
