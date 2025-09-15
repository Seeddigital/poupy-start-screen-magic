import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { clearOldCaches } from './constants/version'

// Clear old caches on app start
clearOldCaches();

// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
