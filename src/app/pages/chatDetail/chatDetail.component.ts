import { Component, ViewChild, Input, OnInit, NgZone, ElementRef, SimpleChanges, OnChanges, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { selectBgTheme } from 'src/app/selectors/app.selectors';
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
  @ViewChild('messageContainer') messageContainerRef: ElementRef;
  @Input() idParam: string = '';
  @Input() currUser: any;
  @Input() roomIdParam: string = '';
  @Input() flagConnect: boolean = false;

  userChatWith: any = {};
  roomChat: any = {};
  inputChat: string = '';
  toggled: boolean = false;
  listMessage: any = [];
  filterParamMess: any = {
    UserId: '',
    ConversationId: '',
    PageNumber: 1,
    PageSize: 20
  }
  filterParamRoomMes: any = {
    RoomId: this.roomIdParam,
    PageNumber: 1,
    PageSize: 20
  }
  isLoading: boolean = true;
  bgThemeData$ = this.store.pipe(select(selectBgTheme));
  inputChatRoom: string = '';

  constructor(
    private ChatSrv: ChatService,
    private signalRService: SignalRService,
    private ngZone: NgZone,
    private router: Router,
    private store: Store<AppState>,
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
        this.scrollToBottom();
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
          Content: data.content,
          Created: data.created,
          SenderId: data.senderId,
          AvatarId: data.avatarId,
          AnonymousName: data.anonymousName,
          IsNoti: true
        }
        this.listMessage.push(dataNoti);
        this.ngZone.run(() => { });
        this.scrollToBottom();
      }
    })

    this.signalRService.OnReceiveMessageRoom((data) => {
      // viết hoa chữ cái đầu của key 
      const itemMess = {
        Content: data.content,
        Created: data.created,
        SenderId: data.senderId,
        AvatarId: data.avatarId,
        AnonymousName: data.anonymousName
      }
      if (this.roomIdParam === data.roomId) {
        this.listMessage.push(itemMess);
        this.ngZone.run(() => { });
        this.scrollToBottom();
      }
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.idParam && this.idParam) {
      this.listMessage = [];
      this.isLoading = true;
      this.filterParamMess = {
        PageNumber: 1,
        PageSize: 20,
        UserId: this.currUser.Id,
        ConversationId: this.idParam
      }
      this.fetchMessPerson(this.filterParamMess);
    }

    // connect thành công mới push noti đã vào phòng
    if (this.flagConnect) {
      this.signalRService.PushAnyNotiJoinRoom(this.roomIdParam);
    }

    if (changes.roomIdParam && this.roomIdParam) {
      this.listMessage = [];
      this.isLoading = true;
      this.filterParamRoomMes = {
        PageNumber: 1,
        PageSize: 20,
        RoomId: this.roomIdParam,
      }
      this.fetchMessRoom(this.filterParamRoomMes);
    }
  }
  scrollToBottom() {
    try {
      this.messageContainerRef.nativeElement.scrollTop = this.messageContainerRef.nativeElement.scrollHeight;
    } catch (err) { }
  }
  fetchMessPerson(params) {
    this.ChatSrv.Messages(params).toPromise().then((resp: any) => {
      if (resp.Succeeded) {
        this.listMessage = [...resp.Data.Messages, ...this.listMessage];
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

  fetchMessRoom(params) {
    this.ChatSrv.MessagesRoom(params).toPromise().then((resp: any) => {
      if (resp.Succeeded) {
        this.listMessage = [...resp.Data.Messages, ...this.listMessage];
        this.roomChat = {
          ...this.roomChat,
          Name: resp.Data.Name
        }
        this.isLoading = false;
        } else  this.router.navigate(['/chat'])
    })
  }

  checkIsEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  onChatScroll(event: any) {
    const div = event.target;
    if (div.scrollTop === 0) { 
      if (this.roomIdParam) {
        this.filterParamRoomMes.PageNumber++;
        this.fetchMessRoom(this.filterParamRoomMes);
      } else {
        this.filterParamRoomMes.PageNumber++;
        this.fetchMessPerson(this.filterParamMess);
      }
    }
  }

  handleSelection(event) {
    if (this.idParam) {
      this.inputChat += event.char;
    } else this.inputChatRoom += event.char;
    
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
  checkShowAvatarInRoom(objCurrent, objPre) {
    return (objCurrent.SenderId !== objPre.SenderId)
  }
  onEnterKeyPressed(event): void {
    event.preventDefault();
    if (this.inputChat) { this.sendMess();}
    if (this.inputChatRoom) { this.sendMessRoom();}
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

  sendMessRoom() {
    const obj = {
      Content: this.inputChatRoom,
      RoomId: this.roomIdParam
    }
    this.signalRService.SendMessageToRoom(obj);
    this.inputChatRoom = '';
  }
}
