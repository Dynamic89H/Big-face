import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { pool } from '../db';

/** Authenticated user attached to the request (and socket.data) after verification. */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  gender: string;
  bio: string;
  profileColor: string;
  avatarConfig: unknown;
  xp: number;
  level: number;
  tokenBalance: number;
  isAdmin: boolean;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function rowToAuthUser(row: any): AuthUser {
  return {
    id: String(row.id),
    username: row.username,
    email: row.email,
    displayName: row.display_name,
    gender: row.gender,
    bio: row.bio,
    profileColor: row.profile_color,
    avatarConfig: row.avatar_config,
    xp: Number(row.xp),
    level: Number(row.level),
    tokenBalance: Number(row.token_balance),
    isAdmin: Boolean(row.is_admin),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export function signToken(userId: string): string {
  // `expiresIn` accepts strings like "7d"; the cast satisfies the StringValue template type.
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

/**
 * Verifies a raw JWT, loads the user, and returns it.
 * Shared by HTTP `requireAuth` and the Socket.io handshake.
 */
export async function verifyToken(token: string): Promise<AuthUser> {
  let payload: unknown;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new Error('Invalid token');
  }
  const userId = (payload as { userId?: string } | null)?.userId;
  if (!userId) throw new Error('Invalid token');
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (!rows.length) throw new Error('User not found');
  return rowToAuthUser(rows[0]);
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization Bearer token' });
    return;
  }
  try {
    req.user = await verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Admin required' });
    return;
  }
  next();
}
