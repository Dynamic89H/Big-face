-- Engagement engine tables: leaderboard snapshots + re-engagement tracking
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  rank INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  level INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  token_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (snapshot_date, user_id)
);
CREATE INDEX IF NOT EXISTS idx_lb_snap_date ON leaderboard_snapshots(snapshot_date DESC, rank ASC);

-- Track last re-engagement push so we don't spam inactive users
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reengage_push_at TIMESTAMPTZ;
