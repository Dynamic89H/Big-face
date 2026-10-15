interface ItemVisualProps {
  slot: string;
  style: Record<string, unknown>;
  name: string;
  size?: number;
}

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
    default:
      return null;
  }
}

// Renders a realistic visual preview for avatar studio items.
export default function ItemVisual({ slot, style, name, size = 100 }: ItemVisualProps) {
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
