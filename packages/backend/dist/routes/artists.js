"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const tokens_1 = require("../services/tokens");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
// Become an artist (or update artist profile).
router.post('/profile', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { artistName } = zod_1.z.object({
        artistName: zod_1.z.string().min(1).max(60),
    }).parse(req.body);
    await db_1.pool.query('UPDATE users SET is_artist = true, artist_name = $1 WHERE id = $2', [artistName.trim(), req.user.id]);
    await (0, xp_1.awardXp)(req.user.id, 30, 'artist_debut').catch(() => undefined);
    res.json({ ok: true, artistName: artistName.trim() });
}));
// Top artists by tips.
router.get('/top', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query(`SELECT u.id, u.artist_name, u.display_name, u.profile_color,
              COALESCE(SUM(t.tips_tokens), 0)::int AS total_tips,
              COUNT(t.id)::int AS track_count
       FROM users u LEFT JOIN artist_tracks t ON t.artist_id = u.id
       WHERE u.is_artist = true
       GROUP BY u.id ORDER BY total_tips DESC LIMIT 20`);
    res.json({ artists: rows.map((r) => ({
            id: r.id, artistName: r.artist_name, displayName: r.display_name,
            profileColor: r.profile_color, totalTips: r.total_tips, trackCount: r.track_count,
        })) });
}));
// All tracks, newest first (with tip leaderboard option).
router.get('/tracks', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const sort = req.query.sort === 'top' ? 't.tips_tokens DESC' : 't.created_at DESC';
    const { rows } = await db_1.pool.query(`SELECT t.*, u.artist_name, u.display_name, u.profile_color
       FROM artist_tracks t JOIN users u ON u.id = t.artist_id
       ORDER BY ${sort} LIMIT 50`);
    res.json({ tracks: rows.map((r) => ({
            id: r.id, title: r.title, genre: r.genre, audioUrl: r.audio_url, coverUrl: r.cover_url,
            plays: Number(r.plays), tipsTokens: Number(r.tips_tokens), tipCount: Number(r.tip_count),
            createdAt: r.created_at,
            artist: { id: r.artist_id, artistName: r.artist_name, displayName: r.display_name, profileColor: r.profile_color },
        })) });
}));
// Drop a track.
router.post('/tracks', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { title, genre, audioUrl, coverUrl } = zod_1.z.object({
        title: zod_1.z.string().min(1).max(100),
        genre: zod_1.z.string().max(30).optional().default('hip-hop'),
        audioUrl: zod_1.z.string().url().max(500),
        coverUrl: zod_1.z.string().url().max(500).optional(),
    }).parse(req.body);
    const { rows: u } = await db_1.pool.query('SELECT is_artist FROM users WHERE id = $1', [req.user.id]);
    if (!u[0]?.is_artist)
        throw new util_1.HttpError(400, 'Become an artist first');
    const { rows } = await db_1.pool.query(`INSERT INTO artist_tracks (artist_id, title, genre, audio_url, cover_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [req.user.id, title.trim(), genre, audioUrl, coverUrl ?? null]);
    await (0, xp_1.awardXp)(req.user.id, 40, 'track_dropped').catch(() => undefined);
    res.status(201).json({ track: { id: rows[0].id, title: rows[0].title } });
}));
// Play a track (increments plays).
router.post('/tracks/:id/play', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await db_1.pool.query('UPDATE artist_tracks SET plays = plays + 1 WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
}));
// Tip a track — 90% to artist, 10% platform.
const tipSchema = zod_1.z.object({ tokens: zod_1.z.number().int().min(10).max(100000) });
router.post('/tracks/:id/tip', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { tokens } = tipSchema.parse(req.body);
    const tipperId = req.user.id;
    const { rows } = await db_1.pool.query('SELECT * FROM artist_tracks WHERE id = $1', [req.params.id]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Track not found');
    const track = rows[0];
    if (track.artist_id === tipperId)
        throw new util_1.HttpError(400, "You can't tip your own track");
    const artistCut = Math.floor(tokens * 0.9);
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        const bal = await client.query('SELECT token_balance FROM users WHERE id = $1 FOR UPDATE', [tipperId]);
        if (Number(bal.rows[0].token_balance) < tokens)
            throw new util_1.HttpError(400, 'Insufficient token balance');
        await (0, tokens_1.addTokens)(tipperId, -tokens, 'track_tip_sent', { reference: `tip:${track.id}`, client });
        await (0, tokens_1.addTokens)(track.artist_id, artistCut, 'track_tip_received', { reference: `tip:${track.id}`, client });
        await client.query('UPDATE artist_tracks SET tips_tokens = tips_tokens + $1, tip_count = tip_count + 1 WHERE id = $2', [tokens, track.id]);
        await client.query('COMMIT');
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
    await (0, xp_1.awardXp)(tipperId, 5, 'tip_sent').catch(() => undefined);
    await (0, xp_1.awardXp)(track.artist_id, 15, 'tip_received').catch(() => undefined);
    (0, sockets_1.emitToUser)(track.artist_id, 'track:tipped', { trackId: track.id, tokens, tipperId });
    res.json({ ok: true, artistCut });
}));
exports.default = router;
