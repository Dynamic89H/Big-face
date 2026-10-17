-- XP engagement system: streaks, multipliers, time-period leaderboards, milestones
-- 041_xp_engagement.sql

-- Ledger of every XP award — powers streaks, period leaderboards, first-win-of-day
CREATE TABLE IF NOT EXISTS xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_time ON xp_ledger (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_time ON xp_ledger (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_reason_time ON xp_ledger (reason, created_at DESC);
-- Composite index for rate-limit queries (e.g. message XP per hour)
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_reason_time ON xp_ledger (user_id, reason, created_at DESC);

-- Backfill ledger from existing user XP totals (one row per user, reason 'legacy')
-- Idempotent: skips users who already have a legacy backfill row
INSERT INTO xp_ledger (user_id, amount, reason, created_at)
SELECT u.id, u.xp, 'legacy', u.created_at
FROM users u
WHERE u.xp > 0
  AND NOT EXISTS (
    SELECT 1 FROM xp_ledger l WHERE l.user_id = u.id AND l.reason = 'legacy'
  );

-- Active XP multipliers (Double XP Weekend, Happy Hour, etc.)
CREATE TABLE IF NOT EXISTS xp_multipliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  multiplier NUMERIC NOT NULL DEFAULT 2.0 CHECK (multiplier > 0),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_xp_multipliers_active ON xp_multipliers (starts_at, ends_at);

-- Seed a Double XP Weekend (next upcoming weekend)
INSERT INTO xp_multipliers (name, description, multiplier, starts_at, ends_at)
SELECT
  'Double XP Weekend',
  'Earn 2x XP on everything all weekend!',
  2.0,
  date_trunc('week', now() + interval '7 days') + interval '5 days',  -- next Friday 00:00
  date_trunc('week', now() + interval '7 days') + interval '7 days'   -- next Sunday 24:00
WHERE NOT EXISTS (SELECT 1 FROM xp_multipliers WHERE name = 'Double XP Weekend');

-- Milestones claimed by users
CREATE TABLE IF NOT EXISTS user_xp_milestones (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  milestone_xp INTEGER NOT NULL,
  hit_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, milestone_xp)
);

-- Streak columns on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS best_xp_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_xp_date DATE;
