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
    loadChildren: () => import('./pages/prayer-time/prayer-time.module').then( m => m.PrayerTimePageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'mosque',
    loadChildren: () => import('./pages/mosque/mosque.module').then( m => m.MosquePageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'qr',
    component: QrComponent,
     canActivate:[LoginGuard]
  },
  {
    path: 'prayer-add',
    component: PrayerAddComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/auth/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'devices',
    loadChildren: () => import('./pages/devices/devices.module').then( m => m.DevicesPageModule)
  },

  {
    path: 'daily-board',
    loadChildren: () => import('./pages/daily-board/daily-board.module').then( m => m.DailyBoardPageModule)
  },








 

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
