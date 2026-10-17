import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gambleApi, ApiError } from '../api/client';
import { celebrate } from '../components/Celebration';
import { sfx, haptic } from '../utils/sfx';
import { getSocket } from '../api/socket';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';
import { useActorEngine, ActorSpeech, ACTOR_VOICES } from '../components/ActorEngine';

// Hoisted: stable actors array so the ActorEngine effect doesn't re-run every render
const GAMBLE_ACTORS = [
  { id: 'boss', name: 'The Boss', personality: 'street_king' as const, equipped: {}, voice: ACTOR_VOICES.boss },
  { id: 'diva', name: 'Diva', personality: 'queen' as const, equipped: {}, voice: ACTOR_VOICES.diva },
];

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
  // Premium CSS 3D dice — looks 3D, runs at 60fps, no WebGL needed.
  // Keyframes (diceTumble / diceSettle) live once in theme.css.
  const pipLayouts: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };
  const pips = pipLayouts[value] || pipLayouts[1];
  return (
    <div style={{ perspective: 400 }}>
      <div style={{
        width: 80, height: 80, position: 'relative',
        transformStyle: 'preserve-3d',
        animation: rolling
          ? 'diceTumble 0.6s ease-in-out infinite'
          : 'diceSettle 0.3s ease-out',
      }}>
        {/* Dice face */}
        <div style={{
          width: 80, height: 80, borderRadius: 16,
          background: 'linear-gradient(135deg, #ffffff 0%, #e8e8e8 50%, #d0d0d0 100%)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1)',
          position: 'relative',
        }}>
          {pips.map(([x, y], i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              width: 14, height: 14, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #333, #000)',
              transform: 'translate(-50%, -50%)',
              boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamblePage() {
  usePageTitle('Gamble Face');
  const { user, bumpLocalXp } = useAuth();
  const [tab, setTab] = useState<'dice' | 'history'>('dice');
  const [games, setGames] = useState<Game[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('1000');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  // Character Actor Engine — dealers talk trash, celebrate, play mind games
  const { currentLine } = useActorEngine({
    actors: GAMBLE_ACTORS,
    gameState: result ? 'won' : 'waiting',
    winnerId: result ? 'boss' : undefined,
  });
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [soloRolling, setSoloRolling] = useState(false);
  const [soloDice, setSoloDice] = useState<[number, number] | null>(null);
  // In-app confirmation modal (replaces native confirm()).
  const [confirmState, setConfirmState] = useState<{
    title: string; body: string; confirmLabel: string; danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  /** Solo dice — press and roll against the house. Instant. */
  const soloRoll = async () => {
    const bet = parseInt(betAmount, 10);
    if (!bet || bet < 100 || bet > 25000) {
      setMsg('⚠️ Bet must be between 100 and 25,000 tokens.');
      return;
    }
    setSoloRolling(true);
    setSoloDice(null);
    setResult(null);
    setMsg(null);
    sfx.spin();
    // Animate dice for 1.2s
    const rollInterval = setInterval(() => {
      setSoloDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
    }, 100);
    try {
      const r = await gambleApi.soloRoll(bet);
      setTimeout(() => {
        clearInterval(rollInterval);
        setSoloDice([r.playerRoll, r.houseRoll]);
        setSoloRolling(false);
        if (r.won) {
          sfx.bigWin();
          haptic([40, 40, 80]);
          celebrate(`🏆 You won ${r.payout.toLocaleString()} tokens!`, true);
          let winMsg = `🏆 You rolled ${r.playerRoll} vs house ${r.houseRoll} — won ${r.payout.toLocaleString()} tokens!`;
          if ((r as any).firstWinBonus) {
            winMsg += `\n🎯 FIRST WIN OF THE DAY! +50 bonus XP!`;
            celebrate(`🎯 First win of the day! +50 XP bonus!`, true);
          }
          setMsg(winMsg);
          bumpLocalXp(30 + ((r as any).firstWinBonus ? 50 : 0)); // dice_solo_win + first-win bonus
        } else {
          sfx.error();
          setMsg(`You rolled ${r.playerRoll} vs house ${r.houseRoll}. House wins this one.`);
          bumpLocalXp(10); // dice_solo_play
        }
        load();
      }, 1200);
    } catch (e) {
      clearInterval(rollInterval);
      setSoloRolling(false);
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not roll.');
    }
  };

  // Background music toggle — preloads audio, shows buffering state.
  const [musicLoading, setMusicLoading] = useState(false);
  const toggleMusic = () => {
    if (!musicRef.current) {
      // Casino-style ambient loop. Preloaded so first play isn't silent.
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_2c8a5d8b9e.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => setMusicLoading(false), { once: true });
      audio.addEventListener('error', () => {
        setMusicLoading(false);
        setMsg('⚠️ Music failed to load. Check your connection.');
      }, { once: true });
      musicRef.current = audio;
    }
    if (musicOn) {
      musicRef.current.pause();
      setMusicOn(false);
    } else {
      setMusicLoading(true);
      musicRef.current.play()
        .then(() => { setMusicOn(true); setMusicLoading(false); })
        .catch(() => { setMusicLoading(false); setMsg('⚠️ Could not play music.'); });
    }
  };

  useEffect(() => {
    return () => musicRef.current?.pause();
  }, []);

  const [hotGames, setHotGames] = useState<any[]>([]);

  const load = async () => {
    setLoadError(null);
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
          headers: { Authorization: `Bearer ${localStorage.getItem('bigface.token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHotGames(data.games || []);
        }
      } catch {}
    } catch {
      setLoadError('Could not load the tables. Check your connection and try again.');
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
      if (r.winnerId === user?.id) {
        sfx.bigWin();
        haptic([40, 40, 80]);
        document.body.classList.add('fx-shake');
        setTimeout(() => document.body.classList.remove('fx-shake'), 600);
        bumpLocalXp(30); // dice_win
      } else {
        bumpLocalXp(10); // dice_play
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
  }, [bumpLocalXp]);

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
    setConfirmState({
      title: '🎲 Join this game?',
      body: `Match the ${bet.toLocaleString()} token bet and roll the dice. Winner takes the pot!`,
      confirmLabel: `Roll for ${bet.toLocaleString()} 🪙`,
      onConfirm: () => doJoin(gameId),
    });
  };

  const doJoin = async (gameId: string) => {
    setRolling(true);
    setResult(null);
    setMsg(null);
    // Room goes tense while rolling
    try {
      const r = await gambleApi.join(gameId);
      // 3D dice tumble and land on YOUR ACTUAL roll values
      // Rolling animation delay for drama.
      setTimeout(() => {
        setRolling(false);
        setResult(r);
        if (r.winnerId === user?.id) {
          // WIN — gold celebration in the 3D room
          celebrate(`🏆 YOU WON ${r.winnerPayout.toLocaleString()} TOKENS!`, true);
        } else {
          // LOSS — room dims cool
        }
        load();
      }, 1800);
    } catch (e) {
      setRolling(false);
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not join game.');
    }
  };

  const cancel = async (gameId: string) => {
    setConfirmState({
      title: '🚫 Cancel this game?',
      body: 'Your bet will be refunded in full. This cannot be undone.',
      confirmLabel: 'Yes, cancel it',
      danger: true,
      onConfirm: () => doCancel(gameId),
    });
  };

  const doCancel = async (gameId: string) => {
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
      borderRadius: 16, padding: '1.5rem',
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

      {/* Premium 2D casino table — smooth, fast, beautiful */}
      <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{
          width: '100%', minHeight: 220, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '2rem',
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at center, #1a7a3a 0%, #0d5c2e 45%, #084a24 75%, #063a1c 100%)
          `,
          borderRadius: 20,
          position: 'relative',
          padding: '2rem',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.1)',
        }}>
          {/* Gold trim */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
            border: '3px solid transparent',
            background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor', maskComposite: 'exclude',
          }} />
          {/* Felt texture dots */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', opacity: 0.15,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }} />
          {/* Center emblem */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontSize: '6rem', opacity: 0.08, pointerEvents: 'none',
          }}>♠️</div>
          {/* Dice display */}
          <div style={{ display: 'flex', gap: '3rem', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: '#fcf6ba',
                letterSpacing: '0.15em', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}>YOU</div>
              <Dice value={soloDice?.[0] || 6} rolling={soloRolling} />
            </div>
            <div style={{
              fontSize: '1.5rem', alignSelf: 'center', color: '#fcf6ba', fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: '#fcf6ba',
                letterSpacing: '0.15em', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}>HOUSE 🦁</div>
              <Dice value={soloDice?.[1] || 6} rolling={soloRolling} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
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

      {tab === 'dice' && (
      <>
      {/* Quick dice game (original 1v1) — the high-roller table */}
      <div className="home-hero" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <img loading="lazy"
          src="/probus-lion.webp"
          alt="Probus the Lion - Gamble Face dealer"
          style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', objectFit: 'cover', boxShadow: '0 0 20px rgba(201,162,39,0.6)', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div className="hero-kicker">🎲 The High-Roller Table</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Gamble Face</h1>
          <p className="page-sub" style={{ margin: '0.2rem 0 0' }}>Probus the Lion runs this table 🦁</p>
        </div>
        <button
          className={`btn btn-sm ${musicOn ? '' : 'btn-ghost'}`}
          onClick={toggleMusic}
          disabled={musicLoading}
          title={musicLoading ? 'Loading music…' : musicOn ? 'Mute music' : 'Play background music'}
        >
          {musicLoading ? '⏳' : musicOn ? '🔊' : '🔇'}
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

      {/* Solo dice — press and play instantly vs the house */}
      <div className="card" style={{ marginBottom: '1.2rem', borderColor: 'var(--gold)' }}>
        <h3>🎲 Solo Roll — You vs the House</h3>
        <p className="form-note">No waiting. Press the dice, roll instantly, win or lose.</p>
        {(soloDice || soloRolling) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <Dice value={soloDice?.[0] || 1} rolling={soloRolling} />
              <div className="form-note">You</div>
            </div>
            <div style={{ fontSize: '2rem', alignSelf: 'center' }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <Dice value={soloDice?.[1] || 1} rolling={soloRolling} />
              <div className="form-note">House 🦁</div>
            </div>
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); soloRoll(); }} style={{ display: 'flex', gap: '0.5rem' }}>
          <select className="select" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{ flex: 1 }}>
            <option value="100">100 tokens ($1)</option>
            <option value="500">500 tokens ($5)</option>
            <option value="1000">1,000 tokens ($10)</option>
            <option value="5000">5,000 tokens ($50)</option>
            <option value="10000">10,000 tokens ($100)</option>
            <option value="25000">25,000 tokens ($250) 🔥</option>
          </select>
          <button className="btn" type="submit" disabled={soloRolling} style={{ fontSize: '1.2rem' }}>
            {soloRolling ? '🎲 Rolling…' : '🎲 ROLL'}
          </button>
        </form>
      </div>

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
      {loadError && !loading && (
        <div className="error-wrap">
          <p>😕 {loadError}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}
      {!loading && !loadError && games.length === 0 && (
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
      {tab === 'history' && loadError && !loading && (
        <div className="error-wrap">
          <p>😕 {loadError}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}
      {tab === 'history' && !loading && !loadError && history.length === 0 && (
        <div className="card empty-wrap" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎲</div>
          <h3>No games yet — roll the dice above!</h3>
          <p className="form-note">Your wins and losses will show up here once you start playing.</p>
        </div>
      )}
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

      {/* In-app confirmation modal — themed, no native confirm() */}
      {confirmState && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setConfirmState(null)}>
          <div className="card" style={{
            maxWidth: 360, width: '100%', textAlign: 'center', padding: '1.8rem',
            borderColor: confirmState.danger ? '#cc0000' : 'var(--gold)',
            animation: 'diceSettle 0.25s ease-out',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {confirmState.danger ? '⚠️' : '🎲'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem' }}>{confirmState.title}</h3>
            <p className="form-note" style={{ marginBottom: '1.2rem' }}>{confirmState.body}</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}
                onClick={() => setConfirmState(null)}>
                Never mind
              </button>
              <button className="btn" style={{
                flex: 1,
                ...(confirmState.danger ? { background: '#cc0000', borderColor: '#cc0000' } : {}),
              }} onClick={() => { setConfirmState(null); confirmState.onConfirm(); }}>
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
