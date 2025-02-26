import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Position } from '@capacitor/geolocation';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { PrayerTimeService } from 'src/app/services/prayer-time.service';

@Component({
  selector: 'app-prayer-add',
  templateUrl: './prayer-add.component.html',
  imports: [
     CommonModule,
     IonicModule // IonicModule'ü buraya ekliyoruz
   ],
  styleUrls: ['./prayer-add.component.scss'],
  
})
export class PrayerAddComponent implements OnInit, OnDestroy {
  prayerData: any;

  // Konum aboneliği için değişken
  locationSubscription: Subscription;
  // Mevcut konum doğruluğu
  currentAccuracy: number | null = null;
  // Konum durumu mesajı
  locationStatus: string = '';
  // Gönderim izin durumu
  canSubmit: boolean = false;

  constructor(
  private router: Router,
  private prayerService: PrayerTimeService,
  private locationService: LocationService
) {
    const navigation = this.router.getCurrentNavigation();
    this.prayerData = navigation?.extras.state?.['prayerData'];
  }

  ngOnInit() {
    if (this.prayerData) {
      // Namaz vaktini seçme işlemi
      this.selectPrayerName();
      // Konum değişikliklerine abone ol
      this.subscribeToLocation();
    } else {
      console.error('Namaz verisi alınamadı.');
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    // Aboneliği ve izlemeyi durdur
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    this.locationService.stopTracking();
  }

  subscribeToLocation() {
    this.locationSubscription = this.locationService.location$.subscribe(
      (position: Position | null) => {
        if (position) {
          const coords = position.coords;
          this.currentAccuracy = coords.accuracy;
          this.locationStatus = `Konum doğruluğu: ${this.currentAccuracy.toFixed(2)} metre`;

          console.log('Güncel konum:', coords);

          this.canSubmit = this.currentAccuracy <= 50;
        }
      },
      error => {
        this.locationStatus = 'Konum izni verilmedi.';
        this.canSubmit = false;
      }
    );
  }

  async selectPrayerName() {
    // Namaz vakitleri listesini tanımla
    const prayerNames = ['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı', 'Diğer'];

    // Kullanıcıya namaz vaktini seçmesi için bir alert göster
    const alert = document.createElement('ion-alert');
    alert.header = 'Lütfen Namaz Vaktini Seçiniz';
    alert.inputs = prayerNames.map(name => ({
      name,
      type: 'radio',
      label: name,
      value: name
    }));
    alert.buttons = [
      {
        text: 'İptal',
        role: 'cancel',
        handler: () => {
          this.router.navigate(['/']);
        }
      },
      {
        text: 'Tamam',
        handler: (data) => {
          this.prayerData.prayerName = data;
          this.addPrayerTime();
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  addPrayerTime() {

    if (!this.canSubmit) {
      this.showToast('Konum doğruluğu yeterli değil.');
      return;
    }

    // Konum verisini alın
    const position = this.locationService.getCurrentLocation();
    if (position) {
      this.prayerData.currentLatitude = position.coords.latitude;
      this.prayerData.currentLongitude = position.coords.longitude;
    } else {
      this.showToast('Konum verisi alınamadı.');
      return;
    }

    // POST isteği ile namaz vaktini ekle
    this.prayerService.addPrayerTime(this.prayerData).subscribe(
      response => {
        console.log('Vakit eklendi:', response);
        // İsteğe bağlı olarak bir toast bildirimi göster
        this.showToast( response.message);
        // Anasayfaya yönlendir
        this.router.navigate(['/tabs/prayer-time']);  //buraya ayet hadise yönlendircek bir şey yap ki vakit detalyarı yüklenebilsin

         // Konum izlemeyi durdur
         this.locationService.stopTracking();
      },
      error => {
        console.error('Namaz vakti eklenirken hata oluştu:', error.message);
        this.showToast('Namaz vakti eklenirken bir hata oluştu.');
      }
    );
  }

  async showToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    document.body.appendChild(toast);
    await toast.present();
  }
}