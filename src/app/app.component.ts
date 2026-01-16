import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './providers/user-data';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
// YENİ: package.json dosyasını direkt içeri aktarıyoruz
// Not: Bu satırın çalışması için tsconfig.json içinde "resolveJsonModule": true olmalıdır.
import packageInfo from '../../package.json';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
// Yeni 16-01-26 / 10:05 - Kanal ayarını saklayacağımız anahtar
const CHANNEL_KEY = 'update_channel';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{

    public appVersion: string = packageInfo.version; 

    
  // Yeni 16-01-26 / 10:05 - Kanal Bilgisi (Varsayılan Prod)
  public currentChannel: string = 'Prod'; 
  private clickCount = 0; // Gizli tıklama sayacı


  

  public appPages = [
    { title: 'Hareketlerim', url: '/tabs/prayer-time', icon: 'time-sharp'},
        // { title: 'Hareketlerim', url: '/tabs/prayer-time', icon: 'assets/icon/prayer-time.svg', type:'svg' },

    //{ title: 'Camii', url: '/tabs/mosque', icon: 'assets/icon/mosque.svg', type:'svg' },
       { title: 'Konumum', url: '/tabs/mosque', icon: 'location-sharp' ,type:'ionic || svg'},

    { title: 'Dijital Pano', url: '/tabs/daily-board', icon: 'clipboard' },
    // { title: 'Prayer', url: '/tabs/prayer', icon: 'square' },
    // { title: 'Mosque', url: '/tabs/mosque', icon: 'ellipse' },
    // { title: 'Employee', url: '/tabs/employees', icon: 'ellipse' },

  ];

  
  loggedIn = false;
  dark = false;

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private platform: Platform,
    private userData: UserData,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
    private toastService: ToastService


  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();

  // Yeni 16-01-26 / 10:05 - Kayıtlı kanalı öğren (Dev mi Prod mu?)
    const channel = await this.storage.get(CHANNEL_KEY);
    this.currentChannel = channel === 'dev' ? 'DEV' : 'Prod';
     
    // 1. KRİTİK: Uygulama açılır açılmaz "Ben hazırım, sakın eski sürüme dönme" de.
    try {
       await CapacitorUpdater.notifyAppReady();
    } catch(e) { console.error(e); }
  
    this.checkLoginStatus();
    this.listenForLoginEvents();
  
    // 2. Güncellemeyi kontrol et
    this.checkForMyUpdate();
 
    
  }

// Yeni 16-01-26 / 10:05 - Gizli Kanal Değiştirici (Versiyon yazısına tıklayınca)
  async onVersionClick() {
    this.clickCount++;
    
    // 5 kere tıklanırsa mod değiştir
    if (this.clickCount >= 5) {
      this.clickCount = 0;
      await this.toggleChannel();
    }
  }

  // Yeni 16-01-26 / 10:15 - Kanal Değiştirme Mantığı
  async toggleChannel() {
    const current = await this.storage.get(CHANNEL_KEY);
    
    // Eğer şu an 'dev' modundaysak, 5 tıklama ile 'prod'a (Normal) döneriz.
    if (current === 'dev') {
      await this.storage.set(CHANNEL_KEY, 'prod');
      this.currentChannel = 'Prod';
      this.toastService.showToastSuccess('Normal Kullanıcı moduna geçildi.');
    } else {
      // Eğer 'prod' modundaysak, 5 tıklama ile 'dev'e geçeriz.
      await this.storage.set(CHANNEL_KEY, 'dev');
      this.currentChannel = 'DEV';
      this.toastService.showToastSuccess('Geliştirici moduna geçildi! Test sürümleri alınacak.');
    }

    // Kanal değişince hemen yeni kanalın güncellemesini kontrol et
    this.checkForMyUpdate();
  }

  // Yeni 16-01-26 / 10:15 - Sunucudan Kontrol Mantığı (Dinamik URL ve JSON Korumalı)
  async checkForMyUpdate() {
    try {
      // Kanala göre hangi JSON dosyasına bakacağını seç
      const channel = await this.storage.get(CHANNEL_KEY);
      const jsonFileName = channel === 'dev' ? 'version-dev.json' : 'version.json';
      
      // Kendi sunucuna istek at (No-Store ile önbelleği engelliyoruz)
      const updateUrl = `https://mobil.mfunet.com.tr/updates/${jsonFileName}`;
      console.log('Güncelleme kontrol ediliyor:', updateUrl);

      const response = await fetch(updateUrl, { cache: "no-store" });
      
      if (!response.ok) {
        console.log('Sunucuya ulaşılamadı veya dosya yok (404).');
        return;
      }

      // JSON parse hatasını önlemek için önce text alıp kontrol ediyoruz
      const textData = await response.text();
      let serverData;
      try {
        serverData = JSON.parse(textData);
      } catch (e) {
        console.error('Sunucudan gelen veri geçerli bir JSON değil:', textData);
        return;
      }

      console.log('Kanal:', this.currentChannel, 'Sunucu:', serverData.version, 'Cihaz:', this.appVersion);

      // 2. Sürüm farklıysa güncelleme işlemini başlat
      if (serverData.version !== this.appVersion) {
        await this.downloadAndInstallUpdate(serverData.url, serverData.version);
      } else {
        console.log('Uygulama güncel.');
      }

    } catch (error) {
      console.error('Güncelleme kontrol hatası:', error);
    }
  }

  // Yeni 16-01-26 / 10:05 - İndirme ve Yükleme İşlemi
  async downloadAndInstallUpdate(zipUrl: string, newVersion: string) {
    try {
      console.log('Güncelleme indiriliyor...', zipUrl);
      
      const version = await CapacitorUpdater.download({
        url: zipUrl,
        version: newVersion
      });

      console.log('İndirme tamam, güncelleme ayarlanıyor...');
      
      this.toastService.showToastInfo(`Yeni sürüm (${newVersion}) indirildi. Uygulama güncellenecek.`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await CapacitorUpdater.set(version);
      
    } catch (error) {
      console.error('Güncelleme yükleme hatası:', error);
      this.toastService.showToastInfo('Güncelleme sırasında hata oluştu.');
    }
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }

  checkLoginStatus() {
    let log= this.authService.isAuthenticated();
    console.log(log)
    
    return log.then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

    async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get('token');
    const expiration = await this.storage.get('expiration');

    if (token && expiration) {
      const now = new Date().getTime();
      const exp = new Date(expiration).getTime();
      return now < exp;
    } else {
      return false;
    }
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {

    this.authService.logout().then(() => {
            this.toastService.showToastSuccess('Çıkış başarılı!');

      return this.router.navigate(['/tabs/daily-board']);
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
