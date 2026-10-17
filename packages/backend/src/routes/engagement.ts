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

    // JACKPOT: 1% chance to win the entire Vault
    const { winVaultJackpot } = await import('./vault');
    let jackpotWon = 0;
    if (Math.random() < 0.01) {
      jackpotWon = await winVaultJackpot(req.user!.id, 'spin').catch(() => 0);
    }

    await pool.query(
      `INSERT INTO daily_spins (user_id, prize_tokens, streak) VALUES ($1, $2, $3)`,
      [req.user!.id, prize, streak]
    );
    await addTokens(req.user!.id, prize, 'daily_spin', { reference: `spin:${streak}` });
    await awardXp(req.user!.id, 10, 'daily_spin').catch(() => undefined);

    // Publish to win feed (non-critical — don't fail the spin if this breaks)
    await pool.query(
      `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, 'spin', $2, $3)`,
      [req.user!.id, prize + jackpotWon, jackpotWon > 0 ? `JACKPOT! ${streak} day streak` : `${streak} day streak`]
    ).catch(() => undefined);
    // Feed the Vault
    const { contributeToVault } = await import('./vault');
    await contributeToVault(req.user!.id, prize, 'spin').catch(() => undefined);

    // Track season challenge
    const { trackChallenge } = await import('./seasons');
    await trackChallenge(req.user!.id, 'spin').catch(() => undefined);

    emitToAll('engagement:feed', { kind: 'spin', amount: prize + jackpotWon });
    res.json({ prize, streak, bonus: streakBonus, jackpot: jackpotWon });
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

// ============ WELCOME BONUS ============
// One-time 1,000 token bonus for new users
router.post(
  '/welcome-bonus',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Check if already claimed
    const { rows } = await pool.query(
      `SELECT 1 FROM token_transactions WHERE user_id = $1 AND kind = 'bonus' AND reference = 'welcome' LIMIT 1`,
      [req.user!.id]
    );
    if (rows[0]) {
      res.json({ ok: true, alreadyClaimed: true });
      return;
    }
    await addTokens(req.user!.id, 1000, 'bonus', { reference: 'welcome' });
    res.json({ ok: true, amount: 1000 });
  })
);

// ============ ACTIVITY FEED (bigger ticker) ============
// General activity publisher — every significant action lands in the live ticker.
// kinds: gamble | battle | spin | crew_battle | join | level_up | gift | friend_request
//        | friend_accept | crew_formed | battle_start | record | challenge_complete | crown
export async function publishActivity(
  userId: string,
  kind: string,
  detail: string,
  amountTokens: number = 0
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO win_feed (user_id, kind, amount_tokens, detail) VALUES ($1, $2, $3, $4)`,
      [userId, kind, amountTokens, detail]
    );
    // Keep feed trimmed to last 300
    await pool.query(
      `DELETE FROM win_feed WHERE id NOT IN (SELECT id FROM win_feed ORDER BY created_at DESC LIMIT 300)`
    );
    emitToAll('engagement:feed', { kind });
  } catch {
    /* activity feed is best-effort */
  }
}

// ============ DAILY CHALLENGES ("Today on Big Face") ============
interface DailyChallengeDef {
  key: string;
  title: string;
  description: string;
  target: number;
  tokenReward: number;
  xpReward: number;
}

const DAILY_CHALLENGES: DailyChallengeDef[] = [
  { key: 'spin_wheel', title: '🎡 Daily Spinner', description: 'Spin the daily wheel', target: 1, tokenReward: 250, xpReward: 15 },
  { key: 'dice_wins', title: '🎲 Dice Shark', description: 'Win 3 solo dice games', target: 3, tokenReward: 500, xpReward: 25 },
  { key: 'chatter', title: '💬 Social Butterfly', description: 'Send 10 messages', target: 10, tokenReward: 300, xpReward: 20 },
  { key: 'gift_giver', title: '🎁 Generous Heart', description: 'Send 1 gift to someone', target: 1, tokenReward: 400, xpReward: 20 },
  { key: 'high_roller', title: '💰 High Roller', description: 'Win 1,000+ tokens in a single dice roll', target: 1, tokenReward: 600, xpReward: 30 },
  { key: 'crew_player', title: '🛡️ Crew Loyalist', description: 'Be in an active crew battle', target: 1, tokenReward: 400, xpReward: 20 },
  { key: 'early_bird', title: '🔥 On a Roll', description: 'Win 5 solo dice games', target: 5, tokenReward: 750, xpReward: 40 },
];

/** Today's challenge, rotating deterministically by day of year. */
export function getDailyChallenge(date = new Date()): DailyChallengeDef {
  const dayOfYear = Math.floor(date.getTime() / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Compute a user's live progress for a challenge key (today only). */
async function computeChallengeProgress(userId: string, key: string): Promise<number> {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM daily_spins WHERE user_id = $1 AND spun_at > now() - interval '24 hours') AS spins,
       (SELECT COUNT(*)::int FROM token_transactions WHERE user_id = $1 AND kind = 'dice_win' AND created_at > now() - interval '24 hours') AS dice_wins,
       (SELECT COUNT(*)::int FROM token_transactions WHERE user_id = $1 AND kind = 'dice_win' AND amount >= 1000 AND created_at > now() - interval '24 hours') AS big_wins,
       (SELECT COUNT(*)::int FROM messages WHERE sender_id = $1 AND created_at > now() - interval '24 hours') AS messages,
       (SELECT COUNT(*)::int FROM gifts WHERE sender_id = $1 AND created_at > now() - interval '24 hours') AS gifts,
       (SELECT COUNT(*)::int FROM crew_battles cb
          JOIN crew_members cm ON cm.crew_id IN (cb.challenger_crew_id, cb.defender_crew_id)
        WHERE cm.user_id = $1 AND cb.status = 'active' AND cb.ends_at > now()) AS crew_active`,
    [userId]
  );
  const r = rows[0] || {};
  switch (key) {
    case 'spin_wheel': return Math.min(r.spins ?? 0, 1);
    case 'dice_wins': return Math.min(r.dice_wins ?? 0, 3);
    case 'chatter': return Math.min(r.messages ?? 0, 10);
    case 'gift_giver': return Math.min(r.gifts ?? 0, 1);
    case 'high_roller': return Math.min(r.big_wins ?? 0, 1);
    case 'crew_player': return (r.crew_active ?? 0) > 0 ? 1 : 0;
    case 'early_bird': return Math.min(r.dice_wins ?? 0, 5);
    default: return 0;
  }
}

/** Full "Today on Big Face" status: login bonus, spin, daily challenge. */
router.get(
  '/daily',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const challenge = getDailyChallenge();
    const progress = await computeChallengeProgress(userId, challenge.key).catch(() => 0);

    // Upsert progress row
    const date = todayStr();
    await pool.query(
      `INSERT INTO daily_challenge_progress (user_id, challenge_date, challenge_key, progress, completed)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, challenge_date, challenge_key)
       DO UPDATE SET progress = GREATEST(daily_challenge_progress.progress, $4),
                     completed = daily_challenge_progress.completed OR $5,
                     updated_at = now()`,
      [userId, date, challenge.key, progress, progress >= challenge.target]
    ).catch(() => undefined);
    const { rows: prog } = await pool.query(
      `SELECT progress, completed, claimed FROM daily_challenge_progress
       WHERE user_id = $1 AND challenge_date = $2 AND challenge_key = $3`,
      [userId, date, challenge.key]
    ).catch(() => ({ rows: [] as any[] }));
    const prow = prog[0] || { progress, completed: progress >= challenge.target, claimed: false };

    // Spin status
    const { rows: spins } = await pool.query(
      `SELECT spun_at, streak FROM daily_spins WHERE user_id = $1 ORDER BY spun_at DESC LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] as any[] }));
    const last = spins[0];
    let canSpin = true;
    let spinStreak = 0;
    if (last) {
      const daysDiff = Math.floor((Date.now() - new Date(last.spun_at).getTime()) / 86400000);
      if (daysDiff === 0) canSpin = false;
      else if (daysDiff === 1) spinStreak = last.streak;
    }

    // Login bonus status
    const { rows: loginTx } = await pool.query(
      `SELECT id FROM token_transactions WHERE user_id = $1 AND kind = 'bonus' AND reference = $2 LIMIT 1`,
      [userId, `daily_login:${date}`]
    ).catch(() => ({ rows: [] as any[] }));
    const { rows: ustreak } = await pool.query(
      'SELECT login_streak FROM users WHERE id = $1', [userId]
    ).catch(() => ({ rows: [{ login_streak: 0 }] }));

    res.json({
      date,
      login: { claimed: loginTx.length > 0, streak: ustreak[0]?.login_streak ?? 0 },
      spin: { canSpin, streak: spinStreak },
      challenge: {
        key: challenge.key,
        title: challenge.title,
        description: challenge.description,
        target: challenge.target,
        progress: prow.progress,
        completed: prow.completed,
        claimed: prow.claimed,
        tokenReward: challenge.tokenReward,
        xpReward: challenge.xpReward,
      },
    });
  })
);

// Claim a completed daily challenge.
router.post(
  '/daily/challenge/claim',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const challenge = getDailyChallenge();
    const date = todayStr();
    const progress = await computeChallengeProgress(userId, challenge.key).catch(() => 0);

    const { rows } = await pool.query(
      `SELECT completed, claimed FROM daily_challenge_progress
       WHERE user_id = $1 AND challenge_date = $2 AND challenge_key = $3`,
      [userId, date, challenge.key]
    );
    const row = rows[0];
    const completed = row?.completed || progress >= challenge.target;
    if (!completed) throw new HttpError(400, 'Challenge not complete yet.');
    if (row?.claimed) {
      res.json({ ok: true, alreadyClaimed: true });
      return;
    }

    await addTokens(userId, challenge.tokenReward, 'bonus', { reference: `challenge:${date}:${challenge.key}` });
    await awardXp(userId, challenge.xpReward, 'daily_challenge_complete').catch(() => undefined);
    await pool.query(
      `INSERT INTO daily_challenge_progress (user_id, challenge_date, challenge_key, progress, completed, claimed)
       VALUES ($1, $2, $3, $4, true, true)
       ON CONFLICT (user_id, challenge_date, challenge_key)
       DO UPDATE SET claimed = true, completed = true, progress = GREATEST(daily_challenge_progress.progress, $4), updated_at = now()`,
      [userId, date, challenge.key, progress]
    );
    await publishActivity(userId, 'challenge_complete', `completed today's challenge: ${challenge.title}!`, challenge.tokenReward);
    res.json({ ok: true, tokens: challenge.tokenReward, xp: challenge.xpReward });
  })
);

export default router;
