-- Level-up rewards ledger: track token payouts for ranking up.
CREATE TABLE IF NOT EXISTS level_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  tokens_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, level)
);
CREATE INDEX IF NOT EXISTS idx_level_rewards_user ON level_rewards(user_id);
