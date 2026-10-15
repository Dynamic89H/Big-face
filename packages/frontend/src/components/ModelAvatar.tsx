import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AvatarItem } from '../types';

interface Props {
  equipped: Record<string, AvatarItem | undefined>;
  facePhotoUrl?: string | null;
  profileColor?: string;
  size?: number;
}

const styleOf = (item?: AvatarItem): Record<string, string> => {
  const s = (item?.style ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(s)) if (typeof v === 'string') out[k] = v;
  return out;
};

/** Real-time 3D character built from Three.js primitives. Drag to rotate. */
export default function ModelAvatar({ equipped, facePhotoUrl, profileColor = '#0066FF', size = 300 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.55, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.15, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 1.75;

    // ---- Lights ----
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1c22, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4488ff, 0.7);
    rim.position.set(-4, 3, -3);
    scene.add(rim);

    // ---- Ground disc ----
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 48),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(profileColor), transparent: true, opacity: 0.35, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.35, 1.45, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(profileColor), transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    scene.add(ring);

    const char = new THREE.Group();
    scene.add(char);

    const skin = new THREE.MeshStandardMaterial({ color: 0x8d5a3b, roughness: 0.55 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.7 });
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      char.add(m);
      return m;
    };

    const hairStyle = styleOf(equipped['hair']);
    const topStyle = styleOf(equipped['top']);
    const bottomStyle = styleOf(equipped['bottom']);
    const shoesStyle = styleOf(equipped['shoes']);
    const chainStyle = styleOf(equipped['chain']);

    const topColor = new THREE.Color(topStyle.color || '#1d4ed8');
    const bottomColor = new THREE.Color(bottomStyle.color || '#23262e');
    const shoeColor = new THREE.Color(shoesStyle.color || '#ffffff');

    // ---- Legs ----
    const legMat = new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.8 });
    add(new THREE.CylinderGeometry(0.11, 0.13, 0.85, 16), legMat, -0.16, 0.47, 0);
    add(new THREE.CylinderGeometry(0.11, 0.13, 0.85, 16), legMat, 0.16, 0.47, 0);

    // ---- Shoes ----
    const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.35 });
    add(new THREE.BoxGeometry(0.22, 0.14, 0.42), shoeMat, -0.16, 0.07, 0.07);
    add(new THREE.BoxGeometry(0.22, 0.14, 0.42), shoeMat, 0.16, 0.07, 0.07);
    // Swoosh accent
    const swooshMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    add(new THREE.BoxGeometry(0.23, 0.04, 0.2), swooshMat, -0.16, 0.1, 0.05);
    add(new THREE.BoxGeometry(0.23, 0.04, 0.2), swooshMat, 0.16, 0.1, 0.05);

    // ---- Torso ----
    const torsoMat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.75 });
    add(new THREE.CylinderGeometry(0.26, 0.3, 0.75, 20), torsoMat, 0, 1.25, 0);

    // ---- Arms ----
    const armMat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.75 });
    const armL = add(new THREE.CylinderGeometry(0.075, 0.085, 0.62, 14), armMat, -0.4, 1.22, 0);
    armL.rotation.z = 0.18;
    const armR = add(new THREE.CylinderGeometry(0.075, 0.085, 0.62, 14), armMat, 0.4, 1.22, 0);
    armR.rotation.z = -0.18;
    // Hands
    add(new THREE.SphereGeometry(0.09, 14, 14), skin, -0.46, 0.88, 0);
    add(new THREE.SphereGeometry(0.09, 14, 14), skin, 0.46, 0.88, 0);

    // ---- Head ----
    const headGeo = new THREE.SphereGeometry(0.26, 32, 32);
    let headMat: THREE.Material;
    if (facePhotoUrl) {
      const tex = new THREE.TextureLoader().load(facePhotoUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      headMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 });
    } else {
      headMat = skin;
    }
    const head = add(headGeo, headMat, 0, 1.95, 0);

    // ---- Hair ----
    const hairColor = new THREE.Color(hairStyle.color || '#101010');
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
    const hairKind = (hairStyle.kind || 'fade').toLowerCase();
    if (hairKind.includes('dread') || hairKind.includes('braid')) {
      add(new THREE.SphereGeometry(0.27, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.2), hairMat, 0, 1.98, 0);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const strand = add(
          new THREE.CylinderGeometry(0.028, 0.022, 0.42, 8),
          hairMat,
          Math.cos(a) * 0.2, 1.78, Math.sin(a) * 0.2
        );
        strand.rotation.z = Math.cos(a) * 0.25;
        strand.rotation.x = -Math.sin(a) * 0.25;
      }
    } else if (hairKind.includes('curly') || hairKind.includes('afro')) {
      add(new THREE.SphereGeometry(0.3, 20, 16), hairMat, 0, 2.08, 0);
    } else {
      // fade / buzz — close cap
      add(new THREE.SphereGeometry(0.265, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.6), hairMat, 0, 1.97, 0);
    }

    // ---- Chain ----
    if (equipped['chain']) {
      const metal = (chainStyle.metal || 'gold').toLowerCase();
      const metalColor = metal.includes('platinum') || metal.includes('silver') ? 0xd8dde6 : 0xd4af37;
      const chainMat = new THREE.MeshStandardMaterial({ color: metalColor, metalness: 0.95, roughness: 0.25 });
      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.028, 12, 32), chainMat);
      chain.position.set(0, 1.58, 0.12);
      chain.rotation.x = Math.PI / 2 - 0.35;
      chain.castShadow = true;
      char.add(chain);
      // Medallion
      const med = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 20), chainMat);
      med.position.set(0, 1.42, 0.28);
      med.rotation.x = Math.PI / 2 - 0.2;
      med.castShadow = true;
      char.add(med);
    }

    // ---- Rings on fingers (simplified: on hands) ----
    if (equipped['ring']) {
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });
      const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16), ringMat);
      r1.position.set(-0.46, 0.86, 0.08);
      char.add(r1);
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16), ringMat);
      r2.position.set(0.46, 0.86, 0.08);
      char.add(r2);
    }

    // ---- Gentle idle animation ----
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      char.position.y = Math.sin(t * 1.6) * 0.03;
      head.rotation.y = Math.sin(t * 0.7) * 0.18;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      renderer.setSize(size, size);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div ref={mountRef} style={{ width: size, height: size, maxWidth: '100%', touchAction: 'none' }}>
      <p className="form-note" style={{ textAlign: 'center', margin: '0.3rem 0 0' }}>Drag to spin your character 🌀</p>
    </div>
  );
}
