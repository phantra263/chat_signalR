import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AppGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        return this.canLoad();
    }

    canLoad() {
        if (!this.authService.currentUser) {
            this.router.navigate(['/login']);
            console.log(1321313)
        }
        return true;
    }
}
