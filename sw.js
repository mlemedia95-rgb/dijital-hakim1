
const CACHE_NAME = 'dijital-hakim-v4';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy-policy.html',
  'https://cdn-icons-png.flaticon.com/512/3062/3062599.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Yalnızca GET isteklerini işle
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ağ öncelikli strateji (Stale-while-revalidate benzeri)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Ağdan gelen yanıtı önbelleğe al
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      })
      .catch(() => {
        // Ağ başarısız olursa önbellekten yanıt ver
        return caches.match(event.request);
      })
  );
});
