"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../db");
function rowToAuthUser(row) {
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
function signToken(userId) {
    // `expiresIn` accepts strings like "7d"; the cast satisfies the StringValue template type.
    return jsonwebtoken_1.default.sign({ userId }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
}
/**
 * Verifies a raw JWT, loads the user, and returns it.
 * Shared by HTTP `requireAuth` and the Socket.io handshake.
 */
async function verifyToken(token) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
    }
    catch {
        throw new Error('Invalid token');
    }
    const userId = payload?.userId;
    if (!userId)
        throw new Error('Invalid token');
    const { rows } = await db_1.pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!rows.length)
        throw new Error('User not found');
    return rowToAuthUser(rows[0]);
}
async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
        res.status(401).json({ error: 'Missing Authorization Bearer token' });
        return;
    }
    try {
        req.user = await verifyToken(token);
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Admin required' });
        return;
    }
    next();
}
