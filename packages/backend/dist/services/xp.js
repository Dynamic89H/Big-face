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
    if (rows.length) {
        const { rows: u } = await db_1.pool.query('SELECT login_streak FROM users WHERE id = $1', [userId]);
        return { awarded: false, streak: u[0]?.login_streak ?? 0, xp: 0 };
    }
    // Streak logic: consecutive days increment, gap resets to 1.
    const { rows: u } = await db_1.pool.query('SELECT login_streak, last_login_date FROM users WHERE id = $1', [userId]);
    const prev = u[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = 1;
    if (prev?.last_login_date) {
        const last = new Date(prev.last_login_date).toISOString().slice(0, 10);
        if (last === yesterday)
            streak = (prev.login_streak ?? 0) + 1;
        else if (last === today)
            streak = prev.login_streak ?? 1;
    }
    // Escalating rewards: base 10 XP + 5 per streak day, capped at +50. Weekly bonus at 7.
    const xp = Math.min(10 + (streak - 1) * 5, 50);
    await awardXp(userId, xp, 'daily login streak');
    await db_1.pool.query(`INSERT INTO token_transactions (user_id, amount, kind, reference) VALUES ($1, 0, 'bonus', $2)`, [userId, reference]);
    await db_1.pool.query('UPDATE users SET login_streak = $1, last_login_date = $2 WHERE id = $3', [streak, today, userId]);
    // 7-day streak bonus: 100 tokens.
    if (streak % 7 === 0) {
        await db_1.pool.query(`INSERT INTO wallet_transactions (user_id, kind, amount, reason)
       VALUES ($1, 'credit', 100, 'weekly_streak_bonus')`, [userId]).catch(() => undefined);
    }
    return { awarded: true, streak, xp };
}
