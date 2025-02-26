import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage-angular';
import { LoginModel } from 'src/app/interfaces/entities/loginModel';

import { AuthService } from 'src/app/services/auth.service';

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
    private router:Router

  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  onLogin(form: NgForm) {

    if (form.valid) {
      this.authService.login(this.login).subscribe(
        (response) => {
          if (response.success) {
            // Token ve expiration bilgilerini sakla
            this.storage.set('token', response.data.token);
            this.storage.set('expiration', response.data.expiration);
            this.storage.set('loggedIn', true)
            this.authService.setUser(this.login.email)
            this.router.navigate(['/'])
            window.dispatchEvent(new Event('user:login'));

            // Giriş başarılı olduğunda yapılacak işlemler
            console.log('Giriş başarılı!');
          } else {
            console.log('Giriş başarısız:', response.message);
          }
        },
        (error) => {
          console.log('Hata:', error);
        }
      );
    }
  }
  

  onSignup() {
    // Kayıt ol sayfasına yönlendirme veya işlemler
  }
}