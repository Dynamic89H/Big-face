import { useEffect, useState } from 'react';
import { celebrate } from './Celebration';
import { sfx, haptic } from '../utils/sfx';

/** Per-rank data for the epic rank-up overlay — colors, taglines, perks. */
export interface RankUpData {
  rankName: string;
  rankIcon: string;
  rankColor: string;
  level: number;
  tokensWon: number;
  gender?: string;
}

const RANK_FLAVOR: Record<string, { tagline: string; perks: string[]; anim: string }> = {
  Grinder: {
    tagline: 'The grind begins.',
    perks: ['Unlocks crew battles', 'Bigger daily rewards', 'Grinder badge on profile'],
    anim: 'steel',
  },
  Hustler: {
    tagline: 'The hustle pays off.',
    perks: ['1.5x spin rewards', 'Unlocks tournaments', 'Hustler badge on profile'],
    anim: 'gold',
  },
  Boss: {
    tagline: 'You run this.',
    perks: ['Marketplace selling unlocked', 'Gold name in chat', 'Boss badge on profile'],
    anim: 'neon',
  },
  Kingpin: {
    tagline: 'The city is yours.',
    perks: ['Host live streams', '2x tip earnings', 'Kingpin badge on profile'],
    anim: 'fire',
  },
  Legend: {
    tagline: 'They tell stories about you.',
    perks: ['Featured on homepage', 'Crown everywhere', 'Legend badge on profile'],
    anim: 'cosmic',
  },
  'Face King': {
    tagline: 'ALL HAIL THE KING.',
    perks: ['Official Face King crown', 'Crowned live for all players', 'Immortalized in the Hall of Fame'],
    anim: 'royal',
  },
  'Face Queen': {
    tagline: 'ALL HAIL THE QUEEN.',
    perks: ['Official Face Queen crown', 'Crowned live for all players', 'Immortalized in the Hall of Fame'],
    anim: 'royal',
  },
};

const DEFAULT_FLAVOR = {
  tagline: 'Level up. Rank up. Never stop.',
  perks: ['More tokens', 'More respect', 'More power'],
  anim: 'gold',
};

/**
 * RankUpOverlay — full-screen EPIC rank-up celebration.
 * Trigger: window.dispatchEvent(new CustomEvent('bigface:rank-up', { detail: RankUpData }))
 * Feels like WINNING, not a notification.
 */
export default function RankUpOverlay() {
  const [data, setData] = useState<RankUpData | null>(null);
  const [stage, setStage] = useState(0); // 0=hidden 1=title 2=badge 3=name 4=perks 5=actions
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const onRankUp = (e: Event) => {
      const d = (e as CustomEvent<RankUpData>).detail;
      if (!d) return;
      setData(d);
      setShared(false);
      setSharing(false);
      setStage(1);
      // Staged cinematic reveal
      const timers = [
        window.setTimeout(() => setStage(2), 600),   // badge
        window.setTimeout(() => setStage(3), 1400),  // rank name
        window.setTimeout(() => setStage(4), 2200),  // perks
        window.setTimeout(() => setStage(5), 3000),  // actions
      ];
      // Sound + confetti
      const isCrown = d.rankName === 'Face King' || d.rankName === 'Face Queen';
      if (isCrown) {
        sfx.jackpot();
      } else {
        sfx.rankUp();
      }
      haptic([30, 50, 30]);
      celebrate(`👑 ${d.rankName.toUpperCase()}!`, true);
      window.setTimeout(() => celebrate(undefined, true), 1200);
      return () => timers.forEach(clearTimeout);
    };
    window.addEventListener('bigface:rank-up', onRankUp);
    return () => window.removeEventListener('bigface:rank-up', onRankUp);
  }, []);

  if (!data || stage === 0) return null;

  const flavor = RANK_FLAVOR[data.rankName] || DEFAULT_FLAVOR;
  const isCrown = data.rankName === 'Face King' || data.rankName === 'Face Queen';

  const shareToStories = async () => {
    setSharing(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bigface.token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaUrl: '',
          mediaType: 'text',
          caption: `${data.rankIcon} I just ranked up to ${data.rankName} on Big Face! Level ${data.level} — ${flavor.tagline} 👑 #BigFace #RankUp`,
        }),
      });
      if (res.ok) setShared(true);
    } catch {
      /* best effort */
    } finally {
      setSharing(false);
    }
  };

  const dismiss = () => {
    setStage(0);
    setData(null);
  };

  return (
    <div className={`rankup-overlay anim-${flavor.anim}`} onClick={dismiss}>
      <div className="rankup-inner" onClick={(e) => e.stopPropagation()}>
        {stage >= 1 && (
          <div className="rankup-kicker rankup-pop">
            {isCrown ? '👑 OFFICIAL CROWNING 👑' : '⚡ RANK UP ⚡'}
          </div>
        )}
        {stage >= 2 && (
          <div
            className="rankup-badge rankup-badge-in"
            style={{ '--rank-color': data.rankColor } as React.CSSProperties}
          >
            <span className="rankup-badge-icon">{data.rankIcon}</span>
            <span className="rankup-badge-shine" />
          </div>
        )}
        {stage >= 3 && (
          <div className="rankup-name rankup-pop" style={{ color: data.rankColor }}>
            {data.rankName}
          </div>
        )}
        {stage >= 3 && (
          <div className="rankup-tagline rankup-fade">
            {flavor.tagline}
          </div>
        )}
        {stage >= 3 && (
          <div className="rankup-level rankup-fade">
            Level {data.level}
            {data.tokensWon > 0 && (
              <span className="rankup-tokens"> +{data.tokensWon.toLocaleString()} tokens</span>
            )}
          </div>
        )}
        {stage >= 4 && (
          <div className="rankup-perks rankup-fade">
            <div className="rankup-perks-title">🔓 UNLOCKED</div>
            {flavor.perks.map((perk, i) => (
              <div key={i} className="rankup-perk" style={{ animationDelay: `${i * 0.15}s` }}>
                ✨ {perk}
              </div>
            ))}
          </div>
        )}
        {stage >= 5 && (
          <div className="rankup-actions rankup-fade">
            <button
              className="rankup-btn rankup-btn-share"
              onClick={shareToStories}
              disabled={sharing || shared}
            >
              {shared ? '✅ Shared!' : sharing ? 'Sharing...' : '📸 Share to Stories'}
            </button>
            <button className="rankup-btn rankup-btn-dismiss" onClick={dismiss}>
              Keep Grinding 💪
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
