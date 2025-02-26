import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/entities/user';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { LoginModel } from '../interfaces/entities/loginModel';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';
import { TokenModel } from '../interfaces/tokenModel';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl =environment.apiUrl;
  user: User;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private userService:UserService
    
  ){
    this.init();
  }

  // Ionic Storage'ı başlatıyoruz
  async init() {
    await this.storage.create();
  }


  login(loginModel: LoginModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(
      this.apiUrl + 'auth/login',
      loginModel
    );
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get('token');
    const expiration = await this.storage.get('expiration');

    if (token && expiration) {
      const now = new Date().getTime();
      const exp = new Date(expiration).getTime();
      return now < exp;
    } else {
      return false && this.logout;
    }
  }

  async logout() {
    await this.storage.remove('token');
    await this.storage.remove('expiration');
    await this.storage.remove('loggedIn');
    await this.storage.remove('fullName');
    await this.storage.remove('email');
    await this.storage.remove('userId');


    window.dispatchEvent(new Event('user:logout'));
  }

  // auth.service.ts
setUser(email: string) {
  //console.log('setUser çağırıldı, email:', email);
  this.userService.getByEmail(email).subscribe(
    (response) => {
      if (response && response.data) {
        this.user = response.data;
       //console.info(this.user);
        this.storage.set("fullName", `${this.user.firstName} ${this.user.lastName}`);
        this.storage.set("email", this.user.email);
        this.storage.set("userId", this.user.userId); // Kullanıcı ID'sini saklıyoruz
      } else {
        console.error('Kullanıcı verisi alınamadı.');
        
      }
    },
    (error) => {
      console.error('getByEmail hatası:', error);
    }
  );
}

  



  setUser_eski(email: string) {
    this.userService.getByEmail(email).pipe(
      tap(response => {
        this.user = response.data;
        console.info(this.user);
      }),
      // Kullanıcı bilgilerini depolamak için switchMap kullanıyoruz
      switchMap(() => from(this.storage.set('fullName', `${this.user.firstName} ${this.user.lastName}`))),
      switchMap(() => from(this.storage.set('email', this.user.email)))
    ).subscribe({
      next: () => {
        // İşlemler tamamlandığında sayfayı yenileyebiliriz
        window.location.reload();
      },
      error: (error) => {
        console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);
        // Hata yönetimi yapabilirsiniz
      }
    });
  }

  async isAuthenticated_Eski(): Promise<boolean> {
    const token = await this.storage.get('token');
    if (token) {
      return await this.checkTokenExpiration();
    } else {
      return false;
    }
  }
  
  async checkTokenExpiration(): Promise<boolean> {
    const expiration = await this.storage.get('expiration');
    if (expiration) {
      const now = new Date().getTime();
      const expirationDate = new Date(expiration).getTime();
      return now < expirationDate;
    }
    return false;
  }
  


  async getUserName(): Promise<string> {
    const fullName = await this.storage.get('fullName');
    return fullName || '';
  }
  
}
