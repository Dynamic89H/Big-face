import { rankForLevel, crownRank } from '../pages/RanksPage';

interface RankJourneyProps {
  level: number;
  gender?: string;
}

const JOURNEY = [
  { name: 'Rookie', icon: '🥉', minLevel: 1, color: '#cd7f32' },
  { name: 'Grinder', icon: '🥈', minLevel: 3, color: '#c0c0c0' },
  { name: 'Hustler', icon: '🥇', minLevel: 6, color: '#ffd700' },
  { name: 'Boss', icon: '💎', minLevel: 11, color: '#00d4ff' },
  { name: 'Kingpin', icon: '👑', minLevel: 21, color: '#ff6b00' },
  { name: 'Legend', icon: '🌟', minLevel: 31, color: '#ff00ff' },
  { name: 'Face King', icon: '🤴', minLevel: 40, color: '#ffd700' },
];

/**
 * RankJourney — the full road from Rookie to Face King/Queen.
 * Shows every rank as a node, marks the user's position, locked vs unlocked.
 */
export default function RankJourney({ level, gender }: RankJourneyProps) {
  const current = rankForLevel(level, gender);
  const crown = crownRank(gender);
  const journey = JOURNEY.map((r, i) =>
    i === JOURNEY.length - 1 ? { ...r, name: crown.name, icon: crown.icon } : r
  );

  return (
    <div className="rank-journey">
      <div className="rank-journey-title">🗺️ THE ROAD TO THE THRONE</div>
      <div className="rank-journey-track">
        {journey.map((rank, i) => {
          const reached = level >= rank.minLevel;
          const isCurrent = current.name === rank.name;
          const next = journey[i + 1];
          return (
            <div key={rank.name} className="rank-journey-node-wrap">
              <div
                className={`rank-journey-node ${reached ? 'reached' : 'locked'} ${isCurrent ? 'current' : ''}`}
                style={{ '--rank-color': rank.color } as React.CSSProperties}
              >
                <span className="rank-journey-icon">{rank.icon}</span>
                {isCurrent && <span className="rank-journey-you">YOU</span>}
                {!reached && <span className="rank-journey-lock">🔒</span>}
              </div>
              <div className={`rank-journey-label ${isCurrent ? 'current-label' : ''}`}>
                {rank.name}
                <span className="rank-journey-lvl">Lv {rank.minLevel}+</span>
              </div>
              {next && (
                <div className={`rank-journey-connector ${level >= next.minLevel ? 'lit' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
