-- Engagement engine: spin wheel, win feed, crew battles
CREATE TABLE IF NOT EXISTS daily_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spun_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  prize_tokens INTEGER NOT NULL,
  streak INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_spins_user ON daily_spins(user_id, spun_at DESC);

CREATE TABLE IF NOT EXISTS win_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, -- 'gamble' | 'battle' | 'spin' | 'crew_battle'
  amount_tokens INTEGER NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_feed_time ON win_feed(created_at DESC);

CREATE TABLE IF NOT EXISTS crew_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  defender_crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | active | finished
  challenger_score INTEGER NOT NULL DEFAULT 0,
  defender_score INTEGER NOT NULL DEFAULT 0,
  winner_crew_id UUID REFERENCES crews(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '24 hours'
);
CREATE INDEX IF NOT EXISTS idx_cb_status ON crew_battles(status, ends_at);
