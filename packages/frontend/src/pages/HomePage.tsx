import { useEffect, useState } from 'react';
import HomeHub from '../components/HomeHub';
import DailyChecklist from '../components/DailyChecklist';
import { useAuth } from '../auth/AuthContext';
import { walletApi } from '../api/client';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Home — Big Face's front door.
 * Walking into a grand casino: gold hero with your empire stats,
 * then scroll through the operation.
 */
export default function HomePage() {
  usePageTitle('Big Face');
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    walletApi.get().then((w) => setBalance(w.balance)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = user?.displayName || 'Player';

  return (
    <div className="page">
      {/* GRAND HERO — the casino entrance */}
      <div className="home-hero">
        <div className="hero-kicker">🎰 Big Face Casino & Social Club</div>
        <h1 className="hero-greeting">
          {greeting}, {name} 👑
        </h1>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">
              {balance === null ? '—' : balance.toLocaleString()}
            </div>
            <div className="lbl">🪙 Tokens</div>
          </div>
          <div className="hero-stat">
            <div className="num">{user?.level ?? '—'}</div>
            <div className="lbl">⚡ Level</div>
          </div>
          <div className="hero-stat">
            <div className="num">
              {user?.xp?.toLocaleString() ?? '—'}
            </div>
            <div className="lbl">✨ XP</div>
          </div>
          {(user?.xpStreak ?? 0) > 0 && (
            <div className="hero-stat">
              <div className="num">🔥 {user!.xpStreak}</div>
              <div className="lbl">Day Streak</div>
            </div>
          )}
        </div>
      </div>

      <DailyChecklist />
      <HomeHub />
    </div>
  );
}
