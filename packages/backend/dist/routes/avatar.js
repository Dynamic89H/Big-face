"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const tokens_1 = require("../services/tokens");
const router = (0, express_1.Router)();
const SLOTS = ['hair', 'top', 'bottom', 'shoes', 'chain', 'ring', 'earring', 'grill', 'hat'];
function toAvatarItem(row) {
    return {
        id: String(row.id),
        slot: row.slot,
        name: row.name,
        rarity: row.rarity,
        minLevel: Number(row.min_level),
        tokenPrice: Number(row.token_price),
        style: row.style ?? {},
    };
}
router.get('/items', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query('SELECT * FROM avatar_items ORDER BY slot, min_level, token_price');
    res.json({ items: rows.map(toAvatarItem) });
}));
router.get('/me', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query(`SELECT ai.*, uai.equipped
       FROM user_avatar_items uai JOIN avatar_items ai ON ai.id = uai.item_id
       WHERE uai.user_id = $1 ORDER BY ai.slot`, [req.user.id]);
    const equipped = {};
    const owned = rows.map((r) => {
        const item = toAvatarItem(r);
        if (r.equipped)
            equipped[item.slot] = item;
        return { item, equipped: Boolean(r.equipped) };
    });
    res.json({ owned, equipped });
}));
const acquireSchema = zod_1.z.object({ itemId: zod_1.z.string().uuid() });
router.post('/acquire', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { itemId } = acquireSchema.parse(req.body);
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        const itemRes = await client.query('SELECT * FROM avatar_items WHERE id = $1', [itemId]);
        if (!itemRes.rows.length)
            throw new util_1.HttpError(404, 'Item not found');
        const item = itemRes.rows[0];
        const owned = await client.query('SELECT 1 FROM user_avatar_items WHERE user_id = $1 AND item_id = $2', [req.user.id, itemId]);
        if (owned.rows.length)
            throw new util_1.HttpError(400, 'Item already owned');
        const me = await client.query('SELECT level, token_balance FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
        if (Number(me.rows[0].level) < Number(item.min_level)) {
            throw new util_1.HttpError(403, `Requires level ${item.min_level}`);
        }
        const price = Number(item.token_price);
        if (price > 0) {
            if (Number(me.rows[0].token_balance) < price) {
                throw new util_1.HttpError(400, 'Insufficient token balance');
            }
            // Debit goes through the token ledger inside this same transaction.
            await (0, tokens_1.addTokens)(req.user.id, -price, 'bonus', { reference: `avatar:${itemId}`, client });
        }
        await client.query('INSERT INTO user_avatar_items (user_id, item_id) VALUES ($1, $2)', [
            req.user.id,
            itemId,
        ]);
        await client.query('COMMIT');
        res.json({ ok: true });
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}));
const equipSchema = zod_1.z.object({ itemId: zod_1.z.string().uuid() });
router.post('/equip', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { itemId } = equipSchema.parse(req.body);
    const itemRes = await db_1.pool.query('SELECT * FROM avatar_items WHERE id = $1', [itemId]);
    if (!itemRes.rows.length)
        throw new util_1.HttpError(404, 'Item not found');
    const owned = await db_1.pool.query('SELECT 1 FROM user_avatar_items WHERE user_id = $1 AND item_id = $2', [req.user.id, itemId]);
    if (!owned.rows.length)
        throw new util_1.HttpError(403, 'You do not own this item');
    // One equipped item per slot.
    await db_1.pool.query(`UPDATE user_avatar_items SET equipped = false
       WHERE user_id = $1 AND item_id IN (SELECT id FROM avatar_items WHERE slot = $2)`, [req.user.id, itemRes.rows[0].slot]);
    await db_1.pool.query('UPDATE user_avatar_items SET equipped = true WHERE user_id = $1 AND item_id = $2', [req.user.id, itemId]);
    res.json({ ok: true });
}));
const unequipSchema = zod_1.z.object({ slot: zod_1.z.enum(SLOTS) });
router.post('/unequip', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { slot } = unequipSchema.parse(req.body);
    await db_1.pool.query(`UPDATE user_avatar_items SET equipped = false
       WHERE user_id = $1 AND item_id IN (SELECT id FROM avatar_items WHERE slot = $2)`, [req.user.id, slot]);
    res.json({ ok: true });
}));
exports.default = router;
