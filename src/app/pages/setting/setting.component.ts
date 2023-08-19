import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select  } from '@ngrx/store';
import { selectVariable1, selectVariable2 } from 'src/app/selectors/app.selectors';
import { setVariable1, setVariable2 } from 'src/app/actions/app.actions';

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
    this.store.pipe(select(selectVariable1)).subscribe(data => {
      this.activeColor = data; 
    });
    this.store.pipe(select(selectVariable2)).subscribe(data => {
      this.activeBgTheme = data; 
    });
  }

  changeColorMenu(data) {
    this.activeColor = data
    this.store.dispatch(setVariable1({ newValue: data }));
  }

  changeBgTheme(data) {
    this.activeBgTheme = data;
    this.store.dispatch(setVariable2({ newValue: data }));
  }

  closeSetting() {
    this.closeSetting$.emit();
  }

}
