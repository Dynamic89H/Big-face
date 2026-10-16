-- Creator fund: weekly token pool for top creators
CREATE TABLE IF NOT EXISTS creator_fund_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL UNIQUE,
  total_pool INTEGER NOT NULL DEFAULT 0,
  distributed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL REFERENCES creator_fund_weeks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0, -- engagement points
  share_tokens INTEGER, -- calculated at distribution
  UNIQUE(week_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_ce_week ON creator_earnings(week_id, points DESC);

-- Watch parties: synced media rooms
CREATE TABLE IF NOT EXISTS watch_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'video', -- video | music
  status TEXT NOT NULL DEFAULT 'lobby', -- lobby | playing | paused | ended
  playback_position FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS watch_party_members (
  party_id UUID NOT NULL REFERENCES watch_parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (party_id, user_id)
);

-- Crew heists: cooperative crew challenges
CREATE TABLE IF NOT EXISTS heists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  target_name TEXT NOT NULL, -- e.g. "The Diamond Vault"
  target_value INTEGER NOT NULL, -- token prize
  required_members INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'planning', -- planning | active | success | failed
  progress INTEGER NOT NULL DEFAULT 0, -- 0-100
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '1 hour',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_heists_crew ON heists(crew_id, status);

CREATE TABLE IF NOT EXISTS heist_participants (
  heist_id UUID NOT NULL REFERENCES heists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contribution INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (heist_id, user_id)
);
