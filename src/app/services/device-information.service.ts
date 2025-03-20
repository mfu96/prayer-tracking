
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
   * Gerçek cihaz bilgilerini alır.
   */
  async gatherRealDeviceInfo(): Promise<Device> {
    try {
      // 1. Cihazın benzersiz kimliğini alıyoruz.
      const { identifier } = await CapacitorDevice.getId();
      // 2. Cihazın diğer bilgilerini alıyoruz.
      const info = await CapacitorDevice.getInfo();

      // 3. Backend’e uygun Device objesini oluşturuyoruz.
      const device: Device = {
        deviceId: 0,         // Backend oluşturacak veya uygun değer atanabilir.
        employeeId: 0,       // Uygulamanıza göre düzenleyin.
        deviceUniqId: identifier,
        deviceName: info.model,
        platform: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        lastContactDate: new Date(),
        registrationDate: new Date(),
        status: true
      };

      console.log('Toplanan Cihaz Bilgileri:', device);
      return device;
    } catch (error) {
      console.error('Cihaz bilgisi alınırken hata:', error);
      throw error;
    }
  }

  /**
   * Gerçek cihaz bilgilerini alır ve ardından backend’e gönderir.
   */
  async addDevice(): Promise<void> {
    try {
      const device = await this.gatherRealDeviceInfo();
      this.deviceService.addDevice(device).subscribe(
        (response) => {
          if (response.success) {
            console.log('Cihaz başarıyla eklendi:', response.data);
          } else {
            console.error('Cihaz ekleme hatası:', response.message);
          }
        },
        (error) => {
          console.error('HTTP Hatası:', error);
        }
      );
    } catch (error) {
      console.error('Cihaz eklenirken hata oluştu:', error);
    }
  }
}
