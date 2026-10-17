import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { awardXp } from '../services/xp';
import { emitToAll } from '../sockets';

const router = Router();

/**
 * Resolves crew wars past their ends_at: sets status='ended', records the
 * winner (higher score; ties go to the defender — home advantage), increments
 * the winner's war-win count, and awards victory XP to winning members.
 * Called lazily whenever active wars are listed so no separate scheduler is needed.
 */
async function resolveExpiredWars(): Promise<void> {
  const { rows: expired } = await pool.query(
    `SELECT id, challenger_crew_id, defender_crew_id, challenger_score, defender_score
     FROM crew_wars WHERE status = 'live' AND ends_at IS NOT NULL AND ends_at <= now()`
  );
  for (const w of expired) {
    const cScore = Number(w.challenger_score);
    const dScore = Number(w.defender_score);
    const winnerId = cScore > dScore ? w.challenger_crew_id : w.defender_crew_id;
    await pool.query(
      `UPDATE crew_wars SET status = 'ended', winner_crew_id = $2 WHERE id = $1`,
      [w.id, winnerId]
    );
    await pool.query(`UPDATE crews SET wins = wins + 1 WHERE id = $1`, [winnerId]);
    const { rows: members } = await pool.query(
      'SELECT user_id FROM crew_members WHERE crew_id = $1', [winnerId]
    );
    for (const m of members) {
      await awardXp(m.user_id, 100, 'crew_war_victory').catch(() => undefined);
    }
    emitToAll('crew:war-ended', {
      warId: w.id,
      winnerCrewId: winnerId,
      challengerScore: cScore,
      defenderScore: dScore,
    });
  }
}

// List crews, ranked by XP.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT c.*, u.display_name AS leader_name,
              (SELECT COUNT(*)::int FROM crew_members cm WHERE cm.crew_id = c.id) AS member_count
       FROM crews c JOIN users u ON u.id = c.leader_id
       ORDER BY c.total_xp DESC LIMIT 50`
    );
    res.json({ crews: rows.map((r) => ({
      id: r.id, name: r.name, tag: r.tag, description: r.description,
      color: r.color, totalXp: Number(r.total_xp), wins: Number(r.wins),
      memberCount: r.member_count, leaderName: r.leader_name,
    })) });
  })
);

// My crew.
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT c.*, cm.role FROM crews c
       JOIN crew_members cm ON cm.crew_id = c.id
       WHERE cm.user_id = $1 LIMIT 1`,
      [req.user!.id]
    );
    if (!rows.length) return res.json({ crew: null });
    const c = rows[0];
    const { rows: members } = await pool.query(
      `SELECT u.id, u.display_name, u.username, cm.role, u.xp FROM crew_members cm
       JOIN users u ON u.id = cm.user_id WHERE cm.crew_id = $1 ORDER BY u.xp DESC`,
      [c.id]
    );
    res.json({
      crew: {
        id: c.id, name: c.name, tag: c.tag, description: c.description,
        color: c.color, totalXp: Number(c.total_xp), wins: Number(c.wins),
        role: c.role,
        members: members.map((m) => ({ id: m.id, displayName: m.display_name, username: m.username, role: m.role, xp: m.xp })),
      },
    });
  })
);

// Create a crew.
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, tag, description, color } = z.object({
      name: z.string().min(3).max(40),
      tag: z.string().min(2).max(6).regex(/^[A-Za-z0-9]+$/),
      description: z.string().max(300).optional().default(''),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#0066FF'),
    }).parse(req.body);

    const { rows: existing } = await pool.query(
      'SELECT 1 FROM crew_members WHERE user_id = $1 LIMIT 1', [req.user!.id]
    );
    if (existing.length) throw new HttpError(400, 'You are already in a crew — leave it first');

    const { rows } = await pool.query(
      `INSERT INTO crews (name, tag, description, leader_id, color)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim(), tag.toUpperCase(), description.trim(), req.user!.id, color]
    ).catch((e: any) => {
      if (e.code === '23505') throw new HttpError(409, 'Crew name or tag is taken');
      throw e;
    });
    await pool.query(
      `INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1, $2, 'leader')`,
      [rows[0].id, req.user!.id]
    );
    await awardXp(req.user!.id, 50, 'crew_founded').catch(() => undefined);

    // Engagement: ticker entry for the new crew
    try {
      const { publishActivity } = await import('./engagement');
      await publishActivity(req.user!.id, 'crew_formed', `formed a new crew: ${rows[0].name} ${rows[0].tag ? `[${rows[0].tag}]` : ''}`);
    } catch {
      /* engagement is best-effort */
    }
    res.status(201).json({ crew: { id: rows[0].id, name: rows[0].name, tag: rows[0].tag } });
  })
);

// Join a crew.
router.post(
  '/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: existing } = await pool.query(
      'SELECT 1 FROM crew_members WHERE user_id = $1 LIMIT 1', [req.user!.id]
    );
    if (existing.length) throw new HttpError(400, 'You are already in a crew');
    const { rows: crew } = await pool.query('SELECT id FROM crews WHERE id = $1', [req.params.id]);
    if (!crew.length) throw new HttpError(404, 'Crew not found');
    await pool.query(
      'INSERT INTO crew_members (crew_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, req.user!.id]
    );
    // Backfill: the joiner's existing XP counts toward the crew total.
    // (Future gains flow in via awardXp; leave subtracts current xp to keep it balanced.)
    await pool.query(
      `UPDATE crews SET total_xp = total_xp + COALESCE((SELECT xp FROM users WHERE id = $1), 0)
       WHERE id = $2`,
      [req.user!.id, req.params.id]
    );
    await awardXp(req.user!.id, 20, 'crew_joined').catch(() => undefined);
    res.json({ ok: true });
  })
);

// Leave crew.
router.post(
  '/leave',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'SELECT crew_id, role FROM crew_members WHERE user_id = $1', [req.user!.id]
    );
    if (!rows.length) throw new HttpError(400, 'You are not in a crew');
    if (rows[0].role === 'leader') {
      throw new HttpError(400, 'Leaders cannot leave — transfer leadership or disband the crew');
    }
    // Remove the leaver's contribution: their current xp was either backfilled
    // at join time or accrued incrementally via awardXp — subtracting it now
    // nets their tenure to zero and prevents join/leave inflation farming.
    await pool.query(
      `UPDATE crews SET total_xp = GREATEST(0, total_xp - COALESCE((SELECT xp FROM users WHERE id = $1), 0))
       WHERE id = $2`,
      [req.user!.id, rows[0].crew_id]
    );
    await pool.query('DELETE FROM crew_members WHERE user_id = $1', [req.user!.id]);
    res.json({ ok: true });
  })
);

// Challenge another crew to war (leader only). War = 24h XP race.
router.post(
  '/war/:crewId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: mine } = await pool.query(
      `SELECT c.id FROM crews c JOIN crew_members cm ON cm.crew_id = c.id
       WHERE cm.user_id = $1 AND cm.role = 'leader' LIMIT 1`,
      [req.user!.id]
    );
    if (!mine.length) throw new HttpError(403, 'Only crew leaders can declare war');
    if (mine[0].id === req.params.crewId) throw new HttpError(400, "You can't war your own crew");

    const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const { rows } = await pool.query(
      `INSERT INTO crew_wars (challenger_crew_id, defender_crew_id, status, ends_at)
       VALUES ($1, $2, 'live', $3) RETURNING *`,
      [mine[0].id, req.params.crewId, endsAt.toISOString()]
    );
    emitToAll('crew:war', { warId: rows[0].id, challenger: mine[0].id, defender: req.params.crewId });

    // Engagement: ticker + push every defender crew member (best-effort)
    try {
      const { rows: names } = await pool.query(
        `SELECT c1.name AS challenger_name, c2.name AS defender_name
         FROM crews c1, crews c2 WHERE c1.id = $1 AND c2.id = $2`,
        [mine[0].id, req.params.crewId]
      );
      const { publishActivity } = await import('./engagement');
      await publishActivity(
        req.user!.id, 'crew_battle',
        `⚔️ WAR! ${names[0]?.challenger_name || 'A crew'} declared war on ${names[0]?.defender_name || 'a crew'}!`
      );
      const { rows: defenders } = await pool.query(
        'SELECT user_id FROM crew_members WHERE crew_id = $1', [req.params.crewId]
      );
      const { pushToUser } = await import('../services/push');
      await Promise.allSettled(
        defenders
          .filter((d: any) => d.user_id !== req.user!.id)
          .map((d: any) => pushToUser(d.user_id, {
            title: '⚔️ Your crew is under attack!',
            body: `${names[0]?.challenger_name || 'An enemy crew'} declared war. Score XP to defend!`,
            url: '/crews',
          }).catch(() => undefined))
      );
    } catch {
      /* engagement is best-effort */
    }
    res.status(201).json({ war: { id: rows[0].id, endsAt: endsAt.toISOString() } });
  })
);

// Active wars.
router.get(
  '/wars/active',
  requireAuth,
  asyncHandler(async (_req, res) => {
    // Resolve any wars past their end time before listing.
    await resolveExpiredWars().catch(() => undefined);
    const { rows } = await pool.query(
      `SELECT w.*, c1.name AS challenger_name, c1.tag AS challenger_tag,
              c2.name AS defender_name, c2.tag AS defender_tag
       FROM crew_wars w
       JOIN crews c1 ON c1.id = w.challenger_crew_id
       JOIN crews c2 ON c2.id = w.defender_crew_id
       WHERE w.status = 'live' ORDER BY w.created_at DESC LIMIT 10`
    );
    res.json({ wars: rows.map((r) => ({
      id: r.id, status: r.status, endsAt: r.ends_at,
      challenger: { id: r.challenger_crew_id, name: r.challenger_name, tag: r.challenger_tag, score: Number(r.challenger_score) },
      defender: { id: r.defender_crew_id, name: r.defender_name, tag: r.defender_tag, score: Number(r.defender_score) },
    })) });
  })
);

export default router;
