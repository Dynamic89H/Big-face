-- Gamble Face: dice betting between real players.
CREATE TABLE IF NOT EXISTS dice_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  bet_tokens INTEGER NOT NULL CHECK (bet_tokens >= 100),
  status TEXT NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting','rolling','finished','cancelled')),
  host_roll INTEGER CHECK (host_roll BETWEEN 1 AND 6),
  opponent_roll INTEGER CHECK (opponent_roll BETWEEN 1 AND 6),
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pot_tokens INTEGER NOT NULL DEFAULT 0,
  platform_cut INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_dice_games_status ON dice_games(status);
