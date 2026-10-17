-- Engagement wave 2: streak freezes, comeback tracking, trophies, user-scoped multipliers
-- 043_engagement_wave2.sql (idempotent)

-- Streak freeze inventory: protects the XP streak for one missed day (auto-consumed)
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INTEGER NOT NULL DEFAULT 1;

-- Log of consumed streak freezes (one row per frozen day)
CREATE TABLE IF NOT EXISTS streak_freeze_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  frozen_date DATE NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, frozen_date)
);
CREATE INDEX IF NOT EXISTS idx_freeze_uses_user ON streak_freeze_uses (user_id, used_at DESC);

-- Last login for comeback detection (7+ days absent => welcome-back package)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Tournament trophies: incremented when a user wins a tournament
ALTER TABLE users ADD COLUMN IF NOT EXISTS trophies INTEGER NOT NULL DEFAULT 0;

-- User-scoped XP multipliers (e.g. the 24h "Welcome Back" 2x boost)
ALTER TABLE xp_multipliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_xp_multipliers_user ON xp_multipliers (user_id);

-- Idempotency for level-up token rewards (one payout per level)
CREATE TABLE IF NOT EXISTS level_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  tokens_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, level)
);

-- Backfill last_login_at from updated_at for existing users
UPDATE users SET last_login_at = updated_at WHERE last_login_at IS NULL;
