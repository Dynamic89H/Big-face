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
          headers: { Authorization: `Bearer ${localStorage.getItem('bigface.token')}` },
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
    <div className="win-ticker">
      <div className="win-ticker-inner">
        <span className="win-ticker-label">
          🔴 LIVE WINS
        </span>
        <div className="win-ticker-scroll">
          <div className="win-ticker-track">
            {items.map((item) => (
              <span key={item.id} className="win-ticker-item">
                {KIND_ICON[item.kind] || '🏆'}{' '}
                <strong style={{ color: item.user.profileColor }}>{item.user.displayName}</strong>
                {' '}won <strong className="win-ticker-amount">{item.amount.toLocaleString()}</strong> tokens
                {item.detail && <span className="win-ticker-detail"> ({item.detail})</span>}
              </span>
            ))}
          </div>
        </div>
        <button
          className="win-ticker-close"
          onClick={() => setVisible(false)}
          aria-label="Dismiss live wins ticker"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
