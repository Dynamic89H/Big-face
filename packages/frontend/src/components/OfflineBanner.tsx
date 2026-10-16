import { useEffect, useState } from 'react';

/**
 * OfflineBanner — shows when the connection drops.
 * No more silent failures.
 */
export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000,
      background: 'linear-gradient(90deg, #ff4444, #cc0000)',
      color: 'white', textAlign: 'center', padding: '0.6rem',
      fontWeight: 700, fontSize: '0.9rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    }}>
      📡 You're offline — check your connection
    </div>
  );
}
