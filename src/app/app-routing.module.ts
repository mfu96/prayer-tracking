import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PrayerAddComponent } from './components/prayer-add/prayer-add.component';
import { QrComponent } from './components/qr/qr.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'prayer-time',
    loadChildren: () => import('./pages/prayer-time/prayer-time.module').then( m => m.PrayerTimePageModule)
  },
  {
    path: 'mosque',
    loadChildren: () => import('./pages/mosque/mosque.module').then( m => m.MosquePageModule)
  },
  {
    path: '/tabs/qr',
    component: QrComponent,
     //canActivate:[LoginGuard]
  },
  {
    path: 'prayer-add',
    component: PrayerAddComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  }

 

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
