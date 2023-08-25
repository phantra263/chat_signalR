import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { of } from 'rxjs';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from 'src/app/services/chat.service';

// directive, component
describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let chatServiceMock: any;

  beforeEach(waitForAsync(() => {
    chatServiceMock = jasmine.createSpyObj('ChatService', ['authen']); //Đối tượng này sẽ được sử dụng để giả lập dịch vụ ChatService trong quá trình kiểm thử
    chatServiceMock.authen.and.returnValue(of({ Succeeded: true, Data: {} })); // khi authen được gọi trong các kiểm thử, nó sẽ trả về một luồng dữ liệu RxJS (Observable) với một giá trị giả mạo.


    // cấu hình môi trường kiểm thử bằng cách sử dụng TestBed
    TestBed.configureTestingModule({ 
      imports: [ReactiveFormsModule],
      declarations: [FormComponent],
      providers: [{ provide: ChatService, useValue: chatServiceMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Chuẩn bị môi trường để thực hiện các kiểm tra liên quan đến giao diện và hành vi của FormComponent.
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  // Kiểm thử xác thực form (cơ bản)
  it('should invalid if the form has empty fields', () => {
    const form = component.form;
    form.controls['nickname'].setValue('@12324');
    form.controls['password'].setValue('password');

    expect(component.form.valid).toBeFalsy();
  });


  // Kiểm thử logic (cơ bản)
  it('should set flagSignUp to false when flag() is called', () => {
    component.flag();
    expect(component.flagSignUp).toBe(false);
  });

  // Kiểm thử logic (cơ bản)
  it('should reset form and clear error when flag() is called', () => {
    component.form.get('nickname').setValue('test');
    component.form.get('password').setValue('password');
    component.err = 'Some error message';

    component.flag();

    expect(component.form.value).toEqual({ nickname: null, password: null });
    expect(component.err).toBe('');
  });

  // Mô phỏng service khi test component trong angular
  it('should call authService.authen with correct parameters on form submission', () => {
    const authService = TestBed.inject(ChatService);
    const expectedNickname = 'testNickname';
    const expectedPassword = 'testPassword';
    const expectedColor = '#cc4b37'
    
    const form = component.form;
    form.controls['nickname'].setValue(expectedNickname);
    form.controls['password'].setValue(expectedPassword);
    fixture.detectChanges();
    
    const fakeResponse = {
      Succeeded: true,
      Data: 'fakeData',
      Message: ''
    };
    
    chatServiceMock.authen.and.returnValue(Promise.resolve(fakeResponse));

    fixture.componentInstance.onSubmit(new Event('submit'));
    
    expect(authService.authen).toHaveBeenCalledWith({
      nickname: expectedNickname,
      AvatarBgColor: expectedColor,
      password: expectedPassword
    }, 'Register');
  });
});


// Unit test cho service sử dụng HttpClient (Kiểm thử phức tạp)
describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Unit test cho service sử dụng HttpClient
  it('should call http.post with correct URL and data for registration', () => {
    const fakeResponse = { Succeeded: true, Data: {} };
    const fakeAcc = { nickname: 'testuser', AvatarBgColor: '#cc4b37', password: 'password123' };
    const fakeType = 'Register';
    const apiUser = '/api/Usersabc/'

    service.authen(fakeAcc, fakeType).then((response: any) => {
      expect(response).toEqual(fakeResponse);
    });

    // check correct url
    const req = httpMock.expectOne(`${service.baseUrl}${apiUser}${fakeType}`);
    expect(req.request.method).toBe('POST');
    req.flush(fakeResponse);
  });
});