import { useEffect, useRef, useState } from 'react';

interface MetaPersonCreatorProps {
  onAvatarExported?: (url: string, gender: string) => void;
  height?: number;
}

/**
 * MetaPersonCreator — embeds Avatar SDK's MetaPerson Creator.
 * The industry-standard avatar engine (replacement for Ready Player Me).
 * Users upload a selfie → get a realistic 3D avatar in ~1 minute.
 *
 * Requires Avatar SDK credentials (Enterprise plan).
 * Get them at https://avatarsdk.com
 */
export default function MetaPersonCreator({ onAvatarExported, height = 600 }: MetaPersonCreatorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState('Loading avatar engine…');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== 'metaperson_creator') return;

      const eventName = data.eventName;

      if (eventName === 'unity_loaded') {
        setLoaded(true);
        setStatus('Ready — create your avatar');
        // Authenticate if credentials are configured
        const clientId = import.meta.env.VITE_AVATARSDK_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_AVATARSDK_CLIENT_SECRET;
        if (clientId && clientSecret && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            eventName: 'authenticate',
            clientId,
            clientSecret,
            exportTemplateCode: '',
          }, '*');
          iframeRef.current.contentWindow.postMessage({
            eventName: 'set_export_parameters',
            format: 'glb',
            lod: 1,
            textureProfile: '1K.jpg',
          }, '*');
        }
      } else if (eventName === 'model_exported') {
        setStatus('Avatar created! 🎉');
        onAvatarExported?.(data.url, data.gender);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarExported]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 16, overflow: 'hidden' }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
          background: 'rgba(10,12,24,0.9)', zIndex: 1,
        }}>
          <div className="spinner" style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--gold)',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#fff' }}>{status}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="https://metaperson.avatarsdk.com/iframe.html"
        allow="camera; microphone; fullscreen"
        style={{ width: '100%', height, border: 'none', borderRadius: 16 }}
        title="MetaPerson Avatar Creator"
      />
    </div>
  );
}
