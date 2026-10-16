-- Seasons super engine: time-limited seasons with exclusive rewards
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  theme TEXT NOT NULL, -- e.g. 'neon_nights', 'gold_rush'
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming | active | ended
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seasons_status ON seasons(status, starts_at);

-- Season XP tracking (separate from lifetime XP)
CREATE TABLE IF NOT EXISTS season_xp (
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (season_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_season_xp_leader ON season_xp(season_id, xp DESC);

-- Season rewards (exclusive gifts, badges, tokens)
CREATE TABLE IF NOT EXISTS season_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  rank_required INTEGER NOT NULL, -- top N players earn this
  reward_type TEXT NOT NULL, -- 'tokens' | 'gift' | 'badge'
  reward_value TEXT NOT NULL,
  label TEXT NOT NULL
);

-- Season gift catalog (rotating gifts per season)
CREATE TABLE IF NOT EXISTS season_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  gift_key TEXT NOT NULL,
  gift_label TEXT NOT NULL,
  token_cost INTEGER NOT NULL,
  emoji TEXT NOT NULL,
  limited BOOLEAN NOT NULL DEFAULT true
);
