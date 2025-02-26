import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';
import { Observable } from 'rxjs';
import { PrayerTimeDetailDto } from '../interfaces/entities/prayerTimeDetailDto';
import { ResponseModel } from '../interfaces/responses/responseModel';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';
import { PrayerTime } from '../interfaces/entities/prayerTime';

@Injectable({
  providedIn: 'root'
})
export class PrayerTimeService {

  apiUrl=environment.apiUrl;


  constructor(private httpClient: HttpClient) {}

  getPrayerByDetail(paryerId:number):Observable<ListResponseModel<PrayerTimeDetailDto>>{

    let newPath = this.apiUrl + 'prayertimes/getdetails?prayerId=' +paryerId;

  
    return this.httpClient.get<ListResponseModel<PrayerTimeDetailDto>>(newPath);
  }  
  getPrayerByUserDetail():Observable<ListResponseModel<PrayerTimeDetailDto>>{

    let newPath = this.apiUrl + 'prayertimes/getbyuser';

  
    return this.httpClient.get<ListResponseModel<PrayerTimeDetailDto>>(newPath);
  }  
  
  getPrayerDetails():Observable<ListResponseModel<PrayerTimeDetailDto>>{

    let newPath = this.apiUrl + 'prayertimes/getdetails' ;

  
    return this.httpClient.get<ListResponseModel<PrayerTimeDetailDto>>(newPath);
  }

  addPrayerTime(prayerData:PrayerTime):Observable<SingleResponseModel<PrayerTime>>{
    return this.httpClient.post<SingleResponseModel<PrayerTime>>(this.apiUrl+ 'prayertimes/add', prayerData);

  }


}
