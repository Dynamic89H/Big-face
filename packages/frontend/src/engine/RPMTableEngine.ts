import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface RPMCharacterConfig {
  id: string;
  name: string;
  modelUrl: string; // Ready Player Me GLB URL
  seatIndex: number;
  state: 'idle' | 'talking' | 'celebrating';
}

interface RPMCharacter {
  config: RPMCharacterConfig;
  model: THREE.Group;
  mixer: THREE.AnimationMixer | null;
  actions: Map<string, THREE.AnimationAction>;
  bubble: THREE.Mesh | null;
  phase: number;
}

/**
 * RPMTableEngine — REAL human 3D models at the dice table.
 * Uses Ready Player Me avatars (free, realistic humans).
 * No primitives, no flat pictures — actual 3D people.
 */
export class RPMTableEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private characters: Map<string, RPMCharacter> = new Map();
  private clock: THREE.Clock;
  private raf = 0;
  private cameraAngle = 0;
  private loader = new GLTFLoader();
  private onCharacterClick?: (id: string) => void;

  constructor(mount: HTMLElement, width: number, height: number) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060608);
    this.scene.fog = new THREE.Fog(0x060608, 18, 35);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    mount.appendChild(this.renderer.domElement);

    this.buildEnvironment();
    this.clock = new THREE.Clock();
    this.animate();

    // Click to interact
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    this.renderer.domElement.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, this.camera);
      for (const [, char] of this.characters) {
        if (ray.intersectObject(char.model, true).length > 0) {
          this.onCharacterClick?.(char.config.id);
          break;
        }
      }
    });
  }

  onClick(fn: (id: string) => void) {
    this.onCharacterClick = fn;
  }

  private buildEnvironment() {
    // Casino floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(25, 64),
      new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.25, metalness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Cinematic lighting — GTA style
    this.scene.add(new THREE.AmbientLight(0x303048, 0.8));

    const key = new THREE.SpotLight(0xffe2b8, 200, 35, Math.PI / 4, 0.4);
    key.position.set(0, 12, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    this.scene.add(key);
    this.scene.add(key.target);

    // Colored accent lights (club atmosphere)
    const colors = [0xff2d78, 0x00e5ff, 0xffd700, 0x7b2dff];
    colors.forEach((color, i) => {
      const angle = (i / 4) * Math.PI * 2;
      const light = new THREE.PointLight(color, 30, 20);
      light.position.set(Math.cos(angle) * 10, 4, Math.sin(angle) * 10);
      this.scene.add(light);
    });

    // Back rim light for depth
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, 8, -12);
    this.scene.add(rim);

    this.buildTable();
  }

  private buildTable() {
    const table = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.35, metalness: 0.15 });
    const feltMat = new THREE.MeshStandardMaterial({ color: 0x0e4d26, roughness: 0.95 });

    // Pedestal base
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 1.3, 32), woodMat);
    pedestal.position.y = 0.65;
    pedestal.castShadow = true;
    table.add(pedestal);

    // Wooden rail
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.4, 64), woodMat);
    rail.position.y = 1.4;
    rail.castShadow = true;
    rail.receiveShadow = true;
    table.add(rail);

    // Felt surface
    const felt = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.42, 64), feltMat);
    felt.position.y = 1.41;
    felt.receiveShadow = true;
    table.add(felt);

    // Brass trim
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.07, 12, 80),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 })
    );
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 1.62;
    table.add(trim);

    // Chip stacks with realistic colors
    const chipSets = [
      { color: 0xcc0000, x: 1.2, z: 0.8 },
      { color: 0x0033cc, x: -1.2, z: 0.8 },
      { color: 0x00aa00, x: 0, z: -1.4 },
      { color: 0x111111, x: 1.8, z: -0.5 },
      { color: 0xffffff, x: -1.8, z: -0.5 },
    ];
    chipSets.forEach(({ color, x, z }) => {
      const count = 4 + Math.floor(Math.random() * 5);
      for (let j = 0; j < count; j++) {
        const chip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.19, 0.055, 24),
          new THREE.MeshStandardMaterial({ color, roughness: 0.45 })
        );
        // White edge spots
        const edge = new THREE.Mesh(
          new THREE.TorusGeometry(0.19, 0.015, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
        );
        edge.rotation.x = Math.PI / 2;
        chip.add(edge);
        chip.position.set(x, 1.65 + j * 0.06, z);
        chip.castShadow = true;
        table.add(chip);
      }
    });

    // Cards
    for (let i = 0; i < 5; i++) {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.015, 0.52),
        new THREE.MeshStandardMaterial({ color: 0xf8f6f0, roughness: 0.55 })
      );
      card.position.set((i - 2) * 0.45, 1.64, 0.9);
      card.rotation.y = (Math.random() - 0.5) * 0.5;
      card.castShadow = true;
      table.add(card);
    }

    // Dice
    [-0.45, 0.45].forEach((x) => {
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.38, 0.38),
        new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15 })
      );
      die.position.set(x, 1.82, 0.2);
      die.rotation.set(0.4, 0.7, 0.3);
      die.castShadow = true;
      table.add(die);
    });

    // Bottles
    [[-2, 1.5], [2, -1.5], [0, 2.2]].forEach(([bx, bz]) => {
      const bottle = new THREE.Group();
      const glass = new THREE.MeshStandardMaterial({
        color: 0x2a1505, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.9,
      });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.8, 16), glass);
      body.position.y = 0.4;
      body.castShadow = true;
      bottle.add(body);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.35, 12), glass);
      neck.position.y = 0.95;
      bottle.add(neck);
      bottle.position.set(bx, 1.62, bz);
      table.add(bottle);
    });

    this.scene.add(table);
  }

  async addCharacter(config: RPMCharacterConfig) {
    if (this.characters.has(config.id)) return;

    try {
      const gltf = await this.loader.loadAsync(config.modelUrl);
      const model = gltf.scene;

      // Scale and position
      model.scale.setScalar(1.6);
      const angle = (config.seatIndex / 6) * Math.PI * 2 - Math.PI / 2;
      const radius = 5;
      model.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      model.lookAt(0, 0, 0);

      // Shadows
      model.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      // Animation mixer
      const mixer = new THREE.AnimationMixer(model);
      const actions = new Map<string, THREE.AnimationAction>();
      gltf.animations.forEach((clip) => {
        actions.set(clip.name, mixer.clipAction(clip));
      });

      // Play idle if available
      const idle = actions.get('idle') || actions.values().next().value;
      if (idle) idle.play();

      this.scene.add(model);
      this.characters.set(config.id, {
        config, model, mixer, actions,
        bubble: null, phase: Math.random() * Math.PI * 2,
      });
    } catch (e) {
      console.error(`Failed to load character ${config.id}:`, e);
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
    canvas.width = 512; canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    // GTA-style subtitle box
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(8, 8, 496, 100, 12); ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(char.config.name.toUpperCase(), 28, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(text.length > 40 ? text.slice(0, 40) + '…' : text, 28, 72);

    const bubble = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 1),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false })
    );
    const wp = new THREE.Vector3();
    char.model.getWorldPosition(wp);
    bubble.position.set(wp.x, 3.4, wp.z);
    bubble.renderOrder = 999;
    this.scene.add(bubble);
    char.bubble = bubble;
    setTimeout(() => {
      if (char.bubble === bubble) {
        this.scene.remove(bubble);
        char.bubble = null;
      }
    }, 4000);
  }

  private animate = () => {
    this.raf = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // GTA cinematic camera — slow orbit with push/pull
    this.cameraAngle += dt * 0.12;
    const radius = 10 + Math.sin(t * 0.08) * 1.5;
    const height = 4.2 + Math.sin(t * 0.12) * 0.8;
    this.camera.position.set(
      Math.cos(this.cameraAngle) * radius,
      height,
      Math.sin(this.cameraAngle) * radius
    );
    this.camera.lookAt(0, 1.6, 0);

    // Update character animations
    for (const [, char] of this.characters) {
      if (char.mixer) char.mixer.update(dt);
      // Subtle breathing
      char.model.position.y = Math.sin(t * 1.5 + char.phase) * 0.02;
      // Bubble follows camera
      if (char.bubble) {
        const wp = new THREE.Vector3();
        char.model.getWorldPosition(wp);
        char.bubble.position.set(wp.x, 3.4 + Math.sin(t * 2) * 0.05, wp.z);
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

// Ready Player Me demo avatars — realistic humans, free to use
export const RPM_DEMO_AVATARS = [
  'https://models.readyplayer.me/658a1e1a1e1a1e1a1e1a1e1a.glb', // placeholder
];
