import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorEngine, { DEFAULT_CONFIG, type CharacterConfig } from '../components/CreatorEngine';
import { usePageTitle } from '../hooks/usePageTitle';
import { usersApi } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { celebrate } from '../components/Celebration';

const SKIN_TONES = ['#f1c27d', '#e0ac69', '#c68642', '#a0663a', '#8d5524', '#6b4423', '#4a2e15'];
const HAIR_COLORS = ['#1a1a1a', '#3a2a1a', '#6b4423', '#a0663a', '#c0c0c0', '#ff6b35', '#00f0ff', '#ff2fd6'];
const EYE_COLORS = ['#2a1a0a', '#4a2e15', '#1a3a1a', '#1a1a3a', '#3a1a1a', '#00f0ff'];
const LIP_COLORS = ['#8a4a3a', '#a06050', '#c08070', '#6b3020', '#ff6b6b', '#4a2020'];

/**
 * CharacterStudio — create your own avatar from scratch.
 * The perfect engine for building your Big Face character.
 * Sculpt face, hair, body — see it in real-time 3D.
 */
export default function CharacterStudioPage() {
  usePageTitle('Character Studio');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [config, setConfig] = useState<CharacterConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<'face' | 'hair' | 'body' | 'style'>('face');

  const update = (patch: Partial<CharacterConfig>) => setConfig((c) => ({ ...c, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      await usersApi.updateMe({ avatarConfig: { customCharacter: config, gender: config.gender } });
      await refreshUser();
      celebrate(config.gender === 'female' ? '👩 Character Created!' : '👨 Character Created!', true);
      setTimeout(() => navigate('/avatar-studio'), 1500);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const ColorRow = ({ colors, value, onPick }: { colors: string[]; value: string; onPick: (c: string) => void }) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          style={{
            width: 40, height: 40, borderRadius: '50%', background: c,
            border: value === c ? '3px solid var(--gold)' : '2px solid var(--border)',
            cursor: 'pointer',
          }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  );

  const OptionRow = <T extends string>({ options, value, onPick }: {
    options: { id: T; label: string; icon?: string }[];
    value: T;
    onPick: (v: T) => void;
  }) => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      {options.map((o) => (
        <button
          key={o.id}
          className={`btn btn-sm ${value === o.id ? '' : 'btn-ghost'}`}
          onClick={() => onPick(o.id)}
        >
          {o.icon} {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 0.3rem' }}>🎨 Character Studio</h1>
      <p className="form-note" style={{ marginBottom: '1rem' }}>
        Build YOUR character from scratch. Every change updates in real-time 3D.
      </p>

      <div className="card" style={{ textAlign: 'center', marginBottom: '1rem', padding: '1rem' }}>
        {/* Gender selector */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <button
            className={`btn ${config.gender === 'male' ? '' : 'btn-ghost'}`}
            onClick={() => update({ gender: 'male', facialHair: config.facialHair, bodyType: config.bodyType === 'curvy' ? 'athletic' : config.bodyType })}
            style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem' }}
          >
            👨 Male
          </button>
          <button
            className={`btn ${config.gender === 'female' ? '' : 'btn-ghost'}`}
            onClick={() => update({ gender: 'female', facialHair: 'none', bodyType: config.bodyType === 'curvy' ? 'curvy' : 'slim' })}
            style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem' }}
          >
            👩 Female
          </button>
        </div>
        <CreatorEngine config={config} width={320} height={460} />
        <p className="form-note" style={{ margin: '0.5rem 0 0' }}>🖱️ Drag to rotate your creation</p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {(['face', 'hair', 'body', 'style'] as const).map((s) => (
          <button key={s} className={`btn btn-sm ${section === s ? '' : 'btn-ghost'}`} onClick={() => setSection(s)}>
            {s === 'face' ? '😊 Face' : s === 'hair' ? '💇 Hair' : s === 'body' ? '💪 Body' : '✨ Style'}
          </button>
        ))}
      </div>

      <div className="card">
        {section === 'face' && (
          <>
            <h4>Skin Tone</h4>
            <ColorRow colors={SKIN_TONES} value={config.skinTone} onPick={(c) => update({ skinTone: c })} />
            <h4>Face Shape</h4>
            <OptionRow
              options={[
                { id: 'round', label: 'Round' }, { id: 'oval', label: 'Oval' },
                { id: 'square', label: 'Square' }, { id: 'heart', label: 'Heart' },
              ]}
              value={config.faceShape} onPick={(v) => update({ faceShape: v })}
            />
            <h4>Eye Color</h4>
            <ColorRow colors={EYE_COLORS} value={config.eyeColor} onPick={(c) => update({ eyeColor: c })} />
            <h4>Eye Size</h4>
            <input
              type="range" min="0.7" max="1.4" step="0.05" value={config.eyeSize}
              onChange={(e) => update({ eyeSize: parseFloat(e.target.value) })}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <h4>Eyebrows</h4>
            <OptionRow
              options={[
                { id: 'soft', label: 'Soft' }, { id: 'bold', label: 'Bold' }, { id: 'arched', label: 'Arched' },
              ]}
              value={config.browStyle} onPick={(v) => update({ browStyle: v })}
            />
            <h4>Lip Color</h4>
            <ColorRow colors={LIP_COLORS} value={config.lipColor} onPick={(c) => update({ lipColor: c })} />
            <h4>Lip Size</h4>
            <input
              type="range" min="0.7" max="1.5" step="0.05" value={config.lipSize}
              onChange={(e) => update({ lipSize: parseFloat(e.target.value) })}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            {config.gender === 'male' && (
              <>
                <h4>Facial Hair</h4>
                <OptionRow
                  options={[
                    { id: 'none', label: 'None' }, { id: 'mustache', label: 'Mustache' },
                    { id: 'goatee', label: 'Goatee' }, { id: 'beard', label: 'Beard' },
                  ]}
                  value={config.facialHair} onPick={(v) => update({ facialHair: v })}
                />
              </>
            )}
          </>
        )}

        {section === 'hair' && (
          <>
            <h4>Hair Style</h4>
            <OptionRow
              options={[
                { id: 'dreads', label: 'Dreads 🌀' }, { id: 'locs', label: 'Locs' },
                { id: 'afro', label: 'Afro' }, { id: 'fade', label: 'Fade' },
                { id: 'bob', label: 'Bob' }, { id: 'pixie', label: 'Pixie' },
                { id: 'waves', label: 'Waves 🌊' }, { id: 'long', label: 'Long ✨' },
                { id: 'ponytail', label: 'Ponytail' }, { id: 'bald', label: 'Bald' },
              ]}
              value={config.hairStyle} onPick={(v) => update({ hairStyle: v })}
            />
            <h4>Hair Color</h4>
            <ColorRow colors={HAIR_COLORS} value={config.hairColor} onPick={(c) => update({ hairColor: c })} />
          </>
        )}

        {section === 'body' && (
          <>
            <h4>Body Type</h4>
            <OptionRow
              options={
                config.gender === 'female'
                  ? [
                      { id: 'slim', label: 'Slim' }, { id: 'athletic', label: 'Athletic 💪' },
                      { id: 'curvy', label: 'Curvy ✨' }, { id: 'heavy', label: 'Heavy' },
                    ]
                  : [
                      { id: 'slim', label: 'Slim' }, { id: 'athletic', label: 'Athletic 💪' },
                      { id: 'heavy', label: 'Heavy' },
                    ]
              }
              value={config.bodyType} onPick={(v) => update({ bodyType: v })}
            />
            <h4>Height</h4>
            <input
              type="range" min="0.85" max="1.15" step="0.02" value={config.height}
              onChange={(e) => update({ height: parseFloat(e.target.value) })}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          </>
        )}

        {section === 'style' && (
          <>
            <h4>Quick Styles</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfig({ ...DEFAULT_CONFIG, skinTone: '#8d5524', hairStyle: 'dreads', bodyType: 'athletic' })}>
                🦁 Street King
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfig({ ...DEFAULT_CONFIG, skinTone: '#c68642', hairStyle: 'bob', lipColor: '#ff6b6b', bodyType: 'slim' })}>
                👑 Street Queen
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfig({ ...DEFAULT_CONFIG, skinTone: '#6b4423', hairStyle: 'afro', facialHair: 'beard', bodyType: 'heavy' })}>
                🦍 Big Boss
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfig({ ...DEFAULT_CONFIG, skinTone: '#f1c27d', hairStyle: 'pixie', eyeColor: '#00f0ff', hairColor: '#00f0ff' })}>
                🤖 Cyber
              </button>
            </div>
            <p className="form-note" style={{ marginTop: '1rem' }}>
              Start from a preset, then make it yours.
            </p>
          </>
        )}
      </div>

      <button className="btn btn-block" style={{ marginTop: '1.2rem', fontSize: '1.1rem', padding: '0.9rem' }} onClick={save} disabled={saving}>
        {saving ? 'Creating…' : '✨ Create My Character'}
      </button>
    </div>
  );
}
