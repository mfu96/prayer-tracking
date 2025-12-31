import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mfunet.eMesai',
  appName: 'e-Mesai',
  webDir: 'www'
,

 plugins: {
    CapacitorUpdater: {
      autoUpdate: true, 
    }
  },
    android: {
       buildOptions: {
          keystorePath: 'c:\Front-End\prayer-tracking\android\app\e-Mesai.keystore',
          keystoreAlias: 'anahtar-e-Mesai',
       }
    }
  };

export default config;
