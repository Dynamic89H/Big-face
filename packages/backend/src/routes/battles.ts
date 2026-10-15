import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';
import { emitToAll } from '../sockets';

const router = Router();

const BATTLE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// List live + waiting battles.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT b.*, uh.display_name AS host_name, uc.display_name AS challenger_name,
              uh.profile_color AS host_color, uc.profile_color AS challenger_color
       FROM battles b
       JOIN users uh ON uh.id = b.host_id
       LEFT JOIN users uc ON uc.id = b.challenger_id
       WHERE b.status IN ('waiting','live')
       ORDER BY b.created_at DESC LIMIT 20`
    );
    res.json({ battles: rows.map((r) => ({
      id: r.id, title: r.title, status: r.status,
      host: { id: r.host_id, displayName: r.host_name, profileColor: r.host_color },
      challenger: r.challenger_id ? { id: r.challenger_id, displayName: r.challenger_name, profileColor: r.challenger_color } : null,
      endsAt: r.ends_at, createdAt: r.created_at,
    })) });
  })
);

// Create a battle (host goes live, waits for challenger).
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title } = z.object({ title: z.string().max(80).optional() }).parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO battles (host_id, title) VALUES ($1, $2) RETURNING *`,
      [req.user!.id, title || 'Epic Battle']
    );
    const b = rows[0];
    await pool.query(
      'INSERT INTO battle_scores (battle_id, battler_id) VALUES ($1, $2)',
      [b.id, req.user!.id]
    );
    emitToAll('battle:created', { battleId: b.id, title: b.title, hostId: req.user!.id });
    res.status(201).json({ battle: { id: b.id, title: b.title, status: b.status } });
  })
);

// Join as challenger — battle goes live.
router.post(
  '/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM battles WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Battle not found');
    const b = rows[0];
    if (b.status !== 'waiting') throw new HttpError(400, 'Battle already started');
    if (b.host_id === req.user!.id) throw new HttpError(400, "You can't battle yourself");

    const endsAt = new Date(Date.now() + BATTLE_DURATION_MS);
    await pool.query(
      `UPDATE battles SET challenger_id = $1, status = 'live', started_at = now(), ends_at = $2 WHERE id = $3`,
      [req.user!.id, endsAt.toISOString(), b.id]
    );
    await pool.query(
      'INSERT INTO battle_scores (battle_id, battler_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [b.id, req.user!.id]
    );
    emitToAll('battle:started', { battleId: b.id, challengerId: req.user!.id, endsAt: endsAt.toISOString() });
    res.json({ ok: true, endsAt: endsAt.toISOString() });
  })
);

// Get battle details + live scores.
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM battles WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Battle not found');
    const b = rows[0];
    const { rows: scores } = await pool.query(
      `SELECT bs.*, u.display_name FROM battle_scores bs
       JOIN users u ON u.id = bs.battler_id WHERE bs.battle_id = $1`,
      [b.id]
    );
    res.json({
      battle: {
        id: b.id, title: b.title, status: b.status,
        hostId: b.host_id, challengerId: b.challenger_id,
        winnerId: b.winner_id, endsAt: b.ends_at, createdAt: b.created_at,
      },
      scores: scores.map((s) => ({
        battlerId: s.battler_id, displayName: s.display_name,
        giftTokens: Number(s.gift_tokens), giftCount: Number(s.gift_count),
      })),
    });
  })
);

// End a battle, declare winner.
router.post(
  '/:id/end',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM battles WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Battle not found');
    const b = rows[0];
    if (b.status !== 'live') throw new HttpError(400, 'Battle is not live');
    if (b.host_id !== req.user!.id && b.challenger_id !== req.user!.id) {
      throw new HttpError(403, 'Only battlers can end the battle');
    }

    const { rows: scores } = await pool.query(
      'SELECT battler_id, gift_tokens FROM battle_scores WHERE battle_id = $1 ORDER BY gift_tokens DESC',
      [b.id]
    );
    const winnerId = scores.length ? scores[0].battler_id : null;
    await pool.query(
      `UPDATE battles SET status = 'ended', winner_id = $1 WHERE id = $2`,
      [winnerId, b.id]
    );

    // Winner gets XP + glory.
    if (winnerId) {
      await awardXp(winnerId, 100, 'battle_winner').catch(() => undefined);
      const loserId = scores.length > 1 ? scores[1].battler_id : null;
      if (loserId) await awardXp(loserId, 25, 'battle_participant').catch(() => undefined);
    }

    emitToAll('battle:ended', { battleId: b.id, winnerId });
    res.json({ ok: true, winnerId });
  })
);

export default router;
