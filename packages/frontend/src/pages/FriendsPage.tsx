import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { friendsApi, roomsApi, usersApi, ApiError } from '../api/client';
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
  const [tab, setTab] = useState<'friends' | 'discover'>('friends');
  const [friends, setFriends] = useState<User[]>([]);
  const [received, setReceived] = useState<User[]>([]);
  const [sent, setSent] = useState<User[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ friends: f }, { received: r, sent: s }, { code, count }, { users: d }] = await Promise.all([
        friendsApi.list(),
        friendsApi.requests(),
        usersApi.referral(),
        friendsApi.discover().catch(() => ({ users: [] as User[] })),
      ]);
      setFriends(f);
      setReceived(r);
      setSent(s);
      setReferralCode(code);
      setReferralCount(count);
      setDiscoverUsers(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load friends.');
    } finally {
      setLoading(false);
    }
  };

  const doSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { users } = await friendsApi.search(q.trim());
      setSearchResults(users);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const copyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareInvite = async () => {
    if (!referralCode) return;
    const text = `Join me on Big Face — the new face of social! Use my invite code ${referralCode} and we both earn rewards. 👑`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join Big Face', text, url: 'https://big-face-frontend-production.up.railway.app/signup' });
      } catch {
        /* user cancelled */
      }
    } else {
      copyCode();
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
          {/* Friend navigation tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <button
              className={`btn ${tab === 'friends' ? '' : 'btn-ghost'}`}
              onClick={() => setTab('friends')}
              style={{ flex: 1 }}
            >
              👥 My Friends ({friends.length})
            </button>
            <button
              className={`btn ${tab === 'discover' ? '' : 'btn-ghost'}`}
              onClick={() => setTab('discover')}
              style={{ flex: 1 }}
            >
              🔍 Meet New People
              {received.length > 0 && tab !== 'discover' && (
                <span style={{
                  marginLeft: '0.4rem', background: 'var(--gold)', color: '#000',
                  borderRadius: 10, padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800,
                }}>
                  {received.length}
                </span>
              )}
            </button>
          </div>

          {tab === 'discover' && (
            <>
              <div className="card" style={{ marginBottom: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.6rem' }}>🔍 Search people</h3>
                <input
                  type="text"
                  placeholder="Search by name or username…"
                  value={searchQuery}
                  onChange={(e) => doSearch(e.target.value)}
                  className="input"
                  style={{ width: '100%', marginBottom: searchResults.length > 0 ? '0.8rem' : 0 }}
                />
                {searching && <p className="form-note">Searching…</p>}
                {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <p className="form-note">No one found. Try a different name.</p>
                )}
                {searchResults.map((p) => (
                  <UserRow key={p.id} person={p}>
                    <button
                      className="btn btn-sm"
                      disabled={busyId === p.id}
                      onClick={() => act(p.id, friendsApi.request)}
                    >
                      {busyId === p.id ? '…' : '➕ Add Friend'}
                    </button>
                  </UserRow>
                ))}
              </div>

              <div className="card" style={{ marginBottom: '1.2rem' }}>
                <h3 style={{ margin: '0 0 0.4rem' }}>✨ People you may know</h3>
                <p className="form-note" style={{ margin: '0 0 0.8rem' }}>
                  Active players you haven't connected with yet.
                </p>
                {discoverUsers.length === 0 ? (
                  <p className="form-note">No suggestions right now. Check back later!</p>
                ) : (
                  discoverUsers.map((p) => (
                    <UserRow key={p.id} person={p}>
                      <button
                        className="btn btn-sm"
                        disabled={busyId === p.id}
                        onClick={() => act(p.id, friendsApi.request)}
                      >
                        {busyId === p.id ? '…' : '➕ Add Friend'}
                      </button>
                    </UserRow>
                  ))
                )}
              </div>
            </>
          )}

          {tab === 'friends' && (
          <>
          {referralCode && (
            <div className="card" style={{ marginBottom: '1.2rem', borderColor: 'var(--gold)', background: 'linear-gradient(135deg, rgba(201,162,39,0.08), transparent)' }}>
              <h3 style={{ margin: '0 0 0.4rem' }}>🎁 Invite friends, earn rewards</h3>
              <p className="form-note" style={{ margin: '0 0 0.8rem' }}>
                Share your code — you get <strong>+50 XP + 100 tokens</strong> per friend who joins. They get +25 XP.
                {referralCount > 0 && <span> You've invited <strong>{referralCount}</strong> so far! 🔥</span>}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <code style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', padding: '0.4rem 0.8rem', background: 'var(--surface)', borderRadius: 8, border: '1px dashed var(--gold)' }}>
                  {referralCode}
                </code>
                <button className="btn btn-sm" onClick={copyCode}>
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button className="btn btn-sm" onClick={shareInvite} style={{ fontWeight: 800 }}>
                  📤 Share invite
                </button>
              </div>
            </div>
          )}
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
        </>
      )}
    </div>
  );
}
