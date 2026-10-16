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

  /** Initialize the engine on a canvas. Called once at app boot.
   *  @param staticMode — render one still frame of the starfield, no animation
   *  (for Reduce Motion: keeps the premium look with zero movement). */
  init(canvas: HTMLCanvasElement, staticMode = false): void {
    if (this.renderer) return;

    // Mobile perf: lower pixel ratio and fewer stars on phones
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (window.innerWidth < 768 && 'ontouchstart' in window);
    this.isMobile = isMobile;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070810, 0.028);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 1.5, 8);

    this.buildEnvironment(staticMode);
    this.handleResize();
    this.handleVisibility();
    if (staticMode) {
      // Single still frame — no animation loop, no motion.
      this.renderer.render(this.scene, this.camera);
    } else {
      this.start();
    }
  }

  private isMobile = false;

  /** Pause rendering when the tab/app is hidden — saves battery & CPU. */
  private handleVisibility(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.wasPausedBeforeHide = this.paused;
        this.pause();
      } else if (!this.wasPausedBeforeHide) {
        this.resume();
      }
    });
  }

  private wasPausedBeforeHide = false;

  /** The living 3D environment — black starfield with shooting stars. */
  private buildEnvironment(staticMode = false): void {
    // --- Pure black space ---
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = null;

    // --- Soft ambient so 3D models stay visible ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(3, 4, 5);
    this.scene.add(key);

    // --- Starfield: 1500 stars on desktop, 700 on mobile (perf) ---
    // ROUND soft sprites, not blocky.
    const starCount = this.isMobile ? 700 : 1500;

    // Generate a soft circular star sprite (no more Lego squares)
    const makeStarSprite = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    };
    const starSprite = makeStarSprite();

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0xffffff), new THREE.Color(0xffffff),
      new THREE.Color(0xcce6ff), new THREE.Color(0xffe9c4),
      new THREE.Color(0x00f0ff),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.6, map: starSprite, vertexColors: true,
      transparent: true, opacity: 0.95,
      sizeAttenuation: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    this.scene.add(stars);

    if (staticMode) return; // No animation — single still frame of the starfield

    // Twinkle — subtle opacity pulse
    this.onUpdate((_dt, t) => {
      starMat.opacity = 0.85 + Math.sin(t * 2) * 0.1;
      stars.rotation.y = t * 0.005;
    });

    // --- Shooting stars ---
    interface Meteor {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
    }
    const meteors: Meteor[] = [];
    const meteorGeo = new THREE.SphereGeometry(0.08, 8, 8);
    // Elongated glow trail via scaled sphere
    const trailGeo = new THREE.CylinderGeometry(0.02, 0.06, 2.5, 8);

    const spawnMeteor = () => {
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const head = new THREE.Mesh(meteorGeo, headMat);
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0x88ccff, transparent: true, opacity: 0.6,
      });
      const trail = new THREE.Mesh(trailGeo, trailMat);

      const meteorGroup = new THREE.Group();
      meteorGroup.add(head);
      meteorGroup.add(trail);

      // Random start in upper sky
      const startX = (Math.random() - 0.5) * 40;
      const startY = 8 + Math.random() * 10;
      const startZ = -15 - Math.random() * 15;
      meteorGroup.position.set(startX, startY, startZ);

      // Streak diagonally down
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6 - 0.4,
        -0.8 - Math.random() * 0.4,
        0
      ).normalize();

      // Orient trail along direction
      trail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate());
      trail.position.copy(dir.clone().multiplyScalar(-1.25));

      // Wrap in a single mesh-like object for tracking
      const wrapper = new THREE.Mesh();
      wrapper.add(meteorGroup);
      // Store velocity on the group
      (wrapper as any).velocity = dir.multiplyScalar(12 + Math.random() * 8);
      (wrapper as any).life = 0;
      (wrapper as any).maxLife = 1.5 + Math.random();

      this.scene.add(wrapper);
      meteors.push({
        mesh: wrapper,
        velocity: (wrapper as any).velocity,
        life: 0,
        maxLife: (wrapper as any).maxLife,
      });
    };

    // Spawn a shooting star every 2–6 seconds
    let nextMeteor = 2;
    this.onUpdate((dt, t) => {
      if (t > nextMeteor) {
        spawnMeteor();
        nextMeteor = t + 2 + Math.random() * 4;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.mesh.position.addScaledVector(m.velocity, dt);
        // Fade out near end of life
        const fade = 1 - m.life / m.maxLife;
        m.mesh.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshBasicMaterial) {
            obj.material.transparent = true;
            obj.material.opacity = Math.max(0, fade);
          }
        });
        if (m.life >= m.maxLife) {
          this.scene.remove(m.mesh);
          meteors.splice(i, 1);
        }
      }
    });

    // --- Slow camera drift ---
    this.onUpdate((_dt, t) => {
      this.camera.position.x = Math.sin(t * 0.08) * 0.8;
      this.camera.position.y = 1.5 + Math.sin(t * 0.05) * 0.2;
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
    let lastFrame = 0;
    // Mobile: cap at 30fps — halves GPU load, still looks smooth for a background
    const frameInterval = this.isMobile ? 1000 / 30 : 0;
    const loop = (now: number) => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      if (this.paused) return; // Skip render when paused — saves CPU/GPU
      if (frameInterval && now - lastFrame < frameInterval) return;
      lastFrame = now;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.clock.elapsedTime;
      for (const fn of this.updatables) fn(dt, t);
      this.renderer.render(this.scene, this.camera);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private paused = false;

  /** Pause rendering — saves CPU/GPU when another 3D view is active */
  pause(): void {
    this.paused = true;
  }

  /** Resume rendering */
  resume(): void {
    this.paused = false;
    this.clock.getDelta(); // Reset delta to avoid jump
  }

  /** Check if paused */
  isPaused(): boolean {
    return this.paused;
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
