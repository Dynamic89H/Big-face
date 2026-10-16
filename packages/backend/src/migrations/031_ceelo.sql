-- Cee-lo Match Mode: 3-dice street dice vs AI characters.
-- One match = multiple rounds. Banker rotates on 4-5-6 or trips.

CREATE TABLE IF NOT EXISTS ceelo_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- AI opponents in this match (character keys: boss, diva, dread, enforcer)
  opponents TEXT[] NOT NULL DEFAULT '{}',
  -- Current banker: 'player' or character key
  banker TEXT NOT NULL DEFAULT 'player',
  -- Token stacks: JSON { player: 1000, boss: 1000, ... }
  stacks JSONB NOT NULL DEFAULT '{}',
  -- Round number
  round INTEGER NOT NULL DEFAULT 1,
  -- Match status
  status TEXT NOT NULL DEFAULT 'betting'
    CHECK (status IN ('betting','rolling','settling','finished')),
  -- Player's corner-man ability pick for this match
  player_ability TEXT,
  -- Abilities used this match: JSON { boss: false, diva: false, ... }
  abilities_used JSONB NOT NULL DEFAULT '{}',
  -- Win streak / heater level
  heater INTEGER NOT NULL DEFAULT 0,
  -- Dead-roll heat meter (consecutive dead rolls this round)
  heat INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ceelo_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES ceelo_matches(id) ON DELETE CASCADE,
  round_num INTEGER NOT NULL,
  banker TEXT NOT NULL,
  -- Bets: JSON { player: 100, boss: 100, ... }
  bets JSONB NOT NULL DEFAULT '{}',
  -- Rolls: JSON { player: [1,2,3], boss: [4,5,6], ... }
  rolls JSONB NOT NULL DEFAULT '{}',
  -- Evaluated hands: JSON { player: { type: 'point', value: 5 }, ... }
  hands JSONB NOT NULL DEFAULT '{}',
  -- Pot total for this round
  pot INTEGER NOT NULL DEFAULT 0,
  -- Winner of the round ('player', character key, or 'push')
  winner TEXT,
  -- New banker after this round
  new_banker TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ceelo_matches_player ON ceelo_matches(player_id);
CREATE INDEX IF NOT EXISTS idx_ceelo_rounds_match ON ceelo_rounds(match_id);

-- Rivalry tracking: head-to-head vs each AI character
CREATE TABLE IF NOT EXISTS ceelo_rivalries (
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_key TEXT NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  is_rival BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (player_id, character_key)
);
