import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
import {ClubDetail, LoginDetails, ThemeType} from '@core/models';
import {AuthServiceService, LanguageService, NotificationService, ThemeService} from '@core/services';


@Component({
    selector: 'app-profile-club',
    templateUrl: './profile-club.component.html',
    styleUrls: ['./profile-club.component.css'],
})
export class ProfileClubComponent implements OnInit, OnDestroy {
    language: any;
    displayGeneral: boolean;
    displayPayment: boolean;
    displayMaster: boolean = true;
    displayClub: boolean;
    clubData: ClubDetail;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: true
    }
    userData: any;
    responseMessage: any;
    memberPhoto: any;
    thumbnail: any;
    userDetails: any;
    role: string;
    headline_word_option: number = 0;

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private notificationService: NotificationService

    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.authService.setLoader(true);
        this.getClubData();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option =parseInt(localStorage.getItem('headlineOption'));

        this.getProfileData();
        this.getUserImage();

    }

    getClubData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(
                localStorage.getItem('user-data')
            );
            this.clubData = userData.Club;
            this.authService.setLoader(false);
        }
    }

    onGeneralInfo() {
        this.displayGeneral = true;
        this.displayPayment = false;
        this.displayMaster = false;
        this.displayClub = false;
    }

    onPaymentData() {
        this.displayGeneral = false;
        this.displayPayment = true;
        this.displayMaster = false;
        this.displayClub = false;
    }

    onMasterData() {
        this.displayGeneral = false;
        this.displayPayment = false;
        this.displayMaster = true;
        this.displayClub = false;
    }

    onClubData() {
        this.displayGeneral = false;
        this.displayPayment = false;
        this.displayMaster = false;
        this.displayClub = true;
    }

    getUserImage() {
        if (sessionStorage.getItem('token') ) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'].message,null);
                    } else {
                        this.memberPhoto = respData;
                        this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;

                    }
                }
            );
        }
    }

    getProfileData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(
                localStorage.getItem('user-data')
            );
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get','member-info/' + userData.database_id + '/' + userData.team_id + '/' + userData.member_id,userData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                this.userDetails = respData;
                this.role = userData.roles[0];
            });
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
