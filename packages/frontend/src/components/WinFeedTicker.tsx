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
  join: '👋',
  level_up: '⬆️',
  gift: '🎁',
  friend_request: '🤝',
  friend_accept: '🤝',
  crew_formed: '🛡️',
  battle_start: '⚔️',
  record: '🔥',
  challenge_complete: '✅',
  crown: '👑',
};

// Kinds that are announcements, not wins — rendered without "won N tokens".
const ANNOUNCEMENT_KINDS = new Set([
  'join', 'level_up', 'friend_request', 'friend_accept',
  'crew_formed', 'battle_start', 'record', 'challenge_complete',
]);

/** Render one feed item smartly: wins show amounts, announcements show the detail. */
function renderItem(item: FeedItem) {
  const icon = KIND_ICON[item.kind] || '🏆';
  const name = (
    <strong style={{ color: item.user.profileColor }}>{item.user.displayName}</strong>
  );
  if (ANNOUNCEMENT_KINDS.has(item.kind)) {
    // Detail already contains the full message (e.g. "👋 X joined Big Face!")
    return (
      <span>
        {icon} {name} {item.detail ? item.detail.replace(/^👋 |^⬆️ |^⚔️ |^🔥 |^✅ /, '') : ''}
      </span>
    );
  }
  return (
    <span>
      {icon} {name} won <strong className="win-ticker-amount">{item.amount.toLocaleString()}</strong> tokens
      {item.detail && <span className="win-ticker-detail"> ({item.detail})</span>}
    </span>
  );
}

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
                {renderItem(item)}
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
