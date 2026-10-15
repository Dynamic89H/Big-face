-- Platform revenue: Dweezy's cut from EVERY money flow.
-- Sources: token purchases (100% minus Stripe fees), gift margin (20%), tip margin (10%), payout fees (30%).
CREATE TABLE IF NOT EXISTS platform_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('token_purchase','gift_margin','tip_margin','payout_fee','battle_gift_margin')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reference TEXT,
  gross_cents INTEGER NOT NULL CHECK (gross_cents >= 0),
  platform_cents INTEGER NOT NULL CHECK (platform_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_source ON platform_revenue(source);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_created ON platform_revenue(created_at);
