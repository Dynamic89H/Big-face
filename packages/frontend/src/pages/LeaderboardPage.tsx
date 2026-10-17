import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { LeaderboardEntry, User } from '../types';
import Avatar, { facePhotoOf } from '../components/Avatar';
import LegendaryBadge from '../components/LegendaryBadge';
import { usePageTitle } from '../hooks/usePageTitle';

const MEDALS = ['🥇', '🥈', '🥉'];

function RoyalCard({ title, crown, person, role, loading }: { title: string; crown: string; person: User | null; role: 'king' | 'queen'; loading?: boolean }) {
  if (loading) {
    return (
      <div className="card royal-card">
        <div className="crown">{crown}</div>
        <h3 style={{ margin: '0.4rem 0' }}>{title}</h3>
        <div className="loading-wrap" style={{ margin: 0 }}><div className="spinner" /></div>
      </div>
    );
  }
  if (!person) {
    return (
      <div className="card royal-card">
        <div className="crown">{crown}</div>
        <h3 style={{ margin: '0.4rem 0' }}>{title}</h3>
        <p className="form-note">No one has claimed this crown yet this week. It could be you.</p>
      </div>
    );
  }
  return (
    <div className="card royal-card">
      <div className="crown">{crown}</div>
      <h3 style={{ margin: '0.4rem 0' }}>{title}</h3>
      <Link to={`/u/${person.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <Avatar displayName={person.displayName} profileColor={person.profileColor} photoUrl={facePhotoOf(person)} crowned />
        <div>
          <div className="starlight">{person.displayName}</div>
          <div style={{ margin: '0.2rem 0' }}><LegendaryBadge role={role} size="sm" /></div>
          <div className="form-note">@{person.username} · Level {person.level} · {person.xp} XP</div>
        </div>
      </Link>
    </div>
  );
}

export default function LeaderboardPage() {
  usePageTitle('Leaderboard');
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [king, setKing] = useState<User | null>(null);
  const [queen, setQueen] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ entries }, legendary] = await Promise.all([
        usersApi.leaderboard(50),
        usersApi.legendary(),
      ]);
      setEntries(entries);
      setKing(legendary.king);
      setQueen(legendary.queen);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load the leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-sub">The race for the throne. Earn XP by chatting, posting, and receiving gifts.</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.4rem' }}>
        <RoyalCard title="Face King" crown="🤴" person={king} role="king" loading={loading} />
        <RoyalCard title="Face Queen" crown="👸" person={queen} role="queen" loading={loading} />
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Counting XP…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}
      {!loading && !error && entries.length === 0 && (
        <div className="card empty-wrap">
          <div className="big">🏆</div>
          <h3>Nobody's on the board yet</h3>
          <p>Be the first to earn XP — send a message and take the lead.</p>
        </div>
      )}
      {!loading && !error && entries.length > 0 && (
        <div className="card" style={{ padding: '0.6rem' }}>
          {entries.map((e, i) => {
            const topClass = i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : '';
            const isMe = e.user.id === user?.id;
            return (
              <Link
                key={e.user.id}
                to={`/u/${e.user.id}`}
                className={`lb-row${topClass}`}
                style={isMe ? { outline: '1px dashed var(--blue)', outlineOffset: -1 } : undefined}
              >
                <div className="lb-rank">{i < 3 ? MEDALS[i] : `#${e.rank}`}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                  <Avatar displayName={e.user.displayName} profileColor={e.user.profileColor} size="sm" photoUrl={facePhotoOf(e.user)} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.user.displayName}{isMe && ' (you)'}
                    </div>
                    <div className="form-note">@{e.user.username}</div>
                  </div>
                </div>
                <div className="lb-xp">
                  <div className="xp">{e.xp} XP</div>
                  <div className="lvl">Level {e.level}</div>
                </div>
                <div>{i < 3 && <span className="badge badge-gold">👑 Top 3</span>}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
