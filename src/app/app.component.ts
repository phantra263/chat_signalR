import { Component, OnInit, NgZone  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currUser :any = sessionStorage.getItem('account') || null;
  constructor() {}

  ngOnInit() {
  }
}
