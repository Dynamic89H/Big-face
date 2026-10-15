-- Referral system: users invite friends, both earn rewards.
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

-- Backfill referral codes for existing users.
UPDATE users SET referral_code = upper(substring(md5(random()::text) from 1 for 8))
WHERE referral_code IS NULL;
