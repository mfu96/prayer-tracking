import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerTimePageRoutingModule } from './prayer-time-routing.module';

import { PrayerTimePage } from './prayer-time.page';
import { QrComponent } from "../../components/qr/qr.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerTimePageRoutingModule,
    QrComponent
],
  declarations: [PrayerTimePage]
})
export class PrayerTimePageModule {}
