/**
 * SoundFX — Web Audio API sound effects for Big Face.
 * No external files. All sounds generated programmatically.
 * Respects user's in-app sounds setting.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function soundsEnabled(): boolean {
  try {
    const s = JSON.parse(localStorage.getItem('bigface.settings') || '{}');
    return s.inAppSounds !== false;
  } catch {
    return true;
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, delay = 0) {
  const ac = getCtx();
  if (!ac || !soundsEnabled()) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export const sfx = {
  /** Small win — pleasant chime */
  win() {
    tone(523, 0.15, 'sine', 0.12);
    tone(659, 0.15, 'sine', 0.12, 0.1);
    tone(784, 0.25, 'sine', 0.15, 0.2);
  },

  /** Big win — fanfare */
  bigWin() {
    tone(523, 0.12, 'square', 0.08);
    tone(659, 0.12, 'square', 0.08, 0.1);
    tone(784, 0.12, 'square', 0.08, 0.2);
    tone(1047, 0.3, 'square', 0.1, 0.3);
    tone(1319, 0.4, 'sine', 0.12, 0.4);
  },

  /** Jackpot — epic celebration */
  jackpot() {
    [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => {
      tone(f, 0.25, 'square', 0.08, i * 0.12);
    });
    tone(261, 1.2, 'sawtooth', 0.05, 0);
  },

  /** Click/tap — subtle feedback */
  click() {
    tone(800, 0.05, 'sine', 0.05);
  },

  /** Level up — ascending arpeggio */
  levelUp() {
    [440, 554, 659, 880].forEach((f, i) => {
      tone(f, 0.15, 'triangle', 0.1, i * 0.09);
    });
  },

  /** Rank up — triumphant */
  rankUp() {
    [392, 523, 659, 784, 1047].forEach((f, i) => {
      tone(f, 0.2, 'triangle', 0.12, i * 0.1);
    });
  },

  /** Spin — whirring */
  spin() {
    for (let i = 0; i < 8; i++) {
      tone(300 + i * 80, 0.08, 'sine', 0.06, i * 0.15);
    }
  },

  /** Coin/tokens — cha-ching */
  coins() {
    tone(988, 0.08, 'square', 0.06);
    tone(1319, 0.2, 'square', 0.08, 0.07);
  },

  /** Error — soft buzz */
  error() {
    tone(200, 0.2, 'sawtooth', 0.06);
  },
};

/** Haptic feedback for mobile */
export function haptic(pattern: number | number[] = 10) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* not supported */
  }
}
