import { Component, ViewChild, Input, OnInit, NgZone, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { selectVariable2 } from 'src/app/selectors/app.selectors';
import { ChatService } from 'src/app/services/chat.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/states/app.state';

@Component({
  selector: 'app-chatDetail',
  templateUrl: './chatDetail.component.html',
  styleUrls: ['./chatDetail.component.scss']
})
export class ChatDetailComponent implements OnInit,OnChanges {
  @ViewChild('messageContainer') private messageContainerRef: ElementRef;
  @Input() idParam: string = '';
  @Input() currUser: any;
  @Input() status: boolean = false;
  @Input() roomIdParam: string = '';

  userChatWith: any = {};
  roomChat: any = {
    name: 'aBC',
  };
  inputChat: string = '';
  toggled: boolean = false;
  listMessage: any = [];
  filterParam: any = {
    UserId: '',
    ConversationId: '',
    PageNumber: 1,
    PageSize: 9999
  }
  isLoading: boolean = true;
  bgThemeData$ = this.store.pipe(select(selectVariable2));

  constructor(
    private ChatSrv: ChatService,
    private signalRService: SignalRService,
    private ngZone: NgZone,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit() {
    this.signalRService.onReceiveMessage((data) => {
      if (data.conversationId === this.idParam) {
        this.listMessage.push(data);
        
        if (this.currUser.Id !== data.senderId) {
          const obj = {
            Id: data.id,
            ConversationId: '',
            IsSeen: true
          } 
          this.signalRService.ReadMessage(obj);
        }
        this.ngZone.run(() => { });
      }
    })
    this.signalRService.onConnected(data => {
      if (data.succeeded) {
        this.userChatWith.IsOnline = data.data.isOnline
        this.ngZone.run(() => { });
      }
    });
    this.signalRService.onDisconnected(data => {
      if (data.succeeded) {
        this.userChatWith.IsOnline = data.data.isOnline
        this.ngZone.run(() => { });
      }
    });
    // lắng nge event khi vừa vào phòng chat
    this.signalRService.OnPushAnyNotiJoinRoom(data => {
      if (this.roomIdParam && this.roomIdParam === data.roomId) {
        const dataNoti = {
          ...data,
          isNoti: true
        }
        this.listMessage.push(dataNoti);
        this.ngZone.run(() => { });
      }
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.idParam && this.idParam) {
      this.filterParam = {
        ...this.filterParam,
        UserId: this.currUser.Id,
        ConversationId: this.idParam
      }
    this.ChatSrv.Messages(this.filterParam).toPromise().then((resp: any) => {
      if (resp.Succeeded) {
        this.listMessage = resp.Data.Messages;
        this.userChatWith = {
          ...this.userChatWith,
          AvatarBgColor: resp.Data.AvatarBgColor,
          Nickname: resp.Data.Nickname,
          Id: resp.Data.Id,
          IsOnline: resp.Data.IsOnline
        }
        this.isLoading = false;
        } else  this.router.navigate(['/chat'])
      })
    }

    if (changes.roomIdParam && this.roomIdParam) {
      this.signalRService.PushAnyNotiJoinRoom(this.roomIdParam);

      this.listMessage = [{
        id: '64deec38465dd9ec2c20005a',
        created: '2023-08-18T03:57:44.649Z',
        deleted: false,
        conversationId: '64d9a4292315357ce47b90fd64db4d692301839cfbc9b115',
        senderId: '64d9a4292315357ce47b90fd',
        senderName: 'tra',
        receiverId: '64db4d692301839cfbc9b115',
        receiverName: 'vinh',
        content: 'abc',
        isSeen: true,
        avatarId: '64d9a4292315357ce47b90fd123'
      },
      {
        id: '64deec83465dd9ec2c20005c',
        created: '2023-08-18T03:58:59.355Z',
        deleted: false,
        conversationId: '64d9a4292315357ce47b90fd64db4d692301839cfbc9b115',
        senderId: '64db4d692301839cfbc9b115',
        senderName: 'vinh',
        receiverId: '64d9a4292315357ce47b90fd',
        receiverName: 'tra',
        content: 'ádasd',
        isSeen: true,
        avatarId: '64d9a4292315357ce47b90fd234'
      }];
      this.isLoading = false;
    }
  }

  checkIsEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  ngAfterViewChecked() {
    this.scrollMessageContainerToBottom();
  }

  private scrollMessageContainerToBottom() {
    try {
      this.messageContainerRef.nativeElement.scrollTop = this.messageContainerRef.nativeElement.scrollHeight;
    } catch (err) { }
  }

  handleSelection(event) {
    this.inputChat += event.char;
  }
  checkTime(time1, time2) {
    const parseTime1 = new Date(time1);
    const parseTime2 = new Date(time2);
    // check tin nhắn trước và sau có cách nhau 10p hay không?
    // nếu có thì show tin nhắn sát nhau
    const diffInMinutes = Math.abs((parseTime1.getTime() - parseTime2.getTime()) / (1000 * 60));
    return diffInMinutes >= 10 && parseTime1.toDateString() === parseTime2.toDateString();;
  }
  checkShowAvatar(objCurrent, objPre) {
    return (objCurrent.senderId !== objPre.senderId
      || (objCurrent.senderId === objPre.senderId && this.checkTime(objCurrent.created, objPre.created)))
  }
  onEnterKeyPressed(event): void {
    event.preventDefault();
    if (this.inputChat) { this.sendMess();}
  }

  sendMess() {
    const mess = {
      ConversationId: this.idParam,
      SenderName: this.currUser.Nickname,
      ReceiverId: this.userChatWith.Id,
      ReceiverName: this.userChatWith.Nickname,
      Content: this.inputChat
    }
    this.signalRService.sendMessageChat(mess);
    this.inputChat = '';
  }
}
