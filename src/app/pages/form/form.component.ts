import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  nickname: string = '';
  password: string = '';
  errNickName: string = '';
  errPass: string = '';
  listColor: any = ['#cc4b37', '#ffae00', '#3adb76', '#767676', '#1779ba', '#ff1500', '#a98a30', '#00b30f'];
  activeColor: string = this.listColor[0];
  flagSignUp: boolean = true;
  err: string = '';
  showPassword: boolean = false;

  form: FormGroup;
  constructor(
    private authService: ChatService,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.form.valid) {
      const nickname = this.form.get('nickname').value;
      const password = this.form.get('password').value;

      const acc = {
        nickname: nickname,
        AvatarBgColor: this.activeColor,
        password: password
      }

      const type = this.flagSignUp ? 'Register' : 'Authenticate'

      this.authService.authen(acc, type).then((resp: any) => {
        if (resp.Succeeded) {
          localStorage.setItem('account', JSON.stringify(resp.Data));
          window.location.reload();
        } else {
          this.err = resp.Message;
        }
      })
    }
  }

  flag() {
    this.err = '';
    this.flagSignUp = !this.flagSignUp;
    this.showPassword = false;
    this.form.reset();
  }
}
