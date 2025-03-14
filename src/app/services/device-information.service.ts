// device-information.service.ts

import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceInformationService {
  constructor() {}

  /**
   * Cihazın benzersiz kimliği (uuid) ve model bilgisini alır,
   * ardından konsola yazdırır.
   */
  async logDeviceInfo(): Promise<void> {
    try {
      // Cihazın benzersiz kimliğini alıyoruz
      const { identifier } = await Device.getId();
      
      // Cihazın diğer bilgilerini alıyoruz
      const info = await Device.getInfo();

      // Konsola yazdırma
      console.log('Cihaz Benzersiz Kimliği:', identifier);
      console.log('Cihaz Modeli:', info.model);
      // İsterseniz diğer bilgiler de:
       console.log('İşletim Sistemi:', info.operatingSystem);
       console.log('OS Versiyonu:', info.osVersion);
       console.log('Üretici:', info.manufacturer);
     console.log('Sanal mı?:', info.isVirtual);
      
    } catch (error) {
      console.error('Cihaz bilgileri alınırken hata:', error);
    }
  }
}
