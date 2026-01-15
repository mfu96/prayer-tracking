import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trUpperCase',
  standalone: false
})
export class TrUpperCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Türkçe uyumlu büyük harfe çevirme
    return value.toLocaleUpperCase('tr-TR');
  }
}
