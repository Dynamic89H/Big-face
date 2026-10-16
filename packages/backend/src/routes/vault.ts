import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { emitToAll } from '../sockets';

const router = Router();

// 2% of every contribution goes to the Vault
export const VAULT_CUT_PCT = 2;

function weekStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

async function getOrCreateVault(): Promise<{ id: string; balance: number }> {
  const ws = weekStart();
  let { rows } = await pool.query('SELECT id, balance FROM vault WHERE week_start = $1', [ws]);
  if (!rows[0]) {
    const created = await pool.query(
      'INSERT INTO vault (week_start, balance) VALUES ($1, 10000) RETURNING id, balance',
      [ws]
    );
    rows = created.rows;
  }
  return rows[0];
}

/**
 * Win the Vault jackpot instantly (e.g. from spin wheel JACKPOT segment).
 * Pays the entire balance to the winner and resets the vault.
 */
export async function winVaultJackpot(userId: string, source: string): Promise<number> {
  const vault = await getOrCreateVault();
  const jackpot = vault.balance;
  if (jackpot <= 0) return 0;

  await pool.query('UPDATE vault SET balance = 0 WHERE id = $1', [vault.id]);
  await pool.query(
    `INSERT INTO vault_winners (vault_id, user_id, amount, source) VALUES ($1, $2, $3, $4)`,
    [vault.id, userId, jackpot, source]
  );

  const { addTokens } = await import('../services/tokens');
  await addTokens(userId, jackpot, 'vault_jackpot', { reference: `jackpot:${vault.id}` });

  const { emitToAll } = await import('../sockets');
  emitToAll('vault:winner', { userId, amount: jackpot });
  emitToAll('vault:update', { balance: 0 });

  return jackpot;
}

/**
 * Contribute to the Vault. Called from any token transaction.
 * Gives the user raffle tickets proportional to their activity.
 */
export async function contributeToVault(
  userId: string,
  amount: number,
  source: string
): Promise<void> {
  try {
    const vault = await getOrCreateVault();
    const cut = Math.max(1, Math.floor((amount * VAULT_CUT_PCT) / 100));
    await pool.query('UPDATE vault SET balance = balance + $1 WHERE id = $2', [cut, vault.id]);
    await pool.query(
      `INSERT INTO vault_contributions (vault_id, user_id, amount, source)
       VALUES ($1, $2, $3, $4)`,
      [vault.id, userId, cut, source]
    );
    // 1 ticket per 100 tokens contributed
    const tickets = Math.max(1, Math.floor(amount / 100));
    await pool.query(
      `INSERT INTO vault_entries (vault_id, user_id, tickets) VALUES ($1, $2, $3)
       ON CONFLICT (vault_id, user_id) DO UPDATE SET tickets = vault_entries.tickets + $3`,
      [vault.id, userId, tickets]
    );
    emitToAll('vault:update', { balance: vault.balance + cut });
  } catch {
    /* vault is best-effort, never break the main transaction */
  }
}

// Get current vault status
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const vault = await getOrCreateVault();
    const { rows: entries } = await pool.query(
      `SELECT COUNT(*)::int AS players, COALESCE(SUM(tickets), 0)::int AS total_tickets
       FROM vault_entries WHERE vault_id = $1`,
      [vault.id]
    );
    const { rows: mine } = await pool.query(
      `SELECT tickets FROM vault_entries WHERE vault_id = $1 AND user_id = $2`,
      [vault.id, req.user!.id]
    );
    const { rows: winners } = await pool.query(
      `SELECT vw.amount, vw.won_at, u.display_name, u.profile_color
       FROM vault_winners vw JOIN users u ON u.id = vw.user_id
       ORDER BY vw.won_at DESC LIMIT 5`
    );
    // Next Friday 8pm
    const now = new Date();
    const friday = new Date(now);
    friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
    friday.setHours(20, 0, 0, 0);
    if (friday <= now) friday.setDate(friday.getDate() + 7);

    res.json({
      balance: vault.balance,
      players: entries[0]?.players || 0,
      totalTickets: entries[0]?.total_tickets || 0,
      myTickets: mine[0]?.tickets || 0,
      drawingAt: friday.toISOString(),
      recentWinners: winners,
    });
  })
);

// Weekly drawing — picks a weighted random winner
router.post(
  '/draw',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Admin only — check via simple key for now
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_API_KEY) {
      res.status(403).json({ error: 'Admin only' });
      return;
    }

    const vault = await getOrCreateVault();
    const { rows: entries } = await pool.query(
      `SELECT user_id, tickets FROM vault_entries WHERE vault_id = $1`,
      [vault.id]
    );
    if (entries.length === 0) {
      res.json({ ok: false, message: 'No entries' });
      return;
    }

    // Weighted random draw
    const total = entries.reduce((s, e) => s + e.tickets, 0);
    let roll = Math.random() * total;
    let winner = entries[0];
    for (const e of entries) {
      roll -= e.tickets;
      if (roll <= 0) {
        winner = e;
        break;
      }
    }

    const prize = vault.balance;
    await addTokens(winner.user_id, prize, 'bonus', { reference: `vault-win:${vault.id}` });
    await pool.query(
      `INSERT INTO vault_winners (vault_id, user_id, amount) VALUES ($1, $2, $3)`,
      [vault.id, winner.user_id, prize]
    );
    // Reset for next week (new vault row will be created)
    await pool.query(`UPDATE vault SET balance = 10000 WHERE id = $1`, [vault.id]);
    await pool.query(`DELETE FROM vault_entries WHERE vault_id = $1`, [vault.id]);

    emitToAll('vault:winner', { userId: winner.user_id, amount: prize });
    res.json({ ok: true, winnerId: winner.user_id, amount: prize });
  })
);

export default router;
