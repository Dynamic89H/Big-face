// Shared shapes mirroring API_CONTRACT.md exactly.

export interface User {
  id: string;
  username: string;
  displayName: string;
  gender: string;
  bio: string | null;
  profileColor: string;
  avatarConfig: Record<string, unknown> | null;
  xp: number;
  level: number;
  loginStreak?: number;
  xpStreak?: number;
  bestXpStreak?: number;
  streakFreezes?: number;
  trophies?: number;
  profileBackground?: string;
  createdAt: string;
}

export interface RoomSummary {
  id: string;
  name: string;
  description: string | null;
  isDm: boolean;
  unreadCount: number;
  lastMessageAt: string | null;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  isDm: boolean;
}

export interface Attachment {
  url: string;
  name: string;
  mime: string;
  size: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  sender: User;
  body: string | null;
  attachments: Attachment[];
  reactions: Reaction[];
  readBy: string[];
  createdAt: string;
}

export interface MediaPost {
  id: string;
  user: User;
  url: string;
  kind: string;
  caption: string | null;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface AvatarItem {
  id: string;
  slot: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  minLevel: number;
  tokenPrice: number;
  style: Record<string, unknown> | null;
}

export interface OwnedAvatarItem {
  item: AvatarItem;
  equipped: boolean;
}

export interface GiftCatalogItem {
  key: string;
  label: string;
  tokenCost: number;
}

export interface Gift {
  id: string;
  senderId: string;
  receiverId: string;
  giftKey: string;
  message: string | null;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface Transaction {
  id: string;
  kind: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  note?: string | null;
}

export interface LeaderboardEntry {
  user: User;
  xp: number;
  level: number;
  rank: number;
}

export interface ThroneInfo {
  level: number;
  tier: string;
  xp: number;
  xpForNext: number;
  rank: number;
}

export interface EarningsSummary {
  tokenBalance: number;
  earnedTokens: number;
  giftsReceived: number;
  payoutsTotal: number;
}

export interface Payout {
  id: string;
  amountCents: number;
  status: string;
  createdAt: string;
}

export interface UserStats {
  followersLikes: number;
  mediaCount: number;
  rank: number | null;
}

export interface TokenPack {
  id: 'starter' | 'popular' | 'whale';
  tokens: number;
  price: string;
  label: string;
  tag?: string;
}

export const TOKEN_PACKS: TokenPack[] = [
  { id: 'starter', tokens: 100, price: '$0.99', label: 'Starter Pack' },
  { id: 'popular', tokens: 550, price: '$4.99', label: 'Popular Pack', tag: 'Most popular' },
  { id: 'whale', tokens: 1200, price: '$9.99', label: 'Whale Pack', tag: 'Best value' },
];

// --- XP / level math (mirrors the contract) ---
// level = floor(sqrt(xp / 100)) + 1
export function levelForXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

// XP required to *reach* a given level.
export function xpForLevel(level: number): number {
  return Math.pow(Math.max(1, level) - 1, 2) * 100;
}

export function tierForLevel(level: number): string {
  if (level >= 10) return 'Legendary Throne';
  if (level >= 7) return 'Golden Throne';
  if (level >= 5) return 'Throne';
  if (level >= 3) return 'Seat';
  return 'Rising';
}

export const RARITY_COLORS: Record<AvatarItem['rarity'], string> = {
  common: '#9aa3b2',
  rare: '#4da3ff',
  epic: '#b06bff',
  legendary: '#ffc94d',
};

export const PROFILE_PRESETS = [
  // Blues
  '#0066FF', '#3b82f6', '#0ea5e9', '#06b6d4',
  // Reds & Corals
  '#FF5C5C', '#ef4444', '#f97316', '#fb7185',
  // Greens
  '#22c55e', '#10b981', '#84cc16', '#14b8a6',
  // Purples & Pinks
  '#a855f7', '#8b5cf6', '#ec4899', '#d946ef',
  // Golds & Oranges
  '#f59e0b', '#eab308', '#d4af37', '#b45309',
  // Neutrals & Dark
  '#f2f4f8', '#9ca3af', '#374151', '#111827',
  // Bold & Neon
  '#00ff88', '#ff00aa', '#ccff00', '#7c3aed',
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
