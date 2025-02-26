import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/entities/user';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl =environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  getUsers():Observable<ListResponseModel<User>>{
    let newPath=this.apiUrl+ "users/getall";
    return this.httpClient.get<ListResponseModel<User>>(newPath);
  }

  getByEmail(email:string):Observable<SingleResponseModel<User>>{
    let newPath=this.apiUrl + "users/getbyemail?email="+ email;
    return this.httpClient.get<SingleResponseModel<User>>(newPath);
  }

}
