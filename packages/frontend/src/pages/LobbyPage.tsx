import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, roomsApi } from '../api/client';
import type { User, RoomSummary } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import Avatar, { facePhotoOf } from '../components/Avatar';
import Pulse from '../components/Pulse';

/**
 * Lobby — the real social hub of Big Face.
 * Shows who's online (with their REAL characters), active rooms,
 * and gets you where you want to go. No procedural logos.
 */
export default function LobbyPage() {
  usePageTitle('Lobby');
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [lb, rm] = await Promise.all([
        usersApi.leaderboard(12),
        roomsApi.list(),
      ]);
      setOnlineUsers(lb.entries.map((e: any) => e.user).filter(Boolean).slice(0, 8));
      setRooms(rm.rooms?.slice(0, 6) || []);
    } catch {
      /* offline */
    } finally {
      setLoading(false);
    }
  }, []);

  const { pulling, pullDistance } = usePullToRefresh(refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Entering the lobby…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Pulse />
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div style={{
          textAlign: 'center', padding: '0.5rem',
          transform: `translateY(${Math.min(pullDistance - 20, 40)}px)`,
          opacity: Math.min(pullDistance / 60, 1),
          fontSize: '1.5rem',
        }}>
          {pulling ? '🔄' : '⬇️'}
        </div>
      )}
      {/* Hero — premium Big Face entrance */}
      <div style={{
        textAlign: 'center', padding: '3rem 1.5rem', marginBottom: '2rem',
        background: 'linear-gradient(160deg, rgba(201,162,39,0.15), rgba(0,240,255,0.08), rgba(139,92,246,0.06))',
        borderRadius: 28, border: '1px solid rgba(201,162,39,0.3)',
        boxShadow: '0 0 60px rgba(201,162,39,0.1), 0 0 100px rgba(0,240,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated shine sweep */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.08), transparent)',
          transform: 'skewX(-20deg)', animation: 'heroShine 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <style>{`@keyframes heroShine { 0% { left: -100%; } 50%, 100% { left: 150%; } }`}</style>
        <h1 className="shine-text" style={{
          fontSize: '2.8rem', margin: 0, fontWeight: 900, letterSpacing: '-0.02em',
        }}>
          🏛️ The Lobby
        </h1>
        <p style={{ fontSize: '1.05rem', margin: '0.75rem 0 0', color: 'var(--text)', opacity: 0.85 }}>
          Where Big Face hangs out. Pick a room or start your own.
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn glow-gold" onClick={() => navigate('/gamble')}>
            🎲 Gamble Face
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/battles')}>
            ⚔️ Battles
          </button>
        </div>
      </div>

      {/* Who's here — real characters */}
      <h3 style={{ marginBottom: '0.8rem' }}>
        <span className="live-dot" style={{ marginRight: '0.5rem' }} />
        Who's Here
      </h3>
      {onlineUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="form-note">No one's here yet — be the first.</p>
          <button className="btn" onClick={() => navigate('/rooms')}>Find a Room</button>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {onlineUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => navigate(`/profile/${u.id}`)}
              style={{
                cursor: 'pointer', textAlign: 'center', padding: '1rem 0.5rem',
                background: 'rgba(255,255,255,0.03)', borderRadius: 16,
                border: '1px solid var(--border)',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <Avatar
                displayName={u.displayName || u.username}
                profileColor={u.profileColor || '#0066FF'}
                photoUrl={facePhotoOf(u)}
                size="lg"
              />
              <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.displayName || u.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>
                Lv {u.level || 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active rooms */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <h3 style={{ margin: 0 }}>🔥 Active Rooms</h3>
        <button className="btn btn-sm" onClick={() => navigate('/rooms')}>View All</button>
      </div>
      {rooms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
          <p className="form-note">No active rooms right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '2rem' }}>
          {rooms.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/rooms/${r.id}`)}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem' }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{r.name}</div>
                <div className="form-note" style={{ fontSize: '0.8rem' }}>
                  💬 {r.unreadCount > 0 ? `${r.unreadCount} new` : 'Join the convo'}
                </div>
              </div>
              <button className="btn btn-sm">Join →</button>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <h3 style={{ marginBottom: '0.8rem' }}>⚡ Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem' }}>
        {[
          { icon: '💬', label: 'Start Chat', path: '/chats' },
          { icon: '🎨', label: 'My Avatar', path: '/avatar-studio' },
          { icon: '⚔️', label: 'Battles', path: '/battles' },
          { icon: '🎰', label: 'Gamble Face', path: '/gamble' },
          { icon: '🏭', label: 'Factory', path: '/factory' },
        ].map((a) => (
          <button
            key={a.path}
            className="btn"
            onClick={() => navigate(a.path)}
            style={{ padding: '1rem', fontSize: '1rem' }}
          >
            <div style={{ fontSize: '1.8rem' }}>{a.icon}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
