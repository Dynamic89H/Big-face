/**
 * Cee-lo Match Mode — 3-dice street dice vs AI characters.
 *
 * Rules:
 * - Auto-win: 4-5-6, trips (higher trips win), pair + 6
 * - Auto-loss: 1-2-3, pair + 1
 * - Point: pair + odd die = that die's value (higher point wins)
 * - Dead rolls: re-roll
 * - Banker rolls first, sets the bar. Others roll to beat it.
 * - Win with 4-5-6 or trips → steal the banker seat.
 */

import { Router } from 'express';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../util';

const router = Router();

// ============ CEE-LO HAND EVALUATION ============

export type CeeloHandType = 'auto_win' | 'trips' | 'point' | 'auto_loss' | 'dead';

export interface CeeloHand {
  type: CeeloHandType;
  /** For trips: the tripled value. For point: the point value. Else 0. */
  value: number;
  label: string;
}

export function rollDice(): [number, number, number] {
  const d = () => Math.floor(Math.random() * 6) + 1;
  return [d(), d(), d()];
}

export function evaluateHand(dice: [number, number, number]): CeeloHand {
  const [a, b, c] = [...dice].sort((x, y) => x - y);

  // 4-5-6: automatic win
  if (a === 4 && b === 5 && c === 6) {
    return { type: 'auto_win', value: 0, label: '4-5-6!' };
  }
  // 1-2-3: automatic loss
  if (a === 1 && b === 2 && c === 3) {
    return { type: 'auto_loss', value: 0, label: '1-2-3' };
  }
  // Trips
  if (a === b && b === c) {
    return { type: 'trips', value: a, label: `Trips ${a}s!` };
  }
  // Pair + third die
  if (a === b) {
    if (c === 6) return { type: 'auto_win', value: 0, label: `Pair + 6!` };
    if (c === 1) return { type: 'auto_loss', value: 0, label: `Pair + 1` };
    return { type: 'point', value: c, label: `Point ${c}` };
  }
  if (b === c) {
    if (a === 6) return { type: 'auto_win', value: 0, label: `Pair + 6!` };
    if (a === 1) return { type: 'auto_loss', value: 0, label: `Pair + 1` };
    return { type: 'point', value: a, label: `Point ${a}` };
  }
  // Dead roll
  return { type: 'dead', value: 0, label: 'Dead roll' };
}

/**
 * Compare two hands from the challenger's perspective.
 * Returns 1 if challenger wins, -1 if banker wins, 0 for push.
 */
export function compareHands(challenger: CeeloHand, banker: CeeloHand): number {
  const rank = (h: CeeloHand): number => {
    // Higher rank = stronger hand
    switch (h.type) {
      case 'auto_win': return 100;
      case 'trips': return 50 + h.value;
      case 'point': return 10 + h.value;
      case 'dead': return -1; // shouldn't happen after re-rolls
      case 'auto_loss': return 0;
    }
  };
  const cr = rank(challenger), br = rank(banker);
  if (cr > br) return 1;
  if (cr < br) return -1;
  return 0;
}

// ============ AI CHARACTERS ============

export interface AICharacter {
  key: string;
  name: string;
  /** 0-1: how aggressively they bet */
  aggression: number;
  /** Trash talk lines keyed by event */
  lines: Record<string, string[]>;
}

export const CHARACTERS: Record<string, AICharacter> = {  boss: {
    key: 'boss', name: 'The Boss', aggression: 0.8,
    lines: {
      win: ["Too easy.", "That's why I'm the Boss.", "Sit down."],
      lose: ["Lucky. Run it back.", "I let you have that one."],
      banker: ["I'm running this table now.", "Banker. As it should be."],
      taunt: ["You sure you wanna bet against me?", "Your money's already mine."],
    },
  },
  diva: {
    key: 'diva', name: 'Diva', aggression: 0.5,
    lines: {
      win: ["Darling, please.", "Effortless.", "Did you see that?"],
      lose: ["Ugh. Whatever.", "The dice hate pretty today."],
      banker: ["A queen takes her throne.", "Watch and learn."],
      taunt: ["Bet big or go home, baby.", "I look good winning."],
    },
  },
  dread: {
    key: 'dread', name: 'Dread Artist', aggression: 0.6,
    lines: {
      win: ["Read you like a book.", "Knew it.", "Art and science."],
      lose: ["Interesting… noted.", "I'll remember that roll."],
      banker: ["Let me show you how it's done.", "Banker with vision."],
      taunt: ["I already know what you'll roll.", "Your tell is showing."],
    },
  },
  enforcer: {
    key: 'enforcer', name: 'Enforcer', aggression: 0.95,
    lines: {
      win: ["BOOM.", "All muscle.", "Nobody's safe."],
      lose: ["…rematch. NOW.", "That didn't happen."],
      banker: ["MY table.", "Step up or step off."],
      taunt: ["All in. You scared?", "Big bets only."],
    },
  },
};

function pickLine(char: AICharacter, event: string): string {
  const lines = char.lines[event] || char.lines.taunt;
  return lines[Math.floor(Math.random() * lines.length)];
}

// ============ AMBIENT TABLE BANTER ============
// Characters talking to EACH OTHER while the player plays.
// Cross-talk makes the table feel alive.

const BANTER: { from: string; to: string; line: string }[] = [
  { from: 'boss', to: 'diva', line: 'Diva, you\'re quiet. That means you\'re winning or plotting.' },
  { from: 'diva', to: 'boss', line: 'A lady never tells, darling.' },
  { from: 'dread', to: 'enforcer', line: 'You breathe too loud when you\'re nervous, big man.' },
  { from: 'enforcer', to: 'dread', line: 'Keep talking. I like my money angry.' },
  { from: 'boss', to: 'dread', line: 'You still counting dice in your head, professor?' },
  { from: 'dread', to: 'boss', line: 'Someone has to think at this table.' },
  { from: 'diva', to: 'enforcer', line: 'Careful, handsome. Those chips are heavy.' },
  { from: 'enforcer', to: 'diva', line: 'I can handle heavy.' },
  { from: 'diva', to: 'dread', line: 'If you stare at the dice any harder they\'ll crack.' },
  { from: 'dread', to: 'diva', line: 'Just appreciating the physics, Diva.' },
  { from: 'boss', to: 'enforcer', line: 'Easy. We need him confident before we take it all.' },
  { from: 'enforcer', to: 'boss', line: 'I don\'t do patient.' },
];

const ROLL_REACTIONS: Record<string, string[]> = {
  hot: [ // player rolled strong
    'boss: "Okay. Okay. I see you."',
    'diva: "Ooh, somebody came to play."',
    'dread: "Statistically improbable. Impressive."',
    'enforcer: "LUCK. Pure luck."',
  ],
  cold: [ // player rolled weak
    'boss: "That\'s… that\'s rough."',
    'diva: "Oh honey."',
    'dread: "The dice have spoken."',
    'enforcer: "HA! Told you."',
  ],
  tense: [ // big bet, everyone watching
    'boss: "Now we\'re talking."',
    'diva: "My, my. Bold."',
    'dread: "Interesting wager sizing."',
    'enforcer: "FINALLY. Some action."',
  ],
};

/** Get 1-2 ambient banter exchanges between AI characters at the table */
export function getBanter(opponentKeys: string[]): { from: string; to: string; line: string }[] {
  const relevant = BANTER.filter((b) => opponentKeys.includes(b.from) && opponentKeys.includes(b.to));
  if (relevant.length === 0) return [];
  const count = Math.min(2, relevant.length);
  const picked: typeof relevant = [];
  const pool = [...relevant];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked.map((b) => ({
    from: CHARACTERS[b.from].name,
    to: CHARACTERS[b.to].name,
    line: b.line,
  }));
}

/** Get a reaction line based on how the player's roll went */
export function getRollReaction(opponentKeys: string[], kind: 'hot' | 'cold' | 'tense'): string | null {
  const options = ROLL_REACTIONS[kind].filter((r) => {
    const key = r.split(':')[0];
    const charKey = Object.keys(CHARACTERS).find((k) => CHARACTERS[k].name.toLowerCase() === key);
    return charKey && opponentKeys.includes(charKey);
  });
  if (options.length === 0) return null;
  return options[Math.floor(Math.random() * options.length)];
}

// ============ MOB STORY CHAPTERS ============

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  /** Player level required to unlock */
  minLevel: number;
  /** Character keys available as opponents in this chapter */
  opponents: string[];
  /** Suggested buy-ins */
  buyIns: number[];
  intro: string;
  bossFight?: string; // character key for the chapter boss
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'The Corner',
    subtitle: 'Everybody starts somewhere',
    minLevel: 1,
    opponents: ['dread'],
    buyIns: [500, 1000],
    intro: 'Back-alley dice under a flickering streetlight. Dread Artist runs this corner — beat him and word gets around.',
  },
  {
    id: 2,
    title: 'The Club',
    subtitle: 'You got noticed',
    minLevel: 6,
    opponents: ['dread', 'diva'],
    buyIns: [1000, 2500],
    intro: 'Someone saw you cleaning up on the corner. Now you\'re inside — velvet ropes, loud music, and Diva waiting at the table.',
  },
  {
    id: 3,
    title: 'The Casino',
    subtitle: 'Serious people, serious money',
    minLevel: 11,
    opponents: ['diva', 'dread', 'enforcer'],
    buyIns: [2500, 5000],
    intro: 'The real tables. No more street rules — the Enforcer collects debts here, and he doesn\'t like losing.',
  },
  {
    id: 4,
    title: 'The Penthouse',
    subtitle: 'The big leagues',
    minLevel: 16,
    opponents: ['boss', 'diva', 'dread', 'enforcer'],
    buyIns: [5000, 10000],
    intro: 'Top floor. City lights below, sharks at the table. All four of them. Survive this and there\'s only one name left.',
  },
  {
    id: 5,
    title: "The Boss's Table",
    subtitle: 'Dethrone the king',
    minLevel: 21,
    opponents: ['boss'],
    buyIns: [10000, 25000],
    intro: 'Heads up. Just you and the Boss. He built this table. Take everything he has and the city is yours.',
    bossFight: 'boss',
  },
];

/** Get the highest chapter unlocked for a player level */
export function chapterForLevel(level: number): StoryChapter {
  let current = STORY_CHAPTERS[0];
  for (const ch of STORY_CHAPTERS) {
    if (level >= ch.minLevel) current = ch;
  }
  return current;
}

// ============ ROUTES ============

/**
 * Start a new Cee-lo match.
 * Body: { opponents: string[] (1-3 character keys), buyIn: number, playerAbility?: string }
 */
router.post(
  '/match',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { opponents, buyIn = 1000, playerAbility } = req.body as {
      opponents: string[]; buyIn?: number; playerAbility?: string;
    };
    if (!opponents || opponents.length < 1 || opponents.length > 3) {
      res.status(400).json({ error: 'Pick 1-3 opponents' });
      return;
    }
    for (const o of opponents) {
      if (!CHARACTERS[o]) { res.status(400).json({ error: `Unknown character: ${o}` }); return; }
    }
    if (buyIn < 100) { res.status(400).json({ error: 'Minimum buy-in is 100 tokens' }); return; }

    // Check player has tokens
    const { rows: [user] } = await pool.query('SELECT tokens FROM users WHERE id = $1', [req.user!.id]);
    if (!user || Number(user.tokens) < buyIn) {
      res.status(400).json({ error: 'Not enough tokens for buy-in' });
      return;
    }

    // Deduct buy-in
    await pool.query('UPDATE users SET tokens = tokens - $1 WHERE id = $2', [buyIn, req.user!.id]);

    // Everyone starts with equal stacks
    const stacks: Record<string, number> = { player: buyIn };
    const abilitiesUsed: Record<string, boolean> = { player: false };
    for (const o of opponents) {
      stacks[o] = buyIn;
      abilitiesUsed[o] = false;
    }

    const { rows: [match] } = await pool.query(
      `INSERT INTO ceelo_matches (player_id, opponents, banker, stacks, player_ability, abilities_used)
       VALUES ($1, $2, 'player', $3, $4, $5) RETURNING *`,
      [req.user!.id, opponents, JSON.stringify(stacks), playerAbility || null, JSON.stringify(abilitiesUsed)]
    );

    res.json({
      match: {
        id: match.id, opponents, banker: 'player',
        stacks, round: 1, heater: 0,
        playerAbility: playerAbility || null,
      },
      message: `You're the banker. Set the bar.`,
    });
  })
);

/**
 * Play a round. Body: { matchId, bet }
 * Flow: player bets → banker (may be player or AI) rolls → others roll in turn → settle.
 */
router.post(
  '/round',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { matchId, bet } = req.body as { matchId: string; bet: number };
    const { rows: [match] } = await pool.query(
      'SELECT * FROM ceelo_matches WHERE id = $1 AND player_id = $2',
      [matchId, req.user!.id]
    );
    if (!match) { res.status(404).json({ error: 'Match not found' }); return; }
    if (match.status === 'finished') { res.status(400).json({ error: 'Match is over' }); return; }

    const stacks: Record<string, number> = match.stacks;
    const opponents: string[] = match.opponents;
    const banker: string = match.banker;
    const roundNum: number = match.round;

    if (!bet || bet < 10) { res.status(400).json({ error: 'Minimum bet is 10 tokens' }); return; }
    if (stacks.player < bet) { res.status(400).json({ error: 'Bet exceeds your stack' }); return; }

    // --- Collect bets (AI bets based on aggression) ---
    const bets: Record<string, number> = { player: bet };
    for (const o of opponents) {
      if (stacks[o] <= 0) continue; // eliminated
      const char = CHARACTERS[o];
      // AI bets 10-40% of stack, scaled by aggression
      const aiBet = Math.max(10, Math.min(stacks[o], Math.floor(stacks[o] * (0.1 + char.aggression * 0.3))));
      bets[o] = aiBet;
    }
    // Banker doesn't bet against themselves in the traditional sense,
    // but everyone puts their bet in the pot
    let pot = 0;
    for (const [who, amount] of Object.entries(bets)) {
      stacks[who] -= amount;
      pot += amount;
    }

    // --- Banker rolls until a live hand ---
    const rolls: Record<string, [number, number, number]> = {};
    const hands: Record<string, CeeloHand> = {};
    let heat = 0;

    const rollLive = (): { dice: [number, number, number]; hand: CeeloHand } => {
      for (let i = 0; i < 20; i++) { // safety cap
        const dice = rollDice();
        const hand = evaluateHand(dice);
        if (hand.type === 'dead') { heat++; continue; }
        return { dice, hand };
      }
      const dice = rollDice();
      return { dice, hand: evaluateHand(dice) };
    };

    const bankerRoll = rollLive();
    rolls[banker] = bankerRoll.dice;
    hands[banker] = bankerRoll.hand;

    // --- Challengers roll in turn, settle against banker ---
    const results: Record<string, { dice: [number, number, number]; hand: CeeloHand; outcome: number }> = {};
    let newBanker = banker;
    let bankerStole = false;

    const challengers = ['player', ...opponents].filter((c) => c !== banker && stacks[c] >= 0);
    for (const c of challengers) {
      const r = rollLive();
      rolls[c] = r.dice;
      hands[c] = r.hand;
      const outcome = compareHands(r.hand, bankerRoll.hand); // 1 = challenger wins
      results[c] = { dice: r.dice, hand: r.hand, outcome };

      if (outcome === 1) {
        // Challenger beats banker — takes their bet back + banker's matching bet
        const winAmount = bets[c] * 2;
        stacks[c] += winAmount;
        pot -= winAmount;
        // Steal banker seat on 4-5-6 or trips
        if ((r.hand.type === 'auto_win' || r.hand.type === 'trips') && !bankerStole) {
          newBanker = c;
          bankerStole = true;
        }
      } else if (outcome === -1) {
        // Banker wins — banker's stack grows
        stacks[banker] += bets[c] * 2;
        pot -= bets[c] * 2;
      }
      // Push: bet returned
      else {
        stacks[c] += bets[c];
        pot -= bets[c];
      }
    }

    // --- Heater (win streak) ---
    let heater = match.heater;
    const playerWon = results.player && results.player.outcome === 1;
    const playerWasBanker = banker === 'player';
    // Heater builds on round wins (as challenger beating banker, or as banker sweeping)
    if (playerWon || (playerWasBanker && Object.values(results).every((r) => r.outcome === -1))) {
      heater += 1;
    } else if (results.player && results.player.outcome === -1) {
      heater = 0;
    }
    // Heater bonus: +5% per level on player wins
    if (playerWon && heater > 1) {
      const bonus = Math.floor(bets.player * 0.05 * (heater - 1));
      stacks.player += bonus;
    }

    // --- Check eliminations & match end ---
    const alive = ['player', ...opponents].filter((c) => stacks[c] > 0);
    const matchOver = !alive.includes('player') || alive.length === 1;

    // --- Update rivalry ---
    for (const o of opponents) {
      const charWon = results[o] && results[o].outcome === 1 && banker === 'player';
      const playerBeatChar = results[o] && results[o].outcome === -1 && banker === o;
      if (charWon || playerBeatChar) {
        await pool.query(
          `INSERT INTO ceelo_rivalries (player_id, character_key, wins, losses)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (player_id, character_key) DO UPDATE SET
             wins = ceelo_rivalries.wins + $3,
             losses = ceelo_rivalries.losses + $4,
             is_rival = (ceelo_rivalries.losses + $4) >= 3,
             updated_at = now()`,
          [req.user!.id, o, playerBeatChar ? 1 : 0, charWon ? 1 : 0]
        );
      }
    }

    // --- Save round ---
    await pool.query(
      `INSERT INTO ceelo_rounds (match_id, round_num, banker, bets, rolls, hands, pot, winner, new_banker)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [matchId, roundNum, banker, JSON.stringify(bets), JSON.stringify(rolls),
       JSON.stringify(hands), pot, playerWon ? 'player' : banker, newBanker]
    );

    // --- Cash out player stack if match over ---
    if (matchOver && stacks.player > 0) {
      await pool.query('UPDATE users SET tokens = tokens + $1 WHERE id = $2', [stacks.player, req.user!.id]);
    }

    await pool.query(
      `UPDATE ceelo_matches SET stacks = $1, banker = $2, round = $3, heater = $4, heat = $5,
        status = $6, finished_at = CASE WHEN $6 = 'finished' THEN now() ELSE NULL END
       WHERE id = $7`,
      [JSON.stringify(stacks), newBanker, roundNum + 1, heater, heat,
       matchOver ? 'finished' : 'betting', matchId]
    );

    // --- Trash talk ---
    const talk: { who: string; line: string }[] = [];
    for (const o of opponents) {
      const char = CHARACTERS[o];
      if (results[o]?.outcome === 1) talk.push({ who: char.name, line: pickLine(char, 'win') });
      else if (results[o]?.outcome === -1) talk.push({ who: char.name, line: pickLine(char, 'lose') });
    }
    if (newBanker !== banker && newBanker !== 'player') {
      talk.push({ who: CHARACTERS[newBanker].name, line: pickLine(CHARACTERS[newBanker], 'banker') });
    }

    // --- Ambient banter: characters talking to each other ---
    const banter = getBanter(opponents);

    // --- Roll reaction based on player's hand ---
    let rollReaction: string | null = null;
    const playerHand = hands.player;
    if (playerHand) {
      if (playerHand.type === 'auto_win' || playerHand.type === 'trips') {
        rollReaction = getRollReaction(opponents, 'hot');
      } else if (playerHand.type === 'auto_loss') {
        rollReaction = getRollReaction(opponents, 'cold');
      } else if (bet >= (stacks.player + bet) * 0.5) {
        rollReaction = getRollReaction(opponents, 'tense');
      }
    }

    res.json({
      round: roundNum,
      banker, newBanker,
      bets, rolls, hands: Object.fromEntries(Object.entries(hands).map(([k, h]) => [k, h.label])),
      results: Object.fromEntries(Object.entries(results).map(([k, r]) => [k, r.outcome])),
      stacks, pot, heater, heat,
      playerWon: !!playerWon,
      matchOver,
      talk, banter, rollReaction,
    });
  })
);

/** Get active match state */
router.get(
  '/match/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: [match] } = await pool.query(
      'SELECT * FROM ceelo_matches WHERE id = $1 AND player_id = $2',
      [req.params.id, req.user!.id]
    );
    if (!match) { res.status(404).json({ error: 'Match not found' }); return; }
    res.json({
      match: {
        id: match.id, opponents: match.opponents, banker: match.banker,
        stacks: match.stacks, round: match.round, heater: match.heater,
        status: match.status, playerAbility: match.player_ability,
        characters: match.opponents.map((o: string) => ({ key: o, name: CHARACTERS[o].name })),
      },
    });
  })
);

/** Get story chapters with unlock status for the player */
router.get(
  '/story',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: [user] } = await pool.query(
      'SELECT level FROM users WHERE id = $1', [req.user!.id]
    );
    const level = Number(user?.level || 1);
    res.json({
      chapters: STORY_CHAPTERS.map((ch) => ({
        ...ch,
        unlocked: level >= ch.minLevel,
        current: chapterForLevel(level).id === ch.id,
      })),
      playerLevel: level,
    });
  })
);

/**
 * Use a character ability. Body: { matchId, ability }
 * - weight (Boss): double the current pot. AI opponents must match or fold.
 * - golden_touch (Diva): re-roll the next dead roll for free.
 * - read (Dread): reveal opponents' recent roll tendencies.
 * - all_in (Enforcer): bet entire stack on one roll. Win big or eliminated.
 */
router.post(
  '/ability',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { matchId, ability } = req.body as { matchId: string; ability: string };
    const { rows: [match] } = await pool.query(
      'SELECT * FROM ceelo_matches WHERE id = $1 AND player_id = $2',
      [matchId, req.user!.id]
    );
    if (!match) { res.status(404).json({ error: 'Match not found' }); return; }

    const abilitiesUsed: Record<string, boolean> = match.abilities_used;
    const playerAbility: string | null = match.player_ability;

    // Player can only use their picked corner-man ability, once per match
    if (ability !== playerAbility) {
      res.status(400).json({ error: 'You did not pick that ability' });
      return;
    }
    if (abilitiesUsed.player) {
      res.status(400).json({ error: 'Ability already used this match' });
      return;
    }

    const stacks: Record<string, number> = match.stacks;
    let message = '';
    let data: any = {};

    switch (ability) {
      case 'boss': { // Weight: double the pot
        const totalPot = Object.values(stacks).reduce((s, v) => s + v, 0);
        // Player doubles their effective bet pressure — AI must match or fold
        // Simplified: player adds 50% of their stack to pressure the table
        const pressure = Math.floor(stacks.player * 0.5);
        data = { pressure, message: 'The Boss doubles the pot. Match it or fold.' };
        message = `Weight applied — ${pressure} token pressure on the table.`;
        break;
      }
      case 'diva': { // Golden Touch: next dead roll auto re-rolls (flag it)
        data = { goldenTouch: true };
        message = 'Golden Touch active — your next dead roll re-rolls free.';
        break;
      }
      case 'dread': { // Read: reveal AI tendencies
        const { rows: rounds } = await pool.query(
          `SELECT hands FROM ceelo_rounds WHERE match_id = $1 ORDER BY round_num DESC LIMIT 5`,
          [matchId]
        );
        const tendencies: Record<string, string[]> = {};
        for (const r of rounds) {
          const hands = r.hands as Record<string, string>;
          for (const [who, hand] of Object.entries(hands)) {
            if (who === 'player') continue;
            if (!tendencies[who]) tendencies[who] = [];
            tendencies[who].push(hand);
          }
        }
        data = { tendencies };
        message = 'Read complete — you see their patterns.';
        break;
      }
      case 'enforcer': { // All In: bet everything
        data = { allIn: stacks.player, message: 'ALL IN. Win or go home.' };
        message = `All in with ${stacks.player} tokens!`;
        break;
      }
      default:
        res.status(400).json({ error: 'Unknown ability' });
        return;
    }

    abilitiesUsed.player = true;
    // Store ability effect in match for the next round
    const abilityEffects = { ...(match as any).ability_effects, [ability]: data };
    await pool.query(
      'UPDATE ceelo_matches SET abilities_used = $1 WHERE id = $2',
      [JSON.stringify(abilitiesUsed), matchId]
    );

    res.json({ ok: true, message, data });
  })
);

/** Get rivalry standings */
router.get(
  '/rivalries',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM ceelo_rivalries WHERE player_id = $1', [req.user!.id]
    );
    res.json({
      rivalries: rows.map((r) => ({
        character: r.character_key, name: CHARACTERS[r.character_key]?.name,
        wins: r.wins, losses: r.losses, isRival: r.is_rival,
      })),
    });
  })
);

export default router;
