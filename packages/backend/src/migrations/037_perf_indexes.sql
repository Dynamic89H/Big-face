-- Performance indexes for hot query paths
CREATE INDEX IF NOT EXISTS idx_users_level_xp ON users (level DESC, xp DESC);
CREATE INDEX IF NOT EXISTS idx_crew_wars_status_crews ON crew_wars (status, challenger_crew_id, defender_crew_id);
CREATE INDEX IF NOT EXISTS idx_token_tx_user_kind ON token_transactions (user_id, kind);
CREATE INDEX IF NOT EXISTS idx_season_challenges_lookup ON season_challenges (season_id, action);
