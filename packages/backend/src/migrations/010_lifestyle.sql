-- Lifestyle system: luxury watches (wearable) + houses & cars (showcase assets).

-- Allow 'watch' as a wearable gear slot.
ALTER TABLE avatar_items DROP CONSTRAINT IF EXISTS avatar_items_slot_check;
ALTER TABLE avatar_items ADD CONSTRAINT avatar_items_slot_check
  CHECK (slot IN ('hair','top','bottom','shoes','chain','ring','earring','grill','hat','watch'));

-- Luxury watches.
INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
('watch', 'Classic Steel Watch', 'common', 1, 50, '{"metal":"steel","style":"classic"}'),
('watch', 'Gold Dress Watch', 'rare', 3, 200, '{"metal":"gold","style":"dress"}'),
('watch', 'Submariner Style Diver', 'epic', 5, 450, '{"metal":"steel","style":"diver","bezel":"black"}'),
('watch', 'Day-Date Gold President', 'legendary', 8, 1200, '{"metal":"gold","style":"president","shimmer":true}'),
('watch', 'Iced Out Bust Down', 'legendary', 9, 2000, '{"metal":"gold","iced":true,"shimmer":true,"style":"bustdown"}'),
('watch', 'Rose Gold Chrono', 'epic', 6, 600, '{"metal":"rosegold","style":"chrono","shimmer":true}');

-- Houses & cars: ownable lifestyle assets shown off on your profile.
CREATE TABLE IF NOT EXISTS lifestyle_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('house','car')),
  name TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common','rare','epic','legendary')),
  min_level INTEGER NOT NULL DEFAULT 1,
  token_price INTEGER NOT NULL DEFAULT 0,
  style JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_lifestyle_assets (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES lifestyle_assets(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);

INSERT INTO lifestyle_assets (kind, name, rarity, min_level, token_price, style) VALUES
-- HOUSES: from starter pad to private island
('house', 'Cozy Studio Apartment', 'common', 1, 100, '{"type":"apartment","color":"#8b9bb4"}'),
('house', 'Suburban Family Home', 'common', 2, 500, '{"type":"house","color":"#c98a5e"}'),
('house', 'Modern Loft Downtown', 'rare', 4, 1500, '{"type":"loft","color":"#3b3b4d"}'),
('house', 'Beachfront Villa', 'epic', 6, 5000, '{"type":"villa","color":"#f5e6c8","pool":true}'),
('house', 'Hillside Mansion', 'legendary', 8, 15000, '{"type":"mansion","color":"#ffffff","pool":true,"gates":true}'),
('house', 'Private Island Estate', 'legendary', 10, 50000, '{"type":"island","color":"#2e8b57","pool":true,"gates":true,"helipad":true}'),
-- CARS: from daily driver to hypercar
('car', 'Reliable Sedan', 'common', 1, 150, '{"type":"sedan","color":"#5a6c7d"}'),
('car', 'Sporty Coupe', 'rare', 3, 800, '{"type":"coupe","color":"#c1121f"}'),
('car', 'Luxury SUV Black', 'rare', 4, 1200, '{"type":"suv","color":"#1a1a1a"}'),
('car', 'Classic Muscle Car', 'epic', 5, 2500, '{"type":"muscle","color":"#ff6b35"}'),
('car', 'Italian Supercar', 'epic', 7, 8000, '{"type":"supercar","color":"#ffd93d"}'),
('car', 'Hypercar One-of-One', 'legendary', 9, 25000, '{"type":"hypercar","color":"#0a0a0a","shimmer":true}');
