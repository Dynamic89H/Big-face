import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePageTitle } from '../hooks/usePageTitle';

interface Character {
  id: string;
  name: string;
  img: string;
  description: string;
  skinTone: number;
  defaultShirt: number;
  defaultPants: number;
}

const CHARACTERS: Character[] = [
  {
    id: 'boss', name: 'The Boss',
    img: '/characters/media-generation-boss-tupac-style-0-5d243a54-3920-4154-9dba-d15d08166707.webp',
    description: 'Tupac-style. Bandana, all black, gold medallion, rings, left ear earring.',
    skinTone: 0x6b4226, defaultShirt: 0x1a1a1a, defaultPants: 0x1a1a1a,
  },
  {
    id: 'diva', name: 'The Baddest Diva',
    img: '/characters/media-generation-baddest-diva-0-4dd8b93e-0a39-47e6-9c40-5047e631e9c7.webp',
    description: 'Darker brown skin, long hair, hips, full lips. The baddest.',
    skinTone: 0x5c3a1e, defaultShirt: 0x8b0000, defaultPants: 0x1a1a1a,
  },
  {
    id: 'dreads', name: 'Dread Artist',
    img: '/characters/media-generation-dread-tattoo-artist-0-1b72bd66-621d-4fab-becb-588d28bcae1f.webp',
    description: 'Long dreads, tattoos, silver chain. Artistic vibe.',
    skinTone: 0x6b4226, defaultShirt: 0xf5f5f5, defaultPants: 0x2a2a3a,
  },
  {
    id: 'enforcer', name: 'The Enforcer',
    img: '/characters/media-generation-muscle-fade-enforcer-0-4d0117a0-7509-4292-956f-7761c017424a.webp',
    description: 'Built with muscles, fade haircut, gold rope chain.',
    skinTone: 0x6b4226, defaultShirt: 0x1a1a1a, defaultPants: 0x2a2a2a,
  },
];

const SHIRT_COLORS = [
  { name: 'Black', value: 0x1a1a1a },
  { name: 'White', value: 0xf5f5f5 },
  { name: 'Red', value: 0x8b0000 },
  { name: 'Blue', value: 0x1a3a6b },
  { name: 'Gold', value: 0xc9a227 },
  { name: 'Purple', value: 0x4a0a4a },
];

const CHAIN_OPTIONS = [
  { name: 'Gold Medallion', value: 'medallion' },
  { name: 'Cuban Link', value: 'cuban' },
  { name: 'Rope Chain', value: 'rope' },
  { name: 'None', value: 'none' },
];

/**
 * Creation Room — design your character in 3D.
 * Pick a base, customize the fit, see them live.
 */
export default function CreationRoomPage() {
  usePageTitle('Creation Room');
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(CHARACTERS[0]);
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0].value);
  const [chain, setChain] = useState('medallion');
  const sceneRef = useRef<{
    scene: THREE.Scene;
    character: THREE.Group | null;
    updateChain: (type: string) => void;
    updateShirt: (color: number) => void;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);

    const camera = new THREE.PerspectiveCamera(45, 600 / 500, 0.1, 100);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Studio lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.SpotLight(0xffffff, 100, 20, Math.PI / 6, 0.3);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.PointLight(0x8888ff, 20, 15);
    fill.position.set(-4, 3, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xffd700, 30, 15);
    rim.position.set(0, 4, -4);
    scene.add(rim);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8, 32),
      new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.4, metalness: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Turntable platform
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.4, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 })
    );
    platform.position.y = 0.075;
    platform.receiveShadow = true;
    scene.add(platform);

    const loader = new THREE.TextureLoader();
    let character: THREE.Group | null = null;
    let shirtMat: THREE.MeshStandardMaterial | null = null;
    let chainGroup: THREE.Group | null = null;

    const buildCharacter = (char: Character, shirt: number, chainType: string) => {
      if (character) scene.remove(character);
      character = new THREE.Group();

      const skinMat = new THREE.MeshStandardMaterial({ color: char.skinTone, roughness: 0.6 });
      shirtMat = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: char.defaultPants, roughness: 0.8 });

      // Legs
      [-0.22, 0.22].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 1, 12), pantsMat);
        leg.position.set(x, 0.65, 0);
        leg.castShadow = true;
        character!.add(leg);
        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.26, 0.14, 0.42),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })
        );
        shoe.position.set(x, 0.07, 0.07);
        shoe.castShadow = true;
        character!.add(shoe);
      });

      // Torso
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.33, 1, 16), shirtMat);
      torso.position.y = 1.65;
      torso.castShadow = true;
      character!.add(torso);

      // Arms
      [-1, 1].forEach((side) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.9, 10), shirtMat!);
        arm.position.set(side * 0.52, 1.6, 0);
        arm.rotation.z = side * 0.12;
        arm.castShadow = true;
        character!.add(arm);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), skinMat);
        hand.position.set(side * 0.58, 1.12, 0);
        hand.castShadow = true;
        character!.add(hand);
      });

      // Head with face texture
      loader.load(char.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 24, 24),
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
        );
        head.scale.set(0.85, 1.1, 0.9);
        head.position.y = 2.5;
        head.castShadow = true;
        character!.add(head);
      });
      // Placeholder
      const placeholder = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), skinMat);
      placeholder.scale.set(0.85, 1.1, 0.9);
      placeholder.position.y = 2.5;
      character!.add(placeholder);
      setTimeout(() => {
        if (character && character.children.length > 8) {
          character.remove(placeholder);
        }
      }, 2000);

      // Chain
      chainGroup = new THREE.Group();
      if (chainType !== 'none') {
        const chainMat = new THREE.MeshStandardMaterial({
          color: chainType === 'medallion' ? 0xffd700 : 0xc0c0c0,
          metalness: 1, roughness: 0.25,
        });
        const chainMesh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 24), chainMat);
        chainMesh.position.y = 2.05;
        chainMesh.rotation.x = Math.PI / 2 - 0.2;
        chainGroup.add(chainMesh);
        if (chainType === 'medallion') {
          const medallion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20),
            new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.15 })
          );
          medallion.position.set(0, 1.88, 0.26);
          medallion.rotation.x = Math.PI / 2 - 0.3;
          chainGroup.add(medallion);
        }
      }
      character.add(chainGroup);

      character.position.y = 0.15;
      scene.add(character);
    };

    buildCharacter(selected, shirtColor, chain);

    sceneRef.current = {
      scene,
      character,
      updateChain: (type: string) => buildCharacter(selected, shirtColor, type),
      updateShirt: (color: number) => {
        if (shirtMat) shirtMat.color.setHex(color);
      },
    };

    // Slow rotation (turntable)
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (character) {
        character.rotation.y = t * 0.4;
        // Breathing
        character.position.y = 0.15 + Math.sin(t * 1.5) * 0.02;
      }
      // Orbit camera slightly
      camera.position.x = Math.sin(t * 0.2) * 1.5;
      camera.lookAt(0, 1.5, 0);
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

  // Rebuild when character changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateChain(chain);
      sceneRef.current.updateShirt(shirtColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  const handleShirtChange = (color: number) => {
    setShirtColor(color);
    sceneRef.current?.updateShirt(color);
  };

  const handleChainChange = (type: string) => {
    setChain(type);
    sceneRef.current?.updateChain(type);
  };

  return (
    <div className="page">
      <h1>🎨 Creation Room</h1>
      <p className="form-note" style={{ marginBottom: '1.5rem' }}>
        Design your character in 3D. Pick a base, customize the fit.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* 3D Preview */}
        <div>
          <div
            ref={mountRef}
            style={{
              width: 600, maxWidth: '100%', height: 500,
              borderRadius: 20, overflow: 'hidden',
              background: '#0a0a12',
            }}
          />
        </div>

        {/* Customization */}
        <div>
          <h3>Choose Your Character</h3>
          <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                onClick={() => setSelected(char)}
                className="card"
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'center',
                  cursor: 'pointer', padding: '0.8rem',
                  border: selected.id === char.id ? '2px solid var(--gold)' : undefined,
                }}
              >
                <img
                  src={char.img}
                  alt={char.name}
                  style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{char.name}</div>
                  <div className="form-note" style={{ fontSize: '0.8rem' }}>{char.description}</div>
                </div>
              </div>
            ))}
          </div>

          <h3>Shirt Color</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {SHIRT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => handleShirtChange(c.value)}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `#${c.value.toString(16).padStart(6, '0')}`,
                  border: shirtColor === c.value ? '3px solid var(--gold)' : '2px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }}
                title={c.name}
              />
            ))}
          </div>

          <h3>Chain</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CHAIN_OPTIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => handleChainChange(c.value)}
                className={chain === c.value ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.5rem 1rem' }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
