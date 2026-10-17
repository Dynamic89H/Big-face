import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';

const router = Router();

const SLOTS = ['hair', 'top', 'bottom', 'shoes', 'chain', 'ring', 'earring', 'grill', 'hat'];

function toAvatarItem(row: any) {
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

router.get(
  '/items',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('SELECT * FROM avatar_items ORDER BY slot, min_level, token_price');
    res.json({ items: rows.map(toAvatarItem) });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT ai.*, uai.equipped
       FROM user_avatar_items uai JOIN avatar_items ai ON ai.id = uai.item_id
       WHERE uai.user_id = $1 ORDER BY ai.slot`,
      [req.user!.id]
    );
    const equipped: Record<string, unknown> = {};
    const owned = rows.map((r) => {
      const item = toAvatarItem(r);
      if (r.equipped) equipped[item.slot] = item;
      return { item, equipped: Boolean(r.equipped) };
    });
    res.json({ owned, equipped });
  })
);

const acquireSchema = z.object({ itemId: z.string().uuid() });

router.post(
  '/acquire',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { itemId } = acquireSchema.parse(req.body);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const itemRes = await client.query('SELECT * FROM avatar_items WHERE id = $1', [itemId]);
      if (!itemRes.rows.length) throw new HttpError(404, 'Item not found');
      const item = itemRes.rows[0];

      const owned = await client.query(
        'SELECT 1 FROM user_avatar_items WHERE user_id = $1 AND item_id = $2',
        [req.user!.id, itemId]
      );
      if (owned.rows.length) throw new HttpError(400, 'Item already owned');

      const me = await client.query(
        'SELECT level, token_balance FROM users WHERE id = $1 FOR UPDATE',
        [req.user!.id]
      );
      if (Number(me.rows[0].level) < Number(item.min_level)) {
        throw new HttpError(403, `Requires level ${item.min_level}`);
      }
      const price = Number(item.token_price);
      if (price > 0) {
        if (Number(me.rows[0].token_balance) < price) {
          throw new HttpError(400, 'Insufficient token balance');
        }
        // Debit goes through the token ledger inside this same transaction.
        await addTokens(req.user!.id, -price, 'bonus', { reference: `avatar:${itemId}`, client });
      }
      await client.query('INSERT INTO user_avatar_items (user_id, item_id) VALUES ($1, $2)', [
        req.user!.id,
        itemId,
      ]);
      await client.query('COMMIT');
      res.json({ ok: true });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  })
);

const equipSchema = z.object({ itemId: z.string().uuid() });

router.post(
  '/equip',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { itemId } = equipSchema.parse(req.body);
    const itemRes = await pool.query('SELECT * FROM avatar_items WHERE id = $1', [itemId]);
    if (!itemRes.rows.length) throw new HttpError(404, 'Item not found');
    const owned = await pool.query(
      'SELECT 1 FROM user_avatar_items WHERE user_id = $1 AND item_id = $2',
      [req.user!.id, itemId]
    );
    if (!owned.rows.length) throw new HttpError(403, 'You do not own this item');

    // One equipped item per slot.
    await pool.query(
      `UPDATE user_avatar_items SET equipped = false
       WHERE user_id = $1 AND item_id IN (SELECT id FROM avatar_items WHERE slot = $2)`,
      [req.user!.id, itemRes.rows[0].slot]
    );
    await pool.query(
      'UPDATE user_avatar_items SET equipped = true WHERE user_id = $1 AND item_id = $2',
      [req.user!.id, itemId]
    );
    res.json({ ok: true });
  })
);

const unequipSchema = z.object({ slot: z.enum(SLOTS as [string, ...string[]]) });

router.post(
  '/unequip',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { slot } = unequipSchema.parse(req.body);
    await pool.query(
      `UPDATE user_avatar_items SET equipped = false
       WHERE user_id = $1 AND item_id IN (SELECT id FROM avatar_items WHERE slot = $2)`,
      [req.user!.id, slot]
    );
    res.json({ ok: true });
  })
);

// ============ ABILITIES ============

function toAbility(row: any) {
  return {
    id: String(row.id),
    key: row.key,
    name: row.name,
    icon: row.icon,
    description: row.description,
    minLevel: Number(row.min_level),
    effectType: row.effect_type,
    effectValue: Number(row.effect_value),
    effectLabel: row.effect_label,
    cssClass: row.css_class,
  };
}

// List all abilities + user's unlocked/equipped status.
// Auto-unlocks any abilities the user now qualifies for (by level).
router.get(
  '/abilities',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const { rows: u } = await pool.query('SELECT level FROM users WHERE id = $1', [userId]);
    const level = Number(u[0]?.level ?? 1);

    // Auto-unlock newly qualified abilities
    await pool.query(
      `INSERT INTO user_abilities (user_id, ability_id)
       SELECT $1, a.id FROM abilities a
       WHERE a.min_level <= $2
         AND NOT EXISTS (
           SELECT 1 FROM user_abilities ua
           WHERE ua.user_id = $1 AND ua.ability_id = a.id
         )`,
      [userId, level]
    );

    const { rows } = await pool.query(
      `SELECT a.*, ua.equipped, ua.unlocked_at IS NOT NULL AS unlocked
       FROM abilities a
       LEFT JOIN user_abilities ua ON ua.ability_id = a.id AND ua.user_id = $1
       ORDER BY a.sort_order`,
      [userId]
    );
    res.json({
      abilities: rows.map((r) => ({ ...toAbility(r), unlocked: Boolean(r.unlocked), equipped: Boolean(r.equipped) })),
    });
  })
);

const equipAbilitySchema = z.object({ abilityKey: z.string().min(1) });

// Equip an unlocked ability (only one equipped at a time — it's your aura).
router.post(
  '/abilities/equip',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { abilityKey } = equipAbilitySchema.parse(req.body);
    const userId = req.user!.id;
    const { rows } = await pool.query('SELECT * FROM abilities WHERE key = $1', [abilityKey]);
    if (!rows.length) throw new HttpError(404, 'Ability not found');
    const { rows: u } = await pool.query('SELECT level FROM users WHERE id = $1', [userId]);
    const level = Number(u[0]?.level ?? 1);
    if (level < Number(rows[0].min_level)) throw new HttpError(403, `Requires level ${rows[0].min_level}`);
    const owned = await pool.query(
      'SELECT 1 FROM user_abilities WHERE user_id = $1 AND ability_id = $2',
      [userId, rows[0].id]
    );
    if (!owned.rows.length) throw new HttpError(403, 'Ability not unlocked yet');

    // One aura at a time
    await pool.query('UPDATE user_abilities SET equipped = false WHERE user_id = $1', [userId]);
    await pool.query(
      'UPDATE user_abilities SET equipped = true WHERE user_id = $1 AND ability_id = $2',
      [userId, rows[0].id]
    );
    res.json({ ok: true, ability: toAbility(rows[0]) });
  })
);

router.post(
  '/abilities/unequip',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('UPDATE user_abilities SET equipped = false WHERE user_id = $1', [req.user!.id]);
    res.json({ ok: true });
  })
);

// Get a user's equipped ability (public — shown on profiles).
router.get(
  '/abilities/equipped/:userId',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT a.* FROM abilities a
       JOIN user_abilities ua ON ua.ability_id = a.id
       WHERE ua.user_id = $1 AND ua.equipped = true LIMIT 1`,
      [req.params.userId]
    );
    res.json({ ability: rows.length ? toAbility(rows[0]) : null });
  })
);

export default router;
