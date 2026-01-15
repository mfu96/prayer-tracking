import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerTimePageRoutingModule } from './prayer-time-routing.module';

import { PrayerTimePage } from './prayer-time.page';
import { QrComponent } from "../../components/qr/qr.component";
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerTimePageRoutingModule,
    QrComponent,
    PipesModule
    
],
  declarations: [PrayerTimePage]
})
export class PrayerTimePageModule {}
