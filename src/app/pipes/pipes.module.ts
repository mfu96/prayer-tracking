import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Genel Angular özellikleri için

import { TrLowerCasePipe } from './tr-lower-case.pipe';
import { TrUpperCasePipe } from './tr-upper-case.pipe';
import { TrTitleCasePipe } from './tr-title-case.pipe';

@NgModule({
  declarations: [
    TrLowerCasePipe,
    TrUpperCasePipe,
    TrTitleCasePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TrLowerCasePipe,
    TrUpperCasePipe,
    TrTitleCasePipe
  ]
})
export class PipesModule {}