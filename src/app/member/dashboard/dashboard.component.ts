import { Component, OnDestroy, OnInit } from '@angular/core';
import { appSetting } from '../../app-settings';
import { LanguageService } from '../../service/language.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription, interval } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CrmNews } from 'src/app/models/crm-news.model';
import { CrmSurvey } from 'src/app/models/crm-survey.model';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/service/notification.service';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    clubNewsCount: number = 0;
    communityCount: number = 0;
    organizerCount: number = 0;
    setTheme: ThemeType;
    showEventList = false;
    showCalendar = true;
    newsForm: UntypedFormGroup;
    surveyForm: UntypedFormGroup;
    newsData: CrmNews[] = [];
    surveyData: CrmSurvey[] = [];
    responseMessage: string = '';
    userRespData: string;
    thumbnail: string;
    private activatedSub: Subscription;
    private activatedPro: Subscription;
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
                items: 1
            },
            740: {
                items: 1
            },
            940: {
                items: 1
            }
        },
        nav: true
    }
    bannerData: [];
    eventData: [];
    courseData: [];
    allowAdvertisment:any;
    isData: boolean = true;

    constructor(private lang: LanguageService, private themes: ThemeService, private notificationService: NotificationService,
        private authService: AuthServiceService, private sanitizer: DomSanitizer, public formBuilder: UntypedFormBuilder) { }

    ngOnInit(): void {
        console.log(localStorage.getItem('token'));
        if (localStorage.getItem('token') != null) {
            interval(25 * 60 * 1000).pipe(take(1))   // it will run after every 25 minute
             .subscribe(() => {
                this.refreshTokens();
              });
        }
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.activatedPro = this.themes.profile_imge.subscribe(
            (resp: string) => { this.getUserImage(); }
        );
        this.language = this.lang.getLanguaageFile();
        let userId: string = localStorage.getItem('user-id');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.allowAdvertisment = localStorage.getItem('allowAdvertis')
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;

        this.authService.memberSendRequest('get', 'numberOfPostEventsMessage/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false) {
                        this.clubNewsCount = respData.result.posts;
                        this.organizerCount = respData.result.events;
                        this.communityCount = respData.result.message;
                    }
                }
            );

        let eventUrl: string;
        if (userRole == 'guest') {
            eventUrl = 'openevents/';
        } else {
            eventUrl = 'approvedEvents/user/' + userId;
        }
        this.authService.memberSendRequest('get', eventUrl, null)
            .subscribe(
                (respData: any) => {
                    this.eventData = respData;
                }
            );
        this.authService.memberSendRequest('post', 'allCourses', null)
            .subscribe(
                (respData: any) => {
                    this.courseData = respData['result'];
               }
            );
        this.getUserImage();
        if(this.allowAdvertisment == 0){
            this.getDesktopDeshboardBanner();
        }
    }

    refreshTokens(){
        console.log('Old Access Token');
        console.log(localStorage.getItem('token'));
        console.log('Old Refresh Token');
        console.log(localStorage.getItem('refresh_token'));

        const refreshToken = localStorage.getItem('refresh_token');
        let data:any = {
            refresh_token : refreshToken
        }
        this.authService.memberSendRequest('post', 'refresh-token', data)
        .subscribe(
            (respData: any) => {
                console.log(respData);
                if (respData['isError'] == false) {
                    this.authService.setLoader(false);
                    // localStorage.setItem('token','');
                    // localStorage.setItem('refresh_token','');
                        sessionStorage.setItem('token', respData['result']['access_token']);
                        localStorage.setItem('token', respData['result']['access_token']);

                        sessionStorage.setItem('refresh_token', respData['result']['refresh_token']);
                        localStorage.setItem('refresh_token', respData['result']['refresh_token']);

                    console.log('New Access Token');
                    console.log(localStorage.getItem('token'));

                    console.log('New Refresh Token');
                    console.log(localStorage.getItem('refresh_token'));

                } else if (respData['code'] == 400 || respData['code'] == 404) {
                    this.authService.setLoader(false);
                };
            },
            (error: any) => {
              // Handle error if token refresh fails
            }
        );
    }

    /**
    * Function is used to show and hide event list and event calender
    * @author  MangoIt Solutions
    */
    showEvents(item: any) {
        if (item.value == 'showEventList') {
            this.showEventList = true;
            this.showCalendar = false;
        } else if (item.value == 'showCalendar') {
            this.showEventList = false;
            this.showCalendar = true;
        }
    }

    /**
    * FUnction to get a login user image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the images
    */
    getUserImage() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
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

    /**
    * FUnction is used to get Desktop Deshboard Banner
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the Banner
    */
    getDesktopDeshboardBanner(){
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForDashboard_Desktop/', null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.bannerData = respData['result']['banner']
                    if(this.bannerData?.length > 0){
                        this.bannerData.forEach((element: any) => {
                            element['category'] = JSON.parse(element.category);
                            element['placement'] = JSON.parse(element.placement);
                            element['display'] = JSON.parse(element.display);
                            element['image'] = JSON.parse(element.image);
                            if((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))){
                                element['redirectLink'] = element.redirectLink;
                            }else{
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        })
                    }
                }else  if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            }
        )
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
        this.activatedPro.unsubscribe();
    }
}
