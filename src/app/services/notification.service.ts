import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpOptions } from '../common/httpOptions';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = environment.apiUrl;
  private apiController = '/api/v1/Notification';

  constructor(private http: HttpClient) { }

  getListNoti(listParams?): Observable<any> {
    let params = new HttpParams();
    params = params.append('Keyword', listParams.Keyword ? listParams.Keyword : '');
    params = params.append('PageNumber', listParams.PageNumber ? listParams.PageNumber : 1);
    params = params.append('PageSize', listParams.PageSize ? listParams.PageSize : 10);

    const url = this.baseUrl + this.apiController;
    return this.http.get(url, { params });
  }

  updateSttNoti(data: any) {
    let url = this.baseUrl + this.apiController;
    const body = JSON.stringify(data);
    return this.http.put(url, body, httpOptions).toPromise();
  }
}