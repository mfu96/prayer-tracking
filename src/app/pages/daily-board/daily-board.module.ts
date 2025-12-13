import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyBoardPageRoutingModule } from './daily-board-routing.module';

import { DailyBoardPage } from './daily-board.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyBoardPageRoutingModule
  ],
  declarations: [DailyBoardPage]
})
export class DailyBoardPageModule {}
