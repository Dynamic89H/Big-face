"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorOfWeek = getColorOfWeek;
exports.getLatestLegendary = getLatestLegendary;
const db_1 = require("../db");
const util_1 = require("../util");
/**
 * Color of the week: the user whose profile got the most likes in the last 7 days.
 * Shared by GET /api/users/color-of-week and the admin crown-week job.
 */
async function getColorOfWeek() {
    const { rows } = await db_1.pool.query(`SELECT u.*, COUNT(pl.id)::int AS like_count
     FROM users u
     JOIN profile_likes pl ON pl.liked_user_id = u.id
     WHERE pl.created_at >= now() - interval '7 days'
     GROUP BY u.id
     ORDER BY like_count DESC
     LIMIT 1`);
    return { user: rows.length ? (0, util_1.toUser)(rows[0]) : null, weekStart: (0, util_1.weekStart)() };
}
/** Latest computed legendary week (nulls when never crowned). Shared by users + throne routes. */
async function getLatestLegendary() {
    const { rows } = await db_1.pool.query(`SELECT * FROM legendary_weeks ORDER BY week_start DESC LIMIT 1`);
    if (!rows.length)
        return { king: null, queen: null, weekStart: null };
    const lw = rows[0];
    const ids = [lw.king_id, lw.queen_id].filter(Boolean);
    const byId = new Map();
    if (ids.length) {
        const users = await db_1.pool.query('SELECT * FROM users WHERE id = ANY($1)', [ids]);
        for (const u of users.rows)
            byId.set(String(u.id), (0, util_1.toUser)(u));
    }
    return {
        king: lw.king_id ? byId.get(String(lw.king_id)) ?? null : null,
        queen: lw.queen_id ? byId.get(String(lw.queen_id)) ?? null : null,
        // DATE columns come back as full ISO timestamps; the contract uses YYYY-MM-DD.
        weekStart: new Date(lw.week_start).toISOString().slice(0, 10),
    };
}
