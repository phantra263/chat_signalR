/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Chat_v2Component } from './chat_v2.component';

describe('Chat_v2Component', () => {
  let component: Chat_v2Component;
  let fixture: ComponentFixture<Chat_v2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Chat_v2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chat_v2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
