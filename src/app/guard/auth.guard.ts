import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private _authService: AuthServiceService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (window.innerWidth <= 768 && state.url.includes('web')) {
            var currentUrl = state.url;
            currentUrl = currentUrl.replace('web', 'mobile');
            this._router.navigateByUrl(currentUrl);

        } else if (window.innerWidth > 768 && state.url.includes('mobile')){
            var currentUrl = state.url;
            currentUrl = currentUrl.replace('mobile', 'web');
            this._router.navigateByUrl(currentUrl);
        }

        if (this._authService.IsLoggedIn()) {
            return true;
        }
        else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}
