// XP math shared by the frontend. Mirrors packages/backend/src/services/xp.ts:
//   level = floor(sqrt(xp / 100)) + 1   <=>   xpForLevel(L) = 100 * (L - 1)^2

export function xpForLevel(level: number): number {
  return 100 * Math.pow(Math.max(0, level - 1), 2);
}

export function levelForXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export interface XpProgress {
  /** XP earned within the current level */
  current: number;
  /** XP needed to complete the current level */
  needed: number;
  /** XP remaining to reach the next level */
  remaining: number;
  /** 0-100 */
  percent: number;
}

export function xpProgress(xp: number, level: number): XpProgress {
  const cur = xpForLevel(level);
  const nxt = xpForLevel(level + 1);
  const span = Math.max(1, nxt - cur);
  const done = Math.max(0, Math.min(span, xp - cur));
  return {
    current: done,
    needed: span,
    remaining: span - done,
    percent: Math.round((done / span) * 100),
  };
}
