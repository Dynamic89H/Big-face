import { NextFunction, Request, Response } from 'express';

/** Error with an HTTP status code — thrown in handlers, rendered by the global handler. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Wrap async route handlers so rejected promises reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

/** Public user shape from API_CONTRACT.md. Accepts a raw DB row (snake_case) or an AuthUser. */
export interface UserShape {
  id: string;
  username: string;
  displayName: string;
  gender: string;
  bio: string;
  profileColor: string;
  avatarConfig: unknown;
  xp: number;
  level: number;
  loginStreak?: number;
  createdAt: string;
}

export function toUser(row: any): UserShape {
  return {
    id: String(row.id),
    username: row.username,
    displayName: row.display_name ?? row.displayName ?? '',
    gender: row.gender ?? 'other',
    bio: row.bio ?? '',
    profileColor: row.profile_color ?? row.profileColor ?? '#0066FF',
    avatarConfig: row.avatar_config ?? row.avatarConfig ?? {},
    xp: Number(row.xp ?? 0),
    level: Number(row.level ?? 1),
    loginStreak: Number(row.login_streak ?? 0),
    createdAt:
      row.created_at != null
        ? new Date(row.created_at).toISOString()
        : (row.createdAt ?? new Date().toISOString()),
  };
}

export function toRoom(row: any, unreadCount: number, lastMessageAt: string | null) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? '',
    isDm: Boolean(row.is_dm),
    unreadCount,
    lastMessageAt,
  };
}

/** Monday (00:00 local) of the current week, as YYYY-MM-DD. Used for color-of-week / legendary weeks. */
export function weekStart(date = new Date()): string {
  const d = new Date(date);
  const daysSinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return d.toISOString().slice(0, 10);
}
