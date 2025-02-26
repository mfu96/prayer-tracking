import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Geolocation, Position } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})

export class LocationService {
  

  // Kullanıcıların abone olabileceği konum konusu
  private locationSubject = new BehaviorSubject<Position | null>(null);
  location$ = this.locationSubject.asObservable();

  // Konum izleme işlemi için ID
  private watchId: string | null = null;

  constructor() { }

  // Konum izlemeyi başlatma metodu
  async startTracking() {
    // Önceden izleme varsa durdur
    await this.stopTracking();

    // Konum izni iste; sadece uygulama kullanımdayken
    const permission = await Geolocation.requestPermissions();

    if (permission.location === 'granted') {
      // Konum izleme seçenekleri
      const options = {
        enableHighAccuracy: true // Yüksek doğruluk talep et
      };

      // Konum izlemeye başla
      this.watchId = await Geolocation.watchPosition(options, (position: Position | null, err) => {
        if (position) {
          console.log('Konum alındı:', position);
          this.locationSubject.next(position);
        } else if (err) {
          console.error('Konum alma hatası:', err);
        }
      });
      
    } else {
      console.error('Konum izni verilmedi.');
    }
  }

  // Konum izlemeyi durdurma metodu
  async stopTracking() {
    if (this.watchId) {
      // İzlemeyi durdur
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  public getCurrentLocation(): Position | null {
    return this.locationSubject.getValue();
  }
  
  
}