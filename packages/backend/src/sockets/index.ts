import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from '../config';
import { pool } from '../db';
import { AuthUser, verifyToken } from '../middleware/auth';
import { createMessage } from '../services/messages';
import { awardXp, tierForLevel, AwardXpResult } from '../services/xp';

let io: Server | null = null;

/** roomId -> set of userIds currently joined via `room:join` (presence). */
const roomPresence = new Map<string, Set<string>>();

function emitPresence(roomId: string): void {
  const onlineUserIds = [...(roomPresence.get(roomId) ?? [])];
  io?.to(`room:${roomId}`).emit('presence:update', { roomId, onlineUserIds });
}

export function initSockets(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: config.frontendUrl, credentials: true },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('auth required'));
    try {
      socket.data.user = await verifyToken(token);
      next();
    } catch {
      next(new Error('invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const server = io!;
    const user = socket.data.user as AuthUser;
    socket.data.rooms = new Set<string>();
    socket.data.videoRooms = new Set<string>();

    // Personal channel for targeted events (gift:received, etc.).
    socket.join(`user:${user.id}`);

    socket.on('room:join', async ({ roomId }: { roomId: string }, ack?: (r: unknown) => void) => {
      try {
        const mem = await pool.query(
          'SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2',
          [roomId, user.id]
        );
        if (!mem.rows.length) {
          ack?.({ error: 'Not a member of this room' });
          return;
        }
        socket.join(`room:${roomId}`);
        (socket.data.rooms as Set<string>).add(roomId);
        let set = roomPresence.get(roomId);
        if (!set) {
          set = new Set();
          roomPresence.set(roomId, set);
        }
        set.add(user.id);
        emitPresence(roomId);
        ack?.({ ok: true });
      } catch (err: any) {
        ack?.({ error: err?.message ?? 'Failed to join room' });
      }
    });

    socket.on('room:leave', ({ roomId }: { roomId: string }) => {
      socket.leave(`room:${roomId}`);
      (socket.data.rooms as Set<string>).delete(roomId);
      roomPresence.get(roomId)?.delete(user.id);
      emitPresence(roomId);
    });

    socket.on(
      'message:send',
      async (
        payload: { roomId: string; body?: string; attachments?: any[] },
        ack?: (r: unknown) => void
      ) => {
        try {
          // Same validation/persistence path as the REST endpoint.
          const message = await createMessage({
            roomId: payload.roomId,
            senderId: user.id,
            body: payload.body,
            attachments: payload.attachments,
          });
          const xpRes = await awardXp(user.id, 5, 'message sent');
          server.to(`room:${payload.roomId}`).emit('message:new', { message });
          maybeEmitRankUp(user.id, xpRes);
          ack?.({ message });
        } catch (err: any) {
          ack?.({ error: err?.message ?? 'Failed to send message' });
        }
      }
    );

    socket.on('typing', ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
      socket
        .to(`room:${roomId}`)
        .emit('typing:update', { roomId, userId: user.id, isTyping: Boolean(isTyping) });
    });

    socket.on('message:read', async ({ roomId, messageId }: { roomId: string; messageId: string }) => {
      await pool.query(
        'INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [messageId, user.id]
      );
      server.to(`room:${roomId}`).emit('read:update', { messageId, userId: user.id });
    });

    socket.on('video:join', async ({ roomId }: { roomId: string }, ack?: (r: unknown) => void) => {
      const mem = await pool.query(
        'SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2',
        [roomId, user.id]
      );
      if (!mem.rows.length) {
        ack?.({ error: 'Not a member of this room' });
        return;
      }
      socket.join(`video:${roomId}`);
      (socket.data.videoRooms as Set<string>).add(roomId);
      socket
        .to(`video:${roomId}`)
        .emit('video:peer-joined', { userId: user.id, socketId: socket.id });
      ack?.({ ok: true });
    });

    socket.on('video:leave', ({ roomId }: { roomId: string }) => {
      socket.leave(`video:${roomId}`);
      (socket.data.videoRooms as Set<string>).delete(roomId);
      socket.to(`video:${roomId}`).emit('video:peer-left', { socketId: socket.id });
    });

    // SDP / ICE passthrough — the server never inspects the payload.
    socket.on('video:signal', ({ to, signal }: { to: string; signal: unknown }) => {
      server.to(to).emit('video:signal', { from: socket.id, signal });
    });

    socket.on('disconnect', () => {
      for (const roomId of socket.data.rooms as Set<string>) {
        roomPresence.get(roomId)?.delete(user.id);
        emitPresence(roomId);
      }
      for (const roomId of socket.data.videoRooms as Set<string>) {
        socket.to(`video:${roomId}`).emit('video:peer-left', { socketId: socket.id });
      }
    });
  });

  return io;
}

/** Broadcast to every connected client (red:carpet, rank-ups). No-op before initSockets. */
export function emitToAll(event: string, payload: unknown): void {
  io?.emit(event, payload);
}

/** Emit to everyone joined to a chat room's socket room. */
export function emitToRoom(roomId: string, event: string, payload: unknown): void {
  io?.to(`room:${roomId}`).emit(event, payload);
}

/** Emit to one user's personal channel (all of their connected sockets). */
export function emitToUser(userId: string, event: string, payload: unknown): void {
  io?.to(`user:${userId}`).emit(event, payload);
}

/** Fires user:rank-up when an XP award crossed a level threshold. */
export function maybeEmitRankUp(userId: string, res: AwardXpResult): void {
  if (res.leveledUp) {
    emitToAll('user:rank-up', { userId, level: res.level, tier: tierForLevel(res.level) });
  }
}
