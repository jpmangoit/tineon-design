import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { appSetting } from 'src/app/app-settings';
import { LoginDetails } from 'src/app/models/login-details.model';
import { CreateAccess, UserAccess } from 'src/app/models/user-access.model';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-action-tool',
  templateUrl: './action-tool.component.html',
  styleUrls: ['./action-tool.component.css']
})
export class ActionToolComponent {

    createAccess:CreateAccess;
    userAccess:UserAccess;
    userDetails:LoginDetails;
    language: any;

  constructor(private _bottomSheetRef: MatBottomSheetRef<ActionToolComponent>,  private lang: LanguageService,) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit(): void {
    this.language = this.lang.getLanguaageFile();
    this.userDetails = JSON.parse(localStorage.getItem('user-data'));
    let userRole:any = this.userDetails.roles
    this.userAccess = appSetting.role;
    this.createAccess = this.userAccess[userRole].create;
  }

}
