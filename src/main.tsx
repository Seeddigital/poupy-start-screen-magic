import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { clearOldCaches } from './constants/version'

// Clear old caches on app start
clearOldCaches();

createRoot(document.getElementById("root")!).render(<App />);
