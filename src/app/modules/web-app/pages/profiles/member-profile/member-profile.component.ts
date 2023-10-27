import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {LoginDetails} from '@core/models';
import {AuthService, LanguageService} from '@core/services';


declare var $: any;

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css'],
})

export class MemberProfileComponent implements OnInit {
  language: any;
  submitted: boolean = false;
  c_password: boolean = false;
  database_id: number;
  team_id: number;
  member_id: number;
  userData: LoginDetails;
  memberPhoto: string;
  displayError: boolean;
  profile_data: string;
  birthdateStatus: string;
  user: string;

  constructor(
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private lang: LanguageService,
    private sanitizer: DomSanitizer
  ) {}

    ngOnInit(): void {
        this.language = this.lang.getLanguageFile();
        this.database_id = this.route.snapshot.params.database_id;
        this.team_id = this.route.snapshot.params.team_id;
        this.member_id = this.route.snapshot.params.member_id;
        this.getMemberProfileData();
    }

    getMemberProfileData() {
        if (sessionStorage.getItem('token')) {
            this.displayError = false;
            let userData = JSON.parse(localStorage.getItem('user-data'));
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'member-info/' + this.database_id + '/' + this.team_id + '/' + this.member_id, userData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['success'] == false) {
                    setTimeout(() => {
                        this.displayError = true;
                    }, 3000);
                } else {
                    this.birthdateStatus = respData['shareBirthday'];
                    this.authService.setLoader(true);
                    this.authService.memberSendRequest('get', 'profile-info/' + this.database_id + '/' + this.team_id + '/' + this.member_id, userData).subscribe((resp: any) => {
                        this.authService.setLoader(false);
                        if (resp) {
                            this.profile_data = resp;
                        } else {
                            setTimeout(() => {
                                this.displayError = true;
                            }, 3000);
                        }
                    });
                }
            });
        }
    }

    getUserImage() {
        if (sessionStorage.getItem('token')) {
            let userData = JSON.parse(localStorage.getItem('user-data'));
            this.authService.setLoader(true);
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                this.memberPhoto = respData;
            });
        }
    }
}
