// Socket.io singleton with auth token, typed emit/on helpers, auto-reconnect.
// Base path is relative: the Vite dev proxy forwards /socket.io to the backend.
import { io, type Socket } from 'socket.io-client';
import { getToken } from './client';
import type { Attachment, Gift, Message, User } from '../types';

// ---- Payload shapes (mirror API_CONTRACT.md) ----
export interface MessageNewPayload { message: Message }
export interface MessageReactionPayload {
  messageId: string;
  emoji: string;
  userId: string;
  action: 'added' | 'removed';
}
export interface TypingUpdatePayload { roomId: string; userId: string; isTyping: boolean }
export interface PresenceUpdatePayload { roomId: string; onlineUserIds: string[] }
export interface ReadUpdatePayload { messageId: string; userId: string }
export interface VideoPeerJoinedPayload { userId: string; socketId: string; isLegendary?: boolean }
export interface VideoPeerLeftPayload { socketId: string }
export interface VideoSignalPayload { from: string; signal: unknown }
export interface RedCarpetPayload { king: User | null; queen: User | null; weekStart: string }
export interface RankUpPayload { userId: string; level: number; tier: string }
export interface GiftReceivedPayload { gift: Gift }

export interface ServerToClientEvents {
  'message:new': (payload: MessageNewPayload) => void;
  'message:reaction': (payload: MessageReactionPayload) => void;
  'typing:update': (payload: TypingUpdatePayload) => void;
  'presence:update': (payload: PresenceUpdatePayload) => void;
  'read:update': (payload: ReadUpdatePayload) => void;
  'video:peer-joined': (payload: VideoPeerJoinedPayload) => void;
  'video:peer-left': (payload: VideoPeerLeftPayload) => void;
  'video:signal': (payload: VideoSignalPayload) => void;
  'red:carpet': (payload: RedCarpetPayload) => void;
  'user:rank-up': (payload: RankUpPayload) => void;
  'gift:received': (payload: GiftReceivedPayload) => void;
  'battle:created': (payload: { battleId: string }) => void;
  'battle:started': (payload: { battleId: string }) => void;
  'battle:ended': (payload: { battleId: string }) => void;
  'battle:score': (payload: { battleId: string }) => void;
  'crew:war': (payload: { warId: string }) => void;
  'track:tipped': (payload: { trackId: string }) => void;
  'gamble:created': (payload: { gameId: string; betTokens?: number }) => void;
  'gamble:finished': (payload: any) => void;
  'gamble:cancelled': (payload: { gameId: string }) => void;
  'engagement:feed': (payload: { kind: string; amount: number }) => void;
  'engagement:crew-battle': (payload: { battleId: string }) => void;
  'gamble:result': (payload: any) => void;
}

export interface ClientToServerEvents {
  'room:join': (payload: { roomId: string }) => void;
  'room:leave': (payload: { roomId: string }) => void;
  'message:send': (
    payload: { roomId: string; body?: string; attachments?: Attachment[] },
    ack: (res: { message?: Message; error?: string }) => void,
  ) => void;
  'typing': (payload: { roomId: string; isTyping: boolean }) => void;
  'message:read': (payload: { roomId: string; messageId: string }) => void;
  'video:join': (payload: { roomId: string }) => void;
  'video:leave': (payload: { roomId: string }) => void;
  'video:signal': (payload: { to: string; signal: unknown }) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

// Create (or return) the singleton. Called after login / on app boot when a
// token exists. The token is read at creation time, so reconnects after a
// logout must destroy + recreate the socket.
export function getSocket(): AppSocket {
  if (!socket) {
    socket = io('/', {
      auth: { token: getToken() },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
  }
  return socket;
}

export function destroySocket(): void {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

// Typed emit helpers -----------------------------------------------------------

export function emitRoomJoin(roomId: string): void {
  getSocket().emit('room:join', { roomId });
}

export function emitRoomLeave(roomId: string): void {
  getSocket().emit('room:leave', { roomId });
}

export function emitMessageSend(
  payload: { roomId: string; body?: string; attachments?: Attachment[] },
): Promise<Message> {
  return new Promise((resolve, reject) => {
    getSocket().emit('message:send', payload, (res) => {
      if (res.error || !res.message) reject(new Error(res.error || 'Failed to send message'));
      else resolve(res.message);
    });
  });
}

export function emitTyping(roomId: string, isTyping: boolean): void {
  getSocket().emit('typing', { roomId, isTyping });
}

export function emitMessageRead(roomId: string, messageId: string): void {
  getSocket().emit('message:read', { roomId, messageId });
}

export function emitVideoJoin(roomId: string): void {
  getSocket().emit('video:join', { roomId });
}

export function emitVideoLeave(roomId: string): void {
  getSocket().emit('video:leave', { roomId });
}

export function emitVideoSignal(to: string, signal: unknown): void {
  getSocket().emit('video:signal', { to, signal });
}
