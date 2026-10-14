"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIFT_CATALOG = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const moderation_1 = require("../middleware/moderation");
const tokens_1 = require("../services/tokens");
const xp_1 = require("../services/xp");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
/** Gift catalog from API_CONTRACT.md. */
exports.GIFT_CATALOG = [
    { key: 'rose', label: 'Rose', tokenCost: 10 },
    { key: 'crown', label: 'Crown', tokenCost: 50 },
    { key: 'throne', label: 'Throne', tokenCost: 100 },
    { key: 'starshower', label: 'Star Shower', tokenCost: 250 },
    { key: 'legend', label: 'Legend', tokenCost: 1000 },
];
/** Receiver keeps 80%; the platform keeps 20%. */
const RECEIVER_SHARE = 0.8;
function toGift(row, sender, receiver) {
    return {
        id: String(row.id),
        sender: (0, util_1.toUser)(sender),
        receiver: (0, util_1.toUser)(receiver),
        giftKey: row.gift_key,
        giftLabel: row.gift_label,
        tokenCost: Number(row.token_cost),
        message: row.message ?? '',
        createdAt: new Date(row.created_at).toISOString(),
    };
}
router.get('/catalog', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    res.json({ gifts: exports.GIFT_CATALOG.map((g) => ({ ...g })) });
}));
const sendGiftSchema = zod_1.z.object({
    receiverId: zod_1.z.string().uuid(),
    giftKey: zod_1.z.string().min(1),
    message: zod_1.z.string().max(500).optional().default(''),
});
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const body = sendGiftSchema.parse(req.body);
    const senderId = req.user.id;
    const gift = exports.GIFT_CATALOG.find((g) => g.key === body.giftKey);
    if (!gift)
        throw new util_1.HttpError(400, `Unknown gift: ${body.giftKey}`);
    if (body.receiverId === senderId)
        throw new util_1.HttpError(400, 'You cannot send a gift to yourself');
    const receiverRes = await db_1.pool.query('SELECT * FROM users WHERE id = $1', [body.receiverId]);
    if (!receiverRes.rows.length)
        throw new util_1.HttpError(404, 'Receiver not found');
    const senderRes = await db_1.pool.query('SELECT * FROM users WHERE id = $1', [senderId]);
    const { text: message } = (0, moderation_1.cleanText)(body.message);
    const receiverCut = Math.floor(gift.tokenCost * RECEIVER_SHARE);
    // Atomic: debit sender, credit receiver 80%, insert gift row — all or nothing.
    const client = await db_1.pool.connect();
    let giftRow;
    try {
        await client.query('BEGIN');
        const bal = await client.query('SELECT token_balance FROM users WHERE id = $1 FOR UPDATE', [
            senderId,
        ]);
        if (Number(bal.rows[0].token_balance) < gift.tokenCost) {
            throw new util_1.HttpError(400, 'Insufficient token balance');
        }
        const inserted = await client.query(`INSERT INTO gifts (sender_id, receiver_id, gift_key, gift_label, token_cost, message)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [senderId, body.receiverId, gift.key, gift.label, gift.tokenCost, message]);
        giftRow = inserted.rows[0];
        await (0, tokens_1.addTokens)(senderId, -gift.tokenCost, 'gift_sent', {
            reference: `gift:${giftRow.id}`,
            client,
        });
        await (0, tokens_1.addTokens)(body.receiverId, receiverCut, 'gift_received', {
            reference: `gift:${giftRow.id}`,
            client,
        });
        await client.query('COMMIT');
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
    // Gift received: +10 XP. Gift sent: +2 XP.
    (0, sockets_1.maybeEmitRankUp)(body.receiverId, await (0, xp_1.awardXp)(body.receiverId, 10, 'gift received'));
    (0, sockets_1.maybeEmitRankUp)(senderId, await (0, xp_1.awardXp)(senderId, 2, 'gift sent'));
    const shaped = toGift(giftRow, senderRes.rows[0], receiverRes.rows[0]);
    (0, sockets_1.emitToUser)(body.receiverId, 'gift:received', { gift: shaped });
    res.status(201).json({ gift: shaped });
}));
async function listGifts(where, userId) {
    const { rows } = await db_1.pool.query(`SELECT g.*, to_jsonb(s) AS sender, to_jsonb(r) AS receiver
     FROM gifts g
     JOIN users s ON s.id = g.sender_id
     JOIN users r ON r.id = g.receiver_id
     WHERE ${where}
     ORDER BY g.created_at DESC LIMIT 100`, [userId]);
    return rows.map((g) => toGift(g, g.sender, g.receiver));
}
router.get('/received', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    res.json({ gifts: await listGifts('g.receiver_id = $1', req.user.id) });
}));
router.get('/sent', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    res.json({ gifts: await listGifts('g.sender_id = $1', req.user.id) });
}));
exports.default = router;
