import { useEffect, useState } from 'react';

interface Tournament {
  id: string;
  name: string;
  kind: string;
  entry_fee: number;
  prize_pool: number;
  max_players: number;
  player_count: number;
  status: string;
  starts_at: string;
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

type Tab = 'tournaments' | 'throne' | 'legends' | 'predictions';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

/**
 * CompetitionPage — tournaments, throne battles, hall of fame, predictions.
 * Everything competitive in Big Face, all premium, no Legos.
 */
export default function CompetitionPage() {
  const [tab, setTab] = useState<Tab>('tournaments');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [reigns, setReigns] = useState<ThroneReign[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const [t, r, l, p] = await Promise.all([
        fetch('/api/competition/tournaments', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/throne/current', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/hall-of-fame', { headers: auth() }).then((x) => x.json()),
        fetch('/api/competition/predictions/open', { headers: auth() }).then((x) => x.json()),
      ]);
      setTournaments(t.tournaments || []);
      setReigns(r.reigns || []);
      setLegends(l.legends || []);
      setPredictions(p.predictions || []);
    } catch {
      /* offline */
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
    <div className="page">
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
        {(['tournaments', 'throne', 'legends', 'predictions'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'btn' : 'btn btn-ghost'}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'tournaments' ? '🎯 Tournaments' : t === 'throne' ? '👑 Throne' : t === 'legends' ? '⭐ Legends' : '🔮 Predictions'}
          </button>
        ))}
      </div>

      {tab === 'tournaments' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {tournaments.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No tournaments right now. Check back soon!</p>
            </div>
          )}
          {tournaments.map((t) => (
            <div key={t.id} className="card glow-gold" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>🎯 {t.name}</h3>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span>💰 Prize: <strong style={{ color: 'var(--gold)' }}>{t.prize_pool.toLocaleString()}</strong></span>
                <span>🎫 Entry: {t.entry_fee.toLocaleString()}</span>
                <span>👥 {t.player_count}/{t.max_players}</span>
              </div>
              <button
                className="btn btn-block"
                onClick={() => enterTournament(t.id, t.entry_fee)}
                disabled={busy === t.id || t.status !== 'open'}
              >
                {busy === t.id ? 'Entering…' : t.status === 'open' ? 'Enter Tournament' : 'In Progress'}
              </button>
            </div>
          ))}
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
