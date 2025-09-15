const CACHE_NAME = 'poupy-v6';

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

// Fetch event - Safe caching strategy
self.addEventListener('fetch', (event) => {
  // Don't intercept JS modules, CSS imports, or hot reload requests
  if (event.request.url.includes('/@') ||
      event.request.url.includes('.tsx') ||
      event.request.url.includes('.ts') ||
      event.request.url.includes('.js') ||
      event.request.url.includes('.css') ||
      event.request.url.includes('/@vite') ||
      event.request.url.includes('node_modules') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Network first for documents
        if (event.request.destination === 'document') {
          return fetch(event.request);
        }
        
        // Cache first for static assets only
        if (event.request.url.includes('/icon-') || 
            event.request.url.includes('manifest.json')) {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
        }
        
        // Default to network
        return fetch(event.request);
      } catch (error) {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || fetch(event.request);
      }
    })()
  );
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