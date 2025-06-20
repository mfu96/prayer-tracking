import { Injectable } from '@angular/core'; // Angular servislerini kullanmak için
import { ToastController } from '@ionic/angular'; // Ionic toast bileşeni için

@Injectable({
  providedIn: 'root' // Servisin uygulama genelinde kullanılabilir olmasını sağlar
})
export class ToastService {
  // Constructor, ToastController bağımlılığını enjekte eder
  constructor(private toastController: ToastController) {}

  // Toast mesajı gösteren asenkron metod
  async showToastSuccess(message: string, options: any = {}) {
    const toast = await this.toastController.create({
      message, // Gösterilecek mesaj
      duration:options.duration || 2000, // Gösterim süresi (varsayılan 2 saniye)
       position: options.position || 'bottom', // 'top', 'middle' veya 'bottom'

          buttons: options.buttons || [{
      text: '✕', // Daha minimalist kapatma butonu
      role: 'cancel',
      handler: () => toast.dismiss()
    }],
       color: options.color || 'success' // Toast'un rengi (varsayılan 'dark')


    });
    await toast.present(); // Toast'u gösterir
  }

  async showToastWarning(message: string, options: any = {}) {
    const toast = await this.toastController.create({
      message, // Gösterilecek mesaj
      duration:options.duration || 3000, // Gösterim süresi (varsayılan 2 saniye)
       position: options.position || 'bottom', // 'top', 'middle' veya 'bottom'

          buttons: options.buttons || [{
      text: '✕', // Daha minimalist kapatma butonu
      role: 'cancel',
      handler: () => toast.dismiss()
    }],
                  color: options.color || 'danger', // Toast'un rengi (varsayılan 'dark')

    });
    await toast.present(); // Toast'u gösterir
  }


  async showToastInfo(message: string, options: any = {}) {
    const toast = await this.toastController.create({
      message, // Gösterilecek mesaj
      duration:options.duration || 2000, // Gösterim süresi (varsayılan 2 saniye)
       position: options.position || 'bottom', // 'top', 'middle' veya 'bottom'

          buttons: options.buttons || [{
      text: '✕', // Daha minimalist kapatma butonu
      role: 'cancel',
      handler: () => toast.dismiss()
    }],
      // cssClass: options.cssClass || 'success-toast' // Özel stil için CSS sınıfı

            color: options.color || 'secondary', // Toast'un rengi (varsayılan 'dark')

      

    });
    await toast.present(); // Toast'u gösterir
  }

}