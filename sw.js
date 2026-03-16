const CACHE_NAME = 'relampago-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
];

// URLs that should NEVER be cached (APIs, payment verification, CDN modules)
const NO_CACHE_PATTERNS = [
  'api.yadio.io',
  '/verify/',
  '/callback/',
  'esm.sh',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never cache API calls, payment verification, or CDN modules
  if (NO_CACHE_PATTERNS.some(pattern => url.includes(pattern))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network first, fallback to cache for same-origin resources
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
