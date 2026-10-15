import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';
import { addTokens } from '../services/tokens';
import { emitToUser } from '../sockets';

const router = Router();

// Become an artist (or update artist profile).
router.post(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { artistName } = z.object({
      artistName: z.string().min(1).max(60),
    }).parse(req.body);
    await pool.query(
      'UPDATE users SET is_artist = true, artist_name = $1 WHERE id = $2',
      [artistName.trim(), req.user!.id]
    );
    await awardXp(req.user!.id, 30, 'artist_debut').catch(() => undefined);
    res.json({ ok: true, artistName: artistName.trim() });
  })
);

// Top artists by tips.
router.get(
  '/top',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT u.id, u.artist_name, u.display_name, u.profile_color,
              COALESCE(SUM(t.tips_tokens), 0)::int AS total_tips,
              COUNT(t.id)::int AS track_count
       FROM users u LEFT JOIN artist_tracks t ON t.artist_id = u.id
       WHERE u.is_artist = true
       GROUP BY u.id ORDER BY total_tips DESC LIMIT 20`
    );
    res.json({ artists: rows.map((r) => ({
      id: r.id, artistName: r.artist_name, displayName: r.display_name,
      profileColor: r.profile_color, totalTips: r.total_tips, trackCount: r.track_count,
    })) });
  })
);

// All tracks, newest first (with tip leaderboard option).
router.get(
  '/tracks',
  requireAuth,
  asyncHandler(async (req, res) => {
    const sort = req.query.sort === 'top' ? 't.tips_tokens DESC' : 't.created_at DESC';
    const { rows } = await pool.query(
      `SELECT t.*, u.artist_name, u.display_name, u.profile_color
       FROM artist_tracks t JOIN users u ON u.id = t.artist_id
       ORDER BY ${sort} LIMIT 50`
    );
    res.json({ tracks: rows.map((r) => ({
      id: r.id, title: r.title, genre: r.genre, audioUrl: r.audio_url, coverUrl: r.cover_url,
      plays: Number(r.plays), tipsTokens: Number(r.tips_tokens), tipCount: Number(r.tip_count),
      createdAt: r.created_at,
      artist: { id: r.artist_id, artistName: r.artist_name, displayName: r.display_name, profileColor: r.profile_color },
    })) });
  })
);

// Drop a track.
router.post(
  '/tracks',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, genre, audioUrl, coverUrl } = z.object({
      title: z.string().min(1).max(100),
      genre: z.string().max(30).optional().default('hip-hop'),
      audioUrl: z.string().url().max(500),
      coverUrl: z.string().url().max(500).optional(),
    }).parse(req.body);

    const { rows: u } = await pool.query('SELECT is_artist FROM users WHERE id = $1', [req.user!.id]);
    if (!u[0]?.is_artist) throw new HttpError(400, 'Become an artist first');

    const { rows } = await pool.query(
      `INSERT INTO artist_tracks (artist_id, title, genre, audio_url, cover_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user!.id, title.trim(), genre, audioUrl, coverUrl ?? null]
    );
    await awardXp(req.user!.id, 40, 'track_dropped').catch(() => undefined);
    res.status(201).json({ track: { id: rows[0].id, title: rows[0].title } });
  })
);

// Play a track (increments plays).
router.post(
  '/tracks/:id/play',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('UPDATE artist_tracks SET plays = plays + 1 WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  })
);

// Tip a track — 90% to artist, 10% platform.
const tipSchema = z.object({ tokens: z.number().int().min(10).max(100000) });
router.post(
  '/tracks/:id/tip',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { tokens } = tipSchema.parse(req.body);
    const tipperId = req.user!.id;

    const { rows } = await pool.query('SELECT * FROM artist_tracks WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Track not found');
    const track = rows[0];
    if (track.artist_id === tipperId) throw new HttpError(400, "You can't tip your own track");

    const artistCut = Math.floor(tokens * 0.9);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bal = await client.query('SELECT token_balance FROM users WHERE id = $1 FOR UPDATE', [tipperId]);
      if (Number(bal.rows[0].token_balance) < tokens) throw new HttpError(400, 'Insufficient token balance');
      await addTokens(tipperId, -tokens, 'track_tip_sent', { reference: `tip:${track.id}`, client });
      await addTokens(track.artist_id, artistCut, 'track_tip_received', { reference: `tip:${track.id}`, client });
      await client.query(
        'UPDATE artist_tracks SET tips_tokens = tips_tokens + $1, tip_count = tip_count + 1 WHERE id = $2',
        [tokens, track.id]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    await awardXp(tipperId, 5, 'tip_sent').catch(() => undefined);
    await awardXp(track.artist_id, 15, 'tip_received').catch(() => undefined);
    emitToUser(track.artist_id, 'track:tipped', { trackId: track.id, tokens, tipperId });
    res.json({ ok: true, artistCut });
  })
);

export default router;
