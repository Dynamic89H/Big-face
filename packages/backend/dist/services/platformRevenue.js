"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPlatformRevenue = recordPlatformRevenue;
exports.totalPlatformRevenue = totalPlatformRevenue;
exports.platformRevenueBySource = platformRevenueBySource;
const db_1 = require("../db");
/**
 * Records Dweezy's cut from any money flow. Call this EVERY time
 * the platform takes a percentage — no silent leaks.
 */
async function recordPlatformRevenue(source, platformCents, opts = {}) {
    if (platformCents <= 0)
        return;
    try {
        await db_1.pool.query(`INSERT INTO platform_revenue (source, user_id, reference, gross_cents, platform_cents)
       VALUES ($1, $2, $3, $4, $5)`, [source, opts.userId ?? null, opts.reference ?? null, opts.grossCents ?? platformCents, platformCents]);
    }
    catch {
        /* revenue tracking is best-effort — never break the transaction */
    }
}
/** Total lifetime platform revenue in cents. */
async function totalPlatformRevenue() {
    const { rows } = await db_1.pool.query('SELECT COALESCE(SUM(platform_cents), 0)::int AS total FROM platform_revenue');
    return Number(rows[0].total);
}
/** Revenue breakdown by source. */
async function platformRevenueBySource() {
    const { rows } = await db_1.pool.query(`SELECT source, COALESCE(SUM(platform_cents), 0)::int AS total, COUNT(*)::int AS count
     FROM platform_revenue GROUP BY source ORDER BY total DESC`);
    return rows.map((r) => ({ source: r.source, total: Number(r.total), count: r.count }));
}
