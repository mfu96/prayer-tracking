import { Component } from '@angular/core';
import { DeviceInformationService } from '../services/device-information.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  constructor(private deviceInfoService: DeviceInformationService) {}

  async ngOnInit() {
    // Sayfa yüklendiğinde cihaz bilgilerini al ve konsola yazdır
    await this.deviceInfoService.logDeviceInfo();
  }

}
