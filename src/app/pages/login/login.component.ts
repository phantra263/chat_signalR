import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  loading = false;

  jwtHelper = new JwtHelperService();
  private readonly JWT_TOKEN = environment.JWT_TOKEN;
  private readonly LOGIN_INFO = environment.LOGIN_INFO;

  constructor(private fb: FormBuilder, public authService: AuthService,
    private notificationSrv: NzNotificationService, private router: Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  ngLogin() {
    this.loading = true;

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let acc = {
        email: this.validateForm.controls['userName'].value,
        password: this.validateForm.controls['password'].value
      }

      this.authService.loginWithLdap(acc).subscribe((resp: any) => {

        if (resp.succeeded) {
          localStorage.setItem(this.LOGIN_INFO, JSON.stringify(resp.data));
          localStorage.setItem(this.JWT_TOKEN, resp.data.jwToken);

          this.authService.decodedToken = this.jwtHelper.decodeToken(resp.data.jwToken);
          this.authService.currentUser = this.jwtHelper.decodeToken(resp.data.jwToken);

          this.loading = false;
          this.router.navigate(['/hinhanh']);
          window.location.reload();

        } else {
          this.loading = false;
          this.notificationSrv.error('Login thất bại', resp.message);
        }
      });
    } else {
      this.notificationSrv.error('Error', 'Thông tin không hợp lệ');
      this.loading = false;
    }
  }
}
