"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const sockets_1 = require("../sockets");
const router = (0, express_1.Router)();
// List crews, ranked by XP.
router.get('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query(`SELECT c.*, u.display_name AS leader_name,
              (SELECT COUNT(*)::int FROM crew_members cm WHERE cm.crew_id = c.id) AS member_count
       FROM crews c JOIN users u ON u.id = c.leader_id
       ORDER BY c.total_xp DESC LIMIT 50`);
    res.json({ crews: rows.map((r) => ({
            id: r.id, name: r.name, tag: r.tag, description: r.description,
            color: r.color, totalXp: Number(r.total_xp), wins: Number(r.wins),
            memberCount: r.member_count, leaderName: r.leader_name,
        })) });
}));
// My crew.
router.get('/mine', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query(`SELECT c.*, cm.role FROM crews c
       JOIN crew_members cm ON cm.crew_id = c.id
       WHERE cm.user_id = $1 LIMIT 1`, [req.user.id]);
    if (!rows.length)
        return res.json({ crew: null });
    const c = rows[0];
    const { rows: members } = await db_1.pool.query(`SELECT u.id, u.display_name, u.username, cm.role, u.xp FROM crew_members cm
       JOIN users u ON u.id = cm.user_id WHERE cm.crew_id = $1 ORDER BY u.xp DESC`, [c.id]);
    res.json({
        crew: {
            id: c.id, name: c.name, tag: c.tag, description: c.description,
            color: c.color, totalXp: Number(c.total_xp), wins: Number(c.wins),
            role: c.role,
            members: members.map((m) => ({ id: m.id, displayName: m.display_name, username: m.username, role: m.role, xp: m.xp })),
        },
    });
}));
// Create a crew.
router.post('/', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { name, tag, description, color } = zod_1.z.object({
        name: zod_1.z.string().min(3).max(40),
        tag: zod_1.z.string().min(2).max(6).regex(/^[A-Za-z0-9]+$/),
        description: zod_1.z.string().max(300).optional().default(''),
        color: zod_1.z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#0066FF'),
    }).parse(req.body);
    const { rows: existing } = await db_1.pool.query('SELECT 1 FROM crew_members WHERE user_id = $1 LIMIT 1', [req.user.id]);
    if (existing.length)
        throw new util_1.HttpError(400, 'You are already in a crew — leave it first');
    const { rows } = await db_1.pool.query(`INSERT INTO crews (name, tag, description, leader_id, color)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name.trim(), tag.toUpperCase(), description.trim(), req.user.id, color]).catch((e) => {
        if (e.code === '23505')
            throw new util_1.HttpError(409, 'Crew name or tag is taken');
        throw e;
    });
    await db_1.pool.query(`INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1, $2, 'leader')`, [rows[0].id, req.user.id]);
    await (0, xp_1.awardXp)(req.user.id, 50, 'crew_founded').catch(() => undefined);
    res.status(201).json({ crew: { id: rows[0].id, name: rows[0].name, tag: rows[0].tag } });
}));
// Join a crew.
router.post('/:id/join', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows: existing } = await db_1.pool.query('SELECT 1 FROM crew_members WHERE user_id = $1 LIMIT 1', [req.user.id]);
    if (existing.length)
        throw new util_1.HttpError(400, 'You are already in a crew');
    const { rows: crew } = await db_1.pool.query('SELECT id FROM crews WHERE id = $1', [req.params.id]);
    if (!crew.length)
        throw new util_1.HttpError(404, 'Crew not found');
    await db_1.pool.query('INSERT INTO crew_members (crew_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.params.id, req.user.id]);
    await (0, xp_1.awardXp)(req.user.id, 20, 'crew_joined').catch(() => undefined);
    res.json({ ok: true });
}));
// Leave crew.
router.post('/leave', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows } = await db_1.pool.query('SELECT crew_id, role FROM crew_members WHERE user_id = $1', [req.user.id]);
    if (!rows.length)
        throw new util_1.HttpError(400, 'You are not in a crew');
    if (rows[0].role === 'leader') {
        throw new util_1.HttpError(400, 'Leaders cannot leave — transfer leadership or disband the crew');
    }
    await db_1.pool.query('DELETE FROM crew_members WHERE user_id = $1', [req.user.id]);
    res.json({ ok: true });
}));
// Challenge another crew to war (leader only). War = 24h XP race.
router.post('/war/:crewId', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const { rows: mine } = await db_1.pool.query(`SELECT c.id FROM crews c JOIN crew_members cm ON cm.crew_id = c.id
       WHERE cm.user_id = $1 AND cm.role = 'leader' LIMIT 1`, [req.user.id]);
    if (!mine.length)
        throw new util_1.HttpError(403, 'Only crew leaders can declare war');
    if (mine[0].id === req.params.crewId)
        throw new util_1.HttpError(400, "You can't war your own crew");
    const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const { rows } = await db_1.pool.query(`INSERT INTO crew_wars (challenger_crew_id, defender_crew_id, status, ends_at)
       VALUES ($1, $2, 'live', $3) RETURNING *`, [mine[0].id, req.params.crewId, endsAt.toISOString()]);
    (0, sockets_1.emitToAll)('crew:war', { warId: rows[0].id, challenger: mine[0].id, defender: req.params.crewId });
    res.status(201).json({ war: { id: rows[0].id, endsAt: endsAt.toISOString() } });
}));
// Active wars.
router.get('/wars/active', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    const { rows } = await db_1.pool.query(`SELECT w.*, c1.name AS challenger_name, c1.tag AS challenger_tag,
              c2.name AS defender_name, c2.tag AS defender_tag
       FROM crew_wars w
       JOIN crews c1 ON c1.id = w.challenger_crew_id
       JOIN crews c2 ON c2.id = w.defender_crew_id
       WHERE w.status = 'live' ORDER BY w.created_at DESC LIMIT 10`);
    res.json({ wars: rows.map((r) => ({
            id: r.id, status: r.status, endsAt: r.ends_at,
            challenger: { id: r.challenger_crew_id, name: r.challenger_name, tag: r.challenger_tag, score: Number(r.challenger_score) },
            defender: { id: r.defender_crew_id, name: r.defender_name, tag: r.defender_tag, score: Number(r.defender_score) },
        })) });
}));
exports.default = router;
