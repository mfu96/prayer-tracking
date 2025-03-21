import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Device } from '../interfaces/entities/device';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';
import { ListResponseModel } from '../interfaces/responses/listResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  addDevice(device: Device): Observable<SingleResponseModel<Device>> {
    return this.httpClient.post<SingleResponseModel<Device>>(
      this.apiUrl + 'devices/add',
      device
    );
  }

  getEmployeeDevices(): Observable<ListResponseModel<Device>> {
    let newPath = this.apiUrl + 'devices/getbyemployee';
    return this.httpClient.get<ListResponseModel<Device>>(newPath);
  }

  deleteDevice(deviceId: number): Observable<SingleResponseModel<Device>> {
    return this.httpClient.post<SingleResponseModel<Device>>(
      this.apiUrl + 'devices/delete',
      { deviceId: deviceId }  //  { deviceId: deviceId }  veriyi json çevirmek için kullndık.
                              // devices.page deki delete türü devices:any olduğu için buna başvurduk
    );
  }
}
