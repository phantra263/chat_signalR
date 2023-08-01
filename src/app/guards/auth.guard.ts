import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private notificationSrv: NzNotificationService) { }

  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/hinhanh']);
      return true;
    }
    return false;
  }
  
  processError(oError: any) {
    if (oError.error) {
      this.notificationSrv.error(oError.statusText, oError.error.Message);
      this.router.navigate(['/page/' + oError.status]);
    } else {
      this.router.navigate(['/page/404']);
    }
  }
}