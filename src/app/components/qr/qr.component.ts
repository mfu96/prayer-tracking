import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { DeviceInformationService } from 'src/app/services/device-information.service';
import { DeviceService } from 'src/app/services/device.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent implements OnInit, OnDestroy {
  scanning = false;

  constructor(
    private router: Router,
    private locationService: LocationService,
    private platform: Platform,
    private deviceService: DeviceService,
    private toastService: ToastService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.locationService.startTracking(); // Konum izlemeyi başlat
    this.checkPermissionsAndScan();
  }

  ngOnDestroy() {
    this.locationService.stopTracking();
  }

  async checkPermissionsAndScan() {
    await this.checkPermissions();
    this.scan();
  }

  async checkPermissions() {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== 'granted') {
      console.error('Kamera izni verilmedi.');
    }
  }
  
async scan() {
    this.scanning = true;
    try {
      // Yalnızca Android için modül kontrolü ve yükleme işlemleri yapılacak
      if (this.platform.is('android')) {
        const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
        if (!available) {
          console.log('Google Barcode Scanner Modülü yüklü değil. Yükleniyor...');
          this.toastService.showToastInfo('Barkod tarayıcı modülü yükleniyor...');
          await BarcodeScanner.installGoogleBarcodeScannerModule();
          console.log('Modül yüklendi.');

           //window.location.href = '/qr';

        }
      }
          // iOS için yukarıdaki kontrol atlanır
      document.body.classList.add('barcode-scanner-active');
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });
      if (barcodes.length > 0) {
        const scannedData = barcodes[0].rawValue;
        console.log('Taranan barkod içeriği:', scannedData);
        this.processScannedData(scannedData);
      }
    } catch (error) {
      console.error('Tarama hatası:', error);
    } finally {
      document.body.classList.remove('barcode-scanner-active');
      this.scanning = false;
    }
  }

 

  processScannedData(scannedData: string) {
    const dataParts = scannedData.split(',');
    if (dataParts.length < 4) {
      console.log('Geçersiz QR kodu');
      return;
    }
    const qrId = parseInt(dataParts[0], 10);
    const mosqueId = parseInt(dataParts[1], 10);
    const companyId = parseInt(dataParts[2], 10);
    const generatedDate = dataParts[3];
    console.log(`QR ID: ${qrId}, Cami ID: ${mosqueId}, Şirket ID: ${companyId}, Oluşturma Tarihi: ${generatedDate}`);


 // Storage'e mosqueId bilgisini kaydediyoruz (indeks notasyonu ile).
 this.storage['set']('mosqueId', mosqueId)
 .then(() => {
   console.log('Mosque ID storage\'a kaydedildi:', mosqueId);
 })
 .catch((error: any) => {
   console.error('Mosque ID storage\'a kayıt hatası:', error);
 });

    // Device id bilgisini cihaz servisten alıyoruz.
  this.deviceService.getEmployeeDevices().subscribe(
    response => {
      if (response && response.data && response.data.length > 0) {
        // Cihaz listesinin ilk elemanını kullanıyoruz. (Modelinize göre "id" veya "deviceId" olabilir)
        const device = response.data[0];
        const deviceId =  device.deviceId; 

        const prayerData = {
          prayerName: '',
          mosqueId: mosqueId,
          companyId: companyId,
          deviceId: deviceId
        };

        // Cihaz bilgisini aldıktan sonra yönlendirme işlemini gerçekleştirin.
        this.router.navigate(['/prayer-add'], { state: { prayerData } });
      } else {
        console.log('Çalışana ait cihaz bulunamadı');
        // İsteğe bağlı: Hata durumunda bir default değer atayabilir veya kullanıcıya uyarı verebilirsiniz.
      }
    },
    error => {
      console.error('Cihaz bilgileri alınırken hata oluştu:', error);
      // Gerekirse kullanıcıya hata mesajı gösterebilir veya alternatif bir işlem uygulayabilirsiniz.
    }
  );
}
}