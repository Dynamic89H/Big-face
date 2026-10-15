-- Artist spotlight: musicians drop tracks, fans tip them.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_artist BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS artist_name TEXT;

CREATE TABLE IF NOT EXISTS artist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT NOT NULL DEFAULT 'hip-hop',
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  plays INTEGER NOT NULL DEFAULT 0,
  tips_tokens INTEGER NOT NULL DEFAULT 0,
  tip_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON artist_tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_tips ON artist_tracks(tips_tokens DESC);
