import { useEffect, useRef } from 'react';

interface ModelCharacterProps {
  img: string;
  name: string;
  width?: number | string;
  height?: number | string;
  interactive?: boolean;
}

/**
 * ModelCharacter — a 2D character presented as a true 3D model.
 * - 3D tilt follows mouse/finger (parallax depth)
 * - Layered depth: character floats above background
 * - Dynamic light shine sweeps across as you tilt
 * - Breathing + idle animation
 * Feels like holding a real model, not looking at a poster.
 */
export default function ModelCharacter({ img, name, width = 280, height = 380, interactive = true }: ModelCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let breathPhase = Math.random() * Math.PI * 2;
    let targetTilt = { x: 0, y: 0 };
    let currentTilt = { x: 0, y: 0 };

    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current || !interactive) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      targetTilt = { x: py * -18, y: px * 24 };
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => { targetTilt = { x: 0, y: 0 }; };

    const container = containerRef.current;
    if (container && interactive) {
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onLeave);
      container.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('touchend', onLeave);
    }

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      const t = (now - start) / 1000;
      const dt = 1 / 60;
      breathPhase += dt * 1.5;
      const breath = (Math.sin(breathPhase) + 1) / 2;

      // Smooth tilt interpolation (buttery)
      currentTilt.x += (targetTilt.x - currentTilt.x) * 0.08;
      currentTilt.y += (targetTilt.y - currentTilt.y) * 0.08;

      if (cardRef.current) {
        // 3D tilt with perspective
        cardRef.current.style.transform = `
          perspective(900px)
          rotateX(${currentTilt.x}deg)
          rotateY(${currentTilt.y}deg)
          translateZ(0)
        `;
        // Glow intensity follows tilt — direct DOM update, no React re-render
        const glow = 0.1 + Math.abs(currentTilt.y) / 200;
        cardRef.current.style.boxShadow = `
          0 20px 60px rgba(0,0,0,0.6),
          0 0 40px rgba(201,162,39,${glow}),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `;
      }

      if (imgRef.current) {
        // Character floats ABOVE the card (parallax depth)
        // Breathing + tilt-responsive offset
        const depthX = currentTilt.y * 0.4;
        const depthY = currentTilt.x * 0.4;
        const breathScale = 1 + breath * 0.02;
        imgRef.current.style.transform = `
          translateZ(45px)
          translate(${depthX}px, ${depthY + breath * 4}px)
          scale(${breathScale})
        `;
      }

      if (shineRef.current) {
        // Dynamic light shine follows tilt
        const shineX = 50 + currentTilt.y * 2;
        const shineY = 50 + currentTilt.x * 2;
        shineRef.current.style.background = `
          radial-gradient(circle at ${shineX}% ${shineY}%, 
            rgba(255,255,255,0.25) 0%, 
            rgba(255,255,255,0.05) 30%, 
            transparent 60%)
        `;
      }
    };
    animate(start);

    return () => {
      cancelAnimationFrame(raf);
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onLeave);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onLeave);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      style={{
        width, height: height === 'auto' ? undefined : height, margin: '0 auto',
        aspectRatio: height === 'auto' ? '170 / 220' : undefined,
        perspective: '900px', cursor: interactive ? 'grab' : 'default',
      }}
    >
      <div
        ref={cardRef}
        style={{
          width: '100%', height: '100%', position: 'relative',
          borderRadius: 20, overflow: 'hidden',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, rgba(20,24,40,0.9), rgba(8,10,18,0.95))',
          border: '1px solid rgba(201,162,39,0.3)',
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.6),
            0 0 40px rgba(201,162,39,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
          willChange: 'transform',
        }}
      >
        {/* Background depth layer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(0,240,255,0.08), transparent 60%)',
          transform: 'translateZ(10px)',
        }} />

        {/* Character — floats above with depth */}
        <img
          ref={imgRef}
          src={img}
          alt={name}
          draggable={false}
          loading="lazy"
          style={{
            position: 'absolute', inset: '8%',
            width: '84%', height: '84%',
            objectFit: 'cover', objectPosition: 'top',
            borderRadius: 14,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />

        {/* Dynamic shine */}
        <div
          ref={shineRef}
          style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            pointerEvents: 'none', transform: 'translateZ(50px)',
          }}
        />

        {/* Depth particles — floating in front */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transform: 'translateZ(60px)' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 4, height: 4, borderRadius: '50%',
              background: i % 2 ? 'rgba(255,215,0,0.7)' : 'rgba(0,240,255,0.6)',
              left: `${15 + (i * 23) % 70}%`,
              top: `${10 + (i * 31) % 75}%`,
              animation: `model-float ${3 + i % 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              boxShadow: '0 0 8px currentColor',
            }} />
          ))}
        </div>
        <style>{`
          @keyframes model-float {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-12px); opacity: 1; }
          }
        `}</style>

        {/* Bottom name plate with depth */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0.6rem', textAlign: 'center',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          transform: 'translateZ(30px)',
          fontWeight: 800, fontSize: '0.95rem', color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          {name}
        </div>
      </div>
    </div>
  );
}
