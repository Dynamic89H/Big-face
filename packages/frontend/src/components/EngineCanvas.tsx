import { useEffect, useRef } from 'react';
import { BigFaceEngine } from '../engine/BigFaceEngine';

/**
 * EngineCanvas — the Big Face Engine's viewport.
 * A fixed full-screen 3D canvas behind the entire app.
 * Every page in Big Face renders on top of this living 3D world.
 */
export default function EngineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect user's reduce-motion setting
    try {
      const settings = JSON.parse(localStorage.getItem('bigface.settings') || '{}');
      if (settings.reduceMotion) return;
    } catch {
      /* use default */
    }
    if (!canvasRef.current) return;
    try {
      BigFaceEngine.get().init(canvasRef.current);
    } catch (e) {
      // WebGL unavailable — fall back to CSS background.
      document.body.classList.add('engine-fallback');
      console.warn('Big Face Engine could not start:', e);
    }
  }, []);

  // Don't render canvas at all if reduce motion is on
  try {
    const settings = JSON.parse(localStorage.getItem('bigface.settings') || '{}');
    if (settings.reduceMotion) return null;
  } catch {
    /* render normally */
  }

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
