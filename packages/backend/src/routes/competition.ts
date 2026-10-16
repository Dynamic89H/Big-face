import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { awardXp } from '../services/xp';
import { emitToAll } from '../sockets';
import { publishWin } from './engagement';

const router = Router();

// ============ TOURNAMENTS ============

// List open tournaments
router.get(
  '/tournaments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT t.*, u.display_name AS winner_name,
              (SELECT COUNT(*)::int FROM tournament_entries te WHERE te.tournament_id = t.id) AS player_count
       FROM tournaments t LEFT JOIN users u ON u.id = t.winner_id
       WHERE t.status IN ('open', 'running')
       ORDER BY t.starts_at ASC LIMIT 10`
    );
    res.json({ tournaments: rows });
  })
);

// Enter a tournament
router.post(
  '/tournaments/:id/enter',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: t } = await pool.query('SELECT * FROM tournaments WHERE id = $1', [req.params.id]);
    if (!t[0]) throw new HttpError(404, 'Tournament not found');
    if (t[0].status !== 'open') throw new HttpError(400, 'Tournament is not open');

    const { rows: existing } = await pool.query(
      'SELECT id FROM tournament_entries WHERE tournament_id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );
    if (existing.length > 0) throw new HttpError(400, 'Already entered');

    // Check player cap
    const { rows: count } = await pool.query(
      'SELECT COUNT(*)::int AS c FROM tournament_entries WHERE tournament_id = $1',
      [req.params.id]
    );
    if (count[0].c >= t[0].max_players) throw new HttpError(400, 'Tournament is full');

    // Deduct entry fee, add to prize pool
    await addTokens(req.user!.id, -t[0].entry_fee, 'dice_bet_escrow', {
      reference: `tournament:${req.params.id}`,
    });
    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(req.user!.id, t[0].entry_fee, 'tournament').catch(() => undefined);
    await pool.query(
      'UPDATE tournaments SET prize_pool = prize_pool + $1 WHERE id = $2',
      [t[0].entry_fee, req.params.id]
    );
    await pool.query(
      'INSERT INTO tournament_entries (tournament_id, user_id) VALUES ($1, $2)',
      [req.params.id, req.user!.id]
    );

    emitToAll('competition:tournament-update', { tournamentId: req.params.id });
    res.json({ ok: true });
  })
);

// Tournament leaderboard
router.get(
  '/tournaments/:id/leaderboard',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT te.*, u.display_name, u.profile_color
       FROM tournament_entries te JOIN users u ON u.id = te.user_id
       WHERE te.tournament_id = $1
       ORDER BY te.score DESC, te.wins DESC LIMIT 50`,
      [req.params.id]
    );
    res.json({ leaderboard: rows });
  })
);

// ============ THRONE ============

// Current king/queen
router.get(
  '/throne/current',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT tr.*, u.display_name, u.profile_color
       FROM throne_reigns tr JOIN users u ON u.id = tr.user_id
       WHERE tr.ends_at > now()
       ORDER BY tr.started_at DESC LIMIT 2`
    );
    res.json({ reigns: rows });
  })
);

// Vote for throne (costs 10 tokens, prevents spam)
router.post(
  '/throne/:id/vote',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: existing } = await pool.query(
      'SELECT id FROM throne_votes WHERE reign_id = $1 AND voter_id = $2',
      [req.params.id, req.user!.id]
    );
    if (existing.length > 0) throw new HttpError(400, 'Already voted');

    await addTokens(req.user!.id, -10, 'bonus', { reference: `throne-vote:${req.params.id}` });
    await pool.query('INSERT INTO throne_votes (reign_id, voter_id) VALUES ($1, $2)', [
      req.params.id,
      req.user!.id,
    ]);
    await pool.query('UPDATE throne_reigns SET votes = votes + 1 WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  })
);

// ============ HALL OF FAME ============
router.get(
  '/hall-of-fame',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT h.*, u.display_name, u.profile_color
       FROM hall_of_fame h JOIN users u ON u.id = h.user_id
       ORDER BY h.earned_at DESC LIMIT 50`
    );
    res.json({ legends: rows });
  })
);

// ============ SHOUTOUTS ============
const shoutoutSchema = z.object({
  message: z.string().min(1).max(140),
});

router.post(
  '/shoutout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { message } = shoutoutSchema.parse(req.body);
    const COST = 250;

    const { rows: user } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [
      req.user!.id,
    ]);
    if (Number(user[0].token_balance) < COST) throw new HttpError(400, 'Not enough tokens');

    await addTokens(req.user!.id, -COST, 'bonus', { reference: 'shoutout' });

    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(req.user!.id, COST, 'shoutout').catch(() => undefined);

    const { rows } = await pool.query(
      `INSERT INTO shoutouts (user_id, message, cost) VALUES ($1, $2, $3) RETURNING id`,
      [req.user!.id, message, COST]
    );

    emitToAll('competition:shoutout', { id: rows[0].id, message, userId: req.user!.id });
    res.json({ ok: true, id: rows[0].id });
  })
);

router.get(
  '/shoutouts/active',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT s.*, u.display_name, u.profile_color
       FROM shoutouts s JOIN users u ON u.id = s.user_id
       WHERE s.ends_at > now()
       ORDER BY s.created_at DESC LIMIT 10`
    );
    res.json({ shoutouts: rows });
  })
);

// ============ PREDICTIONS ============
router.get(
  '/predictions/open',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT p.*, (SELECT COUNT(*)::int FROM prediction_bets pb WHERE pb.prediction_id = p.id) AS bet_count
       FROM predictions p WHERE p.status = 'open' AND p.resolves_at > now()
       ORDER BY p.created_at DESC LIMIT 10`
    );
    res.json({ predictions: rows });
  })
);

const betSchema = z.object({
  optionIndex: z.number().min(0),
  amount: z.number().min(10).max(10000),
});

router.post(
  '/predictions/:id/bet',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { optionIndex, amount } = betSchema.parse(req.body);
    const { rows: p } = await pool.query('SELECT * FROM predictions WHERE id = $1', [req.params.id]);
    if (!p[0] || p[0].status !== 'open') throw new HttpError(400, 'Prediction is not open');
    if (optionIndex >= p[0].options.length) throw new HttpError(400, 'Invalid option');

    await addTokens(req.user!.id, -amount, 'dice_bet_escrow', {
      reference: `prediction:${req.params.id}`,
    });
    await pool.query(
      'INSERT INTO prediction_bets (prediction_id, user_id, option_index, amount) VALUES ($1, $2, $3, $4)',
      [req.params.id, req.user!.id, optionIndex, amount]
    );
    res.json({ ok: true });
  })
);

export default router;
