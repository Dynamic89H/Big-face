import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { awardXp } from '../services/xp';
import { recordPlatformRevenue } from '../services/platformRevenue';
import { emitToAll, emitToUser } from '../sockets';

const router = Router();

const MIN_BET = 100; // 100 tokens = $1
const MAX_BET = 25000; // 25,000 tokens = $250 — the big money tier
const PLATFORM_CUT_PCT = 10;

// Open games lobby.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT g.*, uh.display_name AS host_name, uh.profile_color AS host_color
       FROM dice_games g JOIN users uh ON uh.id = g.host_id
       WHERE g.status = 'waiting' ORDER BY g.bet_tokens DESC LIMIT 20`
    );
    res.json({ games: rows.map((r) => ({
      id: r.id, betTokens: Number(r.bet_tokens), status: r.status,
      host: { id: r.host_id, displayName: r.host_name, profileColor: r.host_color },
      createdAt: r.created_at,
    })) });
  })
);

// Hot games — biggest recent finished games for spectators
router.get(
  '/hot',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT g.*, uh.display_name AS host_name, uh.profile_color AS host_color,
              uo.display_name AS opponent_name, uw.display_name AS winner_name
       FROM dice_games g
       JOIN users uh ON uh.id = g.host_id
       LEFT JOIN users uo ON uo.id = g.opponent_id
       LEFT JOIN users uw ON uw.id = g.winner_id
       WHERE g.status = 'finished'
       ORDER BY g.bet_tokens DESC LIMIT 10`
    );
    res.json({ games: rows.map((r) => ({
      id: r.id,
      betTokens: Number(r.bet_tokens),
      pot: Number(r.bet_tokens) * 2 * 0.9,
      host: { displayName: r.host_name, profileColor: r.host_color },
      opponentName: r.opponent_name,
      winnerName: r.winner_name,
      hostRoll: r.host_roll,
      opponentRoll: r.opponent_roll,
      createdAt: r.created_at,
    })) });
  })
);

// Create a game (host puts up the bet).
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { betTokens } = z.object({
      betTokens: z.number().int().min(MIN_BET).max(MAX_BET),
    }).parse(req.body);

    const { rows: bal } = await pool.query(
      'SELECT token_balance FROM users WHERE id = $1', [req.user!.id]
    );
    if (Number(bal[0].token_balance) < betTokens) {
      throw new HttpError(400, 'Insufficient token balance');
    }

    // Escrow the host's bet.
    await addTokens(req.user!.id, -betTokens, 'dice_bet_escrow', { reference: 'dice:new' });

    const { rows } = await pool.query(
      `INSERT INTO dice_games (host_id, bet_tokens, pot_tokens)
       VALUES ($1, $2, $2) RETURNING *`,
      [req.user!.id, betTokens]
    );
    emitToAll('gamble:created', { gameId: rows[0].id, betTokens });
    res.status(201).json({ game: { id: rows[0].id, betTokens } });
  })
);

// Join as opponent (puts up matching bet, then auto-rolls).
router.post(
  '/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM dice_games WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Game not found');
    const g = rows[0];
    if (g.status !== 'waiting') throw new HttpError(400, 'Game already started');
    if (g.host_id === req.user!.id) throw new HttpError(400, "You can't play yourself");

    const bet = Number(g.bet_tokens);
    const { rows: bal } = await pool.query(
      'SELECT token_balance FROM users WHERE id = $1', [req.user!.id]
    );
    if (Number(bal[0].token_balance) < bet) {
      throw new HttpError(400, 'Insufficient token balance to match the bet');
    }

    // Escrow opponent's bet.
    await addTokens(req.user!.id, -bet, 'dice_bet_escrow', { reference: `dice:${g.id}` });

    // Roll the dice!
    const hostRoll = 1 + Math.floor(Math.random() * 6);
    let opponentRoll = 1 + Math.floor(Math.random() * 6);
    // Re-roll ties for a decisive winner.
    while (opponentRoll === hostRoll) {
      opponentRoll = 1 + Math.floor(Math.random() * 6);
    }

    const winnerId = hostRoll > opponentRoll ? g.host_id : req.user!.id;
    const pot = bet * 2;
    const platformCut = Math.floor((pot * PLATFORM_CUT_PCT) / 100);
    const winnerPayout = pot - platformCut;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE dice_games SET opponent_id = $1, status = 'finished',
         host_roll = $2, opponent_roll = $3, winner_id = $4,
         pot_tokens = $5, platform_cut = $6, finished_at = now()
         WHERE id = $7`,
        [req.user!.id, hostRoll, opponentRoll, winnerId, pot, platformCut, g.id]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    // Pay the winner.
    await addTokens(winnerId, winnerPayout, 'dice_win', { reference: `dice:${g.id}` });

    // Publish to the live win feed + score crew battle points
    const { publishWin } = await import('./engagement');
    await publishWin(winnerId, 'gamble', winnerPayout, `${bet} token dice game`).catch(() => undefined);
    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(winnerId, winnerPayout, 'bet').catch(() => undefined);

    // Dweezy's 10% cut on every dice game.
    await recordPlatformRevenue('dice_margin', platformCut, {
      userId: winnerId,
      reference: `dice:${g.id}`,
      grossCents: pot,
    });

    // XP for both players.
    await awardXp(winnerId, 30, 'dice_win').catch(() => undefined);
    const loserId = winnerId === g.host_id ? req.user!.id : g.host_id;
    await awardXp(loserId, 10, 'dice_play').catch(() => undefined);

    const result = {
      gameId: g.id, hostRoll, opponentRoll, winnerId,
      potTokens: pot, winnerPayout, platformCut,
    };
    emitToAll('gamble:finished', result);
    emitToUser(g.host_id, 'gamble:result', result);
    emitToUser(req.user!.id, 'gamble:result', result);

    res.json(result);
  })
);

// Solo roll — player vs the house. Instant, no waiting for opponents.
router.post(
  '/solo',
  requireAuth,
  asyncHandler(async (req, res) => {
    const schema = z.object({ betTokens: z.number().int().min(MIN_BET).max(MAX_BET) });
    const { betTokens: bet } = schema.parse(req.body);
    const userId = req.user!.id;

    const { rows: bal } = await pool.query(
      'SELECT token_balance FROM users WHERE id = $1', [userId]
    );
    const balance = Number(bal[0]?.token_balance || 0);

    // Broke-state rescue: at 0 tokens, give 2,000 on the house — max once per 24h
    if (balance < MIN_BET) {
      const { rows: recentRescue } = await pool.query(
        `SELECT id FROM token_transactions
         WHERE user_id = $1 AND kind = 'bonus' AND reference = 'broke_rescue'
         AND created_at > now() - interval '24 hours' LIMIT 1`,
        [userId]
      );
      if (recentRescue.length > 0) {
        throw new HttpError(400, 'Out of tokens. Come back tomorrow for a rescue refill, or spin the daily wheel!');
      }
      await addTokens(userId, 2000, 'bonus', { reference: 'broke_rescue' });
      // Continue with the roll using the rescue tokens
    }

    const { rows: balAfter } = await pool.query(
      'SELECT token_balance FROM users WHERE id = $1', [userId]
    );
    if (Number(balAfter[0]?.token_balance || 0) < bet) {
      throw new HttpError(400, 'Insufficient token balance');
    }

    // Take the bet
    await addTokens(userId, -bet, 'dice_bet_escrow', { reference: `solo:${Date.now()}` });

    // Scripted first win: new players always win their first 3 solo rolls
    const { rows: rollCount } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM token_transactions WHERE user_id = $1 AND kind = 'dice_bet_escrow'`,
      [userId]
    );
    const isNewPlayer = (rollCount[0]?.c || 0) <= 3;

    // Roll!
    const playerRoll = 1 + Math.floor(Math.random() * 6);
    let houseRoll: number;
    if (isNewPlayer) {
      // Guaranteed win: house always rolls strictly lower (no ties)
      houseRoll = Math.max(1, playerRoll - 1);
      if (playerRoll > 1 && Math.random() < 0.5) {
        houseRoll = Math.max(1, playerRoll - 2);
      }
    } else {
      houseRoll = 1 + Math.floor(Math.random() * 6);
      while (houseRoll === playerRoll) {
        houseRoll = 1 + Math.floor(Math.random() * 6);
      }
    }

    const won = playerRoll > houseRoll;
    const pot = bet * 2;
    const platformCut = Math.floor((pot * PLATFORM_CUT_PCT) / 100);
    const payout = won ? pot - platformCut : 0;

    if (won) {
      await addTokens(userId, payout, 'dice_win', { reference: `solo:${Date.now()}` });
      await awardXp(userId, 30, 'dice_solo_win').catch(() => undefined);
      const { publishWin } = await import('./engagement');
      await publishWin(userId, 'gamble', payout, `${bet} token solo dice`).catch(() => undefined);
      // Tournament scoring: add payout to score in active dice tournaments the user entered
      await pool.query(
        `UPDATE tournament_entries te
         SET score = score + $1, wins = wins + 1
         FROM tournaments t
         WHERE te.tournament_id = t.id
           AND te.user_id = $2
           AND t.kind = 'dice'
           AND t.status IN ('open', 'running')
           AND t.ends_at > now()`,
        [payout, userId]
      ).catch(() => undefined);

      // All-time high score: biggest solo payout ever. New record = global push.
      try {
        const { rows: rec } = await pool.query(
          `INSERT INTO user_records (user_id, best_solo_payout, best_solo_bet)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id) DO UPDATE
             SET best_solo_payout = GREATEST(user_records.best_solo_payout, $2),
                 best_solo_bet = GREATEST(user_records.best_solo_bet, $3),
                 updated_at = now()
           RETURNING best_solo_payout`,
          [userId, payout, bet]
        ).catch(() => ({ rows: [] as any[] }));
        if (rec.length) {
          const { rows: global } = await pool.query(
            `SELECT MAX(best_solo_payout)::int AS max_payout FROM user_records`
          ).catch(() => ({ rows: [{ max_payout: 0 }] }));
          if (payout >= (global[0]?.max_payout ?? 0) && payout > 0) {
            const { rows: u } = await pool.query(
              'SELECT display_name, username FROM users WHERE id = $1', [userId]
            ).catch(() => ({ rows: [] as any[] }));
            const nm = u[0]?.display_name || u[0]?.username || 'Someone';
            const { publishActivity } = await import('./engagement');
            await publishActivity(userId, 'record', `🔥 NEW ALL-TIME RECORD! ${nm} won ${payout.toLocaleString()} tokens on solo dice!`, payout);
            const { pushToAll } = await import('../services/push');
            await pushToAll({
              title: '🔥 New Big Face record!',
              body: `${nm} just won ${payout.toLocaleString()} tokens on solo dice — the biggest win ever!`,
              url: '/gamble',
            }).catch(() => undefined);
          }
        }
      } catch {
        /* records are best-effort */
      }
    } else {
      await awardXp(userId, 10, 'dice_solo_play').catch(() => undefined);
    }

    // House cut
    await recordPlatformRevenue('dice_margin', won ? platformCut : bet, {
      userId,
      reference: `solo:${Date.now()}`,
      grossCents: bet,
    });

    res.json({ playerRoll, houseRoll, won, payout });
  })
);

// Cancel a waiting game (refund escrow).
router.post(
  '/:id/cancel',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM dice_games WHERE id = $1', [req.params.id]);
    if (!rows.length) throw new HttpError(404, 'Game not found');
    const g = rows[0];
    if (g.host_id !== req.user!.id) throw new HttpError(403, 'Only the host can cancel');
    if (g.status !== 'waiting') throw new HttpError(400, 'Game already started');

    await addTokens(req.user!.id, Number(g.bet_tokens), 'dice_refund', { reference: `dice:${g.id}` });
    await pool.query(`UPDATE dice_games SET status = 'cancelled' WHERE id = $1`, [g.id]);
    emitToAll('gamble:cancelled', { gameId: g.id });
    res.json({ ok: true });
  })
);

// My game history.
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT * FROM dice_games
       WHERE (host_id = $1 OR opponent_id = $1) AND status = 'finished'
       ORDER BY finished_at DESC LIMIT 20`,
      [req.user!.id]
    );
    res.json({ games: rows.map((r) => ({
      id: r.id, betTokens: Number(r.bet_tokens),
      hostRoll: r.host_roll, opponentRoll: r.opponent_roll,
      winnerId: r.winner_id, won: r.winner_id === req.user!.id,
      potTokens: Number(r.pot_tokens),
      finishedAt: r.finished_at,
    })) });
  })
);

export default router;
