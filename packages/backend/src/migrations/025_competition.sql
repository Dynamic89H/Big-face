-- Tournaments: weekly competitive events with token prize pools
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'dice' | 'battle' | 'crew'
  entry_fee INTEGER NOT NULL,
  prize_pool INTEGER NOT NULL DEFAULT 0,
  max_players INTEGER NOT NULL DEFAULT 32,
  status TEXT NOT NULL DEFAULT 'open', -- open | running | finished
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status, starts_at);

CREATE TABLE IF NOT EXISTS tournament_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_tentries_tournament ON tournament_entries(tournament_id, score DESC);

-- Throne: weekly king/queen competition
CREATE TABLE IF NOT EXISTS throne_reigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 'king' | 'queen'
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
  votes INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_throne_active ON throne_reigns(ends_at) WHERE ends_at > now();

CREATE TABLE IF NOT EXISTS throne_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reign_id UUID NOT NULL REFERENCES throne_reigns(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reign_id, voter_id)
);

-- Hall of fame: permanent legends
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement TEXT NOT NULL,
  detail TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hof_user ON hall_of_fame(user_id);

-- Shoutouts: paid profile promotion
CREATE TABLE IF NOT EXISTS shoutouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  cost INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '1 hour',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shoutouts_active ON shoutouts(ends_at) WHERE ends_at > now();

-- Predictions: bet on live events
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open | locked | resolved
  winning_option INTEGER,
  resolves_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prediction_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pbets_prediction ON prediction_bets(prediction_id);
