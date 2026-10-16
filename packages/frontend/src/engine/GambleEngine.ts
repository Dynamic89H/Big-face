import * as THREE from 'three';

export type GambleMood = 'idle' | 'tense' | 'win' | 'lose';

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

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const h = Math.min(height, width * 0.625);
    this.renderer.setSize(width, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    this.buildLights();
    this.buildRoom();
    this.buildTable();
    this.buildDust();
    this.buildConfetti();
    this.setupZoom();
    this.animate();
  }

  // ============ PUBLIC GAME API ============

  /** Roll the 3D dice and land showing the actual game values */
  rollDice(v1: number, v2: number): void {
    this.targetV1 = Math.max(1, Math.min(6, v1));
    this.targetV2 = Math.max(1, Math.min(6, v2));
    this.rolling = true;
    this.rollT = 0;
    // Focus camera on dice during roll
    this.camSection = 1;
    this.sectionTimer = 0;
    this.prevPos.copy(this.camPos);
    this.prevLook.copy(this.camLook);
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
    this.ambient = new THREE.AmbientLight(0x1a2a4a, 1.1);
    this.scene.add(this.ambient);

    this.ceilingBlue = new THREE.PointLight(0x2266ff, 80, 40, 1.4);
    this.ceilingBlue.position.set(0, 15, 0);
    this.scene.add(this.ceilingBlue);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const spot = new THREE.SpotLight(0x4488ff, 120, 35, Math.PI / 6, 0.5, 1.3);
      spot.position.set(Math.cos(angle) * 8, 14, Math.sin(angle) * 8);
      spot.target.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.blueSpots.push(spot);
    }

    this.keyLight = new THREE.SpotLight(0xffd9a0, 200, 40, Math.PI / 5, 0.35, 1.2);
    this.keyLight.position.set(0, 14, 0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);
    this.scene.add(this.keyLight.target);

    const underGlow = new THREE.PointLight(0xff6b35, 15, 8);
    underGlow.position.set(0, 0.4, 0);
    this.scene.add(underGlow);

    const accentData: [number, number][] = [
      [0x2266ff, 0.4], [0xffd700, 1.9], [0x2266ff, 3.5], [0xffd700, 5.1],
    ];
    accentData.forEach(([color, angle]) => {
      const light = new THREE.PointLight(color, 35, 26, 1.5);
      light.position.set(Math.cos(angle) * 13, 4, Math.sin(angle) * 13);
      this.scene.add(light);
    });

    const rim = new THREE.DirectionalLight(0x6688ff, 0.8);
    rim.position.set(-6, 8, -8);
    this.scene.add(rim);
  }

  private buildRoom(): void {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(40, 64),
      new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.15, metalness: 0.9 })
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

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.85 });
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
      [0.5, 17.5].forEach((y) => {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(wallLen, 0.25, 0.6), wallGoldMat);
        trim.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        trim.lookAt(0, y, 0);
        this.scene.add(trim);
      });
    }

    // Chandelier
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
    }
    chandelier.position.y = 11;
    this.scene.add(chandelier);
    const chandLight = new THREE.PointLight(0xffd9a0, 120, 30, 1.5);
    chandLight.position.y = 10.4;
    this.scene.add(chandLight);

    // Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.4, metalness: 0.3 });
    const pillarGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.25 });
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

    // Neon floor strips
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
      this.scene.add(strip);
    }

    // VIP lounges
    this.buildLounges();
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

    // Felt
    const feltCanvas = document.createElement('canvas');
    feltCanvas.width = feltCanvas.height = 512;
    const fctx = feltCanvas.getContext('2d')!;
    fctx.fillStyle = '#0d5c2e';
    fctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8000; i++) {
      fctx.fillStyle = `rgba(${10 + Math.random() * 30},${80 + Math.random() * 40},${30 + Math.random() * 20},0.15)`;
      fctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
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

    // Chips
    this.makeChipStack(table, 0xcc0000, 8, 1.8, 1.2);
    this.makeChipStack(table, 0x111111, 6, -1.7, 1.3);
    this.makeChipStack(table, 0x0066cc, 10, 0.2, -2.0);
    this.makeChipStack(table, 0xd4af37, 7, 2.0, -0.9);

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

  private makeChipStack(table: THREE.Group, color: number, count: number, x: number, z: number): void {
    for (let i = 0; i < count; i++) {
      const chip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.045, 24),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
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
    let lastPinchDist = 0;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastPinchDist > 0) {
          this.userZoom = Math.max(0.5, Math.min(2.5, this.userZoom * (lastPinchDist / dist)));
        }
        lastPinchDist = dist;
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('wheel', (e) => {
      this.userZoom = Math.max(0.5, Math.min(2.5, this.userZoom * (1 + e.deltaY * 0.001)));
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
      case 0:
        pos.set(Math.sin(t * 0.3) * 4, 12, Math.cos(t * 0.3) * 4);
        look.set(0, 1.2, 0);
        break;
      case 1: {
        const a = t * 0.5;
        pos.set(Math.cos(a) * 3.5, 3, Math.sin(a) * 3.5);
        look.set(0, 1.7, 0);
        break;
      }
      case 2:
        pos.set(Math.cos(t * 0.2) * 20, 9, Math.sin(t * 0.2) * 20);
        look.set(0, 3, 0);
        break;
      default: {
        const a = t * 0.35;
        pos.set(Math.cos(a) * 10, 4.5, Math.sin(a) * 10);
        look.set(0, 1.8, 0);
        break;
      }
    }
    const dir = pos.clone().sub(look).normalize();
    const dist = pos.distanceTo(look) / this.userZoom;
    pos.copy(look).add(dir.multiplyScalar(dist));
    return [pos, look];
  }

  private moodTargets(): { blue: number; key: number; ambient: number; blueColor: number } {
    switch (this.mood) {
      case 'tense':
        return { blue: 130, key: 120, ambient: 0.7, blueColor: 0x1a44cc };
      case 'win':
        return { blue: 40, key: 320, ambient: 1.4, blueColor: 0xffd700 };
      case 'lose':
        return { blue: 50, key: 80, ambient: 0.5, blueColor: 0x334466 };
      default:
        return { blue: 80, key: 200, ambient: 1.1, blueColor: 0x2266ff };
    }
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // Mood transition
    if (this.moodTransition < 1) {
      this.moodTransition = Math.min(1, this.moodTransition + dt * 1.5);
    }
    const mt = this.easeInOut(this.moodTransition);
    const targets = this.moodTargets();
    // Blend from idle toward mood targets
    const idleTargets = { blue: 80, key: 200, ambient: 1.1 };
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

    // Camera
    const SECTION_DURATION = 7;
    const TRANSITION = 1.2;
    const prevSection = this.camSection;
    this.sectionTimer += dt;
    if (this.sectionTimer >= SECTION_DURATION) {
      this.sectionTimer = 0;
      this.camSection = (this.camSection + 1) % 4;
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
