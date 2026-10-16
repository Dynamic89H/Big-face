/**
 * Big Face Closet — clothing inventory system.
 * Every wearable item lives here. Characters pull from the closet.
 */

export interface ClosetItem {
  id: string;
  name: string;
  category: 'hat' | 'shirt' | 'pants' | 'shoes' | 'jacket' | 'dress' | 'jewelry' | 'glasses' | 'hairstyle';
  // Procedural items are built in code; model items load a GLB
  type: 'procedural' | 'model';
  modelUrl?: string;
  // For procedural items
  colors?: number[];
  defaultColor?: number;
  // Preview
  emoji: string;
  description: string;
}

export const CLOSET: ClosetItem[] = [
  // HATS (procedural)
  { id: 'bandana-red', name: 'Red Bandana', category: 'hat', type: 'procedural', emoji: '🧣', description: 'Tupac-style bandana', defaultColor: 0xcc2222, colors: [0xcc2222, 0x111111, 0x2244cc, 0x228822] },
  { id: 'cap-black', name: 'Snapback Cap', category: 'hat', type: 'procedural', emoji: '🧢', description: 'Street snapback', defaultColor: 0x111111, colors: [0x111111, 0xcc2222, 0xffffff, 0x2244cc] },
  { id: 'fedora-black', name: 'Fedora', category: 'hat', type: 'procedural', emoji: '🎩', description: 'Boss fedora', defaultColor: 0x111111, colors: [0x111111, 0x5a3a1a, 0x888888] },
  { id: 'beanie-gray', name: 'Beanie', category: 'hat', type: 'procedural', emoji: '⛄', description: 'Knit beanie', defaultColor: 0x666666, colors: [0x666666, 0x111111, 0xcc2222, 0x2244cc] },

  // SHIRTS (procedural color)
  { id: 'shirt-tee', name: 'T-Shirt', category: 'shirt', type: 'procedural', emoji: '👕', description: 'Basic tee, any color', defaultColor: 0xffffff, colors: [0xffffff, 0x111111, 0xcc2222, 0x2244cc, 0x228822, 0xffaa00] },
  { id: 'shirt-tank', name: 'Tank Top', category: 'shirt', type: 'procedural', emoji: '🎽', description: 'Sleeveless tank', defaultColor: 0xf0f0f0, colors: [0xf0f0f0, 0x111111, 0xcc2222] },
  { id: 'shirt-button', name: 'Button-Up', category: 'shirt', type: 'procedural', emoji: '👔', description: 'Business button-up', defaultColor: 0xffffff, colors: [0xffffff, 0x2244cc, 0x111111, 0xcc1133] },

  // JACKETS
  { id: 'jacket-denim', name: 'Denim Jacket', category: 'jacket', type: 'procedural', emoji: '🧥', description: 'Classic denim', defaultColor: 0x4466aa, colors: [0x4466aa, 0x111111, 0x5a3a1a] },
  { id: 'jacket-leather', name: 'Leather Jacket', category: 'jacket', type: 'procedural', emoji: '🧥', description: 'Black leather', defaultColor: 0x111111, colors: [0x111111, 0x5a3a1a] },
  { id: 'hoodie-gray', name: 'Hoodie', category: 'jacket', type: 'procedural', emoji: '🧥', description: 'Pullover hoodie', defaultColor: 0x888888, colors: [0x888888, 0x111111, 0xcc2222, 0x2244cc] },

  // PANTS
  { id: 'pants-jeans', name: 'Jeans', category: 'pants', type: 'procedural', emoji: '👖', description: 'Denim jeans', defaultColor: 0x2a4a8a, colors: [0x2a4a8a, 0x111111, 0x5a3a1a, 0x888888] },
  { id: 'pants-slacks', name: 'Slacks', category: 'pants', type: 'procedural', emoji: '👖', description: 'Dress slacks', defaultColor: 0x111111, colors: [0x111111, 0x444444, 0x5a3a1a] },
  { id: 'pants-joggers', name: 'Joggers', category: 'pants', type: 'procedural', emoji: '👖', description: 'Street joggers', defaultColor: 0x2a2a2a, colors: [0x2a2a2a, 0x111111, 0x888888] },

  // DRESSES
  { id: 'dress-red', name: 'Red Evening Dress', category: 'dress', type: 'procedural', emoji: '👗', description: 'Glamorous red dress', defaultColor: 0xcc1133, colors: [0xcc1133, 0x111111, 0xffffff, 0x2244cc] },
  { id: 'dress-black', name: 'Black Dress', category: 'dress', type: 'procedural', emoji: '👗', description: 'Little black dress', defaultColor: 0x111111, colors: [0x111111, 0xcc1133, 0x5a3a1a] },

  // SHOES
  { id: 'shoes-sneakers', name: 'Sneakers', category: 'shoes', type: 'procedural', emoji: '👟', description: 'Street sneakers', defaultColor: 0xffffff, colors: [0xffffff, 0x111111, 0xcc2222, 0x2244cc] },
  { id: 'shoes-boots', name: 'Boots', category: 'shoes', type: 'procedural', emoji: '🥾', description: 'Leather boots', defaultColor: 0x5a3a1a, colors: [0x5a3a1a, 0x111111] },
  { id: 'shoes-heels', name: 'Heels', category: 'shoes', type: 'procedural', emoji: '👠', description: 'High heels', defaultColor: 0xcc1133, colors: [0xcc1133, 0x111111, 0xd4af37] },
  { id: 'shoes-dress', name: 'Dress Shoes', category: 'shoes', type: 'procedural', emoji: '👞', description: 'Formal dress shoes', defaultColor: 0x111111, colors: [0x111111, 0x5a3a1a] },

  // JEWELRY (procedural)
  { id: 'chain-gold', name: 'Gold Chain', category: 'jewelry', type: 'procedural', emoji: '⛓️', description: 'Gold rope chain', defaultColor: 0xd4af37 },
  { id: 'chain-silver', name: 'Silver Chain', category: 'jewelry', type: 'procedural', emoji: '⛓️', description: 'Silver chain', defaultColor: 0xc0c0c0 },
  { id: 'earrings-gold', name: 'Gold Earrings', category: 'jewelry', type: 'procedural', emoji: '💎', description: 'Gold hoops', defaultColor: 0xd4af37 },
  { id: 'bracelet-gold', name: 'Gold Bracelet', category: 'jewelry', type: 'procedural', emoji: '⌚', description: 'Gold bracelet', defaultColor: 0xd4af37 },
  { id: 'watch-luxury', name: 'Luxury Watch', category: 'jewelry', type: 'procedural', emoji: '⌚', description: 'Silver watch', defaultColor: 0xc0c0c0 },
  { id: 'ring-gold', name: 'Gold Ring', category: 'jewelry', type: 'procedural', emoji: '💍', description: 'Gold ring', defaultColor: 0xd4af37 },

  // GLASSES
  { id: 'shades-dark', name: 'Sunglasses', category: 'glasses', type: 'procedural', emoji: '🕶️', description: 'Dark shades', defaultColor: 0x111111 },
  { id: 'glasses-clear', name: 'Clear Frames', category: 'glasses', type: 'procedural', emoji: '👓', description: 'Clear glasses', defaultColor: 0x888888 },

  // HAIRSTYLES
  { id: 'hair-dreads', name: 'Dreadlocks', category: 'hairstyle', type: 'procedural', emoji: '💇', description: 'Long dreads', defaultColor: 0x1a1a1a, colors: [0x1a1a1a, 0x5a3a1a, 0x888888] },
  { id: 'hair-afro', name: 'Afro', category: 'hairstyle', type: 'procedural', emoji: '💇', description: 'Full afro', defaultColor: 0x1a1a1a, colors: [0x1a1a1a, 0x5a3a1a] },
  { id: 'hair-long', name: 'Long Hair', category: 'hairstyle', type: 'procedural', emoji: '💇', description: 'Long straight', defaultColor: 0x0a0a0a, colors: [0x0a0a0a, 0x5a3a1a, 0x888888] },
  { id: 'hair-braids', name: 'Braids', category: 'hairstyle', type: 'procedural', emoji: '💇', description: 'Cornrow braids', defaultColor: 0x1a1a1a, colors: [0x1a1a1a, 0x5a3a1a] },
  { id: 'hair-fade', name: 'Fade', category: 'hairstyle', type: 'procedural', emoji: '💇', description: 'Clean fade', defaultColor: 0x1a1a1a },
  { id: 'hair-bald', name: 'Bald', category: 'hairstyle', type: 'procedural', emoji: '🧑‍🦲', description: 'Clean shave', defaultColor: 0x1a1a1a },
];

/** Get items by category */
export function getClosetByCategory(category: ClosetItem['category']): ClosetItem[] {
  return CLOSET.filter((item) => item.category === category);
}

/** Get item by ID */
export function getClosetItem(id: string): ClosetItem | undefined {
  return CLOSET.find((item) => item.id === id);
}

/** All categories */
export const CLOSET_CATEGORIES = [
  { id: 'hat', name: 'Hats', emoji: '🧢' },
  { id: 'shirt', name: 'Shirts', emoji: '👕' },
  { id: 'jacket', name: 'Jackets', emoji: '🧥' },
  { id: 'pants', name: 'Pants', emoji: '👖' },
  { id: 'dress', name: 'Dresses', emoji: '👗' },
  { id: 'shoes', name: 'Shoes', emoji: '👟' },
  { id: 'jewelry', name: 'Jewelry', emoji: '⛓️' },
  { id: 'glasses', name: 'Glasses', emoji: '🕶️' },
  { id: 'hairstyle', name: 'Hair', emoji: '💇' },
] as const;
