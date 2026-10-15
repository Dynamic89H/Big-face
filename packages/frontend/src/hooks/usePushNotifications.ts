import { useState, useEffect } from 'react';
import { pushApi } from '../api/client';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const output = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

export function usePushNotifications() {
  const [supported] = useState(
    () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!supported || permission !== 'granted') return;
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    });
  }, [supported, permission]);

  const subscribe = async (): Promise<boolean> => {
    if (!supported) return false;
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return false;

      const { publicKey } = await pushApi.vapidKey();
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      const lang = localStorage.getItem('bigface-lang') || navigator.language.slice(0, 2) || 'en';
      await pushApi.subscribe({
        endpoint: sub.endpoint,
        p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')!))),
        lang,
      });

      setSubscribed(true);
      return true;
    } catch (e) {
      console.error('Push subscribe failed:', e);
      return false;
    }
  };

  return { supported, permission, subscribed, subscribe };
}
