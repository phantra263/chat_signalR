import { Component, OnInit, NgZone, Renderer2, HostListener , ElementRef } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectVariable1 } from './selectors/app.selectors';
import { AppState } from './states/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currUser :any = localStorage.getItem('account') || null;
  colorMenu$ = this.store.pipe(select(selectVariable1));
  flagSetting: boolean = false;
  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);
  }

  logout() {
    localStorage.clear();
    window.location.reload();   
  }

  getClassNameFromColor(color: string): string {
    return `color-${color}`;
  }
}
