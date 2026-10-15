import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi, throneApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { User } from '../types';
import { xpForLevel } from '../types';
import Avatar, { facePhotoOf } from '../components/Avatar';
import LegendaryBadge from '../components/LegendaryBadge';
import { usePageTitle } from '../hooks/usePageTitle';

const FAME_STEPS = [
  { level: 1, title: 'New Face', desc: 'You joined Big Face. Start chatting, posting, and earning XP.', icon: '🌱' },
  { level: 3, title: 'Rising Star', desc: 'Unlock rare avatar gear. Your name starts getting noticed.', icon: '⭐' },
  { level: 5, title: 'Local Legend', desc: 'Epic gear unlocks. Climb the weekly leaderboard.', icon: '🔥' },
  { level: 8, title: 'Superstar', desc: 'Legendary gear unlocks. Take your seat on a golden throne.', icon: '💫' },
  { level: 10, title: 'Face King / Queen', desc: 'The ultimate crown. Weekly red carpet, royal chime, real rewards.', icon: '👑' },
];

export default function FameTrackerPage() {
  usePageTitle('Fame Tracker');
  const { user } = useAuth();
  const [king, setKing] = useState<User | null>(null);
  const [queen, setQueen] = useState<User | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [legendary, throne] = await Promise.all([
          usersApi.legendary(),
          throneApi.me().catch(() => null),
        ]);
        setKing(legendary.king);
        setQueen(legendary.queen);
        setRank(throne?.rank ?? null);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Could not load fame data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Fame Tracker</h1>
        <p className="page-sub">Your road from new face to legendary royalty.</p>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Reading the stars…</p></div>}
      {error && !loading && <div className="error-wrap"><p>😕 {error}</p></div>}

      {!loading && !error && (
        <>
          <div className="card" style={{ marginBottom: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.6rem' }}>Your fame right now</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Avatar displayName={user?.displayName ?? '?'} profileColor={user?.profileColor ?? '#0066FF'} photoUrl={facePhotoOf(user)} size="lg" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.displayName}</div>
                <div className="form-note">
                  Level {level} · {xp} XP{rank ? ` · Rank #${rank}` : ''}
                </div>
                <div className="xp-bar" style={{ marginTop: '0.5rem', maxWidth: 260 }}>
                  <div
                    className="fill"
                    style={{
                      width: `${Math.min(100, ((xp - xpForLevel(level)) / Math.max(1, xpForLevel(level + 1) - xpForLevel(level))) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.8rem' }}>🛤️ Path to the crown</h3>
            {FAME_STEPS.map((s) => {
              const reached = level >= s.level;
              const current = !reached && (FAME_STEPS.findIndex((x) => x.level > level) === FAME_STEPS.indexOf(s));
              return (
                <div
                  key={s.level}
                  style={{
                    display: 'flex', gap: '0.8rem', padding: '0.7rem 0',
                    borderBottom: '1px solid var(--border)',
                    opacity: reached ? 1 : 0.75,
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{reached ? '✅' : s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>
                      {s.title} <span className="form-note">· Level {s.level}</span>
                      {current && <span className="badge badge-blue" style={{ marginLeft: '0.5rem' }}>You're here</span>}
                    </div>
                    <div className="form-note">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid-2">
            <div className="card">
              <h3>🤴 This week's King</h3>
              {king ? (
                <Link to={`/u/${king.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Avatar displayName={king.displayName} profileColor={king.profileColor} photoUrl={facePhotoOf(king)} crowned />
                  <div>
                    <div className="starlight">{king.displayName}</div>
                    <LegendaryBadge role="king" size="sm" />
                  </div>
                </Link>
              ) : (
                <p className="form-note">No king crowned yet — it could be you.</p>
              )}
            </div>
            <div className="card">
              <h3>👸 This week's Queen</h3>
              {queen ? (
                <Link to={`/u/${queen.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Avatar displayName={queen.displayName} profileColor={queen.profileColor} photoUrl={facePhotoOf(queen)} crowned />
                  <div>
                    <div className="starlight">{queen.displayName}</div>
                    <LegendaryBadge role="queen" size="sm" />
                  </div>
                </Link>
              ) : (
                <p className="form-note">No queen crowned yet — it could be you.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
            <h3>💰 Fame pays</h3>
            <p className="form-note">
              Gifts from fans convert to tokens. Tokens convert to real money in your Earnings dashboard.
              Big Face takes a 30% platform fee — you keep 70%.
            </p>
            <Link to="/earnings" className="btn" style={{ marginTop: '0.6rem' }}>
              View Earnings
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
