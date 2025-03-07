import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';



@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  imports: [
    CommonModule,
    IonicModule // IonicModule'ü buraya ekliyoruz
    
  ],
  styleUrls: ['./qr.component.scss'],
})


export class QrComponent implements OnInit, OnDestroy {


  scanning = false; // Spinner'ın görünürlüğünü kontrol eden bayrak
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  
  constructor(
    private router: Router,
    private locationService: LocationService,
    private platform: Platform
  ) {}

  ngOnInit() {
        // Konum izlemeyi başlat
    this.locationService.startTracking();

        // Platform hazır olduğunda izin iste

        this.platform.ready().then(() => {
          this.checkPermissionsAndScan(); // Platform hazır olduğunda izin kontrolü ve tarama başlatılır
        });
      }

  ngOnDestroy() {
    this.locationService.stopTracking();
  }

  async checkPermissionsAndScan() {
    await this.checkPermissions(); // İzinler taramadan önce kontrol edilir
    this.scan(); // Tarama başlatılır
  }

  async requestCameraPermission() {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== 'granted') {
      console.error('Kamera izni reddedildi.');
      // Gerekirse kullanıcıya bir uyarı gösterin
    }
  }

  async checkPermissions() {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== 'granted') {
      console.error('Kamera izni verilmedi.');
      // Gerekirse kullanıcıya bir uyarı gösterebilirsiniz
    }
  }
async scan() {
    this.scanning = true; // Tarama başladığında spinner gösterilir
    try {
      // Google Barcode Scanner Modülünün yüklü olup olmadığını kontrol et
      const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!available) {
        console.log('Google Barcode Scanner Modülü yüklü değil. Yükleniyor...');
        await BarcodeScanner.installGoogleBarcodeScannerModule();
        console.log('Modül yüklendi.');
      }

      // Tarama işlemini başlat
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
      this.scanning = false; // Tarama bittiğinde spinner gizlenir
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
    const prayerData = {
      prayerName: '',
      mosqueId: mosqueId,
      companyId: companyId,
      deviceId: 3,
    };
    this.router.navigate(['/prayer-add'], { state: { prayerData } });
  }
}