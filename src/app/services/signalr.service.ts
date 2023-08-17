import { Injectable } from '@angular/core';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private apiUrl = 'https://www.app-chat.somee.com';
  // private apiUrl = 'http://192.168.2.173';

  startConnectChat(id: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + `/hub/chat?userId=${id}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.info('Kết nối thành công');
      })
      .catch(err => console.error('Xảy ra lỗi khi connect đến signal hub: ' + err));
  }

  stopConnection() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => {
          console.info('Ngắt kết nối thành công');
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
    this.hubConnection.on('OnReceiveMessage', data => {
      callback(data);
    });
  }

  ReadMessage(obj: object): void {
    this.hubConnection.invoke('ReadMessage', obj)
      .catch(err => console.error('Xảy ra lỗi khi kiểm tra đã xem hay chưa ', err));
  }

  OnReadMessage(callback: (data: any) => void) {
    this.hubConnection.on('OnReadMessage', data => {
      callback(data);
    });
  }

  onConnected(callback: (data: any) => void) {
    this.hubConnection.on('OnConnected', data => {
      callback(data);
    });
  }

  OnReceiveNewMessageBox(callback: (data: any) => void) {
    this.hubConnection.on('OnReceiveNewMessageBox', data => {
      callback(data);
    });
  }

  onGetListUserOnline(callback: (data: any) => void) {
    this.hubConnection.on('OnGetListUserOnline', data => {
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

  onReceiveNotificationMessage(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveNotificationMessage', data => {
      callback(data);
    });
  }
}