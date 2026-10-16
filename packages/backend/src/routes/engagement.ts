import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { awardXp } from '../services/xp';
import { emitToAll } from '../sockets';

const router = Router();

// ============ SPIN WHEEL ============
// Weighted prizes: [tokens, weight]
const PRIZES: [number, number][] = [
  [50, 30], [100, 25], [250, 20], [500, 12],
  [1000, 8], [2500, 3], [5000, 1.5], [10000, 0.5],
];

function rollPrize(): number {
  const total = PRIZES.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [tokens, w] of PRIZES) {
    r -= w;
    if (r <= 0) return tokens;
  }
  return PRIZES[0][0];
}

// Check spin status + streak
router.get(
  '/spin/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT spun_at, streak FROM daily_spins WHERE user_id = $1 ORDER BY spun_at DESC LIMIT 1`,
      [req.user!.id]
    );
    const last = rows[0];
    const now = new Date();
    let canSpin = true;
    let streak = 0;
    if (last) {
      const lastDate = new Date(last.spun_at);
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / 86400000);
      if (daysDiff === 0) canSpin = false;
      else if (daysDiff === 1) streak = last.streak;
      // else streak resets to 0
    }
    res.json({ canSpin, streak, lastSpin: last?.spun_at || null });
  })
);

// Spin the wheel
router.post(
  '/spin',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Check already spun today
    const { rows: existing } = await pool.query(
      `SELECT id FROM daily_spins WHERE user_id = $1 AND spun_at > now() - interval '24 hours'`,
      [req.user!.id]
    );
    if (existing.length > 0) throw new HttpError(400, 'Already spun today. Come back tomorrow!');

    // Calculate streak
    const { rows: last } = await pool.query(
      `SELECT spun_at, streak FROM daily_spins WHERE user_id = $1 ORDER BY spun_at DESC LIMIT 1`,
      [req.user!.id]
    );
    let streak = 1;
    if (last[0]) {
      const daysDiff = Math.floor((Date.now() - new Date(last[0].spun_at).getTime()) / 86400000);
      if (daysDiff === 1) streak = last[0].streak + 1;
    }

    // Roll prize with streak bonus (10% per streak day, max 100%)
    const basePrize = rollPrize();
    const streakBonus = Math.min(streak * 0.1, 1.0);
    const prize = Math.floor(basePrize * (1 + streakBonus));

    await pool.query(
      `INSERT INTO daily_spins (user_id, prize_tokens, streak) VALUES ($1, $2, $3)`,
      [req.user!.id, prize, streak]
    );
    await addTokens(req.user!.id, prize, 'daily_spin', { reference: `spin:${streak}` });
    await awardXp(req.user!.id, 10, 'daily_spin').catch(() => undefined);

    // Publish to win feed
    await pool.query(
      `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'spin', $2, $3)`,
      [req.user!.id, prize, `${streak} day streak`]
    );
    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(req.user!.id, prize, 'spin').catch(() => undefined);

    emitToAll('engagement:feed', { kind: 'spin', amount: prize });
    res.json({ prize, streak, bonus: streakBonus });
  })
);

// ============ WIN FEED ============
router.get(
  '/feed',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const { rows } = await pool.query(
      `SELECT wf.*, u.display_name, u.profile_color
       FROM win_feed wf JOIN users u ON u.id = wf.user_id
       ORDER BY wf.created_at DESC LIMIT $1`,
      [limit]
    );
    res.json({
      feed: rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        amount: r.amount_tokens,
        detail: r.detail,
        at: r.created_at,
        user: { displayName: r.display_name, profileColor: r.profile_color },
      })),
    });
  })
);

// Internal: publish a win to the feed (called from gamble/battle routes)
export async function publishWin(
  userId: string,
  kind: string,
  amountTokens: number,
  detail?: string
): Promise<void> {
  await pool.query(
    `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, $2, $3, $4)`,
    [userId, kind, amountTokens, detail || null]
  );
  // Keep feed trimmed to last 200
  await pool.query(
    `DELETE FROM win_feed WHERE id NOT IN (SELECT id FROM win_feed ORDER BY created_at DESC LIMIT 200)`
  );
}

// ============ CREW BATTLES ============
const challengeSchema = z.object({ defenderCrewId: z.string().uuid() });

router.post(
  '/crew-battle/challenge',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { defenderCrewId } = challengeSchema.parse(req.body);
    // Get user's crew
    const { rows: mine } = await pool.query(
      `SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1`,
      [req.user!.id]
    );
    if (!mine[0]) throw new HttpError(400, 'Join a crew first!');
    const myCrewId = mine[0].crew_id;
    if (myCrewId === defenderCrewId) throw new HttpError(400, "Can't battle your own crew!");

    // Check no active battle between these crews
    const { rows: existing } = await pool.query(
      `SELECT id FROM crew_battles WHERE status IN ('pending','active')
       AND ((challenger_crew_id = $1 AND defender_crew_id = $2)
        OR (challenger_crew_id = $2 AND defender_crew_id = $1))`,
      [myCrewId, defenderCrewId]
    );
    if (existing.length > 0) throw new HttpError(400, 'Battle already active between these crews!');

    const { rows } = await pool.query(
      `INSERT INTO crew_battles (challenger_crew_id, defender_crew_id, status)
       VALUES ($1, $2, 'active') RETURNING id`,
      [myCrewId, defenderCrewId]
    );
    emitToAll('engagement:crew-battle', { battleId: rows[0].id });
    res.json({ battleId: rows[0].id });
  })
);

router.get(
  '/crew-battle/active',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT cb.*, c1.name AS challenger_name, c2.name AS defender_name,
              c1.xp AS challenger_xp, c2.xp AS defender_xp
       FROM crew_battles cb
       JOIN crews c1 ON c1.id = cb.challenger_crew_id
       JOIN crews c2 ON c2.id = cb.defender_crew_id
       WHERE cb.status = 'active' AND cb.ends_at > now()
       ORDER BY cb.created_at DESC LIMIT 10`
    );
    res.json({ battles: rows });
  })
);

// Score points for your crew (called when members win games)
router.post(
  '/crew-battle/score',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { points } = z.object({ points: z.number().min(1).max(100) }).parse(req.body);
    const { rows: mine } = await pool.query(
      `SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1`,
      [req.user!.id]
    );
    if (!mine[0]) throw new HttpError(400, 'Join a crew first!');
    const myCrewId = mine[0].crew_id;

    // Add to active battles
    await pool.query(
      `UPDATE crew_battles SET
        challenger_score = challenger_score + CASE WHEN challenger_crew_id = $1 THEN $2 ELSE 0 END,
        defender_score = defender_score + CASE WHEN defender_crew_id = $1 THEN $2 ELSE 0 END
       WHERE status = 'active' AND ends_at > now()
       AND (challenger_crew_id = $1 OR defender_crew_id = $1)`,
      [myCrewId, points]
    );
    res.json({ ok: true });
  })
);

export default router;
