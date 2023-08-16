import { Component, OnInit, NgZone, Renderer2  } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currUser :any = localStorage.getItem('account') || null;
  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);
    this.ngZone.run(() => { });
  }

  logout() {
    localStorage.clear();
    window.location.reload();   
  }
}
