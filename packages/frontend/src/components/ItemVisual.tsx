import Engine3D from './Engine3D';

interface ItemVisualProps {
  slot: string;
  style: Record<string, unknown>;
  name: string;
  size?: number;
  /** When true, jewelry renders the full interactive 3D engine. When false (grid view),
   *  uses a static product image to avoid mounting dozens of WebGL contexts. */
  interactive?: boolean;
}

// Slots that render in full 3D — the complete engine lineup.
const ENGINE_3D_SLOTS = ['chain', 'ring', 'watch', 'earring', 'grill', 'hat', 'top', 'bottom', 'shoes', 'hair'];

// Maps item slot + style to realistic product images.
function imageFor(slot: string, style: Record<string, unknown>, name: string): string | null {
  const n = name.toLowerCase();
  const metal = ((style.metal as string) || '').toLowerCase();
  const brand = ((style.brand as string) || '').toLowerCase();
  const color = ((style.color as string) || '').toLowerCase();

  switch (slot) {
    case 'hair':
      if (n.includes('dread') || n.includes('loc') || n.includes('braid')) return '/gear/hair-dreads.webp';
      return '/gear/hair-fade.webp';
    case 'top':
      if (n.includes('hoodie')) return '/gear/top-hoodie.webp';
      if (n.includes('jacket') || n.includes('leather') || n.includes('blazer')) return '/gear/top-jacket.webp';
      return '/gear/top-hoodie.webp';
    case 'bottom':
      return '/gear/bottom-jeans.webp';
    case 'shoes':
      return '/gear/shoes-jordan.webp';
    case 'chain':
      return '/gear/chain-cuban.webp';
    case 'ring':
      return '/gear/ring-diamond.webp';
    case 'earring':
      return '/gear/earring-stud.webp';
    case 'grill':
      return '/gear/grill-gold.webp';
    case 'hat':
      return '/gear/hat-snapback.webp';
    case 'watch':
      return '/gear/watch-gold.webp';
    case 'glasses':
      return '/gear/glasses-aviator.webp';
    default:
      return null;
  }
}

// Renders a realistic visual preview for avatar studio items.
// Jewelry renders in full interactive 3D when `interactive` is true; otherwise uses
// static product images to avoid exhausting the browser's WebGL context limit (~16).
export default function ItemVisual({ slot, style, name, size = 100, interactive = false }: ItemVisualProps) {
  // Full 3D engine for jewelry — interactive, rotatable. Only when explicitly requested.
  if (interactive && ENGINE_3D_SLOTS.includes(slot)) {
    return (
      <div title={name} style={{ position: 'relative' }}>
        <Engine3D slot={slot} style={style} width={size + 20} height={size + 20} />
        <div style={{
          position: 'absolute', bottom: 4, right: 8,
          fontSize: '0.65rem', color: 'var(--neon-cyan)',
          background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4,
        }}>
          3D
        </div>
      </div>
    );
  }

  const img = imageFor(slot, style, name);
  const shimmer = style.shimmer as boolean;

  if (img) {
    return (
      <div
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '0.5rem', background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, minHeight: size + 16,
        }}
        title={name}
      >
        <img
          src={img}
          alt={name}
          style={{
            width: size, height: size, objectFit: 'contain',
            filter: shimmer ? 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
          }}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
      ✨
    </div>
  );
}
