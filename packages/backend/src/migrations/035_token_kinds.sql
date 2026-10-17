-- Fix token_transactions CHECK constraint to allow all TokenKind values
-- The TypeScript type was updated but the DB constraint was never migrated
ALTER TABLE token_transactions DROP CONSTRAINT IF EXISTS token_transactions_kind_check;
ALTER TABLE token_transactions ADD CONSTRAINT token_transactions_kind_check CHECK (kind IN (
  'purchase', 'gift_sent', 'gift_received', 'payout', 'bonus',
  'track_tip_sent', 'track_tip_received', 'level_up_reward',
  'dice_bet_escrow', 'dice_win', 'dice_refund',
  'daily_spin', 'vault_jackpot'
));
