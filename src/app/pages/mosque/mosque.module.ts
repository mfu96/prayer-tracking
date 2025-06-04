import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MosquePageRoutingModule } from './mosque-routing.module';

import { MosquePage } from './mosque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MosquePageRoutingModule
  ],
  declarations: [MosquePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Swiper.js web bileşenleri için buraya ekleyin

})
export class MosquePageModule {}
