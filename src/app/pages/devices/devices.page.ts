import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DeviceInformationService } from 'src/app/services/device-information.service';
import { DeviceService } from 'src/app/services/device.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
  standalone:false
})
export class DevicesPage implements OnInit {
  devices: any[] = [];
  deviceGroups: any[] = [];
  currentDeviceUniqId: string = '';

  isExistDevice=false

  constructor(
    private deviceService: DeviceService,
    private deviceInfoService: DeviceInformationService,
    private toastService: ToastService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.getDevices();
    this.loadCurrentDeviceId();
  }

  

  async loadCurrentDeviceId() {
    try {
      const device = await this.deviceInfoService.gatherRealDeviceInfo();
      this.currentDeviceUniqId = device.deviceUniqId;
      console.log('Mevcut cihaz id:', this.currentDeviceUniqId);
    } catch (error) {
      console.error('Cihaz id yüklenemedi:', error);
    }
  }

  // Servisten cihazları çekerek önce sıralıyor, ardından gruplayarak deviceGroups içerisine atıyoruz.
  getDevices() {
    this.deviceService.getEmployeeDevices().subscribe((response) => {
      this.devices = response.data.sort((a, b) =>
        new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
      );

          // Cihazların olup olmadığını kontrol et
    this.isExistDevice = this.devices && this.devices.length > 0;

      console.log('Cihazlar:', this.devices);
      this.updateDeviceGroups();

      const message = response.message ? response.message + ' Listelendi' : 'Cihazlar Listelendi';
      this.toastService.showToastInfo(message);
      console.log(response);
    });
  }

  // Kayıt tarihine göre gruplayacak metod (format dd.MM.yyyy)
  updateDeviceGroups() {
    // Gruplama
    const grouped = this.devices.reduce((groups: any, device) => {
      const date = this.formatDate(new Date(device.registrationDate));
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(device);
      return groups;
    }, {});

    // Grupları tarihe göre (yeni en üstte) sıralıyoruz
    this.deviceGroups = Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(this.parseDate(a));
        const dateB = new Date(this.parseDate(b));
        return dateB.getTime() - dateA.getTime();
      })
      .map((date) => {
        return {
          date,
          devices: grouped[date],
        };
      });
  }

  // Tarih formatlama (dd.MM.yyyy)
  formatDate(date: Date): string {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    return date.toLocaleDateString('tr-TR', options);
  }

  // dd.MM.yyyy formatındaki tarihi Date objesine çevirir.
  parseDate(dateString: string): string {
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).toISOString();
  }

  refreshDevices() {
    this.getDevices();
  }

  // Gelen cihazın uniq id'si, mevcut (current) cihazın benzersiz id'si ile eşleşiyorsa "Bu Cihaz" gösterilir.
  isCurrentDevice(deviceUniqId: string): boolean {
    return deviceUniqId === this.currentDeviceUniqId;
  }

  // Silme işleminden önce onay alır.
  async confirmDelete(device: any) {
    const alert = await this.alertCtrl.create({
      header: 'Cihaz Sil',
      message: 'Cihazı silmek istediğinize emin misiniz?',
      buttons: [
        { text: 'İptal', role: 'cancel' },
        { text: 'Sil', handler: () => this.deleteDevice(device) },
      ],
    });
    await alert.present();
  }

  // İlgili cihazı siler ve listeyi günceller.
 


  //buraya ture olanı silme koşulu eklenecek

  // deleteDevice(deviceId:number){
  //   this.deviceService.deleteDevice(deviceId).subscribe((response) => {
  //     this.toastService.showToast(response.message);
  //     this.devices = this.devices.filter((d) => d.deviceId !== deviceId);
  //     this.updateDeviceGroups();
  //     this.refreshDevices();
  //   });
  // }


    // İlgili cihazı siler ve listeyi günceller.
    deleteDevice(device: any) {
      // Ek güvenlik kontrolü: Eğer cihazın status değeri true ise,
      // herhangi bir silme işlemi gerçekleştirmiyoruz.
      if (device.status) {
        this.toastService.showToastWarning('Aktif cihazı silmek için bağlı bulunduğunuz birime başvurunuz.');
        return;
      }
      console.log('Silinen cihaz:', device.deviceId);
  
      this.deviceService.deleteDevice(device.deviceId).subscribe((response) => {
        this.toastService.showToastSuccess(response.message);
        //console.log(response.message);

        // Listeden silinen cihazı çıkarıyoruz.
       // console.log('Silinen cihaz:', device.deviceId);
        this.devices = this.devices.filter((d) => d.deviceId !== device.deviceId);
        //console.log('Kalan cihazlar:', this.devices);
        this.updateDeviceGroups();
        //this.refreshDevices();
      });
    }


}