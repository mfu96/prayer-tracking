import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'trTitleCase',
  standalone: false
})
export class TrTitleCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    // Her kelimeyi boşluktan ayır, baş harfi Türkçe büyük, kalanı Türkçe küçük yap
    return value.split(' ').map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
    }).join(' ');
  }


}
