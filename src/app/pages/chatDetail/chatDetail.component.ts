import { Component, Input, OnInit, Renderer2  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chatDetail',
  templateUrl: './chatDetail.component.html',
  styleUrls: ['./chatDetail.component.scss']
})
export class ChatDetailComponent implements OnInit {
  userChatWith: any;
  inputChat: string = '';
  toggled: boolean = false;
  idParam: string = '';
  currUser :any = localStorage.getItem('account');
  listMessage: any = [];
  filterParam: any = {
    UserId: '',
    ConversationId: '',
    PageNumber: 1,
    PageSize: 10
  }

  constructor(
    private route: ActivatedRoute,
    private ChatSrv: ChatService,
    ) { }

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);
    this.route.paramMap.subscribe(params => {
      this.idParam = params.get('id');
      this.filterParam = {
        ...this.filterParam,
        UserId: this.currUser.Id,
        ConversationId: this.idParam
      }
      this.ChatSrv.Messages(this.filterParam).subscribe((resp: any) => {
        if (resp.Succeeded) {
          this.listMessage = resp.Data.Messages
          this.userChatWith = {
            ...this.userChatWith,
            AvatarBgColor: resp.Data.AvatarBgColor,
            Nickname: resp.Data.Nickname,
            Id: resp.Data.Id,
            IsOnline: resp.Data.IsOnline
          }
        }
      })

    });
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
    return (objCurrent.senderName !== objPre.senderName
      || (objCurrent.senderName === objPre.senderName && this.checkTime(objCurrent.timming, objPre.timming)))
  }

}
