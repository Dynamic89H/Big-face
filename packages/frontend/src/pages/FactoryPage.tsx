import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, factoryApi } from '../api/client';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';

interface FactoryAsset {
  id: string; kind: string; style: string; prompt: string;
  image_url: string | null; source_url: string | null;
  likes: number; creator_name: string; created_at: string;
}

const KINDS = [
  { id: 'avatar', icon: '👤', label: 'Avatars' },
  { id: 'gear', icon: '⛓️', label: 'Gear' },
  { id: 'background', icon: '🌆', label: 'Backgrounds' },
  { id: 'graphic', icon: '🎨', label: 'Graphics' },
  { id: 'inspiration', icon: '💡', label: 'Inspiration' },
];

const STYLES = [
  { id: 'realistic', icon: '📸', label: 'Realistic' },
  { id: '3d-render', icon: '🎮', label: '3D Render' },
  { id: 'anime', icon: '⛩️', label: 'Anime' },
  { id: 'cartoon', icon: '🎭', label: 'Cartoon' },
  { id: 'cyberpunk', icon: '🌃', label: 'Cyberpunk' },
  { id: 'fantasy', icon: '🐉', label: 'Fantasy' },
  { id: 'street-art', icon: '🧱', label: 'Street Art' },
  { id: 'pixel', icon: '👾', label: 'Pixel' },
];

export default function FactoryPage() {
  usePageTitle('Big Face Factory');
  const [assets, setAssets] = useState<FactoryAsset[]>([]);
  const [kindFilter, setKindFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ kind: 'graphic', style: 'realistic', prompt: '', sourceUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (kindFilter) params.set('kind', kindFilter);
      if (styleFilter) params.set('style', styleFilter);
      const { assets: a } = await factoryApi.list(kindFilter || undefined, styleFilter || undefined);
      setAssets(a);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [kindFilter, styleFilter]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.prompt.trim()) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await factoryApi.create({
        kind: form.kind,
        style: form.style,
        prompt: form.prompt.trim(),
        sourceUrl: form.sourceUrl.trim() || undefined,
      });
      setMsg('✅ Added to the Factory! +20 XP');
      setForm({ kind: 'graphic', style: 'realistic', prompt: '', sourceUrl: '' });
      setShowCreate(false);
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const like = async (id: string) => {
    try {
      await factoryApi.like(id);
      setAssets((prev) => prev.map((a) => a.id === id ? { ...a, likes: a.likes + 1 } : a));
    } catch { /* ignore */ }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ margin: 0 }}>🏭 Big Face Factory</h1>
        <button className="btn" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕' : '＋ Create'}
        </button>
      </div>
      <p className="form-note">
        Big Face's own creation studio. Capture inspiration from anywhere — different art styles,
        graphics, realistic stuff — and bring it into the app.
      </p>
      {msg && <p className="form-note" style={{ fontWeight: 700 }}>{msg}</p>}

      {showCreate && (
        <div className="card" style={{ marginBottom: '1.2rem', borderColor: 'var(--neon-cyan)' }}>
          <h3>＋ New Factory Entry</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {KINDS.map((k) => (
                <button
                  key={k.id} type="button"
                  className={`btn btn-sm ${form.kind === k.id ? '' : 'btn-ghost'}`}
                  onClick={() => setForm({ ...form, kind: k.id })}
                >
                  {k.icon} {k.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {STYLES.map((s) => (
                <button
                  key={s.id} type="button"
                  className={`btn btn-sm ${form.style === s.id ? '' : 'btn-ghost'}`}
                  onClick={() => setForm({ ...form, style: s.id })}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <textarea
              className="textarea"
              placeholder="Describe your idea… (e.g. 'gold chain with lion pendant, cyberpunk style')"
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              rows={3}
            />
            <input
              className="input"
              placeholder="Source URL (optional — where you saw the inspiration)"
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            />
            <button className="btn" type="submit" disabled={submitting || !form.prompt.trim()}>
              {submitting ? 'Adding…' : '🏭 Add to Factory'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select className="select" value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All kinds</option>
          {KINDS.map((k) => <option key={k.id} value={k.id}>{k.icon} {k.label}</option>)}
        </select>
        <select className="select" value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All styles</option>
          {STYLES.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
        </select>
      </div>

      {loading && <p>Loading the factory…</p>}
      {!loading && assets.length === 0 && (
        <div className="card empty-wrap">
          <div className="big">🏭</div>
          <p>Nothing here yet. Be the first to create!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
        {assets.map((a) => (
          <div key={a.id} className="card" style={{ padding: '0.9rem' }}>
            {a.image_url && (
              <img loading="lazy" src={a.image_url} alt={a.prompt} style={{ width: '100%', borderRadius: 8, marginBottom: '0.6rem' }} />
            )}
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>{a.prompt}</div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
              <span className="badge">{KINDS.find((k) => k.id === a.kind)?.icon} {a.kind}</span>
              <span className="badge badge-blue">{STYLES.find((s) => s.id === a.style)?.icon} {a.style}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="form-note">by {a.creator_name}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => like(a.id)}>
                ❤️ {a.likes}
              </button>
            </div>
            {a.source_url && (
              <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="form-note" style={{ display: 'block', marginTop: '0.4rem', color: 'var(--neon-cyan)' }}>
                🔗 View source
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
