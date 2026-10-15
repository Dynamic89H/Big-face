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
