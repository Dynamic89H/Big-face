"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Daily push notification sender.
 * Run via cron: sends today's rotating message to all subscribed users,
 * localized to each user's preferred language.
 *
 * Usage: ts-node src/jobs/dailyPush.ts  (or via Railway cron)
 */
const db_1 = require("../db");
const push_1 = require("../services/push");
async function main() {
    console.log('[daily-push] Starting daily notification broadcast...');
    // Get all users with push subscriptions and their languages.
    const { rows } = await db_1.pool.query(`SELECT DISTINCT u.id, u.preferred_lang
     FROM users u JOIN push_subscriptions ps ON ps.user_id = u.id`);
    console.log(`[daily-push] Found ${rows.length} subscribed users.`);
    let sent = 0;
    let failed = 0;
    for (const { id, preferred_lang } of rows) {
        try {
            const msg = (0, push_1.getDailyMessage)(preferred_lang);
            const n = await (0, push_1.pushToUser)(id, {
                ...msg,
                url: '/',
            });
            sent += n;
        }
        catch (e) {
            failed++;
            console.error(`[daily-push] Failed for user ${id}:`, e);
        }
    }
    console.log(`[daily-push] Done. Sent ${sent} notifications to ${rows.length} users (${failed} failed).`);
    await db_1.pool.end();
    process.exit(0);
}
main().catch((e) => {
    console.error('[daily-push] Fatal error:', e);
    process.exit(1);
});
