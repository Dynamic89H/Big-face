import { useEffect, useRef } from 'react';
import { TableEngine, type TableCharacter } from '../engine/TableEngine';
import { useAuth } from '../auth/AuthContext';

interface DiceTableSceneProps {
  players: Array<{ id: string; name: string; img: string }>;
  width?: number;
  height?: number;
  onPlayerClick?: (id: string) => void;
}

/**
 * DiceTableScene — powered by TableEngine.
 * Your realistic characters around the dice table, alive and entertaining.
 */
export default function DiceTableScene({ players, width = 800, height = 500, onPlayerClick }: DiceTableSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TableEngine | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const engine = new TableEngine(mount, width, Math.min(height, width * 0.625));
    engineRef.current = engine;

    if (onPlayerClick) engine.onClick(onPlayerClick);

    // Add all players to the table with personalities, abilities, and swag
    const characterData = [
      {
        ...players[0],
        personality: 'trash-talker' as const,
        swagLevel: 9,
        abilities: [
          { name: 'Intimidate', description: 'Shakes opponent confidence', icon: '😤' },
          { name: 'Street Smarts', description: 'Reads the table', icon: '🧠' },
        ],
      },
      {
        ...players[1],
        personality: 'diva' as const,
        swagLevel: 10,
        abilities: [
          { name: 'Queen\'s Gambit', description: 'Doubles down with style', icon: '👑' },
          { name: 'Charm', description: 'Distracts opponents', icon: '✨' },
        ],
      },
      {
        ...players[2],
        personality: 'boss' as const,
        swagLevel: 8,
        abilities: [
          { name: 'Power Move', description: 'Goes all in', icon: '💎' },
          { name: 'Empire', description: 'Controls the table', icon: '🏛️' },
        ],
      },
      {
        ...players[3],
        personality: 'hype' as const,
        swagLevel: 7,
        abilities: [
          { name: 'Hype Train', description: 'Energizes the table', icon: '🔥' },
          { name: 'Lucky Streak', description: 'Rides the hot hand', icon: '🍀' },
        ],
      },
    ];
    characterData.forEach((p, i) => {
      engine.addCharacter({
        id: p.id, name: p.name, img: p.img,
        state: 'idle', seatIndex: i,
        personality: p.personality,
        abilities: p.abilities,
        swagLevel: p.swagLevel,
      });
    });

    // Opening story — the show begins
    setTimeout(() => engine.playStory('intro'), 1500);
    // Club vibe — smoke, drinks, the full experience
    setTimeout(() => engine.startClubVibe(), 4000);
    // Set story chapter based on user level
    if (user?.level) {
      setTimeout(() => engine.setChapter(user.level), 6000);
    }

    // Ambient life — characters randomly talk
    const lifeInterval = setInterval(() => {
      if (players.length > 0 && Math.random() > 0.4) {
        const p = players[Math.floor(Math.random() * players.length)];
        const phrases = ['💬', '🎲 Let\'s go!', '💰 Big money!', '🔥 I feel lucky'];
        engine.say(p.id, phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }, 7000);

    return () => {
      clearInterval(lifeInterval);
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // Expose engine for parent control
  useEffect(() => {
    (mountRef.current as any)?.__engine && ((mountRef.current as any).__engine = engineRef.current);
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={mountRef}
        style={{
          width, height: Math.min(height, width * 0.625),
          margin: '0 auto', cursor: 'pointer',
          borderRadius: 20, overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(201,162,39,0.12), transparent 70%)',
        }}
      />
      <p className="form-note" style={{ marginTop: '0.5rem' }}>
        👆 Tap a character to make them talk • They're alive, not stuck
      </p>
    </div>
  );
}

// Re-export for parent components to control the engine
export type { TableCharacter };
