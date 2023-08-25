import { ComponentFixture, TestBed, async, waitForAsync } from '@angular/core/testing';
import { UnitTestComponent } from './unit-test.component';
import { AppComponent } from 'src/app/app.component';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Chat_v2Component } from '../chat_v2/chat_v2.component';


describe('UnitTestComponent', () => {
  let component: UnitTestComponent;
  let fixture: ComponentFixture<UnitTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnitTestComponent,
        AppComponent
      ],
    });

    fixture = TestBed.createComponent(UnitTestComponent);
    component = fixture.componentInstance;
  });

  //  DOM Manipulations
  it('should increase counter when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    const counterElement = fixture.nativeElement.querySelector('p');

    button.click();
    fixture.detectChanges();

    expect(counterElement.textContent).toContain('1');
  });
});




// test router
// describe('Routing Navigation', () => {
//   let router: Router;
//   let location: Location;
//   let fixture: ComponentFixture<AppComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule.withRoutes([
//         { path: 'chat', component: Chat_v2Component }
//       ])],
//       declarations: [AppComponent, Chat_v2Component],
//     });

//     router = TestBed.inject(Router);
//     location = TestBed.inject(Location);

//     fixture = TestBed.createComponent(AppComponent);
//     router.initialNavigation(); // Kích hoạt việc routing ban đầu
//   });

//   it('should navigate to chat component', waitForAsync(() => {
//     router.navigate(['/chat']).then(() => {
//       expect(location.path()).toBe('/chat');
//       expect(fixture.componentInstance).toBeInstanceOf(Chat_v2Component);
//     });
//   }));
// });

