"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const tokens_1 = require("../services/tokens");
const xp_1 = require("../services/xp");
const platformRevenue_1 = require("../services/platformRevenue");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
const MIN_BET = 100; // 100 tokens = $1
const MAX_BET = 25000; // 25,000 tokens = $250 — the big money tier
const PLATFORM_CUT_PCT = 10;
// Open games lobby.
router.get('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query(`SELECT g.*, uh.display_name AS host_name, uh.profile_color AS host_color
       FROM dice_games g JOIN users uh ON uh.id = g.host_id
       WHERE g.status = 'waiting' ORDER BY g.bet_tokens DESC LIMIT 20`);
    res.json({ games: rows.map((r) => ({
            id: r.id, betTokens: Number(r.bet_tokens), status: r.status,
            host: { id: r.host_id, displayName: r.host_name, profileColor: r.host_color },
            createdAt: r.created_at,
        })) });
}));
// Create a game (host puts up the bet).
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { betTokens } = zod_1.z.object({
        betTokens: zod_1.z.number().int().min(MIN_BET).max(MAX_BET),
    }).parse(req.body);
    const { rows: bal } = await db_1.pool.query('SELECT token_balance FROM users WHERE id = $1', [req.user.id]);
    if (Number(bal[0].token_balance) < betTokens) {
        throw new util_1.HttpError(400, 'Insufficient token balance');
    }
    // Escrow the host's bet.
    await (0, tokens_1.addTokens)(req.user.id, -betTokens, 'dice_bet_escrow', { reference: 'dice:new' });
    const { rows } = await db_1.pool.query(`INSERT INTO dice_games (host_id, bet_tokens, pot_tokens)
       VALUES ($1, $2, $2) RETURNING *`, [req.user.id, betTokens]);
    (0, sockets_1.emitToAll)('gamble:created', { gameId: rows[0].id, betTokens });
    res.status(201).json({ game: { id: rows[0].id, betTokens } });
}));
// Join as opponent (puts up matching bet, then auto-rolls).
router.post('/:id/join', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('SELECT * FROM dice_games WHERE id = $1', [req.params.id]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Game not found');
    const g = rows[0];
    if (g.status !== 'waiting')
        throw new util_1.HttpError(400, 'Game already started');
    if (g.host_id === req.user.id)
        throw new util_1.HttpError(400, "You can't play yourself");
    const bet = Number(g.bet_tokens);
    const { rows: bal } = await db_1.pool.query('SELECT token_balance FROM users WHERE id = $1', [req.user.id]);
    if (Number(bal[0].token_balance) < bet) {
        throw new util_1.HttpError(400, 'Insufficient token balance to match the bet');
    }
    // Escrow opponent's bet.
    await (0, tokens_1.addTokens)(req.user.id, -bet, 'dice_bet_escrow', { reference: `dice:${g.id}` });
    // Roll the dice!
    const hostRoll = 1 + Math.floor(Math.random() * 6);
    let opponentRoll = 1 + Math.floor(Math.random() * 6);
    // Re-roll ties for a decisive winner.
    while (opponentRoll === hostRoll) {
        opponentRoll = 1 + Math.floor(Math.random() * 6);
    }
    const winnerId = hostRoll > opponentRoll ? g.host_id : req.user.id;
    const pot = bet * 2;
    const platformCut = Math.floor((pot * PLATFORM_CUT_PCT) / 100);
    const winnerPayout = pot - platformCut;
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`UPDATE dice_games SET opponent_id = $1, status = 'finished',
         host_roll = $2, opponent_roll = $3, winner_id = $4,
         pot_tokens = $5, platform_cut = $6, finished_at = now()
         WHERE id = $7`, [req.user.id, hostRoll, opponentRoll, winnerId, pot, platformCut, g.id]);
        await client.query('COMMIT');
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
    // Pay the winner.
    await (0, tokens_1.addTokens)(winnerId, winnerPayout, 'dice_win', { reference: `dice:${g.id}` });
    // Dweezy's 10% cut on every dice game.
    await (0, platformRevenue_1.recordPlatformRevenue)('dice_margin', platformCut, {
        userId: winnerId,
        reference: `dice:${g.id}`,
        grossCents: pot,
    });
    // XP for both players.
    await (0, xp_1.awardXp)(winnerId, 30, 'dice_win').catch(() => undefined);
    const loserId = winnerId === g.host_id ? req.user.id : g.host_id;
    await (0, xp_1.awardXp)(loserId, 10, 'dice_play').catch(() => undefined);
    const result = {
        gameId: g.id, hostRoll, opponentRoll, winnerId,
        potTokens: pot, winnerPayout, platformCut,
    };
    (0, sockets_1.emitToAll)('gamble:finished', result);
    (0, sockets_1.emitToUser)(g.host_id, 'gamble:result', result);
    (0, sockets_1.emitToUser)(req.user.id, 'gamble:result', result);
    res.json(result);
}));
// Cancel a waiting game (refund escrow).
router.post('/:id/cancel', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('SELECT * FROM dice_games WHERE id = $1', [req.params.id]);
    if (!rows.length)
        throw new util_1.HttpError(404, 'Game not found');
    const g = rows[0];
    if (g.host_id !== req.user.id)
        throw new util_1.HttpError(403, 'Only the host can cancel');
    if (g.status !== 'waiting')
        throw new util_1.HttpError(400, 'Game already started');
    await (0, tokens_1.addTokens)(req.user.id, Number(g.bet_tokens), 'dice_refund', { reference: `dice:${g.id}` });
    await db_1.pool.query(`UPDATE dice_games SET status = 'cancelled' WHERE id = $1`, [g.id]);
    (0, sockets_1.emitToAll)('gamble:cancelled', { gameId: g.id });
    res.json({ ok: true });
}));
// My game history.
router.get('/mine', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query(`SELECT * FROM dice_games
       WHERE (host_id = $1 OR opponent_id = $1) AND status = 'finished'
       ORDER BY finished_at DESC LIMIT 20`, [req.user.id]);
    res.json({ games: rows.map((r) => ({
            id: r.id, betTokens: Number(r.bet_tokens),
            hostRoll: r.host_roll, opponentRoll: r.opponent_roll,
            winnerId: r.winner_id, won: r.winner_id === req.user.id,
            potTokens: Number(r.pot_tokens),
            finishedAt: r.finished_at,
        })) });
}));
exports.default = router;
