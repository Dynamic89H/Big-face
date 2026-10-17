/**
 * Daily push notification sender.
 * Run via cron: sends today's rotating message to all subscribed users,
 * localized to each user's preferred language.
 *
 * Usage: ts-node src/jobs/dailyPush.ts  (or via Railway cron)
 */
import { pool } from '../db';
import { getDailyMessage, pushToUser } from '../services/push';

/**
 * Broadcast today's rotating message to all subscribed users, localized
 * to each user's preferred language.
 * Returns counts; shared by the CLI runner and the /api/admin/daily-push endpoint.
 */
export async function sendDailyPush(): Promise<{ users: number; sent: number; failed: number }> {
  console.log('[daily-push] Starting daily notification broadcast...');

  // Get all users with push subscriptions and their languages.
  const { rows } = await pool.query(
    `SELECT DISTINCT u.id, u.preferred_lang
     FROM users u JOIN push_subscriptions ps ON ps.user_id = u.id`
  );

  console.log(`[daily-push] Found ${rows.length} subscribed users.`);

  let sent = 0;
  let failed = 0;

  // Batch with concurrency cap to avoid serial timeout at scale
  const CONCURRENCY = 20;
  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(({ id, preferred_lang }) =>
        pushToUser(id, { ...getDailyMessage(preferred_lang), url: '/' })
      )
    );
    for (const r of results) {
      if (r.status === 'fulfilled') sent += r.value;
      else { failed++; console.error('[daily-push] Batch send failed:', r.reason); }
    }
  }

  console.log(`[daily-push] Done. Sent ${sent} notifications to ${rows.length} users (${failed} failed).`);
  return { users: rows.length, sent, failed };
}

async function main() {
  const result = await sendDailyPush();
  await pool.end();
  console.log('[daily-push] Result:', result);
  process.exit(0);
}

main().catch((e) => {
  console.error('[daily-push] Fatal error:', e);
  process.exit(1);
});
