import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
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
    ) {}

  ngOnInit() {

    this.currUser = JSON.parse(this.currUser);
    // fetch list user chat with
    const params = {
      UserId: this.currUser.Id,
      PageNumber: 1,
      PageSize: 10
    }
    this.fetchListUser(params);

    this.route.paramMap.subscribe((params: any) => {
      this.idParam = params.get('id');
    });


    // connect signalR
    this.signalRService.startConnectChat(this.currUser.Id);
    this.signalRService.onConnected(data => {
      console.log('on', data);
    });
    this.signalRService.onDisconnected(data => {
      console.log('dis', data)
    });
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
        this.router.navigate(['/chat', resp.Data.ConversationId]);
      }
    })

    this.selectedIndex = -1;
    this.listSearch = [];
    this.showSearch = false;
    this.inputSearch = '';
  }
  startChat(data) {
    this.userChatWith = data;
    this.router.navigate(['/chat', data.ConversationId]);
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
}
