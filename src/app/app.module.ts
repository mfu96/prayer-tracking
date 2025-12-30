import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QrComponent } from './components/qr/qr.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
     IonicModule.forRoot(),
     CommonModule,
     IonicStorageModule.forRoot(),
     HttpClientModule,
     FormsModule,
     NgOptimizedImage,

     



      AppRoutingModule, 
      ServiceWorkerModule.register('ngsw-worker.js', {
        // enabled: environment.production  291225 tarihinde kapatıldı
        enabled: false,
      }),
      QrComponent



],
providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
 ],  bootstrap: [AppComponent],
})
export class AppModule {}
