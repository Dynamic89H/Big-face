import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { AvatarItem } from '../types';

interface RealisticAvatar3DProps {
  width?: number;
  height?: number;
  characterImg: string;
  characterName: string;
  skinTone?: string;
  equipped?: Record<string, AvatarItem>;
}

/**
 * RealisticAvatar3D — the user's actual character in realistic 3D.
 * Uses their chosen character photo as the face texture.
 * Shows their equipped gear: clothes, shoes, jewelry.
 * Brave heroic pose with visible breathing.
 */
export default function RealisticAvatar3D({
  width = 280, height = 400,
  characterImg, characterName, skinTone = '#8d5524',
  equipped = {},
}: RealisticAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 4.2);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // --- Studio lighting for realistic look ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xfff5e6, 1.6);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcce6ff, 0.5);
    fill.position.set(-4, 2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x00f0ff, 0.4);
    rim.position.set(0, 3, -4);
    scene.add(rim);

    // --- Load character face texture ---
    const textureLoader = new THREE.TextureLoader();
    let faceTexture: THREE.Texture | null = null;

    const skin = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinTone), roughness: 0.55, metalness: 0.05,
    });
    const gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.95, roughness: 0.25 });

    const hero = new THREE.Group();

    // Get equipped gear
    const top = equipped['top'];
    const bottom = equipped['bottom'];
    const shoes = equipped['shoes'];
    const chain = equipped['chain'];
    const hat = equipped['hat'];

    const shirtColor = top ? (top.style?.color as string || '#1a1a2e') : '#1a1a2e';
    const pantsColor = bottom ? (bottom.style?.color as string || '#23262e') : '#23262e';

    const shirt = new THREE.MeshStandardMaterial({ color: new THREE.Color(shirtColor), roughness: 0.8 });
    const pants = new THREE.MeshStandardMaterial({ color: new THREE.Color(pantsColor), roughness: 0.85 });

    // --- HEAD: realistic proportions, face texture ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.0, 0);
    headGroup.rotation.x = -0.08;

    // Skull — more realistic shape (slightly elongated)
    const headGeo = new THREE.SphereGeometry(0.26, 32, 24);
    headGeo.scale(0.92, 1.1, 0.98);
    const headMesh = new THREE.Mesh(headGeo, skin);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Face plane with character photo texture
    textureLoader.load(characterImg, (tex) => {
      faceTexture = tex;
      tex.colorSpace = THREE.SRGBColorSpace;
      const faceMat = new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.6, transparent: true,
      });
      // Curved face plane
      const faceGeo = new THREE.SphereGeometry(0.245, 24, 18, -0.6, 1.2, 1.1, 1.0);
      const face = new THREE.Mesh(faceGeo, faceMat);
      face.position.set(0, 0.02, 0.02);
      face.scale.set(0.92, 1.08, 0.98);
      headGroup.add(face);
    });

    // Neck — realistic
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.22, 16), skin);
    neck.position.set(0, -0.32, 0);
    headGroup.add(neck);

    hero.add(headGroup);

    // --- TORSO: athletic realistic build ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.35, 0);

    // Chest — tapered athletic torso
    const chestGeo = new THREE.CylinderGeometry(0.30, 0.24, 0.6, 20);
    const chest = new THREE.Mesh(chestGeo, shirt);
    chest.castShadow = true;
    torsoGroup.add(chest);

    // Shoulders — rounded
    [-1, 1].forEach((s) => {
      const delt = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), shirt);
      delt.position.set(s * 0.32, 0.25, 0);
      delt.scale.set(1, 0.85, 0.9);
      torsoGroup.add(delt);
    });

    // Chain — if equipped
    if (chain) {
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.22, 0.28, 0.18),
        new THREE.Vector3(0, -0.02, 0.28),
        new THREE.Vector3(0.22, 0.28, 0.18),
      ]);
      const chainMesh = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 24, 0.025, 8), gold);
      torsoGroup.add(chainMesh);
      const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), gold);
      pendant.position.set(0, -0.05, 0.29);
      torsoGroup.add(pendant);
    }

    hero.add(torsoGroup);

    // --- ARMS: realistic with elbows ---
    [-1, 1].forEach((s) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(s * 0.38, 1.58, 0);
      armGroup.rotation.z = s * -0.18;

      // Upper arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.32, 14), skin);
      upperArm.position.y = -0.16;
      upperArm.castShadow = true;
      armGroup.add(upperArm);

      // Elbow
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), skin);
      elbow.position.y = -0.32;
      armGroup.add(elbow);

      // Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.30, 14), skin);
      forearm.position.y = -0.47;
      forearm.castShadow = true;
      armGroup.add(forearm);

      // Hand — realistic (not a ball)
      const hand = new THREE.Group();
      hand.position.y = -0.64;
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.04), skin);
      hand.add(palm);
      // Fingers
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.07, 8), skin);
        finger.position.set(-0.033 + f * 0.022, -0.09, 0);
        hand.add(finger);
      }
      // Thumb
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.05, 8), skin);
      thumb.position.set(s * 0.055, -0.03, 0.01);
      thumb.rotation.z = s * 0.6;
      hand.add(thumb);
      armGroup.add(hand);

      hero.add(armGroup);
    });

    // --- HIPS & LEGS ---
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.28, 18), pants);
    hips.position.set(0, 0.92, 0);
    hips.castShadow = true;
    hero.add(hips);

    [-1, 1].forEach((s) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(s * 0.14, 0.80, 0);

      // Thigh
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.085, 0.42, 14), pants);
      thigh.position.y = -0.21;
      thigh.castShadow = true;
      legGroup.add(thigh);

      // Knee
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), pants);
      knee.position.y = -0.42;
      legGroup.add(knee);

      // Shin
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.40, 14), pants);
      shin.position.y = -0.62;
      shin.castShadow = true;
      legGroup.add(shin);

      // Shoe — realistic sneaker shape
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.85, 0.04);
      const shoeColor = shoes ? (shoes.style?.color as string || '#c1121f') : '#222222';
      const shoeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(shoeColor), roughness: 0.5 });
      const soleMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 });

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.30), soleMat);
      sole.position.y = -0.03;
      shoeGroup.add(sole);
      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), shoeMat);
      upper.scale.set(0.72, 0.55, 1.5);
      upper.position.set(0, 0.03, 0.03);
      upper.castShadow = true;
      shoeGroup.add(upper);
      legGroup.add(shoeGroup);

      hero.add(legGroup);
    });

    // --- Hat — if equipped ---
    if (hat) {
      const hatColor = (hat.style?.color as string) || '#111111';
      const hatMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hatColor), roughness: 0.8 });
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), hatMat);
      crown.position.set(0, 2.18, 0);
      crown.scale.set(0.95, 0.8, 0.95);
      hero.add(crown);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.03, 20, 1, false, 0, Math.PI), hatMat);
      brim.position.set(0, 2.18, 0.18);
      brim.rotation.x = 0.1;
      hero.add(brim);
    }

    // --- Ground shadow catcher ---
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.92;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Gold glow
    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.12 })
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = -0.91;
    scene.add(glowDisc);

    scene.add(hero);

    // --- REALISTIC BREATHING + IDLE ---
    let raf = 0;
    const clock = new THREE.Clock();
    let breathPhase = Math.random() * Math.PI * 2;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      breathPhase += dt * 1.6;
      const breath = (Math.sin(breathPhase) + Math.sin(breathPhase * 2.1 + 0.5) * 0.15 + 1.15) / 2.3;

      // Chest breathing — visible
      torsoGroup.scale.set(1 + breath * 0.06, 1 + breath * 0.08, 1 + breath * 0.06);
      torsoGroup.position.y = 1.35 + breath * 0.03;

      // Head subtle movement
      headGroup.position.y = 2.0 + breath * 0.015;
      headGroup.rotation.y = Math.sin(t * 0.3) * 0.08;

      // Slow rotation
      hero.rotation.y += 0.004;

      // Glow pulse
      (glowDisc.material as THREE.MeshBasicMaterial).opacity = 0.08 + breath * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    // Drag to rotate
    let dragging = false, px = 0;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      hero.rotation.y += (e.clientX - px) * 0.01;
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
      if (faceTexture) faceTexture.dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [characterImg, skinTone, JSON.stringify(equipped)]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={mountRef}
        style={{
          width, height, cursor: 'grab', margin: '0 auto',
          background: 'radial-gradient(circle at 50% 60%, rgba(201,162,39,0.08), transparent 70%)',
          borderRadius: 16,
        }}
      />
      <p style={{ fontWeight: 700, margin: '0.5rem 0 0', fontSize: '0.95rem' }}>{characterName}</p>
      <p className="form-note" style={{ margin: '0.2rem 0 0' }}>🎮 Drag to rotate • Realistic 3D</p>
    </div>
  );
}
