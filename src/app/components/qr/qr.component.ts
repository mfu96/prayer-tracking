import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  imports: [
    CommonModule,
    IonicModule, // IonicModule'ü buraya ekliyoruz
    ZXingScannerModule
  ],
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent implements OnInit, OnDestroy {
  scanning = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;

  constructor(
    private router: Router,
    private locationService: LocationService,
    private platform: Platform
  ) { }

  ngOnInit() {
    // Konum izlemeyi başlat
    this.locationService.startTracking();
  
    // Platform hazır olduğunda izin iste
    this.platform.ready().then(() => {
      this.requestCameraPermission();
    });
  }
  
  async requestCameraPermission() {
    const status = await navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        console.log('Kamera izni verildi.');
      })
      .catch((error) => {
        console.error('Kamera izni reddedildi.', error);
        // Uygulamadan çıkabilir veya alternatif bir işlem yapabilirsiniz
      });
  }
  ngOnDestroy() {
    // Konum izlemeyi durdur
    this.locationService.stopTracking();
  }
// Kamera cihazlarını alır ve arka kamerayı seçer
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;

    for (const device of devices) {
      if (/back|rear|environment/gi.test(device.label)) {
        this.currentDevice = device;
        break;
      }
    }

    // Eğer arka kamera bulunmazsa ilk cihazı seç
    if (!this.currentDevice && devices.length > 0) {
      this.currentDevice = devices[0];
    }
  }

  // Tarama başarılı olduğunda çalışır
  onCodeResult(resultString: string) {
    console.log('Taranan barkod içeriği:', resultString);
    this.processScannedData(resultString);
  }

  processScannedData(scannedData: string) {
    // Taranan veriyi parçalara ayır
    const dataParts = scannedData.split(',');

    if (dataParts.length < 4) {
      console.log('Geçersiz QR kodu');
      return;
    }

    // Değişkenleri ata
    const qrId = parseInt(dataParts[0], 10);
    const mosqueId = parseInt(dataParts[1], 10);
    const companyId = parseInt(dataParts[2], 10);
    const generatedDate = dataParts[3]; // Format: dd-MM-yyyy

    // Çıkarılan değerleri logla
    console.log(`QR ID: ${qrId}, Cami ID: ${mosqueId}, Şirket ID: ${companyId}, Oluşturma Tarihi: ${generatedDate}`);

    // Gönderilecek veriyi hazırla
    const prayerData = {
      prayerName: '', // Bunu sonraki adımda ayarlayacağız
      mosqueId: mosqueId,
      companyId: companyId,
      deviceId: 3
    };

    // prayer-add bileşenine yönlendir
    this.router.navigate(['/prayer-add'], { state: { prayerData } });
  }

}