-- Push notification subscriptions.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);

-- User's preferred language for notifications.
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_lang TEXT NOT NULL DEFAULT 'en';
