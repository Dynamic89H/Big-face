import { pool } from '../db';
import { HttpError, toUser } from '../util';
import { cleanText } from '../middleware/moderation';

export interface Attachment {
  url: string;
  name: string;
  mime: string;
  size: number;
}

export interface MessageShape {
  id: string;
  roomId: string;
  sender: ReturnType<typeof toUser>;
  body: string;
  attachments: Attachment[];
  reactions: { emoji: string; count: number; reactedByMe: boolean }[];
  readBy: string[];
  createdAt: string;
}

function iso(v: unknown): string {
  return v == null ? new Date().toISOString() : new Date(v as string).toISOString();
}

/**
 * Shapes raw message rows (each must carry a `sender` JSON object) into the
 * contract's message shape, batch-loading reactions and read receipts.
 */
export async function shapeMessages(rows: any[], viewerId: string): Promise<MessageShape[]> {
  const ids = rows.map((r) => r.id);
  const reactionsByMsg = new Map<string, { emoji: string; count: number; reactedByMe: boolean }[]>();
  const readersByMsg = new Map<string, string[]>();

  if (ids.length) {
    const { rows: reactions } = await pool.query(
      `SELECT message_id, emoji, COUNT(*)::int AS count, BOOL_OR(user_id = $2) AS reacted_by_me
       FROM message_reactions WHERE message_id = ANY($1)
       GROUP BY message_id, emoji`,
      [ids, viewerId]
    );
    for (const r of reactions) {
      const list = reactionsByMsg.get(r.message_id) ?? [];
      list.push({ emoji: r.emoji, count: r.count, reactedByMe: Boolean(r.reacted_by_me) });
      reactionsByMsg.set(r.message_id, list);
    }
    const { rows: reads } = await pool.query(
      `SELECT message_id, ARRAY_AGG(user_id)::text[] AS readers
       FROM message_reads WHERE message_id = ANY($1) GROUP BY message_id`,
      [ids]
    );
    for (const r of reads) readersByMsg.set(r.message_id, r.readers ?? []);
  }

  return rows.map((m) => ({
    id: String(m.id),
    roomId: String(m.room_id),
    sender: toUser(m.sender),
    body: m.body ?? '',
    attachments: (m.attachments ?? []) as Attachment[],
    reactions: reactionsByMsg.get(m.id) ?? [],
    readBy: readersByMsg.get(m.id) ?? [],
    createdAt: iso(m.created_at),
  }));
}

export interface CreateMessageInput {
  roomId: string;
  senderId: string;
  body?: string;
  attachments?: Attachment[];
}

/**
 * Persists a message after membership + DM block checks and profanity filtering.
 * Shared by the REST endpoint and the Socket.io `message:send` handler so both
 * enforce identical rules.
 */
export async function createMessage(input: CreateMessageInput): Promise<MessageShape> {
  const { roomId, senderId } = input;
  const body = (input.body ?? '').trim();
  const attachments = input.attachments ?? [];
  if (!body && attachments.length === 0) {
    throw new HttpError(400, 'Message must have a body or at least one attachment');
  }

  const roomRes = await pool.query('SELECT id, is_dm FROM rooms WHERE id = $1', [roomId]);
  if (!roomRes.rows.length) throw new HttpError(404, 'Room not found');

  const member = await pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
    roomId,
    senderId,
  ]);
  if (!member.rows.length) throw new HttpError(403, 'Not a member of this room');

  if (roomRes.rows[0].is_dm) {
    // In a DM, a block in either direction silences the conversation.
    const other = await pool.query(
      'SELECT user_id FROM room_members WHERE room_id = $1 AND user_id <> $2 LIMIT 1',
      [roomId, senderId]
    );
    if (other.rows.length) {
      const otherId = other.rows[0].user_id as string;
      const blocked = await pool.query(
        `SELECT 1 FROM blocks
         WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)
         LIMIT 1`,
        [senderId, otherId]
      );
      if (blocked.rows.length) throw new HttpError(403, 'Cannot message this user');
    }
  }

  const { text, flagged } = cleanText(body);
  const inserted = await pool.query(
    `INSERT INTO messages (room_id, sender_id, body, attachments, is_flagged)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [roomId, senderId, text, JSON.stringify(attachments), flagged]
  );
  const senderRes = await pool.query('SELECT * FROM users WHERE id = $1', [senderId]);
  const [shaped] = await shapeMessages(
    [{ ...inserted.rows[0], sender: senderRes.rows[0] }],
    senderId
  );
  return shaped;
}
