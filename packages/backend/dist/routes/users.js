"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const sockets_1 = require("../sockets");
const legendary_1 = require("../services/legendary");
const router = (0, express_1.Router)();
// Static routes must be registered before /:id so "me"/"leaderboard" aren't
// captured as a user id.
router.get('/leaderboard', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10) || 50, 1), 100);
    const { rows } = await db_1.pool.query('SELECT * FROM users ORDER BY xp DESC LIMIT $1', [limit]);
    res.json({
        entries: rows.map((r, i) => ({ user: (0, util_1.toUser)(r), xp: Number(r.xp), level: Number(r.level), rank: i + 1 })),
    });
}));
router.get('/color-of-week', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, legendary_1.getColorOfWeek)());
}));
router.get('/hall-of-fame', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10) || 20, 1), 100);
    const { rows } = await db_1.pool.query(`SELECT m.*, to_jsonb(u) AS sender,
              EXISTS(SELECT 1 FROM media_likes ml WHERE ml.media_id = m.id AND ml.user_id = $2) AS liked_by_me
       FROM media_posts m JOIN users u ON u.id = m.user_id
       ORDER BY m.likes_count DESC, m.created_at DESC LIMIT $1`, [limit, req.user.id]);
    res.json({
        posts: rows.map((m) => ({
            id: String(m.id),
            user: (0, util_1.toUser)(m.sender),
            url: m.url,
            kind: m.kind,
            caption: m.caption ?? '',
            likesCount: Number(m.likes_count),
            likedByMe: Boolean(m.liked_by_me),
            createdAt: new Date(m.created_at).toISOString(),
        })),
    });
}));
router.get('/legendary', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, legendary_1.getLatestLegendary)());
}));
// Referral: my code + stats.
router.get('/referral', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows: u } = await db_1.pool.query('SELECT referral_code FROM users WHERE id = $1', [me]);
    const { rows: refs } = await db_1.pool.query(`SELECT u.display_name, u.username, r.created_at FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1 ORDER BY r.created_at DESC`, [me]);
    res.json({
        code: u[0]?.referral_code ?? null,
        count: refs.length,
        referred: refs.map((r) => ({
            displayName: r.display_name,
            username: r.username,
            joinedAt: r.created_at,
        })),
    });
}));
// Top Track of the Week — anyone can read; only King/Queen can set.
router.get('/weekly-track', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query(`SELECT wt.*, u.display_name AS set_by_name
       FROM weekly_tracks wt
       LEFT JOIN users u ON u.id = wt.set_by_user_id
       ORDER BY week_start DESC LIMIT 1`);
    if (!rows.length)
        return res.json({ track: null });
    const t = rows[0];
    res.json({
        track: {
            title: t.title, artist: t.artist, genre: t.genre, url: t.url,
            setBy: t.set_by_name, weekStart: t.week_start,
        },
    });
}));
router.post('/weekly-track', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { title, artist, genre, url } = req.body ?? {};
    if (!title || !artist || !url) {
        res.status(400).json({ error: 'Title, artist, and audio URL are required.' });
        return;
    }
    // Only the current Face King or Queen may set the weekly track.
    const leg = await (0, legendary_1.getLatestLegendary)();
    const me = req.user.id;
    if (leg.king?.id !== me && leg.queen?.id !== me) {
        res.status(403).json({ error: 'Only the Face King or Face Queen can set the weekly track.' });
        return;
    }
    const week = new Date().toISOString().slice(0, 10);
    await db_1.pool.query(`INSERT INTO weekly_tracks (week_start, set_by_user_id, title, artist, genre, url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (week_start) DO UPDATE SET
         set_by_user_id = EXCLUDED.set_by_user_id, title = EXCLUDED.title,
         artist = EXCLUDED.artist, genre = EXCLUDED.genre, url = EXCLUDED.url`, [week, me, String(title).slice(0, 80), String(artist).slice(0, 80), String(genre || 'rap').slice(0, 20), String(url)]);
    res.json({ ok: true });
}));
router.get('/search', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const q = (req.query.q ?? '').trim();
    if (q.length < 2)
        return res.json({ users: [] });
    const like = `%${q}%`;
    const { rows } = await db_1.pool.query(`SELECT * FROM users
       WHERE id != $2 AND (username ILIKE $1 OR display_name ILIKE $1)
       ORDER BY xp DESC LIMIT 10`, [like, req.user.id]);
    res.json({ users: rows.map(util_1.toUser) });
}));
router.get('/:id', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'User not found');
    const { rows: s } = await db_1.pool.query(`SELECT
         (SELECT COUNT(*)::int FROM profile_likes WHERE liked_user_id = $1) AS followers_likes,
         (SELECT COUNT(*)::int FROM media_posts WHERE user_id = $1) AS media_count,
         (SELECT COUNT(*)::int + 1 FROM users WHERE xp > (SELECT xp FROM users WHERE id = $1)) AS rank`, [req.params.id]);
    res.json({
        user: (0, util_1.toUser)(rows[0]),
        stats: {
            followersLikes: s[0].followers_likes,
            mediaCount: s[0].media_count,
            rank: s[0].rank,
        },
    });
}));
const patchMeSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1).max(60).optional(),
    bio: zod_1.z.string().max(500).optional(),
    profileColor: zod_1.z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a hex color like #0066FF').optional(),
    avatarConfig: zod_1.z.record(zod_1.z.any()).optional(),
    gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
});
router.patch('/me', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const body = patchMeSchema.parse(req.body);
    const columnFor = {
        displayName: 'display_name',
        bio: 'bio',
        profileColor: 'profile_color',
        avatarConfig: 'avatar_config',
        gender: 'gender',
    };
    const sets = [];
    const values = [];
    for (const [key, column] of Object.entries(columnFor)) {
        const value = body[key];
        if (value !== undefined) {
            values.push(key === 'avatarConfig' ? JSON.stringify(value) : value);
            sets.push(`${column} = $${values.length}`);
        }
    }
    if (!sets.length)
        throw new util_1.HttpError(400, 'Nothing to update');
    values.push(req.user.id);
    const { rows } = await db_1.pool.query(`UPDATE users SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`, values);
    res.json({ user: (0, util_1.toUser)(rows[0]) });
}));
router.post('/:id/like', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const targetId = req.params.id;
    if (targetId === req.user.id)
        throw new util_1.HttpError(400, 'You cannot like your own profile');
    const target = await db_1.pool.query('SELECT id FROM users WHERE id = $1', [targetId]);
    if (!target.rows.length)
        throw new util_1.HttpError(404, 'User not found');
    const inserted = await db_1.pool.query(`INSERT INTO profile_likes (liker_id, liked_user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING id`, [req.user.id, targetId]);
    if (inserted.rows.length) {
        // Profile like received: +1 XP to the receiver.
        (0, sockets_1.maybeEmitRankUp)(targetId, await (0, xp_1.awardXp)(targetId, 1, 'profile like received'));
    }
    res.json({ liked: true });
}));
router.delete('/:id/like', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await db_1.pool.query('DELETE FROM profile_likes WHERE liker_id = $1 AND liked_user_id = $2', [
        req.user.id,
        req.params.id,
    ]);
    res.json({ liked: false });
}));
router.post('/:id/block', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const targetId = req.params.id;
    if (targetId === req.user.id)
        throw new util_1.HttpError(400, 'You cannot block yourself');
    const target = await db_1.pool.query('SELECT id FROM users WHERE id = $1', [targetId]);
    if (!target.rows.length)
        throw new util_1.HttpError(404, 'User not found');
    await db_1.pool.query('INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.user.id, targetId]);
    res.status(204).end();
}));
router.delete('/:id/block', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await db_1.pool.query('DELETE FROM blocks WHERE blocker_id = $1 AND blocked_id = $2', [
        req.user.id,
        req.params.id,
    ]);
    res.status(204).end();
}));
exports.default = router;
