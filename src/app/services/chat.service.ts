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
  private apiMessages = '/api/Messages/GetByConversation'
  private apiBox = '/api/Boxs/'

  constructor(private http: HttpClient) { }

  authen(acc: any, type: string) {
    let url = this.baseUrl + this.apiUser + type;
    const body = JSON.stringify(acc);
    return this.http.post(url, body, httpOptions).toPromise();
  }

  search(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('Nickname', data.Nickname);
    params = params.append('YourNickname', data.YourNickname);
    let url = this.baseUrl + this.apiUser + 'SearchUser';
    return this.http.get(url, {params});
  }

  GetMessageBox(obj): Observable<any> {
    let params = new HttpParams();
    params = params.append('SenderId', obj.SenderId);
    params = params.append('ReceiverId', obj.ReceiverId);

    const url = this.baseUrl + this.apiBox + 'GetBoxSelected';
    return this.http.get(url, { params });
  }

  Messages(obj): Observable<any> {
    let params = new HttpParams();
    params = params.append('UserId', obj.UserId);
    params = params.append('ConversationId', obj.ConversationId);
    params = params.append('PageNumber', obj.PageNumber ? obj.PageNumber : 1);
    params = params.append('PageSize', obj.PageSize ? obj.PageSize : 10 );
    const url = this.baseUrl + this.apiMessages
    return this.http.get(url, { params });
  }

  getListUser(obj) : Observable<any> {
    let params = new HttpParams();
    params = params.append('UserId', obj.UserId);
    params = params.append('PageNumber', obj.PageNumber ? obj.PageNumber : 1);
    params = params.append('PageSize', obj.PageSize ? obj.PageSize : 10 );

    const url = this.baseUrl + this.apiBox + 'GetByUserId';
    return this.http.get(url, { params });
  }
}