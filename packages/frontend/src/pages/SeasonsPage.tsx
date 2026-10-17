import { useEffect, useState } from 'react';

interface SeasonData {
  season: {
    id: string;
    name: string;
    theme: string;
    endsAt: string;
  } | null;
  myXp: number;
  myRank: number | null;
  gifts: { gift_key: string; gift_label: string; token_cost: number; emoji: string }[];
  rewards: { rank_required: number; reward_type: string; reward_value: string; label: string }[];
  leaders: { display_name: string; username: string; xp: number }[];
}

/**
 * SeasonsPage — the super engine. Fresh seasons, exclusive rewards, forever.
 */
export default function SeasonsPage() {
  const [data, setData] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seasons/current', {
      headers: { Authorization: `Bearer ${localStorage.getItem('bigface.token')}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" />
        <p>Loading season...</p>
      </div>
    );
  }

  if (!data?.season) {
    return (
      <div className="page" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏁</div>
        <h1 className="pattern-royal">No Active Season</h1>
        <p className="pattern-royal-sub">Season 1 is coming soon. Stay ready.</p>
      </div>
    );
  }

  const { season } = data;
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(season.endsAt).getTime() - Date.now()) / 86400000
  ));

  return (
    <div className="page section-competition" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          SEASON 1 • {daysLeft} DAYS LEFT
        </div>
        <h1 className="pattern-royal" style={{ fontSize: '2.5rem' }}>
          {season.name}
        </h1>
        <p className="pattern-royal-sub">Exclusive rewards. Fresh start. Make your mark.</p>
      </div>

      {/* My season stats */}
      <div className="pattern-gold pattern-elev-2" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', borderRadius: 16 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
          YOUR SEASON
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>
              {data.myXp.toLocaleString()}
            </div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>Season XP</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>
              {data.myRank ? `#${data.myRank}` : '—'}
            </div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>Rank</div>
          </div>
        </div>
      </div>

      {/* Season leaderboard */}
      <h2 style={{ margin: '0 0 1rem' }}>🏆 Season Leaders</h2>
      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '2rem' }}>
        {data.leaders.map((l, i) => (
          <div key={i} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 800, minWidth: 28 }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>
            <span style={{ flex: 1, fontWeight: 700 }}>{l.display_name || l.username}</span>
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{l.xp.toLocaleString()} XP</span>
          </div>
        ))}
        {data.leaders.length === 0 && (
          <p className="form-note" style={{ textAlign: 'center' }}>No one on the board yet. Be first! 🚀</p>
        )}
      </div>

      {/* Season rewards */}
      {data.rewards.length > 0 && (
        <>
          <h2 style={{ margin: '0 0 1rem' }}>🎁 Season Rewards</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
            {data.rewards.map((r, i) => (
              <div key={i} className="card pattern-gold" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700 }}>Top {r.rank_required} — {r.label}</div>
                <div className="form-note" style={{ fontSize: '0.85rem' }}>
                  {r.reward_type === 'tokens' ? `🪙 ${r.reward_value} tokens` : r.reward_value}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Season exclusive gifts */}
      {data.gifts.length > 0 && (
        <>
          <h2 style={{ margin: '0 0 1rem' }}>✨ Season Exclusive Gifts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {data.gifts.map((g, i) => (
              <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{g.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0.5rem 0' }}>{g.gift_label}</div>
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem' }}>
                  🪙 {g.token_cost.toLocaleString()}
                </div>
                <div className="form-note" style={{ fontSize: '0.7rem' }}>Limited</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
