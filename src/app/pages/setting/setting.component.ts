import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select  } from '@ngrx/store';
import { selectColorTheme, selectBgTheme } from 'src/app/selectors/app.selectors';
import { setColorTheme, setBgTheme } from 'src/app/actions/app.actions';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  listColorMenuBar: any = ['6E00FF', 'ffae00', '3adb76', '767676', '1779ba', 'ff1500', 'a98a30', '00b30f'];
  listBgTheme: any = ['bg-theme01', 'bg-theme02', 'bg-theme03', 'bg-theme04']
  activeColor:string = this.listColorMenuBar[0];
  activeBgTheme: string = this.listBgTheme[0];
  @Output() closeSetting$ = new EventEmitter();

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.pipe(select(selectColorTheme)).subscribe(data => this.activeColor = data);
    this.store.pipe(select(selectBgTheme)).subscribe(data => this.activeBgTheme = data);
  }

  changeColorMenu(data) {
    this.activeColor = data;
    this.dispatchAndSetLocalStorage(setColorTheme, 'colorTheme', data);
  }
  
  changeBgTheme(data) {
    this.activeBgTheme = data;
    this.dispatchAndSetLocalStorage(setBgTheme, 'bgTheme', data);
  }
  
  private dispatchAndSetLocalStorage(action, localStorageKey, newValue) {
    this.store.dispatch(action({ newValue }));
    localStorage.setItem(localStorageKey, newValue);
  }
  
  closeSetting() {
    this.closeSetting$.emit();
  }
}
