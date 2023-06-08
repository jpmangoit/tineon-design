import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ClubDetail, LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-m-header',
    templateUrl: './m-header.component.html',
    styleUrls: ['./m-header.component.css']
})

export class MHeaderComponent implements OnInit {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    clubData: ClubDetail;
    setTheme: ThemeType;
    isActive: string = "dashboard";
    userRoleInfo: string;
    isUpcomingCourse: boolean = true;
    private activatedSub: Subscription;
    isClassAdded = false;
    isSetupClass = false;
    isMoreClass = false;
    thumbnail: SafeUrl = null;
    userRespData: string;

    constructor(
        private _router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        private authService: AuthServiceService,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer,
        ) { }

    ngOnInit(): void {
        this.setTheme = null;
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole = this.userDetails.roles[0];
        this.userRoleInfo = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        this.getUserImage();
        this.getClubData();
    }

    getClubData() {
        if (sessionStorage.getItem('token')) {
            let userData = JSON.parse(localStorage.getItem('user-data'));
            this.clubData = userData.Club;
        }
    }

      /**
    * FUnction to get a login user image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object}  login user image
    */
    getUserImage() {
        if (sessionStorage.getItem('token')) {
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.userDetails.member_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'].message, null);
                        } else {
                            this.userRespData = respData;
                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                            localStorage.setItem('profile-image', JSON.stringify(respData.changingThisBreaksApplicationSecurity));
                        }
                    }
                );
        }
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this._router.navigate(["/login"]);
    }

    onClickToggleClass(dropdownName){
        if(dropdownName == 'community'){
            this.isClassAdded = !this.isClassAdded;
            this.isSetupClass = false;
            this.isMoreClass = false;
        }else if(dropdownName == 'setup'){
            this.isSetupClass = !this.isSetupClass;
            this.isClassAdded = false;
            this.isMoreClass = false;
        }else if(dropdownName == 'more'){
            this.isMoreClass = !this.isMoreClass;
            this.isClassAdded = false;
            this.isSetupClass = false;
        }
    }
}
