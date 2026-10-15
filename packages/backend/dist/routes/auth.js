"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const router = (0, express_1.Router)();
const WELCOME_LOUNGE = 'Welcome Lounge';
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'letters, numbers and underscores only'),
    email: zod_1.z.string().email().max(255),
    password: zod_1.z.string().min(6).max(128),
    displayName: zod_1.z.string().min(1).max(60),
    gender: zod_1.z.enum(['male', 'female', 'other']).default('other'),
});
/** Every new user lands in the public Welcome Lounge so chat is never empty. */
async function ensureWelcomeLounge(userId) {
    const existing = await db_1.pool.query('SELECT id FROM rooms WHERE name = $1 AND is_dm = false LIMIT 1', [WELCOME_LOUNGE]);
    let roomId;
    if (existing.rows.length) {
        roomId = existing.rows[0].id;
    }
    else {
        const created = await db_1.pool.query('INSERT INTO rooms (name, description, created_by) VALUES ($1, $2, $3) RETURNING id', [WELCOME_LOUNGE, 'Say hey — this is where every Big Face journey starts.', userId]);
        roomId = created.rows[0].id;
    }
    await db_1.pool.query('INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [roomId, userId]);
}
router.post('/signup', (0, util_1.asyncHandler)(async (req, res) => {
    const body = signupSchema.parse(req.body);
    const taken = await db_1.pool.query('SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1', [
        body.username,
        body.email,
    ]);
    if (taken.rows.length)
        throw new util_1.HttpError(409, 'Username or email already taken');
    const passwordHash = await bcryptjs_1.default.hash(body.password, 10);
    const { rows } = await db_1.pool.query(`INSERT INTO users (username, email, password_hash, display_name, gender)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [body.username, body.email, passwordHash, body.displayName, body.gender]);
    const user = rows[0];
    await ensureWelcomeLounge(user.id);
    await (0, xp_1.awardDailyLoginXp)(user.id); // first login counts as today's login
    // Starter wardrobe: grant all free level-1 items so new users can dress up immediately.
    await db_1.pool.query(`INSERT INTO user_avatar_items (user_id, item_id)
       SELECT $1, id FROM avatar_items WHERE min_level <= 1 AND token_price = 0
       ON CONFLICT DO NOTHING`, [user.id]);
    res.status(201).json({ token: (0, auth_1.signToken)(user.id), user: (0, util_1.toUser)(user) });
}));
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1), // username OR email
    password: zod_1.z.string().min(1),
});
router.post('/login', (0, util_1.asyncHandler)(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const { rows } = await db_1.pool.query('SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1', [body.identifier]);
    if (!rows.length)
        throw new util_1.HttpError(401, 'Invalid credentials');
    const ok = await bcryptjs_1.default.compare(body.password, rows[0].password_hash);
    if (!ok)
        throw new util_1.HttpError(401, 'Invalid credentials');
    await (0, xp_1.awardDailyLoginXp)(rows[0].id);
    res.json({ token: (0, auth_1.signToken)(rows[0].id), user: (0, util_1.toUser)(rows[0]) });
}));
router.get('/me', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    res.json({ user: (0, util_1.toUser)(req.user) });
}));
exports.default = router;
