import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {LoginDetails} from '@core/models';
import {AuthService, CommonFunctionService, LanguageService, NotificationService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';


@Component({
    selector: 'app-mprofile-qr',
    templateUrl: './mprofile-qr.component.html',
    styleUrls: ['./mprofile-qr.component.css'],
    providers: [DatePipe]

})
export class MprofileQrComponent implements OnInit {
    userRespData: string;
    thumbnail: string;
    userDetails: LoginDetails;
    responseMessage: string = '';
    language: any;
    userInfo:any;
    constructor(private lang: LanguageService,
        public authService: AuthService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private datePipe: DatePipe,
        private notificationService: NotificationService,
        private confirmDialogService: ConfirmDialogService,
        private commonFunctionService: CommonFunctionService,

        ) { }

    ngOnInit(): void {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if (this.userDetails['qrcode_url']) {
            this.userDetails['qrcode_url'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.userDetails['qrcode_url'].substring(20)));
        }

        this.language = this.lang.getLanguageFile();
        this.getUserImage();
        this.getProfileData()
    }


    getUserImage() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'].message,null);
                        } else {
                            this.userRespData = respData;
                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                        }
                    }
                );
        }
    }

    getProfileData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse( localStorage.getItem('user-data') );
            this.authService.setLoader(true);
            this.authService.memberSendRequest( 'get', 'member-info/' + userData.database_id + '/' + userData.team_id + '/' +userData.member_id, userData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                this.userInfo = respData;
            });
        }
    }


}
