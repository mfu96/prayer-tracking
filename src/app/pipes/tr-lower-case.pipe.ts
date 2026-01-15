import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trLowerCase',
  standalone: false
})
export class TrLowerCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Türkçe uyumlu küçük harfe çevirme
    return value.toLocaleLowerCase('tr-TR');
  }

}