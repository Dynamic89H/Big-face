import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AmbientDice — live 3D dice continuously rolling in the background.
 * Makes Gamble Face feel alive even when no game is active.
 */
export default function AmbientDice({ width = 400, height = 300 }: { width?: number; height?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 6, 4);
    key.castShadow = true;
    scene.add(key);
    const neon = new THREE.PointLight(0x00f0ff, 20, 20);
    neon.position.set(-3, 2, 2);
    scene.add(neon);
    const pink = new THREE.PointLight(0xff2fd6, 15, 20);
    pink.position.set(3, 1, -2);
    scene.add(pink);

    // Felt table
    const table = new THREE.Mesh(
      new THREE.CircleGeometry(6, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d2818, roughness: 0.9 })
    );
    table.rotation.x = -Math.PI / 2;
    table.position.y = -1.2;
    table.receiveShadow = true;
    scene.add(table);

    // Gold rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.15, 12, 64),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.3 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -1.2;
    scene.add(rim);

    // Dice factory
    const diceMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.25, metalness: 0.1 });
    const pipMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    function makeDie(): THREE.Group {
      const die = new THREE.Group();
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), diceMat);
      cube.castShadow = true;
      die.add(cube);

      // Pips — simplified: dots on each face
      const pipGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const faces: Array<[number, number, number, number]> = [
        [0, 0, 0.36, 1], [0, 0, -0.36, 1], // front/back
        [0.36, 0, 0, 2], [-0.36, 0, 0, 3], // sides
        [0, 0.36, 0, 5], [0, -0.36, 0, 6], // top/bottom
      ];
      faces.forEach(([x, y, z, count]) => {
        const positions: Array<[number, number]> = [];
        if (count === 1) positions.push([0, 0]);
        else if (count === 2) positions.push([-0.15, -0.15], [0.15, 0.15]);
        else if (count === 3) positions.push([-0.18, -0.18], [0, 0], [0.18, 0.18]);
        else if (count === 4) positions.push([-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]);
        else if (count === 5) positions.push([-0.18, -0.18], [0.18, -0.18], [0, 0], [-0.18, 0.18], [0.18, 0.18]);
        else positions.push([-0.15, -0.15], [0.15, -0.15], [-0.15, 0], [0.15, 0], [-0.15, 0.15], [0.15, 0.15]);

        positions.forEach(([px, py]) => {
          const pip = new THREE.Mesh(pipGeo, pipMat);
          if (Math.abs(z) > 0.3) pip.position.set(px, py, z > 0 ? 0.36 : -0.36);
          else if (Math.abs(x) > 0.3) { pip.position.set(x > 0 ? 0.36 : -0.36, py, px); }
          else { pip.position.set(px, y > 0 ? 0.36 : -0.36, py); }
          die.add(pip);
        });
      });
      return die;
    }

    // Multiple dice rolling continuously
    interface RollingDie { group: THREE.Group; vel: THREE.Vector3; angVel: THREE.Vector3; }
    const dice: RollingDie[] = [];

    const spawnDie = () => {
      const group = makeDie();
      group.position.set((Math.random() - 0.5) * 6, 2 + Math.random() * 2, (Math.random() - 0.5) * 4);
      scene.add(group);
      dice.push({
        group,
        vel: new THREE.Vector3((Math.random() - 0.5) * 4, -1, (Math.random() - 0.5) * 3),
        angVel: new THREE.Vector3(
          (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8
        ),
      });
    };

    // Start with 3 dice
    for (let i = 0; i < 3; i++) spawnDie();

    let raf = 0;
    const clock = new THREE.Clock();
    let spawnTimer = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      spawnTimer += dt;
      if (spawnTimer > 4 && dice.length < 5) {
        spawnDie();
        spawnTimer = 0;
      }

      for (let i = dice.length - 1; i >= 0; i--) {
        const d = dice[i];
        // Gravity
        d.vel.y -= 9.8 * dt;
        d.group.position.addScaledVector(d.vel, dt);
        d.group.rotation.x += d.angVel.x * dt;
        d.group.rotation.y += d.angVel.y * dt;
        d.group.rotation.z += d.angVel.z * dt;

        // Bounce on table
        if (d.group.position.y < -0.8) {
          d.group.position.y = -0.8;
          d.vel.y = Math.abs(d.vel.y) * 0.5;
          d.vel.x *= 0.8;
          d.vel.z *= 0.8;
          d.angVel.multiplyScalar(0.7);
          // Settle — slow to stop then respawn
          if (d.vel.length() < 0.5 && d.angVel.length() < 1) {
            scene.remove(d.group);
            dice.splice(i, 1);
            setTimeout(spawnDie, 1000 + Math.random() * 2000);
          }
        }
        // Keep on table
        if (Math.abs(d.group.position.x) > 5.5) d.vel.x *= -0.8;
        if (Math.abs(d.group.position.z) > 5.5) d.vel.z *= -0.8;
      }

      // Neon lights pulse
      const t = clock.elapsedTime;
      neon.intensity = 18 + Math.sin(t * 2) * 5;
      pink.intensity = 13 + Math.cos(t * 1.7) * 4;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width, height, borderRadius: 16, overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, rgba(0,240,255,0.06), transparent 70%)',
      }}
    />
  );
}
