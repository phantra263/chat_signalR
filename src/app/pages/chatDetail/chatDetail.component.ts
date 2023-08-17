import { Component, ViewChild, Input, OnInit, NgZone, ElementRef, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { SignalRService } from 'src/app/services/signalr.service';

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

  userChatWith: any = {};
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

  constructor(
    private ChatSrv: ChatService,
    private signalRService: SignalRService,
    private ngZone: NgZone,
    private router: Router,
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
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.idParam) {
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
