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

export function playRoyalChime(): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  NOTES.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    // Shimmer: add a quiet octave-up harmonic
    const shimmer = ac.createOscillator();
    const shimmerGain = ac.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.value = freq * 2;
    shimmerGain.gain.value = 0.15;

    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(gain).connect(ac.destination);
    shimmer.connect(shimmerGain).connect(ac.destination);
    osc.start(t);
    shimmer.start(t);
    osc.stop(t + 1.3);
    shimmer.stop(t + 1.3);
  });
}
