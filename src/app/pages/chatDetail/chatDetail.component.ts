import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatDetail',
  templateUrl: './chatDetail.component.html',
  styleUrls: ['./chatDetail.component.scss']
})
export class ChatDetailComponent implements OnInit {

  inputChat: string = '';
  toggled: boolean = false;
  idParam: string = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID:', id);
    });
  }

  handleSelection(event) {
    this.inputChat += event.char;
  }
}
