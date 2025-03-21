import { Injectable } from '@angular/core'; // Angular servislerini kullanmak için
import { ToastController } from '@ionic/angular'; // Ionic toast bileşeni için

@Injectable({
  providedIn: 'root' // Servisin uygulama genelinde kullanılabilir olmasını sağlar
})
export class ToastService {
  // Constructor, ToastController bağımlılığını enjekte eder
  constructor(private toastController: ToastController) {}

  // Toast mesajı gösteren asenkron metod
  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message, // Gösterilecek mesaj
      duration, // Gösterim süresi (varsayılan 2 saniye)
      position: 'bottom' // 'top', 'middle' veya 'bottom'
     

    });
    await toast.present(); // Toast'u gösterir
  }
}