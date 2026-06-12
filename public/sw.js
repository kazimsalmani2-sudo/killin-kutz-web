self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('killinkutz-store').then((cache) => cache.addAll([
      '/',
      '/services',
      '/favicon.ico',
      '/manifest.json'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
