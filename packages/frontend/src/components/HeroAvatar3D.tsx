import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroAvatar3DProps {
  width?: number;
  height?: number;
  skinTone?: string;
  shirtColor?: string;
}

/**
 * HeroAvatar3D — a brave 3D hero character rendered by the Big Face Engine.
 * Heroic pose: chest out, head high, arms strong. Fully rotatable.
 */
export default function HeroAvatar3D({
  width = 280, height = 380, skinTone = '#8d5524', shirtColor = '#1a1a2e',
}: HeroAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x00f0ff, 0.7);
    rim.position.set(-4, 3, -3);
    scene.add(rim);
    const under = new THREE.PointLight(0xffc94d, 6, 10);
    under.position.set(0, -1, 2);
    scene.add(under);

    // Materials
    const skin = new THREE.MeshStandardMaterial({ color: new THREE.Color(skinTone), roughness: 0.6 });
    const shirt = new THREE.MeshStandardMaterial({ color: new THREE.Color(shirtColor), roughness: 0.75 });
    const pants = new THREE.MeshStandardMaterial({ color: 0x23262e, roughness: 0.8 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.95, roughness: 0.25 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

    const hero = new THREE.Group();

    // --- Head (held high, brave) ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.95, 0);
    headGroup.rotation.x = -0.12; // chin up

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 20), skin);
    headGroup.add(head);

    // Jaw — strong
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.25), skin);
    jaw.position.set(0, -0.18, 0.05);
    headGroup.add(jaw);

    // Eyes — determined
    [-1, 1].forEach((s) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 }));
      eye.position.set(s * 0.1, 0.03, 0.24);
      headGroup.add(eye);
      // Brow — angled down (fierce)
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.03), dark);
      brow.position.set(s * 0.1, 0.12, 0.25);
      brow.rotation.z = s * -0.25;
      headGroup.add(brow);
    });

    // Crown — gold, kingly
    const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.12, 12), gold);
    crownBase.position.set(0, 0.28, 0);
    headGroup.add(crownBase);
    for (let i = 0; i < 6; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), gold);
      const a = (i / 6) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.2, 0.4, Math.sin(a) * 0.2);
      headGroup.add(spike);
    }

    hero.add(headGroup);

    // --- Neck ---
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 12), skin);
    neck.position.set(0, 1.62, 0);
    hero.add(neck);

    // --- Torso (chest out, brave) ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.15, 0);
    torsoGroup.rotation.x = -0.06; // chest pushed out

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.55, 16), shirt);
    torsoGroup.add(chest);

    // Pecs — defined
    [-1, 1].forEach((s) => {
      const pec = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), shirt);
      pec.scale.set(1, 0.7, 0.6);
      pec.position.set(s * 0.15, 0.15, 0.22);
      torsoGroup.add(pec);
    });

    // Gold chain
    const chainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.25, 0.2),
      new THREE.Vector3(0, -0.05, 0.32),
      new THREE.Vector3(0.25, 0.25, 0.2),
    ]);
    const chain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 20, 0.03, 8), gold);
    torsoGroup.add(chain);
    const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), gold);
    pendant.position.set(0, -0.08, 0.33);
    torsoGroup.add(pendant);

    hero.add(torsoGroup);

    // --- Arms (strong, slightly out — heroic stance) ---
    [-1, 1].forEach((s) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(s * 0.4, 1.38, 0);
      armGroup.rotation.z = s * -0.35; // arms out

      // Shoulder
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), shirt);
      armGroup.add(shoulder);

      // Bicep
      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.35, 12), skin);
      bicep.position.set(s * 0.08, -0.22, 0);
      bicep.rotation.z = s * 0.15;
      armGroup.add(bicep);

      // Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.32, 12), skin);
      forearm.position.set(s * 0.12, -0.52, 0.02);
      armGroup.add(forearm);

      // Fist — clenched, brave
      const fist = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), skin);
      fist.scale.set(0.9, 1.1, 0.9);
      fist.position.set(s * 0.13, -0.72, 0.03);
      armGroup.add(fist);

      hero.add(armGroup);
    });

    // --- Hips & Legs (wide heroic stance) ---
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.25, 14), pants);
    hips.position.set(0, 0.72, 0);
    hero.add(hips);

    [-1, 1].forEach((s) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(s * 0.18, 0.6, 0);
      legGroup.rotation.z = s * 0.12; // wide stance

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.4, 12), pants);
      thigh.position.y = -0.2;
      legGroup.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.38, 12), pants);
      shin.position.y = -0.58;
      legGroup.add(shin);

      // Boot
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.32), dark);
      boot.position.set(0, -0.82, 0.06);
      legGroup.add(boot);

      hero.add(legGroup);
    });

    // --- Ground glow ---
    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.9, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.15 })
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = -0.95;
    hero.add(glowDisc);

    scene.add(hero);

    // Heroic idle animation — breathing + subtle power stance sway
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // Breathing
      torsoGroup.scale.y = 1 + Math.sin(t * 1.5) * 0.015;
      torsoGroup.position.y = 1.15 + Math.sin(t * 1.5) * 0.01;
      // Head steady, looking forward
      headGroup.rotation.y = Math.sin(t * 0.4) * 0.08;
      // Slow heroic rotation
      hero.rotation.y += 0.004;
      // Cape-like energy shimmer on glow
      (glowDisc.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(t * 2) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Drag to rotate
    let dragging = false, px = 0;
    let autoRotate = true;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; autoRotate = false; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      hero.rotation.y += (e.clientX - px) * 0.01;
      px = e.clientX;
    };
    const onUp = () => {
      dragging = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // Resume auto-rotate in animate loop
    const origAnimate = animate;

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [skinTone, shirtColor]);

  return (
    <div
      ref={mountRef}
      style={{
        width, height, cursor: 'grab',
        background: 'radial-gradient(circle at 50% 60%, rgba(201,162,39,0.1), transparent 70%)',
        borderRadius: 16,
      }}
    />
  );
}
