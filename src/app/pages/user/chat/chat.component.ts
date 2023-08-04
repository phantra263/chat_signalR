import { Component, OnInit, NgZone, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
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

  // danh sach user chat
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

  // danh sach cuoc hoi thoai
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
  isSpinning: boolean = true;

  constructor(
    private signalRService: SignalRService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
    // show toast notify window
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        // cấp quyền hiển thị thông báo trên window
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // window được cấp quyền hiển thị thông báo
            // action...
          } else {
            // window không được cấp quyền hiển thị thông báo
            // action...
          }
        });
      } else {
        // đã cấp quyền trước đó
        // action
      }
    }

    this.listUserChat = this.listUserChat.filter((item) => item.id !== this.user.id);

    this.route.params.subscribe(params => {

      this.idParam = parseInt(params['id']);

      if (this.idParam) {
        const conversation = this.listConversary.find(item => this.idParam === item.id);

        const receiverId = conversation.user1 !== this.user.id ? conversation.user1 : conversation.user2;

        this.userChatWith = this.listUserChat.find(item => item.id === receiverId);

        const messages = JSON.parse(localStorage.getItem('messages')) || [];

        this.listChatHistory = messages.filter(x =>
          (x.senderId === this.user.id && x.receiverId === this.userChatWith.id) ||
          (x.senderId === this.userChatWith.id && x.receiverId === this.user.id)
        );

        this.hasConversation = true;

        this.ngZone.run(() => { });
      }
    });

    this.signalRService.startConnectChat(this.user.id);

    this.signalRService.onConnected(data => {
      if (data.succeeded) {
        var userOnline = this.listUserChat.find(x => x.id === data.data.userId);

        userOnline.isOnline = true;

        this.ngZone.run(() => { });
      }
    });

    this.signalRService.onGetListUserOnline(data => {
      if (data.succeeded) {
        data.data.userOnline.forEach(userId => {
          var userOnline = this.listUserChat.find(x => x.id === userId);
          userOnline.isOnline = true;
        });
        this.ngZone.run(() => { });
      }
    });

    this.signalRService.onDisconnected(data => {
      if (data.succeeded) {
        var userOnline = this.listUserChat.find(x => x.id === data.data.userId);

        userOnline.isOnline = false;

        this.ngZone.run(() => { });
      }
    });

    this.signalRService.onCloseConnection(err => {
      console.error('Kết nối đến signal hub đã bị đóng', err);
    });

    this.signalRService.onReceiveMessage(data => {
      if (data.succeeded) {

        localStorage.setItem("messages", JSON.stringify([...this.listChatHistory, data.data]));

        const messages = JSON.parse(localStorage.getItem('messages'));

        this.listChatHistory = messages.filter(x =>
          (x.senderId === this.user.id && x.receiverId === this.userChatWith.id) ||
          (x.senderId === this.userChatWith.id && x.receiverId === this.user.id)
        );

        this.ngZone.run(() => { });
      }
    });

    this.signalRService.onReceiveNotificationMessage(data => {
      if (data.succeeded) this.toastNotification(`Bạn có 1 tin nhắn mới từ ${data.data.content}`);
    });

    this.myName = `${this.user.lastName} ${this.user.firstName}`

    this.isSpinning = false;
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
      ConversationId: `${this.idParam}`,
      SenderName: this.myName,
      ReceiverId: `${this.userChatWith.id}`,
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
      || (objCurrent.senderName === objPre.senderName && this.checkTime(objCurrent.timming, objPre.timming)))
  }

  changeConversary(senderId, receiverId) {
    const conversation = this.listConversary.find(x =>
      (x.user1 == senderId && x.user2 == receiverId) ||
      (x.user1 == receiverId && x.user2 == senderId)
    );

    this.router.navigate([`/chat/${conversation.id}`]);
  }

  handleSelection(event) {
    this.inputChat += event.char;
  }

  toastNotification(content) {
    const title = 'Messenger';
    const options: NotificationOptions = {
      body: `${content}`
    };

    const notification = new Notification(title, options);
  }
}

