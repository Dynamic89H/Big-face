import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PulseItem {
  type: 'live' | 'win' | 'vault';
  icon: string;
  text: string;
  meta: string;
  id: string;
}

/**
 * Pulse — what's happening on Big Face RIGHT NOW.
 * The future: ambient, alive, always fresh.
 */
export default function Pulse() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await fetch('/api/pulse', {
        headers: { Authorization: `Bearer ${localStorage.getItem('bigface.token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.pulse || []);
      }
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // Refresh every 30s
    return () => clearInterval(t);
  }, []);

  if (items.length === 0) return null;

  const go = (item: PulseItem) => {
    if (item.type === 'live') navigate('/vision');
    else if (item.type === 'vault') navigate('/vault');
    else navigate('/leaderboard');
  };

  return (
    <div className="pattern-neon" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        <span className="pattern-live-dot" />
        <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          PULSE — LIVE NOW
        </span>
      </div>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => go(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '0.5rem', borderRadius: 8, textAlign: 'left',
              color: 'var(--text)', width: '100%',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.text}
              </div>
              <div className="form-note" style={{ fontSize: '0.75rem' }}>{item.meta}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
