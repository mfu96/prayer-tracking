import { CommonModule } from '@angular/common'; // Angular ortak modüller için
import { Component, OnDestroy, OnInit } from '@angular/core'; // Angular bileşen dekoratörleri
import { Router } from '@angular/router'; // Yönlendirme için
import { Position } from '@capacitor/geolocation'; // Konum tipi için
import { IonicModule } from '@ionic/angular'; // Ionic bileşenleri için
import { Subscription } from 'rxjs'; // Observable abonelikleri için
import { LocationService } from 'src/app/services/location.service'; // Konum servisi
import { PrayerTimeService } from 'src/app/services/prayer-time.service'; // Namaz vakti servisi
import { ToastService } from 'src/app/services/toast.service'; // Toast servisi
import { LoadingService } from 'src/app/services/loading.service'; // Loading servisi

@Component({
  selector: 'app-prayer-add', // Bileşen seçicisi
  templateUrl: './prayer-add.component.html', // HTML şablonu
  imports: [CommonModule, IonicModule], // Kullanılan modüller
  styleUrls: ['./prayer-add.component.scss'], // Stil dosyası
})
export class PrayerAddComponent implements OnInit, OnDestroy {
  prayerData: any; // Namaz verilerini tutar
  locationSubscription: Subscription; // Konum observable'ına abonelik
  currentAccuracy: number | null = null; // Mevcut konum doğruluğu
  locationStatus: string = ''; // Konum durumu mesajı
  canSubmit: boolean = false; // Form gönderilebilir mi?
  private alertInstance: HTMLIonAlertElement | null = null; // Alert örneği

  // Constructor, bağımlılıkları enjekte eder
  constructor(
    private router: Router, // Yönlendirme servisi
    private prayerService: PrayerTimeService, // Namaz vakti servisi
    private locationService: LocationService, // Konum servisi
    private toastService: ToastService, // Toast servisi
    private loadingService: LoadingService // Loading servisi
  ) {
    const navigation = this.router.getCurrentNavigation(); // Mevcut navigasyon bilgisi
    this.prayerData = navigation?.extras.state?.['prayerData']; // Navigasyondan veri alır
  }

  // Bileşen başlatıldığında çalışır
  async ngOnInit() {
    if (this.prayerData) { // Eğer namaz verisi varsa
      await this.locationService.stopTracking(); // Eski konumu siler
      await this.locationService.startTracking(); // Yeni konum izlemeyi başlatır
      this.subscribeToLocation(); // Konum izlemeye başlar
      this.selectPrayerName(); // Namaz seçimi alert'ini açar
    } else {
      console.error('Namaz verisi alınamadı.'); // Veri yoksa hata mesajı
      this.router.navigate(['/']); // Ana sayfaya yönlendirir
    }
  }

  // Bileşen yok edildiğinde çalışır
  ngOnDestroy() {
    if (this.locationSubscription) { // Abonelik varsa
      this.locationSubscription.unsubscribe(); // Aboneliği iptal eder
    }
    this.locationService.stopTracking(); // Konum izlemeyi durdurur
  }

  // Konum değişikliklerini izler ve doğruluğu kontrol eder
  subscribeToLocation() {
    this.locationSubscription = this.locationService.location$.subscribe(
      (position: Position | null) => { // Konum güncellemelerini alır
        if (position) {
          const coords = position.coords; // Koordinat bilgisi
          this.currentAccuracy = coords.accuracy; // Doğruluğu kaydeder
          this.locationStatus = `Konum doğruluğu: ${this.currentAccuracy.toFixed(2)} metre`; // Durum mesajı
          console.log('Güncel konum:', coords); // Konsola yazar
          this.canSubmit = this.currentAccuracy <= 50; // 50 metreden düşükse gönderilebilir
          this.updateAlertMessage(); // Alert mesajını günceller
          if (this.canSubmit) {
            this.loadingService.hideLoading(); // Doğruluk yeterliyse loading'i gizler
          }
        } else {
          this.loadingService.showLoading('Konum bekleniyor...'); // Konum bekleniyorsa loading gösterir
        }

        

      },
      (error) => { // Hata durumunda
        this.locationStatus = 'Konum izni verilmedi.'; // Durum mesajı
        this.canSubmit = false; // Gönderimi engeller
        this.updateAlertMessage(); // Alert mesajını günceller
        this.loadingService.hideLoading(); // Hata varsa loading'i gizler
      }
    );
    

  }

  // Namaz vaktini seçme alert'ini açar
  async selectPrayerName() {
    const prayerNames = ['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı', 'Diğer']; // Namaz seçenekleri
    const alert = document.createElement('ion-alert'); // Yeni bir alert oluşturur
    this.alertInstance = alert; // Alert örneğini kaydeder
    alert.header = 'Lütfen Namaz Vaktini Seçiniz'; // Alert başlığı
    alert.inputs = prayerNames.map((name) => ({ // Namaz seçeneklerini radio button olarak ekler
      name,
      type: 'radio',
      label: name,
      value: name,
    }));

    // Konum durumuna göre başlangıç mesajı
    alert.message = this.canSubmit
      ? `Konum doğruluğu: ${this.currentAccuracy?.toFixed(2)} mt`
      : 'Konum doğruluğu bekleniyor...';

    alert.buttons = [
      {
        text: 'İptal', // İptal butonu
        role: 'cancel',
        handler: () => {
          this.router.navigate(['/']); // Ana sayfaya yönlendirir
        },
      },
      {
        text: 'Tamam', // Onay butonu
        cssClass: this.canSubmit ? '' : 'button-disabled', // Duruma göre stil
        handler: (data) => { // Butona basıldığında
          if (!this.canSubmit) { // Doğruluk yeterli değilse
            this.toastService.showToastWarning(
              `Konum doğruluğunuz ${this.currentAccuracy} mt. Vaktin eklenebilmesi için en az 50 mt olmalı.`
            );
            return false; // Alert kapanmaz
          }
          this.prayerData.prayerName = data; // Seçilen namazı kaydeder
          this.addPrayerTime(); // Namaz vaktini ekler
          return true; // Alert kapanır
        },
      },
    ];

    document.body.appendChild(alert); // Alert'u DOM'a ekler
    await alert.present(); // Alert'u gösterir

    // Alert kapandığında loading'i gizle
  alert.onDidDismiss().then(() => {
    this.loadingService.hideLoading();
  });


    // 3 dakika sonra zaman aşımı
    setTimeout(() => {
      if (this.alertInstance) { // Alert hala açıksa
        this.alertInstance.dismiss(); // Alert'u kapatır
        this.router.navigate(['/']); // QR sayfasına yönlendirir
        this.toastService.showToastWarning('Zaman aşımına uğradı. Lütfen tekrar deneyin.'); // Uyarı gösterir
      }
    }, 180000); // 3 dakika (180 saniye)

    this.updateAlertMessage(); // Alert mesajını günceller
  }

  // Alert mesajını ve buton durumunu günceller
  updateAlertMessage() {
    if (this.alertInstance) { // Alert örneği varsa
      this.alertInstance.message = this.canSubmit
        ? `Konum doğruluğu: ${this.currentAccuracy?.toFixed(2)} mt` // Doğruluk mesajı
        : 'Konum doğruluğu bekleniyor...'; // Bekleme mesajı
      const button = this.alertInstance.querySelector('button:not([role="cancel"])') as HTMLButtonElement;
      if (button) { // Buton bulunursa
        button.disabled = !this.canSubmit; // Duruma göre pasif/aktif yapar
      }
    }
  }

  // Namaz vaktini ekler
  addPrayerTime() {

    const position = this.locationService.getCurrentLocation(); // Mevcut konumu alır
    if (position) { // Konum varsa
      this.prayerData.currentLatitude = position.coords.latitude; // Enlem
      this.prayerData.currentLongitude = position.coords.longitude; // Boylam
    } else {
      this.toastService.showToastWarning('Konum verisi alınamadı.'); // Konum yoksa uyarı
      return;
    }
    // Namaz vaktini servise gönderir
    this.prayerService.addPrayerTime(this.prayerData).subscribe(
      (response) => { // Başarılıysa
        console.log('Vakit eklendi:', response); // Konsola yazar
        this.toastService.showToastSuccess(response.message); // Kullanıcıya mesaj gösterir
        this.loadingService.hideLoading(); // Loading'i gizle
      this.locationService.stopTracking(); // Konum izlemeyi durdur
      if (this.locationSubscription) {
        this.locationSubscription.unsubscribe(); // Aboneliği iptal et
      }
      this.router.navigate(['/tabs/daily-board']); // Yönlendirme yap
    },

      (error) => { // Hata varsa
        console.error('Namaz vakti eklenirken hata oluştu:',    error.error.message); // Konsola yazar
        this.toastService.showToastWarning( 'Namaz vakti eklenirken hata oluştu: ' + error.error.message); // Kullanıcıya uyarı
        this.loadingService.hideLoading(); // Hata durumunda da gizle
         this.router.navigate(['/tabs/daily-board']); // Yönlendirme yap

      }
    );
  }
}