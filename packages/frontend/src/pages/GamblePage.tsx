import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gambleApi, ApiError } from '../api/client';
import { celebrate } from '../components/Celebration';
import AmbientDice from '../components/AmbientDice';
import DiceTableScene from '../components/DiceTableScene';
import { getSocket } from '../api/socket';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';

// The 4 characters at the dice table
const TABLE_PLAYERS = [
  { id: 'street-king', name: 'Street King', img: '/characters/media-generation-rapper-street-king-0-f5b96626-0370-4c7d-8d6f-7ed3159cfbb6.webp', talking: false, celebrating: false },
  { id: 'queen', name: 'Queen', img: '/characters/media-generation-rapper-queen-0-3b2682fd-d633-4c29-bcb8-f0c31dd471ea.webp', talking: false, celebrating: false },
  { id: 'luxury-boss', name: 'Luxury Boss', img: '/characters/media-generation-rapper-luxury-boss-0-b07d0949-89b4-4f11-b08b-32d732e210f6.webp', talking: false, celebrating: false },
  { id: 'diva', name: 'Diva', img: '/characters/media-generation-rapper-diva-0-c7cb8095-2098-4023-9727-805fb5a46aeb.webp', talking: false, celebrating: false },
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
  const [games, setGames] = useState<Game[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('1000');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

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

  const load = async () => {
    try {
      const [{ games: g }, { games: h }] = await Promise.all([
        gambleApi.list(),
        gambleApi.mine().catch(() => ({ games: [] })),
      ]);
      setGames(g);
      setHistory(h);
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
    try {
      const r = await gambleApi.join(gameId);
      // Rolling animation delay for drama.
      setTimeout(() => {
        setRolling(false);
        setResult(r);
        if (r.winnerId === user?.id) {
          celebrate(`🏆 YOU WON ${r.winnerPayout.toLocaleString()} TOKENS!`, true);
        }
        load();
      }, 1500);
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
    <div className="page" style={{
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 50%, #0a0a2e 100%)',
      borderRadius: 16, padding: '1.5rem',
      boxShadow: '0 0 40px rgba(138,43,226,0.3), inset 0 0 60px rgba(0,0,0,0.5)',
      position: 'relative', overflow: 'hidden',
    }}>
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

      {/* Live 3D dice table with characters */}
      <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 16, overflow: 'hidden' }}>
        <DiceTableScene
          players={TABLE_PLAYERS}
          width={800}
          height={500}
          onPlayerClick={(id) => {
            const p = TABLE_PLAYERS.find((x) => x.id === id);
            if (p) setMsg(`💬 ${p.name} says: "Good luck at the table!"`);
          }}
        />
        <div style={{
          position: 'absolute', top: 12, left: 16,
          display: 'flex', alignItems: 'center',
          background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 20,
          fontSize: '0.8rem', fontWeight: 700, color: '#ff5c5c',
        }}>
          <span className="live-dot" /> LIVE
        </div>
      </div>

      {/* Table chat */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.6rem' }}>💬 Table Talk</h4>
        <p className="form-note" style={{ fontSize: '0.85rem' }}>
          Chat with other players while you game. Tap a character to make them talk!
        </p>
      </div>

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

      {/* History */}
      {history.length > 0 && (
        <>
          <h2>📜 Your History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="card" style={{ padding: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{h.won ? '🏆 Won' : '😞 Lost'} — {DICE_FACES[h.hostRoll]} vs {DICE_FACES[h.opponentRoll]}</span>
                <span className="form-note">{h.potTokens.toLocaleString()} pot</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="form-note" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        ⚠️ Play responsibly. Only bet what you can afford to lose.
      </p>
    </div>
  );
}
