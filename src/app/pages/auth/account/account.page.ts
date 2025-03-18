import {  Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceInformationService } from 'src/app/services/device-information.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
    
    
    providers: [AlertController],
    standalone:false
})
export class AccountPage{

  fullName: string;
  userLoginHandler: EventListenerOrEventListenerObject;

  constructor(private authService: AuthService,
    private router: Router,
    private deviceInfoService: DeviceInformationService,
    
  )  {
    // Tanımlıyoruz ki, 'user:login' event’i tetiklendiğinde getUsername() çağrılacak
    this.userLoginHandler = this.getUsername.bind(this);
    window.addEventListener('user:login', this.userLoginHandler);
  }

  ionViewDidEnter() {
    this.getUsername();
    this.deviceInfoService.gatherAndSendDeviceInfo();
  }

  getUsername() {
    this.authService.getUsername().then(fullName => {
      this.fullName = fullName;
      console.log('Güncellenen kullanıcı adı:', fullName);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('user:login', this.userLoginHandler);
  }
  updatePicture() {
    console.log('Clicked to update picture');
  }

  // changePassword() {
  //   console.log('Clicked to change password');
  // }

  logout() {

    this.authService.logout().then(() => {
      return this.router.navigate(['/tabs/mosque']);
    });
  }

  devices(){
    return this.router.navigate(['/devices']);
  }

}
