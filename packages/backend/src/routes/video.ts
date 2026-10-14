import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/rooms/:id/video/start',
  requireAuth,
  asyncHandler(async (req, res) => {
    const mem = await pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [
      req.params.id,
      req.user!.id,
    ]);
    if (!mem.rows.length) throw new HttpError(403, 'Not a member of this room');
    const { rows } = await pool.query(
      'INSERT INTO video_sessions (room_id, started_by) VALUES ($1, $2) RETURNING id',
      [req.params.id, req.user!.id]
    );
    res.json({ sessionId: String(rows[0].id) });
  })
);

router.post(
  '/video/sessions/:id/end',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'UPDATE video_sessions SET ended_at = now() WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!rows.length) throw new HttpError(404, 'Session not found');
    res.status(204).end();
  })
);

export default router;
