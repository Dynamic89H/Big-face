import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterModelBuilder } from '../engine/CharacterModelBuilder';
import { useAuth } from '../auth/AuthContext';

interface RealTableSceneProps {
  width?: number;
  height?: number;
}

/**
 * RealTableScene — your 4 characters as real 3D models at the dice table.
 * They walk to the table, sit/stand, talk with moving jaws, gesture.
 * Built by Probus with the CharacterModelBuilder.
 */
export default function RealTableScene({ width = 800, height = 500 }: RealTableSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.Fog(0x060608, 18, 35);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const h = Math.min(height, width * 0.625);
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // Casino lighting
    scene.add(new THREE.AmbientLight(0x404060, 0.7));
    const key = new THREE.SpotLight(0xffe2b8, 180, 35, Math.PI / 4, 0.4);
    key.position.set(0, 12, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    scene.add(key.target);
    const colors = [0xff2d78, 0x00e5ff, 0xffd700];
    colors.forEach((color, i) => {
      const angle = (i / 3) * Math.PI * 2;
      const light = new THREE.PointLight(color, 25, 20);
      light.position.set(Math.cos(angle) * 10, 4, Math.sin(angle) * 10);
      scene.add(light);
    });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(25, 48),
      new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.25, metalness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Dice table
    const table = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.35, metalness: 0.15 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 1.3, 24), woodMat);
    pedestal.position.y = 0.65;
    pedestal.castShadow = true;
    table.add(pedestal);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.4, 48), woodMat);
    rail.position.y = 1.4;
    rail.castShadow = true;
    table.add(rail);
    const felt = new THREE.Mesh(
      new THREE.CylinderGeometry(2.9, 2.9, 0.42, 48),
      new THREE.MeshStandardMaterial({ color: 0x0e4d26, roughness: 0.95 })
    );
    felt.position.y = 1.41;
    felt.receiveShadow = true;
    table.add(felt);
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(3.15, 0.07, 12, 60),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 })
    );
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 1.62;
    table.add(trim);
    // Dice
    [-0.4, 0.4].forEach((x) => {
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15 })
      );
      die.position.set(x, 1.8, 0.2);
      die.rotation.set(0.4, 0.7, 0.3);
      die.castShadow = true;
      table.add(die);
    });
    scene.add(table);

    // Build your 4 characters
    const builder = new CharacterModelBuilder();
    const configs = [
      {
        id: 'boss', name: 'The Boss',
        faceImg: '/characters/media-generation-boss-tupac-style-0-5d243a54-3920-4154-9dba-d15d08166707.webp',
        skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x1a1a1a,
        build: 'athletic' as const, height: 1.0,
      },
      {
        id: 'diva', name: 'The Diva',
        faceImg: '/characters/media-generation-baddest-diva-0-4dd8b93e-0a39-47e6-9c40-5047e631e9c7.webp',
        skinTone: 0x5c3a1e, shirtColor: 0x8b0000, pantsColor: 0x1a1a1a,
        build: 'curvy' as const, height: 0.98,
      },
      {
        id: 'dreads', name: 'Dread Artist',
        faceImg: '/characters/media-generation-dread-tattoo-artist-0-1b72bd66-621d-4fab-becb-588d28bcae1f.webp',
        skinTone: 0x6b4226, shirtColor: 0xf5f5f5, pantsColor: 0x2a2a3a,
        build: 'slim' as const, height: 1.02,
      },
      {
        id: 'enforcer', name: 'The Enforcer',
        faceImg: '/characters/media-generation-muscle-fade-enforcer-0-4d0117a0-7509-4292-956f-7761c017424a.webp',
        skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x2a2a2a,
        build: 'muscular' as const, height: 1.05,
      },
    ];

    configs.forEach((config, i) => {
      const model = builder.build(config);
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const radius = 5.2;
      model.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      model.lookAt(0, 0, 0);
      scene.add(model);
    });

    // They walk in, then talk
    setTimeout(() => {
      configs.forEach((c, i) => {
        setTimeout(() => {
          builder.setWalking(c.id, true);
          setTimeout(() => {
            builder.setWalking(c.id, false);
            builder.setTalking(c.id, true);
            setTimeout(() => builder.setTalking(c.id, false), 3000);
          }, 2000);
        }, i * 800);
      });
    }, 1000);

    // Ambient life
    const ambient = setInterval(() => {
      const c = configs[Math.floor(Math.random() * configs.length)];
      const actions = ['talk', 'wave', 'celebrate'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      if (action === 'talk') {
        builder.setTalking(c.id, true);
        setTimeout(() => builder.setTalking(c.id, false), 2500);
      } else {
        builder.gesture(c.id, action as 'wave' | 'celebrate');
      }
    }, 8000);

    // Cinematic camera
    const clock = new THREE.Clock();
    let raf = 0;
    let camAngle = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      builder.update(dt);
      camAngle += dt * 0.1;
      const radius = 10 + Math.sin(t * 0.08) * 1.2;
      camera.position.set(Math.cos(camAngle) * radius, 4.2 + Math.sin(t * 0.12) * 0.6, Math.sin(camAngle) * radius);
      camera.lookAt(0, 1.6, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearInterval(ambient);
      cancelAnimationFrame(raf);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
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
        🎬 Your 4 characters — real 3D models, walking, talking, living
      </p>
    </div>
  );
}
