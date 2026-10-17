import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { AvatarItem } from '../types';

interface RealisticAvatar3DProps {
  width?: number;
  height?: number;
  characterImg: string;
  characterName: string;
  equipped?: Record<string, AvatarItem>;
  facePhotoUrl?: string;
}

// Maps item slot to product image (same as ItemVisual)
function gearImageFor(item: AvatarItem): string | null {
  const n = item.name.toLowerCase();
  switch (item.slot) {
    case 'hair':
      if (n.includes('dread') || n.includes('loc') || n.includes('braid')) return '/gear/hair-dreads.webp';
      return '/gear/hair-fade.webp';
    case 'top':
      if (n.includes('hoodie')) return '/gear/top-hoodie.webp';
      if (n.includes('jacket') || n.includes('leather') || n.includes('blazer')) return '/gear/top-jacket.webp';
      return '/gear/top-hoodie.webp';
    case 'bottom': return '/gear/bottom-jeans.webp';
    case 'shoes': return '/gear/shoes-jordan.webp';
    case 'chain': return '/gear/chain-cuban.webp';
    case 'ring': return '/gear/ring-diamond.webp';
    case 'earring': return '/gear/earring-stud.webp';
    case 'grill': return '/gear/grill-gold.webp';
    case 'hat': return '/gear/hat-snapback.webp';
    case 'watch': return '/gear/watch-gold.webp';
    case 'glasses': return '/gear/glasses-aviator.webp';
    default: return null;
  }
}

/**
 * RealisticAvatar3D — the user's actual character in realistic 3D.
 * Uses their chosen character photo as the face texture.
 * Shows equipped gear as floating item badges around the character.
 * If facePhotoUrl is provided, composites it as a circular badge on the stage.
 */
export default function RealisticAvatar3D({
  width = 280, height = 400,
  characterImg, characterName,
  equipped = {}, facePhotoUrl,
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
    const loader = new THREE.TextureLoader();

    // Equipped gear: floating item badges around the character
    const gearItems = Object.values(equipped);
    const gearSprites: THREE.Mesh[] = [];
    gearItems.forEach((item, i) => {
      const imgUrl = gearImageFor(item);
      if (!imgUrl) return;
      // Position in a circle around the character
      const angle = (i / Math.max(gearItems.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const gx = Math.cos(angle) * 2.2;
      const gy = Math.sin(angle) * 1.8 + 0.3;
      loader.load(imgUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const badge = new THREE.Mesh(
          new THREE.PlaneGeometry(0.7, 0.7),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true })
        );
        badge.position.set(gx, gy, 0.5);
        badge.userData.baseY = gy;
        badge.userData.phase = i * 1.3;
        // Gold ring behind badge
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.36, 0.42, 32),
          new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        ring.position.z = -0.01;
        badge.add(ring);
        stage.add(badge);
        gearSprites.push(badge);
      });
    });

    // Face photo badge (if uploaded) — circular badge at top
    if (facePhotoUrl) {
      loader.load(facePhotoUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const faceBadge = new THREE.Mesh(
          new THREE.CircleGeometry(0.5, 32),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true })
        );
        faceBadge.position.set(0, 2.2, 0.5);
        const faceRing = new THREE.Mesh(
          new THREE.RingGeometry(0.5, 0.58, 32),
          new THREE.MeshBasicMaterial({ color: 0xc9a227, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
        );
        faceRing.position.z = -0.01;
        faceBadge.add(faceRing);
        stage.add(faceBadge);
      });
    }

    // Character photo — floating naturally, NO frame.
    // Has an onError path: if the image 404s, render a gold silhouette disc
    // so the stage never sits empty.
    loader.load(
      characterImg,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const aspect = tex.image.width / tex.image.height;
        const h = 3.4;
        const w = h * aspect;

        const photoMat = new THREE.MeshStandardMaterial({
          map: tex, roughness: 0.5, metalness: 0.05,
          transparent: true,
        });
        const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, h), photoMat);
        stage.add(photo);

        // Soft glow behind character (not a frame)
        const halo = new THREE.Mesh(
          new THREE.PlaneGeometry(w + 0.6, h + 0.6),
          new THREE.MeshBasicMaterial({
            color: 0xc9a227, transparent: true, opacity: 0.12,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
        );
        halo.position.z = -0.2;
        stage.add(halo);
      },
      undefined,
      () => {
        // Fallback: gold silhouette disc with the character's initial
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0xc9a227, roughness: 0.4, metalness: 0.6,
          transparent: true, opacity: 0.85,
        });
        const fallback = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), fallbackMat);
        stage.add(fallback);
      }
    );

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

      // Gear badges bob gently
      for (const sprite of gearSprites) {
        sprite.position.y = sprite.userData.baseY + Math.sin(t * 1.2 + sprite.userData.phase) * 0.12;
        sprite.rotation.y = Math.sin(t * 0.8 + sprite.userData.phase) * 0.2;
      }

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
  }, [characterImg, width, height, JSON.stringify(Object.keys(equipped).sort()), facePhotoUrl]);

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
      <p className="form-note" style={{ margin: '0.2rem 0 0' }}>
        ✨ Your character on the 3D stage
        {Object.keys(equipped).length > 0 && ` · ${Object.keys(equipped).length} item${Object.keys(equipped).length === 1 ? '' : 's'} equipped`}
      </p>
    </div>
  );
}
