import { useEffect, useRef } from 'react';

// Small hand-rolled emoji picker — no external dependency.
const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','😘','😎','🤔','😅','😭','😡',
  '👍','👎','👏','🙌','🤝','💪','👋','✌️','🤟','👀',
  '❤️','💔','💯','🔥','⭐','🌟','✨','🎉','🎊','👑',
  '🌹','💎','🏆','🥇','🚀','💰','🎮','🎵','🍕','☕',
  '🌈','🌙','☀️','⚡','💧','🌊','🍀','🎯','💡','📌',
];

export default function EmojiPicker({ onPick, onClose }: { onPick: (e: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="emoji-pop" ref={ref} role="dialog" aria-label="Emoji picker">
      <div className="emoji-grid">
        {EMOJIS.map((e) => (
          <button key={e} type="button" onClick={() => { onPick(e); onClose(); }} aria-label={`emoji ${e}`}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
