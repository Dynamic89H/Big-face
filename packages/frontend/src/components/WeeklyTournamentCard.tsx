import { useEffect, useState } from 'react';

interface WeeklyData {
  tournament: {
    id: string;
    name: string;
    prize_pool: number;
    player_count: number;
    status: string;
    starts_at: string;
    ends_at: string;
  };
  entered: boolean;
  myScore: number;
  myRank: number | null;
  top: { user_id: string; display_name: string; profile_color: string; score: number }[];
}

function useCountdown(endsAt: string): string {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setLabel('Ending soon…');
        return;
      }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLabel(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return label;
}

const PLACE_EMOJI = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
const PLACE_PRIZES = ['15,000 🪙 + 🏆', '7,000 🪙', '3,000 🪙'];

export default function WeeklyTournamentCard({
  weekly,
  onJoin,
  busy,
}: {
  weekly: WeeklyData | null;
  onJoin: () => void;
  busy: boolean;
}) {
  const countdown = useCountdown(weekly?.tournament.ends_at ?? new Date().toISOString());

  if (!weekly) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
        <p className="form-note">Loading this week's showdown…</p>
      </div>
    );
  }

  const { tournament, entered, myScore, myRank, top } = weekly;

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <div className="card glow-gold" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>🏆</div>
        <h2 style={{ margin: '0.5rem 0' }}>Weekly XP Showdown</h2>
        <p className="form-note" style={{ margin: '0 0 1rem' }}>
          Earn the most XP this week to take the crown. Free entry!
        </p>

        <div
          style={{
            display: 'inline-block', padding: '0.5rem 1.2rem', borderRadius: 12,
            background: 'rgba(201,162,39,0.12)', border: '1px solid var(--gold)',
            fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)',
            fontVariantNumeric: 'tabular-nums', marginBottom: '1rem',
          }}
        >
          ⏳ {countdown}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span>💰 Pool: <strong style={{ color: 'var(--gold)' }}>{tournament.prize_pool.toLocaleString()}</strong></span>
          <span>👥 {tournament.player_count} entered</span>
        </div>

        {entered ? (
          <div className="card" style={{ padding: '1rem', background: 'rgba(0,255,136,0.08)', borderColor: 'var(--green)' }}>
            <div style={{ fontWeight: 800, color: 'var(--green)' }}>✅ You're in!</div>
            <div style={{ marginTop: '0.4rem' }}>
              Your week XP: <strong>{myScore.toLocaleString()}</strong>
              {myRank !== null && (
                <span> · Rank <strong style={{ color: 'var(--gold)' }}>#{myRank}</strong></span>
              )}
            </div>
            <p className="form-note" style={{ margin: '0.4rem 0 0' }}>
              Keep earning XP — every message, roll, and spin counts!
            </p>
          </div>
        ) : (
          <button className="btn btn-block" onClick={onJoin} disabled={busy || tournament.status !== 'open'}>
            {busy ? 'Joining…' : 'Join Free — Start Climbing 🚀'}
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>🏅 Prizes</h3>
        {PLACE_PRIZES.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', padding: '0.3rem 0' }}>
            <span style={{ fontSize: '1.3rem' }}>{PLACE_EMOJI[i]}</span>
            <span>{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : 'rd'} place</span>
            <strong style={{ marginLeft: 'auto', color: 'var(--gold)' }}>{p}</strong>
          </div>
        ))}
      </div>

      {top.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>🔥 This Week's Leaders</h3>
          {top.map((t, i) => (
            <div
              key={t.user_id}
              style={{
                display: 'flex', gap: '0.6rem', alignItems: 'center',
                padding: '0.45rem 0', borderBottom: i < top.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
              }}
            >
              <span style={{ fontSize: '1.2rem', width: '2rem', textAlign: 'center' }}>{PLACE_EMOJI[i] ?? `${i + 1}.`}</span>
              <strong style={{ color: t.profile_color }}>{t.display_name}</strong>
              <span style={{ marginLeft: 'auto', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {t.score.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
