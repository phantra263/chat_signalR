import { Component, OnInit, NgZone  } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  isCollapsed = false;
  jwtHelper = new JwtHelperService();
  currUser: any = JSON.parse(localStorage.getItem('currentAcc')) || {
    id: "4A62A822-0667-4E68-996A-501209329832",
    userName: "A013",
    email: "vinhhq@esuhai.com",
    firstName: "Vinh",
    lastName: "Huỳnh Quang",
    avatar: "https://i.imgur.com/dXQ9pU3.png",
    lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
    lastTimeMess: '2023-07-26T08:07:43.127'
  };

  listUser: any = [
    {
      id: "4A62A822-0667-4E68-996A-501209329832",
      userName: "A013",
      email: "vinhhq@esuhai.com",
      firstName: "Vinh",
      lastName: "Huỳnh Quang",
      avatar: "https://i.imgur.com/dXQ9pU3.png",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
      lastTimeMess: '2023-07-26T08:07:43.127'
    },
    {
      id: "FC938DD7-F4ED-4CD0-A7AA-975BC0D06D67",
      userName: "S602",
      email: "trapc@esuhai.com",
      firstName: "Trà",
      lastName: "Phan Công",
      avatar: "https://i.imgur.com/244QDmq.png",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu",
      lastTimeMess: '2023-07-26T08:07:43.127'
    },
    {
      id: "FC938DD7-F4ED-4CD0-A7AA-AAAAAAAA",
      userName: "S602",
      email: "nam@esuhai.com",
      firstName: "Nam",
      lastName: "Lê Nhật",
      avatar: "https://i.imgur.com/Yb8zLX2.png",
      lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
      lastTimeMess: '2023-07-26T08:07:43.127'
    }
  ]

  listData: any = [];
  isVisibleModal: boolean = false;
  tooltipVisible: boolean = false;
  filterParams: any = {
    PageNumber: 1,
    PageSize: 10,
    Keyword: ''
  }

  constructor(
    ) {}

  ngOnInit() {
  }

  changeAccount(user) {
    this.currUser = user;
    localStorage.setItem('currentAcc', JSON.stringify(user));
    window.location.reload();
  }
}
