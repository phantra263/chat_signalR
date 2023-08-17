import { Component, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat_v2',
  templateUrl: './chat_v2.component.html',
  styleUrls: ['./chat_v2.component.scss']
})
export class Chat_v2Component implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  shouldSendEvent: boolean = true;
  hasId: boolean = false;
  showSearch: boolean = false;
  listSearch: any = [];
  inputSearch: string = '';
  currUser :any = localStorage.getItem('account');
  listUserChat: any = [];
  userChatWith: any = {};
  selectedIndex: number = -1;
  filterParams = {
    SenderId: '',
    ReceiverId: ''
  }
  idParam: string = '';
  routePath: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private chatSrv: ChatService,
    private router: Router,
    private signalRService: SignalRService,
    private http: HttpClient,
    private renderer: Renderer2,
    private ngZone: NgZone
    ) {}

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);

    // show toast notify window
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        // cấp quyền hiển thị thông báo trên window
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // window được cấp quyền hiển thị thông báo
          } else {
            // window không được cấp quyền hiển thị thông báo
          }
        });
      } else {
        // đã cấp quyền trước đó
      }
    }

    // fetch list user chat with
    const params = {
      UserId: this.currUser.Id,
      PageNumber: 1,
      PageSize: 9999
    }
    this.fetchListUser(params);

    this.route.queryParamMap.subscribe((queryParam: any) => {
      this.idParam = queryParam.get('id');
    });

    // connect signalR
    this.signalRService.startConnectChat(this.currUser.Id);
    this.signalRService.onConnected(data => {
      if (data.succeeded) {
        this.changeStatus(data);
        this.ngZone.run(() => { });
      }
    });
    this.signalRService.onDisconnected(data => {
      if (data.succeeded) {
        this.changeStatus(data);
        this.ngZone.run(() => { });
      }
    });
    this.signalRService.onReceiveMessage((data) => {
      this.listUserChat = this.listUserChat.map((item) => {
        if (data.conversationId === item.ConversationId) {
          item = {
            ...item,
            Content: data.content,
            IsSeen: false,
            Created: data.created
          }
        }
        return item;
      })
      this.ngZone.run(() => { });
    })
    this.signalRService.OnReadMessage((data) => {
      const conversary = this.listUserChat.find(item => item.ConversationId === data.conversationId);
      if (conversary) conversary.IsSeen = true;
      this.ngZone.run(() => { });
    });
    this.signalRService.OnReceiveNewMessageBox((data)=> {
      // data của signalr trả về chữ thường, nên phải chuyển key sang in hoa
      const dataBox = 
        {
          Id: data.id,
          ConversationId: data.conversationId,
          IsLock: data.isLock,
          IsMute: data.isMute,
          UserId: data.userId,
          Nickname: data.nickname,
          AvatarBgColor: data.avatarBgColor,
          Status: data.status,
          IsOnline: data.isOnline,
          Content: data.content,
          IsSeen: data.isSeen,
          Created: data.created
      }
      this.listUserChat.push(dataBox);
      this.ngZone.run(() => { });
    })
    this.signalRService.onReceiveNotificationMessage(data => {
      if (data.succeeded) this.toastNotification(`${data.data.content}`);
    });
  }

   changeStatus(data) {
      this.listUserChat = this.listUserChat.map((item) => {
        if (item.UserId === data.data.userId) {
          item = {
            ...item,
            IsOnline: data.data.isOnline
          }
        }
        return item
      })
  }

  fetchListUser(param: any) {
    this.chatSrv.getListUser(param).subscribe((resp: any) => {
      if (resp.Succeeded) {
        this.listUserChat = resp.Data;
      }
    })
  }

  search() {
    this.showSearch = true;
    if (this.inputSearch) {
      const params = {
        Nickname: this.inputSearch,
        YourNickname: this.currUser.Nickname
      }
      this.chatSrv.search(params).subscribe((resp: any) => {
        if (resp.Succeeded) {
          this.listSearch = resp.Data
        }
      })
    }
  }

  confirmSearch(data) {
    this.filterParams = {
      ...this.filterParams,
      SenderId: this.currUser.Id,
      ReceiverId: data.Id,
    }
    this.chatSrv.GetMessageBox(this.filterParams).subscribe((resp: any) => {
      if (resp.Succeeded) {
        const findObj = this.listUserChat.find(item => item.UserId === data.Id)
        data = {
          ...data,
          ...resp.Data
        }
        if (!findObj) {
          this.listUserChat.push(data);
        }
        this.hasId = true;
        this.userChatWith = data;
        // this.router.navigate(['/chat', resp.Data.ConversationId]);
        this.router.navigate([], { queryParams: { id: resp.Data.ConversationId }, queryParamsHandling: 'merge' });
        
        if (this.userChatWith.Content) this.readMessage();
      }
    })

    this.selectedIndex = -1;
    this.listSearch = [];
    this.showSearch = false;
    this.inputSearch = '';
  }
  readMessage() {
    const obj = {
      Id: '',
      ConversationId: this.userChatWith.ConversationId,
      IsSeen: true
    }
    this.signalRService.ReadMessage(obj);
  }
  startChat(data) {
    this.userChatWith = data;
    // this.router.navigate(['/chat', data.ConversationId]);

    //read message
    if (this.userChatWith.Content) this.readMessage();
    this.router.navigate([], { queryParams: { id: data.ConversationId }, queryParamsHandling: 'merge' });
    this.hasId = true;
  }
  openTooltipSearch() {
    this.showSearch = true;
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.searchInput.nativeElement.contains(event.target)) {
        this.showSearch = false;
      }
    });
    this.selectedIndex = -1;
  }
  onKeyDown(event: KeyboardEvent) {
    // if (this.showSearch) {
    //   if (event.key === 'ArrowDown') {
    //     event.preventDefault();
    //     this.selectedIndex = Math.min(this.selectedIndex + 1, this.listSearch.length - 1);
    //   } else if (event.key === 'ArrowUp') {
    //     event.preventDefault();
    //     this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    //   } else if (event.key === 'Enter') {
    //     event.preventDefault();
    //     if (this.selectedIndex !== -1) {
    //       this.confirmSearch(this.listSearch[this.selectedIndex]);
    //     }
    //   }
    // }
  }
  toastNotification(content) {
    const title = 'Messenger';
    const options: NotificationOptions = {
      body: `${content}`
    };

    const notification = new Notification(title, options);
  }
}
