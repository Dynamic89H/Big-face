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

// Public: view another user's lifestyle showcase.
router.get(
  '/:id/lifestyle',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT a.kind, a.name, a.rarity FROM lifestyle_assets a
       JOIN user_lifestyle_assets ua ON ua.asset_id = a.id
       WHERE ua.user_id = $1 ORDER BY a.token_price DESC LIMIT 6`,
      [req.params.id]
    );
    res.json({ assets: rows });
  })
);

// Referral: my code + stats.
router.get(
  '/referral',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows: u } = await pool.query('SELECT referral_code FROM users WHERE id = $1', [me]);
    const { rows: refs } = await pool.query(
      `SELECT u.display_name, u.username, r.created_at FROM referrals r
       JOIN users u ON u.id = r.referred_id
       WHERE r.referrer_id = $1 ORDER BY r.created_at DESC`,
      [me]
    );
    res.json({
      code: u[0]?.referral_code ?? null,
      count: refs.length,
      referred: refs.map((r) => ({
        displayName: r.display_name,
        username: r.username,
        joinedAt: r.created_at,
      })),
    });
  })
);

// Top Track of the Week — anyone can read; only King/Queen can set.
router.get(
  '/weekly-track',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT wt.*, u.display_name AS set_by_name
       FROM weekly_tracks wt
       LEFT JOIN users u ON u.id = wt.set_by_user_id
       ORDER BY week_start DESC LIMIT 1`
    );
    if (!rows.length) return res.json({ track: null });
    const t = rows[0];
    res.json({
      track: {
        title: t.title, artist: t.artist, genre: t.genre, url: t.url,
        setBy: t.set_by_name, weekStart: t.week_start,
      },
    });
  })
);

router.post(
  '/weekly-track',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, artist, genre, url } = req.body ?? {};
    if (!title || !artist || !url) {
      res.status(400).json({ error: 'Title, artist, and audio URL are required.' });
      return;
    }
    // Only the current Face King or Queen may set the weekly track.
    const leg = await getLatestLegendary();
    const me = req.user!.id;
    if (leg.king?.id !== me && leg.queen?.id !== me) {
      res.status(403).json({ error: 'Only the Face King or Face Queen can set the weekly track.' });
      return;
    }
    const week = new Date().toISOString().slice(0, 10);
    await pool.query(
      `INSERT INTO weekly_tracks (week_start, set_by_user_id, title, artist, genre, url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (week_start) DO UPDATE SET
         set_by_user_id = EXCLUDED.set_by_user_id, title = EXCLUDED.title,
         artist = EXCLUDED.artist, genre = EXCLUDED.genre, url = EXCLUDED.url`,
      [week, me, String(title).slice(0, 80), String(artist).slice(0, 80), String(genre || 'rap').slice(0, 20), String(url)]
    );
    res.json({ ok: true });
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
