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

export default router;
