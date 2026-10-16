import * as THREE from 'three';

export interface CharacterModelConfig {
  id: string;
  name: string;
  faceImg: string;
  skinTone: number;
  shirtColor: number;
  pantsColor: number;
  build: 'athletic' | 'muscular' | 'curvy' | 'slim';
  height: number; // scale factor
}

interface BuiltCharacter {
  config: CharacterModelConfig;
  group: THREE.Group;
  head: THREE.Group;
  jaw: THREE.Mesh | null;
  leftShoulder: THREE.Group;
  rightShoulder: THREE.Group;
  leftElbow: THREE.Group;
  rightElbow: THREE.Group;
  leftHip: THREE.Group;
  rightHip: THREE.Group;
  leftKnee: THREE.Group;
  rightKnee: THREE.Group;
  torso: THREE.Mesh;
  talkPhase: number;
  walkPhase: number;
  isTalking: boolean;
  isWalking: boolean;
}

/**
 * CharacterModelBuilder — builds detailed, realistic 3D human models in code.
 * Articulated joints: shoulders, elbows, hips, knees, jaw.
 * They walk, gesture, and talk with moving mouths.
 */
export class CharacterModelBuilder {
  private loader = new THREE.TextureLoader();
  private characters: Map<string, BuiltCharacter> = new Map();

  build(config: CharacterModelConfig): THREE.Group {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: config.skinTone, roughness: 0.55 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: config.shirtColor, roughness: 0.75 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor, roughness: 0.8 });

    // Build proportions based on body type
    const buildScale = {
      athletic: { shoulderW: 0.52, hipW: 0.4, armR: 0.11, legR: 0.15, chestR: 0.42 },
      muscular: { shoulderW: 0.62, hipW: 0.42, armR: 0.15, legR: 0.17, chestR: 0.5 },
      curvy: { shoulderW: 0.46, hipW: 0.52, armR: 0.1, legR: 0.16, chestR: 0.44 },
      slim: { shoulderW: 0.44, hipW: 0.36, armR: 0.09, legR: 0.13, chestR: 0.36 },
    }[config.build];

    const h = config.height;

    // === LEGS (with hip and knee joints) ===
    const buildLeg = (side: number) => {
      const hip = new THREE.Group();
      hip.position.set(side * buildScale.hipW * 0.55, 1.05 * h, 0);

      // Thigh — tapered
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(buildScale.legR, buildScale.legR * 0.8, 0.5 * h, 12),
        pantsMat
      );
      thigh.position.y = -0.25 * h;
      thigh.castShadow = true;
      hip.add(thigh);

      const knee = new THREE.Group();
      knee.position.y = -0.5 * h;
      // Calf — tapered
      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(buildScale.legR * 0.75, buildScale.legR * 0.55, 0.45 * h, 12),
        config.build === 'curvy' ? skinMat : pantsMat // diva shows legs
      );
      calf.position.y = -0.225 * h;
      calf.castShadow = true;
      knee.add(calf);

      // Shoe — detailed
      const shoeGroup = new THREE.Group();
      shoeGroup.position.y = -0.48 * h;
      const shoeBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.12, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.35 })
      );
      shoeBase.castShadow = true;
      shoeGroup.add(shoeBase);
      const shoeToe = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.35 })
      );
      shoeToe.scale.set(1, 0.5, 1.2);
      shoeToe.position.set(0, -0.02, 0.16);
      shoeGroup.add(shoeToe);
      knee.add(shoeGroup);

      hip.add(knee);
      group.add(hip);
      return { hip, knee };
    };

    const leftLeg = buildLeg(-1);
    const rightLeg = buildLeg(1);

    // === TORSO (detailed, with chest and waist) ===
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.05 * h;

    // Chest
    const chest = new THREE.Mesh(
      new THREE.SphereGeometry(buildScale.chestR, 20, 16),
      shirtMat
    );
    chest.scale.set(1, 1.25, 0.72);
    chest.position.y = 0.42 * h;
    chest.castShadow = true;
    torsoGroup.add(chest);

    // Waist — tapered
    const waist = new THREE.Mesh(
      new THREE.CylinderGeometry(buildScale.chestR * 0.82, buildScale.hipW * 0.9, 0.35 * h, 16),
      shirtMat
    );
    waist.position.y = 0.05 * h;
    waist.castShadow = true;
    torsoGroup.add(waist);

    // Belt
    const belt = new THREE.Mesh(
      new THREE.TorusGeometry(buildScale.hipW * 0.85, 0.035, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.5 })
    );
    belt.rotation.x = Math.PI / 2;
    belt.position.y = -0.1 * h;
    torsoGroup.add(belt);
    // Belt buckle — gold
    const buckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.1, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.25 })
    );
    buckle.position.set(0, -0.1 * h, buildScale.hipW * 0.85);
    torsoGroup.add(buckle);

    group.add(torsoGroup);

    // === ARMS (shoulder + elbow joints) ===
    const buildArm = (side: number) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * buildScale.shoulderW, 1.85 * h, 0);

      // Shoulder cap — rounded
      const shoulderCap = new THREE.Mesh(
        new THREE.SphereGeometry(buildScale.armR * 1.3, 12, 12),
        shirtMat
      );
      shoulderCap.castShadow = true;
      shoulder.add(shoulderCap);

      // Upper arm — tapered
      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(buildScale.armR, buildScale.armR * 0.85, 0.38 * h, 12),
        shirtMat
      );
      upperArm.position.y = -0.19 * h;
      upperArm.castShadow = true;
      shoulder.add(upperArm);

      const elbow = new THREE.Group();
      elbow.position.y = -0.38 * h;

      // Forearm — tapered, skin
      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(buildScale.armR * 0.8, buildScale.armR * 0.65, 0.36 * h, 12),
        skinMat
      );
      forearm.position.y = -0.18 * h;
      forearm.castShadow = true;
      elbow.add(forearm);

      // Hand — detailed with fingers hint
      const handGroup = new THREE.Group();
      handGroup.position.y = -0.38 * h;
      const palm = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.16, 0.06),
        skinMat
      );
      palm.castShadow = true;
      handGroup.add(palm);
      // Fingers
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.015, 0.09, 6),
          skinMat
        );
        finger.position.set(-0.033 + f * 0.022, -0.12, 0);
        handGroup.add(finger);
      }
      // Thumb
      const thumb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.016, 0.07, 6),
        skinMat
      );
      thumb.position.set(side * 0.07, -0.04, 0.02);
      thumb.rotation.z = side * 0.6;
      handGroup.add(thumb);
      elbow.add(handGroup);

      shoulder.add(elbow);
      group.add(shoulder);
      return { shoulder, elbow };
    };

    const leftArm = buildArm(-1);
    const rightArm = buildArm(1);

    // === HEAD (detailed with face, jaw, teeth) ===
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.35 * h;

    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.22 * h, 12),
      skinMat
    );
    neck.position.y = -0.28;
    neck.castShadow = true;
    headGroup.add(neck);

    // Skull base
    const skull = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      skinMat
    );
    skull.scale.set(0.88, 1.05, 0.92);
    skull.castShadow = true;
    headGroup.add(skull);

    // Face — textured front
    this.loader.load(config.faceImg, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.Mesh(
        new THREE.SphereGeometry(0.285, 24, 24, -Math.PI / 3, Math.PI * 2 / 3, Math.PI / 4, Math.PI / 2.2),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
      );
      face.scale.set(0.88, 1.05, 0.92);
      face.position.z = 0.015;
      headGroup.add(face);
    });

    // Jaw — movable for talking
    const jaw = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      skinMat
    );
    jaw.scale.set(0.75, 0.55, 0.8);
    jaw.position.set(0, -0.2, 0.06);
    jaw.castShadow = true;
    headGroup.add(jaw);

    // Teeth — upper (white, visible)
    const upperTeeth = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.05, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    upperTeeth.position.set(0, -0.1, 0.22);
    headGroup.add(upperTeeth);

    // Teeth — lower (on jaw, moves with jaw)
    const lowerTeeth = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.04, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.15 })
    );
    lowerTeeth.position.set(0, 0.06, 0.1);
    jaw.add(lowerTeeth);

    // Ears
    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 10, 10),
        skinMat
      );
      ear.scale.set(0.5, 1, 0.7);
      ear.position.set(side * 0.25, 0, 0);
      headGroup.add(ear);
    });

    group.add(headGroup);

    // === GOLD CHAIN ===
    const chainGroup = new THREE.Group();
    const chain = new THREE.Mesh(
      new THREE.TorusGeometry(0.19, 0.028, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 })
    );
    chain.position.y = 2.02 * h;
    chain.rotation.x = Math.PI / 2 - 0.15;
    chain.castShadow = true;
    chainGroup.add(chain);
    // Medallion
    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.025, 24),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 })
    );
    medallion.position.set(0, 1.86 * h, 0.24);
    medallion.rotation.x = Math.PI / 2 - 0.25;
    chainGroup.add(medallion);
    group.add(chainGroup);

    group.position.y = 0;

    const built: BuiltCharacter = {
      config, group, head: headGroup, jaw,
      leftShoulder: leftArm.shoulder, rightShoulder: rightArm.shoulder,
      leftElbow: leftArm.elbow, rightElbow: rightArm.elbow,
      leftHip: leftLeg.hip, rightHip: rightLeg.hip,
      leftKnee: leftLeg.knee, rightKnee: rightLeg.knee,
      torso: chest, talkPhase: 0, walkPhase: 0,
      isTalking: false, isWalking: false,
    };
    this.characters.set(config.id, built);
    return group;
  }

  setTalking(id: string, talking: boolean) {
    const char = this.characters.get(id);
    if (char) char.isTalking = talking;
  }

  setWalking(id: string, walking: boolean) {
    const char = this.characters.get(id);
    if (char) char.isWalking = walking;
  }

  gesture(id: string, type: 'wave' | 'point' | 'shrug' | 'celebrate') {
    const char = this.characters.get(id);
    if (!char) return;
    const t = Date.now() / 1000;
    // Store gesture with expiry
    (char as any).gesture = { type, start: t };
  }

  update(deltaTime: number) {
    const t = Date.now() / 1000;
    for (const [, char] of this.characters) {
      // Breathing
      const breath = Math.sin(t * 1.4 + char.talkPhase);
      char.torso.scale.y = 1.25 + breath * 0.02;

      // Talking — jaw opens/closes, teeth visible
      if (char.isTalking) {
        const mouthOpen = Math.abs(Math.sin(t * 7 + char.talkPhase));
        if (char.jaw) {
          char.jaw.position.y = -0.2 - mouthOpen * 0.1;
          char.jaw.rotation.x = mouthOpen * 0.5;
        }
        char.head.rotation.x = Math.sin(t * 7) * 0.04;
        // Hand gestures while talking
        char.rightShoulder.rotation.x = -0.5 + Math.sin(t * 5) * 0.25;
        char.rightElbow.rotation.x = -0.3 + Math.cos(t * 5) * 0.2;
      } else if (char.jaw) {
        char.jaw.position.y += (-0.2 - char.jaw.position.y) * 0.3;
        char.jaw.rotation.x *= 0.9;
      }

      // Walking — legs and arms swing
      if (char.isWalking) {
        char.walkPhase += deltaTime * 8;
        const swing = Math.sin(char.walkPhase);
        char.leftHip.rotation.x = swing * 0.5;
        char.rightHip.rotation.x = -swing * 0.5;
        char.leftKnee.rotation.x = Math.max(0, -swing) * 0.8;
        char.rightKnee.rotation.x = Math.max(0, swing) * 0.8;
        char.leftShoulder.rotation.x = -swing * 0.4;
        char.rightShoulder.rotation.x = swing * 0.4;
        char.group.position.y = Math.abs(Math.cos(char.walkPhase)) * 0.05;
      } else {
        // Relax to idle
        char.leftHip.rotation.x *= 0.9;
        char.rightHip.rotation.x *= 0.9;
        char.leftKnee.rotation.x *= 0.9;
        char.rightKnee.rotation.x *= 0.9;
        if (!char.isTalking) {
          char.leftShoulder.rotation.x = Math.sin(t * 1.2) * 0.06;
          char.rightShoulder.rotation.x = Math.cos(t * 1.2) * 0.06;
        }
        char.leftShoulder.rotation.z = 0.1;
        char.rightShoulder.rotation.z = -0.1;
      }

      // Gestures
      const gesture = (char as any).gesture;
      if (gesture && t - gesture.start < 2) {
        const gt = (t - gesture.start) / 2; // 0-1
        if (gesture.type === 'wave') {
          char.rightShoulder.rotation.z = -2.2;
          char.rightShoulder.rotation.x = Math.sin(t * 10) * 0.3;
          char.rightElbow.rotation.z = Math.sin(t * 10) * 0.4;
        } else if (gesture.type === 'celebrate') {
          const jump = Math.abs(Math.sin(t * 6)) * 0.3;
          char.group.position.y = jump;
          char.leftShoulder.rotation.z = 2.5;
          char.rightShoulder.rotation.z = -2.5;
        } else if (gesture.type === 'point') {
          char.rightShoulder.rotation.x = -1.4;
          char.rightElbow.rotation.x = -0.1;
        } else if (gesture.type === 'shrug') {
          char.leftShoulder.rotation.z = 0.6 + Math.sin(gt * Math.PI) * 0.3;
          char.rightShoulder.rotation.z = -0.6 - Math.sin(gt * Math.PI) * 0.3;
        }
      } else if (gesture) {
        (char as any).gesture = null;
      }
    }
  }

  get(id: string): BuiltCharacter | undefined {
    return this.characters.get(id);
  }
}
