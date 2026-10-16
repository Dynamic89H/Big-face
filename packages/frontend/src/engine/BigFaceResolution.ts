import * as THREE from 'three';

/**
 * BigFaceResolution — resolution engine built ONLY for Big Face.
 * Detects what the device can handle and sets the perfect resolution.
 * If the phone struggles, it automatically drops resolution to keep it smooth.
 */

export interface DeviceProfile {
  isMobile: boolean;
  isLowEnd: boolean;
  pixelRatio: number;
  maxPixelRatio: number;
  shadows: boolean;
  antialias: boolean;
}

export class BigFaceResolution {
  private renderer: THREE.WebGLRenderer;
  private frameTimes: number[] = [];
  private lastFrame = 0;
  private autoDropped = false;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }

  /** Detect what this device can handle */
  static detect(): DeviceProfile {
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua)
      || (window.innerWidth < 768 && 'ontouchstart' in window);

    // Low-end detection: old phones, few cores, little RAM
    const cores = navigator.hardwareConcurrency || 4;
    const ram = (navigator as any).deviceMemory || 4;
    const isLowEnd = isMobile && (cores <= 4 || ram <= 3);

    const dpr = window.devicePixelRatio || 1;

    if (isLowEnd) {
      return {
        isMobile, isLowEnd,
        pixelRatio: 0.75, maxPixelRatio: 1,
        shadows: false, antialias: false,
      };
    }

    if (isMobile) {
      return {
        isMobile, isLowEnd,
        pixelRatio: 1, maxPixelRatio: 1.5,
        shadows: false, antialias: false,
      };
    }

    // Desktop — full quality
    return {
      isMobile, isLowEnd,
      pixelRatio: Math.min(dpr, 2), maxPixelRatio: 2,
      shadows: true, antialias: true,
    };
  }

  /** Apply the detected profile to the renderer */
  apply(profile: DeviceProfile): void {
    this.renderer.setPixelRatio(profile.pixelRatio);
    this.renderer.shadowMap.enabled = profile.shadows;
  }

  /**
   * Call this every frame. If FPS drops below 25 for a while,
   * automatically reduce resolution to keep Big Face smooth.
   * Returns true if resolution was changed.
   */
  autoTune(): boolean {
    const now = performance.now();
    if (this.lastFrame > 0) {
      const frameMs = now - this.lastFrame;
      this.frameTimes.push(frameMs);
      if (this.frameTimes.length > 60) this.frameTimes.shift();

      // Check average over last 60 frames
      if (this.frameTimes.length >= 60 && !this.autoDropped) {
        const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        const fps = 1000 / avg;

        if (fps < 25) {
          // Too slow — drop resolution
          const current = this.renderer.getPixelRatio();
          const next = Math.max(0.5, current * 0.75);
          this.renderer.setPixelRatio(next);
          this.renderer.shadowMap.enabled = false;
          this.autoDropped = true;
          this.frameTimes = [];
          console.log(`[BigFace] Auto-tuned resolution: ${current.toFixed(2)} → ${next.toFixed(2)} (${fps.toFixed(0)} fps)`);
          return true;
        }
      }

      // Reset drop flag if we're running well (allows re-tuning up later)
      if (this.frameTimes.length >= 60) {
        const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        if (1000 / avg > 50) {
          this.autoDropped = false;
        }
      }
    }
    this.lastFrame = now;
    return false;
  }

  /** Handle screen resize / orientation change */
  onResize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.frameTimes = []; // Reset tuning after resize
    this.autoDropped = false;
  }
}
