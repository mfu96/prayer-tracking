import { NgModule } from '@angular/core';
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
  declarations: [MosquePage]
})
export class MosquePageModule {}
