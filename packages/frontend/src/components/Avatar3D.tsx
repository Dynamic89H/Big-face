import { useEffect, useRef, useState } from 'react';

interface Props {
  avatarUrl: string | null;
  size?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

/** Renders a Ready Player Me GLB avatar in 3D using <model-viewer>. */
export default function Avatar3D({ avatarUrl, size = 280 }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load model-viewer web component once.
    if (!document.querySelector('script[data-model-viewer]')) {
      const s = document.createElement('script');
      s.type = 'module';
      s.dataset.modelViewer = 'true';
      s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
      document.head.appendChild(s);
    }
  }, []);

  if (!avatarUrl) return null;

  return (
    <div style={{ width: size, maxWidth: '100%', margin: '0 auto', position: 'relative' }}>
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      )}
      {/* @ts-ignore - model-viewer web component */}
      <model-viewer
        src={avatarUrl}
        alt="3D avatar"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: size * 1.4, background: 'transparent' }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
