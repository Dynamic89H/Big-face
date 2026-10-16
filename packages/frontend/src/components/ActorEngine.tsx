import { useEffect, useRef, useState } from 'react';

export interface ActorLine {
  character: string;
  text: string;
  mood: 'confident' | 'taunt' | 'nervous' | 'celebrate' | 'trash';
}

export interface Actor {
  id: string;
  name: string;
  personality: string;
  equipped: Record<string, string>; // slot -> item name
}

/**
 * Character Actor Engine — makes gaming room characters feel alive.
 * They talk trash, react to wins/losses, play mind games.
 * They wear whatever the user equipped on them.
 */

// Dialogue pools per personality
const DIALOGUE: Record<string, Record<string, string[]>> = {
  boss: {
    confident: [
      "I don't lose. I just haven't won yet.",
      "This table is mine. Everyone else is just visiting.",
      "Put your money where your mouth is.",
    ],
    taunt: [
      "You sure you wanna do this? Last guy lost his rent money.",
      "I can see it in your eyes. You're scared.",
      "Go ahead. Roll. I'll wait.",
    ],
    celebrate: [
      "Told you. The Boss always eats.",
      "That's how a king does it. 👑",
      "Send the next one. I'm just getting warm.",
    ],
    nervous: [
      "...Lucky roll. Won't happen again.",
      "Okay. Okay. I see you.",
    ],
  },
  diva: {
    confident: [
      "Darling, I was born for this table. 💅",
      "Watch and learn, sweetie.",
      "Luck favors the fabulous.",
    ],
    taunt: [
      "Oh honey, are those dice or are you just nervous? 😘",
      "I've seen better rolls at a bakery.",
      "Don't cry when I take it all.",
    ],
    celebrate: [
      "Flawless. Absolutely flawless. ✨",
      "The queen takes her crown. As always.",
      "Someone get me champagne. 🥂",
    ],
    nervous: [
      "Excuse me? That was NOT supposed to happen.",
      "Fine. Enjoy your little moment.",
    ],
  },
  dread: {
    confident: [
      "I been doing this since before you knew what dice was.",
      "Cool, calm, collected. That's how you win.",
      "The universe already decided. I'm just here to collect.",
    ],
    taunt: [
      "You roll like my grandma. And she's been gone 10 years.",
      "Breathe, man. You're shaking the table.",
    ],
    celebrate: [
      "Yeah. That's the sound of money. 💰",
      "Stay humble. Stack paper.",
    ],
    nervous: [
      "Aight. That one stung.",
      "Run it back. I dare you.",
    ],
  },
  enforcer: {
    confident: [
      "Nobody beats the Enforcer. Nobody.",
      "I don't play games. I end them.",
    ],
    taunt: [
      "You got 10 seconds to walk away.",
      "Big bet. Bigger mistake.",
    ],
    celebrate: [
      "Done. Next.",
      "That's what happens when you step to me.",
    ],
    nervous: [
      "...Interesting.",
      "You got lucky. Once.",
    ],
  },
};

interface ActorEngineProps {
  actors: Actor[];
  gameState: 'waiting' | 'rolling' | 'won' | 'lost';
  winnerId?: string;
  onLine?: (line: ActorLine) => void;
}

/**
 * The engine that drives character dialogue in gaming rooms.
 * Drop this into any game room — characters come alive.
 */
export function useActorEngine({ actors, gameState, winnerId, onLine }: ActorEngineProps) {
  const [currentLine, setCurrentLine] = useState<ActorLine | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const speak = (actorId: string, mood: keyof typeof DIALOGUE[string]) => {
    const actor = actors.find((a) => a.id === actorId);
    if (!actor) return;
    const lines = DIALOGUE[actorId]?.[mood];
    if (!lines?.length) return;
    const text = lines[Math.floor(Math.random() * lines.length)];
    const line = { character: actor.name, text, mood };
    setCurrentLine(line);
    onLine?.(line);

    // Clear after 4 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCurrentLine(null), 4000);
  };

  // Ambient trash talk while waiting
  useEffect(() => {
    if (gameState !== 'waiting' || actors.length === 0) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        const actor = actors[Math.floor(Math.random() * actors.length)];
        speak(actor.id, Math.random() < 0.7 ? 'taunt' : 'confident');
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [gameState, actors]);

  // React to game outcome
  useEffect(() => {
    if (gameState === 'won' && winnerId) {
      speak(winnerId, 'celebrate');
      // Loser reacts
      const loser = actors.find((a) => a.id !== winnerId);
      if (loser && Math.random() < 0.6) {
        setTimeout(() => speak(loser.id, 'nervous'), 2500);
      }
    } else if (gameState === 'lost') {
      const actor = actors[Math.floor(Math.random() * actors.length)];
      speak(actor.id, 'nervous');
    }
  }, [gameState, winnerId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { currentLine, speak };
}

/**
 * Speech bubble component — shows what characters are saying.
 */
export function ActorSpeech({ line }: { line: ActorLine | null }) {
  if (!line) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        maxWidth: '90%',
        background: 'rgba(0,0,0,0.9)',
        border: '2px solid var(--gold)',
        borderRadius: 16,
        padding: '0.75rem 1.25rem',
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
        {line.character} {line.mood === 'taunt' ? '😏' : line.mood === 'celebrate' ? '🔥' : '💬'}
      </div>
      <div style={{ color: 'white', fontSize: '1rem' }}>{line.text}</div>
    </div>
  );
}
