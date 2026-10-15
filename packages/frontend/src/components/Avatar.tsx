import { initialsOf } from '../types';

// Picks readable text for a given profile color background.
export function textOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#101216' : '#ffffff';
}

interface Props {
  displayName: string;
  profileColor: string;
  size?: 'sm' | 'lg' | 'xl';
  online?: boolean;
  photoUrl?: string | null;
}

export default function Avatar({ displayName, profileColor, size, online, photoUrl }: Props) {
  return (
    <span
      className={`avatar${size ? ` ${size}` : ''}`}
      style={
        photoUrl
          ? { backgroundImage: `url(${photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: profileColor, color: textOn(profileColor) }
      }
      aria-hidden
    >
      {!photoUrl && initialsOf(displayName)}
      {online !== undefined && <span className={`presence-dot${online ? '' : ' off'}`} />}
    </span>
  );
}

// Helper: pull the face photo URL out of a user's avatar config.
export function facePhotoOf(user: { avatarConfig?: Record<string, unknown> | null } | null | undefined): string | null {
  const cfg = (user?.avatarConfig ?? {}) as Record<string, unknown>;
  return typeof cfg.facePhotoUrl === 'string' ? cfg.facePhotoUrl : null;
}
