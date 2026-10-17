import { useState } from 'react';
import { textOn, facePhotoOf } from './Avatar';
import { initialsOf } from '../types';
import type { User } from '../types';

interface SitterInfo {
  id: string;
  displayName: string;
  profileColor: string;
  level: number;
  photoUrl?: string | null;
  isYou?: boolean;
}

interface Props {
  /** The user currently on the throne (highest level 40+), or null if empty. */
  sitter: SitterInfo | null;
  /** Whether the throne should render in "epic" seated mode (sitter present). */
  crownIcon?: string;
  /** Optional: show a pulsing "claim" highlight ring when the viewer can claim. */
  claimable?: boolean;
  onClaim?: () => void;
  claiming?: boolean;
}

/**
 * ThroneSeat — 2D composite of the Big Face throne with the sitter's avatar
 * positioned on the seat. Pure CSS positioning, no 3D.
 *
 * The avatar sits centered on the throne seat (~44% from the top of the
 * lion-1.png image), ringed in gold, with a crown above and an epic glow.
 */
export default function ThroneSeat({ sitter, crownIcon = '👑', claimable, onClaim, claiming }: Props) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="throne-seat-wrap">
      <div className={`throne-seat-stage${sitter ? ' occupied' : ''}`}>
        {imgOk ? (
          <img
            src="/thrones/lion-1.png"
            alt="The Big Face Throne"
            className="throne-seat-img"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="throne-seat-fallback">🦁</div>
        )}

        {/* Gold aura behind everything */}
        <div className="throne-seat-aura" aria-hidden />

        {sitter ? (
          <>
            {/* Crown drops in above the sitter */}
            <div className="throne-seat-crown" aria-hidden>
              {crownIcon}
            </div>
            {/* The sitter, composited onto the seat */}
            <div className="throne-seat-sitter">
              <div
                className="throne-seat-avatar"
                style={
                  sitter.photoUrl
                    ? {
                        backgroundImage: `url(${sitter.photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : { background: sitter.profileColor, color: textOn(sitter.profileColor) }
                }
                title={sitter.displayName}
              >
                {!sitter.photoUrl && initialsOf(sitter.displayName)}
              </div>
            </div>
            {/* Name plate */}
            <div className="throne-seat-plate">
              <span className="throne-seat-name">
                {sitter.isYou ? '👑 YOU SIT THE THRONE' : `👑 ${sitter.displayName}`}
              </span>
              <span className="throne-seat-level">Level {sitter.level}</span>
            </div>
          </>
        ) : (
          <div className="throne-seat-empty">
            <span>✨ The throne awaits its {crownIcon === '👸' ? 'Queen' : 'King'} ✨</span>
            <span className="throne-seat-empty-sub">Reach Level 40 to claim it</span>
          </div>
        )}
      </div>

      {claimable && onClaim && (
        <button
          className="btn throne-seat-claim"
          onClick={onClaim}
          disabled={claiming}
        >
          {claiming ? '👑 Taking your seat…' : '👑 Take Your Seat'}
        </button>
      )}
    </div>
  );
}

/** Build a SitterInfo for the current user from full user data. */
export function sitterFromUser(user: User): SitterInfo {
  return {
    id: user.id,
    displayName: user.displayName,
    profileColor: user.profileColor,
    level: user.level,
    photoUrl: facePhotoOf(user),
    isYou: true,
  };
}
