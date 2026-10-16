import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, toRoom, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';

const router = Router();

async function requireMember(roomId: string, userId: string): Promise<void> {
  const mem = await pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
    roomId,
    userId,
  ]);
  if (!mem.rows.length) throw new HttpError(403, 'Not a member of this room');
}

// GET /api/rooms/public — public rooms anyone can join.
router.get(
  '/public',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT r.*,
        (SELECT COUNT(*)::int FROM room_members rm WHERE rm.room_id = r.id) AS member_count,
        (SELECT COUNT(*)::int FROM messages m WHERE m.room_id = r.id AND m.created_at > now() - interval '24 hours') AS recent_messages,
        EXISTS(SELECT 1 FROM room_members rm WHERE rm.room_id = r.id AND rm.user_id = $1) AS joined
       FROM rooms r
       WHERE r.is_public = TRUE AND r.is_dm = FALSE
       ORDER BY recent_messages DESC, member_count DESC`,
      [me]
    );
    res.json({ rooms: rows.map((r: any) => toRoom(r, r.member_count, null)) });
  })
);

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    // unreadCount = messages newer than my last_read_at (or join time if never read).
    const { rows } = await pool.query(
      `SELECT r.*,
              (SELECT COUNT(*)::int FROM messages m
               WHERE m.room_id = r.id
                 AND m.created_at > COALESCE(rm.last_read_at, rm.joined_at)) AS unread_count,
              (SELECT MAX(created_at) FROM messages WHERE room_id = r.id) AS last_message_at
       FROM rooms r
       JOIN room_members rm ON rm.room_id = r.id AND rm.user_id = $1
       ORDER BY last_message_at DESC NULLS LAST, r.created_at DESC`,
      [me]
    );
    res.json({
      rooms: rows.map((r) =>
        toRoom(r, r.unread_count, r.last_message_at ? new Date(r.last_message_at).toISOString() : null)
      ),
    });
  })
);

const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  memberIds: z.array(z.string().uuid()).max(500).optional().default([]),
});

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createRoomSchema.parse(req.body);
    // Only attach members that actually exist.
    let memberIds = body.memberIds.filter((id) => id !== req.user!.id);
    if (memberIds.length) {
      const { rows } = await pool.query('SELECT id FROM users WHERE id = ANY($1)', [memberIds]);
      memberIds = rows.map((r) => String(r.id));
    }
    const allMembers = [...new Set([req.user!.id, ...memberIds])];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        'INSERT INTO rooms (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        [body.name, body.description, req.user!.id]
      );
      for (const memberId of allMembers) {
        await client.query(
          'INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [rows[0].id, memberId]
        );
      }
      await client.query('COMMIT');
      res.status(201).json({ room: toRoom(rows[0], 0, null) });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  })
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Room not found');
    await requireMember(req.params.id, req.user!.id);
    const members = await pool.query(
      `SELECT u.* FROM users u JOIN room_members rm ON rm.user_id = u.id
       WHERE rm.room_id = $1 ORDER BY rm.joined_at`,
      [req.params.id]
    );
    res.json({ room: toRoom(rows[0], 0, null), members: members.rows.map(toUser) });
  })
);

const dmSchema = z.object({ userId: z.string().uuid() });

router.post(
  '/dm',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = dmSchema.parse(req.body);
    const me = req.user!.id;
    if (userId === me) throw new HttpError(400, 'You cannot DM yourself');
    const other = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!other.rows.length) throw new HttpError(404, 'User not found');

    // Find-or-create: an existing DM has exactly these two members.
    const existing = await pool.query(
      `SELECT r.* FROM rooms r
       WHERE r.is_dm
         AND EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = r.id AND m.user_id = $1)
         AND EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = r.id AND m.user_id = $2)
         AND (SELECT COUNT(*) FROM room_members m WHERE m.room_id = r.id) = 2
       LIMIT 1`,
      [me, userId]
    );
    if (existing.rows.length) return res.json({ room: toRoom(existing.rows[0], 0, null) });

    // Deterministic name so the pair always maps to one room.
    const [a, b] = [me, userId].sort();
    const name = `dm:${a}:${b}`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        'INSERT INTO rooms (name, is_dm, created_by) VALUES ($1, true, $2) RETURNING *',
        [name, me]
      );
      for (const memberId of [me, userId]) {
        await client.query('INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)', [
          rows[0].id,
          memberId,
        ]);
      }
      await client.query('COMMIT');
      res.status(201).json({ room: toRoom(rows[0], 0, null) });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  })
);

router.post(
  '/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const room = await pool.query('SELECT id FROM rooms WHERE id = $1', [req.params.id]);
    if (!room.rows.length) throw new HttpError(404, 'Room not found');
    await pool.query(
      'INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, req.user!.id]
    );
    res.status(204).end();
  })
);

router.post(
  '/:id/leave',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM room_members WHERE room_id = $1 AND user_id = $2', [
      req.params.id,
      req.user!.id,
    ]);
    res.status(204).end();
  })
);

// POST /api/rooms/:id/kick — host removes someone from their room.
router.post(
  '/:id/kick',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const targetId = String(req.body?.userId ?? '');
    if (!targetId || targetId === me) {
      res.status(400).json({ error: 'Invalid user.' });
      return;
    }
    // Only the room creator (host) can kick.
    const { rows: room } = await pool.query(
      'SELECT created_by FROM rooms WHERE id = $1', [req.params.id]
    );
    if (!room.length) throw new HttpError(404, 'Room not found');
    if (room[0].created_by !== me) {
      res.status(403).json({ error: 'Only the host can remove people.' });
      return;
    }
    await pool.query(
      'DELETE FROM room_members WHERE room_id = $1 AND user_id = $2',
      [req.params.id, targetId]
    );
    res.json({ ok: true });
  })
);

export default router;
