-- Massive style expansion: outfits, hair, shoes, jewelry for characters
-- Based on 2024-2025 trends: streetwear, luxury, braids, locs, fades
-- First: allow the new slots (watch, glasses)
ALTER TABLE avatar_items DROP CONSTRAINT IF EXISTS avatar_items_slot_check;
ALTER TABLE avatar_items ADD CONSTRAINT avatar_items_slot_check
  CHECK (slot IN ('hair','top','bottom','shoes','chain','ring','earring','grill','hat','watch','glasses'));

INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
-- HAIR: Men (fades, waves, braids, locs, twists)
('hair','360 Waves','rare',2,60,'{"color":"#1a1a1a","style":"waves"}'),
('hair','Box Braids','rare',3,80,'{"color":"#1a1a1a","style":"box_braids","length":"long"}'),
('hair','Cornrows','common',1,0,'{"color":"#111111","style":"cornrows"}'),
('hair','Two-Strand Twists','rare',2,70,'{"color":"#2b1c10","style":"twists"}'),
('hair','High Top Fade','rare',3,75,'{"color":"#1a1a1a","style":"high_top"}'),
('hair','Burst Fade','epic',4,150,'{"color":"#111111","style":"burst_fade"}'),
('hair','Freeform Locs','epic',5,200,'{"color":"#2b1c10","style":"freeform","length":"long"}'),
('hair','Blonde Tips Fade','epic',4,180,'{"color":"#c9a227","style":"fade","tips":"blonde"}'),
-- HAIR: Women (braids, locs, natural, wigs)
('hair','Knotless Braids','rare',3,85,'{"color":"#1a1a1a","style":"knotless","length":"long"}'),
('hair','Passion Twists','epic',4,160,'{"color":"#3a2a18","style":"passion_twists","length":"long"}'),
('hair','Silk Press','rare',3,90,'{"color":"#1a1a1a","style":"silk_press","length":"long"}'),
('hair','Bantu Knots','epic',4,140,'{"color":"#2b1c10","style":"bantu_knots"}'),
('hair','Honey Blonde Wig','legendary',7,550,'{"color":"#d4a017","style":"wig","length":"long","shimmer":true}'),
('hair','Burgundy Locs','legendary',8,600,'{"color":"#6b1a1a","style":"locs","length":"long","shimmer":true}'),
-- TOPS: Streetwear
('top','Oversized Graphic Tee','common',1,0,'{"color":"#ffffff","style":"graphic"}'),
('top','Black Puffer Jacket','rare',3,120,'{"color":"#111111","style":"puffer"}'),
('top','Denim Jacket','rare',2,80,'{"color":"#4a6fa5","style":"denim"}'),
('top','Designer Hoodie','epic',5,250,'{"color":"#1a1a1a","style":"designer","shimmer":true}'),
('top','Silk Button-Up','epic',4,180,'{"color":"#f5f5dc","style":"silk"}'),
('top','Leather Jacket','legendary',7,500,'{"color":"#1a1a1a","style":"leather","shimmer":true}'),
-- TOPS: Luxury
('top','Gold Chain Suit','legendary',8,800,'{"color":"#c9a227","style":"suit","shimmer":true}'),
('top','Velvet Blazer','epic',6,350,'{"color":"#4b0082","style":"velvet"}'),
-- BOTTOMS
('bottom','Ripped Jeans','common',1,0,'{"color":"#2c3e50","style":"ripped"}'),
('bottom','Cargo Pants','rare',2,60,'{"color":"#4a4a4a","style":"cargo"}'),
('bottom','Designer Sweats','rare',3,100,'{"color":"#1a1a1a","style":"designer"}'),
('bottom','Leather Pants','epic',5,280,'{"color":"#111111","style":"leather"}'),
-- SHOES: More heat
('shoes','Yeezy Boost 350','epic',5,400,'{"brand":"yeezy","model":"350","color":"#d4c5a9"}'),
('shoes','Off-White Nikes','legendary',7,700,'{"brand":"nike","model":"offwhite","color":"#ffffff","shimmer":true}'),
('shoes','Balenciaga Triple S','legendary',8,850,'{"brand":"balenciaga","model":"triple_s","color":"#111111"}'),
('shoes','Timberland Boots','rare',3,150,'{"brand":"timberland","model":"classic","color":"#8b6914"}'),
('shoes','Gucci Sneakers','legendary',9,950,'{"brand":"gucci","model":"ace","color":"#ffffff","shimmer":true}'),
-- CHAINS: More ice
('chain','Silver Cuban','common',1,0,'{"metal":"silver"}'),
('chain','Rose Gold Chain','rare',4,200,'{"metal":"rose_gold","shimmer":true}'),
('chain','Tennis Chain','epic',6,500,'{"metal":"gold","iced":true,"shimmer":true}'),
('chain','Cross Pendant','rare',3,180,'{"metal":"gold","pendant":"cross"}'),
-- WATCHES (new slot)
('watch','G-Shock','rare',3,150,'{"brand":"gshock","color":"#111111"}'),
('watch','Rolex Submariner','legendary',8,900,'{"brand":"rolex","model":"submariner","shimmer":true}'),
('watch','AP Royal Oak','legendary',9,1200,'{"brand":"ap","model":"royal_oak","shimmer":true}'),
-- GLASSES (new slot)
('glasses','Aviators','rare',2,80,'{"style":"aviator","color":"#c9a227"}'),
('glasses','Designer Shades','epic',5,250,'{"style":"designer","color":"#111111"}'),
-- HATS (new slot)
('hat','Snapback','common',1,0,'{"style":"snapback","color":"#111111"}'),
('hat','Bucket Hat','rare',2,60,'{"style":"bucket","color":"#4a6fa5"}'),
('hat','Designer Beanie','rare',3,90,'{"style":"beanie","color":"#1a1a1a"}');
