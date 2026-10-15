// Royal chime — synthesized with Web Audio API, no audio files needed.
// Plays a bright ascending arpeggio fit for a King/Queen entrance.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// C5 E5 G5 C6 — a sparkling major arpeggio
const NOTES = [523.25, 659.25, 783.99, 1046.5];

function tone(ac: AudioContext, freq: number, startAt: number, dur: number, vol: number, type: OscillatorType = 'sine'): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(vol, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.1);
}

export function playRoyalChime(): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  NOTES.forEach((freq, i) => {
    const t = now + i * 0.12;
    tone(ac, freq, t, 1.2, 0.35);
    tone(ac, freq * 2, t, 0.8, 0.05); // shimmer harmonic
  });
}

// Level-up fanfare — triumphant ascending run.
export function playLevelUp(): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    tone(ac, f, now + i * 0.09, 0.7, 0.3, 'triangle');
  });
}

// Gift received — bright cha-ching.
export function playGiftSound(): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  tone(ac, 880, now, 0.4, 0.3, 'sine');
  tone(ac, 1318.5, now + 0.08, 0.6, 0.3, 'sine');
  tone(ac, 1760, now + 0.16, 0.8, 0.15, 'sine');
}
