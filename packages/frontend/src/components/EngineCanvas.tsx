import { useEffect, useRef, useState } from 'react';
import { BigFaceEngine } from '../engine/BigFaceEngine';

/**
 * EngineCanvas — the Big Face Engine's viewport.
 * A fixed full-screen 3D canvas behind the entire app.
 * Every page in Big Face renders on top of this living 3D world.
 */
export default function EngineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      BigFaceEngine.get().init(canvasRef.current);
      setReady(true);
    } catch (e) {
      // WebGL unavailable — fall back to CSS background.
      document.body.classList.add('engine-fallback');
      console.warn('Big Face Engine could not start:', e);
    }
  }, []);

  if (!ready) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -3,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
