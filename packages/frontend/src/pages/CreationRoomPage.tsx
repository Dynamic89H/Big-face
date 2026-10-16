import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePageTitle } from '../hooks/usePageTitle';
import { CharacterModelBuilder, type CharacterModelConfig } from '../engine/CharacterModelBuilder';

const CHARACTERS: CharacterModelConfig[] = [
  {
    id: 'boss', name: 'The Boss',
    faceImg: '/characters/media-generation-boss-tupac-style-0-5d243a54-3920-4154-9dba-d15d08166707.webp',
    skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x1a1a1a,
    build: 'athletic', height: 1.0,
  },
  {
    id: 'diva', name: 'The Baddest Diva',
    faceImg: '/characters/media-generation-baddest-diva-0-4dd8b93e-0a39-47e6-9c40-5047e631e9c7.webp',
    skinTone: 0x5c3a1e, shirtColor: 0x8b0000, pantsColor: 0x1a1a1a,
    build: 'curvy', height: 0.98,
  },
  {
    id: 'dreads', name: 'Dread Artist',
    faceImg: '/characters/media-generation-dread-tattoo-artist-0-1b72bd66-621d-4fab-becb-588d28bcae1f.webp',
    skinTone: 0x6b4226, shirtColor: 0xf5f5f5, pantsColor: 0x2a2a3a,
    build: 'slim', height: 1.02,
  },
  {
    id: 'enforcer', name: 'The Enforcer',
    faceImg: '/characters/media-generation-muscle-fade-enforcer-0-4d0117a0-7509-4292-956f-7761c017424a.webp',
    skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x2a2a2a,
    build: 'muscular', height: 1.05,
  },
];

const DESCRIPTIONS: Record<string, string> = {
  boss: 'Tupac-style. Bandana, all black, gold medallion, rings, left ear earring.',
  diva: 'Darker brown skin, long hair, hips, full lips. The baddest.',
  dreads: 'Long dreads, tattoos, silver chain. Artistic vibe.',
  enforcer: 'Built with muscles, fade haircut, gold rope chain.',
};

const SHIRT_COLORS = [
  { name: 'Black', value: 0x1a1a1a },
  { name: 'White', value: 0xf5f5f5 },
  { name: 'Red', value: 0x8b0000 },
  { name: 'Blue', value: 0x1a3a6b },
  { name: 'Gold', value: 0xc9a227 },
  { name: 'Purple', value: 0x4a0a4a },
];

/**
 * Creation Room — your 4 characters as detailed 3D models.
 * They breathe, talk (jaw moves, teeth show), gesture, and walk.
 */
export default function CreationRoomPage() {
  usePageTitle('Creation Room');
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(CHARACTERS[0]);
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0].value);
  const builderRef = useRef<CharacterModelBuilder | null>(null);
  const currentModelRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, 600 / 520, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 520);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // Studio lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.SpotLight(0xfff2e0, 120, 25, Math.PI / 6, 0.4);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.PointLight(0x8899ff, 25, 20);
    fill.position.set(-5, 3, 3);
    scene.add(fill);
    const rimLight = new THREE.PointLight(0xffd700, 40, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(10, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d0d16, roughness: 0.3, metalness: 0.6 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Gold turntable
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.3, 0.12, 40),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.85, roughness: 0.25 })
    );
    platform.position.y = 0.06;
    platform.receiveShadow = true;
    scene.add(platform);

    const builder = new CharacterModelBuilder();
    builderRef.current = builder;

    const showCharacter = (config: CharacterModelConfig, shirt: number) => {
      if (currentModelRef.current) {
        scene.remove(currentModelRef.current);
      }
      const model = builder.build({ ...config, shirtColor: shirt });
      scene.add(model);
      currentModelRef.current = model;
      // Make them talk to show off
      builder.setTalking(config.id, true);
      setTimeout(() => builder.setTalking(config.id, false), 4000);
    };

    showCharacter(selected, shirtColor);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      builder.update(dt);
      if (currentModelRef.current) {
        currentModelRef.current.rotation.y = t * 0.35;
      }
      camera.position.x = Math.sin(t * 0.15) * 1.2;
      camera.lookAt(0, 1.4, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (char: CharacterModelConfig) => {
    setSelected(char);
    if (builderRef.current && sceneRef.current && currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      const model = builderRef.current.build({ ...char, shirtColor });
      sceneRef.current.add(model);
      currentModelRef.current = model;
      builderRef.current.setTalking(char.id, true);
      setTimeout(() => builderRef.current?.setTalking(char.id, false), 4000);
    }
  };

  const handleShirt = (color: number) => {
    setShirtColor(color);
    if (builderRef.current && sceneRef.current && currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      const model = builderRef.current.build({ ...selected, shirtColor: color });
      sceneRef.current.add(model);
      currentModelRef.current = model;
    }
  };

  const makeTalk = () => {
    builderRef.current?.setTalking(selected.id, true);
    setTimeout(() => builderRef.current?.setTalking(selected.id, false), 3000);
  };

  const makeGesture = (type: 'wave' | 'celebrate' | 'point' | 'shrug') => {
    builderRef.current?.gesture(selected.id, type);
  };

  const makeWalk = () => {
    builderRef.current?.setWalking(selected.id, true);
    setTimeout(() => builderRef.current?.setWalking(selected.id, false), 3000);
  };

  return (
    <div className="page">
      <h1>🎨 Creation Room</h1>
      <p className="form-note" style={{ marginBottom: '1.5rem' }}>
        Your 4 characters as real 3D models. They breathe, talk, gesture, and move.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div
          ref={mountRef}
          style={{ width: 600, maxWidth: '100%', height: 520, borderRadius: 20, overflow: 'hidden' }}
        />

        <div>
          <h3>Your Characters</h3>
          <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.2rem' }}>
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                onClick={() => handleSelect(char)}
                className="card"
                style={{
                  display: 'flex', gap: '0.8rem', alignItems: 'center',
                  cursor: 'pointer', padding: '0.7rem',
                  border: selected.id === char.id ? '2px solid var(--gold)' : undefined,
                }}
              >
                <img src={char.faceImg} alt={char.name}
                  style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{char.name}</div>
                  <div className="form-note" style={{ fontSize: '0.75rem' }}>{DESCRIPTIONS[char.id]}</div>
                </div>
              </div>
            ))}
          </div>

          <h3>Shirt</h3>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            {SHIRT_COLORS.map((c) => (
              <button key={c.name} onClick={() => handleShirt(c.value)}
                title={c.name}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `#${c.value.toString(16).padStart(6, '0')}`,
                  border: shirtColor === c.value ? '3px solid var(--gold)' : '2px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }} />
            ))}
          </div>

          <h3>Make Them Move</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={makeTalk}>🗣️ Talk</button>
            <button className="btn-secondary" onClick={makeWalk}>🚶 Walk</button>
            <button className="btn-secondary" onClick={() => makeGesture('wave')}>👋 Wave</button>
            <button className="btn-secondary" onClick={() => makeGesture('celebrate')}>🎉 Celebrate</button>
            <button className="btn-secondary" onClick={() => makeGesture('point')}>👉 Point</button>
            <button className="btn-secondary" onClick={() => makeGesture('shrug')}>🤷 Shrug</button>
          </div>
        </div>
      </div>
    </div>
  );
}
