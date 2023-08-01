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

  public startConnection(): void {
    // const apiUrl = 'http://192.168.2.173';
    const apiUrl = 'http://localhost';
    // const user = JSON.parse(localStorage.getItem('ttsuser'));
     const user = 'sjkujdijasd';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(apiUrl + `/hub/notify?UserId=${user}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connection started.');
      })
      .catch(err => console.log('Error while starting SignalR connection: ' + err));
  }

  stopConnection() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => {
          console.log('SignalR connection stopped');
        })
        .catch(err => {
          console.error('Error while stopping SignalR connection:', err);
        });
    }
  }

  onConnectionClose(callback: () => void) {
    this.hubConnection.onclose(callback);
  }

  addListener(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveNotification', data => {
      callback(data);
    });
  }

  startConnectChat(id): void {
    // const apiUrl = 'http://192.168.2.173';
    const apiUrl = 'http://localhost';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(apiUrl + `/hub/chat?UserId=${id}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('Connect Chat started.');
      })
      .catch(err => console.log('Error while starting SignalR connection: ' + err));
  }

  addListenerChat(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveMessage', data => {
      callback(data);
    });
  }

  sendMessageChat(mess: object): void {
    this.hubConnection.invoke('SendMessage', mess)
      .catch(err => console.error('Error while sending message: ', err));
  }

  sendMessage(noti): void {
      this.hubConnection.invoke('SendToAll', noti)
        .catch(err => console.error('Error while sending message: ', err));
  }

  sendMessageObject(noti): void {
    this.hubConnection.invoke('SendToMultiReceiver', noti)
      .catch(err => console.error('Error while sending message: ', err));
  }

  sendFlagNoti(noti): void {
    this.hubConnection.invoke('UpdateNotification', noti)
      .catch(err => console.error('Error while sending message: ', err));
  }
}