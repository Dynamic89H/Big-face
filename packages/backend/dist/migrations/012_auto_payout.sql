-- Auto-payout preferences: money hits the account automatically.
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_payout_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_payout_threshold_cents INTEGER NOT NULL DEFAULT 5000;
