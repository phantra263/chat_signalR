import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectColorTheme } from './selectors/app.selectors';
import { AppState } from './states/app.state';
import { setColorTheme, setBgTheme } from './actions/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currUser :any = localStorage.getItem('account') || null;
  colorMenu$ = this.store.pipe(select(selectColorTheme));
  flagSetting: boolean = false;
  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.currUser = JSON.parse(this.currUser);
    const savedState = localStorage.getItem('colorTheme');
    if (savedState) {
      this.store.dispatch(setColorTheme({ newValue: savedState }));
    }
  }

  logout() {
    localStorage.removeItem('account');
    window.location.reload();   
  }

  getClassNameFromColor(color: string): string {
    return `color-${color}`;
  }
}
