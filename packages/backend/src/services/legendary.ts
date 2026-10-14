import { pool } from '../db';
import { toUser, weekStart, UserShape } from '../util';

/**
 * Color of the week: the user whose profile got the most likes in the last 7 days.
 * Shared by GET /api/users/color-of-week and the admin crown-week job.
 */
export async function getColorOfWeek(): Promise<{ user: UserShape | null; weekStart: string }> {
  const { rows } = await pool.query(
    `SELECT u.*, COUNT(pl.id)::int AS like_count
     FROM users u
     JOIN profile_likes pl ON pl.liked_user_id = u.id
     WHERE pl.created_at >= now() - interval '7 days'
     GROUP BY u.id
     ORDER BY like_count DESC
     LIMIT 1`
  );
  return { user: rows.length ? toUser(rows[0]) : null, weekStart: weekStart() };
}

export interface LegendaryResult {
  king: UserShape | null;
  queen: UserShape | null;
  weekStart: string | null;
}

/** Latest computed legendary week (nulls when never crowned). Shared by users + throne routes. */
export async function getLatestLegendary(): Promise<LegendaryResult> {
  const { rows } = await pool.query(
    `SELECT * FROM legendary_weeks ORDER BY week_start DESC LIMIT 1`
  );
  if (!rows.length) return { king: null, queen: null, weekStart: null };
  const lw = rows[0];
  const ids = [lw.king_id, lw.queen_id].filter(Boolean);
  const byId = new Map<string, UserShape>();
  if (ids.length) {
    const users = await pool.query('SELECT * FROM users WHERE id = ANY($1)', [ids]);
    for (const u of users.rows) byId.set(String(u.id), toUser(u));
  }
  return {
    king: lw.king_id ? byId.get(String(lw.king_id)) ?? null : null,
    queen: lw.queen_id ? byId.get(String(lw.queen_id)) ?? null : null,
    // DATE columns come back as full ISO timestamps; the contract uses YYYY-MM-DD.
    weekStart: new Date(lw.week_start as string).toISOString().slice(0, 10),
  };
}
