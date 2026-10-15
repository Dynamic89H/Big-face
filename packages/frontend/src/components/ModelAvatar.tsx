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
 * Big Face game avatar — stylized 3D character with proper proportions,
 * sculpted face, and gear that renders as real clothing.
 */
export default function ModelAvatar({ equipped, facePhotoUrl, profileColor = '#0066FF', size = 300 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0.3, 1.5, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.15, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 9;
    controls.maxPolarAngle = Math.PI / 1.7;

    // Lighting
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x14161c, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2.5, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 5;
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 5, bottom: -1 });
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.6);
    fill.position.set(-4, 2, 2.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x88aaff, 1.2);
    rim.position.set(-1.5, 4.5, -4);
    scene.add(rim);

    // Ground
    const accent = new THREE.Color(profileColor);
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 64),
      new THREE.MeshStandardMaterial({ color: accent.clone().multiplyScalar(0.3), transparent: true, opacity: 0.45, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.6, 64),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    const char = new THREE.Group();
    scene.add(char);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x9a6844, roughness: 0.55, metalness: 0.0 });
    const hairStyle = styleOf(equipped['hair']);
    const topStyle = styleOf(equipped['top']);
    const bottomStyle = styleOf(equipped['bottom']);
    const shoesStyle = styleOf(equipped['shoes']);
    const chainStyle = styleOf(equipped['chain']);

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = char, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };

    // ================= LEGS & PANTS =================
    // Organic leg shape via lathe — thigh to ankle taper
    const pantsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bottomStyle.color || '#2a2e38'), roughness: 0.85,
    });
    const legProfile: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12; // 0 = hip, 1 = ankle
      const r = 0.115 - t * 0.045 + Math.sin(t * Math.PI) * 0.015;
      legProfile.push(new THREE.Vector2(r, -t * 0.78));
    }
    const legGeo = new THREE.LatheGeometry(legProfile, 20);
    const legL = add(legGeo, pantsMat, char, -0.14, 0.88, 0);
    const legR = add(legGeo, pantsMat, char, 0.14, 0.88, 0);
    // Knee definition
    for (const sx of [-0.14, 0.14]) {
      const knee = add(new THREE.SphereGeometry(0.075, 14, 12), pantsMat, char, sx, 0.5, 0.045);
      knee.scale.set(1, 0.8, 0.8);
    }
    // Hips/pelvis
    const hips = add(new THREE.SphereGeometry(0.2, 24, 18), pantsMat, char, 0, 0.92, 0);
    hips.scale.set(1.12, 0.78, 0.88);

    // ================= SHOES — real sneaker shape =================
    const shoeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(shoesStyle.color || '#f2f2f2'), roughness: 0.35 });
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    const accentMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(profileColor), roughness: 0.4 });
    for (const sx of [-0.14, 0.14]) {
      // Main shoe body — elongated, with toe taper
      const shoe = add(new THREE.SphereGeometry(0.105, 22, 16), shoeMat, char, sx, 0.085, 0.07);
      shoe.scale.set(0.95, 0.68, 1.85);
      // Toe cap
      const toe = add(new THREE.SphereGeometry(0.085, 18, 14), shoeMat, char, sx, 0.06, 0.21);
      toe.scale.set(0.9, 0.55, 1);
      // Sole
      const sole = add(new THREE.SphereGeometry(0.108, 22, 16), soleMat, char, sx, 0.032, 0.07);
      sole.scale.set(0.97, 0.32, 1.88);
      // Heel counter
      const heel = add(new THREE.SphereGeometry(0.08, 16, 12), shoeMat, char, sx, 0.12, -0.08);
      heel.scale.set(0.85, 1, 0.8);
      // Ankle collar
      const collar = add(new THREE.TorusGeometry(0.055, 0.022, 10, 18), soleMat, char, sx, 0.17, -0.03);
      collar.rotation.x = Math.PI / 2 - 0.3;
      // Laces — 3 bars
      for (let li = 0; li < 3; li++) {
        const lace = add(new THREE.BoxGeometry(0.075, 0.012, 0.018), soleMat, char, sx, 0.135 - li * 0.012, 0.1 + li * 0.035);
        lace.rotation.x = -0.35;
      }
      // Side stripe in profile color
      const stripe = add(new THREE.BoxGeometry(0.012, 0.035, 0.16), accentMat, char, sx + (sx < 0 ? -0.095 : 0.095), 0.09, 0.05);
      stripe.rotation.z = sx < 0 ? 0.1 : -0.1;
    }

    // ================= TORSO — shirt as garment =================
    const shirtMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(topStyle.color || '#1d4ed8'), roughness: 0.75 });
    // Shirt body — lathe with chest/waist shaping
    const shirtProfile: THREE.Vector2[] = [];
    const shirtPts: [number, number][] = [
      [0.20, 0], [0.215, 0.08], [0.205, 0.18], [0.225, 0.32], // waist to chest
      [0.245, 0.45], [0.23, 0.55], [0.19, 0.62], [0.10, 0.66], // chest to neck
    ];
    for (const [r, y] of shirtPts) shirtProfile.push(new THREE.Vector2(r, y));
    const shirtGeo = new THREE.LatheGeometry(shirtProfile, 28);
    const shirt = add(shirtGeo, shirtMat, char, 0, 1.0, 0);
    shirt.scale.set(1.15, 1, 0.85);
    // Shirt hem (slightly flared)
    const hem = add(new THREE.TorusGeometry(0.205, 0.018, 10, 28), shirtMat, char, 0, 1.0, 0);
    hem.rotation.x = Math.PI / 2;
    hem.scale.set(1.15, 0.85, 1);
    // Collar
    const collar = add(new THREE.TorusGeometry(0.095, 0.02, 10, 24), shirtMat, char, 0, 1.64, 0);
    collar.rotation.x = Math.PI / 2 - 0.12;
    collar.scale.set(1.1, 0.9, 1);

    // ================= ARMS =================
    // Upper arm (sleeve)
    const sleeveGeo = new THREE.CapsuleGeometry(0.075, 0.2, 8, 16);
    // Forearm (skin) — tapered
    const foreProfile: THREE.Vector2[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      foreProfile.push(new THREE.Vector2(0.062 - t * 0.018, -t * 0.32));
    }
    const foreGeo = new THREE.LatheGeometry(foreProfile, 16);

    for (const s of [-1, 1]) {
      // Shoulder cap (shirt)
      const sh = add(new THREE.SphereGeometry(0.095, 18, 14), shirtMat, char, s * 0.3, 1.56, 0);
      sh.scale.set(1, 1.1, 1);
      // Upper arm
      const ua = add(sleeveGeo, shirtMat, char, s * 0.36, 1.38, 0.01);
      ua.rotation.z = s * -0.12;
      // Elbow
      add(new THREE.SphereGeometry(0.06, 14, 12), skinMat, char, s * 0.385, 1.22, 0.02);
      // Forearm
      const fa = add(foreGeo, skinMat, char, s * 0.40, 1.20, 0.03);
      fa.rotation.z = s * -0.08;
      fa.rotation.x = -0.12;
      // Hand — proper shape with fingers hint
      const hand = add(new THREE.SphereGeometry(0.062, 16, 12), skinMat, char, s * 0.42, 0.86, 0.07);
      hand.scale.set(0.8, 1.35, 0.9);
      // Thumb
      const thumb = add(new THREE.CapsuleGeometry(0.018, 0.05, 6, 10), skinMat, char, s * 0.385, 0.88, 0.1);
      thumb.rotation.z = s * 0.7;
      thumb.rotation.x = -0.3;
      // Finger separations (subtle grooves via 3 small capsules)
      for (let fi = 0; fi < 3; fi++) {
        const fx = s * 0.42 + (fi - 1) * 0.028;
        const finger = add(new THREE.CapsuleGeometry(0.016, 0.055, 6, 10), skinMat, char, fx, 0.795, 0.075);
        finger.rotation.x = 0.15;
      }
    }

    // Neck — trapezius blend
    const neck = add(new THREE.CylinderGeometry(0.075, 0.095, 0.18, 16), skinMat, char, 0, 1.70, 0);
    const trapL = add(new THREE.SphereGeometry(0.09, 14, 12), shirtMat, char, -0.14, 1.62, 0);
    trapL.scale.set(1.2, 0.6, 0.9);
    const trapR = add(new THREE.SphereGeometry(0.09, 14, 12), shirtMat, char, 0.14, 1.62, 0);
    trapR.scale.set(1.2, 0.6, 0.9);

    // ================= HEAD — sculpted =================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.94, 0);
    char.add(headGroup);
    const hadd = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      headGroup.add(m);
      return m;
    };

    let faceMat: THREE.Material = skinMat;
    if (facePhotoUrl) {
      const tex = new THREE.TextureLoader().load(facePhotoUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    }

    // Cranium — egg-shaped, wider at back
    const cranium = hadd(new THREE.SphereGeometry(0.2, 36, 28), faceMat, 0, 0.03, -0.01);
    cranium.scale.set(0.88, 1.05, 0.95);
    // Face plane — flatter front
    const facePlane = hadd(new THREE.SphereGeometry(0.175, 28, 22), faceMat, 0, -0.01, 0.045);
    facePlane.scale.set(0.82, 0.95, 0.82);
    // Jaw — defined chin
    const jaw = hadd(new THREE.SphereGeometry(0.13, 24, 18), faceMat, 0, -0.13, 0.05);
    jaw.scale.set(0.75, 0.8, 0.8);
    // Chin
    hadd(new THREE.SphereGeometry(0.05, 14, 12), faceMat, 0, -0.20, 0.09).scale.set(1, 0.7, 0.8);
    // Cheekbones
    for (const cx of [-0.10, 0.10]) {
      const cheek = hadd(new THREE.SphereGeometry(0.045, 12, 10), faceMat, cx, -0.03, 0.13);
      cheek.scale.set(1, 0.8, 0.7);
    }
    // Brow ridge
    const browRidge = hadd(new THREE.SphereGeometry(0.09, 16, 12), faceMat, 0, 0.055, 0.15);
    browRidge.scale.set(1.35, 0.45, 0.6);

    if (!facePhotoUrl) {
      // Eye sockets (subtle indent via darker material behind eyes)
      const socketMat = new THREE.MeshStandardMaterial({ color: 0x8a5c3c, roughness: 0.6 });
      for (const ex of [-0.068, 0.068]) {
        const socket = hadd(new THREE.SphereGeometry(0.038, 14, 12), socketMat, ex, 0.02, 0.155);
        socket.scale.set(1, 0.85, 0.5);
        // Eyeball
        const eye = hadd(new THREE.SphereGeometry(0.028, 18, 14),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }), ex, 0.02, 0.165);
        eye.scale.set(1, 1.15, 0.6);
        // Iris
        const iris = hadd(new THREE.SphereGeometry(0.013, 14, 12),
          new THREE.MeshStandardMaterial({ color: 0x2a1a0c, roughness: 0.2 }), ex, 0.018, 0.185);
        iris.scale.set(1, 1.2, 0.5);
        // Catchlight
        hadd(new THREE.SphereGeometry(0.004, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }), ex + 0.004, 0.026, 0.192);
        // Upper eyelid line
        const lid = hadd(new THREE.BoxGeometry(0.055, 0.008, 0.01),
          new THREE.MeshStandardMaterial({ color: 0x6b4530, roughness: 0.7 }), ex, 0.048, 0.172);
        lid.rotation.z = ex < 0 ? 0.08 : -0.08;
      }
      // Eyebrows — shaped
      const browMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.95 });
      for (const bx of [-0.068, 0.068]) {
        const brow = hadd(new THREE.BoxGeometry(0.075, 0.016, 0.025), browMat, bx, 0.085, 0.163);
        brow.rotation.z = bx < 0 ? 0.14 : -0.14;
        brow.rotation.y = bx < 0 ? -0.15 : 0.15;
      }
      // Nose — bridge + tip + nostrils
      const noseBridge = hadd(new THREE.BoxGeometry(0.032, 0.07, 0.03), faceMat, 0, 0.0, 0.175);
      noseBridge.rotation.x = 0.12;
      const noseTip = hadd(new THREE.SphereGeometry(0.028, 14, 12), faceMat, 0, -0.038, 0.185);
      noseTip.scale.set(1.15, 0.85, 1);
      const nostrilMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1e, roughness: 0.8 });
      for (const nx of [-0.018, 0.018]) {
        hadd(new THREE.SphereGeometry(0.008, 8, 8), nostrilMat, nx, -0.048, 0.192);
      }
      // Lips — upper and lower
      const lipMat = new THREE.MeshStandardMaterial({ color: 0x8a5040, roughness: 0.5 });
      const upperLip = hadd(new THREE.SphereGeometry(0.026, 14, 10), lipMat, 0, -0.088, 0.155);
      upperLip.scale.set(1.6, 0.45, 0.6);
      const lowerLip = hadd(new THREE.SphereGeometry(0.024, 14, 10),
        new THREE.MeshStandardMaterial({ color: 0x9a5c48, roughness: 0.45 }), 0, -0.105, 0.152);
      lowerLip.scale.set(1.4, 0.55, 0.6);
      // Ears — proper shape
      for (const ex of [-0.178, 0.178]) {
        const ear = hadd(new THREE.SphereGeometry(0.038, 14, 12), faceMat, ex, -0.02, 0.01);
        ear.scale.set(0.45, 1, 0.65);
        const innerEar = hadd(new THREE.SphereGeometry(0.02, 10, 8),
          new THREE.MeshStandardMaterial({ color: 0x7a4f36, roughness: 0.7 }), ex * 0.98, -0.02, 0.015);
        innerEar.scale.set(0.4, 0.9, 0.5);
      }
    }

    // ================= HAIR =================
    const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hairStyle.color || '#0e0e0e'), roughness: 0.9 });
    const hairKind = (hairStyle.kind || 'fade').toLowerCase();
    if (hairKind.includes('dread') || hairKind.includes('braid')) {
      const cap = hadd(new THREE.SphereGeometry(0.205, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2.0), hairMat, 0, 0.05, -0.015);
      cap.scale.set(0.9, 1, 0.97);
      // Locs with varied length
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const len = 0.28 + (i % 3) * 0.08;
        const strand = hadd(new THREE.CapsuleGeometry(0.022, len, 6, 10), hairMat,
          Math.cos(a) * 0.16, -0.08 - len * 0.3, Math.sin(a) * 0.16 - 0.015);
        strand.rotation.z = Math.cos(a) * 0.28;
        strand.rotation.x = -Math.sin(a) * 0.28 + 0.08;
      }
    } else if (hairKind.includes('curly') || hairKind.includes('afro')) {
      // Layered curls for volume
      const base = hadd(new THREE.SphereGeometry(0.23, 28, 20), hairMat, 0, 0.10, -0.02);
      base.scale.set(1.02, 0.95, 1.02);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const curl = hadd(new THREE.SphereGeometry(0.055, 12, 10), hairMat,
          Math.cos(a) * 0.19, 0.14 + Math.sin(i * 2.3) * 0.04, Math.sin(a) * 0.19 - 0.02);
      }
      hadd(new THREE.SphereGeometry(0.06, 12, 10), hairMat, 0, 0.28, -0.02);
    } else if (hairKind.includes('wave') || hairKind.includes('long')) {
      const cap = hadd(new THREE.SphereGeometry(0.205, 28, 18, 0, Math.PI * 2, 0, Math.PI / 1.9), hairMat, 0, 0.05, -0.02);
      cap.scale.set(0.9, 1.05, 0.97);
      for (const wx of [-0.14, 0.14]) {
        const wave = hadd(new THREE.CapsuleGeometry(0.035, 0.22, 6, 10), hairMat, wx, -0.05, -0.03);
        wave.rotation.z = wx * 1.2;
      }
    } else {
      // Sharp fade — tight on sides, textured top
      const fade = hadd(new THREE.SphereGeometry(0.202, 30, 20, 0, Math.PI * 2, 0, Math.PI / 2.3), hairMat, 0, 0.045, -0.012);
      fade.scale.set(0.89, 1.0, 0.96);
      // Textured top
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const tuft = hadd(new THREE.ConeGeometry(0.028, 0.06, 8), hairMat,
          Math.cos(a) * 0.09, 0.20, Math.sin(a) * 0.09 - 0.01);
        tuft.rotation.x = -Math.sin(a) * 0.3;
        tuft.rotation.z = Math.cos(a) * 0.3;
      }
      // Lineup — sharp hairline
      const lineup = hadd(new THREE.BoxGeometry(0.19, 0.018, 0.02), hairMat, 0, 0.10, 0.155);
      lineup.rotation.x = -0.15;
    }

    // ================= JEWELRY =================
    if (equipped['chain']) {
      const metal = (chainStyle.metal || 'gold').toLowerCase();
      const metalColor = metal.includes('platinum') || metal.includes('silver') ? 0xe8ecf2 : 0xd4af37;
      const chainMat = new THREE.MeshStandardMaterial({ color: metalColor, metalness: 1.0, roughness: 0.18 });
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.19, 1.66, 0.10),
        new THREE.Vector3(-0.11, 1.54, 0.22),
        new THREE.Vector3(0, 1.47, 0.26),
        new THREE.Vector3(0.11, 1.54, 0.22),
        new THREE.Vector3(0.19, 1.66, 0.10),
      ]);
      const chainMesh = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 40, 0.016, 10), chainMat);
      chainMesh.castShadow = true;
      char.add(chainMesh);
      // Cuban link beads
      for (let i = 0; i <= 16; i++) {
        const p = chainCurve.getPoint(i / 16);
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.023, 10, 8), chainMat);
        bead.position.copy(p);
        bead.scale.set(1, 0.75, 1);
        bead.rotation.y = i * 0.4;
        bead.castShadow = true;
        char.add(bead);
      }
      // Medallion with gem
      const med = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 28), chainMat);
      med.position.set(0, 1.385, 0.265);
      med.rotation.x = Math.PI / 2 - 0.12;
      med.castShadow = true;
      char.add(med);
      const medRim = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 8, 28), chainMat);
      medRim.position.copy(med.position);
      medRim.rotation.x = 0.12;
      char.add(medRim);
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.026),
        new THREE.MeshStandardMaterial({ color: 0xd01030, roughness: 0.1, metalness: 0.4, emissive: 0x660011 }));
      gem.position.set(0, 1.385, 0.282);
      char.add(gem);
    }

    if (equipped['ring']) {
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.2 });
      for (const hx of [-0.42, 0.42]) {
        for (const fz of [0, 1]) {
          const r = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.007, 8, 18), ringMat);
          r.position.set(hx + (fz === 0 ? -0.028 : 0.028), 0.80, 0.078);
          r.rotation.x = 0.25;
          char.add(r);
        }
      }
    }

    if (equipped['earring']) {
      const eMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.2 });
      for (const ex of [-0.178, 0.178]) {
        const stud = new THREE.Mesh(new THREE.OctahedronGeometry(0.016), eMat);
        stud.position.set(ex * 1.02, 1.925, 0.02);
        headGroup.add(stud);
      }
    }

    // Grill (gold teeth)
    if (equipped['grill']) {
      const grillMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.25 });
      const grill = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.018, 0.012), grillMat);
      grill.position.set(0, -0.098, 0.158);
      grill.rotation.x = 0.1;
      headGroup.add(grill);
    }

    // ================= ANIMATION =================
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      char.position.y = Math.sin(t * 1.4) * 0.022;
      char.rotation.y = Math.sin(t * 0.3) * 0.1;
      headGroup.rotation.y = Math.sin(t * 0.55) * 0.13;
      headGroup.rotation.x = Math.sin(t * 0.4) * 0.035;
      const br = 1 + Math.sin(t * 1.4) * 0.01;
      shirt.scale.set(1.15 * br, 1, 0.85 * br);
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
        const disposeMat = (x: THREE.Material) => {
          const mm = x as THREE.MeshStandardMaterial;
          if (mm.map) mm.map.dispose();
          x.dispose();
        };
        if (Array.isArray(m)) m.forEach(disposeMat);
        else if (m) disposeMat(m);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div ref={mountRef} style={{ width: size, height: size, maxWidth: '100%', touchAction: 'none', margin: '0 auto' }}>
      <p className="form-note" style={{ textAlign: 'center', margin: '0.3rem 0 0' }}>Drag to spin your character 🎮</p>
    </div>
  );
}
