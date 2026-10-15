-- Luxury drip expansion: more outfits, shoes, and jewelry to keep users excited.
INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
-- HAIRSTYLES
('hair', 'Box Braids', 'rare', 2, 45, '{"color":"#1a1a1a","length":"long","style":"boxbraids"}'),
('hair', 'High Ponytail', 'common', 1, 15, '{"color":"#0e0e0e","length":"long","style":"ponytail"}'),
('hair', 'Wavy Bob Deluxe', 'rare', 3, 60, '{"color":"#3a2a18","length":"medium","style":"wavybob"}'),
('hair', 'Cornrows', 'common', 1, 0, '{"color":"#111111","length":"short","style":"cornrows"}'),
('hair', 'Blonde Bombshell', 'epic', 5, 250, '{"color":"#e8c468","length":"long","style":"waves","shimmer":true}'),
('hair', 'Red Velvet Waves', 'epic', 5, 250, '{"color":"#a31212","length":"long","style":"waves","shimmer":true}'),
('hair', 'Silver Fox Dreads', 'legendary', 8, 600, '{"color":"#c0c0c0","length":"long","style":"dreads","shimmer":true}'),
('hair', 'Buzz Cut Sharp', 'common', 1, 0, '{"color":"#0a0a0a","length":"short","style":"buzz"}'),
-- TOPS / OUTFITS
('top', 'Black Leather Jacket', 'rare', 3, 120, '{"color":"#1a1a1a","material":"leather"}'),
('top', 'Royal Velvet Blazer', 'epic', 6, 400, '{"color":"#4a0e4e","material":"velvet","shimmer":true}'),
('top', 'Silk Blouse Ivory', 'rare', 3, 100, '{"color":"#fffef5","material":"silk"}'),
('top', 'Off-Shoulder Glam Top', 'rare', 2, 70, '{"color":"#ff2e63"}'),
('top', 'Denim Trucker Jacket', 'common', 1, 25, '{"color":"#3b5bdb","material":"denim"}'),
('top', 'Faux Fur Coat', 'epic', 5, 350, '{"color":"#8b5a2b","material":"fur"}'),
('top', 'Designer Monogram Tee', 'rare', 4, 150, '{"color":"#2b1c10","pattern":"monogram"}'),
('top', 'Neon Street Hoodie', 'rare', 2, 80, '{"color":"#39ff14"}'),
('top', 'Gold Sequin Top', 'legendary', 7, 700, '{"color":"#c9a227","shimmer":true,"material":"sequin"}'),
('top', 'White Tuxedo Jacket', 'epic', 6, 450, '{"color":"#ffffff","formal":true}'),
-- BOTTOMS
('bottom', 'Black Leather Pants', 'rare', 3, 120, '{"color":"#1a1a1a","material":"leather"}'),
('bottom', 'Cargo Pants Tan', 'common', 1, 20, '{"color":"#c2a878"}'),
('bottom', 'Pleated Mini Skirt', 'rare', 2, 60, '{"color":"#ff2e63"}'),
('bottom', 'Palazzo Pants Silk', 'rare', 3, 90, '{"color":"#4a0e4e","material":"silk"}'),
('bottom', 'Basketball Shorts', 'common', 1, 0, '{"color":"#0066FF"}'),
('bottom', 'Designer Skinny Jeans', 'rare', 4, 140, '{"color":"#1e2a4a","pattern":"designer"}'),
('bottom', 'Gold Sequin Skirt', 'legendary', 7, 650, '{"color":"#c9a227","shimmer":true}'),
-- SHOES
('shoes', 'Yeezy Boost Style', 'epic', 5, 400, '{"brand":"yeezy","model":"boost","color":"#8b7355"}'),
('shoes', 'Dunk Low Panda', 'rare', 3, 180, '{"brand":"nike","model":"dunk","color":"#ffffff"}'),
('shoes', 'New Balance 550', 'rare', 2, 120, '{"brand":"newbalance","model":"550","color":"#e8e8e8"}'),
('shoes', 'Red Bottom Heels', 'legendary', 8, 800, '{"color":"#cc1122","style":"heels","shimmer":true,"sole":"red"}'),
('shoes', 'Suede Chelsea Boots', 'rare', 4, 160, '{"color":"#5c3d1e","style":"boots","material":"suede"}'),
('shoes', 'White Loafers Gold', 'epic', 5, 300, '{"color":"#ffffff","style":"loafers","trim":"gold"}'),
('shoes', 'Designer Slides', 'rare', 2, 90, '{"color":"#1a1a1a","style":"slides","pattern":"monogram"}'),
('shoes', 'Iced Out Sneakers', 'legendary', 9, 1200, '{"color":"#ffffff","shimmer":true,"iced":true}'),
-- CHAINS
('chain', 'Tennis Chain Diamond', 'epic', 6, 500, '{"metal":"platinum","iced":true,"shimmer":true}'),
('chain', 'Rope Chain Gold', 'rare', 3, 180, '{"metal":"gold","style":"rope"}'),
('chain', 'Pendant Cross Iced', 'epic', 5, 450, '{"metal":"gold","pendant":"cross","iced":true,"shimmer":true}'),
('chain', 'Pearl Strand', 'rare', 4, 200, '{"metal":"pearl","style":"strand"}'),
('chain', 'Rosary Beads Gold', 'rare', 3, 150, '{"metal":"gold","style":"rosary"}'),
-- RINGS
('ring', 'Championship Ring', 'legendary', 8, 900, '{"metal":"gold","stone":"diamond","shimmer":true,"style":"championship"}'),
('ring', 'Pinky Ring Gold', 'rare', 3, 120, '{"metal":"gold","style":"pinky"}'),
('ring', 'Emerald Royal', 'epic', 6, 400, '{"metal":"gold","stone":"emerald","shimmer":true}'),
('ring', 'Stacked Bands Set', 'rare', 4, 180, '{"metal":"mixed","style":"stacked"}'),
-- EARRINGS
('earring', 'Chandelier Drops', 'epic', 5, 300, '{"metal":"gold","style":"chandelier","shimmer":true}'),
('earring', 'Silver Cuff Set', 'rare', 2, 70, '{"metal":"silver","style":"cuff"}'),
('earring', 'Pearl Drops', 'rare', 3, 110, '{"metal":"pearl","style":"drops"}'),
('earring', 'Iced Hoops XL', 'legendary', 7, 600, '{"metal":"gold","style":"hoops","iced":true,"shimmer":true}'),
-- GRILLS
('grill', 'Diamond Grill Full', 'legendary', 8, 1000, '{"metal":"platinum","iced":true,"shimmer":true}'),
('grill', 'Rose Gold Grill', 'epic', 6, 450, '{"metal":"rosegold","shimmer":true}'),
-- HATS
('hat', 'Designer Bucket Hat', 'rare', 3, 130, '{"color":"#2b1c10","pattern":"monogram"}'),
('hat', 'Silk Durag', 'common', 1, 20, '{"color":"#1a1a1a","material":"silk"}'),
('hat', 'Fedora Classic', 'rare', 4, 140, '{"color":"#3a2a18"}'),
('hat', 'Beanie Cozy', 'common', 1, 15, '{"color":"#0066FF"}'),
('hat', 'Diamond Tiara', 'legendary', 9, 1100, '{"metal":"platinum","iced":true,"shimmer":true}');
