// Typed REST client for the Big Face API. All endpoints from API_CONTRACT.md.
// Base path is relative so the Vite dev proxy (and same-origin prod serving) works.
import type {
  Attachment,
  AvatarItem,
  EarningsSummary,
  Gift,
  GiftCatalogItem,
  LeaderboardEntry,
  MediaPost,
  Message,
  OwnedAvatarItem,
  Payout,
  Room,
  RoomSummary,
  ThroneInfo,
  Transaction,
  User,
  UserStats,
} from '../types';

export const TOKEN_KEY = 'bigface.token';

// Re-export shared shapes used in component props.
export type { Gift };
export type { GiftCatalogItem };

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Let the browser set multipart boundaries for FormData.
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };
  for (const [k, v] of Object.entries(options.headers ?? {})) {
    headers[k] = v as string;
  }

  const res = await fetch(`/api${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new ApiError(res.status, data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

const get = <T>(path: string): Promise<T> => request<T>(path);

// === API response cache — keeps Big Face feeling instant ===
// Caches GET responses for 45 seconds. Busts automatically on POST/PATCH/DELETE.
const cache = new Map<string, { data: unknown; at: number }>();
const CACHE_TTL = 45000;

export function getCached<T>(path: string): Promise<T> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < CACHE_TTL) {
    return Promise.resolve(hit.data as T);
  }
  return get<T>(path).then((data) => {
    cache.set(path, { data, at: Date.now() });
    return data;
  });
}

export function bustCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
const post = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
const patch = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
const del = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined });

// --- Auth ---
export interface SignupInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
  gender: string;
  referralCode?: string;
}

export const authApi = {
  signup: (input: SignupInput) => post<{ token: string; user: User }>('/auth/signup', input),
  login: (identifier: string, password: string) =>
    post<{ token: string; user: User; dailyReward: { streak: number; xp: number } | null }>('/auth/login', { identifier, password }),
  me: () => get<{ user: User }>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    post<{ ok: boolean }>('/auth/change-password', { currentPassword, newPassword }),
  deleteAccount: (password: string) =>
    del<{ ok: boolean }>('/auth/account', { password, confirm: 'DELETE' }),
};

// --- Users ---
export const usersApi = {
  get: (id: string) => get<{ user: User; stats: UserStats }>(`/users/${id}`),
  search: (q: string) => get<{ users: User[] }>(`/users/search?q=${encodeURIComponent(q)}`),
  updateMe: (input: { displayName?: string; bio?: string; profileColor?: string; profileBackground?: string; gender?: string; avatarConfig?: unknown }) =>
    patch<{ user: User }>('/users/me', input),
  leaderboard: (limit = 50) => get<{ entries: LeaderboardEntry[] }>(`/users/leaderboard?limit=${limit}`),
  colorOfWeek: () => get<{ user: User | null; weekStart: string }>('/users/color-of-week'),
  hallOfFame: (limit = 20) => get<{ posts: MediaPost[] }>(`/users/hall-of-fame?limit=${limit}`),
  legendary: () => get<{ king: User | null; queen: User | null; weekStart: string }>('/users/legendary'),
  referral: () => get<{ code: string | null; count: number; referred: Array<{ displayName: string; username: string; joinedAt: string }> }>('/users/referral'),
  lifestyle: (id: string) => get<{ assets: Array<{ kind: string; name: string; rarity: string }> }>(`/users/${id}/lifestyle`),
  weeklyTrack: () => get<{ track: { title: string; artist: string; genre: string; url: string; setBy: string | null; weekStart: string } | null }>('/users/weekly-track'),
  setWeeklyTrack: (input: { title: string; artist: string; genre: string; url: string }) =>
    post<{ ok: boolean }>('/users/weekly-track', input),
  like: (id: string) => post<{ liked: boolean }>(`/users/${id}/like`),
  unlike: (id: string) => del<{ liked: boolean }>(`/users/${id}/like`),
  block: (id: string) => post<void>(`/users/${id}/block`),
  unblock: (id: string) => del<void>(`/users/${id}/block`),
};

// --- Friends ---
export const friendsApi = {
  list: () => get<{ friends: User[] }>('/friends'),
  requests: () => get<{ received: User[]; sent: User[] }>('/friends/requests'),
  status: (userId: string) => get<{ status: string | null }>(`/friends/status/${userId}`),
  request: (userId: string) => post<{ ok: boolean }>('/friends/request', { userId }),
  accept: (userId: string) => post<{ ok: boolean }>('/friends/accept', { userId }),
  decline: (userId: string) => post<{ ok: boolean }>('/friends/decline', { userId }),
  unfriend: (userId: string) => del<{ ok: boolean }>(`/friends/${userId}`),
  search: (q: string) => get<{ users: User[] }>(`/friends/search?q=${encodeURIComponent(q)}`),
  discover: () => get<{ users: User[] }>('/friends/discover'),
};

// --- Rooms ---
export const roomsApi = {
  list: () => get<{ rooms: RoomSummary[] }>('/rooms'),
  publicRooms: () => get<{ rooms: RoomSummary[] }>('/rooms/public'),
  kick: (roomId: string, userId: string) => post<{ ok: boolean }>(`/rooms/${roomId}/kick`, { userId }),
  create: (input: { name: string; description?: string; memberIds?: string[] }) =>
    post<{ room: Room }>('/rooms', input),
  get: (id: string) => get<{ room: Room; members: User[] }>(`/rooms/${id}`),
  dm: (userId: string) => post<{ room: Room }>('/rooms/dm', { userId }),
  join: (id: string) => post<void>(`/rooms/${id}/join`),
  leave: (id: string) => post<void>(`/rooms/${id}/leave`),
  markRead: (id: string) => post<void>(`/rooms/${id}/read`),
};

// --- Messages ---
export const messagesApi = {
  list: (roomId: string, limit = 50, before?: string) =>
    get<{ messages: Message[] }>(
      `/rooms/${roomId}/messages?limit=${limit}${before ? `&before=${encodeURIComponent(before)}` : ''}`,
    ),
  send: (roomId: string, input: { body?: string; attachments?: Attachment[] }) =>
    post<{ message: Message }>(`/rooms/${roomId}/messages`, input),
  addReaction: (messageId: string, emoji: string) =>
    post<{ ok: boolean }>(`/messages/${messageId}/reactions`, { emoji }),
  removeReaction: (messageId: string, emoji: string) =>
    del<void>(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`),
  markRead: (messageId: string) => post<void>(`/messages/${messageId}/read`),
};

// --- Uploads ---
export interface UploadResult {
  url: string;
  name: string;
  mime: string;
  size: number;
}

export const uploadsApi = {
  upload: async (file: File): Promise<UploadResult> => {
    const form = new FormData();
    form.append('file', file);
    const token = getToken();
    const res = await fetch('/api/uploads', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (res.status === 204) return undefined as unknown as UploadResult;
    const data = (await res.json().catch(() => ({}))) as { error?: string } & UploadResult;
    if (!res.ok) throw new ApiError(res.status, data.error || `Upload failed (${res.status})`);
    return { url: data.url, name: data.name, mime: data.mime, size: data.size };
  },
};

// --- Media (Hall of Fame) ---
export const mediaApi = {
  list: (limit = 20) => get<{ posts: MediaPost[] }>(`/media?limit=${limit}`),
  create: (input: { url: string; kind: string; caption?: string }) =>
    post<{ post: MediaPost }>('/media', input),
  like: (id: string) => post<{ liked: boolean }>(`/media/${id}/like`),
  unlike: (id: string) => del<{ liked: boolean }>(`/media/${id}/like`),
};

// --- Avatar Studio ---
export const avatarApi = {
  items: () => get<{ items: AvatarItem[] }>('/avatar/items'),
  mine: () => get<{ owned: OwnedAvatarItem[]; equipped: Record<string, AvatarItem> }>('/avatar/me'),
  acquire: (itemId: string) => post<{ ok: boolean }>('/avatar/acquire', { itemId }),
  equip: (itemId: string) => post<{ ok: boolean }>('/avatar/equip', { itemId }),
  unequip: (slot: string) => post<{ ok: boolean }>('/avatar/unequip', { slot }),
};

// --- Wallet / Gifts ---
export const walletApi = {
  get: () => get<{ balance: number; transactions: Transaction[] }>('/wallet'),
  purchase: (packId: 'starter' | 'popular' | 'whale') =>
    post<{ clientSecret: string }>('/wallet/purchase', { packId }),
  confirm: (paymentIntentId: string) =>
    post<{ balance: number }>('/wallet/confirm', { paymentIntentId }),
};

export const giftsApi = {
  catalog: () => get<{ gifts: GiftCatalogItem[] }>('/gifts/catalog'),
  send: (input: { receiverId: string; giftKey: string; message?: string; battleId?: string }) =>
    post<{ gift: Gift }>('/gifts', input),
  received: () => get<{ gifts: Gift[] }>('/gifts/received'),
  sent: () => get<{ gifts: Gift[] }>('/gifts/sent'),
};

// --- Lifestyle (houses & cars) ---
export interface LifestyleAsset {
  id: string;
  kind: 'house' | 'car';
  name: string;
  rarity: string;
  minLevel: number;
  tokenPrice: number;
  style: Record<string, unknown>;
  owned?: boolean;
}

export const lifestyleApi = {
  assets: () => get<{ assets: LifestyleAsset[] }>('/lifestyle/assets'),
  mine: () => get<{ assets: LifestyleAsset[] }>('/lifestyle/mine'),
  mineDetailed: () => get<{ assets: any[] }>('/lifestyle/mine/detailed'),
  buy: (assetId: string) => post<{ ok: boolean; name: string }>(`/lifestyle/buy/${assetId}`, {}),
  shop: () => get<{ items: any[] }>('/lifestyle/shop'),
  customize: (assetId: string, category: string, itemId: string) =>
    post<{ ok: boolean; applied: string }>(`/lifestyle/customize/${assetId}`, { category, itemId }),
};

// --- Gamble Face ---
export const gambleApi = {
  list: () => get<{ games: any[] }>('/gamble'),
  mine: () => get<{ games: any[] }>('/gamble/mine'),
  create: (betTokens: number) => post<{ game: { id: string } }>('/gamble', { betTokens }),
  join: (id: string) => post<any>(`/gamble/${id}/join`, {}),
  cancel: (id: string) => post<{ ok: boolean }>(`/gamble/${id}/cancel`, {}),
  soloRoll: (betTokens: number) => post<{ playerRoll: number; houseRoll: number; won: boolean; payout: number }>('/gamble/solo', { betTokens }),
};

// --- Ranks ---
export const ranksApi = {
  get: () => get<{
    ranks: Array<{ name: string; icon: string; minLevel: number; maxLevel: number; color: string; perk: string }>;
    current: { name: string; icon: string; minLevel: number; maxLevel: number; color: string; perk: string };
    currentIndex: number;
    next: { name: string; icon: string; minLevel: number; maxLevel: number; color: string; perk: string } | null;
    level: number;
    xpProgress: { current: number; needed: number; remaining: number; percent: number } | null;
  }>('/ranks'),
  leaderboard: () => get<{ leaders: Array<{ id: string; username: string; display_name: string; level: number; profile_color: string }> }>('/ranks/leaderboard'),
};

// --- Cee-lo Match Mode ---
export const ceeloApi = {
  startMatch: (opponents: string[], buyIn: number, playerAbility?: string) =>
    post<any>('/ceelo/match', { opponents, buyIn, playerAbility }),
  playRound: (matchId: string, bet: number) =>
    post<any>('/ceelo/round', { matchId, bet }),
  getMatch: (id: string) => get<any>(`/ceelo/match/${id}`),
  rivalries: () => get<any>('/ceelo/rivalries'),
  story: () => get<{ chapters: any[]; playerLevel: number }>('/ceelo/story'),
  useAbility: (matchId: string, ability: string) =>
    post<any>('/ceelo/ability', { matchId, ability }),
};

// --- Push Notifications ---
export const pushApi = {
  vapidKey: () => get<{ publicKey: string }>('/push/vapid-key'),
  subscribe: (data: { endpoint: string; p256dh: string; auth: string; lang?: string }) =>
    post<{ ok: boolean }>('/push/subscribe', data),
  unsubscribe: (endpoint: string) => post<{ ok: boolean }>('/push/unsubscribe', { endpoint }),
  test: () => post<{ ok: boolean; sent: number }>('/push/test', {}),
};

// --- Factory ---
export const factoryApi = {
  list: (kind?: string, style?: string) => {
    const params = new URLSearchParams();
    if (kind) params.set('kind', kind);
    if (style) params.set('style', style);
    return get<{ assets: any[] }>(`/factory?${params}`);
  },
  create: (data: { kind: string; style: string; prompt: string; imageUrl?: string; sourceUrl?: string }) =>
    post<{ asset: any }>('/factory', data),
  like: (id: string) => post<{ ok: boolean }>(`/factory/${id}/like`, {}),
};

// --- Battles ---
export const battlesApi = {
  list: () => get<{ battles: any[] }>('/battles'),
  create: (title?: string) => post<{ battle: { id: string } }>('/battles', { title }),
  get: (id: string) => get<{ battle: any; scores: any[] }>(`/battles/${id}`),
  join: (id: string) => post<{ ok: boolean }>(`/battles/${id}/join`, {}),
  end: (id: string) => post<{ ok: boolean; winnerId: string | null }>(`/battles/${id}/end`, {}),
};

// --- Crews ---
export const crewsApi = {
  list: () => get<{ crews: any[] }>('/crews'),
  mine: () => get<{ crew: any | null }>('/crews/mine'),
  create: (input: { name: string; tag: string; description?: string; color?: string }) =>
    post<{ crew: { id: string } }>('/crews', input),
  join: (id: string) => post<{ ok: boolean }>(`/crews/${id}/join`, {}),
  leave: () => post<{ ok: boolean }>('/crews/leave', {}),
  war: (crewId: string) => post<{ war: { id: string } }>(`/crews/war/${crewId}`, {}),
  activeWars: () => get<{ wars: any[] }>('/crews/wars/active'),
};

// --- Artists ---
export const artistsApi = {
  tracks: (sort?: string) => get<{ tracks: any[] }>(`/artists/tracks${sort ? `?sort=${sort}` : ''}`),
  top: () => get<{ artists: any[] }>('/artists/top'),
  become: (artistName: string) => post<{ ok: boolean }>('/artists/profile', { artistName }),
  dropTrack: (input: { title: string; genre: string; audioUrl: string; coverUrl?: string }) =>
    post<{ track: { id: string } }>('/artists/tracks', input),
  play: (id: string) => post<{ ok: boolean }>(`/artists/tracks/${id}/play`, {}),
  tip: (id: string, tokens: number) => post<{ ok: boolean }>(`/artists/tracks/${id}/tip`, { tokens }),
};

// --- Earnings / Payouts ---
export const earningsApi = {
  summary: () => get<EarningsSummary>('/earnings/summary'),
  connect: () => post<{ onboardingUrl: string }>('/earnings/connect'),
  payout: (amountCents: number) => post<{ payout: Payout }>('/earnings/payout', { amountCents }),
  payouts: () => get<{ payouts: Array<{ id: string; amountCents: number; status: string; createdAt: string }> }>('/earnings/payouts'),
  autoPayout: () => get<{ autoPayoutEnabled: boolean; autoPayoutThresholdCents: number }>('/earnings/auto-payout'),
  setAutoPayout: (enabled: boolean, thresholdCents?: number) =>
    post<{ autoPayoutEnabled: boolean; autoPayoutThresholdCents: number }>('/earnings/auto-payout', { enabled, thresholdCents }),
};

// --- Throne ---
export const throneApi = {
  me: () => get<ThroneInfo>('/throne/me'),
  legendary: () => get<{ king: User | null; queen: User | null; weekStart: string }>('/throne/legendary'),
};

// --- Moderation ---
export type ReportTargetType = 'user' | 'message' | 'media';
export const reportsApi = {
  report: (input: { targetType: ReportTargetType; targetId: string; reason: string }) =>
    post<void>('/reports', input),
  safety: (input: { subject: string; reason: string; details?: string }) =>
    post<{ reportId: string }>('/reports/safety', input),
};

// --- Video ---
export const videoApi = {
  start: (roomId: string) => post<{ sessionId: string }>(`/rooms/${roomId}/video/start`),
  end: (sessionId: string) => del<void>(`/video/sessions/${sessionId}/end`),
};
