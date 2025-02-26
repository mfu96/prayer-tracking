import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';
import { Mosque } from '../interfaces/entities/mosque';

@Injectable({
  providedIn: 'root'
})
export class MosqueService {
  apiUrl=environment.apiUrl


  constructor(
    private httpClient: HttpClient
  ) { }

  getMosques():Observable<ListResponseModel<Mosque>>{
    let newPath= this.apiUrl+ "mosques/getall";
    return this.httpClient.get<ListResponseModel<Mosque>>(newPath);
  }

  getMosque(mosqueId:number):Observable<ListResponseModel<Mosque>>{
    let newPath= this.apiUrl+ "mosques/getbyid?id="+mosqueId;
    return this.httpClient.get<ListResponseModel<Mosque>>(newPath);
  }
}
