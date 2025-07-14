import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f4d2e326a7a6425297414585a4e3dae2',
  appName: 'poupy-start-screen-magic',
  webDir: 'dist',
  server: {
    url: 'https://f4d2e326-a7a6-4252-9741-4585a4e3dae2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;