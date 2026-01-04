import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Storage } from '@ionic/storage-angular';
import { LoginModel } from 'src/app/interfaces/entities/loginModel';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage  {
  login: LoginModel = { email: '', password: '' };


  constructor(
    private authService: AuthService,
    private storage: Storage,
    private router:Router,
    private toast:ToastService,
        private route: ActivatedRoute // URL parametrelerini okumak için eklendi


  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.login).subscribe(
        async (response) => {  // async callback kullanalım ki await edebilelim
          if (response.success) {
            await this.storage.set('token', response.data.token);
            await this.storage.set('expiration', response.data.expiration);
            await this.storage.set('loggedIn', true);
            await this.storage.set('mosqueId', 3);  //https sorunu olduğu için deneme amaçlı koydum

            
            await this.authService.setUser(this.login.email);

                  // Yeni 04-01-26 / 15:58
            // URL'deki 'returnUrl' parametresini alıyoruz ama hemen gitmiyoruz.
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];

  
            // Yönlendirmeyi storage işlemleri bittikten sonra yapalım
            this.router.navigate(['/account']).then(() => {
              // Yönlendirme sonrası event gönderilebilir; fakat AccountPage’in ionViewWillEnter’i tetiklenmiş oluyor.
              window.dispatchEvent(new Event('user:login'));

              this.toast.showToastSuccess('Giriş başarılı! Anasayfaya yönlendiriliyorsunuz...');
              // Wait 3 seconds, then navigate to '/'
              setTimeout(() => {
                if (returnUrl) {
                  // Yeni 04-01-26 / 15:58
                  // Eğer kullanıcı Guard'dan geldiyse, gitmek istediği yere gönder
                  this.router.navigateByUrl(returnUrl);
                } else {
                  // Yoksa normal akışta Anasayfaya gönder
                  this.router.navigate(['/']);
                }
              }, 3000); // 3 saniye bekleme
            });
            
            console.log('Giriş başarılı!');
          } else {
            console.log('Giriş başarısız:', response.message);
          }
        },
        (error) => {
          console.log('Hata:', error);
          this.toast.showToastWarning('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
        
          console.log(error.error);
    
        }
      );
    }
  }
  

  onSignup() {
    // Kayıt ol sayfasına yönlendirme veya işlemler
  }
}