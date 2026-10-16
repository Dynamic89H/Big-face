-- The Vault: community jackpot that grows with every action
CREATE TABLE IF NOT EXISTS vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  balance INTEGER NOT NULL DEFAULT 0,
  week_start DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vault_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID NOT NULL REFERENCES vault(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'bet' | 'spin' | 'gift' | 'shop' | 'shoutout'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vault_contrib ON vault_contributions(vault_id, user_id);

CREATE TABLE IF NOT EXISTS vault_entries (
  vault_id UUID NOT NULL REFERENCES vault(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tickets INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (vault_id, user_id)
);

CREATE TABLE IF NOT EXISTS vault_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID NOT NULL REFERENCES vault(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  won_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
