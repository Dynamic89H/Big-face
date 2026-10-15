"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.HttpError = void 0;
exports.toUser = toUser;
exports.toRoom = toRoom;
exports.weekStart = weekStart;
/** Error with an HTTP status code — thrown in handlers, rendered by the global handler. */
class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.HttpError = HttpError;
/** Wrap async route handlers so rejected promises reach the error middleware. */
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
exports.asyncHandler = asyncHandler;
function toUser(row) {
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
        createdAt: row.created_at != null
            ? new Date(row.created_at).toISOString()
            : (row.createdAt ?? new Date().toISOString()),
    };
}
function toRoom(row, unreadCount, lastMessageAt) {
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
function weekStart(date = new Date()) {
    const d = new Date(date);
    const daysSinceMonday = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - daysSinceMonday);
    return d.toISOString().slice(0, 10);
}
