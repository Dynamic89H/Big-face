import { useEffect, useState, type CSSProperties } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLang, LANGS, type Lang } from '../i18n/LangContext';
import { getSocket, type GiftReceivedPayload, type RankUpPayload } from '../api/socket';
import RedCarpetBanner from './RedCarpetBanner';
import DailyRewardBanner from './DailyRewardBanner';
import Avatar, { facePhotoOf } from './Avatar';
import { GIFT_EMOJI } from './GiftDialog';

interface Toast {
  id: number;
  title: string;
  sub: string;
}

const NAV: { to: string; key: string; icon: string }[] = [
  { to: '/chats', key: 'nav_chat', icon: '💬' },
  { to: '/video', key: 'nav_video', icon: '📹' },
  { to: '/leaderboard', key: 'nav_leaderboard', icon: '🏆' },
  { to: '/hall-of-fame', key: 'nav_hall', icon: '⭐' },
  { to: '/avatar-studio', key: 'nav_studio', icon: '🎨' },
  { to: '/throne', key: 'nav_throne', icon: '👑' },
  { to: '/fame', key: 'nav_fame', icon: '🌟' },
  { to: '/friends', key: 'nav_friends', icon: '👥' },
  { to: '/lifestyle', key: 'nav_lifestyle', icon: '💎' },
  { to: '/battles', key: 'nav_battles', icon: '⚔️' },
  { to: '/crews', key: 'nav_crews', icon: '👥' },
  { to: '/artists', key: 'nav_artists', icon: '🎤' },
  { to: '/gamble', key: 'nav_gamble', icon: '🎲' },
  { to: '/dj-booth', key: 'nav_dj', icon: '🎧' },
  { to: '/safety', key: 'nav_safety', icon: '🛡️' },
  { to: '/wallet', key: 'nav_wallet', icon: '💰' },
  { to: '/earnings', key: 'nav_earnings', icon: '💵' },
];

let toastId = 0;

export default function Layout() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
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
        <span>{t(n.key as any)}</span>
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
          <Avatar displayName={user.displayName} profileColor={user.profileColor} online photoUrl={facePhotoOf(user)} />
          <div className="meta">
            <div className="name">{user.displayName}</div>
            <div className="level">Level {user.level} · {user.xp} XP</div>
          </div>
          <button className="icon-btn" title="Edit profile" onClick={() => navigate('/profile/edit')}>✏️</button>
          <button className="icon-btn" title="Log out" onClick={handleLogout}>⏻</button>
        </div>
        <div style={{ padding: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {LANGS.map((l: { code: Lang; label: string; flag: string }) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              title={l.label}
              style={{
                border: lang === l.code ? '2px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 8, background: 'transparent', fontSize: '1.1rem',
                padding: '0.2rem 0.4rem', cursor: 'pointer', opacity: lang === l.code ? 1 : 0.6,
              }}
            >
              {l.flag}
            </button>
          ))}
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
      <DailyRewardBanner />
    </div>
  );
}
