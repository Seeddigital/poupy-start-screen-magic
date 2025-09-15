const CACHE_NAME = 'poupy-v5';
const timestamp = new Date().getTime();

const urlsToCache = [
  '/',
  '/dashboard',
  '/categories', 
  '/transactions',
  '/learning',
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

// Fetch event - Network first for HTML, cache first for assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        // Network first for HTML files and API calls
        if (event.request.url.includes('.html') || 
            event.request.url.includes('/api/') ||
            event.request.destination === 'document') {
          const networkResponse = await fetch(event.request + '?v=' + timestamp);
          return networkResponse;
        }
        
        // Cache first for other resources
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fallback to network with cache busting
        return fetch(event.request + '?cb=' + timestamp);
      } catch (error) {
        // Try cache as fallback
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || new Response('Network error', { status: 408 });
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