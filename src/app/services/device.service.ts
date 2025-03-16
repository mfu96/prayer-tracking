import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Device } from '../interfaces/entities/device';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
    apiUrl=environment.apiUrl;
    
    constructor(private httpClient: HttpClient) {}

    addDevice(device: Device): Observable<SingleResponseModel<Device>> {
      return this.httpClient.post<SingleResponseModel<Device>>(this.apiUrl + 'devices/add', device);
    }
}
