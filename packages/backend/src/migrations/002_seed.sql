-- Big Face avatar item catalog seed.
-- Slots: hair, top, bottom, shoes, chain, ring, earring, grill, hat

INSERT INTO avatar_items (slot, name, rarity, min_level, token_price, style) VALUES
-- HAIR
('hair','Long Dreads','rare',2,50,'{"color":"#1a1a1a","length":"long"}'),
('hair','Long Braids','rare',2,50,'{"color":"#2b1c10","length":"long"}'),
('hair','Crisp Fade','common',1,0,'{"color":"#111111","length":"short"}'),
('hair','Curly Top','common',1,0,'{"color":"#3a2a18","length":"medium"}'),
('hair','Golden Locs','legendary',7,500,'{"color":"#c9a227","length":"long","shimmer":true}'),
-- TOPS
('top','Street Luxury Hoodie','common',1,0,'{"color":"#16181d"}'),
('top','Electric Blue Jacket','rare',3,80,'{"color":"#0066FF"}'),
('top','Coral Bomber','epic',5,200,'{"color":"#FF5C5C"}'),
('top','Golden Throne Robe','legendary',8,800,'{"color":"#c9a227","shimmer":true}'),
-- BOTTOMS
('bottom','Dark Denim','common',1,0,'{"color":"#23262e"}'),
('bottom','Coral Joggers','rare',3,60,'{"color":"#FF5C5C"}'),
-- SHOES
('shoes','White Runners','common',1,0,'{"color":"#f5f5f5"}'),
('shoes','Nike AF1 Classic','rare',2,120,'{"brand":"nike","model":"af1","color":"#ffffff"}'),
('shoes','Jordan 1 Retro','epic',4,300,'{"brand":"jordan","model":"1","color":"#c1121f"}'),
('shoes','Jordan 4 Black Cat','epic',5,350,'{"brand":"jordan","model":"4","color":"#111111"}'),
('shoes','Jordan 11 Concord','legendary',6,600,'{"brand":"jordan","model":"11","color":"#ffffff","shimmer":true}'),
('shoes','Golden Jordans','legendary',9,1000,'{"brand":"jordan","model":"custom","color":"#c9a227","shimmer":true}'),
-- CHAINS
('chain','Steel Link','common',1,0,'{"metal":"steel"}'),
('chain','Gold Cuban','rare',3,150,'{"metal":"gold","shimmer":true}'),
('chain','Iced Cuban','epic',5,400,'{"metal":"gold","iced":true,"shimmer":true}'),
('chain','Legendary Medallion','legendary',8,900,'{"metal":"gold","medallion":"angel","iced":true,"shimmer":true}'),
-- RINGS
('ring','Silver Band','common',1,0,'{"metal":"silver"}'),
('ring','Gold Ruby','rare',3,100,'{"metal":"gold","stone":"ruby","shimmer":true}'),
('ring','Diamond Encrusted','epic',5,350,'{"metal":"gold","stone":"diamond","shimmer":true}'),
-- EARRINGS
('earring','Stud','common',1,0,'{"metal":"silver"}'),
('earring','Diamond Stud','epic',5,250,'{"metal":"gold","stone":"diamond","shimmer":true}'),
-- GRILLS
('grill','Gold Grill','rare',4,200,'{"metal":"gold","shimmer":true}'),
('grill','Platinum Grill','legendary',7,700,'{"metal":"platinum","shimmer":true}'),
-- HATS
('hat','Snapback','common',1,0,'{"color":"#16181d"}'),
('hat','Legendary Crown','legendary',10,1500,'{"metal":"gold","stones":["ruby","diamond"],"shimmer":true}');
