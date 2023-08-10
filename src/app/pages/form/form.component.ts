import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  nickName: string = '';
  err: string = '';
  constructor(
    private authService: ChatService,
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  onEnterKeyPressed(event) {
    event.preventDefault();
    if (this.nickName) { this.login();}
  }

  login() {
    this.authService.login(this.nickName).subscribe((resp: any) => {
      if (resp.Succeeded) {
        sessionStorage.setItem('account', JSON.stringify(resp.Data));
        window.location.reload();
      } else {
        this.err = resp.Message;
      }
    })
  }
}
