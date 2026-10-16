import { useEffect, useRef, useState, type FormEvent, lazy, Suspense } from 'react';
import { gambleApi, ApiError } from '../api/client';
import { celebrate } from '../components/Celebration';
import { sfx, haptic } from '../utils/sfx';
import { getSocket } from '../api/socket';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';

// Lazy-load the 3D table — Three.js only loads when you visit Gamble Face
const RealTableScene = lazy(() => import('../components/RealTableScene'));
const CeeloMatch = lazy(() => import('../components/CeeloMatch'));
import type { RealTableSceneHandle } from '../components/RealTableScene';
import type { GraphicsQuality } from '../engine/GambleEngine';
import { useActorEngine, ActorSpeech, ACTOR_VOICES } from '../components/ActorEngine';

interface Game {
  id: string; betTokens: number; status: string;
  host: { id: string; displayName: string; profileColor: string };
  createdAt: string;
}

interface GameResult {
  gameId: string; hostRoll: number; opponentRoll: number; winnerId: string;
  potTokens: number; winnerPayout: number; platformCut: number;
}

const DICE_FACES: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
};

function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div
      style={{
        fontSize: '4rem',
        animation: rolling ? 'diceShake 0.5s ease-in-out infinite' : undefined,
      }}
    >
      {DICE_FACES[value]}
      <style>{`@keyframes diceShake { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }`}</style>
    </div>
  );
}

export default function GamblePage() {
  usePageTitle('Gamble Face');
  const { user } = useAuth();
  const [tab, setTab] = useState<'story' | 'dice' | 'history'>('story');
  const [games, setGames] = useState<Game[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('1000');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  // Character Actor Engine — dealers talk trash, celebrate, play mind games
  const { currentLine } = useActorEngine({
    actors: [
      { id: 'boss', name: 'The Boss', personality: 'street_king', equipped: {}, voice: ACTOR_VOICES.boss },
      { id: 'diva', name: 'Diva', personality: 'queen', equipped: {}, voice: ACTOR_VOICES.diva },
    ],
    gameState: result ? 'won' : 'waiting',
    winnerId: result ? 'boss' : undefined,
  });
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  // The GambleEngine — connects the game to the 3D room
  const engineRef = useRef<RealTableSceneHandle | null>(null);

  // Background music toggle.
  const toggleMusic = () => {
    if (!musicRef.current) {
      // Casino-style ambient loop.
      musicRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_2c8a5d8b9e.mp3');
      musicRef.current.loop = true;
      musicRef.current.volume = 0.3;
    }
    if (musicOn) {
      musicRef.current.pause();
    } else {
      musicRef.current.play().catch(() => setMsg('⚠️ Could not play music.'));
    }
    setMusicOn(!musicOn);
  };

  useEffect(() => {
    return () => musicRef.current?.pause();
  }, []);

  const [hotGames, setHotGames] = useState<any[]>([]);

  const load = async () => {
    try {
      const [{ games: g }, { games: h }] = await Promise.all([
        gambleApi.list(),
        gambleApi.mine().catch(() => ({ games: [] })),
      ]);
      setGames(g);
      setHistory(h);
      // Load hot games
      try {
        const res = await fetch('/api/gamble/hot', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHotGames(data.games || []);
        }
      } catch {}
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const socket = getSocket();
    const onFinish = (r: GameResult) => {
      setRolling(false);
      setResult(r);
      // 3D dice show the real result, room reacts
      engineRef.current?.rollDice(r.hostRoll, r.opponentRoll, Math.floor(Math.random() * 4));
      if (r.winnerId === user?.id) {
        engineRef.current?.celebrate();
        sfx.bigWin();
        haptic([40, 40, 80]);
        document.body.classList.add('fx-shake');
        setTimeout(() => document.body.classList.remove('fx-shake'), 600);
      } else {
        engineRef.current?.setMood('lose');
        setTimeout(() => engineRef.current?.setMood('idle'), 4000);
      }
      load();
    };
    socket.on('gamble:finished', onFinish);
    socket.on('gamble:created', load);
    socket.on('gamble:cancelled', load);
    return () => {
      socket.off('gamble:finished', onFinish);
      socket.off('gamble:created', load);
      socket.off('gamble:cancelled', load);
    };
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    const bet = parseInt(betAmount, 10);
    if (!bet || bet < 100 || bet > 25000) {
      setMsg('⚠️ Bet must be between 100 and 25,000 tokens.');
      return;
    }
    setCreating(true);
    setMsg(null);
    try {
      await gambleApi.create(bet);
      setMsg(`🎲 Game created! Waiting for an opponent to match ${bet.toLocaleString()} tokens.`);
      // Room goes tense — high stakes energy
      engineRef.current?.setMood('tense');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not create game.');
    } finally {
      setCreating(false);
    }
  };

  const join = async (gameId: string, bet: number) => {
    // Everyone needs an avatar to play.
    if (!user?.avatarConfig) {
      setMsg('🎭 You need an avatar to play! Set up your character in the Avatar Studio first.');
      return;
    }
    if (!confirm(`Match the ${bet.toLocaleString()} token bet and roll?`)) return;
    setRolling(true);
    setResult(null);
    setMsg(null);
    // Room goes tense while rolling
    engineRef.current?.setMood('tense');
    try {
      const r = await gambleApi.join(gameId);
      // 3D dice tumble and land on YOUR ACTUAL roll values
      engineRef.current?.rollDice(r.hostRoll, r.opponentRoll, Math.floor(Math.random() * 4));
      // Rolling animation delay for drama.
      setTimeout(() => {
        setRolling(false);
        setResult(r);
        if (r.winnerId === user?.id) {
          // WIN — gold celebration in the 3D room
          engineRef.current?.celebrate();
          celebrate(`🏆 YOU WON ${r.winnerPayout.toLocaleString()} TOKENS!`, true);
        } else {
          // LOSS — room dims cool
          engineRef.current?.setMood('lose');
          setTimeout(() => engineRef.current?.setMood('idle'), 4000);
        }
        load();
      }, 1800);
    } catch (e) {
      setRolling(false);
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not join game.');
    }
  };

  const cancel = async (gameId: string) => {
    try {
      await gambleApi.cancel(gameId);
      setMsg('Game cancelled, bet refunded.');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not cancel.');
    }
  };

  const iWon = result && user && result.winnerId === user.id;

  return (
    <div className="page section-gamble" style={{
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 50%, #0a0a2e 100%)',
      borderRadius: 16, padding: '1.5rem',
      boxShadow: '0 0 40px rgba(138,43,226,0.3), inset 0 0 60px rgba(0,0,0,0.5)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Character speech — actors talk during games */}
      <ActorSpeech line={currentLine} />
      {/* Animated digital background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,255,0.1) 10px, rgba(0,255,255,0.1) 20px)',
        animation: 'bgScroll 20s linear infinite',
      }} />
      <style>{`
        @keyframes bgScroll { to { background-position: 100px 100px; } }
        @keyframes neonGlow { 0%,100% { text-shadow: 0 0 10px #0ff, 0 0 20px #0ff; } 50% { text-shadow: 0 0 20px #f0f, 0 0 40px #f0f; } }
        @keyframes diceShake { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
      `}</style>

      {/* 3D table removed — not ready yet. Clean 2D dice display. */}
      <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          width: '100%', minHeight: 200, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(160deg, #0d5c2e, #0a0a12)',
          borderRadius: 16, border: '2px solid var(--gold)',
          fontSize: '4rem', padding: '2rem',
        }}>
          🎲🎲
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          ['story', '📖 Story'],
          ['dice', '🎲 Quick Dice'],
          ['history', '📜 History'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`btn ${tab === key ? '' : 'btn-ghost'}`}
            style={{ flex: 1, padding: '0.8rem' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'story' && (
        <Suspense fallback={<div className="card" style={{ padding: '1rem' }}>🎲 Loading story mode...</div>}>
          <CeeloMatch onExit={() => setTab('dice')} />
        </Suspense>
      )}

      {tab === 'dice' && (
      <>
      {/* Quick dice game (original 1v1) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', position: 'relative' }}>
        <img
          src="/probus-lion.webp"
          alt="Probus the Lion - Gamble Face dealer"
          style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', objectFit: 'cover', boxShadow: '0 0 20px rgba(201,162,39,0.6)' }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, animation: 'neonGlow 3s ease-in-out infinite' }}>🎲 Gamble Face</h1>
          <p className="form-note" style={{ margin: 0 }}>Probus the Lion runs this table 🦁</p>
        </div>
        <button
          className={`btn btn-sm ${musicOn ? '' : 'btn-ghost'}`}
          onClick={toggleMusic}
          title={musicOn ? 'Mute music' : 'Play background music'}
        >
          {musicOn ? '🔊' : '🔇'}
        </button>
      </div>
      <p className="form-note">
        Roll dice with real players. Winner takes the pot (minus 10% house cut).
        Bets from 100 tokens ($1) up to 25,000 tokens ($250). Big money, big thrill.
      </p>
      {msg && <p className="form-note" style={{ fontWeight: 700 }}>{msg}</p>}

      {/* Result modal */}
      {result && (
        <div className="card" style={{
          borderColor: iWon ? 'var(--gold)' : 'var(--coral)',
          textAlign: 'center', marginBottom: '1rem',
          background: iWon ? 'linear-gradient(135deg, rgba(201,162,39,0.15), transparent)' : undefined,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
            <div>
              <Dice value={result.hostRoll} rolling={false} />
              <div className="form-note">Host</div>
            </div>
            <div style={{ fontSize: '2rem', alignSelf: 'center' }}>VS</div>
            <div>
              <Dice value={result.opponentRoll} rolling={false} />
              <div className="form-note">Challenger</div>
            </div>
          </div>
          {iWon ? (
            <>
              <div style={{ fontSize: '3rem' }}>🏆</div>
              <h2>You won {result.winnerPayout.toLocaleString()} tokens!</h2>
              <p className="form-note">${(result.winnerPayout / 100).toFixed(2)} · +30 XP</p>
            </>
          ) : (
            <>
              <h2>You lost this one</h2>
              <p className="form-note">Pot was {result.potTokens.toLocaleString()} tokens · +10 XP for playing</p>
            </>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>Close</button>
        </div>
      )}

      {/* Create game */}
      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <h3>🎲 Start a dice game</h3>
        <form onSubmit={create} style={{ display: 'flex', gap: '0.5rem' }}>
          <select className="select" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{ flex: 1 }}>
            <option value="100">100 tokens ($1)</option>
            <option value="500">500 tokens ($5)</option>
            <option value="1000">1,000 tokens ($10)</option>
            <option value="5000">5,000 tokens ($50)</option>
            <option value="10000">10,000 tokens ($100)</option>
            <option value="15000">15,000 tokens ($150)</option>
            <option value="25000">25,000 tokens ($250) 🔥</option>
          </select>
          <button className="btn" type="submit" disabled={creating}>
            {creating ? 'Creating…' : 'Roll the dice'}
          </button>
        </form>
      </div>

      {/* Hot games — spectator mode */}
      {hotGames.length > 0 && (
        <>
          <h2>🔥 Hot Tables — Biggest Recent Games</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {hotGames.map((g) => (
              <div key={g.id} className="card pattern-gold" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {g.host.displayName} vs {g.opponentName || '?'}
                    </div>
                    <div className="form-note" style={{ fontSize: '0.8rem' }}>
                      🎲 {g.hostRoll} vs {g.opponentRoll} • Winner: {g.winnerName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--gold)', fontWeight: 800 }}>
                      🪙 {g.pot.toLocaleString()}
                    </div>
                    <div className="form-note" style={{ fontSize: '0.75rem' }}>pot</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Open games */}
      <h2>🔴 Open Tables</h2>
      {loading && <p>Loading tables…</p>}
      {!loading && games.length === 0 && (
        <div className="card empty-wrap"><p>No open tables. Start one! 🎲</p></div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {games.map((g) => (
          <div key={g.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Avatar displayName={g.host.displayName} profileColor={g.host.profileColor} size="sm" />
              <div>
                <div style={{ fontWeight: 800 }}>{g.host.displayName}</div>
                <div className="form-note">🪙 {g.betTokens.toLocaleString()} tokens (${(g.betTokens / 100).toFixed(0)})</div>
              </div>
            </div>
            {user && g.host.id === user.id ? (
              <button className="btn btn-sm btn-ghost" onClick={() => cancel(g.id)}>Cancel</button>
            ) : (
              <button className="btn btn-sm" onClick={() => join(g.id, g.betTokens)} disabled={rolling}>
                {rolling ? '🎲 Rolling…' : '🎲 Accept'}
              </button>
            )}
          </div>
        ))}
      </div>
      </>
      )}

      {/* History — win/loss scorecard */}
      {tab === 'history' && history.length > 0 && (
        <>
          <h2>📜 Your Scorecard</h2>
          {(() => {
            const won = history.filter((h) => h.won);
            const lost = history.filter((h) => !h.won);
            // Winner takes pot minus 10% house cut; loser loses their bet
            const totalWon = won.reduce((s, h) => s + Math.floor(h.potTokens * 0.9), 0);
            const totalLost = lost.reduce((s, h) => s + h.betTokens, 0);
            const net = totalWon - totalLost;
            return (
              <div className="card" style={{
                padding: '1rem', marginBottom: '1rem', display: 'flex',
                justifyContent: 'space-around', textAlign: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>
                    +{totalWon.toLocaleString()}
                  </div>
                  <div className="form-note">Won ({won.length})</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff8080' }}>
                    −{totalLost.toLocaleString()}
                  </div>
                  <div className="form-note">Lost ({lost.length})</div>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.4rem', fontWeight: 800,
                    color: net >= 0 ? 'var(--gold)' : '#ff8080',
                  }}>
                    {net >= 0 ? '+' : '−'}{Math.abs(net).toLocaleString()}
                  </div>
                  <div className="form-note">Net</div>
                </div>
              </div>
            );
          })()}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {history.slice(0, 10).map((h) => {
              const amount = h.won ? Math.floor(h.potTokens * 0.9) : h.betTokens;
              return (
                <div key={h.id} className="card" style={{
                  padding: '0.6rem 0.8rem', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  borderLeft: `3px solid ${h.won ? 'var(--green)' : '#cc0000'}`,
                }}>
                  <span>
                    {h.won ? '🏆' : '😞'}{' '}
                    {DICE_FACES[h.hostRoll]} vs {DICE_FACES[h.opponentRoll]}
                    <span className="form-note" style={{ marginLeft: '0.5rem' }}>
                      {new Date(h.finishedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span style={{
                    fontWeight: 700,
                    color: h.won ? 'var(--green)' : '#ff8080',
                  }}>
                    {h.won ? '+' : '−'}{amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <p className="form-note" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        ⚠️ Play responsibly. Only bet what you can afford to lose.
      </p>
    </div>
  );
}
