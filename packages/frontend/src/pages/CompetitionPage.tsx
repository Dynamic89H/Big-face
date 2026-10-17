import { useEffect, useState } from 'react';
import WeeklyTournamentCard from '../components/WeeklyTournamentCard';

interface Tournament {
  id: string;
  name: string;
  kind: string;
  tier: string;
  schedule: string;
  entry_fee: number;
  prize_pool: number;
  max_players: number;
  player_count: number;
  status: string;
  starts_at: string;
  ends_at: string;
  seconds_left?: number;
  my_entry?: { score: number; wins: number } | null;
}

interface PastTournament {
  id: string;
  name: string;
  tier: string;
  schedule: string;
  prize_pool: number;
  ends_at: string;
  winner_name: string | null;
  winner_color: string | null;
}

const TIER_ICONS: Record<string, string> = {
  Rookie: '🥉',
  Pros: '🥈',
  Legend: '🥇',
  Boss: '💎',
  Masters: '👑',
};

const TIER_COLORS: Record<string, string> = {
  Rookie: '#cd7f32',
  Pros: '#c0c0c0',
  Legend: '#ffd700',
  Boss: '#00d4ff',
  Masters: '#ff00ff',
};

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'Ending soon…';
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

interface ThroneReign {
  id: string;
  title: string;
  votes: number;
  ends_at: string;
  display_name: string;
  profile_color: string;
}

interface Legend {
  id: string;
  achievement: string;
  detail?: string;
  display_name: string;
  profile_color: string;
}

interface Prediction {
  id: string;
  question: string;
  options: string[];
  bet_count: number;
  resolves_at: string;
}

type Tab = 'weekly' | 'tournaments' | 'throne' | 'legends' | 'predictions';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('bigface.token')}` });

/**
 * CompetitionPage — tournaments, throne battles, hall of fame, predictions.
 * Everything competitive in Big Face, all premium, no Legos.
 */
export default function CompetitionPage() {
  const [tab, setTab] = useState<Tab>('weekly');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pastTournaments, setPastTournaments] = useState<PastTournament[]>([]);
  const [myTier, setMyTier] = useState('Rookie');
  const [reigns, setReigns] = useState<ThroneReign[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [weekly, setWeekly] = useState<{
    tournament: any; entered: boolean; myScore: number; myRank: number | null; top: any[];
  } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const [t, r, l, p, w, c, pt] = await Promise.all([
        fetch('/api/competition/tournaments', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/throne/current', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/hall-of-fame', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/predictions/open', { headers: auth() }).then((x) => x.json()),
        fetch('/api/engagement2/weekly', { headers: auth() }).then((x) => x.json()).catch(() => null),
        fetch('/api/competition/tournaments/current', { headers: auth() }).then((x) => x.json()).catch(() => null),
        fetch('/api/competition/tournaments/past', { headers: auth() }).then((x) => x.json()).catch(() => null),
      ]);
      // Prefer the enriched current endpoint (has countdown + entry status + tiers)
      if (c?.tournaments?.length) {
        setTournaments(c.tournaments);
        setMyTier(c.myTier || 'Rookie');
      } else {
        setTournaments(t.tournaments || []);
      }
      if (pt?.past) setPastTournaments(pt.past);
      setReigns(r.reigns || []);
      setLegends(l.legends || []);
      setPredictions(p.predictions || []);
      if (w?.tournament) setWeekly(w);
    } catch {
      /* offline */
    }
  };

  const joinWeekly = async () => {
    setBusy('weekly');
    try {
      const res = await fetch('/api/engagement2/weekly/join', {
        method: 'POST',
        headers: auth(),
      });
      const data = await res.json();
      setMessage(res.ok ? '🏆 You\'re in the Weekly Showdown! Earn XP all week to climb!' : data.error || 'Failed to join');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const enterTournament = async (id: string, fee: number) => {
    if (!confirm(`Enter for ${fee.toLocaleString()} tokens?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/competition/tournaments/${id}/enter`, {
        method: 'POST',
        headers: auth(),
      });
      const data = await res.json();
      setMessage(res.ok ? '🎯 You\'re in! Good luck!' : data.error || 'Failed to enter');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(null);
    }
  };

  const voteThrone = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/competition/throne/${id}/vote`, {
        method: 'POST',
        headers: auth(),
      });
      const data = await res.json();
      setMessage(res.ok ? '👑 Vote counted! (10 tokens)' : data.error || 'Vote failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(null);
    }
  };

  const betPrediction = async (predId: string, optionIndex: number, option: string) => {
    const amount = prompt(`How many tokens on "${option}"? (10-10,000)`);
    if (!amount) return;
    const num = parseInt(amount);
    if (isNaN(num) || num < 10 || num > 10000) {
      setMessage('Enter 10-10,000 tokens');
      return;
    }
    setBusy(predId);
    try {
      const res = await fetch(`/api/competition/predictions/${predId}/bet`, {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex, amount: num }),
      });
      const data = await res.json();
      setMessage(res.ok ? `🎲 Bet placed: ${num} on "${option}"` : data.error || 'Bet failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page section-competition">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="shine-text" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem' }}>
          🏆 Competition
        </h1>
        <p className="form-note">Prove yourself. Take the crown. Become a legend.</p>
      </div>

      {message && (
        <div className="card" style={{
          marginBottom: '1rem', textAlign: 'center',
          borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)',
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {(['weekly', 'tournaments', 'throne', 'legends', 'predictions'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'btn' : 'btn btn-ghost'}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'weekly' ? '🏆 Weekly' : t === 'tournaments' ? '🎯 Tournaments' : t === 'throne' ? '👑 Throne' : t === 'legends' ? '⭐ Legends' : '🔮 Predictions'}
          </button>
        ))}
      </div>

      {tab === 'weekly' && (
        <WeeklyTournamentCard weekly={weekly} onJoin={joinWeekly} busy={busy === 'weekly'} />
      )}

      {tab === 'tournaments' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {/* My tournament tier */}
          <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: TIER_COLORS[myTier] || '#c9a227' }}>
            <span style={{ fontSize: '1.5rem' }}>{TIER_ICONS[myTier] || '🥉'}</span>
            <div style={{ fontWeight: 800, marginTop: '0.25rem' }}>
              Your Tournament Tier: <span style={{ color: TIER_COLORS[myTier] || '#c9a227' }}>{myTier}</span>
            </div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>
              Win a tournament to climb: Rookie → Pros → Legend → Boss → Masters
            </div>
          </div>

          {tournaments.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No tournaments right now. Check back soon!</p>
            </div>
          )}
          {tournaments.map((t) => (
            <div key={t.id} className="card glow-gold" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>🎯 {t.name}</h3>
                <span style={{
                  background: TIER_COLORS[t.tier] || '#666',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '1rem',
                }}>
                  {TIER_ICONS[t.tier] || '🥉'} {t.tier || 'Rookie'}
                </span>
              </div>
              {t.schedule && (
                <div className="form-note" style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  {t.schedule === 'weekend' ? '⚡ Weekend Tournament' : '📅 Weekly Tournament'}
                  {t.seconds_left != null && (
                    <span style={{ color: 'var(--gold)', fontWeight: 700, marginLeft: '0.5rem' }}>
                      ⏱️ {formatCountdown(t.seconds_left)}
                    </span>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span>💰 Prize: <strong style={{ color: 'var(--gold)' }}>{t.prize_pool.toLocaleString()}</strong></span>
                <span>🎫 Entry: {t.entry_fee.toLocaleString()}</span>
                <span>👥 {t.player_count}/{t.max_players}</span>
              </div>
              {t.my_entry && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(201,162,39,0.1)', borderRadius: '0.5rem', textAlign: 'center' }}>
                  ✅ You're in! Score: <strong>{t.my_entry.score.toLocaleString()}</strong> • Wins: <strong>{t.my_entry.wins}</strong>
                </div>
              )}
              <button
                className="btn btn-block"
                onClick={() => enterTournament(t.id, t.entry_fee)}
                disabled={busy === t.id || t.status !== 'open' || !!t.my_entry}
              >
                {busy === t.id ? 'Entering…' : t.my_entry ? 'Entered ✓' : t.status === 'open' ? 'Enter Tournament' : 'In Progress'}
              </button>
            </div>
          ))}

          {/* Past champions */}
          {pastTournaments.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>🏆 Past Champions</h3>
              {pastTournaments.map((p) => (
                <div key={p.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>{TIER_ICONS[p.tier] || '🏆'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div className="form-note" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {p.schedule} • {p.tier} tier • {new Date(p.ends_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: p.winner_color || 'var(--gold)' }}>
                      {p.winner_name || 'No winner'}
                    </div>
                    <div className="form-note" style={{ fontSize: '0.8rem' }}>
                      💰 {Number(p.prize_pool).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'throne' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {reigns.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">The throne is empty. Someone needs to claim it 👑</p>
            </div>
          )}
          {reigns.map((r) => (
            <div key={r.id} className="card glow-gold" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>{r.title === 'king' ? '🤴' : '👸'}</div>
              <h3 style={{ margin: '0.5rem 0' }}>
                <span style={{ color: r.profile_color }}>{r.display_name}</span>
              </h3>
              <p className="form-note" style={{ textTransform: 'capitalize' }}>
                Current {r.title} • {r.votes} votes
              </p>
              <button
                className="btn"
                onClick={() => voteThrone(r.id)}
                disabled={busy === r.id}
                style={{ marginTop: '0.75rem' }}
              >
                {busy === r.id ? 'Voting…' : '👑 Vote (10 tokens)'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'legends' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {legends.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No legends yet. Be the first ⭐</p>
            </div>
          )}
          {legends.map((l) => (
            <div key={l.id} className="card" style={{
              padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center',
              borderColor: 'rgba(201,162,39,0.4)',
            }}>
              <div style={{ fontSize: '2.5rem' }}>⭐</div>
              <div>
                <div style={{ fontWeight: 800, color: l.profile_color }}>{l.display_name}</div>
                <div style={{ fontWeight: 700 }}>{l.achievement}</div>
                {l.detail && <div className="form-note" style={{ fontSize: '0.85rem' }}>{l.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'predictions' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {predictions.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No open predictions. Check back soon! 🔮</p>
            </div>
          )}
          {predictions.map((p) => (
            <div key={p.id} className="card glow-blue" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem' }}>🔮 {p.question}</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {p.options.map((opt, i) => (
                  <button
                    key={i}
                    className="btn btn-ghost btn-block"
                    onClick={() => betPrediction(p.id, i, opt)}
                    disabled={busy === p.id}
                    style={{ textAlign: 'left' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="form-note" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                {p.bet_count} bets placed
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
