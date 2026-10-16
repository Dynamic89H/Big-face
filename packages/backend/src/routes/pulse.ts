import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * Pulse — the future of Big Face. Real-time "what's happening now."
 * Aggregates live streams, big wins, rank-ups, vault activity into one living feed.
 */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [streams, wins, vault] = await Promise.all([
      // Live now
      pool.query(
        `SELECT ls.id, ls.title, u.display_name AS host, ls.viewer_count
         FROM live_streams ls JOIN users u ON u.id = ls.host_id
         WHERE ls.status = 'live' ORDER BY ls.viewer_count DESC LIMIT 3`
      ),
      // Biggest recent wins
      pool.query(
        `SELECT wf.kind, wf.amount_tokens, wf.created_at, u.display_name
         FROM win_feed wf JOIN users u ON u.id = wf.user_id
         ORDER BY wf.created_at DESC LIMIT 5`
      ),
      // Vault status
      pool.query(
        `SELECT balance FROM vault ORDER BY week_start DESC LIMIT 1`
      ),
    ]);

    const pulse = [];

    for (const s of streams.rows) {
      pulse.push({
        type: 'live',
        icon: '🔴',
        text: `${s.host} is live: ${s.title}`,
        meta: `${s.viewer_count} watching`,
        id: s.id,
      });
    }

    for (const w of wins.rows) {
      const icon = w.kind === 'spin' ? '🎡' : w.kind === 'dice' ? '🎲' : '💰';
      pulse.push({
        type: 'win',
        icon,
        text: `${w.display_name} won ${Number(w.amount_tokens).toLocaleString()} tokens`,
        meta: new Date(w.created_at).toLocaleTimeString(),
        id: `win-${w.created_at}`,
      });
    }

    if (vault.rows[0]) {
      pulse.push({
        type: 'vault',
        icon: '💰',
        text: `Vault at ${Number(vault.rows[0].balance).toLocaleString()} tokens`,
        meta: 'Someone could win it all',
        id: 'vault',
      });
    }

    res.json({ pulse });
  })
);

export default router;
