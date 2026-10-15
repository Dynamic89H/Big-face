import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Engine3DProps {
  slot: string;
  style: Record<string, unknown>;
  width?: number;
  height?: number;
}

// Big Face 3D Engine — real-time 3D rendering powered by Three.js.
// Renders gear items as interactive 3D models users can rotate.
export default function Engine3D({ slot, style, width = 200, height = 200 }: Engine3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lighting — studio setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x00f0ff, 0.5);
    rim.position.set(-3, 2, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(0xff2fd6, 0.4, 20);
    fill.position.set(0, -2, 3);
    scene.add(fill);

    // Materials
    const metal = (style.metal as string) || 'gold';
    const color = (style.color as string) || '#c9a227';
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.95, roughness: 0.25 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.95, roughness: 0.25 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, metalness: 0.9, roughness: 0.35 });
    const fabricMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.8, metalness: 0.1 });
    const diamondMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f7ff, metalness: 0.1, roughness: 0.05, transmission: 0.9, ior: 2.4 });

    const matFor = () => {
      if (metal === 'gold') return goldMat;
      if (metal === 'silver') return silverMat;
      if (metal === 'steel') return steelMat;
      return goldMat;
    };

    const group = new THREE.Group();

    // Build 3D models per slot
    switch (slot) {
      case 'chain': {
        // Cuban link chain — torus links
        const mat = matFor();
        for (let i = 0; i < 14; i++) {
          const link = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 12, 24), mat);
          const angle = (i / 14) * Math.PI * 2;
          link.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9 - 0.2, 0);
          link.rotation.z = angle + Math.PI / 2;
          link.rotation.y = (i % 2) * Math.PI / 2;
          group.add(link);
        }
        if (style.medallion || style.iced) {
          const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24), mat);
          medallion.rotation.x = Math.PI / 2;
          medallion.position.set(0, -1.15, 0);
          group.add(medallion);
          if (style.iced) {
            const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), diamondMat);
            gem.position.set(0, -1.15, 0.08);
            group.add(gem);
          }
        }
        break;
      }
      case 'ring': {
        const mat = matFor();
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 16, 32), mat);
        group.add(band);
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), style.iced ? diamondMat : mat);
        gem.position.set(0, 0.5, 0);
        group.add(gem);
        break;
      }
      case 'watch': {
        const mat = matFor();
        const face = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.15, 32), mat);
        face.rotation.x = Math.PI / 2;
        group.add(face);
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.16, 32),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
        dial.rotation.x = Math.PI / 2;
        group.add(dial);
        // Hands
        const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xffffff }));
        hourHand.position.set(0, 0.05, 0.09);
        hourHand.rotation.z = -0.5;
        group.add(hourHand);
        // Strap
        const strapTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.08), mat);
        strapTop.position.set(0, 0.65, 0);
        group.add(strapTop);
        const strapBottom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.08), mat);
        strapBottom.position.set(0, -0.65, 0);
        group.add(strapBottom);
        break;
      }
      case 'earring': {
        const mat = matFor();
        const hook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI), mat);
        hook.position.set(0, 0.4, 0);
        group.add(hook);
        const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), style.iced ? diamondMat : mat);
        drop.position.set(0, 0, 0);
        group.add(drop);
        break;
      }
      case 'grill': {
        const mat = matFor();
        for (let i = 0; i < 6; i++) {
          const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), mat);
          tooth.position.set((i - 2.5) * 0.2, 0, 0);
          group.add(tooth);
        }
        break;
      }
      case 'hat': {
        const capMat = fabricMat;
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
        group.add(crown);
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24, 1, false, 0, Math.PI), capMat);
        brim.position.set(0, 0, 0.25);
        brim.rotation.x = 0.15;
        group.add(brim);
        break;
      }
      case 'top': {
        // 3D hoodie/jacket — torso + sleeves + hood
        const mat = fabricMat;
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.9, 16), mat);
        torso.position.y = 0;
        group.add(torso);
        // Sleeves
        [-1, 1].forEach((side) => {
          const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.7, 12), mat);
          sleeve.position.set(side * 0.55, 0.1, 0);
          sleeve.rotation.z = side * 0.25;
          group.add(sleeve);
        });
        // Hood
        const hood = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.12, 12, 24), mat);
        hood.position.set(0, 0.55, -0.05);
        group.add(hood);
        // Pocket
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.06), mat);
        pocket.position.set(0, -0.25, 0.42);
        group.add(pocket);
        // Drawstrings
        [-1, 1].forEach((side) => {
          const str = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8),
            new THREE.MeshStandardMaterial({ color: 0xdddddd }));
          str.position.set(side * 0.12, 0.35, 0.42);
          group.add(str);
        });
        break;
      }
      case 'bottom': {
        // 3D pants — waist + two legs
        const mat = fabricMat;
        const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.25, 16), mat);
        waist.position.y = 0.5;
        group.add(waist);
        [-1, 1].forEach((side) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.9, 12), mat);
          leg.position.set(side * 0.2, -0.05, 0);
          group.add(leg);
          // Cuff
          const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12),
            new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7) }));
          cuff.position.set(side * 0.2, -0.48, 0);
          group.add(cuff);
        });
        break;
      }
      case 'shoes': {
        // Realistic 3D sneaker — sole, upper, laces, swoosh-like accent
        const upperMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color), roughness: 0.6, metalness: 0.15,
        });
        const soleMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 });
        const accentMat = new THREE.MeshStandardMaterial({
          color: (style.brand as string) === 'jordan' ? 0xc1121f : 0x222222, roughness: 0.5,
        });

        // Sole
        const sole = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 1.0), soleMat);
        sole.position.y = -0.35;
        // Round the sole with a slightly larger midsole
        const midsole = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 1.0, 16), soleMat);
        midsole.rotation.x = Math.PI / 2;
        midsole.position.y = -0.35;
        midsole.scale.set(1, 1, 0.35);
        group.add(sole);

        // Upper — toe box (sphere squashed)
        const toeBox = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), upperMat);
        toeBox.scale.set(0.75, 0.55, 1.1);
        toeBox.position.set(0, -0.18, 0.28);
        group.add(toeBox);

        // Heel counter
        const heel = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), upperMat);
        heel.scale.set(0.8, 0.9, 0.8);
        heel.position.set(0, -0.1, -0.3);
        group.add(heel);

        // Ankle collar
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.09, 12, 20), upperMat);
        collar.position.set(0, 0.12, -0.28);
        collar.rotation.x = 0.3;
        group.add(collar);

        // Tongue
        const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.08), upperMat);
        tongue.position.set(0, 0.05, 0.02);
        tongue.rotation.x = -0.25;
        group.add(tongue);

        // Laces — 4 cross bars
        for (let i = 0; i < 4; i++) {
          const lace = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }));
          lace.rotation.z = Math.PI / 2;
          lace.position.set(0, -0.02 + i * 0.07, 0.12 - i * 0.035);
          lace.rotation.x = -0.2;
          group.add(lace);
        }

        // Side accent stripe
        [-1, 1].forEach((side) => {
          const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.5), accentMat);
          stripe.position.set(side * 0.2, -0.15, 0);
          stripe.rotation.y = side * 0.1;
          group.add(stripe);
        });

        if (style.shimmer) {
          const glow = new THREE.PointLight(0xffd700, 8, 3);
          glow.position.set(0, 0.3, 0.5);
          group.add(glow);
        }
        break;
      }
      case 'hair': {
        // 3D hair — volume based on length
        const hairMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color), roughness: 0.7, metalness: 0.05,
        });
        const length = (style.length as string) || 'medium';
        const hairBall = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), hairMat);
        hairBall.scale.set(1, 0.85, 1);
        hairBall.position.y = 0.25;
        group.add(hairBall);
        if (length === 'long') {
          [-1, 1].forEach((side) => {
            const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.7, 10), hairMat);
            lock.position.set(side * 0.32, -0.15, 0.05);
            lock.rotation.z = side * 0.12;
            group.add(lock);
          });
          const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.15), hairMat);
          back.position.set(0, -0.1, -0.3);
          group.add(back);
        } else if (length === 'medium') {
          const sides = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 14), hairMat);
          sides.scale.set(1.05, 0.7, 1.02);
          sides.position.y = 0.1;
          group.add(sides);
        }
        // Shine
        const shine = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 }));
        shine.position.set(-0.15, 0.45, 0.3);
        group.add(shine);
        break;
      }
      default: {
        // Generic gem for unknown slots
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), diamondMat);
        group.add(gem);
      }
    }

    scene.add(group);

    // Auto-rotate
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      group.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag to rotate
    let dragging = false;
    let prevX = 0, prevY = 0;
    const onDown = (e: PointerEvent) => { dragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      group.rotation.y += (e.clientX - prevX) * 0.01;
      group.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX; prevY = e.clientY;
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
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    };
  }, [slot, JSON.stringify(style)]);

  return (
    <div
      ref={mountRef}
      style={{
        width, height, display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'radial-gradient(circle at 50% 40%, rgba(0,240,255,0.06), transparent 70%)',
        borderRadius: 12, cursor: 'grab',
      }}
    />
  );
}
