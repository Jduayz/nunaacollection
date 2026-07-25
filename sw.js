const CACHE_NAME = 'nunaa-admin-v3';
const APP_SHELL = [
  '/admin',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/icons/nunaa-app-icon.png',
  '/assets/js/config.js',
  '/assets/js/firebase-client.js',
  '/assets/js/admin-auth.js',
  '/assets/js/admin.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('nunaa-admin-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('/admin', copy));
          }
          return response;
        })
        .catch(() => caches.match('/admin'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
