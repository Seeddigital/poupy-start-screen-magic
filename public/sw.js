const CACHE_NAME = 'poupy-v3';
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

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network with cache busting for HTML
        if (!response || event.request.url.includes('.html')) {
          return fetch(event.request + '?v=' + timestamp);
        }
        return response;
      }
      .catch(() => fetch(event.request))
    )
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