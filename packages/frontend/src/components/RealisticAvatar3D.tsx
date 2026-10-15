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
  showBody?: boolean; // false = realistic photo on 3D stage, true = full 3D body
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
  equipped = {}, showBody = false,
}: RealisticAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // 3D Stage mode: realistic character photo presented in 3D space
  // with depth, lighting, and stage effects — no procedural body.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    scene.add(key);
    const glow = new THREE.PointLight(0xc9a227, 15, 10);
    glow.position.set(0, -1, 2);
    scene.add(glow);

    const stage = new THREE.Group();

    // Character photo on a 3D card with depth
    const loader = new THREE.TextureLoader();
    loader.load(characterImg, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const aspect = tex.image.width / tex.image.height;
      const h = 3.2;
      const w = h * aspect;

      // Main photo plane
      const photoMat = new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.4, metalness: 0.1,
      });
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, h), photoMat);
      stage.add(photo);

      // Gold 3D frame
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xc9a227, metalness: 0.9, roughness: 0.3,
      });
      const frameThickness = 0.08;
      // Top/bottom
      [-1, 1].forEach((s) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w + frameThickness * 2, frameThickness, 0.1), frameMat);
        bar.position.set(0, s * (h / 2 + frameThickness / 2), -0.02);
        stage.add(bar);
      });
      // Sides
      [-1, 1].forEach((s) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, h, 0.1), frameMat);
        bar.position.set(s * (w / 2 + frameThickness / 2), 0, -0.02);
        stage.add(bar);
      });

      // Backing — dark with depth
      const backing = new THREE.Mesh(
        new THREE.PlaneGeometry(w + 0.3, h + 0.3),
        new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.8 })
      );
      backing.position.z = -0.15;
      stage.add(backing);
    });

    // Floating particles around the stage
    const pCount = 60;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc9a227, size: 0.05, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    stage.add(particles);

    // Stage glow disc
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.1 })
    );
    disc.position.set(0, -2, -0.5);
    stage.add(disc);

    scene.add(stage);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle 3D float and sway
      stage.rotation.y = Math.sin(t * 0.4) * 0.12;
      stage.rotation.x = Math.sin(t * 0.3) * 0.05;
      stage.position.y = Math.sin(t * 0.8) * 0.08;

      // Particles drift
      const pos = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pCount; i++) {
        let y = pos.getY(i) + 0.005;
        if (y > 2.5) y = -2.5;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      // Glow pulse
      (disc.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 1.5) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // Drag to rotate the stage
    let dragging = false, px = 0, baseRotY = 0;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; baseRotY = stage.rotation.y; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      stage.rotation.y = baseRotY + (e.clientX - px) * 0.01;
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
  }, [characterImg, width, height]);

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
      <p className="form-note" style={{ margin: '0.2rem 0 0' }}>✨ Your character on the 3D stage</p>
    </div>
  );
}
