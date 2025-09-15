const CACHE_NAME = 'poupy-v7';

const urlsToCache = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch event - Conservative caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip all module/asset requests that could conflict with bundler
  if (
    // Skip dev server and vite specific requests
    url.pathname.includes('/@') ||
    url.pathname.includes('/@vite') ||
    url.pathname.includes('node_modules') ||
    // Skip all JS/CSS/TS files to avoid MIME conflicts
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.mjs') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.map') ||
    url.pathname.endsWith('.wasm') ||
    // Skip API calls
    url.hostname === 'api.poupy.ai' ||
    // Skip non-GET requests
    event.request.method !== 'GET'
  ) {
    return; // Let browser handle these normally
  }

  // Only handle essential static assets
  if (url.pathname.includes('/icon-') || url.pathname.includes('manifest.json')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      }).catch(() => {
        return fetch(event.request);
      })
    );
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});