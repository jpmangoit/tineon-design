import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {AuthServiceService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


@Component({
    selector: 'app-community',
    templateUrl: './community.component.html',
    styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    communityCount: number;
    displayMessages: boolean = false;
    displayGroups: boolean = false;
    setTheme: ThemeType;
    private activatedSub: Subscription;

    constructor(private lang: LanguageService, private authService: AuthServiceService,
        private router: Router, private themes: ThemeService) {
        var getParamFromUrl: string = this.router.url.split("/")['2'];
        if (getParamFromUrl == 'community-groups' || getParamFromUrl == 'groups' || getParamFromUrl == 'groups-joined') {
            this.displayGroups = true;
        } else {
            this.displayMessages = true;
        }
    }

    ngOnInit(): void {
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
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;

        if (localStorage.getItem('backItem')) {
            if (localStorage.getItem('backItem') == 'groups') {
                localStorage.removeItem('backItem');
                this.onGroups();
            }
        }
        if (this.participateAccess.message == 'Yes') {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'message/get-message-count', null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.communityCount = respData.value;
                    }
                );
        }
    }

    /**
    * Function is used to display message tab
    * @author  MangoIt Solutions
    */
    onMessages() {
        this.displayMessages = true;
        this.displayGroups = false;
    }

    /**
    * Function is used to display group tab
    * @author  MangoIt Solutions
    */
    onGroups() {
        this.displayGroups = true;
        this.displayMessages = false;
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
