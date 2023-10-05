import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../service/auth-service.service';

@Injectable({
    providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
    constructor(
        public authService: AuthServiceService,
        private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.IsLoggedIn()) {
            this.router.navigate(['/web/dashboard']);
            return false;
        }
        return true;
    }

}
