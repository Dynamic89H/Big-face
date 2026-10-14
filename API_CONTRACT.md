# Big Face — API & Realtime Contract

Backend serves on `PORT` (default 4000). All REST under `/api`.
Auth: `Authorization: Bearer <JWT>`. Socket.io auth: `auth: { token }`.

## Conventions
- Errors: `{ "error": "message" }` with proper HTTP status.
- Timestamps: ISO 8601. IDs: UUID strings.
- Pagination: `?limit=&before=` (before = ISO timestamp cursor, newest-first).

## XP / Levels
- `level = floor(sqrt(xp / 100)) + 1`
- Awards: message sent +5, reaction received +2, profile like received +1,
  media post +10, gift received +10, gift sent +2, daily login +10.
- Throne tier derived from level: 1–2 "Rising", 3–4 "Seat", 5–6 "Throne",
  7–9 "Golden Throne", 10+ "Legendary Throne".

## Token packs (Stripe)
- `starter`: 100 tokens / $0.99, `popular`: 550 tokens / $4.99, `whale`: 1200 tokens / $9.99
- Gift catalog (token_cost): rose 10, crown 50, throne 100, starshower 250, legend 1000.

## REST

### Auth
- `POST /api/auth/signup` {username, email, password, displayName, gender} → 201 `{token, user}`
- `POST /api/auth/login` {identifier, password} → `{token, user}`
- `GET /api/auth/me` → `{user}` (auth)

### Users
- `GET /api/users/:id` → `{user, stats: {followersLikes, mediaCount, rank}}` (auth)
- `PATCH /api/users/me` {displayName?, bio?, profileColor?, avatarConfig?, gender?} → `{user}` (auth)
- `GET /api/users/leaderboard?limit=50` → `{entries: [{user, xp, level, rank}]}` (auth)
- `GET /api/users/color-of-week` → `{user | null, weekStart}` (auth)
- `GET /api/users/hall-of-fame?limit=20` → `{posts: [mediaPost]}` (auth)
- `GET /api/users/legendary` → `{king, queen, weekStart} | nulls` (auth)
- `POST /api/users/:id/like` → `{liked: true}` (auth)
- `DELETE /api/users/:id/like` → `{liked: false}` (auth)
- `POST /api/users/:id/block` → 204 (auth)
- `DELETE /api/users/:id/block` → 204 (auth)

`user` shape: `{id, username, displayName, gender, bio, profileColor, avatarConfig, xp, level, createdAt}`

### Rooms
- `GET /api/rooms` → `{rooms: [{id, name, description, isDm, unreadCount, lastMessageAt}]}` (auth, member only)
- `POST /api/rooms` {name, description?, memberIds?[]} → 201 `{room}` (auth)
- `GET /api/rooms/:id` → `{room, members: [user]}` (auth, member)
- `POST /api/rooms/dm` {userId} → `{room}` (auth; finds or creates DM)
- `POST /api/rooms/:id/join` → 204 (auth)
- `POST /api/rooms/:id/leave` → 204 (auth)

### Messages
- `GET /api/rooms/:id/messages?limit=50&before=` → `{messages: [message]}` newest-first (auth, member)
- `POST /api/rooms/:id/messages` {body?, attachments?[]} → 201 `{message}` (auth, member; body or ≥1 attachment required; profanity-filtered)
- `POST /api/messages/:id/reactions` {emoji} → `{ok}` (auth, member of room)
- `DELETE /api/messages/:id/reactions/:emoji` → 204 (auth)
- `POST /api/messages/:id/read` → 204 (auth; records read receipt)
- `POST /api/rooms/:id/read` → 204 (auth; marks all as read)

`message` shape: `{id, roomId, sender: user, body, attachments, reactions: [{emoji, count, reactedByMe}], readBy: [userId], createdAt}`
`attachment` shape: `{url, name, mime, size}`

### Uploads
- `POST /api/uploads` multipart `file` → 201 `{url, name, mime, size}` (auth; images/video/audio ≤ 25MB). Served at `/uploads/...`.

### Media (Hall of Fame)
- `GET /api/media?limit=20` → `{posts}` sorted by likes desc (auth)
- `POST /api/media` {url, kind, caption?} → 201 `{post}` (auth)
- `POST /api/media/:id/like` → `{liked: true}` / `DELETE` → `{liked: false}` (auth)

`mediaPost`: `{id, user, url, kind, caption, likesCount, likedByMe, createdAt}`

### Avatar Studio
- `GET /api/avatar/items` → `{items: [avatarItem]}` (auth)
- `GET /api/avatar/me` → `{owned: [{item, equipped}], equipped: {slot: item}}` (auth)
- `POST /api/avatar/acquire` {itemId} → `{ok}` (auth; checks level + token price)
- `POST /api/avatar/equip` {itemId} → `{ok}` (auth; must own)
- `POST /api/avatar/unequip` {slot} → `{ok}` (auth)

`avatarItem`: `{id, slot, name, rarity, minLevel, tokenPrice, style}`

### Wallet / Gifts
- `GET /api/wallet` → `{balance, transactions: [tx]}` (auth)
- `POST /api/wallet/purchase` {packId: starter|popular|whale} → `{clientSecret}` (auth; Stripe PaymentIntent)
- `POST /api/wallet/confirm` {paymentIntentId} → `{balance}` (auth; credits tokens — also handled by webhook)
- `POST /api/stripe/webhook` — Stripe webhook (raw body, no auth)
- `GET /api/gifts/catalog` → `{gifts: [{key, label, tokenCost}]}` (auth)
- `POST /api/gifts` {receiverId, giftKey, message?} → 201 `{gift}` (auth; debits sender, credits receiver)
- `GET /api/gifts/received` / `GET /api/gifts/sent` → `{gifts}` (auth)

### Earnings / Payouts
- `GET /api/earnings/summary` → `{tokenBalance, earnedTokens, giftsReceived, payoutsTotal}` (auth)
- `POST /api/earnings/connect` → `{onboardingUrl}` (auth; Stripe Connect Express)
- `POST /api/earnings/payout` {amountCents} → 201 `{payout}` (auth; 100 tokens = $1.00; min $10)

### Throne / Red Carpet
- `GET /api/throne/me` → `{level, tier, xp, xpForNext, rank}` (auth)
- `GET /api/throne/legendary` → `{king, queen, weekStart}` (auth; same as /users/legendary)
- `POST /api/admin/crown-week` {weekStart} → `{result}` (admin; computes king/queen/color-of-week, fires red-carpet event)

### Moderation
- `POST /api/reports` {targetType: user|message|media, targetId, reason} → 201 (auth)
- `GET /api/admin/reports?status=` → `{reports}` (admin)

### Video
- `POST /api/rooms/:id/video/start` → `{sessionId}` (auth, member)
- `POST /api/video/sessions/:id/end` → 204 (auth)

## Socket.io

Namespace: default `/`. Auth via handshake `auth.token`.

Client → server:
- `room:join` {roomId}, `room:leave` {roomId}
- `message:send` {roomId, body?, attachments?[]} → ack `{message}` or `{error}`
- `typing` {roomId, isTyping}
- `message:read` {roomId, messageId}
- `video:join` {roomId}, `video:leave` {roomId}
- `video:signal` {to, signal} (SDP / ICE passthrough)

Server → client:
- `message:new` {message}
- `message:reaction` {messageId, emoji, userId, action: added|removed}
- `typing:update` {roomId, userId, isTyping}
- `presence:update` {roomId, onlineUserIds: [userId]}
- `read:update` {messageId, userId}
- `video:peer-joined` {userId, socketId}, `video:peer-left` {socketId}
- `video:signal` {from, signal}
- `red:carpet` {king, queen, weekStart}
- `user:rank-up` {userId, level, tier}
- `gift:received` {gift}

Rooms on socket: `room:<roomId>`.
