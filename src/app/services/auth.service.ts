import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly JWT_TOKEN = environment.JWT_TOKEN;
  public readonly LOGIN_INFO = environment.LOGIN_INFO;

  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();

  decodedToken: any;
  currentUser: any = {
    id: "4A62A822-0667-4E68-996A-501209329832",
    userName: "A013",
    email: "vinhhq@esuhai.com",
    firstName: "Vinh",
    lastName: "Huỳnh Quang",
    avatar: "https://picsum.photos/50/50",
    lastMess: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới",
    lastTimeMess: '2023-07-26T08:07:43.127'
  };

  constructor(private http: HttpClient, private router: Router) { }

  loginWithLdap(model: any): Observable<any> {
    let url = this.baseUrl + "/api/Account/authenticate";
    return this.http.post(url, model);
  }

  loggedIn() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    const hrmUser = localStorage.getItem(this.LOGIN_INFO);

    try {
      this.decodedToken = this.jwtHelper.decodeToken(token!);
      this.currentUser = JSON.parse(hrmUser!);
      return token ? true : false;
    }
    catch (error) {
      return false;
    }

  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;

    if (this.roleMatch) {
      const userRoles = this.decodedToken.roles as Array<string>;
      allowedRoles.forEach(element => {
        if (userRoles.includes(element)) {
          isMatch = true;
        }
      });
    }

    return isMatch;
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN); //sessionStorage.getItem(this.JWT_TOKEN);
  }

  isLogged() {
    const token = localStorage.getItem(this.LOGIN_INFO);
    return token ? true : false;
  }

  refreshToken() {
    let dataForRefresh = {
      accessToken: localStorage.getItem(this.JWT_TOKEN),//sessionStorage.getItem(this.JWT_TOKEN),
      refreshToken: this.currentUser.refreshToken
    }

    let url = this.baseUrl + "/api/Account/Refresh";

    return this.http.post<any>(url, dataForRefresh).pipe(tap((tokens: any) => {
      if (tokens.succeeded) {
        localStorage.setItem(this.JWT_TOKEN, tokens.data.token);
        this.decodedToken = this.jwtHelper.decodeToken(tokens.data.token);
      } else {
        this.logout();
      }
    }), catchError(
      (error: HttpErrorResponse): any => {
        this.logout();
      }
    ));
  }

  login(model: any) {

    let promise = new Promise((resolve: any) => {

      let url = this.baseUrl + "/api/Account/authenticate"
      this.http.post(url, model).toPromise().then((rs: any) => {
        if (rs.succeeded) {
          const user = rs.data;
          if (user) {

            localStorage.setItem(this.LOGIN_INFO, JSON.stringify(user));
            localStorage.setItem(this.JWT_TOKEN, user.jwToken);

            this.decodedToken = this.jwtHelper.decodeToken(user.jwToken);
            this.currentUser = user;
          }
          resolve(true);
        }
        else {
          resolve(false);
        }
      }).catch((err) => {
        console.log(err);
        resolve(null);
      });
    });
    return promise;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.LOGIN_INFO);
    this.decodedToken = null;
  }

}