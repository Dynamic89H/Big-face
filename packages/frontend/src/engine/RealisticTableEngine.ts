import * as THREE from 'three';

export type RealCharacterState = 'idle' | 'talking' | 'celebrating' | 'thinking' | 'drinking' | 'smoking' | 'gesturing';

export interface RealCharacterConfig {
  id: string;
  name: string;
  faceImg: string;
  skinTone: number;
  shirtColor: number;
  pantsColor: number;
  state: RealCharacterState;
  seatIndex: number;
  personality?: string;
}

interface RealCharacter {
  config: RealCharacterConfig;
  group: THREE.Group;
  head: THREE.Mesh;
  jaw: THREE.Mesh; // movable jaw for talking
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
  torso: THREE.Mesh;
  bubble: THREE.Mesh | null;
  phase: number;
  talkAmount: number; // 0-1 mouth open
}

/**
 * RealisticTableEngine — REAL 3D characters, not flat images.
 * - Full 3D bodies with articulated arms (shoulder + elbow)
 * - Movable jaws for talking (mouths actually open)
 * - Faces textured from character images
 * - Realistic table with wood, felt, chips, cards
 * - Cinematic camera that orbits the table
 */
export class RealisticTableEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private characters: Map<string, RealCharacter> = new Map();
  private clock: THREE.Clock;
  private raf = 0;
  private cameraAngle = 0;
  private cameraRadius = 9;
  private cameraHeight = 4;
  private onCharacterClick?: (id: string) => void;
  private loader = new THREE.TextureLoader();

  constructor(mount: HTMLElement, width: number, height: number) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050508);
    this.scene.fog = new THREE.Fog(0x050508, 15, 30);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.updateCamera(0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    mount.appendChild(this.renderer.domElement);

    this.buildCasino();
    this.buildTable();

    this.clock = new THREE.Clock();
    this.animate();

    // Click characters
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    this.renderer.domElement.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, this.camera);
      for (const [, char] of this.characters) {
        if (ray.intersectObject(char.group, true).length > 0) {
          this.onCharacterClick?.(char.config.id);
          this.setTalking(char.config.id, true);
          setTimeout(() => this.setTalking(char.config.id, false), 3000);
          break;
        }
      }
    });
  }

  onClick(fn: (id: string) => void) {
    this.onCharacterClick = fn;
  }

  private buildCasino() {
    // Floor — dark reflective
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(20, 48),
      new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.3, metalness: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Realistic lighting rig
    this.scene.add(new THREE.AmbientLight(0x404060, 0.6));

    // Main chandelier spotlight
    const chandelier = new THREE.SpotLight(0xffe0b0, 150, 30, Math.PI / 4, 0.5);
    chandelier.position.set(0, 10, 0);
    chandelier.target.position.set(0, 0, 0);
    chandelier.castShadow = true;
    chandelier.shadow.mapSize.set(2048, 2048);
    this.scene.add(chandelier);
    this.scene.add(chandelier.target);

    // Warm accent lights around
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const light = new THREE.PointLight(0xff6b35, 20, 15);
      light.position.set(Math.cos(angle) * 8, 3, Math.sin(angle) * 8);
      this.scene.add(light);
    }

    // Gold rim light from behind
    const rim = new THREE.DirectionalLight(0xc9a227, 1.5);
    rim.position.set(-5, 6, -8);
    this.scene.add(rim);

    // Chandelier visual
    const chandGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffeecc })
      );
      bulb.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
      chandGroup.add(bulb);
    }
    const chandRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.08, 10, 40),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.2 })
    );
    chandRing.rotation.x = Math.PI / 2;
    chandGroup.add(chandRing);
    chandGroup.position.set(0, 8, 0);
    this.scene.add(chandGroup);
  }

  private buildTable() {
    const table = new THREE.Group();

    // Wooden table base — rich mahogany
    const baseWood = new THREE.MeshStandardMaterial({ color: 0x4a2510, roughness: 0.4, metalness: 0.1 });

    // Table pedestal
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.4, 1.2, 24), baseWood);
    pedestal.position.y = 0.6;
    pedestal.castShadow = true;
    table.add(pedestal);

    // Table top — thick wood rim
    const woodRim = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.35, 48), baseWood);
    woodRim.position.y = 1.35;
    woodRim.castShadow = true;
    woodRim.receiveShadow = true;
    table.add(woodRim);

    // Felt playing surface — deep green with subtle texture
    const felt = new THREE.Mesh(
      new THREE.CylinderGeometry(2.9, 2.9, 0.38, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d4d24, roughness: 0.95 })
    );
    felt.position.y = 1.36;
    felt.receiveShadow = true;
    table.add(felt);

    // Gold trim ring
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(3.15, 0.06, 10, 60),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 1, roughness: 0.15 })
    );
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 1.55;
    table.add(trim);

    // Betting circles on felt
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const circle = new THREE.Mesh(
        new THREE.RingGeometry(0.28, 0.32, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
      );
      circle.rotation.x = -Math.PI / 2;
      circle.position.set(Math.cos(angle) * 2.2, 1.56, Math.sin(angle) * 2.2);
      table.add(circle);
    }

    // Chip stacks — colorful
    const chipColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffffff, 0x000000];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + 0.3;
      const stackX = Math.cos(angle) * 1.5;
      const stackZ = Math.sin(angle) * 1.5;
      const stackHeight = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < stackHeight; j++) {
        const chip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.05, 20),
          new THREE.MeshStandardMaterial({ color: chipColors[i], roughness: 0.5 })
        );
        chip.position.set(stackX, 1.58 + j * 0.055, stackZ);
        chip.castShadow = true;
        table.add(chip);
      }
    }

    // Playing cards on table
    for (let i = 0; i < 3; i++) {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.02, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.6 })
      );
      card.position.set((i - 1) * 0.5, 1.57, -0.5);
      card.rotation.y = (Math.random() - 0.5) * 0.4;
      card.castShadow = true;
      table.add(card);
    }

    // Dice — realistic white with pips
    [-0.4, 0.4].forEach((x) => {
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.2 })
      );
      die.position.set(x, 1.75, 0.3);
      die.rotation.set(0.3, 0.5, 0.2);
      die.castShadow = true;
      table.add(die);
      // Pips
      const pipGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const pipMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      [[-0.08, 0.18, 0.08], [0.08, 0.18, -0.08], [0, 0.18, 0]].forEach(([px, py, pz]) => {
        const pip = new THREE.Mesh(pipGeo, pipMat);
        pip.position.set(x + px, 1.75 + py, 0.3 + pz);
        table.add(pip);
      });
    });

    // Whiskey bottles
    [[-1.8, 1.2], [1.8, -1.2]].forEach(([bx, bz]) => {
      const bottle = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.16, 0.75, 14),
        new THREE.MeshStandardMaterial({ color: 0x3a1a05, roughness: 0.15, metalness: 0.2 })
      );
      body.position.y = 0.375;
      body.castShadow = true;
      bottle.add(body);
      const neckB = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 0.3, 10),
        new THREE.MeshStandardMaterial({ color: 0x3a1a05, roughness: 0.15 })
      );
      neckB.position.y = 0.85;
      bottle.add(neckB);
      // Liquid inside (amber)
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 0.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xd4841a, transparent: true, opacity: 0.7, roughness: 0.1 })
      );
      liquid.position.y = 0.3;
      bottle.add(liquid);
      bottle.position.set(bx, 1.55, bz);
      table.add(bottle);
    });

    this.scene.add(table);
  }

  addCharacter(config: RealCharacterConfig) {
    if (this.characters.has(config.id)) return;

    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: config.skinTone, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: config.shirtColor, roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor, roughness: 0.8 });

    // Legs
    [-0.25, 0.25].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 1.1, 12), pantsMat);
      leg.position.set(x, 0.55, 0);
      leg.castShadow = true;
      group.add(leg);
      // Shoe
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.45), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 }));
      shoe.position.set(x, 0.075, 0.08);
      shoe.castShadow = true;
      group.add(shoe);
    });

    // Torso — athletic build
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.35, 1.1, 16), shirtMat);
    torso.position.y = 1.65;
    torso.castShadow = true;
    group.add(torso);

    // Gold chain — torus around neck
    const chain = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.035, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 })
    );
    chain.position.y = 2.1;
    chain.rotation.x = Math.PI / 2 - 0.2;
    group.add(chain);
    // Pendant
    const pendant = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.08),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1, emissive: 0x332200 })
    );
    pendant.position.set(0, 1.92, 0.28);
    group.add(pendant);

    // Arms with joints — shoulder + elbow
    const buildArm = (side: number) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.5, 2.05, 0);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.55, 10), shirtMat);
      upperArm.position.y = -0.275;
      upperArm.castShadow = true;
      shoulder.add(upperArm);

      const elbow = new THREE.Group();
      elbow.position.y = -0.55;
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10), skinMat);
      forearm.position.y = -0.25;
      forearm.castShadow = true;
      elbow.add(forearm);

      // Hand
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), skinMat);
      hand.position.y = -0.55;
      hand.castShadow = true;
      elbow.add(hand);

      shoulder.add(elbow);
      group.add(shoulder);
      return { shoulder, elbow };
    };

    const left = buildArm(-1);
    const right = buildArm(1);

    // Head — with face texture
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.55;

    this.loader.load(config.faceImg, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const headMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), headMat);
      head.scale.set(0.85, 1.1, 0.9);
      head.castShadow = true;
      headGroup.add(head);

      // Jaw — separate mesh for talking (mouth opens)
      const jawMat = new THREE.MeshStandardMaterial({ color: config.skinTone, roughness: 0.6 });
      const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), jawMat);
      jaw.scale.set(0.7, 0.5, 0.75);
      jaw.position.y = -0.22;
      headGroup.add(jaw);
      (headGroup as any).jaw = jaw;

      // Teeth — white, visible when jaw opens
      const teeth = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      teeth.position.set(0, -0.12, 0.24);
      headGroup.add(teeth);
    });

    // Placeholder head until texture loads
    const placeholder = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 16), skinMat
    );
    placeholder.scale.set(0.85, 1.1, 0.9);
    headGroup.add(placeholder);

    group.add(headGroup);

    // Position at table
    const angle = (config.seatIndex / 6) * Math.PI * 2 - Math.PI / 2;
    const radius = 4.6;
    group.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    group.lookAt(0, 0, 0);

    this.scene.add(group);

    this.characters.set(config.id, {
      config,
      group,
      head: headGroup as any,
      jaw: (headGroup as any).jaw,
      leftArm: left.shoulder,
      rightArm: right.shoulder,
      leftForearm: left.elbow,
      rightForearm: right.elbow,
      torso,
      bubble: null,
      phase: Math.random() * Math.PI * 2,
      talkAmount: 0,
    });

    // Remove placeholder once real head loads
    setTimeout(() => {
      if (headGroup.children.length > 1) {
        headGroup.remove(placeholder);
      }
    }, 2000);
  }

  setTalking(id: string, talking: boolean) {
    const char = this.characters.get(id);
    if (!char) return;
    char.config.state = talking ? 'talking' : 'idle';
    if (talking) {
      this.say(id, '💬');
    }
  }

  say(id: string, text: string) {
    const char = this.characters.get(id);
    if (!char) return;
    if (char.bubble) {
      this.scene.remove(char.bubble);
      char.bubble = null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.roundRect(8, 8, 240, 80, 20); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(110, 88); ctx.lineTo(100, 115); ctx.lineTo(130, 88);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text.length > 20 ? text.slice(0, 20) + '…' : text, 128, 58);
    const bubble = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.9),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    );
    const worldPos = new THREE.Vector3();
    char.group.getWorldPosition(worldPos);
    bubble.position.set(worldPos.x, 3.6, worldPos.z);
    this.scene.add(bubble);
    char.bubble = bubble;
    setTimeout(() => {
      if (char.bubble === bubble) {
        this.scene.remove(bubble);
        char.bubble = null;
      }
    }, 3000);
  }

  celebrate(id: string) {
    const char = this.characters.get(id);
    if (char) {
      char.config.state = 'celebrating';
      // Arms up!
      setTimeout(() => { char.config.state = 'idle'; }, 4000);
    }
  }

  private updateCamera(t: number) {
    // Cinematic orbit — slow, with subtle height variation
    this.cameraAngle += 0.0008;
    const radius = this.cameraRadius + Math.sin(t * 0.1) * 0.8;
    const height = this.cameraHeight + Math.sin(t * 0.15) * 0.6;
    this.camera.position.set(
      Math.cos(this.cameraAngle) * radius,
      height,
      Math.sin(this.cameraAngle) * radius
    );
    this.camera.lookAt(0, 1.4, 0);
  }

  private animate = () => {
    this.raf = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();

    // Cinematic camera movement
    this.updateCamera(t);

    for (const [, char] of this.characters) {
      const state = char.config.state;
      const breath = Math.sin(t * 1.4 + char.phase);

      // Breathing — chest rises
      char.torso.scale.y = 1 + breath * 0.015;
      char.group.position.y = breath * 0.02;

      // Talking — jaw opens and closes, teeth visible
      if (state === 'talking') {
        char.talkAmount = Math.abs(Math.sin(t * 8));
        const jaw = (char.head as any).jaw;
        if (jaw) {
          jaw.position.y = -0.22 - char.talkAmount * 0.12;
          jaw.rotation.x = char.talkAmount * 0.4;
        }
        // Head bobs slightly
        char.head.rotation.x = Math.sin(t * 8) * 0.05;
        // Right hand gestures while talking
        char.rightArm.rotation.x = -0.6 + Math.sin(t * 6) * 0.3;
        char.rightForearm.rotation.x = -0.4 + Math.cos(t * 6) * 0.2;
      } else {
        // Jaw closes
        const jaw = (char.head as any).jaw;
        if (jaw) {
          jaw.position.y += (-0.22 - jaw.position.y) * 0.2;
          jaw.rotation.x *= 0.9;
        }
        char.head.rotation.x *= 0.95;
      }

      if (state === 'celebrating') {
        // Jump + arms in the air
        char.group.position.y = Math.abs(Math.sin(t * 6)) * 0.4;
        char.leftArm.rotation.z = 2.6; // arms up
        char.rightArm.rotation.z = -2.6;
        char.leftArm.rotation.x = Math.sin(t * 6) * 0.3;
        char.rightArm.rotation.x = Math.cos(t * 6) * 0.3;
      } else if (state === 'drinking') {
        // Raise right arm to mouth
        char.rightArm.rotation.x = -1.8;
        char.rightForearm.rotation.x = -1.2;
        char.head.rotation.x = -0.3; // tilt back
      } else if (state === 'smoking') {
        // Relaxed, left arm bent (holding cigarette)
        char.leftArm.rotation.x = -0.4;
        char.leftForearm.rotation.x = -1.0;
        char.group.rotation.y = Math.sin(t * 0.5 + char.phase) * 0.1;
      } else if (state === 'thinking') {
        // Hand to chin
        char.rightArm.rotation.x = -0.8;
        char.rightForearm.rotation.x = -1.8;
        char.head.rotation.z = 0.1;
      } else if (state === 'idle') {
        // Natural relaxed arms
        char.leftArm.rotation.x = Math.sin(t * 1.2 + char.phase) * 0.08;
        char.rightArm.rotation.x = Math.cos(t * 1.2 + char.phase) * 0.08;
        char.leftArm.rotation.z = 0.15;
        char.rightArm.rotation.z = -0.15;
        char.leftForearm.rotation.x = -0.2;
        char.rightForearm.rotation.x = -0.2;
      }

      // Face the table
      const lookTarget = new THREE.Vector3(0, char.group.position.y + 1.5, 0);
      char.group.lookAt(lookTarget);

      // Speech bubble follows
      if (char.bubble) {
        const wp = new THREE.Vector3();
        char.group.getWorldPosition(wp);
        char.bubble.position.set(wp.x, 3.6 + Math.sin(t * 2) * 0.05, wp.z);
        char.bubble.lookAt(this.camera.position);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
  }
}
