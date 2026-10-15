-- Big Face Factory: in-app creation studio.
-- Stores user-generated assets and inspiration captures.

CREATE TABLE IF NOT EXISTS factory_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('avatar','gear','background','graphic','inspiration')),
  style TEXT NOT NULL DEFAULT 'realistic',
  prompt TEXT NOT NULL,
  image_url TEXT,
  source_url TEXT,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_factory_creator ON factory_assets(creator_id);
CREATE INDEX IF NOT EXISTS idx_factory_kind ON factory_assets(kind);

CREATE TABLE IF NOT EXISTS factory_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES factory_assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);
