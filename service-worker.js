const CACHE_NAME = 'offline-v3';
const OFFLINE_URL = 'offline.html';
const OFFLINE_ASSETS = [
  OFFLINE_URL,
  'lib/icon_tab.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const requests = OFFLINE_ASSETS.map(
        (url) => new Request(url, { cache: 'reload' })
      );
      return cache.addAll(requests);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Serve navigation requests with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Serve cached assets (offline page + icon) when available
  const isOfflineAsset =
    url.pathname.endsWith('/offline.html') ||
    url.pathname.endsWith('/lib/icon_tab.webp');

  if (isOfflineAsset) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            // Update cache in background for next time
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
        );
      })
    );
  }
});
