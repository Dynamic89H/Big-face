import { useEffect, useState } from 'react';

interface Rank {
  name: string;
  icon: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  perk: string;
}

interface RankData {
  ranks: Rank[];
  current: Rank;
  currentIndex: number;
  next: Rank | null;
  level: number;
}

interface Leader {
  id: string;
  username: string;
  display_name: string;
  level: number;
  rank: Rank;
  profile_color: string;
}

/** Rank badge component — shows rank icon + name with rank color */
export function RankBadge({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' | 'lg' }) {
  const [rank, setRank] = useState<Rank | null>(null);

  useEffect(() => {
    // Derive rank client-side for instant display
    const ranks: Rank[] = [
      { name: 'Rookie', icon: '🥉', minLevel: 1, maxLevel: 2, color: '#cd7f32', perk: '' },
      { name: 'Grinder', icon: '🥈', minLevel: 3, maxLevel: 5, color: '#c0c0c0', perk: '' },
      { name: 'Hustler', icon: '🥇', minLevel: 6, maxLevel: 10, color: '#ffd700', perk: '' },
      { name: 'Boss', icon: '💎', minLevel: 11, maxLevel: 20, color: '#00d4ff', perk: '' },
      { name: 'Kingpin', icon: '👑', minLevel: 21, maxLevel: 30, color: '#ff6b00', perk: '' },
      { name: 'Legend', icon: '🌟', minLevel: 31, maxLevel: 999, color: '#ff00ff', perk: '' },
    ];
    setRank(ranks.find((r) => level >= r.minLevel && level <= r.maxLevel) || ranks[0]);
  }, [level]);

  if (!rank) return null;

  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '1.1rem' : '0.85rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize, fontWeight: 700, color: rank.color,
      border: `1px solid ${rank.color}`, borderRadius: 12,
      padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.75rem',
      background: `${rank.color}15`,
    }}>
      {rank.icon} {rank.name}
    </span>
  );
}

/**
 * RanksPage — the come up. All ranks, perks, leaderboard.
 */
export default function RanksPage() {
  const [data, setData] = useState<RankData | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    fetch('/api/ranks', { headers })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
    fetch('/api/ranks/leaderboard', { headers })
      .then((r) => r.json())
      .then((d) => setLeaders(d.leaders || []))
      .catch(() => {});
  }, []);

  return (
    <div className="page" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="pattern-royal">
          🏆 Ranks
        </h1>
        <p className="pattern-royal-sub">The come up. Grind your way to Legend.</p>
      </div>

      {data && (
        <div className="pattern-gold pattern-elev-3" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            YOUR RANK
          </div>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{data.current.icon}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: data.current.color }}>
            {data.current.name}
          </div>
          <div className="form-note" style={{ marginTop: '0.5rem' }}>
            Level {data.level} • {data.current.perk}
          </div>
          {data.next && (
            <div className="form-note" style={{ marginTop: '0.75rem' }}>
              Next: {data.next.icon} {data.next.name} at Level {data.next.minLevel}
            </div>
          )}
        </div>
      )}

      <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>All Ranks</h2>
      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
        {data?.ranks.map((rank, i) => {
          const isCurrent = data.currentIndex === i;
          const isUnlocked = data.currentIndex >= i;
          return (
            <div
              key={rank.name}
              className="card"
              style={{
                padding: '1rem 1.25rem',
                borderColor: isCurrent ? rank.color : undefined,
                opacity: isUnlocked ? 1 : 0.5,
                background: isCurrent ? `${rank.color}10` : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{rank.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: rank.color, fontSize: '1.1rem' }}>
                    {rank.name}
                    {isCurrent && ' ← YOU'}
                  </div>
                  <div className="form-note" style={{ fontSize: '0.85rem' }}>
                    Level {rank.minLevel}{rank.maxLevel < 999 ? `–${rank.maxLevel}` : '+'} • {rank.perk}
                  </div>
                </div>
                {!isUnlocked && <span style={{ fontSize: '1.2rem' }}>🔒</span>}
                {isUnlocked && !isCurrent && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Top Ranked</h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {leaders.slice(0, 10).map((l, i) => (
          <div key={l.id} className="card" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontWeight: 800, minWidth: 24 }}>#{i + 1}</span>
              <span style={{ fontWeight: 700, flex: 1 }}>{l.display_name || l.username}</span>
              <RankBadge level={l.level} size="sm" />
            </div>
          </div>
        ))}
        {leaders.length === 0 && (
          <p className="form-note" style={{ textAlign: 'center' }}>
            No ranked players yet. Be the first! 🏆
          </p>
        )}
      </div>
    </div>
  );
}
