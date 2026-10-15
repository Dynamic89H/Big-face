-- Live gift battles: two battlers go head-to-head, spectators shower gifts, winner takes glory.
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenger_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting','live','ended')),
  title TEXT NOT NULL DEFAULT 'Epic Battle',
  started_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS battle_scores (
  battle_id UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  battler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gift_tokens INTEGER NOT NULL DEFAULT 0,
  gift_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (battle_id, battler_id)
);

CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);
CREATE INDEX IF NOT EXISTS idx_battles_host ON battles(host_id);
