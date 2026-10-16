import * as THREE from 'three';

export type CharacterState = 'idle' | 'talking' | 'celebrating' | 'thinking' | 'leaving' | 'joining' | 'shocked' | 'hyped' | 'smoking' | 'drinking' | 'bluffing' | 'staredown' | 'swag-walk' | 'ability';

export interface CharacterAbility {
  name: string;
  description: string;
  icon: string;
}

export interface TableCharacter {
  id: string;
  name: string;
  img: string;
  state: CharacterState;
  seatIndex: number;
  personality?: 'hype' | 'chill' | 'trash-talker' | 'diva' | 'boss';
  abilities?: CharacterAbility[];
  swagLevel?: number; // 1-10
}

interface EngineCharacter {
  data: TableCharacter;
  group: THREE.Group;
  mesh: THREE.Mesh;
  label: THREE.Mesh;
  bubble: THREE.Mesh | null;
  baseY: number;
  phase: number;
  angle: number;
  targetAngle: number;
  mouthOpen: number;
}

/**
 * TableEngine — the engine that powers the dice table.
 * Manages realistic characters with:
 * - Talking (mouth moves, teeth visible via scale pulse)
 * - Idle (breathing, swaying)
 * - Celebrating (jumping, arms up effect)
 * - Moving around the table (smooth seat transitions)
 * - Speech bubbles for chat
 */
export class TableEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private characters: Map<string, EngineCharacter> = new Map();
  private tableGroup: THREE.Group;
  private diceGroup: THREE.Group;
  private clock: THREE.Clock;
  private raf = 0;
  private onCharacterClick?: (id: string) => void;
  private loader = new THREE.TextureLoader();
  private width: number;
  private height: number;

  constructor(mount: HTMLElement, width: number, height: number) {
    this.width = width;
    this.height = height;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 10, 25);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 3.5, 8);
    this.camera.lookAt(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    mount.appendChild(this.renderer.domElement);

    // Casino lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const spot = new THREE.SpotLight(0xffe9c4, 100, 25, Math.PI / 5, 0.4);
    spot.position.set(0, 9, 3);
    spot.castShadow = true;
    this.scene.add(spot);
    const gold = new THREE.PointLight(0xc9a227, 40, 15);
    gold.position.set(0, 1.5, 0);
    this.scene.add(gold);

    // Table
    this.tableGroup = new THREE.Group();
    const felt = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 0.3, 40),
      new THREE.MeshStandardMaterial({ color: 0x0f5c2a, roughness: 0.95 })
    );
    felt.position.y = 0.85;
    felt.receiveShadow = true;
    this.tableGroup.add(felt);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.15, 14, 60),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.95, roughness: 0.25 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.0;
    this.tableGroup.add(rim);
    this.scene.add(this.tableGroup);

    // Dice
    this.diceGroup = new THREE.Group();
    this.scene.add(this.diceGroup);

    this.clock = new THREE.Clock();
    this.animate();

    // Click handling
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    this.renderer.domElement.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, this.camera);
      for (const [, char] of this.characters) {
        const hits = ray.intersectObject(char.mesh);
        if (hits.length > 0) {
          this.onCharacterClick?.(char.data.id);
          this.setState(char.data.id, 'talking');
          setTimeout(() => this.setState(char.data.id, 'idle'), 2500);
          break;
        }
      }
    });
  }

  onClick(fn: (id: string) => void) {
    this.onCharacterClick = fn;
  }

  addCharacter(data: TableCharacter) {
    if (this.characters.has(data.id)) return;

    this.loader.load(data.img, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const aspect = tex.image.width / tex.image.height;
      const h = 2.8;
      const w = h * aspect;

      const group = new THREE.Group();
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6, alphaTest: 0.05 })
      );
      mesh.castShadow = true;
      group.add(mesh);

      // Name label
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.beginPath(); ctx.roundRect(0, 0, 256, 64, 16); ctx.fill();
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.name, 128, 42);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 0.32),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
      );
      label.position.y = h / 2 + 0.3;
      group.add(label);

      const angle = this.seatAngle(data.seatIndex);
      const radius = 4.5;
      group.position.set(Math.cos(angle) * radius, 1.9, Math.sin(angle) * radius);
      group.lookAt(0, 1.9, 0);

      this.scene.add(group);
      this.characters.set(data.id, {
        data, group, mesh, label, bubble: null,
        baseY: 1.9, phase: Math.random() * Math.PI * 2,
        angle, targetAngle: angle, mouthOpen: 0,
      });
    });
  }

  removeCharacter(id: string) {
    const char = this.characters.get(id);
    if (char) {
      this.scene.remove(char.group);
      this.characters.delete(id);
    }
  }

  setState(id: string, state: CharacterState) {
    const char = this.characters.get(id);
    if (char) {
      char.data.state = state;
      if (state === 'talking') this.showBubble(char, '💬');
      if (state === 'celebrating') this.showBubble(char, '🎉');
    }
  }

  say(id: string, text: string) {
    const char = this.characters.get(id);
    if (!char) return;
    this.setState(id, 'talking');
    this.showBubble(char, text);
    setTimeout(() => {
      if (char.data.state === 'talking') this.setState(id, 'idle');
    }, 3000);
  }

  moveToSeat(id: string, seatIndex: number) {
    const char = this.characters.get(id);
    if (char) {
      char.data.seatIndex = seatIndex;
      char.targetAngle = this.seatAngle(seatIndex);
    }
  }

  rollDice(): number[] {
    // Clear old dice
    while (this.diceGroup.children.length > 0) {
      this.diceGroup.remove(this.diceGroup.children[0]);
    }
    const results: number[] = [];
    [-0.35, 0.35].forEach((x, i) => {
      const value = 1 + Math.floor(Math.random() * 6);
      results.push(value);
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
      );
      die.position.set(x, 1.5, (Math.random() - 0.5) * 0.5);
      die.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      die.castShadow = true;
      // Animate roll
      const startY = 3;
      die.position.y = startY;
      const rollAnim = () => {
        die.position.y -= 0.15;
        die.rotation.x += 0.3;
        die.rotation.y += 0.25;
        if (die.position.y > 1.2) requestAnimationFrame(rollAnim);
        else die.position.y = 1.2;
      };
      setTimeout(() => rollAnim(), i * 200);
      this.diceGroup.add(die);
    });
    return results;
  }

  // Story mode — live entertainment sequences
  playStory(scene: 'intro' | 'betting' | 'rolling' | 'win' | 'lose', winnerId?: string) {
    const chars = Array.from(this.characters.values());

    if (scene === 'intro') {
      // Everyone hypes up
      chars.forEach((char, i) => {
        setTimeout(() => {
          this.setState(char.data.id, 'hyped');
          const intros: Record<string, string[]> = {
            'hype': ["LET'S GOOO! 🔥", "We 'bout to eat! 💰"],
            'chill': ["Easy money 😎", "Let's see... 🎲"],
            'trash-talker': ["Y'all ain't ready 😤", "Watch and learn 👑"],
            'diva': ["The queen is here ✨", "Try to keep up 💅"],
            'boss': ["Big bets only 💎", "This is my table 🏛️"],
          };
          const lines = intros[char.data.personality || 'chill'];
          this.say(char.data.id, lines[Math.floor(Math.random() * lines.length)]);
          setTimeout(() => this.setState(char.data.id, 'idle'), 3000);
        }, i * 800);
      });
    } else if (scene === 'betting') {
      chars.forEach((char) => {
        this.setState(char.data.id, 'thinking');
        setTimeout(() => this.setState(char.data.id, 'idle'), 2500);
      });
    } else if (scene === 'rolling') {
      // Everyone watches — shocked anticipation
      chars.forEach((char) => this.setState(char.data.id, 'shocked'));
      this.rollDice();
    } else if (scene === 'win' && winnerId) {
      const winner = this.characters.get(winnerId);
      if (winner) {
        this.setState(winnerId, 'celebrating');
        const winLines: Record<string, string[]> = {
          'hype': ["THAT'S WHAT I'M TALKING ABOUT! 🏆", "TOO EASY! 💰"],
          'chill': ["Told y'all 😌", "Light work 💸"],
          'trash-talker': ["Y'all saw that? 😤", "King shit 👑"],
          'diva': ["Obviously ✨", "Queen takes all 💅"],
          'boss': ["That's business 💎", "The house always wins 🏛️"],
        };
        const lines = winLines[winner.data.personality || 'chill'];
        this.say(winnerId, lines[Math.floor(Math.random() * lines.length)]);
      }
      // Losers react
      chars.forEach((char) => {
        if (char.data.id !== winnerId) {
          this.setState(char.data.id, 'shocked');
          setTimeout(() => this.setState(char.data.id, 'idle'), 3000);
        }
      });
      setTimeout(() => {
        if (winner) this.setState(winnerId, 'idle');
      }, 5000);
    } else if (scene === 'lose') {
      chars.forEach((char) => {
        this.setState(char.data.id, 'shocked');
        setTimeout(() => this.setState(char.data.id, 'idle'), 2000);
      });
    }
  }

  private smokeParticles: THREE.Points[] = [];
  private drinkProps: THREE.Group[] = [];

  // Add club props to the table — bottles, glasses
  private addClubProps() {
    // Champagne bottles on the table
    const bottlePositions = [
      { x: -1.5, z: 0.8 }, { x: 1.5, z: -0.8 }, { x: 0, z: 1.5 },
    ];
    bottlePositions.forEach((pos) => {
      const bottleGroup = new THREE.Group();
      // Bottle body
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.7, 12),
        new THREE.MeshStandardMaterial({ color: 0x0a3a0a, roughness: 0.2, metalness: 0.3 })
      );
      bottle.position.y = 0.35;
      bottle.castShadow = true;
      bottleGroup.add(bottle);
      // Bottle neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 0.3, 10),
        new THREE.MeshStandardMaterial({ color: 0x0a3a0a, roughness: 0.2 })
      );
      neck.position.y = 0.8;
      bottleGroup.add(neck);
      // Gold foil top
      const foil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10),
        new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.3 })
      );
      foil.position.y = 0.95;
      bottleGroup.add(foil);
      bottleGroup.position.set(pos.x, 1.0, pos.z);
      this.scene.add(bottleGroup);
      this.drinkProps.push(bottleGroup);
    });

    // Cocktail glasses
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const glassGroup = new THREE.Group();
      // Glass bowl
      const bowl = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.15, 12, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0xffffff, transparent: true, opacity: 0.3,
          roughness: 0.1, side: THREE.DoubleSide,
        })
      );
      bowl.position.y = 0.25;
      glassGroup.add(bowl);
      // Drink liquid
      const liquid = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.08, 12),
        new THREE.MeshStandardMaterial({ color: 0xff6b35, transparent: true, opacity: 0.8 })
      );
      liquid.position.y = 0.24;
      glassGroup.add(liquid);
      // Stem
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
      );
      stem.position.y = 0.1;
      glassGroup.add(stem);
      glassGroup.position.set(Math.cos(angle) * 2.2, 1.0, Math.sin(angle) * 2.2);
      this.scene.add(glassGroup);
      this.drinkProps.push(glassGroup);
    }
  }

  // Smoke particle effect for a character
  private addSmoke(char: EngineCharacter) {
    const count = 30;
    const pos = new Float32Array(count * 3);
    const basePos = char.group.position.clone();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = basePos.x + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = basePos.y + 0.5 + Math.random() * 1.5;
      pos[i * 3 + 2] = basePos.z + (Math.random() - 0.5) * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xcccccc, size: 0.25, transparent: true, opacity: 0.4,
      depthWrite: false,
    });
    const smoke = new THREE.Points(geo, mat);
    this.scene.add(smoke);
    this.smokeParticles.push(smoke);
    // Store reference on character for animation
    (char as any).smoke = smoke;
  }

  // Story chapters — the story never dies, new chapters unlock with levels
  private currentChapter = 1;
  private chapterTitles: Record<number, string> = {
    1: "Welcome to the Table",
    5: "High Rollers",
    10: "The Big Game",
    15: "Kings of the Felt",
    20: "Legend Status",
    25: "The Final Table",
    30: "Immortal",
  };

  setChapter(level: number) {
    // Find the highest chapter unlocked by this level
    let chapter = 1;
    for (const [lvl, _] of Object.entries(this.chapterTitles)) {
      if (level >= parseInt(lvl)) chapter = parseInt(lvl);
    }
    if (chapter !== this.currentChapter) {
      this.currentChapter = chapter;
      this.playChapterIntro(chapter);
    }
  }

  private playChapterIntro(chapter: number) {
    const title = this.chapterTitles[chapter] || `Chapter ${chapter}`;
    const chars = Array.from(this.characters.values());

    // Chapter announcement — everyone reacts
    chars.forEach((char, i) => {
      setTimeout(() => {
        this.setState(char.data.id, 'hyped');
        const chapterLines: Record<number, string[]> = {
          1: ["Welcome to Big Face! 🎲", "New blood at the table! 🔥"],
          5: ["High roller in the house! 💰", "The stakes just went up! 📈"],
          10: ["This is the big game now! 🏆", "Only real ones make it here! 👑"],
          15: ["Kings of the felt! ♠️", "Respect the grind! 💎"],
          20: ["Legend status achieved! ⭐", "Your name rings bells! 🔔"],
          25: ["The final table! 🎯", "Everything on the line! 💸"],
          30: ["IMMORTAL! 🌟", "A living legend! 🦁"],
        };
        const lines = chapterLines[chapter] || ["New chapter! 📖", "The story continues! 📚"];
        this.say(char.data.id, `📖 ${title}: ${lines[Math.floor(Math.random() * lines.length)]}`);
        setTimeout(() => this.setState(char.data.id, 'idle'), 4000);
      }, i * 1000);
    });
  }

  getCurrentChapter(): { level: number; title: string } {
    return { level: this.currentChapter, title: this.chapterTitles[this.currentChapter] || `Chapter ${this.currentChapter}` };
  }

  // Character abilities — real powers with visual effects
  useAbility(characterId: string, abilityIndex: number = 0) {
    const char = this.characters.get(characterId);
    if (!char || !char.data.abilities?.[abilityIndex]) return;
    const ability = char.data.abilities[abilityIndex];

    this.setState(characterId, 'ability');
    this.say(characterId, `${ability.icon} ${ability.name}!`);

    // Visual effect — golden shockwave
    const shockwave = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 2.5, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffd700, transparent: true, opacity: 0.8,
        side: THREE.DoubleSide,
      })
    );
    shockwave.position.copy(char.group.position);
    shockwave.position.y = 0.5;
    shockwave.rotation.x = -Math.PI / 2;
    this.scene.add(shockwave);

    let scale = 1;
    const expand = () => {
      scale += 0.3;
      shockwave.scale.set(scale, scale, 1);
      (shockwave.material as THREE.MeshBasicMaterial).opacity -= 0.05;
      if (scale < 4) requestAnimationFrame(expand);
      else this.scene.remove(shockwave);
    };
    expand();

    setTimeout(() => this.setState(characterId, 'idle'), 3000);
  }

  // Mind games — psychological warfare
  playMindGame(attackerId: string, targetId: string, type: 'bluff' | 'staredown' | 'trash-talk') {
    const attacker = this.characters.get(attackerId);
    const target = this.characters.get(targetId);
    if (!attacker || !target) return;

    if (type === 'bluff') {
      this.setState(attackerId, 'bluffing');
      const bluffs = [
        "I know something you don't 😏",
        "You sure about that bet? 🤔",
        "I've seen that look before... 🃏",
      ];
      this.say(attackerId, bluffs[Math.floor(Math.random() * bluffs.length)]);
      // Target gets nervous
      setTimeout(() => this.setState(targetId, 'thinking'), 1000);
    } else if (type === 'staredown') {
      this.setState(attackerId, 'staredown');
      this.setState(targetId, 'staredown');
      this.say(attackerId, "👁️ I see you...");
      setTimeout(() => {
        // Loser backs down
        const loser = Math.random() > 0.5 ? attackerId : targetId;
        this.setState(loser, 'shocked');
        this.say(loser, "Okay okay! 😅");
      }, 3000);
    } else if (type === 'trash-talk') {
      this.setState(attackerId, 'talking');
      const trash: Record<string, string[]> = {
        'trash-talker': ["Your money's already mine 😤", "You play like my grandma 👵"],
        'diva': ["Bless your heart 💅", "Cute bet, sweetie ✨"],
        'boss': ["This is a business decision 💼", "You can't afford this table 💎"],
        'hype': ["LET'S GOOO! You scared? 🔥", "I EAT pressure for breakfast! 💪"],
        'chill': ["Interesting choice... 😌", "We'll see about that 🤷"],
      };
      const lines = trash[attacker.data.personality || 'chill'];
      this.say(attackerId, lines[Math.floor(Math.random() * lines.length)]);
    }

    setTimeout(() => {
      if (attacker.data.state !== 'celebrating') this.setState(attackerId, 'idle');
      if (target.data.state !== 'celebrating') this.setState(targetId, 'idle');
    }, 5000);
  }

  // Swag walk — character struts around the table
  swagWalk(characterId: string) {
    const char = this.characters.get(characterId);
    if (!char) return;
    this.setState(characterId, 'swag-walk');
    const swag = char.data.swagLevel || 5;
    this.say(characterId, `😎 Swag level ${swag}/10`);
    // Walk to next seat and back
    const originalSeat = char.data.seatIndex;
    const nextSeat = (originalSeat + 1) % Math.max(this.characters.size, 4);
    this.moveToSeat(characterId, nextSeat);
    setTimeout(() => {
      this.moveToSeat(characterId, originalSeat);
      setTimeout(() => this.setState(characterId, 'idle'), 2000);
    }, 3000);
  }

  private seatAngle(index: number): number {
    const total = Math.max(this.characters.size, 4);
    return (index / total) * Math.PI * 2 - Math.PI / 2;
  }

  private removeSmoke(char: EngineCharacter) {
    const smoke = (char as any).smoke;
    if (smoke) {
      this.scene.remove(smoke);
      this.smokeParticles = this.smokeParticles.filter((s) => s !== smoke);
      (char as any).smoke = null;
    }
  }

  // Start the club vibe — some characters smoke, some drink
  startClubVibe() {
    this.addClubProps();
    const chars = Array.from(this.characters.values());
    chars.forEach((char, i) => {
      if (i % 2 === 0) {
        setTimeout(() => {
          this.setState(char.data.id, 'smoking');
          this.addSmoke(char);
        }, i * 1000);
      } else {
        setTimeout(() => this.setState(char.data.id, 'drinking'), i * 1000);
      }
    });
    // Rotate vibes
    setInterval(() => {
      const random = chars[Math.floor(Math.random() * chars.length)];
      if (random.data.state === 'idle') {
        const vibe = Math.random() > 0.5 ? 'smoking' : 'drinking';
        this.setState(random.data.id, vibe);
        if (vibe === 'smoking') this.addSmoke(random);
        setTimeout(() => {
          this.setState(random.data.id, 'idle');
          this.removeSmoke(random);
        }, 8000);
      }
    }, 12000);
  }

  private showBubble(char: EngineCharacter, text: string) {
    if (char.bubble) {
      this.scene.remove(char.bubble);
      char.bubble = null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    // Bubble
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(8, 8, 240, 80, 20); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(110, 88); ctx.lineTo(100, 115); ctx.lineTo(130, 88);
    ctx.fill();
    // Text
    ctx.fillStyle = '#111';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    const display = text.length > 18 ? text.slice(0, 18) + '…' : text;
    ctx.fillText(display, 128, 58);
    const bubble = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.8),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    );
    bubble.position.copy(char.group.position);
    bubble.position.y += 2.2;
    this.scene.add(bubble);
    char.bubble = bubble;
    setTimeout(() => {
      if (char.bubble === bubble) {
        this.scene.remove(bubble);
        char.bubble = null;
      }
    }, 3000);
  }

  private animate = () => {
    this.raf = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();

    for (const [, char] of this.characters) {
      const state = char.data.state;

      // Smooth seat movement
      char.angle += (char.targetAngle - char.angle) * 0.05;
      const radius = 4.5;
      char.group.position.x = Math.cos(char.angle) * radius;
      char.group.position.z = Math.sin(char.angle) * radius;

      // Breathing (always)
      const breath = Math.sin(t * 1.6 + char.phase);

      // State-specific animation
      let yOffset = breath * 0.04;
      let scalePulse = 1;

      if (state === 'talking') {
        // Mouth moving — rapid vertical bob + scale pulse (teeth visible effect)
        char.mouthOpen = Math.abs(Math.sin(t * 9));
        yOffset += char.mouthOpen * 0.12;
        scalePulse = 1 + Math.sin(t * 9) * 0.025;
        // Slight lean forward when talking
        char.group.rotation.x = -0.05;
      } else if (state === 'celebrating') {
        // Jumping with joy
        yOffset += Math.abs(Math.sin(t * 7)) * 0.45;
        scalePulse = 1 + Math.abs(Math.sin(t * 7)) * 0.05;
        char.group.rotation.z = Math.sin(t * 7) * 0.08;
      } else if (state === 'thinking') {
        // Slow head tilt
        char.group.rotation.z = Math.sin(t * 1.2) * 0.1;
      } else if (state === 'hyped') {
        // Bouncing with excitement
        yOffset += Math.abs(Math.sin(t * 10)) * 0.25;
        scalePulse = 1 + Math.sin(t * 10) * 0.03;
        char.group.rotation.z = Math.sin(t * 10) * 0.05;
      } else if (state === 'shocked') {
        // Frozen, leaning in — tension
        scalePulse = 1.05;
        char.group.rotation.x = -0.1;
        yOffset += Math.sin(t * 20) * 0.01; // micro tremble
      } else if (state === 'smoking') {
        // Relaxed lean, occasional puff
        char.group.rotation.z = 0.08;
        char.group.rotation.x = 0.05;
        yOffset += Math.sin(t * 1) * 0.03;
        // Exhale puff every few seconds
        if (Math.sin(t * 0.8 + char.phase) > 0.95) {
          scalePulse = 1.02;
        }
      } else if (state === 'drinking') {
        // Tilt back like taking a sip
        const sipCycle = (t * 0.5 + char.phase) % (Math.PI * 2);
        if (sipCycle < 1.5) {
          char.group.rotation.x = -0.25 * Math.sin(sipCycle / 1.5 * Math.PI);
          yOffset += 0.1 * Math.sin(sipCycle / 1.5 * Math.PI);
        }
      } else if (state === 'bluffing') {
        // Shifty — looking around, trying to sell it
        char.group.rotation.y = Math.sin(t * 3) * 0.2;
        yOffset += Math.abs(Math.sin(t * 4)) * 0.05;
        scalePulse = 1 + Math.sin(t * 4) * 0.015;
      } else if (state === 'staredown') {
        // Intense — locked in, no movement
        scalePulse = 1.08;
        char.group.rotation.x = -0.15;
        // Slight forward lean
        yOffset -= 0.05;
      } else if (state === 'swag-walk') {
        // Confident strut — bounce with attitude
        yOffset += Math.abs(Math.sin(t * 8)) * 0.15;
        char.group.rotation.z = Math.sin(t * 8) * 0.1;
        scalePulse = 1.03;
      } else if (state === 'ability') {
        // Powering up — glowing, rising
        yOffset += Math.sin(t * 5) * 0.2 + 0.3;
        scalePulse = 1 + Math.abs(Math.sin(t * 5)) * 0.08;
        char.group.rotation.y = t * 2; // spin
      } else {
        char.group.rotation.x = 0;
        char.group.rotation.z *= 0.9;
      }

      char.group.position.y = char.baseY + yOffset;
      char.mesh.scale.set(scalePulse, scalePulse, 1);
      char.group.lookAt(0, char.group.position.y, 0);

      // Bubble follows
      if (char.bubble) {
        char.bubble.position.copy(char.group.position);
        char.bubble.position.y += 2.2;
        char.bubble.lookAt(this.camera.position);
      }
    }

    // Animate smoke particles rising
    this.smokeParticles.forEach((smoke) => {
      const pos = smoke.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + 0.015;
        let x = pos.getX(i) + Math.sin(t * 2 + i) * 0.005;
        // Reset to bottom when too high
        if (y > 5) {
          y = 2.5;
          // Find parent character position
          for (const [, char] of this.characters) {
            if ((char as any).smoke === smoke) {
              x = char.group.position.x + (Math.random() - 0.5) * 0.3;
              pos.setZ(i, char.group.position.z + (Math.random() - 0.5) * 0.3);
              break;
            }
          }
        }
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
      (smoke.material as THREE.PointsMaterial).opacity = 0.3 + Math.sin(t * 1.5) * 0.1;
    });

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
  }
}
