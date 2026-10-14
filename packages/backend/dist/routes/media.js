"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const moderation_1 = require("../middleware/moderation");
const xp_1 = require("../services/xp");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
function toMediaPost(row) {
    return {
        id: String(row.id),
        user: (0, util_1.toUser)(row.sender),
        url: row.url,
        kind: row.kind,
        caption: row.caption ?? '',
        likesCount: Number(row.likes_count),
        likedByMe: Boolean(row.liked_by_me),
        createdAt: new Date(row.created_at).toISOString(),
    };
}
router.get('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10) || 20, 1), 100);
    const { rows } = await db_1.pool.query(`SELECT m.*, to_jsonb(u) AS sender,
              EXISTS(SELECT 1 FROM media_likes ml WHERE ml.media_id = m.id AND ml.user_id = $2) AS liked_by_me
       FROM media_posts m JOIN users u ON u.id = m.user_id
       ORDER BY m.likes_count DESC, m.created_at DESC LIMIT $1`, [limit, req.user.id]);
    res.json({ posts: rows.map(toMediaPost) });
}));
const createMediaSchema = zod_1.z.object({
    url: zod_1.z.string().url().max(2000),
    kind: zod_1.z.enum(['image', 'video']).default('image'),
    caption: zod_1.z.string().max(500).optional().default(''),
});
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const body = createMediaSchema.parse(req.body);
    const { text } = (0, moderation_1.cleanText)(body.caption);
    const { rows } = await db_1.pool.query(`INSERT INTO media_posts (user_id, url, kind, caption) VALUES ($1, $2, $3, $4) RETURNING *`, [req.user.id, body.url, body.kind, text]);
    // Media post: +10 XP.
    (0, sockets_1.maybeEmitRankUp)(req.user.id, await (0, xp_1.awardXp)(req.user.id, 10, 'media post'));
    const [full] = await db_1.pool.query(`SELECT m.*, to_jsonb(u) AS sender, false AS liked_by_me
       FROM media_posts m JOIN users u ON u.id = m.user_id WHERE m.id = $1`, [rows[0].id]).then((r) => r.rows);
    res.status(201).json({ post: toMediaPost(full) });
}));
router.post('/:id/like', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const post = await db_1.pool.query('SELECT id FROM media_posts WHERE id = $1', [req.params.id]);
    if (!post.rows.length)
        throw new util_1.HttpError(404, 'Post not found');
    const inserted = await db_1.pool.query(`INSERT INTO media_likes (media_id, user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING media_id`, [req.params.id, req.user.id]);
    if (inserted.rows.length) {
        // Keep the denormalized counter in sync with the likes table.
        await db_1.pool.query('UPDATE media_posts SET likes_count = likes_count + 1 WHERE id = $1', [
            req.params.id,
        ]);
    }
    res.json({ liked: true });
}));
router.delete('/:id/like', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const deleted = await db_1.pool.query('DELETE FROM media_likes WHERE media_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (deleted.rowCount) {
        await db_1.pool.query('UPDATE media_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [req.params.id]);
    }
    res.json({ liked: false });
}));
exports.default = router;
