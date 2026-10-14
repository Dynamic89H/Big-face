"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelForXp = levelForXp;
exports.xpForLevel = xpForLevel;
exports.tierForLevel = tierForLevel;
exports.awardXp = awardXp;
exports.awardDailyLoginXp = awardDailyLoginXp;
const db_1 = require("../db");
/** level = floor(sqrt(xp / 100)) + 1  (per API_CONTRACT.md) */
function levelForXp(xp) {
    return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}
/** Total XP required to *reach* a given level (level 1 needs 0). */
function xpForLevel(level) {
    return 100 * Math.pow(Math.max(0, level - 1), 2);
}
/** Throne tier derived from level (per API_CONTRACT.md). */
function tierForLevel(level) {
    if (level <= 2)
        return 'Rising';
    if (level <= 4)
        return 'Seat';
    if (level <= 6)
        return 'Throne';
    if (level <= 9)
        return 'Golden Throne';
    return 'Legendary Throne';
}
/**
 * Adds XP to a user and bumps their stored level when they cross a threshold.
 * `reason` is informational (a future xp_ledger could consume it).
 */
async function awardXp(userId, amount, _reason) {
    const { rows } = await db_1.pool.query(`UPDATE users SET xp = xp + $1, updated_at = now() WHERE id = $2 RETURNING xp, level`, [amount, userId]);
    if (!rows.length)
        throw new Error('User not found');
    const xp = Number(rows[0].xp);
    const newLevel = levelForXp(xp);
    if (newLevel > Number(rows[0].level)) {
        await db_1.pool.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
        return { leveledUp: true, level: newLevel, xp };
    }
    return { leveledUp: false, level: Number(rows[0].level), xp };
}
/**
 * Awards the daily-login +10 XP, at most once per calendar day.
 * Idempotency is tracked with a zero-amount `bonus` ledger row
 * (`daily_login:YYYY-MM-DD`) — cheap and survives restarts.
 * Note: two concurrent logins could theoretically double-award; the
 * window is tiny and the consequence is +10 XP, so no lock is taken.
 */
async function awardDailyLoginXp(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const reference = `daily_login:${today}`;
    const { rows } = await db_1.pool.query(`SELECT id FROM token_transactions WHERE user_id = $1 AND kind = 'bonus' AND reference = $2 LIMIT 1`, [userId, reference]);
    if (rows.length)
        return false;
    await awardXp(userId, 10, 'daily login');
    await db_1.pool.query(`INSERT INTO token_transactions (user_id, amount, kind, reference) VALUES ($1, 0, 'bonus', $2)`, [userId, reference]);
    return true;
}
