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
    if (!canvasRef.current) return;
    // Reduce Motion = still starfield, zero animation (never a white screen).
    let reduceMotion = false;
    try {
      const settings = JSON.parse(localStorage.getItem('bigface.settings') || '{}');
      reduceMotion = !!settings.reduceMotion;
    } catch {
      /* use default */
    }
    try {
      BigFaceEngine.get().init(canvasRef.current, reduceMotion);
    } catch (e) {
      // WebGL unavailable — fall back to CSS background.
      document.body.classList.add('engine-fallback');
      console.warn('Big Face Engine could not start:', e);
    }
  }, []);

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
