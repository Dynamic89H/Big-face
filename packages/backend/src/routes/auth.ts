import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, toUser, HttpError } from '../util';
import { requireAuth, signToken } from '../middleware/auth';
import { awardDailyLoginXp } from '../services/xp';

const router = Router();
const WELCOME_LOUNGE = 'Welcome Lounge';

const signupSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'letters, numbers and underscores only'),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  displayName: z.string().min(1).max(60),
  gender: z.enum(['male', 'female', 'other']).default('other'),
});

/** Every new user lands in the public Welcome Lounge so chat is never empty. */
async function ensureWelcomeLounge(userId: string): Promise<void> {
  const existing = await pool.query(
    'SELECT id FROM rooms WHERE name = $1 AND is_dm = false LIMIT 1',
    [WELCOME_LOUNGE]
  );
  let roomId: string;
  if (existing.rows.length) {
    roomId = existing.rows[0].id;
  } else {
    const created = await pool.query(
      'INSERT INTO rooms (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [WELCOME_LOUNGE, 'Say hey — this is where every Big Face journey starts.', userId]
    );
    roomId = created.rows[0].id;
  }
  await pool.query(
    'INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [roomId, userId]
  );
}

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const body = signupSchema.parse(req.body);
    const taken = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1', [
      body.username,
      body.email,
    ]);
    if (taken.rows.length) throw new HttpError(409, 'Username or email already taken');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name, gender)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [body.username, body.email, passwordHash, body.displayName, body.gender]
    );
    const user = rows[0];
    await ensureWelcomeLounge(user.id);
    await awardDailyLoginXp(user.id); // first login counts as today's login
    // Starter wardrobe: grant all free level-1 items so new users can dress up immediately.
    await pool.query(
      `INSERT INTO user_avatar_items (user_id, item_id)
       SELECT $1, id FROM avatar_items WHERE min_level <= 1 AND token_price = 0
       ON CONFLICT DO NOTHING`,
      [user.id]
    );
    res.status(201).json({ token: signToken(user.id), user: toUser(user) });
  })
);

const loginSchema = z.object({
  identifier: z.string().min(1), // username OR email
  password: z.string().min(1),
});

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1',
      [body.identifier]
    );
    if (!rows.length) throw new HttpError(401, 'Invalid credentials');
    const ok = await bcrypt.compare(body.password, rows[0].password_hash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    await awardDailyLoginXp(rows[0].id);
    res.json({ token: signToken(rows[0].id), user: toUser(rows[0]) });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: toUser(req.user) });
  })
);

export default router;
