import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { friendsApi, roomsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { User } from '../types';
import Avatar, { facePhotoOf } from '../components/Avatar';
import { usePageTitle } from '../hooks/usePageTitle';

function UserRow({ person, children }: { person: User; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
      <Link to={`/u/${person.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
        <Avatar displayName={person.displayName} profileColor={person.profileColor} photoUrl={facePhotoOf(person)} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {person.displayName}
          </div>
          <div className="form-note">@{person.username} · Level {person.level}</div>
        </div>
      </Link>
      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function FriendsPage() {
  usePageTitle('Friends');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<User[]>([]);
  const [received, setReceived] = useState<User[]>([]);
  const [sent, setSent] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ friends: f }, { received: r, sent: s }] = await Promise.all([
        friendsApi.list(),
        friendsApi.requests(),
      ]);
      setFriends(f);
      setReceived(r);
      setSent(s);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load friends.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, fn: (uid: string) => Promise<unknown>) => {
    setBusyId(id);
    try {
      await fn(id);
      await load();
    } catch {
      /* non-fatal */
    } finally {
      setBusyId(null);
    }
  };

  const messageFriend = async (friend: User) => {
    try {
      const { room } = await roomsApi.create({ name: friend.displayName, memberIds: [friend.id] });
      navigate(`/chats/${room.id}`);
    } catch {
      navigate('/chats');
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Friends</h1>
        <p className="page-sub">Your people. Add friends, accept requests, start chatting.</p>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Finding your people…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {received.length > 0 && (
            <div className="card" style={{ marginBottom: '1.2rem', borderColor: 'var(--gold)' }}>
              <h3 style={{ margin: '0 0 0.4rem' }}>✉️ Friend requests ({received.length})</h3>
              {received.map((p) => (
                <UserRow key={p.id} person={p}>
                  <button
                    className="btn btn-sm"
                    disabled={busyId === p.id}
                    onClick={() => act(p.id, friendsApi.accept)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={busyId === p.id}
                    onClick={() => act(p.id, friendsApi.decline)}
                  >
                    Decline
                  </button>
                </UserRow>
              ))}
            </div>
          )}

          <div className="card" style={{ marginBottom: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.4rem' }}>👥 My friends ({friends.length})</h3>
            {friends.length === 0 ? (
              <p className="form-note">
                No friends yet. Visit someone's profile and hit <strong>Add Friend</strong> — you'll earn +2 XP per request.
              </p>
            ) : (
              friends.map((f) => (
                <UserRow key={f.id} person={f}>
                  <button className="btn btn-sm" onClick={() => messageFriend(f)}>
                    💬 Message
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={busyId === f.id}
                    onClick={() => act(f.id, friendsApi.unfriend)}
                  >
                    Unfriend
                  </button>
                </UserRow>
              ))
            )}
          </div>

          {sent.length > 0 && (
            <div className="card">
              <h3 style={{ margin: '0 0 0.4rem' }}>📤 Sent requests ({sent.length})</h3>
              {sent.map((p) => (
                <UserRow key={p.id} person={p}>
                  <span className="form-note">Waiting…</span>
                </UserRow>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
