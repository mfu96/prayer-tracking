import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyBoard } from '../interfaces/entities/dailyBoard';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../interfaces/responses/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DailyBoardService {

    apiUrl =environment.apiUrl;
  
  constructor(
        private httpClient: HttpClient,
    
  ) { }

    getLatestDailyBoard():Observable<SingleResponseModel<DailyBoard>>{
      let newPath= this.apiUrl+ "DailyBoards/getLatestDailyBoard";
      return this.httpClient.get <SingleResponseModel<DailyBoard>>(newPath);
    }
}
