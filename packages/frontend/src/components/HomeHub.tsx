import { useNavigate } from 'react-router-dom';

/**
 * HomeHub — Big Face's new navigation.
 * Scroll through sections, each with its own layer.
 * No more 25 items crammed in a bottom bar.
 */

interface Section {
  title: string;
  icon: string;
  items: { label: string; icon: string; to?: string; action?: string; highlight?: boolean }[];
}

const SECTIONS: Section[] = [
  {
    title: '🎲 Play',
    icon: '🎲',
    items: [
      { label: 'Gamble Face', icon: '🎲', to: '/gamble', highlight: true },
      { label: 'Battles', icon: '⚔️', to: '/battles' },
      { label: 'Competition', icon: '🏆', to: '/competition' },
      { label: 'Daily Spin', icon: '🎡', action: 'spin' },
    ],
  },
  {
    title: '👥 Social',
    icon: '👥',
    items: [
      { label: 'Chats', icon: '💬', to: '/chats' },
      { label: 'Video', icon: '📹', to: '/video' },
      { label: 'Stories', icon: '📸', to: '/stories' },
      { label: 'Friends', icon: '👥', to: '/friends' },
      { label: 'Crews', icon: '🛡️', to: '/crews' },
    ],
  },
  {
    title: '🎨 Create',
    icon: '🎨',
    items: [
      { label: 'Avatar Studio', icon: '🎨', to: '/avatar-studio' },
      { label: 'Factory', icon: '🏭', to: '/factory' },
      { label: 'DJ Booth', icon: '🎧', to: '/dj-booth' },
      { label: 'Artists', icon: '🎤', to: '/artists' },
    ],
  },
  {
    title: '💰 Money',
    icon: '💰',
    items: [
      { label: 'Shop', icon: '🛍️', to: '/shop' },
      { label: 'Vault', icon: '💰', to: '/vault' },
      { label: 'Earnings', icon: '💵', to: '/earnings' },
      { label: 'Lifestyle', icon: '💎', to: '/lifestyle' },
    ],
  },
  {
    title: '🏆 Fame',
    icon: '🏆',
    items: [
      { label: 'Ranks', icon: '🎖️', to: '/ranks', highlight: true },
      { label: 'Leaderboard', icon: '🏆', to: '/leaderboard' },
      { label: 'Hall of Fame', icon: '⭐', to: '/hall-of-fame' },
      { label: 'Throne', icon: '👑', to: '/throne' },
    ],
  },
];

export default function HomeHub() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.1rem', margin: '0 0 0.6rem 0.2rem',
            color: 'var(--gold)', letterSpacing: '0.05em',
          }}>
            {section.title}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.6rem',
          }}>
            {section.items.map((item: any) => (
              <button
                key={item.to || item.action}
                onClick={() => {
                  if (item.action === 'spin') {
                    window.dispatchEvent(new CustomEvent('bigface:open-spin'));
                  } else {
                    navigate(item.to);
                  }
                }}
                style={{
                  padding: '1rem 0.6rem',
                  borderRadius: 16,
                  border: item.highlight
                    ? '2px solid var(--gold)'
                    : '1px solid rgba(255,255,255,0.12)',
                  background: item.highlight
                    ? 'linear-gradient(135deg, rgba(201,162,39,0.2), rgba(201,162,39,0.05))'
                    : 'rgba(255,255,255,0.04)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: item.highlight
                    ? '0 0 20px rgba(201,162,39,0.25)'
                    : undefined,
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
