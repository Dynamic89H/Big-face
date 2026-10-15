import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { messagesApi, roomsApi, uploadsApi, ApiError, type UploadResult } from '../api/client';
import {
  emitMessageRead,
  emitRoomJoin,
  emitRoomLeave,
  emitTyping,
  getSocket,
  type MessageReactionPayload,
  type ReadUpdatePayload,
  type TypingUpdatePayload,
} from '../api/socket';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../auth/AuthContext';
import type { Attachment, Message, Room, User } from '../types';
import { formatDay, formatTime } from '../types';
import Avatar from '../components/Avatar';
import EmojiPicker from '../components/EmojiPicker';
import ReportDialog from '../components/ReportDialog';

const PAGE_SIZE = 50;

export default function ChatRoomPage() {
  usePageTitle('Chat');
  const { id: roomId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // oldest-first for display
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<UploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({}); // userId -> expiry ts
  const [onlineIds, setOnlineIds] = useState<string[]>([]);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<number | null>(null);
  const readTimer = useRef<number | null>(null);
  const memberMap = useRef<Record<string, User>>({});

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 140;
  };
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // ---- Load room + initial messages ----
  const load = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    setError(null);
    try {
      const [{ room, members }, { messages: newest }] = await Promise.all([
        roomsApi.get(roomId),
        messagesApi.list(roomId, PAGE_SIZE),
      ]);
      setRoom(room);
      setMembers(members);
      memberMap.current = Object.fromEntries(members.map((m) => [m.id, m]));
      setMessages(newest.slice().reverse());
      setHasMore(newest.length >= PAGE_SIZE);
      // Let the layout settle, then pin to the newest message.
      requestAnimationFrame(() => scrollToBottom());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not open this chat.');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load]);

  // ---- Realtime wiring ----
  useEffect(() => {
    if (!roomId) return;
    const s = getSocket();
    emitRoomJoin(roomId);

    const onNew = (p: { message: Message }) => {
      if (p.message.roomId !== roomId) return;
      const stick = isNearBottom();
      setMessages((prev) => {
        if (prev.some((m) => m.id === p.message.id)) return prev; // dedupe own echo
        return [...prev, p.message];
      });
      if (stick) requestAnimationFrame(() => scrollToBottom());
      scheduleMarkRead();
    };

    const onReaction = (p: MessageReactionPayload) => {
      // Optimistic updates already applied our own toggles; skip the echo.
      if (p.userId === user?.id) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== p.messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === p.emoji);
          let reactions = m.reactions;
          if (p.action === 'added') {
            reactions = existing
              ? m.reactions.map((r) => (r.emoji === p.emoji ? { ...r, count: r.count + 1 } : r))
              : [...m.reactions, { emoji: p.emoji, count: 1, reactedByMe: false }];
          } else {
            reactions = m.reactions
              .map((r) => (r.emoji === p.emoji ? { ...r, count: r.count - 1 } : r))
              .filter((r) => r.count > 0);
          }
          return { ...m, reactions };
        }),
      );
    };

    const onTyping = (p: TypingUpdatePayload) => {
      if (p.roomId !== roomId || p.userId === user?.id) return;
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (p.isTyping) next[p.userId] = Date.now() + 4000; // auto-expire
        else delete next[p.userId];
        return next;
      });
    };

    const onRead = (p: ReadUpdatePayload) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === p.messageId && !m.readBy.includes(p.userId)
            ? { ...m, readBy: [...m.readBy, p.userId] }
            : m,
        ),
      );
    };

    const onPresence = (p: { roomId: string; onlineUserIds: string[] }) => {
      if (p.roomId === roomId) setOnlineIds(p.onlineUserIds);
    };

    s.on('message:new', onNew);
    s.on('message:reaction', onReaction);
    s.on('typing:update', onTyping);
    s.on('read:update', onRead);
    s.on('presence:update', onPresence);

    // Prune expired typing indicators.
    const prune = window.setInterval(() => {
      setTypingUsers((prev) => {
        const now = Date.now();
        const next = Object.fromEntries(Object.entries(prev).filter(([, exp]) => exp > now));
        return Object.keys(next).length === Object.keys(prev).length ? prev : next;
      });
    }, 2000);

    return () => {
      window.clearInterval(prune);
      s.off('message:new', onNew);
      s.off('message:reaction', onReaction);
      s.off('typing:update', onTyping);
      s.off('read:update', onRead);
      s.off('presence:update', onPresence);
      emitRoomLeave(roomId);
    };
  }, [roomId, user?.id]);

  // Mark everything read shortly after viewing (debounced).
  const scheduleMarkRead = useCallback(() => {
    if (!roomId) return;
    if (readTimer.current) window.clearTimeout(readTimer.current);
    readTimer.current = window.setTimeout(() => {
      roomsApi.markRead(roomId).catch(() => undefined);
    }, 1200);
  }, [roomId]);

  useEffect(() => {
    if (!loading && messages.length > 0) scheduleMarkRead();
  }, [loading, messages.length, scheduleMarkRead]);

  // ---- Composer ----
  const handleDraft = (v: string) => {
    setDraft(v);
    if (!roomId) return;
    emitTyping(roomId, true);
    if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
    typingTimeout.current = window.setTimeout(() => roomId && emitTyping(roomId, false), 2000);
  };

  const attachFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setSendError(null);
    try {
      const results: UploadResult[] = [];
      for (const f of Array.from(files)) {
        results.push(await uploadsApi.upload(f));
      }
      setPending((p) => [...p, ...results]);
    } catch (e) {
      setSendError(e instanceof ApiError ? e.message : 'Upload failed. Files must be under 25MB.');
    } finally {
      setUploading(false);
    }
  };

  const send = async () => {
    if (!roomId || sending) return;
    const body = draft.trim();
    if (!body && pending.length === 0) return;
    setSending(true);
    setSendError(null);
    try {
      const attachments: Attachment[] = pending.map((p) => ({
        url: p.url, name: p.name, mime: p.mime, size: p.size,
      }));
      const { message } = await messagesApi.send(roomId, {
        body: body || undefined,
        attachments: attachments.length ? attachments : undefined,
      });
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      setDraft('');
      setPending([]);
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
      emitTyping(roomId, false);
      emitMessageRead(roomId, message.id);
      requestAnimationFrame(() => scrollToBottom());
    } catch (e) {
      setSendError(e instanceof ApiError ? e.message : 'Message failed to send.');
    } finally {
      setSending(false);
    }
  };

  const toggleReaction = async (msg: Message, emoji: string) => {
    const mine = msg.reactions.find((r) => r.emoji === emoji)?.reactedByMe;
    // Optimistic update; the socket handler skips our own echo.
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msg.id) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        let reactions: Message['reactions'];
        if (mine) {
          reactions = m.reactions
            .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r))
            .filter((r) => r.count > 0);
        } else if (existing) {
          reactions = m.reactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r,
          );
        } else {
          reactions = [...m.reactions, { emoji, count: 1, reactedByMe: true }];
        }
        return { ...m, reactions };
      }),
    );
    try {
      if (mine) await messagesApi.removeReaction(msg.id, emoji);
      else await messagesApi.addReaction(msg.id, emoji);
    } catch {
      // Revert on failure by reloading reactions from the message list.
      if (roomId) messagesApi.list(roomId, 1).catch(() => undefined);
    }
  };

  const loadOlder = async () => {
    if (!roomId || loadingOlder || messages.length === 0) return;
    const container = scrollRef.current;
    const prevH = container?.scrollHeight ?? 0;
    const prevT = container?.scrollTop ?? 0;
    setLoadingOlder(true);
    try {
      const { messages: older } = await messagesApi.list(roomId, PAGE_SIZE, messages[0].createdAt);
      setHasMore(older.length >= PAGE_SIZE);
      setMessages((prev) => [...older.slice().reverse(), ...prev]);
      requestAnimationFrame(() => {
        if (container) container.scrollTop = prevT + (container.scrollHeight - prevH);
      });
    } catch {
      /* keep existing messages */
    } finally {
      setLoadingOlder(false);
    }
  };

  const typingNames = Object.keys(typingUsers)
    .map((id) => memberMap.current[id]?.displayName)
    .filter(Boolean) as string[];

  if (loading) {
    return (
      <div className="loading-wrap"><div className="spinner" /><p>Opening chat…</p></div>
    );
  }
  if (error || !room) {
    return (
      <div className="error-wrap">
        <p>😕 {error ?? 'This chat could not be opened.'}</p>
        <button className="btn" onClick={() => navigate('/chats')}>Back to chats</button>
      </div>
    );
  }

  let lastDay = '';

  return (
    <div className="chat-panel" style={{ height: 'calc(100vh - 4.5rem)' }}>
      <div className="chat-header">
        <button className="icon-btn" onClick={() => navigate('/chats')} aria-label="Back to chats">←</button>
        <Avatar displayName={room.name} profileColor={user?.profileColor ?? '#0066FF'} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="title">{room.isDm ? `💌 ${room.name}` : room.name}</div>
          <div className="sub">
            {members.length} member{members.length === 1 ? '' : 's'}
            {onlineIds.length > 0 && ` · ${onlineIds.length} online`}
          </div>
        </div>
        <button
          className="btn btn-sm"
          onClick={() => navigate('/video', { state: { roomId, roomName: room.name } })}
        >
          📹 Video
        </button>
      </div>

      <div className="messages" ref={scrollRef}>
        {hasMore && messages.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={loadOlder} disabled={loadingOlder}>
              {loadingOlder ? 'Loading…' : 'Load older messages'}
            </button>
          </div>
        )}
        {messages.length === 0 && (
          <div className="empty-wrap">
            <div className="big">👋</div>
            <p>No messages yet. Break the ice — you'll earn +5 XP.</p>
          </div>
        )}
        {messages.map((m) => {
          const day = formatDay(m.createdAt);
          const showDivider = day !== lastDay;
          lastDay = day;
          const own = m.sender.id === user?.id;
          const seenByOthers = m.readBy.filter((id) => id !== user?.id).length;
          return (
            <div key={m.id}>
              {showDivider && (
                <div className="date-divider"><span>{day}</span></div>
              )}
              <div className={`msg-row${own ? ' own' : ''}`}>
                {!own && (
                  <Link to={`/u/${m.sender.id}`} style={{ flexShrink: 0 }}>
                    <Avatar displayName={m.sender.displayName} profileColor={m.sender.profileColor} size="sm" />
                  </Link>
                )}
                <div className="msg-body-wrap">
                  {!own && (
                    <div className="msg-head">
                      <Link to={`/u/${m.sender.id}`} className="msg-sender">{m.sender.displayName}</Link>
                      <span className="badge">Lv {m.sender.level}</span>
                      <span className="msg-time">{formatTime(m.createdAt)}</span>
                    </div>
                  )}
                  {own && (
                    <div className="msg-head" style={{ justifyContent: 'flex-end' }}>
                      <span className="msg-time">{formatTime(m.createdAt)}</span>
                    </div>
                  )}
                  {(m.body || m.attachments.length > 0) && (
                    <div className="msg-bubble">
                      {m.body}
                      {m.attachments.length > 0 && (
                        <div className="msg-attach">
                          {m.attachments.map((a, i) => (
                            <div key={`${a.url}-${i}`}>
                              {a.mime.startsWith('image/') ? (
                                <a href={a.url} target="_blank" rel="noreferrer">
                                  <img src={a.url} alt={a.name} loading="lazy" />
                                </a>
                              ) : a.mime.startsWith('video/') ? (
                                <video src={a.url} controls preload="metadata" />
                              ) : (
                                <a className="file-chip" href={a.url} target="_blank" rel="noreferrer">
                                  📎 {a.name}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {m.reactions.length > 0 && (
                    <div className="reactions">
                      {m.reactions.map((r) => (
                        <button
                          key={r.emoji}
                          className={`reaction-pill${r.reactedByMe ? ' mine' : ''}`}
                          onClick={() => toggleReaction(m, r.emoji)}
                          title={r.reactedByMe ? 'Remove your reaction' : 'React'}
                        >
                          {r.emoji} {r.count}
                        </button>
                      ))}
                      <button className="reaction-pill" onClick={() => toggleReaction(m, '❤️')} title="Quick react ❤️">＋</button>
                    </div>
                  )}
                  {m.reactions.length === 0 && (
                    <div className="reactions">
                      <button className="reaction-pill" onClick={() => toggleReaction(m, '❤️')} title="React ❤️">＋</button>
                    </div>
                  )}
                  {own && seenByOthers > 0 && (
                    <div className="seen-line">✓✓ Seen by {seenByOthers}</div>
                  )}
                </div>
                <button
                  className="msg-menu-btn"
                  onClick={() => setMenuFor(menuFor === m.id ? null : m.id)}
                  aria-label="Message options"
                >
                  ⋯
                </button>
                {menuFor === m.id && (
                  <div className="card" style={{ position: 'absolute', top: '1.8rem', right: '0.4rem', zIndex: 20, padding: '0.4rem', minWidth: 150 }}>
                    <button className="btn btn-ghost btn-sm btn-block" style={{ marginBottom: '0.3rem' }}
                      onClick={() => { if (m.body) navigator.clipboard?.writeText(m.body).catch(() => undefined); setMenuFor(null); }}>
                      📋 Copy text
                    </button>
                    {!own && (
                      <button className="btn btn-ghost btn-sm btn-block"
                        onClick={() => { setReportMsg(m.id); setMenuFor(null); }}>
                        🚩 Report message
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="typing-bar">
        {typingNames.length > 0 && `${typingNames.join(', ')} ${typingNames.length === 1 ? 'is' : 'are'} typing…`}
      </div>

      <div className="composer">
        {pending.length > 0 && (
          <div className="pending-attachments">
            {pending.map((p) => (
              <div key={p.url} className="pending-chip">
                {p.mime.startsWith('image/') ? (
                  <img src={p.url} alt={p.name} />
                ) : (
                  <span className="file-chip">📎 {p.name}</span>
                )}
                <button onClick={() => setPending((x) => x.filter((y) => y.url !== p.url))} aria-label="Remove attachment">✕</button>
              </div>
            ))}
          </div>
        )}
        {sendError && <div className="form-error" style={{ marginBottom: 0 }}>{sendError}</div>}
        <div className="composer-row" style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowEmoji((s) => !s)} aria-label="Pick an emoji">😀</button>
          {showEmoji && <EmojiPicker onPick={(e) => setDraft((d) => d + e)} onClose={() => setShowEmoji(false)} />}
          <button className="icon-btn" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Attach a file">
            {uploading ? '⏳' : '📎'}
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            multiple
            accept="image/*,video/*,audio/*"
            onChange={(e) => { attachFiles(e.target.files); e.target.value = ''; }}
          />
          <input
            className="input"
            value={draft}
            onChange={(e) => handleDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Message ${room.name}…`}
            maxLength={2000}
          />
          <button className="btn" onClick={send} disabled={sending || (!draft.trim() && pending.length === 0)}>
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </div>

      {reportMsg && (
        <ReportDialog targetType="message" targetId={reportMsg} onClose={() => setReportMsg(null)} />
      )}
    </div>
  );
}
