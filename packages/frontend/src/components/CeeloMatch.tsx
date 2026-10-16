/**
 * Cee-lo Match Mode — 3-dice street dice vs AI characters.
 * Setup → bet → roll → settle → next round.
 */
import { useState, useEffect } from 'react';
import { ceeloApi } from '../api/client';

const CHARACTER_META: Record<string, { name: string; emoji: string; ability: string; abilityDesc: string }> = {
  boss: { name: 'The Boss', emoji: '👑', ability: 'Weight', abilityDesc: 'Double the pot once per match. Others match or fold.' },
  diva: { name: 'Diva', emoji: '💎', ability: 'Golden Touch', abilityDesc: 'Re-roll one dead roll for free, once per match.' },
  dread: { name: 'Dread Artist', emoji: '🎨', ability: 'Read', abilityDesc: 'See opponent tendencies before betting, once per match.' },
  enforcer: { name: 'Enforcer', emoji: '💪', ability: 'All In', abilityDesc: 'Bet everything on one roll. Hit it big or go home.' },
};

const DICE_EMOJI = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

interface RoundResult {
  round: number;
  banker: string;
  newBanker: string;
  bets: Record<string, number>;
  rolls: Record<string, [number, number, number]>;
  hands: Record<string, string>;
  results: Record<string, number>;
  stacks: Record<string, number>;
  pot: number;
  heater: number;
  heat: number;
  playerWon: boolean;
  matchOver: boolean;
  talk: { who: string; line: string }[];
  banter: { from: string; to: string; line: string }[];
  rollReaction: string | null;
}

export default function CeeloMatch({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<'story' | 'setup' | 'playing'>('story');
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [opponents, setOpponents] = useState<string[]>(['boss']);
  const [buyIn, setBuyIn] = useState(1000);
  const [ability, setAbility] = useState<string>('');
  const [matchId, setMatchId] = useState('');
  const [stacks, setStacks] = useState<Record<string, number>>({});
  const [banker, setBanker] = useState('player');
  const [roundNum, setRoundNum] = useState(1);
  const [heater, setHeater] = useState(0);
  const [bet, setBet] = useState(100);
  const [lastRound, setLastRound] = useState<RoundResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [abilityUsed, setAbilityUsed] = useState(false);
  const [playerAbility, setPlayerAbility] = useState<string>('');

  useEffect(() => {
    ceeloApi.story().then((res) => {
      setChapters(res.chapters);
      const current = res.chapters.find((c) => c.current) || res.chapters[0];
      setSelectedChapter(current);
      // Pre-fill opponents/buy-in from the current chapter
      setOpponents(current.opponents.slice(0, 1));
      setBuyIn(current.buyIns[0]);
    }).catch(() => {});
  }, []);

  const toggleOpponent = (key: string) => {
    setOpponents((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : prev.length < 3 ? [...prev, key] : prev
    );
  };

  const startMatch = async () => {
    try {
      const res = await ceeloApi.startMatch(opponents, buyIn, ability || undefined);
      setMatchId(res.match.id);
      setStacks(res.match.stacks);
      setBanker(res.match.banker);
      setRoundNum(1);
      setHeater(0);
      setLastRound(null);
      setPlayerAbility(ability);
      setAbilityUsed(false);
      setPhase('playing');
      setMsg(res.message);
    } catch (e: any) {
      setMsg(e.message || 'Could not start match');
    }
  };

  const useAbility = async () => {
    if (!playerAbility || abilityUsed) return;
    try {
      const res = await ceeloApi.useAbility(matchId, playerAbility);
      setAbilityUsed(true);
      setMsg(res.message);
      // All-in: auto-set bet to full stack
      if (res.data?.allIn) setBet(res.data.allIn);
    } catch (e: any) {
      setMsg(e.message || 'Ability failed');
    }
  };

  const playRound = async () => {
    setRolling(true);
    setMsg(null);
    try {
      const res: RoundResult = await ceeloApi.playRound(matchId, bet);
      setLastRound(res);
      setStacks(res.stacks);
      setBanker(res.newBanker);
      setRoundNum(res.round + 1);
      setHeater(res.heater);
      if (res.matchOver) {
        setMsg(res.stacks.player > 0 ? 'Match over — you cashed out!' : 'Match over — you got cleaned out.');
      }
    } catch (e: any) {
      setMsg(e.message || 'Round failed');
    }
    setRolling(false);
  };

  const nameOf = (key: string) => key === 'player' ? 'You' : CHARACTER_META[key]?.name || key;
  const emojiOf = (key: string) => key === 'player' ? '😎' : CHARACTER_META[key]?.emoji || '🎲';

  if (phase === 'story') {
    return (
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>📖 Story Mode</h2>
        <p className="form-note">From the corner to the Boss's table. Climb the chapters as you level up.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              disabled={!ch.unlocked}
              onClick={() => {
                setSelectedChapter(ch);
                setOpponents(ch.opponents.slice(0, 1));
                setBuyIn(ch.buyIns[0]);
                setPhase('setup');
              }}
              className={`btn ${ch.current ? '' : 'btn-ghost'}`}
              style={{
                padding: '1rem', textAlign: 'left', opacity: ch.unlocked ? 1 : 0.4,
                border: ch.bossFight ? '2px solid #cc0000' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    {ch.unlocked ? '📖' : '🔒'} Chapter {ch.id}: {ch.title}
                  </div>
                  <div className="form-note">{ch.subtitle} — Level {ch.minLevel}+</div>
                </div>
                {ch.current && <span style={{ color: 'var(--gold)', fontWeight: 800 }}>YOU ARE HERE</span>}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', fontStyle: 'italic', opacity: 0.9 }}>
                "{ch.intro}"
              </div>
            </button>
          ))}
        </div>
        <button onClick={onExit} className="btn btn-ghost btn-sm">Back</button>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>🎲 Cee-lo Match</h2>
        <p className="form-note">3-dice street dice. Banker sets the bar, everyone rolls to beat it. Win with 4-5-6 or trips to steal the banker seat.</p>

        <h3>Pick your opponents (1-3)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {Object.entries(CHARACTER_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => toggleOpponent(key)}
              className={`btn ${opponents.includes(key) ? '' : 'btn-ghost'}`}
              style={{ padding: '0.8rem', textAlign: 'left' }}
            >
              <div style={{ fontSize: '1.5rem' }}>{meta.emoji}</div>
              <div style={{ fontWeight: 700 }}>{meta.name}</div>
              <div className="form-note" style={{ fontSize: '0.75rem' }}>{meta.ability}: {meta.abilityDesc}</div>
            </button>
          ))}
        </div>

        <h3>Buy-in (tokens)</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[500, 1000, 2500, 5000].map((amt) => (
            <button key={amt} onClick={() => setBuyIn(amt)}
              className={`btn btn-sm ${buyIn === amt ? '' : 'btn-ghost'}`}>
              {amt.toLocaleString()}
            </button>
          ))}
        </div>

        <h3>Your corner-man ability (pick one to borrow)</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setAbility('')}
            className={`btn btn-sm ${!ability ? '' : 'btn-ghost'}`}>None</button>
          {Object.entries(CHARACTER_META).map(([key, meta]) => (
            <button key={key} onClick={() => setAbility(key)}
              className={`btn btn-sm ${ability === key ? '' : 'btn-ghost'}`}
              title={meta.abilityDesc}>
              {meta.emoji} {meta.ability}
            </button>
          ))}
        </div>

        <button onClick={startMatch} className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          🃏 Start Match — {buyIn.toLocaleString()} tokens
        </button>
        {msg && <p className="form-note" style={{ marginTop: '0.5rem' }}>{msg}</p>}
      </div>
    );
  }

  const allPlayers = ['player', ...opponents];

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>🎲 Cee-lo — Round {roundNum}</h2>
        <button onClick={onExit} className="btn btn-sm btn-ghost">Exit</button>
      </div>

      {heater > 1 && (
        <div style={{
          background: 'linear-gradient(90deg, #ff6b00, #ffaa00)', color: '#000',
          padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 800,
          marginBottom: '1rem', textAlign: 'center',
        }}>
          🔥 HEATER x{heater} — +{5 * (heater - 1)}% on wins!
        </div>
      )}

      {/* Players at the table */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {allPlayers.map((p) => (
          <div key={p} className="card" style={{
            flex: 1, minWidth: 100, padding: '0.6rem', textAlign: 'center',
            border: banker === p ? '2px solid var(--gold)' : undefined,
            opacity: stacks[p] <= 0 ? 0.4 : 1,
          }}>
            <div style={{ fontSize: '1.5rem' }}>{emojiOf(p)}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{nameOf(p)}</div>
            {banker === p && <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800 }}>🃏 BANKER</div>}
            <div className="form-note">{(stacks[p] || 0).toLocaleString()} tokens</div>
            {stacks[p] <= 0 && <div style={{ color: '#ff8080', fontSize: '0.75rem' }}>OUT</div>}
          </div>
        ))}
      </div>

      {/* Last round results */}
      {lastRound && (
        <div style={{ marginBottom: '1rem' }}>
          {allPlayers.map((p) => {
            const dice = lastRound.rolls[p];
            const hand = lastRound.hands[p];
            const outcome = lastRound.results[p];
            if (!dice) return null;
            return (
              <div key={p} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span>{emojiOf(p)} {nameOf(p)}</span>
                <span style={{ fontSize: '1.3rem' }}>
                  {dice.map((d) => DICE_EMOJI[d - 1]).join(' ')}
                </span>
                <span style={{ fontWeight: 700, color: outcome === 1 ? 'var(--green)' : outcome === -1 ? '#ff8080' : undefined }}>
                  {hand} {outcome === 1 ? '✅' : outcome === -1 ? '❌' : '➖'}
                </span>
              </div>
            );
          })}
          {lastRound.heat > 0 && (
            <div style={{ color: '#ffaa00', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              🌡️ {lastRound.heat} dead roll{lastRound.heat > 1 ? 's' : ''} this round — heat rising!
            </div>
          )}
          {/* Trash talk */}
          {lastRound.talk.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 8,
              padding: '0.4rem 0.8rem', marginTop: '0.3rem', fontSize: '0.9rem',
            }}>
              <strong>{t.who}:</strong> <em>"{t.line}"</em>
            </div>
          ))}
          {/* Table banter — characters talking to each other */}
          {lastRound.banter?.map((b, i) => (
            <div key={`b${i}`} style={{
              background: 'rgba(201,162,39,0.08)', borderRadius: 8,
              padding: '0.4rem 0.8rem', marginTop: '0.3rem', fontSize: '0.85rem',
              borderLeft: '2px solid var(--gold)',
            }}>
              <strong>{b.from}</strong> <span style={{ opacity: 0.6 }}>→ {b.to}:</span>{' '}
              <em>"{b.line}"</em>
            </div>
          ))}
          {/* Roll reaction */}
          {lastRound.rollReaction && (
            <div style={{
              background: 'rgba(255,107,0,0.1)', borderRadius: 8,
              padding: '0.4rem 0.8rem', marginTop: '0.3rem', fontSize: '0.9rem',
              fontWeight: 700,
            }}>
              👀 {lastRound.rollReaction}
            </div>
          )}
        </div>
      )}

      {/* Betting */}
      {!lastRound?.matchOver && stacks.player > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number" value={bet} min={10} max={stacks.player}
            onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 10))}
            style={{ flex: 1, minWidth: 100, padding: '0.8rem', borderRadius: 8, border: '1px solid var(--gold)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem' }}
          />
          <button onClick={playRound} disabled={rolling} className="btn" style={{ padding: '0.8rem 1.5rem' }}>
            {rolling ? '🎲 Rolling...' : '🎲 Roll'}
          </button>
          {playerAbility && !abilityUsed && (
            <button onClick={useAbility} className="btn btn-sm"
              style={{ padding: '0.8rem', background: 'linear-gradient(90deg, #7b2ff7, #f72fa9)', border: 'none' }}
              title={CHARACTER_META[playerAbility]?.abilityDesc}>
              ⚡ {CHARACTER_META[playerAbility]?.ability}
            </button>
          )}
        </div>
      )}

      {msg && <p className="form-note" style={{ marginTop: '0.5rem', fontWeight: 700 }}>{msg}</p>}
    </div>
  );
}
