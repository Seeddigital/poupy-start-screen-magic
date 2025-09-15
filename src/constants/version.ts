// App versioning constants
export const APP_VERSION = '1.0.1';
export const CACHE_VERSION = 'v6';
export const APP_BUILD = 7;

// Function to clear old caches when version changes
export const clearOldCaches = () => {
  const currentVersion = localStorage.getItem('app_version');
  
  if (currentVersion !== APP_VERSION) {
    console.log(`Version changed from ${currentVersion} to ${APP_VERSION}, clearing all caches`);
    
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName !== `poupy-${CACHE_VERSION}`) {
            caches.delete(cacheName);
          }
        });
      });
    }
    
    // Set new version
    localStorage.setItem('app_version', APP_VERSION);
    
    // Force reload if needed
    if (currentVersion && currentVersion !== APP_VERSION) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
};