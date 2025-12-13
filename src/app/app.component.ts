import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './providers/user-data';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{


  public appPages = [
    { title: 'Namaz Vakitlerim', url: '/tabs/prayer-time', icon: 'assets/icon/prayer-time.svg', type:'svg' },
    { title: 'Camii', url: '/tabs/mosque', icon: 'assets/icon/mosque.svg', type:'svg' },
    { title: 'Pano', url: '/tabs/daily-board', icon: 'clipboard' },
    // { title: 'Prayer', url: '/tabs/prayer', icon: 'square' },
    // { title: 'Mosque', url: '/tabs/mosque', icon: 'ellipse' },
    // { title: 'Employee', url: '/tabs/employees', icon: 'ellipse' },

  ];

  
  loggedIn = false;
  dark = false;

  constructor(
    private storage: Storage,
    private swUpdate: SwUpdate,
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
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.versionUpdates.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
    
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
