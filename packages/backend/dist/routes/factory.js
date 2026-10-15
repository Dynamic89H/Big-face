"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const router = (0, express_1.Router)();
const STYLES = ['realistic', 'anime', 'cartoon', 'pixel', 'cyberpunk', 'fantasy', 'street-art', '3d-render'];
// Browse the factory gallery.
router.get('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { kind, style } = req.query;
    let q = `SELECT f.*, u.display_name AS creator_name FROM factory_assets f
             JOIN users u ON u.id = f.creator_id WHERE 1=1`;
    const params = [];
    if (kind) {
        params.push(kind);
        q += ` AND f.kind = $${params.length}`;
    }
    if (style) {
        params.push(style);
        q += ` AND f.style = $${params.length}`;
    }
    q += ` ORDER BY f.likes DESC, f.created_at DESC LIMIT 50`;
    const { rows } = await db_1.pool.query(q, params);
    res.json({ assets: rows, styles: STYLES });
}));
// Submit a creation or inspiration capture.
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { kind, style, prompt, imageUrl, sourceUrl } = zod_1.z.object({
        kind: zod_1.z.enum(['avatar', 'gear', 'background', 'graphic', 'inspiration']),
        style: zod_1.z.string().default('realistic'),
        prompt: zod_1.z.string().min(1).max(500),
        imageUrl: zod_1.z.string().optional(),
        sourceUrl: zod_1.z.string().url().optional(),
    }).parse(req.body);
    const { rows } = await db_1.pool.query(`INSERT INTO factory_assets (creator_id, kind, style, prompt, image_url, source_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [req.user.id, kind, style, prompt, imageUrl || null, sourceUrl || null]);
    await (0, xp_1.awardXp)(req.user.id, 20, 'factory_create').catch(() => undefined);
    res.status(201).json({ asset: rows[0] });
}));
// Like an asset.
router.post('/:id/like', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    await db_1.pool.query(`INSERT INTO factory_likes (user_id, asset_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.user.id, req.params.id]);
    await db_1.pool.query(`UPDATE factory_assets SET likes = (SELECT COUNT(*) FROM factory_likes WHERE asset_id = $1) WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
}));
exports.default = router;
