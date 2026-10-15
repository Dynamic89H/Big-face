import { pool } from '../db';

export type RevenueSource =
  | 'token_purchase'
  | 'gift_margin'
  | 'tip_margin'
  | 'payout_fee'
  | 'battle_gift_margin';

/**
 * Records Dweezy's cut from any money flow. Call this EVERY time
 * the platform takes a percentage — no silent leaks.
 */
export async function recordPlatformRevenue(
  source: RevenueSource,
  platformCents: number,
  opts: { userId?: string; reference?: string; grossCents?: number } = {}
): Promise<void> {
  if (platformCents <= 0) return;
  try {
    await pool.query(
      `INSERT INTO platform_revenue (source, user_id, reference, gross_cents, platform_cents)
       VALUES ($1, $2, $3, $4, $5)`,
      [source, opts.userId ?? null, opts.reference ?? null, opts.grossCents ?? platformCents, platformCents]
    );
  } catch {
    /* revenue tracking is best-effort — never break the transaction */
  }
}

/** Total lifetime platform revenue in cents. */
export async function totalPlatformRevenue(): Promise<number> {
  const { rows } = await pool.query(
    'SELECT COALESCE(SUM(platform_cents), 0)::int AS total FROM platform_revenue'
  );
  return Number(rows[0].total);
}

/** Revenue breakdown by source. */
export async function platformRevenueBySource(): Promise<Array<{ source: string; total: number; count: number }>> {
  const { rows } = await pool.query(
    `SELECT source, COALESCE(SUM(platform_cents), 0)::int AS total, COUNT(*)::int AS count
     FROM platform_revenue GROUP BY source ORDER BY total DESC`
  );
  return rows.map((r) => ({ source: r.source, total: Number(r.total), count: r.count }));
}
