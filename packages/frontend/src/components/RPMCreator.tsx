import { useEffect, useRef } from 'react';

interface Props {
  onAvatarExported: (url: string) => void;
  onClose: () => void;
}

const RPM_SUBDOMAIN = import.meta.env.VITE_RPM_SUBDOMAIN || 'demo';

/**
 * Embedded Ready Player Me avatar creator.
 * When the user finishes, RPM posts v1.avatar.exported with the GLB url.
 */
export default function RPMCreator({ onAvatarExported, onClose }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== 'https://readyplayer.me' && !event.origin.endsWith('.readyplayer.me')) return;
      let data: any = event.data;
      try {
        data = typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        return;
      }
      if (data?.eventName === 'v1.avatar.exported') {
        const url = data.data?.url as string | undefined;
        if (url) onAvatarExported(url);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onAvatarExported]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 480, height: '80vh', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-ghost"
          style={{ position: 'absolute', top: -44, right: 0, zIndex: 1 }}
          onClick={onClose}
        >
          ✕ Close
        </button>
        <iframe
          ref={ref}
          src={`https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&bodyType=fullbody`}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
          title="Create your 3D avatar"
          allow="camera *; microphone *"
        />
      </div>
    </div>
  );
}
