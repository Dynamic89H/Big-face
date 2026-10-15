import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';

const router = Router();

// List all lifestyle assets (houses & cars) with ownership info.
router.get(
  '/assets',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT a.*, (ua.asset_id IS NOT NULL) AS owned
       FROM lifestyle_assets a
       LEFT JOIN user_lifestyle_assets ua ON ua.asset_id = a.id AND ua.user_id = $1
       ORDER BY a.token_price ASC`,
      [me]
    );
    res.json({ assets: rows.map((r) => ({
      id: r.id, kind: r.kind, name: r.name, rarity: r.rarity,
      minLevel: r.min_level, tokenPrice: r.token_price, style: r.style,
      owned: Boolean(r.owned),
    })) });
  })
);

// My owned assets.
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT a.*, ua.acquired_at FROM lifestyle_assets a
       JOIN user_lifestyle_assets ua ON ua.asset_id = a.id
       WHERE ua.user_id = $1 ORDER BY a.token_price DESC`,
      [me]
    );
    res.json({ assets: rows.map((r) => ({
      id: r.id, kind: r.kind, name: r.name, rarity: r.rarity,
      minLevel: r.min_level, tokenPrice: r.token_price, style: r.style,
      acquiredAt: r.acquired_at,
    })) });
  })
);

// Buy a house or car.
router.post(
  '/buy/:assetId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query('SELECT * FROM lifestyle_assets WHERE id = $1', [req.params.assetId]);
    if (!rows.length) throw new HttpError(404, 'Asset not found');
    const asset = rows[0];

    const { rows: owned } = await pool.query(
      'SELECT 1 FROM user_lifestyle_assets WHERE user_id = $1 AND asset_id = $2',
      [me, asset.id]
    );
    if (owned.length) throw new HttpError(409, 'You already own this');

    const { rows: u } = await pool.query('SELECT level FROM users WHERE id = $1', [me]);
    if ((u[0]?.level ?? 1) < asset.min_level) {
      throw new HttpError(403, `Requires level ${asset.min_level}`);
    }

    // Check token balance.
    const { rows: bal } = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN kind = 'credit' THEN amount ELSE -amount END), 0) AS balance
       FROM wallet_transactions WHERE user_id = $1`,
      [me]
    );
    const balance = Number(bal[0]?.balance ?? 0);
    if (balance < asset.token_price) {
      throw new HttpError(402, `Not enough tokens (need ${asset.token_price})`);
    }

    await pool.query('BEGIN');
    try {
      await pool.query(
        `INSERT INTO wallet_transactions (user_id, kind, amount, reason)
         VALUES ($1, 'debit', $2, $3)`,
        [me, asset.token_price, `lifestyle_purchase:${asset.name}`]
      );
      await pool.query(
        'INSERT INTO user_lifestyle_assets (user_id, asset_id) VALUES ($1, $2)',
        [me, asset.id]
      );
      await pool.query('COMMIT');
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    }

    await awardXp(me, 30, 'lifestyle_purchase').catch(() => undefined);
    res.json({ ok: true, name: asset.name });
  })
);

// Custom shop catalog.
router.get(
  '/shop',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM custom_shop_items ORDER BY category, token_price'
    );
    res.json({ items: rows.map((r) => ({
      id: r.id, category: r.category, name: r.name,
      tokenPrice: r.token_price, minLevel: r.min_level, style: r.style,
    })) });
  })
);

// Apply customization to an owned car.
router.post(
  '/customize/:assetId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { category, itemId } = req.body as { category: string; itemId: string };
    if (!['rims', 'paint', 'interior'].includes(category)) {
      throw new HttpError(400, 'Invalid category');
    }

    // Verify ownership.
    const { rows: owned } = await pool.query(
      `SELECT ua.*, a.kind FROM user_lifestyle_assets ua
       JOIN lifestyle_assets a ON a.id = ua.asset_id
       WHERE ua.user_id = $1 AND ua.asset_id = $2`,
      [me, req.params.assetId]
    );
    if (!owned.length) throw new HttpError(404, 'You do not own this asset');
    if (owned[0].kind !== 'car') throw new HttpError(400, 'Customization is for cars only');

    // Get shop item.
    const { rows: items } = await pool.query(
      'SELECT * FROM custom_shop_items WHERE id = $1 AND category = $2',
      [itemId, category]
    );
    if (!items.length) throw new HttpError(404, 'Shop item not found');
    const item = items[0];

    const { rows: u } = await pool.query('SELECT level FROM users WHERE id = $1', [me]);
    if ((u[0]?.level ?? 1) < item.min_level) {
      throw new HttpError(403, `Requires level ${item.min_level}`);
    }

    const { rows: bal } = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN kind = 'credit' THEN amount ELSE -amount END), 0) AS balance
       FROM wallet_transactions WHERE user_id = $1`,
      [me]
    );
    if (Number(bal[0]?.balance ?? 0) < item.token_price) {
      throw new HttpError(402, `Not enough tokens (need ${item.token_price})`);
    }

    const col = category === 'rims' ? 'custom_rims' : category === 'paint' ? 'custom_paint' : 'custom_interior';
    await pool.query('BEGIN');
    try {
      await pool.query(
        `INSERT INTO wallet_transactions (user_id, kind, amount, reason)
         VALUES ($1, 'debit', $2, $3)`,
        [me, item.token_price, `custom_shop:${item.name}`]
      );
      await pool.query(
        `UPDATE user_lifestyle_assets SET ${col} = $1 WHERE user_id = $2 AND asset_id = $3`,
        [item.name, me, req.params.assetId]
      );
      await pool.query('COMMIT');
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    }

    await awardXp(me, 15, 'car_customized').catch(() => undefined);
    res.json({ ok: true, applied: item.name });
  })
);

// My owned assets with customization.
router.get(
  '/mine/detailed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = req.user!.id;
    const { rows } = await pool.query(
      `SELECT a.*, ua.acquired_at, ua.custom_paint, ua.custom_rims, ua.custom_interior, ua.custom_extras
       FROM lifestyle_assets a
       JOIN user_lifestyle_assets ua ON ua.asset_id = a.id
       WHERE ua.user_id = $1 ORDER BY a.token_price DESC`,
      [me]
    );
    res.json({ assets: rows.map((r) => ({
      id: r.id, kind: r.kind, name: r.name, rarity: r.rarity,
      minLevel: r.min_level, tokenPrice: r.token_price, style: r.style,
      acquiredAt: r.acquired_at,
      customPaint: r.custom_paint, customRims: r.custom_rims,
      customInterior: r.custom_interior, customExtras: r.custom_extras,
    })) });
  })
);

export default router;
