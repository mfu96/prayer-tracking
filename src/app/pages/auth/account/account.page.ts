import {  Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceInformationService } from 'src/app/services/device-information.service';
import { ImageService } from 'src/app/services/image.service';

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
    userAvatarUrl: string = "https://www.gravatar.com/avatar?d=mm&s=140";


  constructor(private authService: AuthService,
    private router: Router,
    private deviceInfoService: DeviceInformationService,
    private storage:Storage,
    private imageService:ImageService
    
  )  {
    // Tanımlıyoruz ki, 'user:login' event’i tetiklendiğinde getUsername() çağrılacak
    this.userLoginHandler = this.getUsername.bind(this);
    window.addEventListener('user:login', this.userLoginHandler);
  }

  ionViewDidEnter() {
    this.getUsername();
    this.deviceInfoService.addDevice();
      this.loadUserAvatar();
  }


    async loadUserAvatar():  Promise<void> {
    const userId = await this.storage.get('userId');
    console.log('ionic deki userId:', userId);

    if (!userId) {
      return; // userId yoksa işlemi bitir
    }

    this.imageService.getImages('getimagesbyUser', { userid: userId }).subscribe({
      next: (response) => {
        // Cevap başarılı, veri var ve en az bir resim içeriyorsa
        if (response.success && response.data && response.data.length > 0) {
          const firstImage = response.data[0];
          // ImageService'de resim yolunu tamamlayan bir metodunuz olduğunu varsayıyorum.
          // Eğer yoksa, base URL'i burada birleştirebilirsiniz.
          this.userAvatarUrl = this.imageService.getFullImagePath(firstImage.imagePath);
        }
      },
      error: (err) => {
        console.error('Kullanıcı avatarı getirilirken hata oluştu:', err);
        // Hata durumunda varsayılan avatar kullanılmaya devam edecek.
      }
    });
console.log('User avatar URL:', this.userAvatarUrl);
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
    return this.router.navigate(['/tabs/devices']);
  }

}
