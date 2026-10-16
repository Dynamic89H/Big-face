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
  { key: 'rose', label: 'Rose', tokenCost: 10 },
  { key: 'crown', label: 'Crown', tokenCost: 50 },
  { key: 'throne', label: 'Throne', tokenCost: 100 },
  { key: 'starshower', label: 'Star Shower', tokenCost: 250 },
  { key: 'legend', label: 'Legend', tokenCost: 1000 },
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
