import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyBoardPage } from './daily-board.page';

const routes: Routes = [
  {
    path: '',
    component: DailyBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyBoardPageRoutingModule {}
