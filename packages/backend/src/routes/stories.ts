import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { emitToAll } from '../sockets';

const router = Router();

// Get stories feed — grouped by user, newest first, unexpired only
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Clean up expired stories
    await pool.query('DELETE FROM stories WHERE expires_at < now()').catch(() => undefined);

    const { rows } = await pool.query(
      `SELECT s.*, u.display_name, u.profile_color, u.avatar_url,
              (SELECT COUNT(*)::int FROM story_views sv WHERE sv.story_id = s.id) AS view_count,
              EXISTS(SELECT 1 FROM story_views sv WHERE sv.story_id = s.id AND sv.viewer_id = $1) AS viewed
       FROM stories s JOIN users u ON u.id = s.user_id
       WHERE s.expires_at > now()
       ORDER BY s.created_at DESC LIMIT 100`,
      [req.user!.id]
    );

    // Group by user
    const grouped: Record<string, any> = {};
    for (const s of rows) {
      if (!grouped[s.user_id]) {
        grouped[s.user_id] = {
          userId: s.user_id,
          displayName: s.display_name,
          profileColor: s.profile_color,
          avatarUrl: s.avatar_url,
          stories: [],
        };
      }
      grouped[s.user_id].stories.push({
        id: s.id,
        mediaUrl: s.media_url,
        mediaType: s.media_type,
        caption: s.caption,
        createdAt: s.created_at,
        viewCount: s.view_count,
        viewed: s.viewed,
      });
    }

    res.json({ groups: Object.values(grouped) });
  })
);

// Post a story
const postSchema = z.object({
  mediaUrl: z.string().min(1),
  mediaType: z.enum(['image', 'video']).default('image'),
  caption: z.string().max(200).optional(),
});

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { mediaUrl, mediaType, caption } = postSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO stories (user_id, media_url, media_type, caption)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.user!.id, mediaUrl, mediaType, caption || null]
    );
    emitToAll('social:story', { userId: req.user!.id, storyId: rows[0].id });
    res.json({ id: rows[0].id });
  })
);

// Mark as viewed
router.post(
  '/:id/view',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query(
      `INSERT INTO story_views (story_id, viewer_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user!.id]
    );
    res.json({ ok: true });
  })
);

// Delete own story
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM stories WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user!.id,
    ]);
    res.json({ ok: true });
  })
);

export default router;
