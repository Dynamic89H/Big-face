import { useEffect, useState } from 'react';
import { ranksApi } from '../api/client';

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
  xpProgress: {
    current: number;
    needed: number;
    remaining: number;
    percent: number;
  } | null;
}

interface Leader {
  id: string;
  username: string;
  display_name: string;
  level: number;
  rank?: Rank;
  profile_color: string;
}

const RANKS: Rank[] = [
  { name: 'Rookie', icon: '🥉', minLevel: 1, maxLevel: 2, color: '#cd7f32', perk: '' },
  { name: 'Grinder', icon: '🥈', minLevel: 3, maxLevel: 5, color: '#c0c0c0', perk: '' },
  { name: 'Hustler', icon: '🥇', minLevel: 6, maxLevel: 10, color: '#ffd700', perk: '' },
  { name: 'Boss', icon: '💎', minLevel: 11, maxLevel: 20, color: '#00d4ff', perk: '' },
  { name: 'Kingpin', icon: '👑', minLevel: 21, maxLevel: 30, color: '#ff6b00', perk: '' },
  { name: 'Legend', icon: '🌟', minLevel: 31, maxLevel: 39, color: '#ff00ff', perk: '' },
  { name: 'Face King', icon: '🤴', minLevel: 40, maxLevel: 999, color: '#ffd700', perk: 'OFFICIAL — crowned live for all players' },
];

/** Gender-aware pinnacle rank: Face King (male) / Face Queen (female). */
export function crownRank(gender?: string): Rank {
  const isQueen = gender === 'female';
  return {
    name: isQueen ? 'Face Queen' : 'Face King',
    icon: isQueen ? '👸' : '🤴',
    minLevel: 40, maxLevel: 999, color: '#ffd700',
    perk: 'OFFICIAL — crowned live for all players',
  };
}

export function rankForLevel(level: number, gender?: string): Rank {
  if (level >= 40) return crownRank(gender);
  return RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) || RANKS[0];
}

/** Rank badge component — shows rank icon + name with rank color */
export function RankBadge({ level, size = 'md', gender }: { level: number; size?: 'sm' | 'md' | 'lg'; gender?: string }) {
  // Derived synchronously so badges render on the first paint — no flash.
  const rank = rankForLevel(level, gender);

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
  const [rankTab, setRankTab] = useState<'my-rank' | 'ladder' | 'top'>('my-rank');
  const [rankLoading, setRankLoading] = useState(true);
  const [rankError, setRankError] = useState<string | null>(null);

  const loadRanks = () => {
    setRankLoading(true);
    setRankError(null);
    Promise.all([ranksApi.get(), ranksApi.leaderboard()])
      .then(([rankData, lb]) => {
        setData(rankData);
        setLeaders(lb.leaders || []);
      })
      .catch(() => setRankError('Could not load ranks. Check your connection and try again.'))
      .finally(() => setRankLoading(false));
  };

  useEffect(() => {
    loadRanks();
  }, []);

  return (
    <div className="page section-ranks" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="pattern-royal">
          🏆 Ranks
        </h1>
        <p className="pattern-royal-sub">The come up. Grind your way to Legend.</p>
      </div>

      {/* Ranks own navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {([
          ['my-rank', '👑 My Rank'],
          ['ladder', '🪜 Ladder'],
          ['top', '🔥 Top Players'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setRankTab(key)}
            className={`btn ${rankTab === key ? '' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '0.7rem 0.4rem', fontSize: '0.85rem' }}>
            {label}
          </button>
        ))}
      </div>

      {rankTab === 'my-rank' && rankLoading && (
        <div className="loading-wrap"><div className="spinner" /><p>Loading your rank…</p></div>
      )}
      {rankTab === 'my-rank' && rankError && !rankLoading && (
        <div className="error-wrap">
          <p>😕 {rankError}</p>
          <button className="btn" onClick={loadRanks}>Try again</button>
        </div>
      )}
      {rankTab === 'my-rank' && !rankLoading && !rankError && data && (
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
          {data.xpProgress && (
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  {data.xpProgress.remaining.toLocaleString()} XP to {data.next?.name}
                </span>
                <span className="form-note">{data.xpProgress.percent}%</span>
              </div>
              <div style={{
                height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${data.xpProgress.percent}%`,
                  background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                  borderRadius: 5, transition: 'width 0.5s ease',
                  boxShadow: '0 0 10px rgba(255,215,0,0.5)',
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {rankTab === 'ladder' && (
      <>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>All Ranks</h2>
      {rankLoading && (
        <div className="loading-wrap"><div className="spinner" /><p>Loading the ladder…</p></div>
      )}
      {rankError && !rankLoading && (
        <div className="error-wrap">
          <p>😕 {rankError}</p>
          <button className="btn" onClick={loadRanks}>Try again</button>
        </div>
      )}
      {!rankLoading && !rankError && (
      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
        {data?.ranks.map((rank, i) => {
          const isCurrent = data.currentIndex === i;
          const isUnlocked = data.currentIndex >= i;
          const isCrown = rank.name === 'Face King' || rank.name === 'Face Queen';
          return (
            <div
              key={rank.name}
              className="card"
              style={{
                padding: isCrown ? '1.5rem' : '1rem 1.25rem',
                borderColor: isCrown ? '#ffd700' : isCurrent ? rank.color : undefined,
                borderWidth: isCrown ? 3 : undefined,
                opacity: isUnlocked ? 1 : 0.5,
                background: isCrown
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))'
                  : isCurrent ? `${rank.color}10` : undefined,
                boxShadow: isCrown ? '0 0 30px rgba(255,215,0,0.3)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: isCrown ? '3.5rem' : '2rem' }}>{rank.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 800, color: rank.color,
                    fontSize: isCrown ? '1.6rem' : '1.1rem',
                    textShadow: isCrown ? '0 0 20px rgba(255,215,0,0.5)' : undefined,
                  }}>
                    {isCrown ? '👑 ' : ''}{rank.name}{isCrown ? ' 👑' : ''}
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
      )}
      </>
      )}

      {rankTab === 'top' && (
      <>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Top Ranked</h2>
      {rankLoading && (
        <div className="loading-wrap"><div className="spinner" /><p>Loading top players…</p></div>
      )}
      {rankError && !rankLoading && (
        <div className="error-wrap">
          <p>😕 {rankError}</p>
          <button className="btn" onClick={loadRanks}>Try again</button>
        </div>
      )}
      {!rankLoading && !rankError && (
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
      )}
      </>
      )}
    </div>
  );
}
