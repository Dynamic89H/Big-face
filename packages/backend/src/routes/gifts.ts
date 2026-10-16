import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { cleanText } from '../middleware/moderation';
import { addTokens } from '../services/tokens';
import { awardXp } from '../services/xp';
import { recordPlatformRevenue } from '../services/platformRevenue';
import { emitToUser, maybeEmitRankUp } from '../sockets';

const router = Router();

/** Gift catalog from API_CONTRACT.md. */
export const GIFT_CATALOG = [
  // Starter (10-50)
  { key: 'rose', label: 'Rose', tokenCost: 10 },
  { key: 'heart', label: 'Heart', tokenCost: 15 },
  { key: 'fire', label: 'Fire', tokenCost: 25 },
  { key: 'clap', label: 'Applause', tokenCost: 30 },
  { key: 'star', label: 'Star', tokenCost: 40 },
  { key: 'crown', label: 'Crown', tokenCost: 50 },
  // Love set (20-80)
  { key: 'cupid', label: 'Cupid', tokenCost: 20 },
  { key: 'ring', label: 'Ring', tokenCost: 60 },
  { key: 'tulip', label: 'Tulip', tokenCost: 35 },
  // Party set (30-120)
  { key: 'party', label: 'Party', tokenCost: 30 },
  { key: 'confetti', label: 'Confetti', tokenCost: 45 },
  { key: 'disco', label: 'Disco Ball', tokenCost: 120 },
  // Mid (75-250)
  { key: 'diamond', label: 'Diamond', tokenCost: 75 },
  { key: 'throne', label: 'Throne', tokenCost: 100 },
  { key: 'trophy', label: 'Trophy', tokenCost: 125 },
  { key: 'rocket', label: 'Rocket', tokenCost: 150 },
  { key: 'moneygun', label: 'Money Gun', tokenCost: 200 },
  { key: 'starshower', label: 'Star Shower', tokenCost: 250 },
  // Wild set (150-300)
  { key: 'panther', label: 'Panther', tokenCost: 150 },
  { key: 'eagle', label: 'Eagle', tokenCost: 180 },
  { key: 'tiger', label: 'Tiger', tokenCost: 300 },
  // Premium (400-1000)
  { key: 'champagne', label: 'Champagne', tokenCost: 400 },
  { key: 'sports_car', label: 'Sports Car', tokenCost: 500 },
  { key: 'watch', label: 'Luxury Watch', tokenCost: 600 },
  { key: 'mansion', label: 'Mansion', tokenCost: 750 },
  { key: 'legend', label: 'Legend', tokenCost: 1000 },
  // Whale (2500+)
  { key: 'yacht', label: 'Yacht', tokenCost: 2500 },
  { key: 'jet', label: 'Private Jet', tokenCost: 5000 },
  { key: 'island', label: 'Private Island', tokenCost: 7500 },
  { key: 'bigface', label: 'BIG FACE', tokenCost: 10000 },
  // TikTok-inspired (viral favorites)
  { key: 'panda', label: 'Panda', tokenCost: 5 },
  { key: 'coffee', label: 'Coffee', tokenCost: 10 },
  { key: 'sunglasses', label: 'Sunglasses', tokenCost: 199 },
  { key: 'butterfly', label: 'Butterfly', tokenCost: 50 },
  { key: 'perfume', label: 'Perfume', tokenCost: 20 },
  { key: 'fireworks', label: 'Fireworks', tokenCost: 1099 },
  { key: 'carousel', label: 'Carousel', tokenCost: 2020 },
  { key: 'universe', label: 'Universe', tokenCost: 34999 },
] as const;

/** Receiver keeps 80%; the platform keeps 20%. */
const RECEIVER_SHARE = 0.8;

function toGift(row: any, sender: any, receiver: any) {
  return {
    id: String(row.id),
    sender: toUser(sender),
    receiver: toUser(receiver),
    giftKey: row.gift_key,
    giftLabel: row.gift_label,
    tokenCost: Number(row.token_cost),
    message: row.message ?? '',
    createdAt: new Date(row.created_at).toISOString(),
  };
}

router.get(
  '/catalog',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json({ gifts: GIFT_CATALOG.map((g) => ({ ...g })) });
  })
);

const sendGiftSchema = z.object({
  receiverId: z.string().uuid(),
  giftKey: z.string().min(1),
  message: z.string().max(500).optional().default(''),
  battleId: z.string().uuid().optional(),
});

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = sendGiftSchema.parse(req.body);
    const senderId = req.user!.id;
    const gift = GIFT_CATALOG.find((g) => g.key === body.giftKey);
    if (!gift) throw new HttpError(400, `Unknown gift: ${body.giftKey}`);
    if (body.receiverId === senderId) throw new HttpError(400, 'You cannot send a gift to yourself');

    const receiverRes = await pool.query('SELECT * FROM users WHERE id = $1', [body.receiverId]);
    if (!receiverRes.rows.length) throw new HttpError(404, 'Receiver not found');
    const senderRes = await pool.query('SELECT * FROM users WHERE id = $1', [senderId]);

    const { text: message } = cleanText(body.message);
    const receiverCut = Math.floor(gift.tokenCost * RECEIVER_SHARE);

    // Atomic: debit sender, credit receiver 80%, insert gift row — all or nothing.
    const client = await pool.connect();
    let giftRow: any;
    try {
      await client.query('BEGIN');
      const bal = await client.query('SELECT token_balance FROM users WHERE id = $1 FOR UPDATE', [
        senderId,
      ]);
      if (Number(bal.rows[0].token_balance) < gift.tokenCost) {
        throw new HttpError(400, 'Insufficient token balance');
      }
      const inserted = await client.query(
        `INSERT INTO gifts (sender_id, receiver_id, gift_key, gift_label, token_cost, message)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [senderId, body.receiverId, gift.key, gift.label, gift.tokenCost, message]
      );
      giftRow = inserted.rows[0];
      await addTokens(senderId, -gift.tokenCost, 'gift_sent', {
        reference: `gift:${giftRow.id}`,
        client,
      });
      await addTokens(body.receiverId, receiverCut, 'gift_received', {
        reference: `gift:${giftRow.id}`,
        client,
      });
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Gift received: +10 XP. Gift sent: +2 XP.
    maybeEmitRankUp(body.receiverId, await awardXp(body.receiverId, 10, 'gift received'));

    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(senderId, gift.tokenCost, 'gift').catch(() => undefined);
    maybeEmitRankUp(senderId, await awardXp(senderId, 2, 'gift sent'));

    const shaped = toGift(giftRow, senderRes.rows[0], receiverRes.rows[0]);
    emitToUser(body.receiverId, 'gift:received', { gift: shaped });

    // GIFT RAIN: whale gifts (1000+) rain across everyone's screen
    if (gift.tokenCost >= 1000) {
      const { emitToAll } = await import('../sockets');
      emitToAll('gift:rain', {
        giftKey: gift.key,
        giftLabel: gift.label,
        senderName: senderRes.rows[0].display_name || senderRes.rows[0].username,
        receiverName: receiverRes.rows[0].display_name || receiverRes.rows[0].username,
      });
    }

    // Dweezy's 20% cut on every gift — recorded, never lost.
    const platformCut = gift.tokenCost - receiverCut;
    await recordPlatformRevenue(body.battleId ? 'battle_gift_margin' : 'gift_margin', platformCut, {
      userId: senderId,
      reference: `gift:${giftRow.id}`,
      grossCents: gift.tokenCost,
    });

    // Battle scoring: if this gift was sent during a live battle to a battler, count it.
    if (body.battleId) {
      try {
        const { rows: b } = await pool.query(
          `SELECT id FROM battles WHERE id = $1 AND status = 'live'
           AND (host_id = $2 OR challenger_id = $2) LIMIT 1`,
          [body.battleId, body.receiverId]
        );
        if (b.length) {
          await pool.query(
            `UPDATE battle_scores SET gift_tokens = gift_tokens + $1, gift_count = gift_count + 1
             WHERE battle_id = $2 AND battler_id = $3`,
            [gift.tokenCost, body.battleId, body.receiverId]
          );
          const { emitToAll } = await import('../sockets');
          emitToAll('battle:score', {
            battleId: body.battleId, battlerId: body.receiverId,
            giftKey: gift.key, giftLabel: gift.label, tokens: gift.tokenCost,
          });
        }
      } catch {
        /* scoring is best-effort */
      }
    }

    res.status(201).json({ gift: shaped });
  })
);

async function listGifts(where: string, userId: string) {
  const { rows } = await pool.query(
    `SELECT g.*, to_jsonb(s) AS sender, to_jsonb(r) AS receiver
     FROM gifts g
     JOIN users s ON s.id = g.sender_id
     JOIN users r ON r.id = g.receiver_id
     WHERE ${where}
     ORDER BY g.created_at DESC LIMIT 100`,
    [userId]
  );
  return rows.map((g) => toGift(g, g.sender, g.receiver));
}

router.get(
  '/received',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ gifts: await listGifts('g.receiver_id = $1', req.user!.id) });
  })
);

router.get(
  '/sent',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ gifts: await listGifts('g.sender_id = $1', req.user!.id) });
  })
);

export default router;
