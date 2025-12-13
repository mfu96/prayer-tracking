import { Component, OnInit } from '@angular/core';
import { DailyBoard } from 'src/app/interfaces/entities/dailyBoard';
import { DailyBoardService } from 'src/app/services/daily-board.service';

@Component({
  selector: 'app-daily-board',
  templateUrl: './daily-board.page.html',
  styleUrls: ['./daily-board.page.scss'],
  standalone:false
})


export class DailyBoardPage implements OnInit {

  // Hata düzeltmesi: Tip Dizi (Array) değil, tek bir Nesne (Object) olmalı.
  // API'den gelen veri bir dizi içinde değil, doğrudan bir nesne olarak geliyor.
  dailyBoard: DailyBoard | null = null;
  formattedDate: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private dailyBoardService: DailyBoardService) { }

  ngOnInit() {
   // this.loadDailyBoard();
  }

  ionViewWillEnter() {
  // Sayfa her göründüğünde namaz vakitlerini güncelle
    this.loadDailyBoard();

}


  /**
   * Servis aracılığıyla günün panosu verilerini yükler.
   */
  loadDailyBoard() {
    this.isLoading = true;
    this.errorMessage = null;

    this.dailyBoardService.getLatestDailyBoard().subscribe({
      next: (response) => {
        // Konsol logunuz 'response.data'nın bir nesne olduğunu doğruluyor.
        // Bu yüzden dizi işlemleri ([0]) kullanılmamalıdır.
        if (response.success && response.data) {
          // Gelen nesneyi doğrudan atıyoruz.
          this.dailyBoard = response.data;
          
          // 'this.dailyBoard' artık bir nesne olduğu için özelliklerine doğrudan erişiyoruz.
          // 'this.dailyBoard[0]' kullanımı hataya neden olur.
          this.formattedDate = this.formatDate(this.dailyBoard.date);

        } else {
          this.errorMessage = response.message || 'Veri alınamadı veya gelen veri formatı hatalı.';
        }
        // isLoading, if/else bloklarının dışında bir kez false yapılmalı.
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Hatası:', err);
        this.errorMessage = 'Veriler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Gelen tarih verisini "20 Nisan" formatına çevirir.
   * @param dateString ISO formatında tarih string'i
   * @returns string Formatlanmış tarih
   */
  private formatDate(dateString: string): string {
    // Bu fonksiyon doğru çalışıyor, gelen string'i Date nesnesine çeviriyor.
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const monthName = months[date.getMonth()];
    return `${day} ${monthName}`;
  }



  
}
