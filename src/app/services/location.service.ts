import { Injectable } from '@angular/core'; // Angular servislerini kullanmak için
import { BehaviorSubject } from 'rxjs'; // Konum verilerini anlık olarak paylaşmak için
import { Geolocation, Position } from '@capacitor/geolocation'; // Capacitor ile konum servisleri için
import { Platform } from '@ionic/angular'; // Ionic platform özelliklerini kullanmak için

@Injectable({
  providedIn: 'root' // Servisin uygulama genelinde kullanılabilir olmasını sağlar
})
export class LocationService {
  // Konum verilerini tutan BehaviorSubject, null veya Position olabilir
  private locationSubject = new BehaviorSubject<Position | null>(null);
  // Dışarıdan abone olunabilen konum observable'ı
  location$ = this.locationSubject.asObservable();

  // Konum izleme ID'sini saklar, izleme durdurulduğunda kullanılır
  private watchId: string | null = null;

  // Constructor, platform bağımlılığını enjekte eder
  constructor(private platform: Platform) {}

  // Konum izlemeyi başlatan asenkron metod
  async startTracking() {
    // Önce mevcut izlemeyi durdurur (çakışmayı önlemek için)
    await this.stopTracking();
    try {
      // Kullanıcıdan konum izni ister
      const permission = await Geolocation.requestPermissions();
      // İzin verilmişse devam eder
      if (permission.location === 'granted') {
        // Konum izleme seçenekleri: yüksek doğruluk, 10 saniye zaman aşımı
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };
        // Konumu sürekli izler ve her güncelleme locationSubject'e aktarılır
        this.watchId = await Geolocation.watchPosition(options, (position, err) => {
          if (position) {
            console.log('Konum alındı:', position.coords); // Konsola bilgi yazar
            this.locationSubject.next(position); // Yeni konumu BehaviorSubject'e gönderir
          } else if (err) {
            console.error('Konum alma hatası:', err); // Hata varsa konsola yazar
          }
        });
      } else {
        console.error('Konum izni verilmedi.'); // İzin reddedildiyse hata mesajı
      }
    } catch (error) {
      console.error('Konum izni hatası:', error); // Genel hata yakalanırsa konsola yazar
    }
  }

  // Konum izlemeyi durdurur
  async stopTracking() {
    if (this.watchId) { // Eğer bir izleme ID'si varsa
      await Geolocation.clearWatch({ id: this.watchId }); // İzlemeyi durdurur
      this.watchId = null; // ID'yi sıfırlar
    }
    this.locationSubject.next(null); // Eski konum verisini siler
  }

  // Mevcut konumu döndüren metod
  public getCurrentLocation(): Position | null {
    return this.locationSubject.getValue(); // BehaviorSubject'ten mevcut konumu alır
  }

  // Konum servisinin açık olup olmadığını kontrol eden metod (QR tarama için kullanılacak)
  public async isLocationServiceEnabled(): Promise<boolean> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000
      });
      return !!position; // Konum alınıyorsa true döner
    } catch (error) {
      console.error('Konum servisi kontrol hatası:', error); // Hata varsa konsola yazar
      return false; // Hata varsa (servis kapalıysa) false döner
    }
  }
}