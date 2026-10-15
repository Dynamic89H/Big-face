import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface CharacterConfig {
  gender: 'male' | 'female';
  skinTone: string;
  faceShape: 'round' | 'oval' | 'square' | 'heart';
  hairStyle: 'dreads' | 'fade' | 'afro' | 'bob' | 'locs' | 'pixie' | 'bald' | 'waves' | 'long' | 'ponytail';
  hairColor: string;
  eyeColor: string;
  eyeSize: number;
  browStyle: 'soft' | 'bold' | 'arched';
  lipColor: string;
  lipSize: number;
  facialHair: 'none' | 'goatee' | 'beard' | 'mustache';
  bodyType: 'slim' | 'athletic' | 'curvy' | 'heavy';
  height: number;
}

export const DEFAULT_CONFIG: CharacterConfig = {
  gender: 'male',
  skinTone: '#8d5524',
  faceShape: 'oval',
  hairStyle: 'dreads',
  hairColor: '#1a1a1a',
  eyeColor: '#2a1a0a',
  eyeSize: 1,
  browStyle: 'bold',
  lipColor: '#8a4a3a',
  lipSize: 1,
  facialHair: 'none',
  bodyType: 'athletic',
  height: 1,
};

interface CreatorEngineProps {
  config: CharacterConfig;
  width?: number;
  height?: number;
}

/**
 * CreatorEngine — the character creation engine.
 * Renders a fully customizable 3D character in real-time.
 * Every option updates the model instantly.
 */
export default function CreatorEngine({ config, width = 300, height = 440 }: CreatorEngineProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // Studio lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xfff5e6, 1.5);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcce6ff, 0.4);
    fill.position.set(-3, 2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd700, 0.3);
    rim.position.set(0, 4, -4);
    scene.add(rim);

    const character = new THREE.Group();
    scene.add(character);

    let headGroup: THREE.Group;
    let torsoGroup: THREE.Group;

    const buildCharacter = (cfg: CharacterConfig) => {
      // Clear previous
      while (character.children.length > 0) {
        const child = character.children[0];
        character.remove(child);
      }

      const skin = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.skinTone), roughness: 0.55 });
      const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.hairColor), roughness: 0.7 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.eyeColor), roughness: 0.2 });
      const lipMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.lipColor), roughness: 0.5 });

      const isFemale = cfg.gender === 'female';

      // Body proportions by gender and type
      const bodyScale = cfg.bodyType === 'slim' ? 0.88 : cfg.bodyType === 'heavy' ? 1.18 : cfg.bodyType === 'curvy' ? 1.05 : 1.0;
      const shoulderWidth = isFemale ? 0.82 : 1.0;
      const hipWidth = isFemale ? 1.18 : 1.0;
      const heightScale = cfg.height * (isFemale ? 0.96 : 1.0);

      // --- HEAD ---
      headGroup = new THREE.Group();
      headGroup.position.y = 2.05 * heightScale;

      // Face shape morphing
      const faceShapes = {
        round: [1.0, 0.95, 1.0],
        oval: [0.9, 1.1, 0.95],
        square: [1.05, 1.0, 0.95],
        heart: [1.05, 1.05, 0.9],
      };
      const fs = faceShapes[cfg.faceShape];
      const headGeo = new THREE.SphereGeometry(0.26, 32, 24);
      headGeo.scale(fs[0], fs[1], fs[2]);
      const head = new THREE.Mesh(headGeo, skin);
      head.castShadow = true;
      headGroup.add(head);

      // Eyes — larger for female
      const eyeScale = cfg.eyeSize * (isFemale ? 1.15 : 1.0);
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042 * eyeScale, 12, 10), eyeMat);
        eye.position.set(s * 0.095, 0.03, 0.225 * fs[2]);
        eye.scale.z = 0.6;
        headGroup.add(eye);
        // Eye shine
        const shine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }));
        shine.position.set(s * 0.095 + 0.015, 0.045, 0.245 * fs[2]);
        headGroup.add(shine);
      });

      // Brows
      const browStyles = {
        soft: { w: 0.11, h: 0.025, rot: 0 },
        bold: { w: 0.13, h: 0.035, rot: -0.12 },
        arched: { w: 0.12, h: 0.025, rot: -0.3 },
      };
      const bs = browStyles[cfg.browStyle];
      [-1, 1].forEach((s) => {
        const brow = new THREE.Mesh(new THREE.BoxGeometry(bs.w, bs.h, 0.02),
          new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.hairColor), roughness: 0.8 }));
        brow.position.set(s * 0.095, 0.115, 0.235 * fs[2]);
        brow.rotation.z = s * bs.rot;
        headGroup.add(brow);
      });

      // Nose
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 8), skin);
      nose.position.set(0, -0.04, 0.25 * fs[2]);
      nose.rotation.x = Math.PI / 2 - 0.2;
      headGroup.add(nose);

      // Lips — fuller for female
      const lips = new THREE.Mesh(new THREE.SphereGeometry(0.045 * cfg.lipSize, 12, 8), lipMat);
      lips.scale.set(1.4 * (isFemale ? 1.2 : 1.0), 0.5 * (isFemale ? 1.3 : 1.0), 0.5);
      lips.position.set(0, -0.13, 0.225 * fs[2]);
      headGroup.add(lips);

      // Facial hair — male only
      if (!isFemale && cfg.facialHair !== 'none') {
        const fhMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cfg.hairColor), roughness: 0.9 });
        if (cfg.facialHair === 'beard' || cfg.facialHair === 'goatee') {
          const beard = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), fhMat);
          beard.scale.set(1.1, 0.7, 0.8);
          beard.position.set(0, -0.2, 0.12);
          headGroup.add(beard);
        }
        if (cfg.facialHair === 'mustache' || cfg.facialHair === 'beard') {
          const mustache = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), fhMat);
          mustache.position.set(0, -0.095, 0.235 * fs[2]);
          headGroup.add(mustache);
        }
      }

      // Hair styles
      const hairGroup = new THREE.Group();
      if (cfg.hairStyle === 'dreads' || cfg.hairStyle === 'locs') {
        for (let i = 0; i < 10; i++) {
          const dread = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.5 + Math.random() * 0.2, 8), hairMat);
          const angle = (i / 10) * Math.PI * 2;
          dread.position.set(Math.cos(angle) * 0.18, -0.15, Math.sin(angle) * 0.18 - 0.05);
          dread.rotation.z = Math.cos(angle) * 0.2;
          dread.rotation.x = Math.sin(angle) * 0.2;
          hairGroup.add(dread);
        }
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), hairMat);
        top.scale.set(1, 0.6, 1);
        top.position.y = 0.18;
        hairGroup.add(top);
      } else if (cfg.hairStyle === 'afro') {
        const afro = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), hairMat);
        afro.position.y = 0.15;
        hairGroup.add(afro);
      } else if (cfg.hairStyle === 'fade') {
        const fade = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 14), hairMat);
        fade.scale.set(0.95, 0.45, 0.95);
        fade.position.y = 0.2;
        hairGroup.add(fade);
      } else if (cfg.hairStyle === 'bob') {
        const bob = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 14), hairMat);
        bob.scale.set(1.05, 1.0, 1.05);
        bob.position.y = 0.05;
        hairGroup.add(bob);
      } else if (cfg.hairStyle === 'pixie') {
        const pixie = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), hairMat);
        pixie.scale.set(1, 0.55, 1);
        pixie.position.y = 0.19;
        hairGroup.add(pixie);
      } else if (cfg.hairStyle === 'waves') {
        const waves = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 14), hairMat);
        waves.scale.set(1, 0.5, 1);
        waves.position.y = 0.19;
        hairGroup.add(waves);
        for (let i = 0; i < 8; i++) {
          const bump = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), hairMat);
          const a = (i / 8) * Math.PI * 2;
          bump.position.set(Math.cos(a) * 0.2, 0.26, Math.sin(a) * 0.2);
          hairGroup.add(bump);
        }
      } else if (cfg.hairStyle === 'long') {
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), hairMat);
        top.scale.set(1, 0.7, 1);
        top.position.y = 0.15;
        hairGroup.add(top);
        // Long flowing hair down the back and sides
        [-1, 1].forEach((s) => {
          const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.7, 10), hairMat);
          lock.position.set(s * 0.22, -0.25, -0.05);
          lock.rotation.z = s * 0.1;
          hairGroup.add(lock);
        });
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 0.12), hairMat);
        back.position.set(0, -0.25, -0.22);
        hairGroup.add(back);
      } else if (cfg.hairStyle === 'ponytail') {
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 14), hairMat);
        top.scale.set(1, 0.6, 1);
        top.position.y = 0.17;
        hairGroup.add(top);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.55, 10), hairMat);
        tail.position.set(0, -0.1, -0.28);
        tail.rotation.x = 0.3;
        hairGroup.add(tail);
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.02, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.8 }));
        tie.position.set(0, 0.15, -0.24);
        hairGroup.add(tie);
      }
      // bald = no hair
      headGroup.add(hairGroup);
      character.add(headGroup);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.2, 12), skin);
      neck.position.y = (2.05 * heightScale) - 0.32;
      character.add(neck);

      // --- TORSO ---
      torsoGroup = new THREE.Group();
      torsoGroup.position.y = 1.35 * heightScale;
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.30 * bodyScale * shoulderWidth, 0.24 * bodyScale, 0.65, 18),
        new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.8 })
      );
      torso.castShadow = true;
      torsoGroup.add(torso);

      // Female bust
      if (isFemale) {
        [-1, 1].forEach((s) => {
          const bust = new THREE.Mesh(new THREE.SphereGeometry(0.11 * bodyScale, 14, 12),
            new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.8 }));
          bust.scale.set(1, 0.85, 0.7);
          bust.position.set(s * 0.12, 0.12, 0.20);
          torsoGroup.add(bust);
        });
      }
      character.add(torsoGroup);

      // Arms — slimmer for female
      [-1, 1].forEach((s) => {
        const arm = new THREE.Group();
        arm.position.set(s * 0.36 * bodyScale * shoulderWidth, 1.62 * heightScale, 0);
        const armW = isFemale ? 0.85 : 1.0;
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * armW, 0.07 * armW, 0.34, 12), skin);
        upper.position.y = -0.17;
        upper.castShadow = true;
        arm.add(upper);
        const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 12), skin);
        fore.position.y = -0.48;
        arm.add(fore);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skin);
        hand.scale.set(0.8, 1.2, 0.6);
        hand.position.y = -0.68;
        arm.add(hand);
        character.add(arm);
      });

      // Legs — wider hips for female
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x23262e, roughness: 0.85 });
      [-1, 1].forEach((s) => {
        const leg = new THREE.Group();
        leg.position.set(s * 0.13 * bodyScale * hipWidth, 0.95 * heightScale, 0);
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.10 * bodyScale, 0.08 * bodyScale, 0.45, 12), pantsMat);
        thigh.position.y = -0.22;
        thigh.castShadow = true;
        leg.add(thigh);
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.075 * bodyScale, 0.06 * bodyScale, 0.42, 12), pantsMat);
        shin.position.y = -0.62;
        leg.add(shin);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.28),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }));
        shoe.position.set(0, -0.86, 0.05);
        leg.add(shoe);
        character.add(leg);
      });

      // Ground glow
      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(0.8, 32),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.1 })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.01;
      character.add(glow);
    };

    buildCharacter(configRef.current);

    // Rebuild when config changes
    let lastConfigStr = JSON.stringify(configRef.current);
    let raf = 0;
    const clock = new THREE.Clock();
    let breathPhase = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Rebuild if config changed
      const currentStr = JSON.stringify(configRef.current);
      if (currentStr !== lastConfigStr) {
        lastConfigStr = currentStr;
        buildCharacter(configRef.current);
      }

      breathPhase += dt * 1.5;
      const breath = (Math.sin(breathPhase) + 1) / 2;

      if (torsoGroup) {
        torsoGroup.scale.set(1 + breath * 0.03, 1 + breath * 0.04, 1 + breath * 0.03);
      }
      if (headGroup) {
        headGroup.rotation.y = Math.sin(t * 0.4) * 0.1;
        headGroup.position.y = (2.05 * configRef.current.height) + breath * 0.015;
      }

      character.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Drag to rotate
    let dragging = false, px = 0;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      character.rotation.y += (e.clientX - px) * 0.01;
      px = e.clientX;
    };
    const onUp = () => { dragging = false; };
    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width, height, margin: '0 auto', cursor: 'grab',
        background: 'radial-gradient(circle at 50% 60%, rgba(0,240,255,0.06), transparent 70%)',
        borderRadius: 20,
      }}
    />
  );
}
