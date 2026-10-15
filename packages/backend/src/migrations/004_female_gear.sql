-- Female avatar gear: hairstyles, outfits, shoes
INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
-- Hairstyles
('hair', 'Natural Afro', 'common', 1, 0, '{"color":"#1a1a1a","length":"medium","style":"afro"}'),
('hair', 'Sleek Bob', 'common', 1, 0, '{"color":"#0e0e0e","length":"medium","style":"bob"}'),
('hair', 'Goddess Locs', 'rare', 3, 50, '{"color":"#2b1c10","length":"long","style":"locs"}'),
('hair', 'Pixie Cut', 'common', 1, 0, '{"color":"#1a1a1a","length":"short","style":"pixie"}'),
('hair', 'Long Braids Deluxe', 'epic', 5, 150, '{"color":"#3a2a18","length":"long","style":"braids","beads":true}'),
('hair', 'Silk Press', 'rare', 2, 30, '{"color":"#0e0e0e","length":"long","style":"straight"}'),
-- Tops & dresses
('top', 'Pink Crop Top', 'common', 1, 0, '{"color":"#ff6b9d"}'),
('top', 'White Blazer', 'rare', 3, 60, '{"color":"#f5f5f5"}'),
('top', 'Red Evening Gown', 'legendary', 8, 500, '{"color":"#cc1122","shimmer":true}'),
('top', 'Yellow Summer Dress', 'common', 1, 20, '{"color":"#ffd93d"}'),
('top', 'Boho Chic Top', 'rare', 2, 40, '{"color":"#c98a5e"}'),
('top', 'Graphic Tee', 'common', 1, 0, '{"color":"#ffffff"}'),
-- Bottoms
('bottom', 'Denim Jeans', 'common', 1, 0, '{"color":"#3b5bdb"}'),
('bottom', 'Tailored Pants', 'rare', 3, 50, '{"color":"#1a1a1a"}'),
('bottom', 'Flowing Skirt', 'rare', 2, 40, '{"color":"#c98a5e"}'),
('bottom', 'Ripped Jeans', 'common', 1, 15, '{"color":"#4a6fa5"}'),
-- Shoes
('shoes', 'White Heels', 'rare', 3, 60, '{"color":"#f5f5f5","style":"heels"}'),
('shoes', 'Strappy Sandals', 'common', 1, 20, '{"color":"#c98a5e","style":"sandals"}'),
('shoes', 'Fresh Sneakers', 'common', 1, 0, '{"color":"#ffffff"}'),
-- Accessories
('earring', 'Gold Hoops', 'common', 1, 25, '{"metal":"gold","style":"hoops"}'),
('earring', 'Diamond Studs', 'epic', 5, 200, '{"metal":"platinum","style":"studs","shimmer":true}'),
('chain', 'Layered Necklaces', 'rare', 3, 80, '{"metal":"gold","style":"layered"}'),
('chain', 'Diamond Necklace', 'legendary', 8, 600, '{"metal":"platinum","shimmer":true}')
ON CONFLICT DO NOTHING;
