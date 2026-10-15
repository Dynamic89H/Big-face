import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; rotation: number; vr: number;
  shape: 'rect' | 'circle';
}

const COLORS = ['#00f0ff', '#ff2fd6', '#ffc94d', '#8b5cf6', '#22c55e', '#ff5c5c', '#ffffff'];

/**
 * Celebration overlay — full-screen confetti + flash for big moments.
 * Trigger via window.dispatchEvent(new CustomEvent('bigface:celebrate', { detail: { text } }))
 */
export default function Celebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pieces: ConfettiPiece[] = [];
    let raf = 0;
    let textTimeout: ReturnType<typeof setTimeout>;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const burst = (count = 150) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 3;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 10;
        pieces.push({
          x: cx + (Math.random() - 0.5) * 100,
          y: cy + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 4 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces = pieces.filter((p) => p.y < canvas.height + 30);
      for (const p of pieces) {
        p.vy += 0.25; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (pieces.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    tick();

    const onCelebrate = (e: Event) => {
      const detail = (e as CustomEvent).detail as { text?: string; big?: boolean } | undefined;
      burst(detail?.big ? 300 : 150);
      if (detail?.text && textRef.current) {
        textRef.current.textContent = detail.text;
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        clearTimeout(textTimeout);
        textTimeout = setTimeout(() => {
          if (textRef.current) {
            textRef.current.style.opacity = '0';
            textRef.current.style.transform = 'translate(-50%, -50%) scale(0.8)';
          }
        }, 2500);
      }
      // Extra bursts for big moments
      if (detail?.big) {
        setTimeout(() => burst(100), 400);
        setTimeout(() => burst(100), 800);
      }
    };

    window.addEventListener('bigface:celebrate', onCelebrate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('bigface:celebrate', onCelebrate);
      clearTimeout(textTimeout);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          pointerEvents: 'none', width: '100vw', height: '100vh',
        }}
      />
      <div
        ref={textRef}
        style={{
          position: 'fixed', top: '35%', left: '50%',
          transform: 'translate(-50%, -50%) scale(0.8)',
          zIndex: 9999, pointerEvents: 'none',
          fontSize: '2.5rem', fontWeight: 900, textAlign: 'center',
          background: 'linear-gradient(135deg, #ffc94d, #ff2fd6)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))',
          opacity: 0, transition: 'all 0.3s ease',
          padding: '0 1rem',
        }}
      />
    </>
  );
}

/** Helper to trigger a celebration from anywhere. */
export function celebrate(text?: string, big = false): void {
  window.dispatchEvent(new CustomEvent('bigface:celebrate', { detail: { text, big } }));
}
