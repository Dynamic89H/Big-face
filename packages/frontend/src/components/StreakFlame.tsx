import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('bigface.token')}` });

// Streak flame: shows the user's current XP streak with a fire icon.
// Fetches live streak data (count + freezes) from the engagement API.
export default function StreakFlame({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);
  const [freezes, setFreezes] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetch('/api/engagement2/streak', { headers: auth() })
      .then((r) => r.json())
      .then((d) => {
        setStreak(d.streak ?? 0);
        setFreezes(d.freezes ?? 0);
      })
      .catch(() => setStreak(user.xpStreak ?? 0));
  }, [user]);

  const s = streak ?? user?.xpStreak ?? 0;
  const fontSize = size === 'lg' ? '1.6rem' : size === 'sm' ? '0.95rem' : '1.2rem';
  // Flame grows hotter with longer streaks
  const flame = s >= 30 ? '🔥' : s >= 7 ? '🔥' : s >= 3 ? '🔥' : s > 0 ? '🧡' : '🤍';

  return (
    <span
      title={`${s}-day XP streak${freezes > 0 ? ` · ${freezes} freeze${freezes === 1 ? '' : 's'} banked` : ''}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        fontSize, fontWeight: 800,
        color: s > 0 ? '#ff7a1a' : 'var(--muted)',
        textShadow: s >= 7 ? '0 0 12px rgba(255,122,26,0.6)' : undefined,
      }}
    >
      <span>{flame}</span>
      <span>{s}</span>
      {freezes > 0 && (
        <span style={{ fontSize: '0.75em', color: 'var(--ice)', fontWeight: 700 }} title="Streak freezes — auto-saves your streak if you miss a day">
          ❄️{freezes}
        </span>
      )}
    </span>
  );
}
