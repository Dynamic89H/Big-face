-- Realistic rides & cribs: named vehicles, mansions, and full customization.
-- Customization options for cars: rims, paint, interior, extras.

-- Add customization columns to user assets.
ALTER TABLE user_lifestyle_assets ADD COLUMN IF NOT EXISTS custom_paint TEXT;
ALTER TABLE user_lifestyle_assets ADD COLUMN IF NOT EXISTS custom_rims TEXT;
ALTER TABLE user_lifestyle_assets ADD COLUMN IF NOT EXISTS custom_interior TEXT;
ALTER TABLE user_lifestyle_assets ADD COLUMN IF NOT EXISTS custom_extras JSONB NOT NULL DEFAULT '[]';

-- Realistic vehicles: classics, muscle, luxury, exotics.
INSERT INTO lifestyle_assets (kind, name, rarity, min_level, token_price, style) VALUES
-- CLASSICS
('car', '1972 Chevy Chevelle SS', 'rare', 3, 1000, '{"type":"classic_muscle","make":"chevy","model":"chevelle","year":1972,"color":"#1a1a2e","body":"coupe"}'),
('car', '1969 Chevy Camaro Z28', 'epic', 5, 3000, '{"type":"classic_muscle","make":"chevy","model":"camaro","year":1969,"color":"#c1121f","body":"coupe"}'),
('car', '1967 Chevy Impala', 'epic', 4, 2200, '{"type":"classic","make":"chevy","model":"impala","year":1967,"color":"#2b2d42","body":"sedan"}'),
-- MODERN MUSCLE
('car', 'Ford Mustang GT500', 'epic', 6, 5500, '{"type":"muscle","make":"ford","model":"mustang","color":"#0f3460","body":"coupe","horsepower":760}'),
('car', 'Chevy Corvette Z06', 'epic', 7, 7000, '{"type":"supercar","make":"chevy","model":"corvette","color":"#ffd93d","body":"coupe","horsepower":670}'),
-- LUXURY
('car', 'Audi RS7 Sportback', 'epic', 6, 6000, '{"type":"luxury","make":"audi","model":"rs7","color":"#1a1a1a","body":"sportback","horsepower":621}'),
('car', 'Rolls Royce Phantom', 'legendary', 9, 20000, '{"type":"ultra_luxury","make":"rollsroyce","model":"phantom","color":"#0a0a0a","body":"sedan","horsepower":563,"starlight":true}'),
('car', 'Rolls Royce Cullinan', 'legendary', 8, 18000, '{"type":"ultra_luxury","make":"rollsroyce","model":"cullinan","color":"#2b2d42","body":"suv","horsepower":563}'),
-- EXOTICS
('car', 'Lamborghini Huracán EVO', 'legendary', 8, 15000, '{"type":"exotic","make":"lamborghini","model":"huracan","color":"#ff6b35","body":"coupe","horsepower":631}'),
('car', 'Lamborghini Urus', 'legendary', 7, 12000, '{"type":"exotic","make":"lamborghini","model":"urus","color":"#ffd93d","body":"suv","horsepower":657}'),
('car', 'Ferrari 488 GTB', 'legendary', 9, 18000, '{"type":"exotic","make":"ferrari","model":"488","color":"#c1121f","body":"coupe","horsepower":661}'),
('car', 'Ferrari SF90 Stradale', 'legendary', 10, 30000, '{"type":"hypercar","make":"ferrari","model":"sf90","color":"#c1121f","body":"coupe","horsepower":986,"shimmer":true}')
ON CONFLICT DO NOTHING;

-- Realistic mansions & estates.
INSERT INTO lifestyle_assets (kind, name, rarity, min_level, token_price, style) VALUES
('house', 'Modern Glass Mansion', 'epic', 7, 12000, '{"type":"modern_mansion","style":"glass","floors":3,"pool":true,"color":"#e8e8e8"}'),
('house', 'Mediterranean Villa Estate', 'epic', 6, 8000, '{"type":"villa","style":"mediterranean","floors":2,"pool":true,"color":"#f5e6c8"}'),
('house', 'Luxury Penthouse Suite', 'legendary', 8, 18000, '{"type":"penthouse","style":"modern","floors":1,"color":"#3b3b4d","skyline":true}'),
('house', 'Colonial Grand Estate', 'legendary', 9, 25000, '{"type":"estate","style":"colonial","floors":3,"pool":true,"gates":true,"color":"#ffffff"}'),
('house', 'Ultra-Modern Smart Mansion', 'legendary', 10, 40000, '{"type":"mansion","style":"futuristic","floors":4,"pool":true,"gates":true,"helipad":true,"color":"#0a0a0a","shimmer":true}')
ON CONFLICT DO NOTHING;

-- Custom shop catalog: rims, paint, interior.
CREATE TABLE IF NOT EXISTS custom_shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('rims','paint','interior','extra')),
  name TEXT NOT NULL,
  token_price INTEGER NOT NULL DEFAULT 0,
  min_level INTEGER NOT NULL DEFAULT 1,
  style JSONB NOT NULL DEFAULT '{}'
);

INSERT INTO custom_shop_items (category, name, token_price, min_level, style) VALUES
-- RIMS
('rims', 'Platinum 24" Forged', 800, 4, '{"finish":"platinum","size":24,"shine":true}'),
('rims', 'Spinning DUB Floaters', 1200, 5, '{"finish":"chrome","spinning":true,"size":26}'),
('rims', 'Blackout Matte 22"', 500, 3, '{"finish":"matte_black","size":22}'),
('rims', 'Gold Daytons with Spokes', 1500, 6, '{"finish":"gold","spokes":true,"size":24,"shine":true}'),
('rims', 'Diamond-Cut Chrome 26"', 2000, 7, '{"finish":"diamond_chrome","size":26,"shine":true}'),
-- PAINT
('paint', 'Midnight Black Metallic', 300, 2, '{"color":"#0a0a0a","finish":"metallic"}'),
('paint', 'Candy Apple Red', 500, 3, '{"color":"#c1121f","finish":"candy"}'),
('paint', 'Chameleon Color-Shift', 1200, 6, '{"color":"#4a00e0","finish":"chameleon","shimmer":true}'),
('paint', 'Matte Military Green', 400, 3, '{"color":"#3a4a3a","finish":"matte"}'),
('paint', 'Pearl White Tri-Coat', 600, 4, '{"color":"#f8f8ff","finish":"pearl","shine":true}'),
-- INTERIOR
('interior', 'Red Leather Sport', 700, 4, '{"material":"leather","color":"#c1121f","style":"sport"}'),
('interior', 'Cream Quilted Luxury', 1000, 5, '{"material":"leather","color":"#f5e6c8","style":"quilted"}'),
('interior', 'Black Suede Racing', 600, 3, '{"material":"suede","color":"#1a1a1a","style":"racing"}'),
('interior', 'White & Gold Royal', 1800, 7, '{"material":"leather","color":"#ffffff","accent":"#c9a227","style":"royal","shimmer":true}'),
-- EXTRAS
('extra', 'Underglow Neon Kit', 400, 3, '{"type":"underglow","color":"#00ffff"}'),
('extra', 'Panoramic Sunroof', 800, 4, '{"type":"sunroof"}'),
('extra', 'Bulletproof Windows', 1500, 6, '{"type":"armor"}'),
('extra', 'Hydraulic Suspension', 900, 5, '{"type":"hydraulics"}')
ON CONFLICT DO NOTHING;
