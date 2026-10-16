import { useEffect, useRef, useState } from 'react';
import { RealisticTableEngine } from '../engine/RealisticTableEngine';
import { useAuth } from '../auth/AuthContext';

interface GTATableSceneProps {
  width?: number;
  height?: number;
}

/**
 * GTATableScene — GTA cutscene style dice table.
 * Real 3D characters, cinematic camera, dramatic lighting.
 */
export default function GTATableScene({ width = 800, height = 500 }: GTATableSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const engine = new RealisticTableEngine(mount, width, Math.min(height, width * 0.625));

    // The crew — real 3D characters
    const crew = [
      {
        id: 'street-king', name: 'Street King',
        faceImg: '/characters/media-generation-rapper-street-king-0-f5b96626-0370-4c7d-8d6f-7ed3159cfbb6.webp',
        skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x2a2a3a,
        state: 'idle' as const, seatIndex: 0, personality: 'trash-talker',
      },
      {
        id: 'queen', name: 'Queen',
        faceImg: '/characters/media-generation-rapper-queen-0-3b2682fd-d633-4c29-bcb8-f0c31dd471ea.webp',
        skinTone: 0x7a4e2d, shirtColor: 0x8b0000, pantsColor: 0x1a1a1a,
        state: 'idle' as const, seatIndex: 1, personality: 'diva',
      },
      {
        id: 'luxury-boss', name: 'Luxury Boss',
        faceImg: '/characters/media-generation-rapper-luxury-boss-0-b07d0949-89b4-4f11-b08b-32d732e210f6.webp',
        skinTone: 0x5c3a1e, shirtColor: 0x2a2a2a, pantsColor: 0x1a1a1a,
        state: 'idle' as const, seatIndex: 2, personality: 'boss',
      },
      {
        id: 'diva', name: 'Diva',
        faceImg: '/characters/media-generation-rapper-diva-0-c7cb8095-2098-4023-9727-805fb5a46aeb.webp',
        skinTone: 0x6b4226, shirtColor: 0x4a0a4a, pantsColor: 0x2a1a2a,
        state: 'idle' as const, seatIndex: 3, personality: 'hype',
      },
    ];

    crew.forEach((c) => engine.addCharacter(c));
    setLoading(false);

    engine.onClick((id) => {
      const char = crew.find((c) => c.id === id);
      if (char) engine.say(id, `💬 ${char.name}: "What's good?"`);
    });

    // GTA-style cutscene intro — characters talk
    setTimeout(() => {
      engine.say('street-king', "Yo, welcome to the table. You ready?");
      engine.setTalking('street-king', true);
    }, 2000);
    setTimeout(() => {
      engine.setTalking('street-king', false);
      engine.say('queen', "He talk a lot. Let's play.");
      engine.setTalking('queen', true);
    }, 5000);
    setTimeout(() => {
      engine.setTalking('queen', false);
      engine.say('luxury-boss', "Big bets only. This ain't for the weak.");
      engine.setTalking('luxury-boss', true);
    }, 8000);
    setTimeout(() => {
      engine.setTalking('luxury-boss', false);
      engine.celebrate('diva');
      engine.say('diva', "LET'S GOOO! 🔥");
    }, 11000);

    // Ambient — random talking and gestures
    const ambient = setInterval(() => {
      const random = crew[Math.floor(Math.random() * crew.length)];
      const actions = ['talking', 'drinking', 'smoking', 'thinking'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      // Use setTalking for talking, otherwise set state directly
      if (action === 'talking') {
        engine.setTalking(random.id, true);
        const lines = ["This my table.", "You feelin' lucky?", "Watch this.", "Easy money."];
        engine.say(random.id, lines[Math.floor(Math.random() * lines.length)]);
        setTimeout(() => engine.setTalking(random.id, false), 3000);
      }
    }, 15000);

    return () => {
      clearInterval(ambient);
      engine.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={mountRef}
        style={{
          width, height: Math.min(height, width * 0.625),
          margin: '0 auto', cursor: 'pointer',
          borderRadius: 20, overflow: 'hidden',
          position: 'relative',
        }}
      >
        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0a12', color: '#ffd700', fontSize: '1.1rem', fontWeight: 700,
          }}>
            🎬 Loading the table...
          </div>
        )}
      </div>
      <p className="form-note" style={{ marginTop: '0.5rem' }}>
        🎬 GTA-style cutscene • Tap a character to talk to them
      </p>
    </div>
  );
}
