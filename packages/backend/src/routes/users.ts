import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';
import { maybeEmitRankUp } from '../sockets';
import { getColorOfWeek, getLatestLegendary } from '../services/legendary';

const router = Router();

// Static routes must be registered before /:id so "me"/"leaderboard" aren't
// captured as a user id.

router.get(
  '/leaderboard',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '50', 10) || 50, 1), 100);
    const { rows } = await pool.query('SELECT * FROM users ORDER BY xp DESC LIMIT $1', [limit]);
    res.json({
      entries: rows.map((r, i) => ({ user: toUser(r), xp: Number(r.xp), level: Number(r.level), rank: i + 1 })),
    });
  })
);

router.get(
  '/color-of-week',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await getColorOfWeek());
  })
);

router.get(
  '/hall-of-fame',
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
    res.json({
      posts: rows.map((m) => ({
        id: String(m.id),
        user: toUser(m.sender),
        url: m.url,
        kind: m.kind,
        caption: m.caption ?? '',
        likesCount: Number(m.likes_count),
        likedByMe: Boolean(m.liked_by_me),
        createdAt: new Date(m.created_at).toISOString(),
      })),
    });
  })
);

router.get(
  '/legendary',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await getLatestLegendary());
  })
);

router.get(
  '/search',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = ((req.query.q as string) ?? '').trim();
    if (q.length < 2) return res.json({ users: [] });
    const like = `%${q}%`;
    const { rows } = await pool.query(
      `SELECT * FROM users
       WHERE id != $2 AND (username ILIKE $1 OR display_name ILIKE $1)
       ORDER BY xp DESC LIMIT 10`,
      [like, req.user!.id]
    );
    res.json({ users: rows.map(toUser) });
  })
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'User not found');
    const { rows: s } = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM profile_likes WHERE liked_user_id = $1) AS followers_likes,
         (SELECT COUNT(*)::int FROM media_posts WHERE user_id = $1) AS media_count,
         (SELECT COUNT(*)::int + 1 FROM users WHERE xp > (SELECT xp FROM users WHERE id = $1)) AS rank`,
      [req.params.id]
    );
    res.json({
      user: toUser(rows[0]),
      stats: {
        followersLikes: s[0].followers_likes,
        mediaCount: s[0].media_count,
        rank: s[0].rank,
      },
    });
  })
);

const patchMeSchema = z.object({
  displayName: z.string().min(1).max(60).optional(),
  bio: z.string().max(500).optional(),
  profileColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a hex color like #0066FF').optional(),
  avatarConfig: z.record(z.any()).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = patchMeSchema.parse(req.body);
    const columnFor: Record<string, string> = {
      displayName: 'display_name',
      bio: 'bio',
      profileColor: 'profile_color',
      avatarConfig: 'avatar_config',
      gender: 'gender',
    };
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const [key, column] of Object.entries(columnFor)) {
      const value = (body as Record<string, unknown>)[key];
      if (value !== undefined) {
        values.push(key === 'avatarConfig' ? JSON.stringify(value) : value);
        sets.push(`${column} = $${values.length}`);
      }
    }
    if (!sets.length) throw new HttpError(400, 'Nothing to update');
    values.push(req.user!.id);
    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json({ user: toUser(rows[0]) });
  })
);

router.post(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    const targetId = req.params.id;
    if (targetId === req.user!.id) throw new HttpError(400, 'You cannot like your own profile');
    const target = await pool.query('SELECT id FROM users WHERE id = $1', [targetId]);
    if (!target.rows.length) throw new HttpError(404, 'User not found');
    const inserted = await pool.query(
      `INSERT INTO profile_likes (liker_id, liked_user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING id`,
      [req.user!.id, targetId]
    );
    if (inserted.rows.length) {
      // Profile like received: +1 XP to the receiver.
      maybeEmitRankUp(targetId, await awardXp(targetId, 1, 'profile like received'));
    }
    res.json({ liked: true });
  })
);

router.delete(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM profile_likes WHERE liker_id = $1 AND liked_user_id = $2', [
      req.user!.id,
      req.params.id,
    ]);
    res.json({ liked: false });
  })
);

router.post(
  '/:id/block',
  requireAuth,
  asyncHandler(async (req, res) => {
    const targetId = req.params.id;
    if (targetId === req.user!.id) throw new HttpError(400, 'You cannot block yourself');
    const target = await pool.query('SELECT id FROM users WHERE id = $1', [targetId]);
    if (!target.rows.length) throw new HttpError(404, 'User not found');
    await pool.query(
      'INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user!.id, targetId]
    );
    res.status(204).end();
  })
);

router.delete(
  '/:id/block',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM blocks WHERE blocker_id = $1 AND blocked_id = $2', [
      req.user!.id,
      req.params.id,
    ]);
    res.status(204).end();
  })
);

export default router;
