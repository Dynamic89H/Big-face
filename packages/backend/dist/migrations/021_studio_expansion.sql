-- Avatar Studio mega-expansion: full wardrobe, kicks, and jewelry.

INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
-- HAIR: more styles
('hair','Box Braids','rare',2,60,'{"color":"#1a1a1a","length":"long"}'),
('hair','High Top Fade','common',1,0,'{"color":"#111111","length":"short"}'),
('hair','Silk Press Bob','rare',3,70,'{"color":"#2b1c10","length":"medium"}'),
('hair','Blonde Buzz','common',1,20,'{"color":"#d4a017","length":"short"}'),
('hair','Red Locs','epic',5,250,'{"color":"#8b2500","length":"long"}'),
('hair','Platinum Waves','epic',6,300,'{"color":"#e8e8e8","length":"medium","shimmer":true}'),
('hair','Rainbow Braids','legendary',8,600,'{"color":"#ff2fd6","length":"long","shimmer":true}'),
-- TOPS: full wardrobe
('top','White Tee Classic','common',1,0,'{"color":"#f5f5f5"}'),
('top','Black Hoodie','common',1,30,'{"color":"#1a1a1a"}'),
('top','Designer Denim Jacket','rare',3,100,'{"color":"#2c4a6b"}'),
('top','Leather Biker Jacket','epic',5,280,'{"color":"#2b1c10"}'),
('top','Silk Button-Up','rare',4,120,'{"color":"#f5e6c8"}'),
('top','Velvet Blazer','epic',6,350,'{"color":"#4a00e0"}'),
('top','Diamond-Encrusted Suit','legendary',9,1200,'{"color":"#1a1a1a","shimmer":true}'),
('top','Neon Street Jersey','rare',3,90,'{"color":"#00f0ff"}'),
('top','Camo Cargo Jacket','common',2,40,'{"color":"#3a4a3a"}'),
-- BOTTOMS: full wardrobe
('bottom','Black Jeans','common',1,0,'{"color":"#1a1a1a"}'),
('bottom','Ripped Skinny Jeans','rare',2,50,'{"color":"#2c3e50"}'),
('bottom','Cargo Pants','common',2,35,'{"color":"#4a4a3a"}'),
('bottom','Leather Pants','epic',5,220,'{"color":"#1a1a1a"}'),
('bottom','Silk Wide-Leg','rare',4,110,'{"color":"#f5e6c8"}'),
('bottom','Diamond-Studded Jeans','legendary',8,700,'{"color":"#23262e","shimmer":true}'),
('bottom','Neon Track Pants','rare',3,80,'{"color":"#00f0ff"}'),
-- SHOES: full kick collection
('shoes','Classic White Sneakers','common',1,0,'{"color":"#ffffff"}'),
('shoes','Black High-Tops','common',1,40,'{"color":"#1a1a1a"}'),
('shoes','Red Bottom Heels','epic',5,400,'{"color":"#c1121f"}'),
('shoes','Designer Loafers','rare',4,180,'{"color":"#2b1c10"}'),
('shoes','Neon Runners','rare',3,150,'{"color":"#00f0ff"}'),
('shoes','Gold-Plated Sneakers','legendary',8,900,'{"color":"#c9a227","shimmer":true}'),
('shoes','Iced-Out Boots','legendary',9,1100,'{"color":"#1a1a1a","shimmer":true,"iced":true}'),
('shoes','Velvet Slippers','epic',6,320,'{"color":"#4a00e0"}'),
-- CHAINS: full jewelry box
('chain','Silver Rope','common',1,30,'{"metal":"silver"}'),
('chain','Rose Gold Cuban','rare',4,200,'{"metal":"rosegold","shimmer":true}'),
('chain','Tennis Chain','epic',6,500,'{"metal":"silver","iced":true,"shimmer":true}'),
('chain','Cross Pendant','rare',3,160,'{"metal":"gold"}'),
('chain','Lion Medallion','legendary',8,1000,'{"metal":"gold","medallion":"lion","iced":true,"shimmer":true}'),
('chain','Crown Pendant','legendary',9,1300,'{"metal":"gold","medallion":"crown","iced":true,"shimmer":true}'),
-- RINGS
('ring','Silver Band','common',1,20,'{"metal":"silver"}'),
('ring','Gold Signet','rare',3,140,'{"metal":"gold"}'),
('ring','Diamond Solitaire','epic',6,450,'{"metal":"gold","iced":true,"shimmer":true}'),
('ring','Championship Ring','legendary',9,1200,'{"metal":"gold","iced":true,"shimmer":true}'),
-- EARRINGS
('earring','Gold Studs','common',1,25,'{"metal":"gold"}'),
('earring','Diamond Studs','epic',5,350,'{"metal":"silver","iced":true,"shimmer":true}'),
('earring','Hoop Earrings','rare',2,60,'{"metal":"gold"}'),
('earring','Chandelier Drops','legendary',8,800,'{"metal":"gold","iced":true,"shimmer":true}'),
-- GRILLS
('grill','Silver Grill','rare',3,150,'{"metal":"silver"}'),
('grill','Gold Grill','epic',5,400,'{"metal":"gold","shimmer":true}'),
('grill','Diamond Grill','legendary',9,1500,'{"metal":"gold","iced":true,"shimmer":true}'),
-- HATS
('hat','Snapback Classic','common',1,30,'{"color":"#1a1a1a"}'),
('hat','Fitted Cap','rare',2,60,'{"color":"#c1121f"}'),
('hat','Bucket Hat','common',2,40,'{"color":"#3a4a3a"}'),
('hat','Designer Beanie','rare',3,80,'{"color":"#2b1c10"}'),
('hat','Gold Crown Hat','legendary',9,1400,'{"color":"#c9a227","shimmer":true}'),
-- WATCHES
('watch','Silver Sport','common',1,60,'{"metal":"silver"}'),
('watch','Gold Link','rare',4,300,'{"metal":"gold","shimmer":true}'),
('watch','Diamond Bezel','epic',7,800,'{"metal":"gold","iced":true,"shimmer":true}'),
('watch','Bust Down AP','legendary',10,2500,'{"metal":"gold","iced":true,"shimmer":true}')
ON CONFLICT DO NOTHING;
