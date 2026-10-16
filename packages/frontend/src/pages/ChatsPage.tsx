import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi, usersApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { RoomSummary, User } from '../types';
import { timeAgo } from '../types';
import Avatar, { facePhotoOf } from '../components/Avatar';
import { usePageTitle } from '../hooks/usePageTitle';

// Room list with "New room" and "New DM" flows. User lookup for DMs searches
// the leaderboard (the contract has no username-search endpoint).
export default function ChatsPage() {
  usePageTitle('Chats');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [publicRooms, setPublicRooms] = useState<RoomSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewRoom, setShowNewRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [showNewDm, setShowNewDm] = useState(false);
  const [dmQuery, setDmQuery] = useState('');
  const [candidates, setCandidates] = useState<User[]>([]);
  const [dmError, setDmError] = useState<string | null>(null);
  const [startingDm, setStartingDm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ rooms }, { rooms: pub }] = await Promise.all([
        roomsApi.list(),
        roomsApi.publicRooms().catch(() => ({ rooms: [] as RoomSummary[] })),
      ]);
      setRooms(rooms);
      setPublicRooms(pub);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your chats.');
    } finally {
      setLoading(false);
    }
  };

  const joinPublicRoom = async (roomId: string) => {
    try {
      await roomsApi.join(roomId);
      await load();
      navigate(`/chats/${roomId}`);
    } catch {
      /* join failed */
    }
  };

  useEffect(() => {
    load();
  }, []);

  // DM user search: filter leaderboard members by username/display name.
  useEffect(() => {
    if (!showNewDm) return;
    const q = dmQuery.trim().toLowerCase();
    if (q.length < 2) {
      setCandidates([]);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        const { users } = await usersApi.search(q);
        setCandidates(users.slice(0, 8));
      } catch {
        setCandidates([]);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [dmQuery, showNewDm, user?.id]);

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort((a, b) => {
        const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return tb - ta;
      }),
    [rooms],
  );

  const createRoom = async () => {
    if (!roomName.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const { room } = await roomsApi.create({ name: roomName.trim(), description: roomDesc.trim() || undefined });
      setShowNewRoom(false);
      setRoomName('');
      setRoomDesc('');
      navigate(`/chats/${room.id}`);
    } catch (e) {
      setCreateError(e instanceof ApiError ? e.message : 'Could not create the room.');
    } finally {
      setCreating(false);
    }
  };

  const startDm = async (target: User) => {
    setStartingDm(target.id);
    setDmError(null);
    try {
      const { room } = await roomsApi.dm(target.id);
      setShowNewDm(false);
      setDmQuery('');
      navigate(`/chats/${room.id}`);
    } catch (e) {
      setDmError(e instanceof ApiError ? e.message : 'Could not start the conversation.');
    } finally {
      setStartingDm(null);
    }
  };

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginTop: '1.5rem' }}>
        <div>
          <h1 className="page-title">Chats</h1>
          <p className="page-sub">Your rooms and direct messages. Every message earns +5 XP.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowNewDm(true)}>✉️ New DM</button>
          <button className="btn btn-sm" onClick={() => setShowNewRoom(true)}>＋ New room</button>
        </div>
      </div>

      {loading && (
        <div className="loading-wrap"><div className="spinner" /><p>Loading your chats…</p></div>
      )}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}
      {!loading && !error && sortedRooms.length === 0 && (
        <div className="card empty-wrap">
          <div className="big">💬</div>
          <h3>No chats yet</h3>
          <p>Start a room or slide into someone's DMs to get the conversation going.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setShowNewDm(true)}>New DM</button>
            <button className="btn" onClick={() => setShowNewRoom(true)}>Create a room</button>
          </div>
        </div>
      )}

      {!loading && !error && sortedRooms.length > 0 && (
        <div className="card" style={{ padding: '0.6rem', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: '0.4rem 0.6rem 0.6rem', fontSize: '0.95rem' }}>💬 My Chats</h3>
          {sortedRooms.map((r) => (
            <div key={r.id} className="room-item" onClick={() => navigate(`/chats/${r.id}`)} role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/chats/${r.id}`)}>
              <Avatar displayName={r.name} profileColor={user?.profileColor ?? '#0066FF'} size="sm" />
              <div className="info">
                <div className="name">{r.isDm ? `💌 ${r.name}` : r.name}</div>
                <div className="preview">
                  {r.lastMessageAt ? `Last activity ${timeAgo(r.lastMessageAt)}` : 'No messages yet — say hi!'}
                </div>
              </div>
              {r.unreadCount > 0 && <span className="unread-badge">{r.unreadCount}</span>}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && publicRooms.length > 0 && (
        <div className="card" style={{ padding: '0.6rem', borderColor: 'var(--gold)' }}>
          <h3 style={{ margin: '0.4rem 0.6rem 0.2rem', fontSize: '0.95rem' }}>🌍 Public Rooms — meet new people</h3>
          <p className="form-note" style={{ margin: '0 0.6rem 0.6rem' }}>
            Jump in, start talking. Hosts can remove anyone they don't want in their room.
          </p>
          {publicRooms.map((r) => (
            <div key={r.id} className="room-item">
              <Avatar displayName={r.name} profileColor="#0096ff" size="sm" />
              <div className="info" style={{ flex: 1 }}>
                <div className="name">{r.name}</div>
                <div className="preview">
                  {(r as any).member_count || 0} members
                  {(r as any).joined ? ' · you\'re in' : ''}
                </div>
              </div>
              {(r as any).joined ? (
                <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/chats/${r.id}`)}>
                  Open
                </button>
              ) : (
                <button className="btn btn-sm" onClick={() => joinPublicRoom(r.id)}>
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showNewRoom && (
        <div className="modal-backdrop" onClick={() => setShowNewRoom(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>＋ Create a room</h3>
            <div className="field">
              <label htmlFor="room-name">Room name</label>
              <input id="room-name" className="input" value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="e.g. Late Night Vibes" maxLength={60} />
            </div>
            <div className="field">
              <label htmlFor="room-desc">Description (optional)</label>
              <textarea id="room-desc" className="textarea" value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} placeholder="What's this room about?" maxLength={200} />
            </div>
            {createError && <div className="form-error">{createError}</div>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowNewRoom(false)}>Cancel</button>
              <button className="btn" style={{ flex: 1 }} onClick={createRoom} disabled={creating || !roomName.trim()}>
                {creating ? 'Creating…' : 'Create room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewDm && (
        <div className="modal-backdrop" onClick={() => setShowNewDm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✉️ New direct message</h3>
            <div className="field">
              <label htmlFor="dm-search">Find someone by username</label>
              <input
                id="dm-search"
                className="input"
                value={dmQuery}
                onChange={(e) => setDmQuery(e.target.value)}
                placeholder="Type at least 2 characters…"
                autoFocus
              />
            </div>
            {dmError && <div className="form-error">{dmError}</div>}
            {dmQuery.trim().length >= 2 && candidates.length === 0 && (
              <p className="form-note">No matches found. Try a different name.</p>
            )}
            {candidates.map((c) => (
              <div key={c.id} className="room-item" onClick={() => startDm(c)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && startDm(c)}>
                <Avatar displayName={c.displayName} profileColor={c.profileColor} size="sm" photoUrl={facePhotoOf(c)} />
                <div className="info">
                  <div className="name">{c.displayName}</div>
                  <div className="preview">@{c.username} · Level {c.level}</div>
                </div>
                {startingDm === c.id && <div className="spinner" style={{ width: 20, height: 20 }} />}
              </div>
            ))}
            <button className="btn btn-ghost btn-block" style={{ marginTop: '0.8rem' }} onClick={() => setShowNewDm(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
