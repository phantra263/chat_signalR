import { Injectable } from '@angular/core';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public notiReceived: Subject<string> = new Subject<string>();
  public listNoti: string[] = [];
  private apiUrl = 'http://www.signalr-test.somee.com';
  // private apiUrl = 'http://localhost:5000';

  startConnectChat(id: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + `/hub/chat?UserId=${id}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('Kết nối thành công');
      })
      .catch(err => console.log('Xảy ra lỗi khi connect đến signal hub: ' + err));
  }

  stopConnection() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => {
          console.log('Ngắt kết nối thành công');
        })
        .catch(err => {
          console.error('Xảy ra lỗi khi stop connect signal hub:', err);
        });
    }
  }

  sendMessageChat(mess: object): void {
    this.hubConnection.invoke('SendMessage', mess)
      .catch(err => console.error('Xảy ra lỗi khi gửi tin nhắn: ', err));
  }

  onReceiveMessage(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveMessage', data => {
      callback(data);
    });
  }

  onConnected(callback: (data: any) => void) {
    this.hubConnection.on('OnConnected', data => {
      callback(data);
    });
  }

  onDisconnected(callback: (data: any) => void) {
    this.hubConnection.on('OnDisconnected', data => {
      callback(data);
    });
  }

  onCloseConnection(callback: (data: any) => void) {
    this.hubConnection.onclose((error: Error) => {
      callback(error);
    });
  }
}