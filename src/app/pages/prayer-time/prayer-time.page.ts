import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config, Platform } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { Mosque } from '../../interfaces/entities/mosque';
import { MosqueService } from '../../services/mosque.service';
import { PrayerTimeDetailDto } from '../../interfaces/entities/prayerTimeDetailDto';
import { PrayerTimeService } from 'src/app/services/prayer-time.service';
import { LocationService } from 'src/app/services/location.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-prayer-time',
  templateUrl: './prayer-time.page.html',
  styleUrls: ['./prayer-time.page.scss'],
  standalone:false
})
export class PrayerTimePage implements OnInit {

  ios: boolean=false;
 // dayIndex = 0;
  queryText = '';
  segment = 'today';
  //excludeTracks: any = [];
 // shownSessions: any = [];
 // groups: any = [];
 // confDate: string;
 // showSearchbar: boolean;

 showSearchbar = false

  prayerDetails: PrayerTimeDetailDto[] = [];
    prayerGroups: any[] = [];


  mosques: Mosque[]=[];

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config,

    private mosqueService:MosqueService,

    private prayerService:PrayerTimeService,
    private platform: Platform,
    private toastController: ToastController,

    private locationService: LocationService, // Konum servisi
    private toastService: ToastService, // Toast servisi
    private loadingService: LoadingService // Loading servisi
  ) { }

  ngOnInit() {
    this.getPrayerUserDetail();
    this.ios = this.platform.is('ios');

  this.loadingService.hideLoading;
    
  }



ionViewWillEnter() {
  // Sayfa her göründüğünde namaz vakitlerini güncelle
  this.getPrayerUserDetail();
  //this.getPrayerDetails();
}

getPrayerUserDetail(){
  this.prayerService.getPrayerByUserDetail().subscribe((response) => {
    this.prayerDetails=response.data
    this.toastService.showToast(response.message)
    console.log(response.message)
    console.log(response)
    this.updatePrayerGroups();
  });
}




  getPrayerDetails() {
    this.prayerService.getPrayerDetails().subscribe((response) => {
      this.prayerDetails = response.data;
      this.toastService.showToast(response.message+ "Vakitler Listelendi")
      console.log(response)
      this.updatePrayerGroups();
    });
  }

  updatePrayerGroups() {
    // Arama metnine göre filtreleme
    const filteredPrayers = this.prayerDetails.filter((prayer) => {
      return (
        prayer.prayerName.toLowerCase().includes(this.queryText.toLowerCase()) ||
        prayer.firstName.toLowerCase().includes(this.queryText.toLowerCase()) ||
        prayer.lastName.toLowerCase().includes(this.queryText.toLowerCase()) ||
        prayer.mosqueName.toLowerCase().includes(this.queryText.toLowerCase()) ||
        prayer.companyName.toLowerCase().includes(this.queryText.toLowerCase())
      );
    });

    // Segment'e göre filtreleme
    let segmentedPrayers = filteredPrayers;

    if (this.segment === 'today') {
      // Bugünün namazları
      const today = new Date();
      segmentedPrayers = filteredPrayers.filter((prayer) => {
        const prayerDate = new Date(prayer.qrScanDate);
        return (
          prayerDate.getDate() === today.getDate() &&
          prayerDate.getMonth() === today.getMonth() &&
          prayerDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (this.segment === 'all') {
      // Tüm namazlar (filtreleme yapılmaz)
      segmentedPrayers = filteredPrayers;
    }

    // Tarihe göre gruplama
    const grouped = segmentedPrayers.reduce((groups:any, prayer) => {
      const date = this.formatDate(prayer.qrScanDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(prayer);
      return groups;
    }, {});

    // Grupları diziye dönüştürme ve tarihe göre sıralama (Yeni tarihler en üstte)
    this.prayerGroups = Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(this.parseDate(a));
        const dateB = new Date(this.parseDate(b));
        return dateB.getTime() - dateA.getTime();
      })
      .map((date) => {
        return {
          date,
          prayers: grouped[date],
        };
      });
  }

  // Arama girişi değiştiğinde çağrılır
  updateSchedule() {
    this.updatePrayerGroups();
  }

  // Arama çubuğunu göster/gizle
  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
    if (!this.showSearchbar) {
      this.queryText = '';
      this.updatePrayerGroups();
    }
  }

  // Tarihi formatlama fonksiyonu
  formatDate(dateInput: Date): string {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    return new Date(dateInput).toLocaleDateString('tr-TR', options);
  }

  // Tarih stringini Date objesine çeviren fonksiyon
  parseDate(dateString: string): string {
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).toISOString();
  }

  // Saati formatlama fonksiyonu
  formatTime(dateInput: Date): string {
    const options = { hour: '2-digit', minute: '2-digit' } as const;
    return new Date(dateInput).toLocaleTimeString('tr-TR', options);
  }

  // Namaz detay sayfasına yönlendirme fonksiyonu
  goToPrayerDetail(prayer: PrayerTimeDetailDto) {
    // Detay sayfasına yönlendirme kodu
    // this.router.navigate(['/prayer/detail', prayer.prayerId]);   //buraya gerek yok htmlden yönelinoyr
  }

  // Filtreleme modalini gösterme (eğer varsa)
  presentFilter() {
    // Filtre modalini açma kodu (eğer kullanıyorsanız)
  }

  // Diğer fonksiyonlar (addFavorite, removeFavorite, openSocial, vb.) burada olabilir


  // async showToast(message: string) {
  //   const toast = document.createElement('ion-toast');
  //   toast.message = message;
  //   toast.duration = 2000;
  //   toast.position = 'middle'; // 'top', 'middle' veya 'bottom'
  //   document.body.appendChild(toast);
  //   await toast.present();
  // }

  // QR tarama butonuna basıldığında çalışır
  async goToQrScanner() {
    const isLocationEnabled = await this.locationService.isLocationServiceEnabled(); // Konum servisini kontrol eder
    if (isLocationEnabled) {
      this.router.navigate(['/qr']); // Konum açıksa QR sayfasına gider
    } else {
      this.toastService.showToast('Konum servisi kapalı. Lütfen açın.'); // Kapalıysa uyarı gösterir
    }
  }
}