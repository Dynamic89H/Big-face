-- Daily login streaks.
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_date DATE;
