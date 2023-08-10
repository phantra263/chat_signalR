import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpOptions } from '../common/httpOptions';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.apiUrl;
  private apiController = '/api/v1/Chat';
  private apiUser = '/api/Users/'
  private apiMessage = '/api/Messages/GetMessageBox'

  constructor(private http: HttpClient) { }

  login(nickName): Observable<any> {
    let url = this.baseUrl + this.apiUser + `${nickName}`;
    return this.http.post(url, httpOptions);
  }

  search(nickName): Observable<any> {
    let params = new HttpParams();
    params = params.append('nickname', nickName);
    let url = this.baseUrl + this.apiUser + 'SearchUser';
    return this.http.get(url, {params});
  }

  GetMessageBox(obj): Observable<any> {
    let params = new HttpParams();
    params = params.append('SenderId', obj.SenderId);
    params = params.append('ReceiverId', obj.ReceiverId);
    params = params.append('PageNumber', obj.PageNumber ? obj.PageNumber : 1);
    params = params.append('PageSize', obj.PageSize ? obj.PageSize : 10);

    const url = this.baseUrl + this.apiMessage;
    return this.http.get(url, { params });
  }
}