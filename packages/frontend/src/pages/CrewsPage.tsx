import { useEffect, useState, type FormEvent } from 'react';
import { crewsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import GrandLoader from '../components/GrandStates';
import { usePageTitle } from '../hooks/usePageTitle';

interface CrewListItem {
  id: string; name: string; tag: string; description: string; color: string;
  totalXp: number; wins: number; memberCount: number; leaderName: string;
}

interface MyCrew {
  id: string; name: string; tag: string; description: string; color: string;
  totalXp: number; wins: number; role: string;
  members: Array<{ id: string; displayName: string; username: string; role: string; xp: number }>;
}

interface War {
  id: string; endsAt: string;
  challenger: { id: string; name: string; tag: string; score: number };
  defender: { id: string; name: string; tag: string; score: number };
}

export default function CrewsPage() {
  usePageTitle('Crews');
  const { user } = useAuth();
  const [crews, setCrews] = useState<CrewListItem[]>([]);
  const [mine, setMine] = useState<MyCrew | null>(null);
  const [wars, setWars] = useState<War[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    try {
      const [{ crews: c }, { crew }, { wars: w }] = await Promise.all([
        crewsApi.list(),
        crewsApi.mine(),
        crewsApi.activeWars().catch(() => ({ wars: [] as War[] })),
      ]);
      setCrews(c);
      setMine(crew);
      setWars(w);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await crewsApi.create({ name: name.trim(), tag: tag.trim() });
      setShowCreate(false);
      setName(''); setTag('');
      setMsg('🎉 Crew founded! +50 XP');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not create crew.');
    } finally {
      setBusy(false);
    }
  };

  const join = async (id: string) => {
    try {
      await crewsApi.join(id);
      setMsg('🎉 Joined! +20 XP');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not join.');
    }
  };

  const leave = async () => {
    if (!confirm('Leave your crew?')) return;
    try {
      await crewsApi.leave();
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not leave.');
    }
  };

  const declareWar = async (crewId: string, crewName: string) => {
    if (!confirm(`Declare WAR on ${crewName}? 24-hour XP race!`)) return;
    try {
      await crewsApi.war(crewId);
      setMsg('⚔️ WAR DECLARED! 24 hours — most XP wins!');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not declare war.');
    }
  };

  if (loading) return <div className="page"><GrandLoader text="Loading crews" /></div>;

  return (
    <div className="page">
      <h1>👥 Crews</h1>
      <p className="form-note">Squad up. Your XP powers your crew. Declare war on rivals in 24-hour XP races.</p>
      {msg && <p className="form-note" style={{ fontWeight: 700 }}>{msg}</p>}

      {/* My crew */}
      {mine ? (
        <div className="card" style={{ borderColor: mine.color, marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>
              <span style={{ background: mine.color, color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.8rem', marginRight: '0.5rem' }}>
                {mine.tag}
              </span>
              {mine.name}
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={leave}>Leave</button>
          </div>
          <p className="form-note">⚡ {mine.totalXp.toLocaleString()} crew XP · 🏆 {mine.wins} war wins · Your role: {mine.role}</p>
          <h4>Members ({mine.members.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {mine.members.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{m.displayName} <span className="form-note">@{m.username}</span></span>
                <span className="form-note">{m.role} · {m.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '1.2rem' }}>
          <p>You're not in a crew yet.</p>
          <button className="btn" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancel' : '🚩 Found a crew'}
          </button>
          {showCreate && (
            <form onSubmit={create} style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Crew name" maxLength={40} required />
              <input className="input" value={tag} onChange={(e) => setTag(e.target.value.toUpperCase())} placeholder="TAG (2-6 letters)" maxLength={6} required style={{ textTransform: 'uppercase' }} />
              <button className="btn" type="submit" disabled={busy}>{busy ? 'Founding…' : 'Found crew (+50 XP)'}</button>
            </form>
          )}
        </div>
      )}

      {/* Active wars */}
      {wars.length > 0 && (
        <>
          <h2>⚔️ Active Wars</h2>
          {wars.map((w) => {
            const total = Math.max(1, w.challenger.score + w.defender.score);
            return (
              <div key={w.id} className="card" style={{ borderColor: 'var(--coral)', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>[{w.challenger.tag}] {w.challenger.name}</span>
                  <span style={{ color: 'var(--coral)' }}>VS</span>
                  <span>[{w.defender.tag}] {w.defender.name}</span>
                </div>
                <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', margin: '0.5rem 0', background: 'var(--surface)' }}>
                  <div style={{ width: `${(w.challenger.score / total) * 100}%`, background: '#4da3ff' }} />
                  <div style={{ width: `${(w.defender.score / total) * 100}%`, background: '#ff6b6b' }} />
                </div>
                <div className="form-note">
                  {w.challenger.score.toLocaleString()} — {w.defender.score.toLocaleString()} XP ·
                  ends {new Date(w.endsAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* All crews */}
      <h2>🏅 Top Crews</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {crews.map((c, i) => (
          <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-dim)' }}>#{i + 1}</span>
              <span style={{ background: c.color, color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                {c.tag}
              </span>
              <div>
                <div style={{ fontWeight: 800 }}>{c.name}</div>
                <div className="form-note">{c.memberCount} members · {c.totalXp.toLocaleString()} XP · 🏆 {c.wins}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {!mine && <button className="btn btn-sm" onClick={() => join(c.id)}>Join</button>}
              {mine && mine.role === 'leader' && mine.id !== c.id && (
                <button className="btn btn-sm" onClick={() => declareWar(c.id, c.name)} style={{ borderColor: 'var(--coral)' }}>
                  ⚔️ War
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
