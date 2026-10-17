-- Engagement engine tables: daily challenge progress + user records (high scores).
-- Idempotent: safe to re-run.

-- Tracks each user's daily-challenge progress. One row per user per day per challenge key.
CREATE TABLE IF NOT EXISTS daily_challenge_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  challenge_key TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  claimed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, challenge_date, challenge_key)
);
CREATE INDEX IF NOT EXISTS idx_dcp_user_date ON daily_challenge_progress (user_id, challenge_date);

-- All-time user records (high scores). One row per user, updated when beaten.
CREATE TABLE IF NOT EXISTS user_records (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  best_solo_payout INTEGER NOT NULL DEFAULT 0,
  best_solo_bet INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
