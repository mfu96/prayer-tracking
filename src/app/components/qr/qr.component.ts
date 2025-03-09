import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

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
    private platform: Platform
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
      const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!available) {
        console.log('Google Barcode Scanner Modülü yüklü değil. Yükleniyor...');
        await BarcodeScanner.installGoogleBarcodeScannerModule();
        console.log('Modül yüklendi.');
      }
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
    const prayerData = {
      prayerName: '',
      mosqueId: mosqueId,
      companyId: companyId,
      deviceId: 3,
    };
    this.router.navigate(['/prayer-add'], { state: { prayerData } });
  }
}