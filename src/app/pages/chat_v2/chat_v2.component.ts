import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat_v2',
  templateUrl: './chat_v2.component.html',
  styleUrls: ['./chat_v2.component.scss']
})
export class Chat_v2Component implements OnInit {

  hasId: boolean = false;
  showSearch: boolean = false;
  listSearch: any = [];
  inputSearch: string = '';
  currUser :any = sessionStorage.getItem('account');
  filterParams = {
    SenderId: '',
    ReceiverId: '',
    PageNumber: 1,
    PageSize: 10
  }
  constructor(
    private route: ActivatedRoute,
    private chatSrv: ChatService
    ) {}

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);
    this.hasId = this.route.snapshot.firstChild?.paramMap.has('id');
  }
  search() {
    this.showSearch = true;
    if (this.inputSearch) {
      this.chatSrv.search(this.inputSearch).subscribe((resp: any) => {
        if (resp.Succeeded) {
          this.listSearch = resp.Data
        }
      })
    }
  }
  onInputFocusOut(e) {
    // this.showSearch = false; 
  }
  startChat(data) {
    console.log(this.currUser);
    this.filterParams = {
      ...this.filterParams,
      SenderId: this.currUser.Id,
      ReceiverId: data.Id,
      PageNumber: 1,
      PageSize: 10
    }
    this.chatSrv.GetMessageBox(this.filterParams).subscribe((resp: any) => {
      console.log(resp);
    })
  }
}
