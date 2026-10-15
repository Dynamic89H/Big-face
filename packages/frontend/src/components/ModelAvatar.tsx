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

/**
 * Game-style 3D character — smooth stylized humanoid like a console game avatar.
 * Drag to rotate. Equipped gear renders on the character.
 */
export default function ModelAvatar({ equipped, facePhotoUrl, profileColor = '#0066FF', size = 300 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = null;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0.4, 1.75, 4.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.25, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 1.7;

    // ---- Studio lighting (game-character look) ----
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x1a1c22, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -3; key.shadow.camera.right = 3;
    key.shadow.camera.top = 4; key.shadow.camera.bottom = -1;
    key.shadow.radius = 4;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.55);
    fill.position.set(-4, 2.5, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x88aaff, 1.0);
    rim.position.set(-2, 4, -4);
    scene.add(rim);

    // ---- Ground ----
    const accent = new THREE.Color(profileColor);
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 64),
      new THREE.MeshStandardMaterial({ color: accent.clone().multiplyScalar(0.35), transparent: true, opacity: 0.5, roughness: 0.85, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.5, 64),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    const char = new THREE.Group();
    scene.add(char);

    // ---- Materials ----
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x9c6b43, roughness: 0.5, metalness: 0.02 });
    const hairStyle = styleOf(equipped['hair']);
    const topStyle = styleOf(equipped['top']);
    const bottomStyle = styleOf(equipped['bottom']);
    const shoesStyle = styleOf(equipped['shoes']);
    const chainStyle = styleOf(equipped['chain']);

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = false;
      char.add(m);
      return m;
    };

    // ============ BODY — smooth game proportions ============
    // Hips
    const hipMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(bottomStyle.color || '#23262e'), roughness: 0.8 });
    add(new THREE.SphereGeometry(0.21, 24, 18), hipMat, 0, 0.98, 0).scale.set(1.15, 0.8, 0.9);

    // Legs — tapered capsules
    const legGeo = new THREE.CapsuleGeometry(0.095, 0.62, 8, 16);
    const legL = add(legGeo, hipMat, -0.13, 0.52, 0);
    const legR = add(legGeo, hipMat, 0.13, 0.52, 0);

    // Shoes — sleek sneakers
    const shoeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(shoesStyle.color || '#f5f5f5'), roughness: 0.3, metalness: 0.05 });
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.6 });
    for (const sx of [-0.13, 0.13]) {
      const shoe = add(new THREE.SphereGeometry(0.11, 20, 14), shoeMat, sx, 0.09, 0.06);
      shoe.scale.set(1, 0.72, 1.9);
      const sole = add(new THREE.SphereGeometry(0.112, 20, 14), soleMat, sx, 0.045, 0.06);
      sole.scale.set(1.02, 0.35, 1.92);
      // Lace detail
      const lace = add(new THREE.BoxGeometry(0.09, 0.02, 0.16), soleMat, sx, 0.15, 0.1);
      lace.rotation.x = -0.25;
    }

    // Torso — athletic, tapered
    const torsoMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(topStyle.color || '#1d4ed8'), roughness: 0.65 });
    const torso = add(new THREE.CapsuleGeometry(0.23, 0.5, 8, 24), torsoMat, 0, 1.32, 0);
    torso.scale.set(1.18, 1, 0.82);
    // Chest definition
    add(new THREE.SphereGeometry(0.16, 20, 14), torsoMat, -0.11, 1.48, 0.1).scale.set(1, 0.85, 0.7);
    add(new THREE.SphereGeometry(0.16, 20, 14), torsoMat, 0.11, 1.48, 0.1).scale.set(1, 0.85, 0.7);

    // Shoulders
    add(new THREE.SphereGeometry(0.105, 18, 14), torsoMat, -0.3, 1.56, 0);
    add(new THREE.SphereGeometry(0.105, 18, 14), torsoMat, 0.3, 1.56, 0);

    // Arms — natural hang with slight bend
    const armGeo = new THREE.CapsuleGeometry(0.068, 0.42, 8, 16);
    const armL = add(armGeo, torsoMat, -0.36, 1.28, 0.02);
    armL.rotation.z = 0.14; armL.rotation.x = -0.08;
    const armR = add(armGeo, torsoMat, 0.36, 1.28, 0.02);
    armR.rotation.z = -0.14; armR.rotation.x = -0.08;
    // Forearms (skin)
    const foreGeo = new THREE.CapsuleGeometry(0.058, 0.34, 8, 16);
    const foreL = add(foreGeo, skinMat, -0.42, 0.98, 0.05);
    foreL.rotation.z = 0.1; foreL.rotation.x = -0.15;
    const foreR = add(foreGeo, skinMat, 0.42, 0.98, 0.05);
    foreR.rotation.z = -0.1; foreR.rotation.x = -0.15;
    // Hands — rounded boxes
    const handGeo = new THREE.SphereGeometry(0.075, 16, 12);
    const handL = add(handGeo, skinMat, -0.45, 0.76, 0.09); handL.scale.set(0.85, 1.25, 0.9);
    const handR = add(handGeo, skinMat, 0.45, 0.76, 0.09); handR.scale.set(0.85, 1.25, 0.9);

    // Neck
    add(new THREE.CylinderGeometry(0.085, 0.095, 0.16, 16), skinMat, 0, 1.68, 0);

    // ============ HEAD — game character face ============
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.92, 0);
    char.add(headGroup);
    const hadd = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      headGroup.add(m);
      return m;
    };

    // Skull — slightly stylized
    let faceMat: THREE.Material = skinMat;
    if (facePhotoUrl) {
      const tex = new THREE.TextureLoader().load(facePhotoUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    }
    const skull = hadd(new THREE.SphereGeometry(0.21, 32, 24), faceMat, 0, 0.02, 0);
    skull.scale.set(0.92, 1.08, 0.98);
    // Jaw
    const jaw = hadd(new THREE.SphereGeometry(0.15, 24, 18), faceMat, 0, -0.13, 0.03);
    jaw.scale.set(0.82, 0.85, 0.88);

    if (!facePhotoUrl) {
      // Eyes — game style (white + iris + pupil)
      const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
      const irisMat = new THREE.MeshStandardMaterial({ color: 0x2b1a0e, roughness: 0.3 });
      for (const ex of [-0.075, 0.075]) {
        const eye = hadd(new THREE.SphereGeometry(0.032, 16, 12), eyeWhite, ex, 0.03, 0.175);
        eye.scale.set(1, 1.25, 0.55);
        const iris = hadd(new THREE.SphereGeometry(0.015, 12, 10), irisMat, ex, 0.028, 0.196);
        iris.scale.set(1, 1.3, 0.5);
      }
      // Brows
      const browMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.9 });
      for (const bx of [-0.075, 0.075]) {
        const brow = hadd(new THREE.BoxGeometry(0.07, 0.014, 0.02), browMat, bx, 0.095, 0.185);
        brow.rotation.z = bx < 0 ? 0.12 : -0.12;
      }
      // Nose
      const nose = hadd(new THREE.ConeGeometry(0.022, 0.05, 12), skinMat, 0, -0.02, 0.2);
      nose.rotation.x = Math.PI / 2 - 0.25;
      // Lips
      const lipMat = new THREE.MeshStandardMaterial({ color: 0x7a4a38, roughness: 0.55 });
      const lips = hadd(new THREE.SphereGeometry(0.028, 14, 10), lipMat, 0, -0.095, 0.165);
      lips.scale.set(1.5, 0.55, 0.6);
      // Ears
      for (const ex of [-0.195, 0.195]) {
        const ear = hadd(new THREE.SphereGeometry(0.035, 12, 10), skinMat, ex, -0.01, 0);
        ear.scale.set(0.55, 1, 0.7);
      }
    }

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hairStyle.color || '#101010'), roughness: 0.85 });
    const hairKind = (hairStyle.kind || 'fade').toLowerCase();
    if (hairKind.includes('dread') || hairKind.includes('braid')) {
      const cap = hadd(new THREE.SphereGeometry(0.215, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1), hairMat, 0, 0.045, -0.01);
      cap.scale.set(0.94, 1, 1);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const strand = hadd(new THREE.CapsuleGeometry(0.024, 0.34, 6, 10), hairMat, Math.cos(a) * 0.17, -0.12, Math.sin(a) * 0.17 - 0.01);
        strand.rotation.z = Math.cos(a) * 0.3;
        strand.rotation.x = -Math.sin(a) * 0.3 + 0.1;
      }
    } else if (hairKind.includes('curly') || hairKind.includes('afro')) {
      const afro = hadd(new THREE.SphereGeometry(0.25, 24, 18), hairMat, 0, 0.1, -0.02);
      afro.scale.set(1, 0.95, 1);
    } else {
      // Tapered fade
      const fade = hadd(new THREE.SphereGeometry(0.215, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2.35), hairMat, 0, 0.04, -0.012);
      fade.scale.set(0.94, 1.02, 1);
    }

    // ============ GEAR ============
    if (equipped['chain']) {
      const metal = (chainStyle.metal || 'gold').toLowerCase();
      const metalColor = metal.includes('platinum') || metal.includes('silver') ? 0xe8ecf2 : 0xd4af37;
      const chainMat = new THREE.MeshStandardMaterial({ color: metalColor, metalness: 1.0, roughness: 0.22 });
      // Chain draped on chest
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 1.62, 0.12),
        new THREE.Vector3(-0.1, 1.5, 0.24),
        new THREE.Vector3(0, 1.44, 0.27),
        new THREE.Vector3(0.1, 1.5, 0.24),
        new THREE.Vector3(0.2, 1.62, 0.12),
      ]);
      const chainMesh = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 32, 0.02, 10), chainMat);
      chainMesh.castShadow = true;
      char.add(chainMesh);
      // Link beads along chain
      for (let i = 0; i <= 12; i++) {
        const p = chainCurve.getPoint(i / 12);
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), chainMat);
        bead.position.copy(p);
        bead.castShadow = true;
        char.add(bead);
      }
      // Medallion
      const med = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.022, 24), chainMat);
      med.position.set(0, 1.36, 0.28);
      med.rotation.x = Math.PI / 2 - 0.15;
      med.castShadow = true;
      char.add(med);
      const gemMat = new THREE.MeshStandardMaterial({ color: 0xcc1122, roughness: 0.15, metalness: 0.3, emissive: 0x550000 });
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.028), gemMat);
      gem.position.set(0, 1.36, 0.3);
      char.add(gem);
    }

    if (equipped['ring']) {
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.25 });
      for (const hx of [-0.45, 0.45]) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.011, 10, 20), ringMat);
        r.position.set(hx, 0.73, 0.1);
        r.rotation.x = 0.3;
        char.add(r);
      }
    }

    if (equipped['earring']) {
      const eMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.25 });
      for (const ex of [-0.195, 0.195]) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), eMat);
        stud.position.set(ex * 1.05, 1.9, 0.02);
        headGroup.add(stud);
      }
    }

    // ============ Idle animation ============
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      char.position.y = Math.sin(t * 1.5) * 0.025;
      char.rotation.y = Math.sin(t * 0.35) * 0.12;
      headGroup.rotation.y = Math.sin(t * 0.6) * 0.14;
      headGroup.rotation.x = Math.sin(t * 0.45) * 0.04;
      // Breathing
      const br = 1 + Math.sin(t * 1.5) * 0.012;
      torso.scale.set(1.18 * br, 1, 0.82 * br);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => { const mm = x as THREE.MeshStandardMaterial; mm.map?.dispose(); x.dispose(); });
        else if (m) { const mm = m as THREE.MeshStandardMaterial; mm.map?.dispose(); m.dispose(); }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div ref={mountRef} style={{ width: size, height: size, maxWidth: '100%', touchAction: 'none', margin: '0 auto' }}>
      <p className="form-note" style={{ textAlign: 'center', margin: '0.3rem 0 0' }}>Drag to spin · built like a game character 🎮</p>
    </div>
  );
}
