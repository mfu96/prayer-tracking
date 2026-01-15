import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mfunet.eMesai',
  appName: 'e-Mesai',
  webDir: 'www'
,

 plugins: {
    CapacitorUpdater: {
         autoUpdate: false, // Yeni 15-01-26 / 19:10 - Bulut kontrolü kapatıldı, manuel yapılacak
      resetWhenUpdate: false
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
