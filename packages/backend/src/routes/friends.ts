import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler, toUser } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';

const router = Router();

// Friendship status between me and another user.
async function statusBetween(me: string, other: string): Promise<string | null> {
  const { rows } = await pool.query(
    `SELECT status, requester_id FROM friendships
     WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
    [me, other]
  );
  if (!rows.length) return null;
  const r = rows[0];
  if (r.status === 'pending') {
    return r.requester_id === me ? 'request_sent' : 'request_received';
  }
  return r.status; // accepted | declined | blocked
}

// GET /api/friends — my accepted friends.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT u.* FROM users u
       JOIN friendships f ON (
         (f.requester_id = $1 AND f.addressee_id = u.id) OR
         (f.addressee_id = $1 AND f.requester_id = u.id)
       )
       WHERE f.status = 'accepted' AND u.id != $1
       ORDER BY u.display_name`,
      [me]
    );
    res.json({ friends: rows.map(toUser) });
  })
);

// GET /api/friends/requests — pending requests I've received (and sent).
router.get(
  '/requests',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows: received } = await pool.query(
      `SELECT u.*, f.created_at AS requested_at FROM users u
       JOIN friendships f ON f.requester_id = u.id
       WHERE f.addressee_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [me]
    );
    const { rows: sent } = await pool.query(
      `SELECT u.*, f.created_at AS requested_at FROM users u
       JOIN friendships f ON f.addressee_id = u.id
       WHERE f.requester_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [me]
    );
    res.json({ received: received.map(toUser), sent: sent.map(toUser) });
  })
);

// GET /api/friends/status/:userId — where do I stand with this person?
router.get(
  '/status/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const other = req.params.userId;
    if (other === me) return res.json({ status: 'self' });
    res.json({ status: await statusBetween(me, other) });
  })
);

// POST /api/friends/request — send a friend request.
router.post(
  '/request',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const other = String(req.body?.userId ?? '');
    if (!other || other === me) {
      res.status(400).json({ error: 'Invalid user.' });
      return;
    }
    const existing = await statusBetween(me, other);
    if (existing === 'accepted' || existing === 'request_sent' || existing === 'request_received') {
      res.status(400).json({ error: 'Already friends or request pending.' });
      return;
    }
    // If they requested me before and it was declined, let me start fresh.
    await pool.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending')
       ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = 'pending', updated_at = now()`,
      [me, other]
    );
    await awardXp(me, 2, 'friend_request_sent').catch(() => undefined);
    res.json({ ok: true });
  })
);

// POST /api/friends/accept — accept a request.
router.post(
  '/accept',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const other = String(req.body?.userId ?? '');
    const { rowCount } = await pool.query(
      `UPDATE friendships SET status = 'accepted', updated_at = now()
       WHERE requester_id = $1 AND addressee_id = $2 AND status = 'pending'`,
      [other, me]
    );
    if (!rowCount) {
      res.status(404).json({ error: 'No pending request found.' });
      return;
    }
    await awardXp(me, 5, 'friend_accepted').catch(() => undefined);
    await awardXp(other, 5, 'friend_accepted').catch(() => undefined);
    res.json({ ok: true });
  })
);

// POST /api/friends/decline — decline a request.
router.post(
  '/decline',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const other = String(req.body?.userId ?? '');
    await pool.query(
      `UPDATE friendships SET status = 'declined', updated_at = now()
       WHERE requester_id = $1 AND addressee_id = $2 AND status = 'pending'`,
      [other, me]
    );
    res.json({ ok: true });
  })
);

// DELETE /api/friends/:userId — unfriend.
router.delete(
  '/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const other = req.params.userId;
    await pool.query(
      `DELETE FROM friendships
       WHERE ((requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1))
       AND status = 'accepted'`,
      [me, other]
    );
    res.json({ ok: true });
  })
);

export default router;
