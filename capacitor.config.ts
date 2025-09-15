import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f4d2e326a7a6425297414585a4e3dae2',
  appName: 'poupy-start-screen-magic',
  webDir: 'dist',
  version: '1.0.0',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;