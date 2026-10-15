// Big Face service worker — offline support and installability.
const CACHE = 'bigface-v1';
const CORE = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache API, sockets, or uploads — always go to network.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/') || url.pathname.startsWith('/uploads/')) {
    return;
  }
  // Navigation: network first, fall back to cached index.html.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  // Assets: cache first, then network.
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/'))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});

// === Push notifications ===
self.addEventListener('push', (e) => {
  let data = { title: '👑 Big Face', body: 'Something new is happening!', url: '/', icon: '/probus-lion.webp' };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch { /* use defaults */ }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/probus-lion.webp',
      badge: '/probus-lion.webp',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
