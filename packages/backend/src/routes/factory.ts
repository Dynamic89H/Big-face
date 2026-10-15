import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';

const router = Router();

const STYLES = ['realistic', 'anime', 'cartoon', 'pixel', 'cyberpunk', 'fantasy', 'street-art', '3d-render'];

// Browse the factory gallery.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { kind, style } = req.query as { kind?: string; style?: string };
    let q = `SELECT f.*, u.display_name AS creator_name FROM factory_assets f
             JOIN users u ON u.id = f.creator_id WHERE 1=1`;
    const params: any[] = [];
    if (kind) { params.push(kind); q += ` AND f.kind = $${params.length}`; }
    if (style) { params.push(style); q += ` AND f.style = $${params.length}`; }
    q += ` ORDER BY f.likes DESC, f.created_at DESC LIMIT 50`;
    const { rows } = await pool.query(q, params);
    res.json({ assets: rows, styles: STYLES });
  })
);

// Submit a creation or inspiration capture.
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { kind, style, prompt, imageUrl, sourceUrl } = z.object({
      kind: z.enum(['avatar', 'gear', 'background', 'graphic', 'inspiration']),
      style: z.string().default('realistic'),
      prompt: z.string().min(1).max(500),
      imageUrl: z.string().optional(),
      sourceUrl: z.string().url().optional(),
    }).parse(req.body);

    const { rows } = await pool.query(
      `INSERT INTO factory_assets (creator_id, kind, style, prompt, image_url, source_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user!.id, kind, style, prompt, imageUrl || null, sourceUrl || null]
    );

    await awardXp(req.user!.id, 20, 'factory_create').catch(() => undefined);
    res.status(201).json({ asset: rows[0] });
  })
);

// Like an asset.
router.post(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query(
      `INSERT INTO factory_likes (user_id, asset_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user!.id, req.params.id]
    );
    await pool.query(
      `UPDATE factory_assets SET likes = (SELECT COUNT(*) FROM factory_likes WHERE asset_id = $1) WHERE id = $1`,
      [req.params.id]
    );
    res.json({ ok: true });
  })
);

export default router;
