import { Injectable } from '@angular/core'; // Angular servislerini kullanmak için
import { LoadingController } from '@ionic/angular'; // Ionic loading bileşeni için

@Injectable({
  providedIn: 'root' // Servisin uygulama genelinde kullanılabilir olmasını sağlar
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null; // Loading bileşeni örneği

  private isLoading: boolean = false;
  // Constructor, LoadingController bağımlılığını enjekte eder
  constructor(private loadingController: LoadingController) {}

  // Loading'i gösteren asenkron metod
  async showLoading(message: string = 'Lütfen bekleyin...') {
    this.loading = await this.loadingController.create({
      message, // Gösterilecek mesaj
      spinner: 'circular' // Spinner tipi
    });
    await this.loading.present(); // Loading'i gösterir
    this.isLoading = true;
      console.log('Loading açıldı:', message); // Nerede açıldığını izle
  }

  // Loading'i gizleyen asenkron metod
  async hideLoading() {
    if (this.loading) { // Eğer loading açıksa
      await this.loading.dismiss(); // Loading'i kapatır
      this.loading = null; // Örneği sıfırlar
    }
  }
}