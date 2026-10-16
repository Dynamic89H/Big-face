import { useEffect, useState } from 'react';
import { getSocket } from '../api/socket';

interface FeedItem {
  id: string;
  kind: string;
  amount: number;
  detail?: string;
  at: string;
  user: { displayName: string; profileColor: string };
}

const KIND_ICON: Record<string, string> = {
  gamble: '🎲',
  battle: '⚔️',
  spin: '🎡',
  crew_battle: '🛡️',
};

/**
 * WinFeedTicker — live scrolling win feed, visible on every page.
 * Shows real wins happening across Big Face right now.
 */
export default function WinFeedTicker() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Data saver: skip background refresh
      try {
        const settings = JSON.parse(localStorage.getItem('bigface.settings') || '{}');
        if (settings.dataSaver) return;
      } catch {
        /* load normally */
      }
      try {
        const res = await fetch('/api/engagement/feed?limit=10', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data.feed || []);
        }
      } catch {
        /* offline */
      }
    };
    load();

    const socket = getSocket();
    const onFeed = () => load();
    socket.on('engagement:feed', onFeed);
    return () => {
      socket.off('engagement:feed', onFeed);
    };
  }, []);

  if (!visible || items.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
      background: 'linear-gradient(90deg, rgba(10,10,20,0.95), rgba(20,15,30,0.95))',
      borderTop: '1px solid rgba(201,162,39,0.3)',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0.4rem 0.75rem', gap: '0.5rem',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
          🔴 LIVE WINS
        </span>
        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{
            display: 'inline-block', animation: 'tickerScroll 30s linear infinite',
            fontSize: '0.8rem',
          }}>
            {items.map((item) => (
              <span key={item.id} style={{ marginRight: '2rem', color: 'var(--text)' }}>
                {KIND_ICON[item.kind] || '🏆'}{' '}
                <strong style={{ color: item.user.profileColor }}>{item.user.displayName}</strong>
                {' '}won <strong style={{ color: 'var(--gold)' }}>{item.amount.toLocaleString()}</strong> tokens
                {item.detail && <span style={{ opacity: 0.6 }}> ({item.detail})</span>}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          ✕
        </button>
      </div>
      <style>{`@keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
