import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';
import { Image } from '../interfaces/entities/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

baseUrl= environment.baseUrl;
  apiUrl= environment.apiUrl + 'images';


  constructor(private httpClient:HttpClient) { }

  getImageByMosqueId(mosqueId: number):Observable<ListResponseModel<Image>>{
    let newPath=this.apiUrl + "/getimagesbymosque?mosqueId=" +mosqueId;
    return this.httpClient.get<ListResponseModel<Image>>(newPath);
  }

    getImages(endpoint: string, params: { [key: string]: any }): Observable<ListResponseModel<Image>> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.httpClient.get<ListResponseModel<Image>>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }


    getFullImagePath(imagePath: string): string {
    return `${this.baseUrl}${imagePath}`;
  }


}
