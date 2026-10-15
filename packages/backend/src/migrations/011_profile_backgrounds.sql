-- Custom profile backgrounds.
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_background TEXT NOT NULL DEFAULT 'default';
