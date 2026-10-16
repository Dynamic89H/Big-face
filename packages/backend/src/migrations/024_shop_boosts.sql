CREATE TABLE IF NOT EXISTS user_boosts (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boost_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, boost_id)
);
CREATE INDEX IF NOT EXISTS idx_boosts_expiry ON user_boosts(expires_at);
