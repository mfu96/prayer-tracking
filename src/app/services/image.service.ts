import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';
import { Image } from '../interfaces/entities/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

    apiUrl=environment.apiUrl;


  constructor(private httpClient:HttpClient) { }

  getImageByMosqueId(mosqueId: number):Observable<ListResponseModel<Image>>{
    let newPath=this.apiUrl + "images/getimagesbymosque?mosqueId=" +mosqueId;
    return this.httpClient.get<ListResponseModel<Image>>(newPath);
  }

}
