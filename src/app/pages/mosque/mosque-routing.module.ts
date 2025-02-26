import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MosquePage } from './mosque.page';

const routes: Routes = [
  {
    path: '',
    component: MosquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MosquePageRoutingModule {}
