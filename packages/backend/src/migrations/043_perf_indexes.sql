-- Performance indexes: hot query paths
-- Composite friendship pair lookup (bidirectional friend checks)
CREATE INDEX IF NOT EXISTS idx_friendships_pair ON friendships (requester_id, addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_pair_rev ON friendships (addressee_id, requester_id);

-- Per-user win feed lookups
CREATE INDEX IF NOT EXISTS idx_win_feed_user ON win_feed (user_id, created_at DESC);

-- Sent gifts lookup (receiver side already indexed)
CREATE INDEX IF NOT EXISTS idx_gifts_sender ON gifts (sender_id, created_at DESC);

-- Message sender lookups (room side already indexed)
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id, created_at DESC);

-- Room member pair lookup
CREATE INDEX IF NOT EXISTS idx_room_members_pair ON room_members (room_id, user_id);

-- Crew member lookups
CREATE INDEX IF NOT EXISTS idx_crew_members_crew ON crew_members (crew_id, user_id);

-- Token balance lookups by kind
CREATE INDEX IF NOT EXISTS idx_token_tx_kind_time ON token_transactions (kind, created_at DESC);
