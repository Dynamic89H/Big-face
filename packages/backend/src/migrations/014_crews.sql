-- Crews: squads that compete together.
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL UNIQUE CHECK (tag ~ '^[A-Z0-9]{2,6}$'),
  description TEXT NOT NULL DEFAULT '',
  leader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  color TEXT NOT NULL DEFAULT '#0066FF',
  total_xp INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crew_members (
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader','officer','member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (crew_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_crew_members_user ON crew_members(user_id);

CREATE TABLE IF NOT EXISTS crew_wars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  defender_crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','live','ended')),
  challenger_score INTEGER NOT NULL DEFAULT 0,
  defender_score INTEGER NOT NULL DEFAULT 0,
  winner_crew_id UUID REFERENCES crews(id) ON DELETE SET NULL,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
