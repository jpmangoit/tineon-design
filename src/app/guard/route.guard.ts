import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { appSetting } from '../app-settings';
import { Location } from '@angular/common';
import { LoginDetails } from '../models/login-details.model';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private _router: Router,private _location:Location){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // var userAccess = appSetting.role;
      // var createAcc = userAccess[userRole];
      // var createAccess = userAccess[userRole].create;
      var userDetails:LoginDetails = JSON.parse(localStorage.getItem('user-data'));
      var userRole = userDetails.roles[0];

        // if(userRole == 'guest'){
        //   this._location.back();
        //   return false;

        // }else{
        // }
        return true;
  }

}
