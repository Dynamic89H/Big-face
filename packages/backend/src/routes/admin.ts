import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { getColorOfWeek } from '../services/legendary';
import { payoutPlatformEarnings, pendingPlatformTotal } from '../services/paypal';
import { emitToAll } from '../sockets';

const router = Router();

// Auto-payout processor — service-key auth (for cron), registered BEFORE the
// admin middleware below. Processes every user with auto-payout enabled whose
// token balance meets their threshold. Failures are logged, tokens stay put.
router.post(
  '/process-auto-payouts',
  asyncHandler(async (req, res) => {
    const apiKey = req.header('x-admin-key');
    const expected = process.env.ADMIN_API_KEY;
    if (!expected || apiKey !== expected) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    const { createPayout } = await import('../services/stripe');
    const { rows: users } = await pool.query(
      `SELECT id, token_balance, auto_payout_threshold_cents
       FROM users
       WHERE auto_payout_enabled = true
         AND stripe_connect_account_id IS NOT NULL
         AND token_balance >= auto_payout_threshold_cents`
    );
    const results: Array<{ userId: string; ok: boolean; note?: string }> = [];
    for (const u of users) {
      const amountCents = Math.min(Number(u.token_balance), Number(u.auto_payout_threshold_cents));
      try {
        await createPayout(String(u.id), amountCents);
        results.push({ userId: String(u.id), ok: true });
      } catch (e: any) {
        results.push({ userId: String(u.id), ok: false, note: e?.message ?? 'unknown' });
      }
    }
    res.json({ processed: results.length, results });
  })
);

router.use(requireAuth, requireAdmin);

const crownWeekSchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'weekStart must be YYYY-MM-DD'),
});

/** Top user of a gender by (xp + profile likes received). */
async function topByGender(gender: 'male' | 'female'): Promise<any | null> {
  const { rows } = await pool.query(
    `SELECT u.*, COUNT(pl.id)::int AS like_count
     FROM users u
     LEFT JOIN profile_likes pl ON pl.liked_user_id = u.id
     WHERE u.gender = $1
     GROUP BY u.id
     ORDER BY (u.xp + COUNT(pl.id)) DESC
     LIMIT 1`,
    [gender]
  );
  return rows[0] ?? null;
}

router.post(
  '/crown-week',
  asyncHandler(async (req, res) => {
    const { weekStart } = crownWeekSchema.parse(req.body);

    const king = await topByGender('male');
    const queen = await topByGender('female');
    const colorOfWeek = await getColorOfWeek();

    // Upsert so re-running a week corrects rather than duplicates.
    await pool.query(
      `INSERT INTO legendary_weeks (week_start, king_id, queen_id, color_of_week_user_id, announced_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (week_start) DO UPDATE SET
         king_id = EXCLUDED.king_id,
         queen_id = EXCLUDED.queen_id,
         color_of_week_user_id = EXCLUDED.color_of_week_user_id,
         announced_at = now()`,
      [
        weekStart,
        king ? king.id : null,
        queen ? queen.id : null,
        colorOfWeek.user ? colorOfWeek.user.id : null,
      ]
    );

    const result = {
      king: king ? toUser(king) : null,
      queen: queen ? toUser(queen) : null,
      colorOfWeek: colorOfWeek.user,
      weekStart,
    };
    // Red carpet moment for everyone connected.
    emitToAll('red:carpet', { king: result.king, queen: result.queen, weekStart });
    res.json({ result });
  })
);

router.get(
  '/reports',
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const allowed = ['open', 'reviewed', 'actioned', 'dismissed'];
    const values: unknown[] = [];
    let where = '';
    if (status) {
      if (!allowed.includes(status)) throw new HttpError(400, `Invalid status: ${status}`);
      values.push(status);
      where = 'WHERE r.status = $1';
    }
    const { rows } = await pool.query(
      `SELECT r.*, to_jsonb(u) AS reporter
       FROM reports r LEFT JOIN users u ON u.id = r.reporter_id
       ${where} ORDER BY r.created_at DESC LIMIT 200`,
      values
    );
    res.json({
      reports: rows.map((r) => ({
        id: String(r.id),
        reporter: r.reporter ? toUser(r.reporter) : null,
        targetType: r.target_type,
        targetId: String(r.target_id),
        reason: r.reason,
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      })),
    });
  })
);

export default router;

// ---- Platform revenue share ----

router.get(
  '/platform-earnings',
  asyncHandler(async (req, res) => {
    const pending = await pendingPlatformTotal();
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(platform_cents), 0)::int AS lifetime FROM platform_earnings`
    );
    res.json({ pendingCents: pending, lifetimeCents: Number(rows[0].lifetime) });
  })
);

router.post(
  '/platform-payout',
  asyncHandler(async (req, res) => {
    const result = await payoutPlatformEarnings();
    if (!result.ok) return res.status(400).json({ error: result.note });
    res.json({ batchId: result.batchId, totalCents: result.totalCents });
  })
);
