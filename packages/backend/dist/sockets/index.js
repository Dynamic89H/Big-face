"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSockets = initSockets;
exports.emitToAll = emitToAll;
exports.emitToRoom = emitToRoom;
exports.emitToUser = emitToUser;
exports.maybeEmitRankUp = maybeEmitRankUp;
const socket_io_1 = require("socket.io");
const config_1 = require("../config");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const messages_1 = require("../services/messages");
const xp_1 = require("../services/xp");
const legendary_1 = require("../services/legendary");
let io = null;
/** roomId -> set of userIds currently joined via `room:join` (presence). */
const roomPresence = new Map();
function emitPresence(roomId) {
    const onlineUserIds = [...(roomPresence.get(roomId) ?? [])];
    io?.to(`room:${roomId}`).emit('presence:update', { roomId, onlineUserIds });
}
function initSockets(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: config_1.config.frontendUrl, credentials: true },
    });
    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error('auth required'));
        try {
            socket.data.user = await (0, auth_1.verifyToken)(token);
            next();
        }
        catch {
            next(new Error('invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const server = io;
        const user = socket.data.user;
        socket.data.rooms = new Set();
        socket.data.videoRooms = new Set();
        // Personal channel for targeted events (gift:received, etc.).
        socket.join(`user:${user.id}`);
        socket.on('room:join', async ({ roomId }, ack) => {
            try {
                const mem = await db_1.pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [roomId, user.id]);
                if (!mem.rows.length) {
                    ack?.({ error: 'Not a member of this room' });
                    return;
                }
                socket.join(`room:${roomId}`);
                socket.data.rooms.add(roomId);
                let set = roomPresence.get(roomId);
                if (!set) {
                    set = new Set();
                    roomPresence.set(roomId, set);
                }
                set.add(user.id);
                emitPresence(roomId);
                ack?.({ ok: true });
            }
            catch (err) {
                ack?.({ error: err?.message ?? 'Failed to join room' });
            }
        });
        socket.on('room:leave', ({ roomId }) => {
            socket.leave(`room:${roomId}`);
            socket.data.rooms.delete(roomId);
            roomPresence.get(roomId)?.delete(user.id);
            emitPresence(roomId);
        });
        socket.on('message:send', async (payload, ack) => {
            try {
                // Same validation/persistence path as the REST endpoint.
                const message = await (0, messages_1.createMessage)({
                    roomId: payload.roomId,
                    senderId: user.id,
                    body: payload.body,
                    attachments: payload.attachments,
                });
                const xpRes = await (0, xp_1.awardXp)(user.id, 5, 'message sent');
                server.to(`room:${payload.roomId}`).emit('message:new', { message });
                maybeEmitRankUp(user.id, xpRes);
                ack?.({ message });
            }
            catch (err) {
                ack?.({ error: err?.message ?? 'Failed to send message' });
            }
        });
        socket.on('typing', ({ roomId, isTyping }) => {
            socket
                .to(`room:${roomId}`)
                .emit('typing:update', { roomId, userId: user.id, isTyping: Boolean(isTyping) });
        });
        socket.on('message:read', async ({ roomId, messageId }) => {
            await db_1.pool.query('INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [messageId, user.id]);
            server.to(`room:${roomId}`).emit('read:update', { messageId, userId: user.id });
        });
        socket.on('video:join', async ({ roomId }, ack) => {
            const mem = await db_1.pool.query('SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2', [roomId, user.id]);
            if (!mem.rows.length) {
                ack?.({ error: 'Not a member of this room' });
                return;
            }
            socket.join(`video:${roomId}`);
            socket.data.videoRooms.add(roomId);
            // Flag legendary winners so clients can play the royal chime on entrance.
            let isLegendary = false;
            try {
                const leg = await (0, legendary_1.getLatestLegendary)();
                isLegendary = leg.king?.id === user.id || leg.queen?.id === user.id;
            }
            catch { /* non-fatal */ }
            socket
                .to(`video:${roomId}`)
                .emit('video:peer-joined', { userId: user.id, socketId: socket.id, isLegendary });
            ack?.({ ok: true });
        });
        socket.on('video:leave', ({ roomId }) => {
            socket.leave(`video:${roomId}`);
            socket.data.videoRooms.delete(roomId);
            socket.to(`video:${roomId}`).emit('video:peer-left', { socketId: socket.id });
        });
        // SDP / ICE passthrough — the server never inspects the payload.
        socket.on('video:signal', ({ to, signal }) => {
            server.to(to).emit('video:signal', { from: socket.id, signal });
        });
        socket.on('disconnect', () => {
            for (const roomId of socket.data.rooms) {
                roomPresence.get(roomId)?.delete(user.id);
                emitPresence(roomId);
            }
            for (const roomId of socket.data.videoRooms) {
                socket.to(`video:${roomId}`).emit('video:peer-left', { socketId: socket.id });
            }
        });
    });
    return io;
}
/** Broadcast to every connected client (red:carpet, rank-ups). No-op before initSockets. */
function emitToAll(event, payload) {
    io?.emit(event, payload);
}
/** Emit to everyone joined to a chat room's socket room. */
function emitToRoom(roomId, event, payload) {
    io?.to(`room:${roomId}`).emit(event, payload);
}
/** Emit to one user's personal channel (all of their connected sockets). */
function emitToUser(userId, event, payload) {
    io?.to(`user:${userId}`).emit(event, payload);
}
/** Fires user:rank-up when an XP award crossed a level threshold. Also pays token rewards. */
function maybeEmitRankUp(userId, res) {
    if (res.leveledUp) {
        emitToAll('user:rank-up', { userId, level: res.level, tier: (0, xp_1.tierForLevel)(res.level) });
        // Level-up token reward: higher level = bigger bag. Fire and forget.
        payLevelUpReward(userId, res.level).catch(() => undefined);
    }
}
/** Token reward for ranking up: level × 50 tokens. Level 10 = 500 tokens = $5. */
async function payLevelUpReward(userId, level) {
    const { pool } = await Promise.resolve().then(() => __importStar(require('../db')));
    const { addTokens } = await Promise.resolve().then(() => __importStar(require('../services/tokens')));
    // Idempotent: never pay twice for the same level.
    const { rows: existing } = await pool.query('SELECT 1 FROM level_rewards WHERE user_id = $1 AND level = $2', [userId, level]);
    if (existing.length)
        return;
    const tokens = level * 50;
    await addTokens(userId, tokens, 'level_up_reward', { reference: `level:${level}` });
    await pool.query('INSERT INTO level_rewards (user_id, level, tokens_awarded) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [userId, level, tokens]);
}
