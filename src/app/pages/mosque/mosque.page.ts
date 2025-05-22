import { Component, OnInit } from '@angular/core';
import { MosqueService } from 'src/app/services/mosque.service';

@Component({
  selector: 'app-mosque',
  templateUrl: './mosque.page.html',
  styleUrls: ['./mosque.page.scss'],
  standalone:false
})
export class MosquePage implements OnInit {

   mosqueId: string;

  constructor(
    private mosqueService :MosqueService
  ) { }

  ngOnInit() {
    this.getMosqueId();
  }

  ionViewWillEnter() {
  // Sayfa her göründüğünde namaz vakitlerini güncelle
  this.getMosqueId();
  //this.getPrayerDetails();
}


  //Mosquenin detayları nı bu meythodlarla alcağız
      getMosqueId() { 
    this.mosqueService.getMosqueid().then(mosqueId => {
      this.mosqueId = mosqueId;
      console.log('Mosque pagediym, mosqu denemesi', mosqueId);
    });
  }

    refresh() {
    this.getMosqueId();
    console.log("yenileme yapıldı");
  }
}
