// Art-directed profile background themes. Each is pure CSS — always crisp, never blurry.
export interface ProfileBackground {
  id: string;
  name: string;
  css: string;
}

export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  {
    id: 'default',
    name: 'Signature',
    css: 'linear-gradient(135deg, var(--profile-color, #0066FF), #0e1013)',
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    css: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120,40,180,0.8), transparent),
      radial-gradient(ellipse 60% 40% at 80% 60%, rgba(40,80,220,0.7), transparent),
      radial-gradient(ellipse 40% 30% at 50% 20%, rgba(255,255,255,0.15), transparent),
      linear-gradient(180deg, #0a0618 0%, #1a0b2e 50%, #0d1b3e 100%)`,
  },
  {
    id: 'sunset',
    name: 'Sunset Blvd',
    css: 'linear-gradient(180deg, #2d1b4e 0%, #c94b7a 35%, #ff8c42 65%, #ffd93d 100%)',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    css: 'linear-gradient(180deg, #001f3f 0%, #003d7a 40%, #0074a8 70%, #00c9b7 100%)',
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    css: `radial-gradient(ellipse 70% 40% at 30% 70%, rgba(255,46,99,0.6), transparent),
      radial-gradient(ellipse 70% 40% at 70% 30%, rgba(0,255,255,0.5), transparent),
      linear-gradient(180deg, #0a0a12 0%, #14141f 100%)`,
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    css: `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,162,39,0.5), transparent),
      linear-gradient(180deg, #0d0d0d 0%, #1a1408 50%, #2b2008 100%)`,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    css: 'linear-gradient(180deg, #000000 0%, #0a1128 50%, #1a2a5e 100%)',
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    css: 'linear-gradient(135deg, #ff2e63 0%, #c94b7a 40%, #8e2a5e 100%)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    css: 'linear-gradient(180deg, #022c22 0%, #065f46 50%, #10b981 100%)',
  },
  {
    id: 'fire',
    name: 'Fire',
    css: `radial-gradient(ellipse 80% 60% at 50% 80%, rgba(255,140,0,0.8), transparent),
      linear-gradient(180deg, #1a0500 0%, #7a1e00 50%, #ff4400 100%)`,
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    css: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 30%, #a55eea 70%, #5f27cd 100%)',
  },
  {
    id: 'arctic',
    name: 'Arctic',
    css: 'linear-gradient(180deg, #e8f4f8 0%, #a8d8ea 40%, #5b9bd5 100%)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    css: `radial-gradient(ellipse 50% 40% at 20% 20%, rgba(255,0,255,0.4), transparent),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,255,255,0.4), transparent),
      linear-gradient(135deg, #0d0221 0%, #1a0533 100%)`,
  },
  {
    id: 'champagne',
    name: 'Champagne',
    css: 'linear-gradient(135deg, #f7e7ce 0%, #e8c468 40%, #c9a227 100%)',
  },
  {
    id: 'blood-moon',
    name: 'Blood Moon',
    css: `radial-gradient(circle 30% at 70% 25%, rgba(255,60,60,0.9), rgba(180,20,20,0.4) 60%, transparent 70%),
      linear-gradient(180deg, #0a0000 0%, #2b0808 100%)`,
  },
  {
    id: 'tropical',
    name: 'Tropical',
    css: 'linear-gradient(180deg, #00d2a8 0%, #00a8b5 40%, #0077b6 100%)',
  },
];

export function backgroundCss(id: string | undefined, profileColor: string): string {
  const bg = PROFILE_BACKGROUNDS.find((b) => b.id === id);
  if (!bg) return PROFILE_BACKGROUNDS[0].css.replace('var(--profile-color, #0066FF)', profileColor);
  if (bg.id === 'default') return bg.css.replace('var(--profile-color, #0066FF)', profileColor);
  return bg.css;
}
