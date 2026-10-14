import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { cleanText } from '../middleware/moderation';
import { awardXp } from '../services/xp';
import { maybeEmitRankUp } from '../sockets';

const router = Router();

function toMediaPost(row: any) {
  return {
    id: String(row.id),
    user: toUser(row.sender),
    url: row.url,
    kind: row.kind,
    caption: row.caption ?? '',
    likesCount: Number(row.likes_count),
    likedByMe: Boolean(row.liked_by_me),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '20', 10) || 20, 1), 100);
    const { rows } = await pool.query(
      `SELECT m.*, to_jsonb(u) AS sender,
              EXISTS(SELECT 1 FROM media_likes ml WHERE ml.media_id = m.id AND ml.user_id = $2) AS liked_by_me
       FROM media_posts m JOIN users u ON u.id = m.user_id
       ORDER BY m.likes_count DESC, m.created_at DESC LIMIT $1`,
      [limit, req.user!.id]
    );
    res.json({ posts: rows.map(toMediaPost) });
  })
);

const createMediaSchema = z.object({
  url: z.string().url().max(2000),
  kind: z.enum(['image', 'video']).default('image'),
  caption: z.string().max(500).optional().default(''),
});

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createMediaSchema.parse(req.body);
    const { text } = cleanText(body.caption);
    const { rows } = await pool.query(
      `INSERT INTO media_posts (user_id, url, kind, caption) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user!.id, body.url, body.kind, text]
    );
    // Media post: +10 XP.
    maybeEmitRankUp(req.user!.id, await awardXp(req.user!.id, 10, 'media post'));
    const [full] = await pool.query(
      `SELECT m.*, to_jsonb(u) AS sender, false AS liked_by_me
       FROM media_posts m JOIN users u ON u.id = m.user_id WHERE m.id = $1`,
      [rows[0].id]
    ).then((r) => r.rows);
    res.status(201).json({ post: toMediaPost(full) });
  })
);

router.post(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = await pool.query('SELECT id FROM media_posts WHERE id = $1', [req.params.id]);
    if (!post.rows.length) throw new HttpError(404, 'Post not found');
    const inserted = await pool.query(
      `INSERT INTO media_likes (media_id, user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING media_id`,
      [req.params.id, req.user!.id]
    );
    if (inserted.rows.length) {
      // Keep the denormalized counter in sync with the likes table.
      await pool.query('UPDATE media_posts SET likes_count = likes_count + 1 WHERE id = $1', [
        req.params.id,
      ]);
    }
    res.json({ liked: true });
  })
);

router.delete(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    const deleted = await pool.query(
      'DELETE FROM media_likes WHERE media_id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );
    if (deleted.rowCount) {
      await pool.query(
        'UPDATE media_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
        [req.params.id]
      );
    }
    res.json({ liked: false });
  })
);

export default router;
