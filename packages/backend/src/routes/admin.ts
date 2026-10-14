import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { getColorOfWeek } from '../services/legendary';
import { emitToAll } from '../sockets';

const router = Router();
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
