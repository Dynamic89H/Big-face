import { useEffect, useState, type CSSProperties, Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLang, LANGS, type Lang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { getSocket, type GiftReceivedPayload, type RankUpPayload } from '../api/socket';
import RedCarpetBanner from './RedCarpetBanner';
import DailyRewardBanner from './DailyRewardBanner';
import ComebackBanner from './ComebackBanner';
import WinFeedTicker from './WinFeedTicker';
import SpinWheel from './SpinWheel';
import WelcomeFlow from './WelcomeFlow';
import GiftRain from './GiftRain';
import Avatar, { facePhotoOf } from './Avatar';
import { GIFT_EMOJI } from './GiftDialog';
import WhatIsBigFace from './WhatIsBigFace';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { celebrate } from './Celebration';
import RankUpOverlay from './RankUpOverlay';
import { xpProgress } from '../utils/xp';

/** Rank name → brand color for the epic rank-up overlay. */
const RANK_COLORS: Record<string, string> = {
  Rookie: '#cd7f32', Grinder: '#c0c0c0', Hustler: '#ffd700',
  Boss: '#00d4ff', Kingpin: '#ff6b00', Legend: '#ff00ff',
  'Face King': '#ffd700', 'Face Queen': '#ffd700',
};

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
  { to: '/crews', key: 'nav_crews', icon: '🛡️' },
  { to: '/artists', key: 'nav_artists', icon: '🎤' },
  { to: '/gamble', key: 'nav_gamble', icon: '🎲' },
  { to: '/shop', key: 'nav_shop', icon: '🛍️' },
  { to: '/competition', key: 'nav_competition', icon: '🥇' },
  { to: '/social', key: 'nav_social', icon: '🎉' },
  { to: '/stories', key: 'nav_stories', icon: '📸' },
  { to: '/vault', key: 'nav_vault', icon: '💰' },
  { to: '/vision', key: 'nav_vision', icon: '🔮' },
  { to: '/ranks', key: 'nav_ranks', icon: '🎖️' },
  { to: '/seasons', key: 'nav_seasons', icon: '🗓️' },
  { to: '/settings', key: 'nav_settings', icon: '⚙️' },
  { to: '/factory', key: 'nav_factory', icon: '🏭' },
  { to: '/avatar-studio', key: 'nav_creator', icon: '🎭' },
  { to: '/lobby', key: 'nav_lobby', icon: '🏛️' },
  { to: '/insights', key: 'nav_insights', icon: '📊' },
  { to: '/dj-booth', key: 'nav_dj', icon: '🎧' },
  { to: '/safety', key: 'nav_safety', icon: '🛡️' },
  { to: '/wallet', key: 'nav_wallet', icon: '👛' },
  { to: '/earnings', key: 'nav_earnings', icon: '💵' },
];

// Slim bottom nav — just the essentials. Everything else lives in the Home Hub.
const BOTTOM_NAV: { to: string; key: StringKey; icon: string }[] = [
  { to: '/home', key: 'nav_home', icon: '🏠' },
  { to: '/gamble', key: 'nav_gamble', icon: '🎲' },
  { to: '/ranks', key: 'nav_ranks', icon: '🎖️' },
  { to: '/chats', key: 'nav_chat', icon: '💬' },
  { to: '/leaderboard', key: 'nav_leaderboard', icon: '🏆' },
  { to: '/profile', key: 'nav_profile', icon: '👤' },
];

let toastId = 0;

export default function Layout() {
  const { user, logout, xpFlash } = useAuth();
  const xpBar = user ? xpProgress(user.xp, user.level) : null;
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showExplainer, setShowExplainer] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem('bigface.welcomed');
    } catch {
      return false;
    }
  });
  const { supported, permission, subscribed, subscribe } = usePushNotifications();

  // Show "What is Big Face" explainer once for new users.
  useEffect(() => {
    if (user && !localStorage.getItem('bigface-explainer-seen')) {
      setShowExplainer(true);
    }
  }, [user?.id]);

  // Prompt for push notifications after explainer is dismissed.
  useEffect(() => {
    if (user && !showExplainer && supported && permission === 'default' && !subscribed
        && !localStorage.getItem('bigface-notif-asked')) {
      const timer = setTimeout(() => setShowNotifPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user?.id, showExplainer, supported, permission, subscribed]);

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
      if (p.userId === user?.id) {
        if (p.rankChanged && p.rank) {
          // EPIC rank-up overlay — a new RANK, not just a level. This is the big one.
          window.dispatchEvent(new CustomEvent('bigface:rank-up', {
            detail: {
              rankName: p.rank,
              rankIcon: p.rankIcon || '🏆',
              rankColor: RANK_COLORS[p.rank] || '#ffd700',
              level: p.level,
              tokensWon: p.tokensWon || 0,
              gender: user?.gender,
            },
          }));
        } else {
          celebrate(`🎉 LEVEL ${p.level}!`, true);
        }
      }
    };
    const onGift = (p: any) => {
      // Handle both gift shapes: full gift object and level-up reward
      const giftKey = p.gift?.giftKey || p.giftKey || 'gift';
      const giftLabel = p.gift?.gift_label || p.giftLabel || p.gift || 'a gift';
      const emoji = GIFT_EMOJI[giftKey] ?? '🎁';
      const from = p.from || 'Someone';
      const msg = p.message || p.gift?.message || '';
      pushToast(`${emoji} Gift from ${from}!`, `${giftLabel}${msg ? `: "${msg}"` : ''} +10 XP!`);
      if (p.count > 1) {
        pushToast(`🎁 ${p.count}x ${giftLabel}!`, `Level ${p.level} milestone reward!`);
      }
    };
    s.on('user:rank-up', onRankUp);
    s.on('gift:received', onGift);
    // XP engagement: milestones, streaks
    const onXpMilestone = (p: any) => {
      const who = p.userId === user?.id ? 'You' : p.displayName || 'Someone';
      pushToast(`🌟 ${who} hit ${Number(p.milestone).toLocaleString()} XP!`, 'XP Milestone reached!');
      if (p.userId === user?.id) {
        celebrate(`🌟 ${Number(p.milestone).toLocaleString()} XP!`, true);
      }
    };
    const onStreakMilestone = (p: any) => {
      pushToast(`🔥 ${p.streak}-day XP streak!`, `+${p.bonus} bonus XP! Keep it going!`);
      celebrate(`🔥 ${p.streak} DAY STREAK!`, true);
    };
    const onFriendRequest = (p: { fromUserId: string; fromName: string }) => {
      pushToast('🤝 New friend request!', `${p.fromName} wants to be friends. Check the Friends tab!`);
    };
    s.on('xp:milestone', onXpMilestone);
    s.on('xp:streak-milestone', onStreakMilestone);
    s.on('friend:request', onFriendRequest);
    return () => {
      s.off('user:rank-up', onRankUp);
      s.off('gift:received', onGift);
      s.off('xp:milestone', onXpMilestone);
      s.off('xp:streak-milestone', onStreakMilestone);
      s.off('friend:request', onFriendRequest);
    };
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const closeExplainer = () => {
    localStorage.setItem('bigface-explainer-seen', '1');
    setShowExplainer(false);
  };

  const handleNotifChoice = async (enable: boolean) => {
    localStorage.setItem('bigface-notif-asked', '1');
    setShowNotifPrompt(false);
    if (enable) await subscribe();
  };

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
      {/* Persistent XP progress — visible on every page, mobile + desktop */}
      {xpBar && (
        <div className="xp-topbar" title={`Level ${user!.level} · ${user!.xp.toLocaleString()} XP (${xpBar.percent}% to Level ${user!.level + 1})`}>
          <div className="xp-topbar-fill" style={{ width: `${xpBar.percent}%` }} />
        </div>
      )}
      {/* Floating "+N XP" feedback on every XP gain */}
      {xpFlash && (
        <div key={xpFlash.key} className="xp-flash" aria-live="polite">
          +{xpFlash.amount} XP
        </div>
      )}
      {showExplainer && <WhatIsBigFace onClose={closeExplainer} />}
      {showWelcome && (
        <WelcomeFlow
          onDone={() => {
            try {
              localStorage.setItem('bigface.welcomed', '1');
            } catch {}
            setShowWelcome(false);
          }}
        />
      )}
      {showNotifPrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card" style={{ maxWidth: 360, textAlign: 'center', padding: '1.8rem' }}>
            <div style={{ fontSize: '3rem' }}>🔔</div>
            <h3>Stay in the loop</h3>
            <p className="form-note">Get daily updates — new battles, big pots, and rewards. Never miss out.</p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn" onClick={() => handleNotifChoice(true)}>🔔 Turn on</button>
              <button className="btn btn-ghost" onClick={() => handleNotifChoice(false)}>Not now</button>
            </div>
          </div>
        </div>
      )}
      <aside className="sidebar">
        <NavLink to="/home" className="wordmark">BIG FACE</NavLink>
        <nav className="nav">{navLinks('nav-link')}</nav>
        <div className="user-chip">
          <Avatar displayName={user.displayName} profileColor={user.profileColor} online photoUrl={facePhotoOf(user)} />
          <div className="meta">
            <div className="name">{user.displayName}</div>
            <div className="level">Level {user.level} · {user.xp.toLocaleString()} XP</div>
            {xpBar && (
              <div className="xp-chip-bar" title={`${xpBar.current.toLocaleString()} / ${xpBar.needed.toLocaleString()} XP`}>
                <div className="xp-chip-fill" style={{ width: `${xpBar.percent}%` }} />
              </div>
            )}
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
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gold)' }}>
            ✨ Loading...
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      <nav className="bottom-nav">{BOTTOM_NAV.map((n) => (
        <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">{n.icon}</span>
          <span className="nav-label">{t(n.key)}</span>
        </NavLink>
      ))}</nav>

      {/* Live wins ticker sits above the bottom nav, hidden in chat rooms */}
      {!location.pathname.startsWith('/chats/') && <WinFeedTicker />}

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
      <ComebackBanner />
      {/* Engagement engine — every page, every position */}
      <SpinWheel />
      <GiftRain />
      <RankUpOverlay />
    </div>
  );
}
