import * as THREE from 'three';

/**
 * Big Face Engine — the core real-time 3D engine powering the entire app.
 * Manages the render loop, scene graph, lighting, particles, and asset pipeline.
 * This is Big Face's own software — every visual in the app runs through here.
 */
export class BigFaceEngine {
  private static instance: BigFaceEngine | null = null;

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  clock = new THREE.Clock();
  private raf = 0;
  private updatables: Array<(dt: number, t: number) => void> = [];
  private disposed = false;

  /** Singleton — one engine for the whole app. */
  static get(): BigFaceEngine {
    if (!BigFaceEngine.instance) {
      BigFaceEngine.instance = new BigFaceEngine();
    }
    return BigFaceEngine.instance;
  }

  /** Initialize the engine on a canvas. Called once at app boot. */
  init(canvas: HTMLCanvasElement): void {
    if (this.renderer) return;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070810, 0.028);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.5, 8);

    this.buildEnvironment();
    this.handleResize();
    this.start();
  }

  /** The living 3D environment — digital cityscape backdrop for the whole app. */
  private buildEnvironment(): void {
    // --- Lighting rig ---
    const ambient = new THREE.AmbientLight(0x8899ff, 0.5);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 8, 6);
    this.scene.add(key);

    const cyanGlow = new THREE.PointLight(0x00f0ff, 30, 40);
    cyanGlow.position.set(-8, 3, -6);
    this.scene.add(cyanGlow);

    const pinkGlow = new THREE.PointLight(0xff2fd6, 25, 40);
    pinkGlow.position.set(8, 2, -8);
    this.scene.add(pinkGlow);

    const purpleGlow = new THREE.PointLight(0x8b5cf6, 20, 50);
    purpleGlow.position.set(0, 6, -12);
    this.scene.add(purpleGlow);

    // --- Digital grid floor ---
    const grid = new THREE.GridHelper(60, 60, 0x00f0ff, 0x1a2a4a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    grid.position.y = -3;
    this.scene.add(grid);

    // --- Floating city blocks (distant skyline) ---
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0d1220, roughness: 0.4, metalness: 0.8,
      emissive: 0x001133, emissiveIntensity: 0.6,
    });
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 });

    for (let i = 0; i < 28; i++) {
      const w = 1 + Math.random() * 2;
      const h = 3 + Math.random() * 8;
      const d = 1 + Math.random() * 2;
      const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), buildingMat);
      const side = i % 2 === 0 ? -1 : 1;
      building.position.set(
        side * (6 + Math.random() * 14),
        h / 2 - 3,
        -8 - Math.random() * 18
      );
      this.scene.add(building);

      // Lit windows
      const floors = Math.floor(h / 0.8);
      for (let f = 0; f < floors; f += 2) {
        if (Math.random() > 0.4) {
          const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, 0.3), windowMat);
          win.position.set(building.position.x, -2 + f * 0.8, building.position.z + d / 2 + 0.01);
          this.scene.add(win);
        }
      }
    }

    // --- Floating particles (digital dust) ---
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color(0x00f0ff), new THREE.Color(0xff2fd6), new THREE.Color(0xffc94d), new THREE.Color(0x8b5cf6)];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 12 - 3;
      positions[i * 3 + 2] = -Math.random() * 25;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(pGeo, pMat);
    this.scene.add(particles);

    // Animate particles drifting upward
    this.onUpdate((_dt, t) => {
      const pos = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = pos.getY(i) + 0.008;
        if (y > 9) y = -3;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.5 + i) * 0.002);
      }
      pos.needsUpdate = true;
    });

    // --- Slow camera drift ---
    this.onUpdate((_dt, t) => {
      this.camera.position.x = Math.sin(t * 0.1) * 1.2;
      this.camera.position.y = 1.5 + Math.sin(t * 0.07) * 0.3;
      this.camera.lookAt(0, 0.5, -5);
    });
  }

  /** Register a per-frame callback. Returns an unsubscribe function. */
  onUpdate(fn: (dt: number, t: number) => void): () => void {
    this.updatables.push(fn);
    return () => {
      this.updatables = this.updatables.filter((u) => u !== fn);
    };
  }

  private start(): void {
    const loop = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.clock.elapsedTime;
      for (const fn of this.updatables) fn(dt, t);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  private handleResize(): void {
    window.addEventListener('resize', () => {
      if (!this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    BigFaceEngine.instance = null;
  }
}
