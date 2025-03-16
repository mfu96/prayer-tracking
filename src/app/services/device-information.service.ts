
// device-information.service.ts
import { Injectable } from '@angular/core';
import { Device as CapacitorDevice } from '@capacitor/device';
import { DeviceService } from './device.service';
import { Device } from '../interfaces/entities/device';


@Injectable({
  providedIn: 'root'
})
export class DeviceInformationService {
  constructor(private deviceService: DeviceService) {}

  /**
   * Cihaz bilgilerini alır, eşleştirir ve backend’e gönderir.
   */
  async gatherAndSendDeviceInfo(): Promise<void> {
    try {
      // 1. Cihazın benzersiz kimliğini alıyoruz.
      const { identifier } = await CapacitorDevice.getId();
      
      // 2. Cihaz bilgilerini alıyoruz.
      const info = await CapacitorDevice.getInfo();

      // 3. Backend’e uygun Device objesini oluşturuyoruz.
      const device: Device = {
        deviceId: 0, // Backend oluşturacak ya da sabit bir değer atayabilirsiniz.
        employeeId: 0, // İhtiyacınıza göre doldurun.
        deviceUniqId: identifier,
        deviceName: info.model,
        platform: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        
        lastContactDate: new Date(),        // Örnek olarak mevcut tarih
        registarationDate: new Date(),        // Örnek olarak kayıt tarihini de şimdiden atıyoruz
        status: true                         // Varsayılan olarak aktif
      };

      // Bilgileri konsola yazdırma (debug amaçlı)
      console.log('Gönderilecek Cihaz Bilgileri:', device);

      // 4. DeviceService üzerinden backend’e POST çağrısı yapıyoruz.
      this.deviceService.addDevice(device).subscribe(
        response => {
          if (response.success) {
            console.log('Cihaz başarıyla eklendi:', response.data);
          } else {
            console.error('Cihaz ekleme hatası:', response.message);
          }
        },
        error => {
          console.error('HTTP Hatası:', error);
        }
      );

    } catch (error) {
      console.error('Cihaz bilgileri alınırken hata:', error);
    }
  }
}
