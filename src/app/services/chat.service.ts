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

  constructor(private http: HttpClient) { }
}