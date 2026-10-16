import { useState } from 'react';
import { CLOSET, CLOSET_CATEGORIES, getClosetByCategory, type ClosetItem } from '../closet/closetData';

interface ClosetPickerProps {
  onSelect: (item: ClosetItem, color?: number) => void;
  selectedItems?: Record<string, string>; // category -> item id
}

/**
 * ClosetPicker — Big Face outfit picker for character creation.
 * Browse by category, pick items, pick colors.
 */
export default function ClosetPicker({ onSelect, selectedItems = {} }: ClosetPickerProps) {
  const [activeCategory, setActiveCategory] = useState<ClosetItem['category']>('hat');
  const [selectedColor, setSelectedColor] = useState<number | undefined>(undefined);

  const items = getClosetByCategory(activeCategory);

  const handlePick = (item: ClosetItem) => {
    const color = selectedColor ?? item.defaultColor;
    onSelect(item, color);
    setSelectedColor(undefined);
  };

  return (
    <div style={{
      background: 'rgba(10,10,20,0.95)',
      borderRadius: 16,
      padding: '1rem',
      border: '1px solid rgba(201,162,39,0.3)',
    }}>
      <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--gold)' }}>👔 Big Face Closet</h3>

      {/* Category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {CLOSET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id as ClosetItem['category']); setSelectedColor(undefined); }}
            style={{
              padding: '0.4rem 0.7rem',
              borderRadius: 20,
              border: activeCategory === cat.id ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.2)',
              background: activeCategory === cat.id ? 'rgba(201,162,39,0.2)' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {items.map((item) => {
          const isSelected = selectedItems[item.category] === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handlePick(item)}
              title={item.description}
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 12,
                border: isSelected ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)',
                background: isSelected ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.8rem' }}>{item.emoji}</div>
              <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{item.name}</div>
            </button>
          );
        })}
      </div>

      {/* Color picker (if item has colors) */}
      {items.some((i) => i.colors) && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem' }}>Color:</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[...new Set(items.flatMap((i) => i.colors || []))].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `#${color.toString(16).padStart(6, '0')}`,
                  border: selectedColor === color ? '3px solid var(--gold)' : '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
