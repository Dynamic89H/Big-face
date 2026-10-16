import * as THREE from 'three';

/**
 * SmoothEngine — keeps the 3D scene running at a smooth pace.
 * Monitors FPS and automatically scales quality up/down to hold 60fps.
 * Built by Probus for Big Face.
 */
export class SmoothEngine {
  private renderer: THREE.WebGLRenderer;
  private frameTimes: number[] = [];
  private lastTime = performance.now();
  private qualityLevel = 2; // 0=low, 1=medium, 2=high, 3=ultra
  private checkTimer = 0;
  private basePixelRatio: number;
  onQualityChange?: (level: number, fps: number) => void;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.basePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.applyQuality();
  }

  /** Call this every frame with delta time */
  update(dt: number): void {
    const now = performance.now();
    const frameMs = now - this.lastTime;
    this.lastTime = now;

    this.frameTimes.push(frameMs);
    if (this.frameTimes.length > 60) this.frameTimes.shift();

    this.checkTimer += dt;
    if (this.checkTimer >= 2.0) {
      this.checkTimer = 0;
      this.autoTune();
    }
  }

  getFPS(): number {
    if (this.frameTimes.length === 0) return 60;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return 1000 / Math.max(avg, 0.01);
  }

  private autoTune(): void {
    const fps = this.getFPS();
    let changed = false;

    if (fps < 45 && this.qualityLevel > 0) {
      this.qualityLevel--;
      changed = true;
    } else if (fps > 58 && this.qualityLevel < 3) {
      this.qualityLevel++;
      changed = true;
    }

    if (changed) {
      this.applyQuality();
      this.onQualityChange?.(this.qualityLevel, Math.round(fps));
    }
  }

  private applyQuality(): void {
    const r = this.renderer;
    switch (this.qualityLevel) {
      case 0: // Low - potato phones
        r.setPixelRatio(Math.min(this.basePixelRatio, 0.75));
        r.shadowMap.enabled = false;
        break;
      case 1: // Medium
        r.setPixelRatio(Math.min(this.basePixelRatio, 1));
        r.shadowMap.enabled = true;
        r.shadowMap.type = THREE.BasicShadowMap;
        break;
      case 2: // High
        r.setPixelRatio(Math.min(this.basePixelRatio, 1.25));
        r.shadowMap.enabled = true;
        r.shadowMap.type = THREE.PCFShadowMap;
        break;
      case 3: // Ultra
        r.setPixelRatio(Math.min(this.basePixelRatio, 1.5));
        r.shadowMap.enabled = true;
        r.shadowMap.type = THREE.PCFSoftShadowMap;
        break;
    }
    // Force material update when toggling shadows
    r.shadowMap.needsUpdate = true;
  }

  getQuality(): number {
    return this.qualityLevel;
  }

  /** Force a specific quality level (0-3) */
  setQuality(level: number): void {
    this.qualityLevel = Math.max(0, Math.min(3, level));
    this.applyQuality();
  }
}
