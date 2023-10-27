import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
import {LoginDetails, ProfileDetails, ThemeType} from '@core/models';
import {AuthService, LanguageService, NotificationService, ThemeService} from '@core/services';


@Component({
    selector: 'app-profile-my-club',
    templateUrl: './profile-my-club.component.html',
    styleUrls: ['./profile-my-club.component.css'],
})
export class ProfileMyClubComponent implements OnInit, OnDestroy {
    language: any;
    crntFunctions: boolean = false;
    private activatedSub: Subscription;
    displayGeneral: boolean;
    displayPayment: boolean;
    displayMaster: boolean;
    displayClub: boolean = true;
    setTheme: ThemeType;
    clubData: ProfileDetails;
    getclubInfo: ProfileDetails;
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
    userDetails: any;
    role: string;
    responseMessage: any;
    memberPhoto: any;
    thumbnail: any;
    headline_word_option: number = 0;

    constructor(
        private authService: AuthService,
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
        this.language = this.lang.getLanguageFile();
        this.getClubData();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option =parseInt(localStorage.getItem('headlineOption'));
        this.getUserImage();
        this.getProfileData();

    }

    getClubData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(
                localStorage.getItem('user-data')
            );
            this.authService.setLoader(true);
            this.authService
                .memberSendRequest(
                    'get',
                    'get-club-info/' + userData.database_id + '/' + userData.team_id,
                    userData
                )
                .subscribe((respData: any) => {
                    this.getclubInfo = respData;
                });
            this.authService
                .memberSendRequest(
                    'get',
                    'profile-info/' +
                    userData.database_id +
                    '/' +
                    userData.team_id +
                    '/' +
                    userData.member_id,
                    userData
                )
                .subscribe((respData: any) => {
                    this.clubData = respData;
                    this.authService.setLoader(false);
                    if (this.clubData.currentFunctions) {
                        this.crntFunctions = true;
                    }
                });
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
        if (sessionStorage.getItem('token')) {
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
                            localStorage.setItem('profile-image', JSON.stringify(respData.changingThisBreaksApplicationSecurity));
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
            this.authService
                .memberSendRequest(
                    'get',
                    'member-info/' +
                    userData.database_id +
                    '/' +
                    userData.team_id +
                    '/' +
                    userData.member_id,
                    userData
                )
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
