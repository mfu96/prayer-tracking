import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  deviceGroups: { date: string; devices: any[] }[] = [];
  // DB ile eşleşecek cihazın uniq id değeri (örnek olarak burada bir değer belirttik)
  currentDeviceUniqueId: string = 'ABC123';

  showSearchbar: boolean = false;
  queryText: string = '';

  constructor(
    private deviceService: DeviceService,
    private toastService: ToastService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getEmployeeDevices();
  }

  getEmployeeDevices() {
    this.deviceService.getEmployeeDevices().subscribe(
      (response) => {
        // Servisten dönen datayı alıyoruz
        this.devices = response.data;
        this.toastService.showToast(response.message + " - Cihazlar Listelendi");
        // Gelen cihaz listesini tarihe göre gruplandırıyoruz
        this.groupDevicesByDate();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  groupDevicesByDate() {
    // Cihazları tarih bazında (en yeni tarih en üstte olacak şekilde) sıralıyoruz.
    // Burada 'date' alanının formatının (örneğin: "16.03.2025") doğru olduğundan emin olun.
    this.devices.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const groups:any = {};

    this.devices.forEach((device) => {
      // Cihazın tarih bilgisini anahtar olarak kullanıyoruz.
      const dateKey = device.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(device);
    });

    // Grupları, kullanılabilir bir yapı haline getiriyoruz.
    this.deviceGroups = Object.keys(groups).map((date) => {
      return {
        date: date,
        devices: groups[date],
      };
    });
  }

  confirmDelete(device: any) {
    // Cihaz silme onayı için alert kullanıyoruz.
    this.alertController
      .create({
        header: 'Cihazı Sil',
        message: 'Cihazı silmek istediğinize emin misiniz?',
        buttons: [
          {
            text: 'İptal',
            role: 'cancel',
          },
          {
            text: 'Sil',
            handler: () => {
              this.deleteDevice(device);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  deleteDevice(device: any) {
    // Silme işleminde gerekli payload
    const payload:any = { deviceid: device.id };
    this.deviceService.deleteDevice(payload).subscribe(
      (response) => {
        this.toastService.showToast('Cihaz silindi');
        // Listeyi güncellemek için cihaz listesini tekrar alıyoruz.
        this.getEmployeeDevices();
      },
      (error) => {
        this.toastService.showToast('Silme işlemi başarısız');
        console.error(error);
      }
    );
  }

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  filterDevices() {
    // İsteğe bağlı: queryText ile cihazları filtreleyebilirsiniz.
    // Örneğin; this.devices üzerinden filtreleme yapıp deviceGroups'u yeniden oluşturabilirsiniz.
  }
}