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
    try {
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
    } catch (e) {
      // If stories table isn't ready, return empty instead of 500
      res.json({ groups: [] });
    }
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

// Reply to a story
router.post(
  '/:id/reply',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new HttpError(400, 'Message required');
    }
    if (message.length > 280) throw new HttpError(400, 'Reply too long');

    const { rows: story } = await pool.query(
      'SELECT user_id FROM stories WHERE id = $1',
      [req.params.id]
    );
    if (!story[0]) throw new HttpError(404, 'Story not found');

    const { rows } = await pool.query(
      `INSERT INTO story_replies (story_id, user_id, message) VALUES ($1, $2, $3) RETURNING id, created_at`,
      [req.params.id, req.user!.id, message.trim()]
    );

    // Notify story owner
    const { emitToUser } = await import('../sockets');
    emitToUser(story[0].user_id, 'story:reply', {
      storyId: req.params.id,
      fromUserId: req.user!.id,
      message: message.trim(),
    });

    res.json({ ok: true, replyId: rows[0].id });
  })
);

// Get replies for own story
router.get(
  '/:id/replies',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT sr.*, u.display_name, u.username
       FROM story_replies sr JOIN users u ON u.id = sr.user_id
       WHERE sr.story_id = $1 ORDER BY sr.created_at ASC`,
      [req.params.id]
    );
    res.json({ replies: rows });
  })
);

export default router;
