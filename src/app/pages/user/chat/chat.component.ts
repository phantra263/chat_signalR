import { Component, OnInit, NgZone, HostListener, ViewChild, ElementRef, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainerRef: ElementRef;
  inputChat: string = '';
  hasConversation: boolean = false;
  userChatWith: any = {};
  user: any = JSON.parse(localStorage.getItem('currentAcc')) || {
    id: "4A62A822-0667-4E68-996A-501209329832",
    userName: "A013",
    email: "vinhhq@esuhai.com",
    firstName: "Vinh",
    lastName: "Huỳnh Quang",
    avatar: "https://picsum.photos/50/50",
    lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
    lastTimeMess: '2023-07-26T08:07:43.127'
  };
  myName = '';
  listChatHistory: any = [];
  listUserChat: any = [
    {
      id: "4A62A822-0667-4E68-996A-501209329832",
      userName: "A013",
      email: "vinhhq@esuhai.com",
      firstName: "Vinh",
      lastName: "Huỳnh Quang",
      avatar: "https://picsum.photos/50/50",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
      lastTimeMess: '2023-07-26T08:07:43.127'
    },
    {
      id: "FC938DD7-F4ED-4CD0-A7AA-975BC0D06D67",
      userName: "S602",
      email: "duyphuong@esuhai.com",
      firstName: "Phương",
      lastName: "Lê Duy",
      avatar: "https://picsum.photos/50/50",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
      lastTimeMess: '2023-07-26T08:07:43.127'
    },
    {
      id: "FC938DD7-F4ED-4CD0-A7AA-AAAAAAAA",
      userName: "S602",
      email: "nam@esuhai.com",
      firstName: "Nam",
      lastName: "Lê Nhật",
      avatar: "https://picsum.photos/50/50",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
      lastTimeMess: '2023-07-26T08:07:43.127'
    }
  ]; 
  listConversary: any = [
    {
      id: 1,
      user1: '4A62A822-0667-4E68-996A-501209329832', //vinh
      user2: 'FC938DD7-F4ED-4CD0-A7AA-975BC0D06D67' //phuong
    },
    {
      id: 2,
      user1: '4A62A822-0667-4E68-996A-501209329832', //vinh
      user2: 'FC938DD7-F4ED-4CD0-A7AA-AAAAAAAA' //nam
    },
    {
      id: 3,
      user1: 'FC938DD7-F4ED-4CD0-A7AA-AAAAAAAA', //nam
      user2: 'FC938DD7-F4ED-4CD0-A7AA-975BC0D06D67' //phuong
    }
  ];
  conversaryActive: any;
  idParam = 1;
  toggled: boolean = false;

  constructor(
    private signalRService: SignalRService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
    this.listChatHistory = JSON.parse(localStorage.getItem('chat')) || [];
    this.listUserChat = this.listUserChat.filter((item) => item.id !== this.user.id);
    this.route.params.subscribe(params => {
      this.idParam = parseInt(params['id']);
      if (this.idParam) {
        this.hasConversation = true;
        this.ngZone.run(() => {});
      }
    }); 

    this.signalRService.startConnectChat(this.user.id);
    this.signalRService.onConnectionClose(() => {
      console.log('SignalR connection closed.');
    });

    this.signalRService.addListenerChat(data => {
      if (data.succeeded) {
        this.listChatHistory = [ ...this.listChatHistory, data.data];
        localStorage.setItem("chat", JSON.stringify(this.listChatHistory));
        this.ngZone.run(() => {});
      }
    })
    this.myName = `${this.user.lastName} ${this.user.firstName}`
  }

  ngAfterViewChecked() {
    this.scrollMessageContainerToBottom();
  }

  private scrollMessageContainerToBottom() {
    try {
      this.messageContainerRef.nativeElement.scrollTop = this.messageContainerRef.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onEnterKeyPressed(event): void {
    event.preventDefault();
    this.sendMess();
  }

  sendMess() {
    const mess = {
      SenderName: this.myName,
      ReceiverId: this.userChatWith.id,
      ReceiverName: `${this.userChatWith.lastName} ${this.userChatWith.firstName}`,
      Content: this.inputChat,
      Timming: new Date()
    }

    this.signalRService.sendMessageChat(mess);
    this.inputChat = '';
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
    return (objCurrent.senderName !== objPre.senderName 
            || (objCurrent.senderName === objPre.senderName && this.checkTime(objCurrent.timming, objPre.timming)) )
  }

  changeConversary(receiverId, senderId) {
    const foundElement = this.listConversary.find((obj) => {
      return (
        (obj.hasOwnProperty('user1') && (obj['user1'] === senderId || obj['user1'] === receiverId)) &&
        (obj.hasOwnProperty('user2') && (obj['user2'] === senderId || obj['user2'] === receiverId))
      );
    });
    this.router.navigate([`/chat/${foundElement.id}`]);
  }

  handleSelection(event) {
    this.inputChat += event.char;
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }
}
