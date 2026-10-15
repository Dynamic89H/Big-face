import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLobby from '../components/GameLobby';
import AmbientDice from '../components/AmbientDice';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * GameLivePage — the live game screen.
 * Full-screen 3D world with walking avatars, ambient dice, and quick actions.
 * This is Big Face's game mode.
 */
export default function GameLivePage() {
  usePageTitle('Game Live');
  const navigate = useNavigate();
  const [tab, setTab] = useState<'arena' | 'dice'>('arena');

  return (
    <div className="page" style={{ padding: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.2rem 0.5rem',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem' }}>
          <span className="live-dot" /> GAME LIVE
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${tab === 'arena' ? '' : 'btn-ghost'}`}
            onClick={() => setTab('arena')}
          >
            🏟️ Arena
          </button>
          <button
            className={`btn btn-sm ${tab === 'dice' ? '' : 'btn-ghost'}`}
            onClick={() => setTab('dice')}
          >
            🎲 Dice Pit
          </button>
        </div>
      </div>

      {/* Live 3D world */}
      <div style={{ padding: '0 1.2rem' }}>
        {tab === 'arena' ? (
          <GameLobby width={1400} height={600} characterCount={8} />
        ) : (
          <AmbientDice width={1400} height={600} />
        )}
      </div>

      {/* Quick actions */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.8rem', padding: '1.2rem',
      }}>
        <button className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/gamble')}>
          <div style={{ fontSize: '2rem' }}>🎲</div>
          <div style={{ fontWeight: 800, marginTop: '0.4rem' }}>Gamble Face</div>
          <div className="form-note">Roll the dice</div>
        </button>
        <button className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/avatar-studio')}>
          <div style={{ fontSize: '2rem' }}>🦁</div>
          <div style={{ fontWeight: 800, marginTop: '0.4rem' }}>Avatar Studio</div>
          <div className="form-note">Gear up your hero</div>
        </button>
        <button className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/battles')}>
          <div style={{ fontSize: '2rem' }}>⚔️</div>
          <div style={{ fontWeight: 800, marginTop: '0.4rem' }}>Battles</div>
          <div className="form-note">Face off live</div>
        </button>
        <button className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/factory')}>
          <div style={{ fontSize: '2rem' }}>🏭</div>
          <div style={{ fontWeight: 800, marginTop: '0.4rem' }}>Factory</div>
          <div className="form-note">Create & inspire</div>
        </button>
      </div>

      <p className="form-note" style={{ textAlign: 'center', padding: '0 1.2rem 1.5rem' }}>
        🎮 This is Big Face's live game world. Your avatar walks the arena. The dice never stop rolling.
      </p>
    </div>
  );
}
