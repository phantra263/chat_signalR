import { Component, Input,OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  @Input() modalVisible: boolean = false;
  @Output() closeModal$ = new EventEmitter();

  ngOnInit() {
  }

  closeModal() {
    this.closeModal$.emit();
  }
}