import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mosque',
  templateUrl: './mosque.page.html',
  styleUrls: ['./mosque.page.scss'],
  standalone:false
})
export class MosquePage implements OnInit {

   mosqueId: number;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
  }


      gerMosqueId() {
    this.authService.getMosqueid().then(mosqueId => {
      this.mosqueId = mosqueId;
      console.log('Mosque pagediym, mosqu denemesi', mosqueId);
    });
  }
}
