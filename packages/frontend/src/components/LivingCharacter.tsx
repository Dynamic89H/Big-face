import { useEffect, useRef } from 'react';

interface LivingCharacterProps {
  img: string;
  name: string;
  width?: number;
  height?: number;
}

/**
 * LivingCharacter — makes any 2D character image move like a real mobile game.
 * Layered animation: breathing, blinking, sway, depth parallax, ambient particles.
 * Like gacha game character screens, but better.
 */
export default function LivingCharacter({ img, name, width = 280, height = 380 }: LivingCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    // Breathing phases with natural variation
    let breathPhase = Math.random() * Math.PI * 2;

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      const t = (now - start) / 1000;
      const dt = 1 / 60;
      breathPhase += dt * 1.5;

      // Organic breath
      const breath = (Math.sin(breathPhase) + Math.sin(breathPhase * 2.2 + 0.6) * 0.15 + 1.15) / 2.3;

      if (imgRef.current) {
        const el = imgRef.current;
        // Breathing: chest rises, body expands slightly
        const scaleY = 1 + breath * 0.025;
        const scaleX = 1 + breath * 0.015;
        // Sway: gentle side-to-side like standing idle in a game
        const swayX = Math.sin(t * 0.5) * 4;
        const swayY = breath * 6 + Math.sin(t * 0.8) * 2;
        // Subtle rotation for life
        const rot = Math.sin(t * 0.4) * 0.8;

        el.style.transform = `translate(${swayX}px, ${swayY}px) scale(${scaleX}, ${scaleY}) rotate(${rot}deg)`;
      }

      if (glowRef.current) {
        // Ambient glow pulses with breath
        glowRef.current.style.opacity = String(0.25 + breath * 0.2);
      }
    };
    animate(start);

    // Blink effect — periodic quick scaleY dip on upper portion
    // (simulated via a subtle overlay flash)
    const blinkInterval = setInterval(() => {
      if (!imgRef.current) return;
      const el = imgRef.current;
      el.style.filter = 'brightness(1.15)';
      setTimeout(() => { if (imgRef.current) imgRef.current.style.filter = ''; }, 120);
    }, 3000 + Math.random() * 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        borderRadius: 20, margin: '0 auto',
      }}
    >
      {/* Ambient glow behind character */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 70%, rgba(201,162,39,0.3), rgba(0,240,255,0.1) 50%, transparent 70%)',
          transition: 'opacity 0.1s',
        }}
      />
      {/* Floating dust particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 3 + (i % 3), height: 3 + (i % 3),
              borderRadius: '50%',
              background: i % 2 === 0 ? 'rgba(255,215,0,0.6)' : 'rgba(0,240,255,0.5)',
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animation: `float-up ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 4}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(8px); opacity: 0.8; }
        }
      `}</style>
      {/* The living character */}
      <img
        ref={imgRef}
        src={img}
        alt={name}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
          borderRadius: 20, willChange: 'transform',
          transition: 'filter 0.12s',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
        draggable={false}
      />
      {/* Vignette for game feel */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }} />
    </div>
  );
}
