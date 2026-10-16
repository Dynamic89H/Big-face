import { useEffect, useState } from 'react';
import { getSocket } from '../api/socket';

interface VaultStatus {
  balance: number;
  players: number;
  totalTickets: number;
  myTickets: number;
  drawingAt: string;
  recentWinners: { display_name: string; profile_color: string; amount: number; won_at: string }[];
}

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

/**
 * VaultPage — The Big Face Vault. Community jackpot.
 * Glowing Big Face branding, VAULT background, live counter.
 */
export default function VaultPage() {
  const [vault, setVault] = useState<VaultStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/vault', { headers: auth() });
      if (res.ok) setVault(await res.json());
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    load();
    const socket = getSocket();
    const onUpdate = () => load();
    socket.on('vault:update', onUpdate);
    socket.on('vault:winner', onUpdate);
    return () => {
      socket.off('vault:update', onUpdate);
      socket.off('vault:winner', onUpdate);
    };
  }, []);

  useEffect(() => {
    if (!vault) return;
    const tick = () => {
      const diff = new Date(vault.drawingAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Drawing now!');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [vault]);

  const odds = vault && vault.totalTickets > 0
    ? ((vault.myTickets / vault.totalTickets) * 100).toFixed(2)
    : '0';

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
      {/* VAULT background text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-8deg)',
        fontSize: 'clamp(80px, 20vw, 200px)', fontWeight: 900,
        color: 'transparent', WebkitTextStroke: '2px rgba(201,162,39,0.12)',
        letterSpacing: '0.1em', pointerEvents: 'none', userSelect: 'none',
        whiteSpace: 'nowrap', zIndex: 0,
      }}>
        VAULT
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: '2rem' }}>
        {/* Glowing Big Face */}
        <div className="shine-text" style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900,
          marginBottom: '0.25rem',
          filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6)) drop-shadow(0 0 40px rgba(255,215,0,0.3))',
        }}>
          💰 BIG FACE
        </div>
        <div style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 800,
          color: 'var(--gold)', letterSpacing: '0.3em',
          textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)',
          marginBottom: '2rem',
        }}>
          VAULT
        </div>

        {/* Live jackpot counter */}
        <div className="card glow-gold" style={{
          display: 'inline-block', padding: '2rem 3rem', marginBottom: '1.5rem',
          background: 'linear-gradient(160deg, rgba(201,162,39,0.15), rgba(0,0,0,0.6))',
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>
            🔴 LIVE JACKPOT
          </div>
          <div style={{
            fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: 900,
            color: '#ffd700',
            textShadow: '0 0 20px rgba(255,215,0,0.8)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            🪙 {(vault?.balance || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.5rem' }}>
            ≈ ${((vault?.balance || 0) / 100).toFixed(2)}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '1rem', justifyContent: 'center',
          marginBottom: '2rem', flexWrap: 'wrap',
        }}>
          <div className="card" style={{ padding: '1rem 1.5rem', minWidth: 120 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{vault?.players || 0}</div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>Players</div>
          </div>
          <div className="card glow-blue" style={{ padding: '1rem 1.5rem', minWidth: 120 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>
              {vault?.myTickets || 0}
            </div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>Your tickets</div>
          </div>
          <div className="card" style={{ padding: '1rem 1.5rem', minWidth: 120 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{odds}%</div>
            <div className="form-note" style={{ fontSize: '0.8rem' }}>Your odds</div>
          </div>
        </div>

        {/* Countdown */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="form-note">Next drawing</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>
            ⏰ {timeLeft}
          </div>
          <div className="form-note" style={{ fontSize: '0.85rem' }}>Friday 8 PM CST</div>
        </div>

        {/* How it works */}
        <div className="card" style={{
          maxWidth: 500, margin: '0 auto 2rem', textAlign: 'left', padding: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem', textAlign: 'center' }}>How The Vault Works</h3>
          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
            <div>🎲 Every bet, spin, gift & purchase feeds The Vault</div>
            <div>🎫 You earn raffle tickets for every action</div>
            <div>🏆 One random player wins it all every Friday 8 PM</div>
            <div>📈 More active = more tickets = better odds</div>
          </div>
        </div>

        {/* Recent winners */}
        {vault && vault.recentWinners.length > 0 && (
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>Recent Winners 🏆</h3>
            {vault.recentWinners.map((w, i) => (
              <div key={i} className="card" style={{
                padding: '1rem', display: 'flex', alignItems: 'center',
                gap: '1rem', marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '1.8rem' }}>🏆</span>
                <span style={{ fontWeight: 700, color: w.profile_color, flex: 1 }}>
                  {w.display_name}
                </span>
                <span style={{ fontWeight: 800, color: 'var(--gold)' }}>
                  🪙 {w.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
