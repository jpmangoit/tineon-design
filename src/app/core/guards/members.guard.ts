import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {LoginDetails} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class MembersGuard implements CanActivate {
  constructor(private _router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var userDetails:LoginDetails = JSON.parse(localStorage.getItem('user-data'));
      var userRole = userDetails.roles[0];
        if(userRole == 'member'){
          this._router.navigate(['/dashboard']);
          return false;

        }else{
          return true;
        }
  }

}
