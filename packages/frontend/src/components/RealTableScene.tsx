import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterModelBuilder } from '../engine/CharacterModelBuilder';
import { SmoothEngine } from '../engine/SmoothEngine';
import { useAuth } from '../auth/AuthContext';

interface RealTableSceneProps {
  width?: number;
  height?: number;
}

/**
 * RealTableScene — your 4 characters as real 3D models at the dice table.
 * They walk to the table, sit/stand, talk with moving jaws, gesture.
 * Built by Probus with the CharacterModelBuilder.
 */
export default function RealTableScene({ width = 800, height = 500 }: RealTableSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.Fog(0x060608, 30, 60);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const h = Math.min(height, width * 0.625);
    renderer.setSize(width, h);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // SmoothEngine - auto-tunes quality to hold 60fps
    const smooth = new SmoothEngine(renderer);

    // ===== BLUE CEILING CINEMATIC LIGHTING =====
    scene.add(new THREE.AmbientLight(0x1a2a4a, 1.1));

    // Blue ceiling wash - the signature Big Face glow
    const ceilingBlue = new THREE.PointLight(0x2266ff, 80, 40, 1.4);
    ceilingBlue.position.set(0, 15, 0);
    scene.add(ceilingBlue);

    // Blue ceiling spotlights (4 of them, one per section)
    const blueSpots: THREE.SpotLight[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const spot = new THREE.SpotLight(0x4488ff, 120, 35, Math.PI / 6, 0.5, 1.3);
      spot.position.set(Math.cos(angle) * 8, 14, Math.sin(angle) * 8);
      spot.target.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
      scene.add(spot);
      scene.add(spot.target);
      blueSpots.push(spot);
    }

    // Main warm spotlight on table (contrast against blue)
    const key = new THREE.SpotLight(0xffd9a0, 200, 40, Math.PI / 5, 0.35, 1.2);
    key.position.set(0, 14, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    scene.add(key);
    scene.add(key.target);

    // Under-table warm glow
    const underGlow = new THREE.PointLight(0xff6b35, 15, 8);
    underGlow.position.set(0, 0.4, 0);
    scene.add(underGlow);

    // Neon accent lights - blue and gold alternating (4 total for performance)
    const accentData: [number, number][] = [
      [0x2266ff, 0.4], [0xffd700, 1.9], [0x2266ff, 3.5], [0xffd700, 5.1],
    ];
    accentData.forEach(([color, angle]) => {
      const light = new THREE.PointLight(color, 35, 26, 1.5);
      light.position.set(Math.cos(angle) * 13, 4, Math.sin(angle) * 13);
      scene.add(light);
    });

    // Rim light for character silhouettes
    const rim = new THREE.DirectionalLight(0x6688ff, 0.8);
    rim.position.set(-6, 8, -8);
    scene.add(rim);

    // ===== GRAND CASINO ROOM =====
    // Massive floor with reflection
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(40, 64),
      new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.15, metalness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Gold carpet inlay around table
    const carpet = new THREE.Mesh(
      new THREE.RingGeometry(5.5, 9, 64),
      new THREE.MeshStandardMaterial({ color: 0x6b0f1a, roughness: 0.95 })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01;
    carpet.receiveShadow = true;
    scene.add(carpet);

    // ===== WALLS - dark luxury with gold trim =====
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.85 });
    const wallGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
    // 8 wall segments forming octagon room
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const nextAngle = ((i + 1) / 8) * Math.PI * 2;
      const r = 22;
      const x1 = Math.cos(angle) * r, z1 = Math.sin(angle) * r;
      const x2 = Math.cos(nextAngle) * r, z2 = Math.sin(nextAngle) * r;
      const wallLen = Math.hypot(x2 - x1, z2 - z1);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(wallLen, 18, 0.5), wallMat);
      wall.position.set((x1 + x2) / 2, 9, (z1 + z2) / 2);
      wall.lookAt(0, 9, 0);
      scene.add(wall);
      // Gold trim top and bottom
      [0.5, 17.5].forEach((y) => {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(wallLen, 0.25, 0.6), wallGoldMat);
        trim.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        trim.lookAt(0, y, 0);
        scene.add(trim);
      });
    }

    // Chandelier above table
    const chandelier = new THREE.Group();
    const chandRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.12, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 })
    );
    chandelier.add(chandRing);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffeebb })
      );
      bulb.position.set(Math.cos(angle) * 1.8, -0.25, Math.sin(angle) * 1.8);
      chandelier.add(bulb);
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 })
      );
      candle.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
      chandelier.add(candle);
    }
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0x8a6d1f, metalness: 0.9, roughness: 0.4 })
    );
    chain.position.y = 3.2;
    chandelier.add(chain);
    chandelier.position.y = 11;
    scene.add(chandelier);
    const chandLight = new THREE.PointLight(0xffd9a0, 120, 30, 1.5);
    chandLight.position.y = 10.4;
    scene.add(chandLight);

    // ===== BIG FACE NEON SIGNS (2 walls, always visible) =====
    const makeSign = (): THREE.CanvasTexture => {
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 1024;
      signCanvas.height = 256;
      const sctx = signCanvas.getContext('2d')!;
      sctx.fillStyle = '#0a0a14';
      sctx.fillRect(0, 0, 1024, 256);
      // Gold border
      sctx.strokeStyle = '#d4af37';
      sctx.lineWidth = 8;
      sctx.strokeRect(10, 10, 1004, 236);
      sctx.font = 'bold 110px Arial';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.shadowColor = '#ffd700';
      sctx.shadowBlur = 50;
      sctx.fillStyle = '#ffdf5e';
      sctx.fillText('BIG FACE', 512, 100);
      sctx.font = 'bold 44px Arial';
      sctx.shadowColor = '#2266ff';
      sctx.shadowBlur = 35;
      sctx.fillStyle = '#77bbff';
      sctx.fillText('★ ★ ★  CASINO  ★ ★ ★', 512, 195);
      return new THREE.CanvasTexture(signCanvas);
    };
    const signTex = makeSign();
    // Two signs on opposite walls
    [[0, -20.5, 0], [0, 20.5, Math.PI]].forEach(([x, z, rotY]) => {
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 4),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      signMesh.position.set(x, 9, z);
      signMesh.rotation.y = rotY;
      scene.add(signMesh);
      const signGlow = new THREE.PointLight(0xffd700, 50, 22, 1.4);
      signGlow.position.set(x, 9, z > 0 ? z - 3 : z + 3);
      scene.add(signGlow);
    });

    // ===== VIP LOUNGE AREAS (4 corners) =====
    const couchMat = new THREE.MeshPhysicalMaterial({ color: 0x1a0d1a, roughness: 0.8, clearcoat: 0.2 });
    const couchGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const cx = Math.cos(angle) * 13;
      const cz = Math.sin(angle) * 13;
      const lounge = new THREE.Group();

      // Couch base
      const couchBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 1.2), couchMat);
      couchBase.position.y = 0.4;
      couchBase.castShadow = true;
      lounge.add(couchBase);
      // Couch back
      const couchBack = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.3), couchMat);
      couchBack.position.set(0, 1.0, -0.55);
      couchBack.castShadow = true;
      lounge.add(couchBack);
      // Gold trim
      const couchTrim = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.06, 1.25), couchGoldMat);
      couchTrim.position.y = 0.82;
      lounge.add(couchTrim);

      // Small round table
      const sideTable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.4, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0x2a1a0e, roughness: 0.3, metalness: 0.5 })
      );
      sideTable.position.set(2.2, 0.35, 0);
      sideTable.castShadow = true;
      lounge.add(sideTable);
      // Champagne bottle on table
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.5, 12),
        new THREE.MeshPhysicalMaterial({ color: 0x1a4d1a, roughness: 0.1, transparent: true, opacity: 0.9 })
      );
      bottle.position.set(2.2, 0.95, 0);
      lounge.add(bottle);

      lounge.position.set(cx, 0, cz);
      lounge.lookAt(0, 0, 0);
      scene.add(lounge);
    }
    // Shared lounge glow (2 lights instead of 4)
    [[9.2, 9.2], [-9.2, -9.2]].forEach(([x, z]) => {
      const loungeLight = new THREE.PointLight(0x4488ff, 25, 14, 1.4);
      loungeLight.position.set(x, 4, z);
      scene.add(loungeLight);
    });

    // ===== NEON FLOOR STRIPS =====
    const stripBlueMat = new THREE.MeshBasicMaterial({ color: 0x2266ff });
    const stripGoldMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.04, 0.12),
        i % 2 === 0 ? stripBlueMat : stripGoldMat
      );
      strip.position.set(Math.cos(angle) * 10.5, 0.03, Math.sin(angle) * 10.5);
      strip.lookAt(0, 0.03, 0);
      scene.add(strip);
    }

    // ===== WALL ART FRAMES (on the walls) =====
    const frameGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 });
    const artColors = [0xff2d78, 0x2266ff, 0xffd700, 0x00e5ff];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const ax = Math.cos(angle) * 21.5;
      const az = Math.sin(angle) * 21.5;
      // Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.15), frameGoldMat);
      frame.position.set(ax, 7, az);
      frame.lookAt(0, 7, 0);
      scene.add(frame);
      // Art canvas
      const artCanvas = document.createElement('canvas');
      artCanvas.width = 256;
      artCanvas.height = 192;
      const actx = artCanvas.getContext('2d')!;
      actx.fillStyle = '#0a0a12';
      actx.fillRect(0, 0, 256, 192);
      actx.fillStyle = `#${artColors[i].toString(16).padStart(6, '0')}`;
      actx.font = 'bold 72px Arial';
      actx.textAlign = 'center';
      actx.textBaseline = 'middle';
      const symbols = ['♠', '♥', '♦', '♣'];
      actx.fillText(symbols[i], 128, 96);
      const artTex = new THREE.CanvasTexture(artCanvas);
      const art = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 2.6),
        new THREE.MeshBasicMaterial({ map: artTex })
      );
      art.position.set(ax * 0.99, 7, az * 0.99);
      art.lookAt(0, 7, 0);
      // Offset slightly toward center
      const dirX = -ax / Math.hypot(ax, az);
      const dirZ = -az / Math.hypot(ax, az);
      art.position.x += dirX * 0.1;
      art.position.z += dirZ * 0.1;
      scene.add(art);
    }

    // ===== PREMIUM CASINO DICE TABLE =====
    const table = new THREE.Group();

    // Rich mahogany wood with clearcoat shine
    const woodMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a2410, roughness: 0.25, metalness: 0.1,
      clearcoat: 0.8, clearcoatRoughness: 0.2,
    });
    const darkWoodMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a1408, roughness: 0.3, metalness: 0.1,
      clearcoat: 0.6, clearcoatRoughness: 0.3,
    });

    // Pedestal base with molding rings
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.4, 1.2, 32), darkWoodMat);
    pedestal.position.y = 0.6;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    table.add(pedestal);
    [0.15, 1.05].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.06, 12, 40), woodMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      table.add(ring);
    });

    // Table top - thick wooden rail with rounded edge
    const railOuter = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.5, 0.5, 64), woodMat);
    railOuter.position.y = 1.35;
    railOuter.castShadow = true;
    railOuter.receiveShadow = true;
    table.add(railOuter);

    // Padded armrest (dark leather)
    const armrest = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.22, 16, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x1a0d06, roughness: 0.7, clearcoat: 0.3 })
    );
    armrest.rotation.x = Math.PI / 2;
    armrest.position.y = 1.62;
    armrest.castShadow = true;
    table.add(armrest);

    // Gold trim rings
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.15 });
    [1.12, 1.58].forEach((y) => {
      const trim = new THREE.Mesh(new THREE.TorusGeometry(3.58, 0.035, 8, 72), goldMat);
      trim.rotation.x = Math.PI / 2;
      trim.position.y = y;
      table.add(trim);
    });

    // Green felt with subtle texture
    const feltCanvas = document.createElement('canvas');
    feltCanvas.width = feltCanvas.height = 512;
    const fctx = feltCanvas.getContext('2d')!;
    fctx.fillStyle = '#0d5c2e';
    fctx.fillRect(0, 0, 512, 512);
    // Felt noise texture
    for (let i = 0; i < 8000; i++) {
      fctx.fillStyle = `rgba(${10 + Math.random() * 30},${80 + Math.random() * 40},${30 + Math.random() * 20},0.15)`;
      fctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const feltTex = new THREE.CanvasTexture(feltCanvas);
    feltTex.wrapS = feltTex.wrapT = THREE.RepeatWrapping;
    feltTex.repeat.set(3, 3);
    const felt = new THREE.Mesh(
      new THREE.CylinderGeometry(3.05, 3.05, 0.52, 64),
      new THREE.MeshStandardMaterial({ map: feltTex, roughness: 0.95, metalness: 0 })
    );
    felt.position.y = 1.36;
    felt.receiveShadow = true;
    table.add(felt);

    // Betting line circles on felt
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5f0e0, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const circle = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.46, 32), lineMat);
      circle.rotation.x = -Math.PI / 2;
      circle.position.set(Math.cos(angle) * 2.1, 1.63, Math.sin(angle) * 2.1);
      table.add(circle);
    }
    // Center betting circle
    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(0.78, 0.83, 48), lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 1.63;
    table.add(centerCircle);

    // Helper: make a die with pips
    const makeDie = (value: number): THREE.Group => {
      const die = new THREE.Group();
      const size = 0.32;
      const dieCanvas = document.createElement('canvas');
      dieCanvas.width = dieCanvas.height = 128;
      const dctx = dieCanvas.getContext('2d')!;
      const pipLayouts: Record<number, [number, number][]> = {
        1: [[0.5, 0.5]],
        2: [[0.28, 0.28], [0.72, 0.72]],
        3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
        4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
        5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
        6: [[0.3, 0.25], [0.7, 0.25], [0.3, 0.5], [0.7, 0.5], [0.3, 0.75], [0.7, 0.75]],
      };
      const drawFace = (val: number) => {
        dctx.fillStyle = '#f8f8f8';
        dctx.fillRect(0, 0, 128, 128);
        dctx.fillStyle = '#1a1a1a';
        (pipLayouts[val] || pipLayouts[1]).forEach(([x, y]) => {
          dctx.beginPath();
          dctx.arc(x * 128, y * 128, 11, 0, Math.PI * 2);
          dctx.fill();
        });
      };
      drawFace(value);
      const dieTex = new THREE.CanvasTexture(dieCanvas);
      const dieMat = new THREE.MeshPhysicalMaterial({
        map: dieTex, roughness: 0.12, metalness: 0,
        clearcoat: 1, clearcoatRoughness: 0.08,
      });
      const cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), dieMat);
      cube.castShadow = true;
      die.add(cube);
      return die;
    };

    // Two dice showing 6 and 4
    const die1 = makeDie(6);
    die1.position.set(-0.35, 1.79, 0.15);
    die1.rotation.set(0.3, 0.6, 0.2);
    table.add(die1);
    const die2 = makeDie(4);
    die2.position.set(0.35, 1.79, -0.1);
    die2.rotation.set(-0.2, 1.1, 0.4);
    table.add(die2);

    // Helper: poker chip
    const makeChipStack = (color: number, count: number, x: number, z: number) => {
      const chipColors = [0xffffff, 0xcc0000, 0x0066cc, 0x00aa44, 0x111111];
      for (let i = 0; i < count; i++) {
        const chip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.045, 24),
          new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
        );
        // White edge spots
        const edge = new THREE.Mesh(
          new THREE.TorusGeometry(0.17, 0.028, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
        );
        edge.rotation.x = Math.PI / 2;
        chip.add(edge);
        chip.position.set(x, 1.66 + i * 0.05, z);
        chip.castShadow = true;
        table.add(chip);
      }
    };

    // Chip stacks around the table
    makeChipStack(0xcc0000, 8, 1.8, 1.2);
    makeChipStack(0x111111, 6, -1.7, 1.3);
    makeChipStack(0x0066cc, 10, 0.2, -2.0);
    makeChipStack(0x00aa44, 5, -2.0, -0.8);
    makeChipStack(0xd4af37, 7, 2.0, -0.9);

    // Dice cup (leather)
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.22, 0.55, 24, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0x2a1a0e, roughness: 0.6, side: THREE.DoubleSide })
    );
    cup.position.set(1.1, 1.9, 0.9);
    cup.rotation.z = Math.PI / 2.3;
    cup.castShadow = true;
    table.add(cup);

    // Whiskey glasses
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.05, metalness: 0,
      transparent: true, opacity: 0.25, clearcoat: 1,
    });
    [[-1.2, 1.8], [0.8, -1.7]].forEach(([x, z]) => {
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.3, 16, 1, true), glassMat);
      glass.position.set(x, 1.78, z);
      table.add(glass);
      const whiskey = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.1, 0.12, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xcc7722, roughness: 0.1, transparent: true, opacity: 0.85 })
      );
      whiskey.position.set(x, 1.7, z);
      table.add(whiskey);
    });

    scene.add(table);

    // Build your 4 characters
    const builder = new CharacterModelBuilder();
    const configs = [
      {
        id: 'boss', name: 'The Boss',
        faceImg: '/characters/media-generation-boss-tupac-style-0-5d243a54-3920-4154-9dba-d15d08166707.webp',
        skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x1a1a1a,
        build: 'athletic' as const, height: 1.0,
      },
      {
        id: 'diva', name: 'The Diva',
        faceImg: '/characters/media-generation-baddest-diva-0-4dd8b93e-0a39-47e6-9c40-5047e631e9c7.webp',
        skinTone: 0x5c3a1e, shirtColor: 0x8b0000, pantsColor: 0x1a1a1a,
        build: 'curvy' as const, height: 0.98,
      },
      {
        id: 'dreads', name: 'Dread Artist',
        faceImg: '/characters/media-generation-dread-tattoo-artist-0-1b72bd66-621d-4fab-becb-588d28bcae1f.webp',
        skinTone: 0x6b4226, shirtColor: 0xf5f5f5, pantsColor: 0x2a2a3a,
        build: 'slim' as const, height: 1.02,
      },
      {
        id: 'enforcer', name: 'The Enforcer',
        faceImg: '/characters/media-generation-muscle-fade-enforcer-0-4d0117a0-7509-4292-956f-7761c017424a.webp',
        skinTone: 0x6b4226, shirtColor: 0x1a1a1a, pantsColor: 0x2a2a2a,
        build: 'muscular' as const, height: 1.05,
      },
    ];

    configs.forEach((config, i) => {
      const model = builder.build(config);
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const radius = 5.2;
      model.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      model.lookAt(0, 0, 0);
      scene.add(model);
    });

    // They walk in, then talk
    setTimeout(() => {
      configs.forEach((c, i) => {
        setTimeout(() => {
          builder.setWalking(c.id, true);
          setTimeout(() => {
            builder.setWalking(c.id, false);
            builder.setTalking(c.id, true);
            setTimeout(() => builder.setTalking(c.id, false), 3000);
          }, 2000);
        }, i * 800);
      });
    }, 1000);

    // Ambient life
    const ambient = setInterval(() => {
      const c = configs[Math.floor(Math.random() * configs.length)];
      const actions = ['talk', 'wave', 'celebrate'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      if (action === 'talk') {
        builder.setTalking(c.id, true);
        setTimeout(() => builder.setTalking(c.id, false), 2500);
      } else {
        builder.gesture(c.id, action as 'wave' | 'celebrate');
      }
    }, 8000);

    // ===== 4 CINEMATIC CAMERA ANGLES =====
    // Each camera covers a different section, cycling every 8 seconds
    const clock = new THREE.Clock();
    let raf = 0;
    let camSection = 0;
    let sectionTimer = 0;
    const SECTION_DURATION = 8;

    // Smooth camera transition
    const camPos = new THREE.Vector3(10, 4.2, 0);
    const camLook = new THREE.Vector3(0, 1.6, 0);
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    const getCameraForSection = (section: number, t: number): [THREE.Vector3, THREE.Vector3] => {
      const pos = new THREE.Vector3();
      const look = new THREE.Vector3(0, 1.6, 0);
      switch (section) {
        case 0: // Overhead table shot - dramatic top-down
          pos.set(Math.sin(t * 0.15) * 3, 11, Math.cos(t * 0.15) * 3);
          look.set(0, 1.2, 0);
          break;
        case 1: // Close-up on dice - intense
          const diceAngle = t * 0.2;
          pos.set(Math.cos(diceAngle) * 2.5, 2.8, Math.sin(diceAngle) * 2.5);
          look.set(0, 1.7, 0);
          break;
        case 2: // Wide room view - show the grandeur
          pos.set(Math.cos(t * 0.08) * 16, 6.5 + Math.sin(t * 0.1) * 1, Math.sin(t * 0.08) * 16);
          look.set(0, 2, 0);
          break;
        case 3: // Player level - orbit around characters
        default:
          const orbitAngle = t * 0.12;
          pos.set(Math.cos(orbitAngle) * 8.5, 3.2 + Math.sin(t * 0.15) * 0.5, Math.sin(orbitAngle) * 8.5);
          look.set(0, 1.8, 0);
          break;
      }
      return [pos, look];
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      builder.update(dt);
      smooth.update(dt);

      // Cycle through 4 sections
      sectionTimer += dt;
      if (sectionTimer >= SECTION_DURATION) {
        sectionTimer = 0;
        camSection = (camSection + 1) % 4;
      }

      // Smooth transition to current section's camera
      const [newPos, newLook] = getCameraForSection(camSection, t);
      targetPos.copy(newPos);
      targetLook.copy(newLook);
      camPos.lerp(targetPos, 1 - Math.pow(0.001, dt));
      camLook.lerp(targetLook, 1 - Math.pow(0.001, dt));
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // Pulse the blue ceiling lights
      ceilingBlue.intensity = 80 + Math.sin(t * 1.5) * 15;
      blueSpots.forEach((spot, i) => {
        spot.intensity = 120 + Math.sin(t * 2 + i * 1.5) * 25;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearInterval(ambient);
      cancelAnimationFrame(raf);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div ref={mountRef} style={{
        width, height: Math.min(height, width * 0.625),
        margin: '0 auto', borderRadius: 20, overflow: 'hidden',
      }} />
      <p className="form-note" style={{ marginTop: '0.5rem' }}>
        🎬 Your 4 characters — real 3D models, walking, talking, living
      </p>
    </div>
  );
}
