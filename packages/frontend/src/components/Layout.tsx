import { useEffect, useState, type CSSProperties } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getSocket, type GiftReceivedPayload, type RankUpPayload } from '../api/socket';
import RedCarpetBanner from './RedCarpetBanner';
import Avatar from './Avatar';
import { GIFT_EMOJI } from './GiftDialog';

interface Toast {
  id: number;
  title: string;
  sub: string;
}

const NAV = [
  { to: '/chats', label: 'Chats', icon: '💬' },
  { to: '/video', label: 'Video', icon: '📹' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/hall-of-fame', label: 'Hall of Fame', icon: '⭐' },
  { to: '/avatar-studio', label: 'Avatar Studio', icon: '🎨' },
  { to: '/throne', label: 'Throne Room', icon: '👑' },
  { to: '/wallet', label: 'Wallet', icon: '💰' },
  { to: '/earnings', label: 'Earnings', icon: '💵' },
];

let toastId = 0;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (title: string, sub: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, title, sub }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 7000);
  };

  // Global realtime toasts: rank-ups and incoming gifts.
  useEffect(() => {
    const s = getSocket();
    const onRankUp = (p: RankUpPayload) => {
      const who = p.userId === user?.id ? 'You' : 'Someone';
      pushToast(`🎉 ${who} ranked up!`, `${who === 'You' ? 'You are' : 'They are'} now Level ${p.level} — ${p.tier}.`);
    };
    const onGift = (p: GiftReceivedPayload) => {
      const emoji = GIFT_EMOJI[p.gift.giftKey] ?? '🎁';
      pushToast(`${emoji} Gift received!`, `Someone sent you a gift${p.gift.message ? `: “${p.gift.message}”` : ''}. +10 XP!`);
    };
    s.on('user:rank-up', onRankUp);
    s.on('gift:received', onGift);
    return () => {
      s.off('user:rank-up', onRankUp);
      s.off('gift:received', onGift);
    };
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const navLinks = (cls: string) =>
    NAV.map((n) => (
      <NavLink key={n.to} to={n.to} className={({ isActive }) => `${cls}${isActive ? ' active' : ''}`}>
        <span className="nav-icon">{n.icon}</span>
        <span>{n.label}</span>
      </NavLink>
    ));

  return (
    <div
      className="app-shell"
      // The user's profile color drives accent theming across the shell.
      style={{ '--accent': user.profileColor || '#0066FF' } as CSSProperties}
    >
      <aside className="sidebar">
        <NavLink to="/chats" className="wordmark">BIG FACE</NavLink>
        <nav className="nav">{navLinks('nav-link')}</nav>
        <div className="user-chip">
          <Avatar displayName={user.displayName} profileColor={user.profileColor} online />
          <div className="meta">
            <div className="name">{user.displayName}</div>
            <div className="level">Level {user.level} · {user.xp} XP</div>
          </div>
          <button className="icon-btn" title="Edit profile" onClick={() => navigate('/profile/edit')}>✏️</button>
          <button className="icon-btn" title="Log out" onClick={handleLogout}>⏻</button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      <nav className="bottom-nav">{navLinks('nav-link')}</nav>

      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div className="t-title">{t.title}</div>
            <div className="t-sub">{t.sub}</div>
          </div>
        ))}
      </div>

      <RedCarpetBanner />
    </div>
  );
}
