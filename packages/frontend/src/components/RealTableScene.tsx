import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { GambleEngine } from '../engine/GambleEngine';

interface RealTableSceneProps {
  width?: number;
  height?: number;
}

export interface RealTableSceneHandle {
  rollDice: (v1: number, v2: number) => void;
  celebrate: () => void;
  setMood: (mood: 'idle' | 'tense' | 'win' | 'lose') => void;
}

/**
 * RealTableScene — thin React wrapper around the GambleEngine.
 * The engine owns the 3D world; this just mounts it and exposes
 * the game controls to the page via ref.
 */
const RealTableScene = forwardRef<RealTableSceneHandle, RealTableSceneProps>(
  function RealTableScene({ width = 800, height = 500 }, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<GambleEngine | null>(null);

    useImperativeHandle(ref, () => ({
      rollDice: (v1: number, v2: number) => engineRef.current?.rollDice(v1, v2),
      celebrate: () => engineRef.current?.celebrate(),
      setMood: (mood) => engineRef.current?.setMood(mood),
    }), []);

    useEffect(() => {
      const mount = mountRef.current;
      if (!mount) return;
      const engine = new GambleEngine(mount, width, height);
      engineRef.current = engine;
      return () => {
        engine.dispose();
        engineRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    return (
      <div style={{ textAlign: 'center' }}>
        <div ref={mountRef} style={{
          width, height: Math.min(height, width * 0.625),
          margin: '0 auto', borderRadius: 20, overflow: 'hidden',
        }} />
        <p className="form-note" style={{ marginTop: '0.5rem' }}>
          🎬 Big Face Casino — powered by the GambleEngine
        </p>
      </div>
    );
  }
);

export default RealTableScene;
