import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GameLobbyProps {
  width?: number;
  height?: number;
  characterCount?: number;
}

/**
 * GameLobby — a real video game scene.
 * Multiple 3D hero characters walk around, idle, and interact in a neon arena.
 * This is what makes Big Face feel like a real game.
 */
export default function GameLobby({ width = 800, height = 500, characterCount = 5 }: GameLobbyProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.FogExp2(0x050508, 0.02);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // --- Arena ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 10, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    scene.add(key);

    // Neon arena lights
    const colors = [0x00f0ff, 0xff2fd6, 0xffc94d, 0x8b5cf6];
    colors.forEach((c, i) => {
      const light = new THREE.PointLight(c, 30, 25);
      const angle = (i / colors.length) * Math.PI * 2;
      light.position.set(Math.cos(angle) * 8, 3, Math.sin(angle) * 8);
      scene.add(light);
    });

    // Floor — dark with neon grid
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(12, 48),
      new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.3, metalness: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(24, 24, 0x00f0ff, 0x1a2a4a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    grid.position.y = 0.01;
    scene.add(grid);

    // Center platform
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 3, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: 0x151522, roughness: 0.4, metalness: 0.6 })
    );
    platform.position.y = 0.15;
    platform.receiveShadow = true;
    scene.add(platform);

    const platformRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.06, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0xc9a227 })
    );
    platformRing.rotation.x = Math.PI / 2;
    platformRing.position.y = 0.32;
    scene.add(platformRing);

    // --- Character factory ---
    const skinTones = [0x8d5524, 0xa0663a, 0xc68642, 0xe0ac69, 0xf1c27d];
    const shirtColors = [0x1a1a2e, 0x2e1a1a, 0x1a2e1a, 0x2a1a2e, 0x1a2a2e];

    interface Walker {
      group: THREE.Group;
      torso: THREE.Group;
      head: THREE.Group;
      leftLeg: THREE.Group;
      rightLeg: THREE.Group;
      leftArm: THREE.Group;
      rightArm: THREE.Group;
      target: THREE.Vector3;
      speed: number;
      state: 'walking' | 'idle' | 'dancing';
      stateTime: number;
      breathPhase: number;
    }

    function makeCharacter(skinTone: number, shirtColor: number): Walker {
      const group = new THREE.Group();
      const skin = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.6 });
      const shirt = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.75 });
      const pants = new THREE.MeshStandardMaterial({ color: 0x23262e, roughness: 0.8 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.3 });

      // Torso
      const torso = new THREE.Group();
      torso.position.y = 1.15;
      const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.55, 14), shirt);
      chest.castShadow = true;
      torso.add(chest);
      group.add(torso);

      // Head
      const head = new THREE.Group();
      head.position.y = 1.75;
      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 14), skin);
      skull.castShadow = true;
      head.add(skull);
      // Crown
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.1, 10), gold);
      crown.position.y = 0.22;
      head.add(crown);
      group.add(head);

      // Arms
      const makeArm = (side: number) => {
        const arm = new THREE.Group();
        arm.position.set(side * 0.38, 1.38, 0);
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 10), skin);
        upper.position.y = -0.18;
        upper.castShadow = true;
        arm.add(upper);
        const fist = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), skin);
        fist.position.y = -0.4;
        arm.add(fist);
        group.add(arm);
        return arm;
      };
      const leftArm = makeArm(-1);
      const rightArm = makeArm(1);

      // Legs
      const makeLeg = (side: number) => {
        const leg = new THREE.Group();
        leg.position.set(side * 0.15, 0.85, 0);
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.4, 10), pants);
        thigh.position.y = -0.2;
        thigh.castShadow = true;
        leg.add(thigh);
        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        boot.position.set(0, -0.42, 0.05);
        leg.add(boot);
        group.add(leg);
        return leg;
      };
      const leftLeg = makeLeg(-1);
      const rightLeg = makeLeg(1);

      scene.add(group);

      return {
        group, torso, head, leftLeg, rightLeg, leftArm, rightArm,
        target: new THREE.Vector3((Math.random() - 0.5) * 14, 0, (Math.random() - 0.5) * 14),
        speed: 1.2 + Math.random() * 0.8,
        state: 'walking',
        stateTime: 0,
        breathPhase: Math.random() * Math.PI * 2,
      };
    }

    const walkers: Walker[] = [];
    for (let i = 0; i < characterCount; i++) {
      const w = makeCharacter(
        skinTones[i % skinTones.length],
        shirtColors[i % shirtColors.length]
      );
      w.group.position.set((Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12);
      walkers.push(w);
    }

    // --- Animation loop ---
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      walkers.forEach((w) => {
        w.stateTime += dt;
        w.breathPhase += dt * 1.6;
        const breath = (Math.sin(w.breathPhase) + 1) / 2;

        // Breathing — always
        w.torso.scale.set(1 + breath * 0.05, 1 + breath * 0.07, 1 + breath * 0.05);

        // State machine
        if (w.stateTime > 4 + Math.random() * 3) {
          w.stateTime = 0;
          const r = Math.random();
          w.state = r < 0.5 ? 'walking' : r < 0.8 ? 'idle' : 'dancing';
          if (w.state === 'walking') {
            w.target.set((Math.random() - 0.5) * 14, 0, (Math.random() - 0.5) * 14);
          }
        }

        if (w.state === 'walking') {
          const dir = w.target.clone().sub(w.group.position);
          dir.y = 0;
          const dist = dir.length();
          if (dist < 0.5) {
            w.state = 'idle';
            w.stateTime = 0;
          } else {
            dir.normalize();
            w.group.position.addScaledVector(dir, w.speed * dt);
            w.group.rotation.y = Math.atan2(dir.x, dir.z);

            // Walk cycle — legs and arms swing
            const swing = Math.sin(t * 8 + w.breathPhase) * 0.5;
            w.leftLeg.rotation.x = swing;
            w.rightLeg.rotation.x = -swing;
            w.leftArm.rotation.x = -swing * 0.7;
            w.rightArm.rotation.x = swing * 0.7;
            // Bob
            w.group.position.y = Math.abs(Math.sin(t * 8)) * 0.05;
          }
        } else if (w.state === 'idle') {
          // Settle limbs
          w.leftLeg.rotation.x *= 0.9;
          w.rightLeg.rotation.x *= 0.9;
          w.leftArm.rotation.x *= 0.9;
          w.rightArm.rotation.x *= 0.9;
          w.group.position.y *= 0.9;
          // Look around
          w.head.rotation.y = Math.sin(t * 0.5 + w.breathPhase) * 0.4;
        } else {
          // Dancing — bounce and spin
          w.group.position.y = Math.abs(Math.sin(t * 6)) * 0.15;
          w.group.rotation.y += dt * 2;
          w.leftArm.rotation.z = -2.2 + Math.sin(t * 6) * 0.3;
          w.rightArm.rotation.z = 2.2 - Math.sin(t * 6) * 0.3;
          w.leftLeg.rotation.x = Math.sin(t * 6) * 0.3;
          w.rightLeg.rotation.x = -Math.sin(t * 6) * 0.3;
        }
      });

      // Camera slow orbit
      camera.position.x = Math.sin(t * 0.1) * 11;
      camera.position.z = Math.cos(t * 0.1) * 11;
      camera.lookAt(0, 1, 0);

      // Neon pulse
      platformRing.scale.setScalar(1 + Math.sin(t * 2) * 0.02);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [characterCount, width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width, height: Math.min(height, width * 0.625),
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(0,240,255,0.2)',
        boxShadow: '0 0 30px rgba(0,240,255,0.1)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 12, left: 16, zIndex: 1,
        display: 'flex', alignItems: 'center',
        background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 20,
        fontSize: '0.8rem', fontWeight: 700, color: '#ff5c5c',
        pointerEvents: 'none',
      }}>
        <span className="live-dot" /> LIVE — {characterCount} PLAYERS IN THE ARENA
      </div>
    </div>
  );
}
