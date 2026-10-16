import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export type GambleMood = 'idle' | 'tense' | 'win' | 'lose';
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra' | 'max8k';

/**
 * GambleEngine — the 3D engine behind Gamble Face.
 * 
 * This is what connects the game to the room. The page tells the engine
 * what's happening, and the engine makes the 3D world react:
 * 
 *   engine.rollDice(4, 6)   — 3D dice tumble and land showing 4 and 6
 *   engine.celebrate()      — gold light burst + confetti on win
 *   engine.setMood('tense') — lights dim blue when stakes are high
 *   engine.setMood('win')   — warm gold glow on victory
 *   engine.setMood('lose')  — cool dim fade on loss
 *   engine.setMood('idle')  — back to normal casino ambiance
 */
export interface CharacterOutfit {
  skin?: number;
  shirt?: number;
  pants?: number;
  shoes?: number;
  hat?: 'none' | 'bandana' | 'cap' | 'fedora' | 'beanie';
  hatColor?: number;
  chain?: boolean;
  glasses?: 'none' | 'sunglasses' | 'shades';
  earrings?: boolean;
  bracelet?: boolean;
  watch?: boolean;
  hairstyle?: 'none' | 'dreads' | 'fade' | 'long' | 'braids' | 'afro';
  hairColor?: number;
}

export class GambleEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  // Lights (for mood control)
  private ceilingBlue!: THREE.PointLight;
  private blueSpots: THREE.SpotLight[] = [];
  private keyLight!: THREE.SpotLight;
  private ambient!: THREE.AmbientLight;
  private mood: GambleMood = 'idle';
  private moodTransition = 1; // 0-1, animates toward 1

  // Dice
  private die1!: THREE.Group;
  private die2!: THREE.Group;
  private die1Home = new THREE.Vector3();
  private die2Home = new THREE.Vector3();
  private rolling = false;
  private rollT = 0;
  private rollDuration = 1.6;
  private targetV1 = 6;
  private targetV2 = 4;

  // Celebration
  private celebrating = false;
  private celebrateT = 0;
  private confetti!: THREE.Points;
  private confettiGeo!: THREE.BufferGeometry;
  private confettiVel!: Float32Array;

  // Camera
  private camSection = 0;
  private sectionTimer = 0;
  private userZoom = 1.0;
  // Manual orbit — user drags to look around. Auto-orbit pauses while interacting.
  private userAzimuth = 0;
  private userPolar = 0;
  private lastInteract = 0;
  private dragging = false;
  private camPos = new THREE.Vector3(14, 7, 0);
  private camLook = new THREE.Vector3(0, 2, 0);
  private targetPos = new THREE.Vector3();
  private targetLook = new THREE.Vector3();
  private prevPos = new THREE.Vector3();
  private prevLook = new THREE.Vector3();

  // Dust
  private dustGeo!: THREE.BufferGeometry;
  private dustSpeed!: Float32Array;
  private dustCount = 250;

  constructor(private container: HTMLElement, private width: number, private height: number) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060608);
    this.scene.fog = new THREE.Fog(0x060608, 30, 60);

    // Use the container's actual rendered size (responsive) — fall back to props
    const cw = container.clientWidth || width;
    const ch = container.clientHeight || height;
    width = cw; height = ch;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    // Wide and tall — fill the screen. Use the full requested height.
    this.renderer.setSize(width, height);
    // 4K sharp: render at native device resolution (up to 3x). Mobile gets 2x
    // to stay smooth — still retina-sharp, won't melt the GPU.
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (window.innerWidth < 768 && 'ontouchstart' in window);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    // Sharper output: sRGB color space for accurate, vivid colors
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Follow container resizes (responsive layout)
    new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }).observe(container);

    this.buildLights();
    this.buildRoom();
    this.buildTable();
    this.buildSeats();
    this.buildDust();
    this.buildConfetti();
    this.setupZoom();
    this.animate();
  }

  // ============ PUBLIC GAME API ============

  /** Set graphics quality at runtime. Persisted by the caller. */
  setQuality(q: GraphicsQuality): void {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (window.innerWidth < 768 && 'ontouchstart' in window);
    const dpr = window.devicePixelRatio || 1;
    switch (q) {
      case 'low':
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMappingExposure = 1.0;
        break;
      case 'medium':
        this.renderer.setPixelRatio(Math.min(dpr, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.keyLight.shadow.mapSize.set(1024, 1024);
        this.renderer.toneMappingExposure = 1.1;
        break;
      case 'high':
        this.renderer.setPixelRatio(Math.min(dpr, isMobile ? 2 : 2.5));
        this.renderer.shadowMap.enabled = true;
        this.keyLight.shadow.mapSize.set(2048, 2048);
        this.renderer.toneMappingExposure = 1.15;
        break;
      case 'ultra':
        this.renderer.setPixelRatio(Math.min(dpr, isMobile ? 2.5 : 3));
        this.renderer.shadowMap.enabled = true;
        this.keyLight.shadow.mapSize.set(4096, 4096);
        this.renderer.toneMappingExposure = 1.2;
        break;
      case 'max8k':
        // Maximum possible: full native resolution, no cap. 16x anisotropic
        // filtering for razor-sharp textures at angles. Desktop GPUs only —
        // phones will chug, so this is opt-in.
        this.renderer.setPixelRatio(dpr);
        this.renderer.shadowMap.enabled = true;
        this.keyLight.shadow.mapSize.set(4096, 4096);
        this.renderer.toneMappingExposure = 1.25;
        // Max texture sharpness
        const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
        this.scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            const maps = [mat.map, mat.normalMap, mat.roughnessMap].filter(Boolean);
            maps.forEach((m) => { if (m) m.anisotropy = maxAniso; });
          }
        });
        break;
    }
    // Force shadow map refresh after size change
    if (this.keyLight.shadow.map) {
      this.keyLight.shadow.map.dispose();
      this.keyLight.shadow.map = null as any;
    }
    // Resize to apply new pixel ratio
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (w && h) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  }

  /** Roll the 3D dice and land showing the actual game values */
  rollDice(v1: number, v2: number, charIndex?: number): void {
    // If a character is rolling, they grab and throw with bare hands first
    const doRoll = () => {
      this.targetV1 = Math.max(1, Math.min(6, v1));
      this.targetV2 = Math.max(1, Math.min(6, v2));
      this.rolling = true;
      this.rollT = 0;
      // Focus camera on dice during roll
      this.camSection = 1;
      this.sectionTimer = 0;
      this.prevPos.copy(this.camPos);
      this.prevLook.copy(this.camLook);
    };
    if (charIndex !== undefined) {
      this.characterRollDice(charIndex, doRoll);
    } else {
      doRoll();
    }
  }

  /** Victory celebration — gold burst + confetti rain */
  celebrate(): void {
    this.celebrating = true;
    this.celebrateT = 0;
    this.setMood('win');
    // Reset confetti to top
    const pos = this.confettiGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = 8 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    this.confettiGeo.attributes.position.needsUpdate = true;
    this.confetti.visible = true;
  }

  /** Change the room's lighting mood */
  setMood(mood: GambleMood): void {
    if (this.mood === mood) return;
    this.mood = mood;
    this.moodTransition = 0;
  }

  /** Clean up */
  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }

  // ============ SCENE BUILDING ============

  private buildLights(): void {
    // VIP ROOM REMODEL: Warm luxury base with dramatic accents
    // Research: VIP rooms use warm dimmable lighting, chandeliers, spotlighting on tables

    // Warmer ambient — inviting, not cold. Raised so walls read, not black holes.
    this.ambient = new THREE.AmbientLight(0x4a3620, 1.8);
    this.scene.add(this.ambient);

    // HDRI environment — warm studio reflections on gold/chips/marble
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    new RGBELoader().load('/textures/studio.hdr', (hdrTex) => {
      const envMap = pmrem.fromEquirectangular(hdrTex).texture;
      this.scene.environment = envMap;
      hdrTex.dispose();
      pmrem.dispose();
    });

    // Warm ceiling wash (was cold blue)
    this.ceilingBlue = new THREE.PointLight(0xffb366, 90, 40, 1.4);
    this.ceilingBlue.position.set(0, 15, 0);
    this.scene.add(this.ceilingBlue);

    // 4 warm spotlights with dramatic shadows
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const spot = new THREE.SpotLight(0xffaa55, 140, 35, Math.PI / 6, 0.4, 1.3);
      spot.position.set(Math.cos(angle) * 8, 14, Math.sin(angle) * 8);
      spot.target.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.blueSpots.push(spot);
    }

    // Key light — warm gold spotlight on table
    this.keyLight = new THREE.SpotLight(0xffd9a0, 220, 40, Math.PI / 5, 0.3, 1.2);
    this.keyLight.position.set(0, 14, 0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(4096, 4096);
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);
    this.scene.add(this.keyLight.target);

    // Warm under-glow from table
    const underGlow = new THREE.PointLight(0xff8c42, 18, 8);
    underGlow.position.set(0, 0.4, 0);
    this.scene.add(underGlow);

    // Accent lights — vibrant casino colors: magenta, cyan, gold, purple
    const accentData: [number, number][] = [
      [0xff2fb3, 0.4], [0xffd700, 1.9], [0x00e5ff, 3.5], [0x9d4dff, 5.1],
    ];
    accentData.forEach(([color, angle]) => {
      const light = new THREE.PointLight(color, 40, 26, 1.5);
      light.position.set(Math.cos(angle) * 13, 4, Math.sin(angle) * 13);
      this.scene.add(light);
    });

    // Warm rim light for depth
    const rim = new THREE.DirectionalLight(0xffcc88, 0.9);
    rim.position.set(-6, 8, -8);
    this.scene.add(rim);
  }

  private buildRoom(): void {
    // Realistic marble floor with reflections
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = floorCanvas.height = 512;
    const fx = floorCanvas.getContext('2d')!;
    fx.fillStyle = '#1a1a22';
    fx.fillRect(0, 0, 512, 512);
    // Marble veining
    for (let i = 0; i < 40; i++) {
      fx.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`;
      fx.lineWidth = 1 + Math.random() * 2;
      fx.beginPath();
      let x = Math.random() * 512, y = Math.random() * 512;
      fx.moveTo(x, y);
      for (let j = 0; j < 8; j++) {
        x += (Math.random() - 0.5) * 120;
        y += (Math.random() - 0.5) * 120;
        fx.lineTo(x, y);
      }
      fx.stroke();
    }
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(6, 6);
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(40, 64),
      new THREE.MeshStandardMaterial({
        map: floorTex, color: 0xffffff,
        roughness: 0.08, metalness: 0.9, // Polished marble — reflective
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const carpet = new THREE.Mesh(
      new THREE.RingGeometry(5.5, 9, 64),
      new THREE.MeshStandardMaterial({ color: 0x6b0f1a, roughness: 0.95 })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01;
    carpet.receiveShadow = true;
    this.scene.add(carpet);

    // Walls — rich burgundy with wood paneling (real casino feel)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a1215, roughness: 0.7 });
    const woodPanelMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.35, metalness: 0.1 });
    const wallGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
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
      this.scene.add(wall);
      // Wood paneling — lower half (real casino detail)
      const panel = new THREE.Mesh(new THREE.BoxGeometry(wallLen, 5, 0.6), woodPanelMat);
      panel.position.set((x1 + x2) / 2, 2.5, (z1 + z2) / 2);
      panel.lookAt(0, 2.5, 0);
      this.scene.add(panel);
      [0.5, 17.5].forEach((y) => {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(wallLen, 0.25, 0.6), wallGoldMat);
        trim.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        trim.lookAt(0, y, 0);
        this.scene.add(trim);
      });
    }

    // GRAND CHANDELIER — the room's crown jewel. Multi-tier crystal, hangs low
    // enough to dominate the frame (y=8), warm golden glow.
    const chandelier = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xfff8e7, metalness: 0.1, roughness: 0.05,
      emissive: 0xffedb8, emissiveIntensity: 0.9, transparent: true, opacity: 0.95,
    });

    // Hanging chain
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), goldMat);
    chain.position.y = 2.5;
    chandelier.add(chain);

    // Three tiers — wide at bottom, narrow at top
    const tiers: [number, number, number][] = [
      [2.6, 0, 16],    // bottom tier: radius, y-offset, bulb count
      [1.8, 0.9, 12],  // middle tier
      [1.0, 1.7, 8],   // top tier
    ];
    tiers.forEach(([radius, yOff, bulbs]) => {
      // Gold ring for this tier
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.09, 12, 64), goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yOff;
      chandelier.add(ring);
      // Crystal bulbs around the ring
      for (let i = 0; i < bulbs; i++) {
        const angle = (i / bulbs) * Math.PI * 2;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), crystalMat);
        bulb.position.set(Math.cos(angle) * radius, yOff - 0.22, Math.sin(angle) * radius);
        chandelier.add(bulb);
        // Crystal droplet below each bulb
        const drop = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 8), crystalMat);
        drop.position.set(Math.cos(angle) * radius, yOff - 0.45, Math.sin(angle) * radius);
        drop.rotation.x = Math.PI;
        chandelier.add(drop);
      }
      // Support arms from center column to ring
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, radius, 8), goldMat);
        arm.position.set(Math.cos(angle) * radius / 2, yOff + 0.1, Math.sin(angle) * radius / 2);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = -angle;
        chandelier.add(arm);
      }
    });
    // Center column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.2, 12), goldMat);
    column.position.y = 0.8;
    chandelier.add(column);
    // Crown top
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), crystalMat);
    crown.position.y = 2.0;
    chandelier.add(crown);

    chandelier.position.y = 8;
    this.scene.add(chandelier);
    // Strong warm light radiating from the chandelier
    const chandLight = new THREE.PointLight(0xffd9a0, 200, 35, 1.4);
    chandLight.position.y = 7.4;
    this.scene.add(chandLight);

    // Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.4, metalness: 0.3 });
    const pillarGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
    const sconceGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffedb8, emissive: 0xffc86e, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.95,
    });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 18;
      const pz = Math.sin(angle) * 18;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 16, 16), pillarMat);
      pillar.position.set(px, 8, pz);
      pillar.castShadow = true;
      this.scene.add(pillar);
      [1.5, 14.5].forEach((y) => {
        const band = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.09, 8, 24), pillarGoldMat);
        band.rotation.x = Math.PI / 2;
        band.position.set(px, y, pz);
        this.scene.add(band);
      });
      // Wall sconce — visible glowing fixture on each pillar, facing inward
      const sconceGroup = new THREE.Group();
      const sconceBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.5, 8), pillarGoldMat);
      sconceGroup.add(sconceBase);
      const sconceShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.5, 12, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0xd4af37, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide,
        })
      );
      sconceShade.position.y = 0.45;
      sconceGroup.add(sconceShade);
      const sconceBulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), sconceGlowMat);
      sconceBulb.position.y = 0.35;
      sconceGroup.add(sconceBulb);
      // Position on pillar surface, facing the table
      const inwardAngle = Math.atan2(-pz, -px);
      sconceGroup.position.set(px + Math.cos(inwardAngle) * 1.0, 5.5, pz + Math.sin(inwardAngle) * 1.0);
      sconceGroup.rotation.y = -inwardAngle + Math.PI / 2;
      sconceGroup.rotation.z = Math.PI / 2 - 0.3; // tilt upward
      this.scene.add(sconceGroup);
      // Small warm light from each sconce
      const sconceLight = new THREE.PointLight(0xffc86e, 25, 12, 1.6);
      sconceLight.position.set(
        px + Math.cos(inwardAngle) * 1.6, 5.8, pz + Math.sin(inwardAngle) * 1.6
      );
      this.scene.add(sconceLight);
    }

    // BIG FACE signs (2 walls)
    const signTex = this.makeSignTexture();
    [[0, -20.5, 0], [0, 20.5, Math.PI]].forEach(([x, z, rotY]) => {
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 4),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      signMesh.position.set(x, 9, z);
      signMesh.rotation.y = rotY;
      this.scene.add(signMesh);
      const signGlow = new THREE.PointLight(0xffd700, 50, 22, 1.4);
      signGlow.position.set(x, 9, z > 0 ? z - 3 : z + 3);
      this.scene.add(signGlow);
    });

    // Neon floor strips — vibrant casino rainbow
    const stripColors = [0xff2fb3, 0x00e5ff, 0xffd700, 0x9d4dff];
    const stripMats = stripColors.map((c) => new THREE.MeshBasicMaterial({ color: c }));
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.04, 0.12),
        stripMats[i % 4]
      );
      strip.position.set(Math.cos(angle) * 10.5, 0.03, Math.sin(angle) * 10.5);
      strip.lookAt(0, 0.03, 0);
      this.scene.add(strip);
    }

    // VIP lounges
    this.buildLounges();

    // Background gaming tables — a real casino has multiple tables
    this.buildBackgroundTables();
  }

  private buildBackgroundTables(): void {
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x0d3a1f, roughness: 0.9 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0d, roughness: 0.4 });
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
      const tx = Math.cos(angle) * 15;
      const tz = Math.sin(angle) * 15;
      const bgTable = new THREE.Group();
      // Table top
      const top = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.15, 24), tableMat);
      top.position.y = 1.0;
      bgTable.add(top);
      // Legs
      for (let j = 0; j < 4; j++) {
        const la = (j / 4) * Math.PI * 2;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), legMat);
        leg.position.set(Math.cos(la) * 1.4, 0.5, Math.sin(la) * 1.4);
        bgTable.add(leg);
      }
      // Small lamp on each table
      const lampGlow = new THREE.PointLight(0xffd9a0, 12, 6, 1.5);
      lampGlow.position.y = 1.8;
      bgTable.add(lampGlow);
      const shade = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.25, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 })
      );
      shade.position.y = 1.6;
      bgTable.add(shade);
      bgTable.position.set(tx, 0, tz);
      this.scene.add(bgTable);
    }
  }

  private makeSignTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    const x = c.getContext('2d')!;
    x.fillStyle = '#0a0a14';
    x.fillRect(0, 0, 1024, 256);
    x.strokeStyle = '#d4af37';
    x.lineWidth = 8;
    x.strokeRect(10, 10, 1004, 236);
    x.font = 'bold 110px Arial';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.shadowColor = '#ffd700';
    x.shadowBlur = 50;
    x.fillStyle = '#ffdf5e';
    x.fillText('BIG FACE', 512, 100);
    x.font = 'bold 44px Arial';
    x.shadowColor = '#2266ff';
    x.shadowBlur = 35;
    x.fillStyle = '#77bbff';
    x.fillText('★ ★ ★  CASINO  ★ ★ ★', 512, 195);
    return new THREE.CanvasTexture(c);
  }

  private buildLounges(): void {
    const couchMat = new THREE.MeshPhysicalMaterial({ color: 0x1a0d1a, roughness: 0.8, clearcoat: 0.2 });
    const couchGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const cx = Math.cos(angle) * 13;
      const cz = Math.sin(angle) * 13;
      const lounge = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 1.2), couchMat);
      base.position.y = 0.4;
      base.castShadow = true;
      lounge.add(base);
      const back = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.3), couchMat);
      back.position.set(0, 1.0, -0.55);
      lounge.add(back);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.06, 1.25), couchGoldMat);
      trim.position.y = 0.82;
      lounge.add(trim);
      lounge.position.set(cx, 0, cz);
      lounge.lookAt(0, 0, 0);
      this.scene.add(lounge);
    }
    [[9.2, 9.2], [-9.2, -9.2]].forEach(([x, z]) => {
      const l = new THREE.PointLight(0x4488ff, 25, 14, 1.4);
      l.position.set(x, 4, z);
      this.scene.add(l);
    });
  }

  private buildTable(): void {
    const table = new THREE.Group();
    const woodMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a2410, roughness: 0.25, metalness: 0.1,
      clearcoat: 0.8, clearcoatRoughness: 0.2,
    });
    const darkWoodMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a1408, roughness: 0.3, metalness: 0.1,
      clearcoat: 0.6, clearcoatRoughness: 0.3,
    });

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.4, 1.2, 32), darkWoodMat);
    pedestal.position.y = 0.6;
    pedestal.castShadow = true;
    table.add(pedestal);

    const railOuter = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.5, 0.5, 64), woodMat);
    railOuter.position.y = 1.35;
    railOuter.castShadow = true;
    railOuter.receiveShadow = true;
    table.add(railOuter);

    const armrest = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.22, 16, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x1a0d06, roughness: 0.7, clearcoat: 0.3 })
    );
    armrest.rotation.x = Math.PI / 2;
    armrest.position.y = 1.62;
    table.add(armrest);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.15 });
    [1.12, 1.58].forEach((y) => {
      const trim = new THREE.Mesh(new THREE.TorusGeometry(3.58, 0.035, 8, 72), goldMat);
      trim.rotation.x = Math.PI / 2;
      trim.position.y = y;
      table.add(trim);
    });

    // Felt — rich emerald with gold inlay pattern (VIP remodel)
    const feltCanvas = document.createElement('canvas');
    feltCanvas.width = feltCanvas.height = 512;
    const fctx = feltCanvas.getContext('2d')!;
    // Deep rich casino green — saturated, won't wash out
    const grad = fctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    grad.addColorStop(0, '#0a5c2e');
    grad.addColorStop(1, '#053a1c');
    fctx.fillStyle = grad;
    fctx.fillRect(0, 0, 512, 512);
    // Felt texture — deeper green fibers
    for (let i = 0; i < 8000; i++) {
      fctx.fillStyle = `rgba(${5 + Math.random() * 20},${70 + Math.random() * 35},${20 + Math.random() * 15},0.18)`;
      fctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // Gold inlay ring — VIP luxury detail
    fctx.strokeStyle = '#d4af37';
    fctx.lineWidth = 6;
    fctx.globalAlpha = 0.7;
    fctx.beginPath();
    fctx.arc(256, 256, 200, 0, Math.PI * 2);
    fctx.stroke();
    fctx.lineWidth = 3;
    fctx.beginPath();
    fctx.arc(256, 256, 185, 0, Math.PI * 2);
    fctx.stroke();
    fctx.globalAlpha = 1.0;
    const feltTex = new THREE.CanvasTexture(feltCanvas);
    feltTex.wrapS = feltTex.wrapT = THREE.RepeatWrapping;
    feltTex.repeat.set(3, 3);
    const felt = new THREE.Mesh(
      new THREE.CylinderGeometry(3.05, 3.05, 0.52, 64),
      new THREE.MeshStandardMaterial({ map: feltTex, roughness: 0.95 })
    );
    felt.position.y = 1.36;
    felt.receiveShadow = true;
    table.add(felt);

    // Betting circles
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5f0e0, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const circle = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.46, 32), lineMat);
      circle.rotation.x = -Math.PI / 2;
      circle.position.set(Math.cos(angle) * 2.1, 1.63, Math.sin(angle) * 2.1);
      table.add(circle);
    }

    // Dice — built with per-face textures so rollDice can show real values
    this.die1 = this.makeDie();
    this.die1.position.set(-0.35, 1.79, 0.15);
    this.die1.rotation.set(0.3, 0.6, 0.2);
    table.add(this.die1);
    this.die1Home.copy(this.die1.position);

    this.die2 = this.makeDie();
    this.die2.position.set(0.35, 1.79, -0.1);
    this.die2.rotation.set(-0.2, 1.1, 0.4);
    table.add(this.die2);
    this.die2Home.copy(this.die2.position);

    // Start showing 6 and 4
    this.setDieFace(this.die1, 6);
    this.setDieFace(this.die2, 4);

    // Chips — real casino colors with denominations
    this.makeChipStack(table, 0xcc0000, 8, 1.8, 1.2, '100');
    this.makeChipStack(table, 0x111111, 6, -1.7, 1.3, '1K');
    this.makeChipStack(table, 0x0066cc, 10, 0.2, -2.0, '50');
    this.makeChipStack(table, 0xd4af37, 7, 2.0, -0.9, '500');
    this.makeChipStack(table, 0x00aa44, 5, -2.2, -0.5, '25');
    this.makeChipStack(table, 0x7b2ff7, 4, 1.2, 2.1, '5K');

    this.scene.add(table);
  }

  /** Dice pip layouts for each face value */
  private pipLayouts: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.3, 0.25], [0.7, 0.25], [0.3, 0.5], [0.7, 0.5], [0.3, 0.75], [0.7, 0.75]],
  };

  private makeDieFaceTexture(value: number): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d')!;
    x.fillStyle = '#f8f8f8';
    x.fillRect(0, 0, 128, 128);
    x.fillStyle = '#1a1a1a';
    (this.pipLayouts[value] || this.pipLayouts[1]).forEach(([px, py]) => {
      x.beginPath();
      x.arc(px * 128, py * 128, 11, 0, Math.PI * 2);
      x.fill();
    });
    return new THREE.CanvasTexture(c);
  }

  private makeDie(): THREE.Group {
    const die = new THREE.Group();
    // 6 materials, one per face — opposite faces sum to 7
    const faceValues = [1, 6, 2, 5, 3, 4]; // +x, -x, +y, -y, +z, -z
    const materials = faceValues.map((v) => new THREE.MeshPhysicalMaterial({
      map: this.makeDieFaceTexture(v),
      roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08,
    }));
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), materials);
    cube.castShadow = true;
    cube.userData.faceValues = faceValues;
    die.add(cube);
    die.userData.cube = cube;
    return die;
  }

  /** Rotate a die so the given value faces up */
  private setDieFace(die: THREE.Group, value: number): void {
    const cube = die.userData.cube as THREE.Mesh;
    const faceValues = cube.userData.faceValues as number[];
    // Find which face index has this value, then rotate so it's on top (+y)
    const idx = faceValues.indexOf(value);
    // Face order: +x(0), -x(1), +y(2), -y(3), +z(4), -z(5)
    // To put face on +y: rotate accordingly
    die.rotation.set(0, 0, 0);
    switch (idx) {
      case 0: die.rotation.z = -Math.PI / 2; break; // +x → +y
      case 1: die.rotation.z = Math.PI / 2; break;  // -x → +y
      case 2: break; // already +y
      case 3: die.rotation.x = Math.PI; break; // -y → +y
      case 4: die.rotation.x = -Math.PI / 2; break; // +z → +y
      case 5: die.rotation.x = Math.PI / 2; break; // -z → +y
    }
    // Add slight random tilt for natural look
    die.rotation.x += (Math.random() - 0.5) * 0.15;
    die.rotation.z += (Math.random() - 0.5) * 0.15;
  }

  private makeChipStack(table: THREE.Group, color: number, count: number, x: number, z: number, denom: string = ''): void {
    // Real casino chip texture: edge spots + center inlay with denomination
    const chipCanvas = document.createElement('canvas');
    chipCanvas.width = chipCanvas.height = 128;
    const cctx = chipCanvas.getContext('2d')!;
    const baseColor = `#${color.toString(16).padStart(6, '0')}`;

    // Base
    cctx.fillStyle = baseColor;
    cctx.fillRect(0, 0, 128, 128);
    // Edge spots — 8 white rectangles around the rim (classic casino pattern)
    cctx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sx = 64 + Math.cos(angle) * 52;
      const sy = 64 + Math.sin(angle) * 52;
      cctx.save();
      cctx.translate(sx, sy);
      cctx.rotate(angle);
      cctx.fillRect(-6, -14, 12, 28);
      cctx.restore();
    }
    // Center inlay — cream circle with gold ring
    cctx.fillStyle = '#f5f0e1';
    cctx.beginPath(); cctx.arc(64, 64, 34, 0, Math.PI * 2); cctx.fill();
    cctx.strokeStyle = '#d4af37'; cctx.lineWidth = 3;
    cctx.beginPath(); cctx.arc(64, 64, 34, 0, Math.PI * 2); cctx.stroke();
    // Denomination text
    if (denom) {
      cctx.fillStyle = '#1a1a1a';
      cctx.font = 'bold 22px Arial';
      cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
      cctx.fillText(denom, 64, 64);
    }
    const chipTex = new THREE.CanvasTexture(chipCanvas);
    chipTex.colorSpace = THREE.SRGBColorSpace;

    const chipMat = new THREE.MeshStandardMaterial({ map: chipTex, roughness: 0.35 });
    const sideMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });

    for (let i = 0; i < count; i++) {
      // Cylinder with textured top/bottom, solid color side
      const chip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.045, 32),
        [sideMat, chipMat, chipMat]
      );
      // Slight random rotation for realism
      chip.rotation.y = Math.random() * Math.PI * 2;
      chip.position.set(x, 1.66 + i * 0.05, z);
      chip.castShadow = true;
      table.add(chip);
    }
  }

  /**
   * Character seats — 4 AI opponents around the table.
   * Loads GLB models and seats them. Falls back gracefully if models fail.
   */
  private buildSeats(): void {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    // Character definitions: model file, seat angle, name
    // Microsoft Rocketbox photorealistic humans (MIT license)
    const seats: { model: string; angle: number; name: string }[] = [
      { model: '/models/Male_Adult_12.glb', angle: 0.6, name: 'The Boss' },
      { model: '/models/Female_Adult_07.glb', angle: 2.2, name: 'Diva' },
      { model: '/models/Male_Adult_18.glb', angle: 3.8, name: 'Dread Artist' },
      { model: '/models/Male_Adult_10.glb', angle: 5.4, name: 'Enforcer' },
    ];

    // Chair for each seat
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.6 });
    const chairBackMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.7 });

    seats.forEach(({ model, angle, name }) => {
      const sx = Math.cos(angle) * 4.2;
      const sz = Math.sin(angle) * 4.2;

      // Chair
      const chair = new THREE.Group();
      const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 1.0), chairMat);
      seatMesh.position.y = 0.55;
      chair.add(seatMesh);
      const backMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.12), chairBackMat);
      backMesh.position.set(0, 1.1, 0.45);
      chair.add(backMesh);
      for (const [lx, lz] of [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 8), chairMat);
        leg.position.set(lx, 0.28, lz);
        chair.add(leg);
      }
      chair.position.set(sx, 0, sz);
      chair.lookAt(0, 0, 0);
      chair.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
      this.scene.add(chair);

      // Name plate
      const plateCanvas = document.createElement('canvas');
      plateCanvas.width = 256; plateCanvas.height = 64;
      const pctx = plateCanvas.getContext('2d')!;
      pctx.fillStyle = 'rgba(0,0,0,0.7)';
      pctx.fillRect(0, 0, 256, 64);
      pctx.strokeStyle = '#d4af37'; pctx.lineWidth = 3;
      pctx.strokeRect(2, 2, 252, 60);
      pctx.fillStyle = '#ffd700';
      pctx.font = 'bold 28px Arial';
      pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
      pctx.fillText(name, 128, 32);
      const plateTex = new THREE.CanvasTexture(plateCanvas);
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.35),
        new THREE.MeshBasicMaterial({ map: plateTex, transparent: true })
      );
      plate.position.set(sx * 1.15, 2.2, sz * 1.15);
      plate.lookAt(0, 2.2, 0);
      this.scene.add(plate);

      // Load character model
      loader.load(model, (gltf) => {
        const char = gltf.scene;
        char.scale.setScalar(1.1);
        char.position.set(sx, 0.6, sz);
        char.lookAt(0, 1.2, 0);
        // Character-specific styling to match approved lineup
        const charStyles: Record<string, CharacterOutfit> = {
          'The Boss': { skin: 0x6b4a35, shirt: 0x1a1a1a, pants: 0x1a1a1a, hat: 'bandana', hatColor: 0xcc2222, chain: true, glasses: 'sunglasses', bracelet: true },
          'Diva': { skin: 0x5d3d2a, shirt: 0xcc1133, pants: 0xcc1133, chain: true, earrings: true, hairstyle: 'long', hairColor: 0x0a0a0a },
          'Dread Artist': { skin: 0x6b4a35, shirt: 0xf0f0f0, pants: 0x2a2a2a, chain: true, hairstyle: 'dreads', hairColor: 0x1a1a1a, bracelet: true },
          'Enforcer': { skin: 0x5d3d2a, shirt: 0x111111, pants: 0x111111, chain: true, hairstyle: 'fade', watch: true },
        };
        const outfit = charStyles[name] || { skin: 0x6b4a35, shirt: 0x333333, pants: 0x333333 };
        // Store outfit for runtime changes
        (this as any).charOutfits = (this as any).charOutfits || {};
        (this as any).charOutfits[name] = outfit;
        char.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = false;
            // Tint materials: darken skin, color clothes per character
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.color) {
              const matName = (mat.name || '').toLowerCase();
              if (matName.includes('skin') || matName.includes('body') || matName.includes('head') || matName.includes('face')) {
                mat.color.setHex(outfit.skin ?? 0x6b4a35);
              } else if (matName.includes('shirt') || matName.includes('top') || matName.includes('cloth')) {
                mat.color.setHex(outfit.shirt ?? 0x333333);
              }
            }
          }
          const skinned = o as THREE.SkinnedMesh;
          if (skinned.isSkinnedMesh) {
            skinned.frustumCulled = false;
          }
        });

        // Street accessories: gold chain
        const chainMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37, metalness: 1.0, roughness: 0.25,
        });
        const chain = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24), chainMat);
        chain.position.set(0, 1.45, 0.05);
        chain.rotation.x = Math.PI / 2 - 0.2;
        char.add(chain);
        const pendant = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.02), chainMat);
        pendant.position.set(0, 1.32, 0.18);
        char.add(pendant);

        // Build all accessories from outfit config
        this.buildAccessories(char, outfit);

        this.scene.add(char);

        // Store character bones for hand animation
        const bones: Record<string, THREE.Object3D> = {};
        char.traverse((o) => {
          const name = o.name.toLowerCase();
          if (name.includes('hand') || name.includes('arm') || name.includes('shoulder') || name.includes('elbow') || name.includes('wrist')) {
            bones[o.name] = o;
          }
        });
        (this as any).charBones = (this as any).charBones || [];
        (this as any).charBones.push({ char, bones, name });

        // Play idle animation if available
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(char);
          // Find an idle-like animation, or just play the first
          const idleClip = gltf.animations.find((a) =>
            a.name.toLowerCase().includes('idle')
          ) || gltf.animations[0];
          mixer.clipAction(idleClip).play();
          // Store mixer for update loop
          (this as any).charMixers = (this as any).charMixers || [];
          (this as any).charMixers.push(mixer);
        }
      }, undefined, (err) => {
        console.warn(`Could not load character ${name}:`, err);
      });
    });
  }

  /**
   * Character reaches out with bare hand, grabs dice, and throws them.
   * Animates arm bones procedurally: reach → grab (fingers close) → throw → release.
   */
  public characterRollDice(charIndex: number, onRelease: () => void): void {
    const chars = (this as any).charBones as Array<{ char: THREE.Group; bones: Record<string, THREE.Object3D>; name: string }> | undefined;
    if (!chars || !chars[charIndex]) {
      onRelease();
      return;
    }
    const { bones } = chars[charIndex];
    // Find arm bones — supports Mixamo (mixamorig:) and Bip01 (Rocketbox) naming
    const findBone = (names: string[]) => {
      for (const n of names) {
        if (bones[n]) return bones[n];
      }
      return null;
    };
    const shoulder = findBone(['mixamorig:RightShoulder', 'mixamorig:LeftShoulder', 'Bip01 R Clavicle', 'Bip01 L Clavicle']);
    const arm = findBone(['mixamorig:RightArm', 'mixamorig:LeftArm', 'Bip01 R UpperArm', 'Bip01 L UpperArm']);
    const forearm = findBone(['mixamorig:RightForeArm', 'mixamorig:LeftForeArm', 'Bip01 R Forearm', 'Bip01 L Forearm']);
    const hand = findBone(['mixamorig:RightHand', 'mixamorig:LeftHand', 'Bip01 R Hand', 'Bip01 L Hand']);
    if (!shoulder || !arm || !forearm || !hand) {
      onRelease();
      return;
    }
    // Collect finger bones for grab animation (Mixamo has them, Bip01 doesn't)
    const fingers: THREE.Object3D[] = [];
    const side = bones['mixamorig:RightHand'] ? 'Right' : bones['Bip01 R Hand'] ? 'R' : 'Left';
    Object.entries(bones).forEach(([name, bone]) => {
      if ((name.includes(`${side}Hand`) || name.includes(` ${side} `)) && (name.includes('Index') || name.includes('Middle') || name.includes('Ring') || name.includes('Pinky') || name.includes('Thumb') || name.includes('Finger'))) {
        fingers.push(bone);
      }
    });

    // Save original rotations
    const orig = new Map<THREE.Object3D, THREE.Euler>();
    [shoulder, arm, forearm, hand, ...fingers].forEach((b) => orig.set(b, b.rotation.clone()));

    const D = 1.2; // total duration seconds
    const start = performance.now();
    let released = false;

    const animate = () => {
      const t = Math.min((performance.now() - start) / 1000 / D, 1);
      // Phase 1 (0-0.35): reach forward toward dice
      // Phase 2 (0.35-0.5): fingers close (grab)
      // Phase 3 (0.5-0.75): pull back slightly then throw forward
      // Phase 4 (0.75-1.0): fingers open (release), arm returns
      const reach = t < 0.35 ? t / 0.35 : t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
      const grab = t < 0.35 ? 0 : t < 0.5 ? (t - 0.35) / 0.15 : t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
      const throwMotion = t < 0.5 ? 0 : t < 0.75 ? Math.sin(((t - 0.5) / 0.25) * Math.PI) : 0;

      // Arm reaches forward and slightly down toward table
      shoulder.rotation.x = orig.get(shoulder)!.x - reach * 0.9;
      shoulder.rotation.z = orig.get(shoulder)!.z - reach * 0.3;
      arm.rotation.x = orig.get(arm)!.x - reach * 0.5;
      forearm.rotation.x = orig.get(forearm)!.x - reach * 0.7 + throwMotion * 0.8;
      hand.rotation.x = orig.get(hand)!.x - reach * 0.3;

      // Fingers curl to grab
      fingers.forEach((f) => {
        f.rotation.x = grab * 0.9;
      });

      // Release dice at peak of throw
      if (t >= 0.72 && !released) {
        released = true;
        onRelease();
      }

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Restore original pose
        orig.forEach((rot, bone) => bone.rotation.copy(rot));
      }
    };
    animate();
  }

  /**
   * Build all wearable accessories from outfit config.
   * Hats, earrings, glasses, bracelets, watches, hairstyles — all procedural.
   */
  private buildAccessories(char: THREE.Group, outfit: CharacterOutfit): void {
    // Helper to tag accessories for runtime removal
    const add = (obj: THREE.Object3D) => {
      obj.userData.isAccessory = true;
      obj.traverse((o) => { o.userData.isAccessory = true; });
      add(obj);
    };
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.25 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1.0, roughness: 0.3 });
    const hatColor = outfit.hatColor ?? 0xcc2222;
    const hairColor = outfit.hairColor ?? 0x1a1a1a;

    // HATS
    if (outfit.hat === 'bandana') {
      const mat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.8 });
      const bandana = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2), mat);
      bandana.position.set(0, 1.62, 0);
      bandana.scale.set(1.05, 0.7, 1.05);
      add(bandana);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.02), mat);
      tail.position.set(0, 1.55, -0.16);
      tail.rotation.x = 0.3;
      add(tail);
    } else if (outfit.hat === 'cap') {
      const mat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.7 });
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat);
      crown.position.set(0, 1.62, 0);
      add(crown);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16, 1, false, 0, Math.PI), mat);
      brim.position.set(0, 1.62, 0.12);
      brim.rotation.x = 0.1;
      add(brim);
    } else if (outfit.hat === 'fedora') {
      const mat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.6 });
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 20), mat);
      brim.position.set(0, 1.68, 0);
      add(brim);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.14, 16), mat);
      crown.position.set(0, 1.76, 0);
      add(crown);
    } else if (outfit.hat === 'beanie') {
      const mat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.9 });
      const beanie = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.8), mat);
      beanie.position.set(0, 1.62, 0);
      add(beanie);
      const pom = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), mat);
      pom.position.set(0, 1.82, 0);
      add(pom);
    }

    // EARRINGS (both ears)
    if (outfit.earrings) {
      [-1, 1].forEach((side) => {
        const earring = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), goldMat);
        earring.position.set(side * 0.14, 1.55, 0.02);
        add(earring);
        // Dangling part
        const dangle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.06, 8), goldMat);
        dangle.position.set(side * 0.14, 1.51, 0.02);
        add(dangle);
      });
    }

    // GLASSES / SUNGLASSES
    if (outfit.glasses === 'sunglasses' || outfit.glasses === 'shades') {
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.5 });
      [-1, 1].forEach((side) => {
        const lens = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.02), lensMat);
        lens.position.set(side * 0.07, 1.58, 0.13);
        add(lens);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.015), lensMat);
      bridge.position.set(0, 1.58, 0.13);
      add(bridge);
    }

    // BRACELET (right wrist)
    if (outfit.bracelet) {
      const bracelet = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), goldMat);
      bracelet.position.set(0.28, 1.05, 0);
      bracelet.rotation.x = Math.PI / 2;
      add(bracelet);
    }

    // WATCH (left wrist)
    if (outfit.watch) {
      const watchFace = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), silverMat);
      watchFace.position.set(-0.28, 1.05, 0);
      watchFace.rotation.z = Math.PI / 2;
      add(watchFace);
      const watchBand = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 }));
      watchBand.position.set(-0.28, 1.05, 0);
      watchBand.rotation.y = Math.PI / 2;
      add(watchBand);
    }

    // HAIRSTYLES
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.85 });
    if (outfit.hairstyle === 'dreads') {
      // Dreadlocks: multiple hanging cylinders
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dread = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.35, 8), hairMat);
        dread.position.set(Math.cos(angle) * 0.12, 1.45, Math.sin(angle) * 0.12);
        dread.rotation.z = Math.cos(angle) * 0.2;
        dread.rotation.x = Math.sin(angle) * 0.2;
        add(dread);
      }
    } else if (outfit.hairstyle === 'afro') {
      const afro = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), hairMat);
      afro.position.set(0, 1.68, -0.02);
      afro.scale.set(1, 0.9, 1);
      add(afro);
    } else if (outfit.hairstyle === 'long') {
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.4, 0.12), hairMat);
      hair.position.set(0, 1.45, -0.08);
      add(hair);
    } else if (outfit.hairstyle === 'braids') {
      for (let i = 0; i < 6; i++) {
        const x = (i - 2.5) * 0.05;
        const braid = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.3, 8), hairMat);
        braid.position.set(x, 1.48, -0.1);
        add(braid);
      }
    }
    // 'fade' and 'none' need no geometry — the model already has short hair
  }

  /**
   * Change a character's outfit at runtime.
   * Big Face can dress characters however it wants.
   */
  public setOutfit(charName: string, outfit: Partial<CharacterOutfit>): void {
    const outfits = (this as any).charOutfits as Record<string, CharacterOutfit> | undefined;
    const chars = (this as any).charBones as Array<{ char: THREE.Group; name: string }> | undefined;
    if (!outfits || !chars) return;
    // Merge new outfit settings
    outfits[charName] = { ...outfits[charName], ...outfit };
    // Find the character and rebuild accessories
    const entry = chars.find((c) => c.name === charName);
    if (!entry) return;
    // Remove old accessories (anything we added)
    const toRemove: THREE.Object3D[] = [];
    entry.char.traverse((o) => {
      if (o.userData.isAccessory) toRemove.push(o);
    });
    toRemove.forEach((o) => entry.char.remove(o));
    // Rebuild with new outfit
    this.buildAccessories(entry.char, outfits[charName]);
  }

  private buildDust(): void {
    this.dustGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.dustCount * 3);
    this.dustSpeed = new Float32Array(this.dustCount);
    for (let i = 0; i < this.dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      this.dustSpeed[i] = 0.1 + Math.random() * 0.3;
    }
    this.dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x88aaff, size: 0.035, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.scene.add(new THREE.Points(this.dustGeo, mat));
  }

  private buildConfetti(): void {
    const count = 400;
    this.confettiGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    this.confettiVel = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [[1, 0.84, 0], [0, 0.94, 1], [1, 0.18, 0.47], [1, 1, 1]];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = 8 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      this.confettiVel[i * 3] = (Math.random() - 0.5) * 1.5;
      this.confettiVel[i * 3 + 1] = -(1 + Math.random() * 2);
      this.confettiVel[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      const c = palette[i % palette.length];
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    }
    this.confettiGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.confettiGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.confetti = new THREE.Points(this.confettiGeo, mat);
    this.confetti.visible = false;
    this.scene.add(this.confetti);
  }

  private setupZoom(): void {
    const canvas = this.renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';
    let lastPinchDist = 0;

    // --- Drag to orbit: one finger / mouse ---
    let lastX = 0, lastY = 0;
    const startDrag = (x: number, y: number) => {
      this.dragging = true;
      this.lastInteract = performance.now();
      lastX = x; lastY = y;
      canvas.style.cursor = 'grabbing';
    };
    const moveDrag = (x: number, y: number) => {
      if (!this.dragging) return;
      const dx = x - lastX, dy = y - lastY;
      lastX = x; lastY = y;
      // Horizontal drag = orbit around table, vertical = tilt up/down
      this.userAzimuth -= dx * 0.008;
      this.userPolar = Math.max(-0.6, Math.min(0.9, this.userPolar + dy * 0.005));
      this.lastInteract = performance.now();
    };
    const endDrag = () => {
      this.dragging = false;
      this.lastInteract = performance.now();
      canvas.style.cursor = 'grab';
    };
    canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        this.dragging = false; // switch to pinch
        lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastPinchDist > 0) {
          this.userZoom = Math.max(0.5, Math.min(2.5, this.userZoom * (lastPinchDist / dist)));
        }
        lastPinchDist = dist;
        this.lastInteract = performance.now();
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchend', endDrag);
    canvas.addEventListener('wheel', (e) => {
      this.userZoom = Math.max(0.5, Math.min(2.5, this.userZoom * (1 + e.deltaY * 0.001)));
      this.lastInteract = performance.now();
      e.preventDefault();
    }, { passive: false });
  }

  // ============ ANIMATION LOOP ============

  private easeInOut(x: number): number {
    return x * x * (3 - 2 * x);
  }

  private getCameraTarget(section: number, t: number): [THREE.Vector3, THREE.Vector3] {
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3(0, 2, 0);
    switch (section) {
      case 0: // Slow overhead orbit — establishes the room
        pos.set(Math.sin(t * 0.25) * 5, 13, Math.cos(t * 0.25) * 5);
        look.set(0, 1.0, 0);
        break;
      case 1: // Tight dice orbit — the money shot
        {
          const a = t * 0.6;
          pos.set(Math.cos(a) * 2.8, 2.6, Math.sin(a) * 2.8);
          look.set(0, 1.7, 0);
        }
        break;
      case 2: // Wide cinematic sweep — shows the VIP room
        pos.set(Math.cos(t * 0.15) * 22, 8, Math.sin(t * 0.15) * 22);
        look.set(0, 3.5, 0);
        break;
      case 3: // Low hero angle — dramatic, looking up at table
        {
          const a = t * 0.3;
          pos.set(Math.cos(a) * 7, 1.2, Math.sin(a) * 7);
          look.set(0, 2.5, 0);
        }
        break;
      case 4: // Top-down money view — see all the chips
        pos.set(Math.sin(t * 0.2) * 2, 18, Math.cos(t * 0.2) * 2);
        look.set(0, 1.0, 0);
        break;
      default: // Intimate close-up — dealer perspective
        {
          const a = t * 0.4;
          pos.set(Math.cos(a) * 5.5, 3.2, Math.sin(a) * 5.5);
          look.set(0, 1.8, 0);
        }
        break;
    }
    const dir = pos.clone().sub(look).normalize();
    const dist = pos.distanceTo(look) / this.userZoom;
    pos.copy(look).add(dir.multiplyScalar(dist));
    // Manual orbit: user drag offsets the auto-orbit. After 5s idle, ease back.
    const idleSecs = (performance.now() - this.lastInteract) / 1000;
    if (idleSecs > 5 && (this.userAzimuth !== 0 || this.userPolar !== 0)) {
      const ease = Math.min(1, (idleSecs - 5) / 3);
      this.userAzimuth *= 1 - ease * 0.05;
      this.userPolar *= 1 - ease * 0.05;
      if (Math.abs(this.userAzimuth) < 0.001) this.userAzimuth = 0;
      if (Math.abs(this.userPolar) < 0.001) this.userPolar = 0;
    }
    if (this.userAzimuth !== 0 || this.userPolar !== 0) {
      // Rotate position around the look target
      const offset = pos.clone().sub(look);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta += this.userAzimuth;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 + 0.1, spherical.phi + this.userPolar));
      offset.setFromSpherical(spherical);
      pos.copy(look).add(offset);
    }
    return [pos, look];
  }

  private moodTargets(): { blue: number; key: number; ambient: number; blueColor: number } {
    switch (this.mood) {
      case 'tense':
        // Tense: dim warm, dramatic shadows
        return { blue: 60, key: 140, ambient: 0.8, blueColor: 0xcc6633 };
      case 'win':
        // Win: explosive gold celebration
        return { blue: 50, key: 350, ambient: 1.6, blueColor: 0xffd700 };
      case 'lose':
        // Lose: cool fade, somber
        return { blue: 40, key: 90, ambient: 0.6, blueColor: 0x445566 };
      default:
        // Idle: warm VIP luxury
        return { blue: 90, key: 220, ambient: 1.3, blueColor: 0xffb366 };
    }
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // Character animations
    const mixers = (this as any).charMixers as THREE.AnimationMixer[] | undefined;
    if (mixers) {
      for (const m of mixers) m.update(dt);
    }

    // Mood transition
    if (this.moodTransition < 1) {
      this.moodTransition = Math.min(1, this.moodTransition + dt * 1.5);
    }
    const mt = this.easeInOut(this.moodTransition);
    const targets = this.moodTargets();
    // Blend from warm idle toward mood targets
    const idleTargets = { blue: 90, key: 220, ambient: 1.3 };
    this.ceilingBlue.intensity = idleTargets.blue + (targets.blue - idleTargets.blue) * mt
      + Math.sin(t * 1.5) * 12;
    this.ceilingBlue.color.setHex(targets.blueColor);
    this.keyLight.intensity = idleTargets.key + (targets.key - idleTargets.key) * mt;
    this.ambient.intensity = idleTargets.ambient + (targets.ambient - idleTargets.ambient) * mt;
    this.blueSpots.forEach((s, i) => {
      s.intensity = 120 + Math.sin(t * 2 + i * 1.5) * 25;
    });

    // Celebration confetti
    if (this.celebrating) {
      this.celebrateT += dt;
      const pos = this.confettiGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3] += this.confettiVel[i * 3] * dt;
        pos[i * 3 + 1] += this.confettiVel[i * 3 + 1] * dt;
        pos[i * 3 + 2] += this.confettiVel[i * 3 + 2] * dt;
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 10 + Math.random() * 4;
          pos[i * 3] = (Math.random() - 0.5) * 16;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
        }
      }
      this.confettiGeo.attributes.position.needsUpdate = true;
      if (this.celebrateT > 6) {
        this.celebrating = false;
        this.confetti.visible = false;
        this.setMood('idle');
      }
    }

    // Dice rolling — tumble then land on target values
    if (this.rolling) {
      this.rollT += dt;
      const p = Math.min(this.rollT / this.rollDuration, 1);
      const bounce = Math.abs(Math.sin(p * Math.PI * 4)) * (1 - p) * 1.2;
      this.die1.position.set(
        this.die1Home.x + Math.sin(p * 9) * 0.5 * (1 - p),
        1.79 + bounce,
        this.die1Home.z + Math.cos(p * 7) * 0.4 * (1 - p)
      );
      this.die1.rotation.x += dt * 12 * (1 - p);
      this.die1.rotation.y += dt * 15 * (1 - p);
      this.die2.position.set(
        this.die2Home.x + Math.cos(p * 8) * 0.5 * (1 - p),
        1.79 + Math.abs(Math.sin(p * Math.PI * 3 + 1)) * (1 - p) * 1.0,
        this.die2Home.z + Math.sin(p * 6) * 0.4 * (1 - p)
      );
      this.die2.rotation.x += dt * 10 * (1 - p);
      this.die2.rotation.y += dt * 13 * (1 - p);
      if (p >= 1) {
        this.rolling = false;
        this.die1.position.copy(this.die1Home);
        this.die2.position.copy(this.die2Home);
        // Land showing the ACTUAL game values
        this.setDieFace(this.die1, this.targetV1);
        this.setDieFace(this.die2, this.targetV2);
      }
    }

    // Dust drift
    const dp = this.dustGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < this.dustCount; i++) {
      dp[i * 3 + 1] -= this.dustSpeed[i] * dt;
      dp[i * 3] += Math.sin(t * 0.5 + i) * 0.001;
      if (dp[i * 3 + 1] < 0) dp[i * 3 + 1] = 12;
    }
    this.dustGeo.attributes.position.needsUpdate = true;

    // Camera — 6 cinematic angles
    const SECTION_DURATION = 6;
    const TRANSITION = 1.5;
    const prevSection = this.camSection;
    this.sectionTimer += dt;
    if (this.sectionTimer >= SECTION_DURATION) {
      this.sectionTimer = 0;
      this.camSection = (this.camSection + 1) % 6;
      this.prevPos.copy(this.camPos);
      this.prevLook.copy(this.camLook);
    }
    const [newPos, newLook] = this.getCameraTarget(this.camSection, t);
    if (prevSection !== this.camSection || this.sectionTimer < TRANSITION) {
      const prog = this.easeInOut(Math.min(this.sectionTimer / TRANSITION, 1));
      this.targetPos.lerpVectors(this.prevPos, newPos, prog);
      this.targetLook.lerpVectors(this.prevLook, newLook, prog);
    } else {
      this.targetPos.copy(newPos);
      this.targetLook.copy(newLook);
    }
    const lerpSpeed = 1 - Math.pow(0.0001, dt);
    this.camPos.lerp(this.targetPos, lerpSpeed);
    this.camLook.lerp(this.targetLook, lerpSpeed);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);

    this.renderer.render(this.scene, this.camera);
  };
}
