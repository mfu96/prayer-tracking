import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Image } from 'src/app/interfaces/entities/Image';
import { MosqueDetailDto } from 'src/app/interfaces/entities/mosqueDetailDto';
import { ImageService } from 'src/app/services/image.service';
import { MosqueService } from 'src/app/services/mosque.service';
import { ToastService } from 'src/app/services/toast.service';

// Swiper.js elementlerini register etmek için
import { register } from 'swiper/element/bundle';
import { IonContent } from "@ionic/angular/standalone";
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

// Swiper.js için register fonksiyonunu çağırın.
// Bu, <swiper-container> ve <swiper-slide> elementlerinin kullanılabilir olmasını sağlar.
register();

@Component({
  selector: 'app-mosque',
  templateUrl: './mosque.page.html',
  styleUrls: ['./mosque.page.scss'],
   standalone:false
})
export class MosquePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer?: ElementRef; // Swiper container'a erişim için

  mosqueId: string | null = null;
  mosqueDetails: MosqueDetailDto[] = [];
  mosqueImages: Image[] = [];
  initialDataLoaded = false;
  imageBaseUrl = environment.baseUrl;
  
  selectedStaffMember: MosqueDetailDto | null = null; // Seçili görevliyi tutacak değişken
  compareStaffMembers:any
  

  // Swiper ayarları doğrudan HTML'e taşınabilir veya burada tutulup HTML'de bind edilebilir.
  // Swiper'ın web component'leri için parametreler kebab-case olarak HTML'de verilir.
  swiperParams = {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { // Pagination (gösterge noktaları)
      clickable: true,
    },
    // İsterseniz navigation butonlarını da ekleyebilirsiniz:
    // navigation: true,
  };

  private routeSub: Subscription | undefined;
  private mosqueDetailSub: Subscription | undefined;
  private imageSub: Subscription | undefined;

  constructor(
    private mosqueService: MosqueService,
    private toastService: ToastService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private platform:Platform
  ) {}

  ngOnInit() {
    this.loadInitialMosqueId();
  }

  ngAfterViewInit() {
    // Swiper ayarlarını JavaScript üzerinden yapmak isterseniz:
    if (this.swiperContainer) {
      const swiperEl = this.swiperContainer.nativeElement;
      Object.assign(swiperEl, this.swiperParams);
      // swiperEl.initialize(); // Gerekirse initialize çağrılabilir, genellikle otomatik olur.
    }
  }

  ionViewWillEnter() {
    console.log('MosquePage ionViewWillEnter');
    this.initialDataLoaded = false;

    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      const idFromRoute = params['mosqueId'];
      if (idFromRoute) {
        this.mosqueId = idFromRoute;
        this.loadMosqueData(Number(idFromRoute));
      } else {
        this.getMosqueIdFromStorage().then(storedId => {
          if (storedId) {
            this.mosqueId = storedId;
            this.loadMosqueData(Number(storedId));
          } else {
            this.toastService.showToastWarning('Konum ID bulunamadı. Lütfen tekrar deneyin.');
            this.initialDataLoaded = true;
          }
        });
      }
    });
  }

  ionViewWillLeave() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.mosqueDetailSub) this.mosqueDetailSub.unsubscribe();
    if (this.imageSub) this.imageSub.unsubscribe();
  }

  ngOnDestroy() {
    this.ionViewWillLeave();
  }

  async loadInitialMosqueId() {
    const id = await this.getMosqueIdFromStorage();
    if (id && !this.activatedRoute.snapshot.params['mosqueId']) {
      this.mosqueId = id;
    }
  }

  async getMosqueIdFromStorage(): Promise<string | null> {
    try {
      const id = await this.mosqueService.getMosqueid();
      return id;
    } catch (error) {
      console.error('Error getting mosque ID from storage:', error);
      return null;
    }
  }

  loadMosqueData(id: number) {
    if (!id) {
      this.toastService.showToastWarning('Geçersiz Konum ID.');
      this.initialDataLoaded = true;
      return;
    }
    this.mosqueDetails = [];
    this.mosqueImages = [];

    this.getMosqueDetail(id);
    this.getImagesByMosqueId(id);
  }

 getMosqueDetail(mosqueId: number) {
    this.mosqueDetailSub = this.mosqueService.getMosqueByDetail(mosqueId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.mosqueDetails = response.data;
           this.initialDataLoaded = true;
          if (this.mosqueDetails.length > 0) {
            // Görevli listesi varsa, ilk görevliyi varsayılan olarak seçili yap
            this.selectedStaffMember = this.mosqueDetails[0]; 
          } else {
            this.selectedStaffMember = null; // Görevli yoksa seçimi temizle
          }
        } else {
          this.toastService.showToastWarning(response.message || 'Cami detayları alınamadı.');
          this.mosqueDetails = [];
          this.selectedStaffMember = null;
        }
        this.checkIfAllDataLoaded();
      },
      error: (err) => {
        // ... (mevcut hata yönetimi) ...
        this.mosqueDetails = [];
        this.selectedStaffMember = null;
        this.checkIfAllDataLoaded();
      }
    });
  }

   // Görevli seçimi değiştiğinde çağrılacak fonksiyon
  handleStaffSelectionChange(event: any) {
    // event.detail.value doğrudan seçilen MosqueDetailDto objesini içerecek
    // çünkü ion-select-option'da [value]="staff" kullandık.
    this.selectedStaffMember = event.detail.value;
    console.log('Seçilen Görevli:', this.selectedStaffMember);
  }

  getImagesByMosqueId(mosqueId: number) {
    this.imageSub = this.imageService.getImageByMosqueId(mosqueId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.mosqueImages = response.data;
           // Resimler yüklendikten sonra swiper'ı güncellemek gerekebilir.
           // Özellikle loop: true kullanılıyorsa ve resim sayısı azsa veya dinamik ekleniyorsa.
           setTimeout(() => { // DOM güncellemesinden sonra çalışması için setTimeout
            if (this.swiperContainer?.nativeElement?.swiper) {
              this.swiperContainer.nativeElement.swiper.update();
            }
          }, 0);
        } else {
          this.mosqueImages = [];
        }
        this.checkIfAllDataLoaded();
      },
      error: (err) => {
        console.error('Error fetching mosque images:', err);
        this.mosqueImages = [];
        this.checkIfAllDataLoaded();
      }
    });
  }

  private dataLoadStatus = { detailsLoaded: false, imagesLoaded: false };

  private checkIfAllDataLoaded() {
    // Bu fonksiyon, her iki subscribe bloğunun callback'inde (next/error) çağrılır.
    // Bir API çağrısı tamamlandığında ilgili bayrağı true yapar.
    // API çağrısının mosqueDetails veya mosqueImages'i set edip etmediğine göre değil,
    // çağrının tamamlanıp tamamlanmadığına göre kontrol etmek daha doğru olabilir.
    // Şimdilik, her iki array'in de bir değere (boş array dahil) sahip olup olmadığına bakalım.

    if (this.mosqueDetailSub?.closed) { // Veya this.mosqueDetails atanmış mı kontrolü
        this.dataLoadStatus.detailsLoaded = true;
    }
    if (this.imageSub?.closed) { // Veya this.mosqueImages atanmış mı kontrolü
        this.dataLoadStatus.imagesLoaded = true;
    }

    if (this.dataLoadStatus.detailsLoaded && this.dataLoadStatus.imagesLoaded) {
        this.initialDataLoaded = true;
        // Reset for next refresh
        this.dataLoadStatus.detailsLoaded = false;
        this.dataLoadStatus.imagesLoaded = false;
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/placeholder.png';
    }
    const correctedPath = imagePath.replace(/\\/g, '/');
    const pathWithSlash = correctedPath.startsWith('/') ? correctedPath : `/${correctedPath}`;
    return this.imageBaseUrl + pathWithSlash;
  }

  async refresh() {
    this.toastService.showToastInfo('Veriler yenileniyor...');
    this.initialDataLoaded = false;
    this.dataLoadStatus.detailsLoaded = false; // Reset status for new load
    this.dataLoadStatus.imagesLoaded = false;  // Reset status for new load

    const id = this.mosqueId || await this.getMosqueIdFromStorage();
    if (id) {
      this.mosqueId = id;
      this.loadMosqueData(Number(id));
    } else {
      this.toastService.showToastWarning('Yenilemek için Konum ID bulunamadı.');
      this.initialDataLoaded = true;
    }
  }

    onSlideChange() {
    if (this.swiperContainer?.nativeElement?.swiper) {
      const swiperInstance = this.swiperContainer.nativeElement.swiper;
      console.log('Slide değişti! Aktif index:', swiperInstance.activeIndex);
      // Burada slide değiştiğinde yapmak istediğiniz işlemleri ekleyebilirsiniz.
    }
  }

    // Haritayı açma fonksiyonu
  async openMaps() {
    if (this.mosqueDetails.length === 0) return;

    const lat = this.mosqueDetails[0].mosqueLatitude;
    const lng = this.mosqueDetails[0].mosqueLongitude;
    
    if (this.platform.is('android')) {
      window.open(`geo:${lat},${lng}?q=${lat},${lng}`);
    } else if (this.platform.is('ios')) {
      window.open(`maps://?q=${lat},${lng}`);
    } else {
      // Desktop için Google Maps
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    }
  }


  async callPhoneNumber() {
    if (this.selectedStaffMember && this.selectedStaffMember.contact) {
      const phoneNumber = this.selectedStaffMember.contact.trim();
      if (phoneNumber) { // Numaranın boş olmadığından emin olalım
        // Telefon numarasındaki olası boşlukları, parantezleri veya tireleri temizlemek isteyebilirsiniz.
        // Çoğu modern telefon bunu otomatik yapar ama garanti olması için:
        // const cleanPhoneNumber = phoneNumber.replace(/\s|-|\(|\)/g, '');
        // window.open(`tel:${cleanPhoneNumber}`);
        window.open(`tel:${phoneNumber}`);
        console.log(`Arama yapılıyor: ${phoneNumber}`);
      } else {
        console.warn('Telefon numarası boş.');
        // İsteğe bağlı: kullanıcıya bir uyarı gösterin (örn: ToastController)
      }
    } else {
      console.warn('Seçili personel veya iletişim bilgisi bulunamadı.');
      // İsteğe bağlı: kullanıcıya bir uyarı gösterin
    }
  }

}