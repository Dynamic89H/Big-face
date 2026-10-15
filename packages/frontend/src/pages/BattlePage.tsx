import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { battlesApi, giftsApi, ApiError } from '../api/client';
import { getSocket } from '../api/socket';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';

interface BattleListItem {
  id: string;
  title: string;
  status: string;
  host: { id: string; displayName: string; profileColor: string };
  challenger: { id: string; displayName: string; profileColor: string } | null;
  endsAt: string | null;
}

interface BattleScore {
  battlerId: string;
  displayName: string;
  giftTokens: number;
  giftCount: number;
}

// Battle lobby: live + waiting battles.
export function BattlesPage() {
  usePageTitle('Battles');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [battles, setBattles] = useState<BattleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const { battles: b } = await battlesApi.list();
      setBattles(b);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const socket = getSocket();
    const refresh = () => load();
    socket.on('battle:created', refresh);
    socket.on('battle:started', refresh);
    socket.on('battle:ended', refresh);
    return () => {
      socket.off('battle:created', refresh);
      socket.off('battle:started', refresh);
      socket.off('battle:ended', refresh);
    };
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { battle } = await battlesApi.create(title.trim() || undefined);
      navigate(`/battles/${battle.id}`);
    } catch {
      /* ignore */
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <h1>⚔️ Gift Battles</h1>
      <p className="form-note">Go head-to-head live. Viewers shower gifts — most gift value wins. Winner takes +100 XP and eternal glory.</p>

      <form onSubmit={create} style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <input
          className="input" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Battle title (e.g. Dweezy vs The World)" maxLength={80} style={{ flex: 1 }}
        />
        <button className="btn" type="submit" disabled={creating}>
          {creating ? 'Starting…' : '🔴 Go Live'}
        </button>
      </form>

      {loading && <p>Loading battles…</p>}
      {!loading && battles.length === 0 && (
        <div className="card empty-wrap"><p>No battles right now. Start one! 🔴</p></div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {battles.map((b) => (
          <Link key={b.id} to={`/battles/${b.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800 }}>{b.status === 'live' ? '🔴 LIVE' : '⏳ Waiting for challenger'} — {b.title}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <Avatar displayName={b.host.displayName} profileColor={b.host.profileColor} size="sm" />
              <span style={{ fontWeight: 700 }}>{b.host.displayName}</span>
              <span style={{ color: 'var(--text-dim)' }}>vs</span>
              {b.challenger ? (
                <>
                  <Avatar displayName={b.challenger.displayName} profileColor={b.challenger.profileColor} size="sm" />
                  <span style={{ fontWeight: 700 }}>{b.challenger.displayName}</span>
                </>
              ) : (
                <span className="form-note">??? — join as challenger!</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Single battle room: scoreboard, gifts, timer.
export function BattleRoomPage() {
  usePageTitle('Battle');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [battle, setBattle] = useState<any>(null);
  const [scores, setScores] = useState<BattleScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftKey, setGiftKey] = useState('rose');
  const [giftTarget, setGiftTarget] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    if (!id) return;
    try {
      const { battle: b, scores: s } = await battlesApi.get(id);
      setBattle(b);
      setScores(s);
      if (!giftTarget && s.length) setGiftTarget(s[0].battlerId);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    const socket = getSocket();
    const onScore = () => load();
    const onEnd = () => load();
    socket.on('battle:score', onScore);
    socket.on('battle:ended', onEnd);
    return () => {
      socket.off('battle:score', onScore);
      socket.off('battle:ended', onEnd);
    };
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const joinAsChallenger = async () => {
    if (!id) return;
    try {
      await battlesApi.join(id);
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Could not join battle.');
    }
  };

  const endBattle = async () => {
    if (!id || !confirm('End this battle?')) return;
    try {
      await battlesApi.end(id);
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Could not end battle.');
    }
  };

  const sendBattleGift = async () => {
    if (!id || !giftTarget || sending) return;
    setSending(true);
    try {
      await giftsApi.send({ receiverId: giftTarget, giftKey, battleId: id });
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Gift failed.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="page"><p>Entering the arena…</p></div>;
  if (!battle) return <div className="page"><p>Battle not found.</p></div>;

  const isBattler = user && (battle.hostId === user.id || battle.challengerId === user.id);
  const timeLeft = battle.endsAt ? Math.max(0, new Date(battle.endsAt).getTime() - now) : 0;
  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);
  const maxTokens = Math.max(1, ...scores.map((s) => s.giftTokens));
  const winner = battle.status === 'ended' && battle.winnerId
    ? scores.find((s) => s.battlerId === battle.winnerId) : null;

  return (
    <div className="page">
      <h1>⚔️ {battle.title}</h1>

      {battle.status === 'waiting' && (
        <div className="card" style={{ borderColor: 'var(--gold)', marginBottom: '1rem' }}>
          <p>⏳ Waiting for a challenger…</p>
          {!isBattler && (
            <button className="btn" onClick={joinAsChallenger}>⚔️ Accept the challenge</button>
          )}
          {isBattler && <p className="form-note">Share this battle and wait for someone brave enough.</p>}
        </div>
      )}

      {battle.status === 'live' && (
        <div className="card" style={{ borderColor: 'var(--coral)', marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--coral)' }}>
            🔴 {mins}:{String(secs).padStart(2, '0')}
          </div>
          <div className="form-note">until the battle ends</div>
        </div>
      )}

      {winner && (
        <div className="card" style={{ borderColor: 'var(--gold)', marginBottom: '1rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,162,39,0.15), transparent)' }}>
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <h2>{winner.displayName} wins!</h2>
          <p className="form-note">{winner.giftTokens} gift tokens · +100 XP</p>
        </div>
      )}

      {/* Scoreboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
        {scores.map((s) => (
          <div key={s.battlerId} className="card" style={{ borderColor: winner?.battlerId === s.battlerId ? 'var(--gold)' : undefined }}>
            <div style={{ fontWeight: 800 }}>{s.displayName}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)' }}>🪙 {s.giftTokens}</div>
            <div className="form-note">{s.giftCount} gifts</div>
            <div style={{ height: 8, background: 'var(--surface)', borderRadius: 4, marginTop: '0.4rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(s.giftTokens / maxTokens) * 100}%`, background: 'linear-gradient(90deg, var(--gold), #ff8c42)', transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Gift controls for spectators */}
      {battle.status === 'live' && !isBattler && scores.length === 2 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>🎁 Send a gift</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
            {scores.map((s) => (
              <button
                key={s.battlerId}
                className={`btn btn-sm ${giftTarget === s.battlerId ? '' : 'btn-ghost'}`}
                onClick={() => setGiftTarget(s.battlerId)}
                style={{ flex: 1 }}
              >
                {s.displayName}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select className="select" value={giftKey} onChange={(e) => setGiftKey(e.target.value)} style={{ flex: 1 }}>
              <option value="rose">🌹 Rose (10)</option>
              <option value="crown">👑 Crown (100)</option>
              <option value="diamond">💎 Diamond (500)</option>
              <option value="rocket">🚀 Rocket (1000)</option>
            </select>
            <button className="btn" onClick={sendBattleGift} disabled={sending}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {battle.status === 'live' && isBattler && (
        <button className="btn btn-ghost" onClick={endBattle}>End battle</button>
      )}

      <p className="form-note" style={{ marginTop: '1rem' }}>
        💡 Tip: battlers should open a video chat together — the crowd watches and showers gifts.
      </p>
    </div>
  );
}
