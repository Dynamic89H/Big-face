import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { emitToAll, emitToUser } from '../sockets';

const router = Router();

// ============ CREATOR FUND ============

// Current week status
router.get(
  '/creator-fund',
  requireAuth,
  asyncHandler(async (req, res) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    let { rows } = await pool.query(
      'SELECT * FROM creator_fund_weeks WHERE week_start = $1',
      [weekStart.toISOString().split('T')[0]]
    );
    if (!rows[0]) {
      const created = await pool.query(
        'INSERT INTO creator_fund_weeks (week_start, total_pool) VALUES ($1, 100000) RETURNING *',
        [weekStart.toISOString().split('T')[0]]
      );
      rows = created.rows;
    }

    const { rows: top } = await pool.query(
      `SELECT ce.points, u.display_name, u.profile_color
       FROM creator_earnings ce JOIN users u ON u.id = ce.user_id
       WHERE ce.week_id = $1 ORDER BY ce.points DESC LIMIT 10`,
      [rows[0].id]
    );

    res.json({ week: rows[0], topCreators: top });
  })
);

// Award creator points (called when someone engages with content)
router.post(
  '/creator-fund/points',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { creatorId, points } = z
      .object({ creatorId: z.string().uuid(), points: z.number().min(1).max(100) })
      .parse(req.body);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let { rows: week } = await pool.query(
      'SELECT id FROM creator_fund_weeks WHERE week_start = $1',
      [weekStart.toISOString().split('T')[0]]
    );
    if (!week[0]) {
      const created = await pool.query(
        'INSERT INTO creator_fund_weeks (week_start, total_pool) VALUES ($1, 100000) RETURNING id',
        [weekStart.toISOString().split('T')[0]]
      );
      week = created.rows;
    }

    await pool.query(
      `INSERT INTO creator_earnings (week_id, user_id, points) VALUES ($1, $2, $3)
       ON CONFLICT (week_id, user_id) DO UPDATE SET points = creator_earnings.points + $3`,
      [week[0].id, creatorId, points]
    );
    res.json({ ok: true });
  })
);

// ============ WATCH PARTIES ============
const createPartySchema = z.object({
  title: z.string().min(1).max(100),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['video', 'music']).default('video'),
});

router.post(
  '/watch-party',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, mediaUrl, mediaType } = createPartySchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO watch_parties (host_id, title, media_url, media_type)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.user!.id, title, mediaUrl, mediaType]
    );
    await pool.query('INSERT INTO watch_party_members (party_id, user_id) VALUES ($1, $2)', [
      rows[0].id,
      req.user!.id,
    ]);
    emitToAll('social:watch-party', { partyId: rows[0].id, title });
    res.json({ partyId: rows[0].id });
  })
);

router.get(
  '/watch-parties',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT wp.*, u.display_name AS host_name,
              (SELECT COUNT(*)::int FROM watch_party_members wpm WHERE wpm.party_id = wp.id) AS member_count
       FROM watch_parties wp JOIN users u ON u.id = wp.host_id
       WHERE wp.status IN ('lobby', 'playing', 'paused')
       ORDER BY wp.created_at DESC LIMIT 20`
    );
    res.json({ parties: rows });
  })
);

router.post(
  '/watch-party/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query(
      `INSERT INTO watch_party_members (party_id, user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.params.id, req.user!.id]
    );
    const { rows } = await pool.query('SELECT * FROM watch_parties WHERE id = $1', [req.params.id]);
    res.json({ party: rows[0] });
  })
);

// Host controls playback — syncs to all members
router.post(
  '/watch-party/:id/sync',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status, position } = z
      .object({ status: z.enum(['playing', 'paused']), position: z.number().min(0) })
      .parse(req.body);

    const { rows: party } = await pool.query('SELECT host_id FROM watch_parties WHERE id = $1', [
      req.params.id,
    ]);
    if (!party[0] || party[0].host_id !== req.user!.id) {
      throw new HttpError(403, 'Only the host can control playback');
    }

    await pool.query(
      'UPDATE watch_parties SET status = $1, playback_position = $2 WHERE id = $3',
      [status, position, req.params.id]
    );

    // Get all members and notify them
    const { rows: members } = await pool.query(
      'SELECT user_id FROM watch_party_members WHERE party_id = $1',
      [req.params.id]
    );
    for (const m of members) {
      if (m.user_id !== req.user!.id) {
        emitToUser(m.user_id, 'social:party-sync', {
          partyId: req.params.id,
          status,
          position,
        });
      }
    }
    res.json({ ok: true });
  })
);

// ============ CREW HEISTS ============
const heistSchema = z.object({
  targetName: z.string().min(1).max(50),
  targetValue: z.number().min(1000).max(100000),
  requiredMembers: z.number().min(3).max(20).default(5),
});

const HEIST_TARGETS = [
  { name: 'The Diamond Vault', value: 50000 },
  { name: 'Casino Royale Vault', value: 30000 },
  { name: 'The Gold Reserve', value: 75000 },
  { name: 'Neon Bank', value: 25000 },
];

router.get(
  '/heist/targets',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ targets: HEIST_TARGETS });
  })
);

router.post(
  '/heist/start',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { targetName, targetValue, requiredMembers } = heistSchema.parse(req.body);

    const { rows: mine } = await pool.query(
      'SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1',
      [req.user!.id]
    );
    if (!mine[0]) throw new HttpError(400, 'Join a crew first!');

    // Check no active heist
    const { rows: active } = await pool.query(
      `SELECT id FROM heists WHERE crew_id = $1 AND status IN ('planning', 'active')`,
      [mine[0].crew_id]
    );
    if (active.length > 0) throw new HttpError(400, 'Heist already in progress!');

    const { rows } = await pool.query(
      `INSERT INTO heists (crew_id, target_name, target_value, required_members, status)
       VALUES ($1, $2, $3, $4, 'planning') RETURNING id`,
      [mine[0].crew_id, targetName, targetValue, requiredMembers]
    );
    // Creator auto-joins
    await pool.query('INSERT INTO heist_participants (heist_id, user_id) VALUES ($1, $2)', [
      rows[0].id,
      req.user!.id,
    ]);

    emitToAll('social:heist', { heistId: rows[0].id, crewId: mine[0].crew_id });
    res.json({ heistId: rows[0].id });
  })
);

router.post(
  '/heist/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: heist } = await pool.query('SELECT * FROM heists WHERE id = $1', [req.params.id]);
    if (!heist[0] || !['planning', 'active'].includes(heist[0].status)) {
      throw new HttpError(400, 'Heist not available');
    }

    // Must be in the same crew
    const { rows: mine } = await pool.query(
      'SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1',
      [req.user!.id]
    );
    if (!mine[0] || mine[0].crew_id !== heist[0].crew_id) {
      throw new HttpError(400, 'Only crew members can join');
    }

    await pool.query(
      `INSERT INTO heist_participants (heist_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user!.id]
    );

    // Check if enough members to go active
    const { rows: count } = await pool.query(
      'SELECT COUNT(*)::int AS c FROM heist_participants WHERE heist_id = $1',
      [req.params.id]
    );
    if (count[0].c >= heist[0].required_members && heist[0].status === 'planning') {
      await pool.query(`UPDATE heists SET status = 'active' WHERE id = $1`, [req.params.id]);
      emitToAll('social:heist-active', { heistId: req.params.id });
    }

    res.json({ ok: true, members: count[0].c, required: heist[0].required_members });
  })
);

// Contribute to heist progress
router.post(
  '/heist/:id/contribute',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { points } = z.object({ points: z.number().min(1).max(20) }).parse(req.body);

    const { rows: heist } = await pool.query('SELECT * FROM heists WHERE id = $1', [req.params.id]);
    if (!heist[0] || heist[0].status !== 'active') throw new HttpError(400, 'Heist not active');

    await pool.query(
      'UPDATE heist_participants SET contribution = contribution + $1 WHERE heist_id = $2 AND user_id = $3',
      [points, req.params.id, req.user!.id]
    );
    const { rows: updated } = await pool.query(
      'UPDATE heists SET progress = progress + $1 WHERE id = $2 RETURNING progress, target_value',
      [points, req.params.id]
    );

    // Heist complete!
    if (updated[0].progress >= 100) {
      await pool.query(`UPDATE heists SET status = 'success' WHERE id = $1`, [req.params.id]);
      // Split the prize among participants
      const { rows: participants } = await pool.query(
        'SELECT user_id FROM heist_participants WHERE heist_id = $1',
        [req.params.id]
      );
      const share = Math.floor(updated[0].target_value / participants.length);
      for (const p of participants) {
        await addTokens(p.user_id, share, 'bonus', { reference: `heist:${req.params.id}` });
      }
      emitToAll('social:heist-complete', { heistId: req.params.id, prize: updated[0].target_value });
      return res.json({ ok: true, complete: true, share });
    }

    res.json({ ok: true, progress: updated[0].progress });
  })
);

router.get(
  '/heist/active',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: mine } = await pool.query(
      'SELECT crew_id FROM crew_members WHERE user_id = $1 LIMIT 1',
      [req.user!.id]
    );
    if (!mine[0]) return res.json({ heist: null });

    const { rows } = await pool.query(
      `SELECT h.*, (SELECT COUNT(*)::int FROM heist_participants hp WHERE hp.heist_id = h.id) AS member_count
       FROM heists h WHERE h.crew_id = $1 AND h.status IN ('planning', 'active')
       ORDER BY h.created_at DESC LIMIT 1`,
      [mine[0].crew_id]
    );
    res.json({ heist: rows[0] || null });
  })
);

export default router;
