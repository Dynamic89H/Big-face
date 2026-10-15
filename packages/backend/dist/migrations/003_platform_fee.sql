-- ============================ PLATFORM REVENUE SHARE ============================
-- Tracks the 30% platform cut from creator payouts.

CREATE TABLE platform_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gross_cents INTEGER NOT NULL CHECK (gross_cents > 0),
  platform_cents INTEGER NOT NULL CHECK (platform_cents >= 0),
  creator_cents INTEGER NOT NULL CHECK (creator_cents > 0),
  paypal_batch_id TEXT,
  paypal_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (paypal_status IN ('pending','sent','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_platform_earnings_pending ON platform_earnings(paypal_status) WHERE paypal_status = 'pending';
