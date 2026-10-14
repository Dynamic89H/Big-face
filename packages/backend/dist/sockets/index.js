"use strict";
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
            socket
                .to(`video:${roomId}`)
                .emit('video:peer-joined', { userId: user.id, socketId: socket.id });
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
/** Fires user:rank-up when an XP award crossed a level threshold. */
function maybeEmitRankUp(userId, res) {
    if (res.leveledUp) {
        emitToAll('user:rank-up', { userId, level: res.level, tier: (0, xp_1.tierForLevel)(res.level) });
    }
}
