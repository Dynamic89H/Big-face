"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const router = (0, express_1.Router)();
// List all lifestyle assets (houses & cars) with ownership info.
router.get('/assets', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows } = await db_1.pool.query(`SELECT a.*, (ua.asset_id IS NOT NULL) AS owned
       FROM lifestyle_assets a
       LEFT JOIN user_lifestyle_assets ua ON ua.asset_id = a.id AND ua.user_id = $1
       ORDER BY a.token_price ASC`, [me]);
    res.json({ assets: rows.map((r) => ({
            id: r.id, kind: r.kind, name: r.name, rarity: r.rarity,
            minLevel: r.min_level, tokenPrice: r.token_price, style: r.style,
            owned: Boolean(r.owned),
        })) });
}));
// My owned assets.
router.get('/mine', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows } = await db_1.pool.query(`SELECT a.*, ua.acquired_at FROM lifestyle_assets a
       JOIN user_lifestyle_assets ua ON ua.asset_id = a.id
       WHERE ua.user_id = $1 ORDER BY a.token_price DESC`, [me]);
    res.json({ assets: rows.map((r) => ({
            id: r.id, kind: r.kind, name: r.name, rarity: r.rarity,
            minLevel: r.min_level, tokenPrice: r.token_price, style: r.style,
            acquiredAt: r.acquired_at,
        })) });
}));
// Buy a house or car.
router.post('/buy/:assetId', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows } = await db_1.pool.query('SELECT * FROM lifestyle_assets WHERE id = $1', [req.params.assetId]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Asset not found');
    const asset = rows[0];
    const { rows: owned } = await db_1.pool.query('SELECT 1 FROM user_lifestyle_assets WHERE user_id = $1 AND asset_id = $2', [me, asset.id]);
    if (owned.length)
        throw new util_1.HttpError(409, 'You already own this');
    const { rows: u } = await db_1.pool.query('SELECT level FROM users WHERE id = $1', [me]);
    if ((u[0]?.level ?? 1) < asset.min_level) {
        throw new util_1.HttpError(403, `Requires level ${asset.min_level}`);
    }
    // Check token balance.
    const { rows: bal } = await db_1.pool.query(`SELECT COALESCE(SUM(CASE WHEN kind = 'credit' THEN amount ELSE -amount END), 0) AS balance
       FROM wallet_transactions WHERE user_id = $1`, [me]);
    const balance = Number(bal[0]?.balance ?? 0);
    if (balance < asset.token_price) {
        throw new util_1.HttpError(402, `Not enough tokens (need ${asset.token_price})`);
    }
    await db_1.pool.query('BEGIN');
    try {
        await db_1.pool.query(`INSERT INTO wallet_transactions (user_id, kind, amount, reason)
         VALUES ($1, 'debit', $2, $3)`, [me, asset.token_price, `lifestyle_purchase:${asset.name}`]);
        await db_1.pool.query('INSERT INTO user_lifestyle_assets (user_id, asset_id) VALUES ($1, $2)', [me, asset.id]);
        await db_1.pool.query('COMMIT');
    }
    catch (e) {
        await db_1.pool.query('ROLLBACK');
        throw e;
    }
    await (0, xp_1.awardXp)(me, 30, 'lifestyle_purchase').catch(() => undefined);
    res.json({ ok: true, name: asset.name });
}));
exports.default = router;
