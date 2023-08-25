import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { setBgTheme, setFlagMenu } from 'src/app/actions/app.actions';
import { selectBgTheme, selectFlagMenu } from 'src/app/selectors/app.selectors';
import { ChatService } from 'src/app/services/chat.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AppState } from 'src/app/states/app.state';

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
  currUser:any = localStorage.getItem('account');
  listUserChat: any = [];
  userChatWith: any = {};
  selectedIndex: number = -1;
  filterParams = {
    SenderId: '',
    ReceiverId: ''
  }
  paramsListUser = {
    UserId: '',
    PageNumber: 1,
    PageSize: 9999
  }
  paramsListRoom = {
    Keyword: '',
    PageNumber: 1,
    PageSize: 9999
  }
  idParam: string = '';
  routePath: string = '';
  flagModalAddRoom: boolean = false;
  nameRoom: string = '';
  errAddRoom: string = '';
  listRoomChat: any = [];
  roomIdParam: string = '';
  roomChatActive: string = '';
  bgThemeData$ = this.store.pipe(select(selectBgTheme));
  flagConnect: boolean = false;
  isLoadingListUser: boolean = false;
  isLoadingListRoom: boolean = false;
  flagMenu: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private chatSrv: ChatService,
    private router: Router,
    private signalRService: SignalRService,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private snackbarService: SnackbarService,
    private store: Store<AppState>
    ) { }

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);

    const savedState = localStorage.getItem('bgTheme');
    if (savedState) {
      this.store.dispatch(setBgTheme({ newValue: savedState }));
    }
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
    this.paramsListUser.UserId = this.currUser.Id;
    this.fetchListUser(this.paramsListUser);

    // fetch list room chat
    this.paramsListUser.UserId = this.currUser.Id;
    this.fetchListRoom(this.paramsListRoom);

    this.route.queryParamMap.subscribe((queryParam: any) => {
      const params = Object.keys(queryParam.params);
      if (params[0] === 'roomId') {
        this.roomIdParam = queryParam.get('roomId');
        this.idParam = '';
      } else {
        this.idParam = queryParam.get('id');
        this.roomIdParam = '';
      }
    });

    // connect signalR
    this.signalRService.connectAndPerformAction(this.currUser.Id).then(() => {
      this.flagConnect = true;
    });
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
          Created: data.created,
          SenderId: data.senderId
      }
      this.listUserChat.unshift(dataBox);
      this.ngZone.run(() => { });
    })
    this.signalRService.onReceiveNotificationMessage(data => {
      if (data.succeeded) this.toastNotification(`${data.data.content}`);
    });
    this.signalRService.OnPushRoomToAny(data => {
      this.listRoomChat.unshift(data);
      this.ngZone.run(() => { });
    })

    this.signalRService.OnReceiveMessageRoom((data) => {
      this.listRoomChat = this.listRoomChat.map((item) => {
        if (data.roomId === item.id) {
          item = {
            ...item,
            content: data.content,
            created: data.created
          }
        }
        return item;
      })
      this.ngZone.run(() => { });
    })
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
    this.isLoadingListUser = true;
    this.chatSrv.getListUser(param).subscribe((resp: any) => {
      if (resp.Succeeded) {
        this.listUserChat = resp.Data;
      }
      this.isLoadingListUser = false;
    })
  }

  fetchListRoom(param: any) {
    this.isLoadingListRoom = true
    this.chatSrv.getAllRoom(param).subscribe((resp: any) => {
      if (resp.Succeeded) {
        this.listRoomChat = resp.Data
      }
      this.isLoadingListRoom = false
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
        this.router.navigate([], { queryParams: { id: resp.Data.ConversationId } });
        
        if (this.userChatWith.Content) this.readMessage();
      } else this.snackbarService.show('error', resp.Message);
    })

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
    //read message
    if (this.userChatWith.Content) this.readMessage();
    this.router.navigate([], { queryParams: { id: data.ConversationId } });
    this.idParam = data.ConversationId
    this.roomIdParam = '';
    this.hasId = true;
  }
  startChatRoom(data) {
    this.roomChatActive = data;
    this.router.navigate([], { queryParams: { roomId: data.id }});
    this.roomIdParam = data.id;
    this.idParam = '';
    this.hasId = true;
  }
  openTooltipSearch() {
    this.showSearch = true;
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.searchInput.nativeElement.contains(event.target)) {
        this.showSearch = false;
      }
    });
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

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.nameRoom) {
      const room = {
        name: this.nameRoom,
        userId: this.currUser.Id
      }
      this.chatSrv.addRoomChat(room).then((resp: any) => {
        if (resp.Succeeded && resp.Data) {
          this.signalRService.pushRoomToAny(resp.Data);
          this.closeModal();
        } else this.errAddRoom = resp.Message
      })
    } else this.snackbarService.show('warning', 'Mời nhập tên phòng chat!');
  }

  closeModal() {
    this.flagModalAddRoom = false;
    this.nameRoom = '';
  }

  flagMenuLeft() {
    this.flagMenu = !this.flagMenu;
    this.store.dispatch(setFlagMenu({newValue: this.flagMenu}));
  }
}
