import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthorizationAccess, CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {Subscription} from 'rxjs';
import {AuthServiceService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


@Component({
    selector: 'app-mcommunity',
    templateUrl: './mcommunity.component.html',
    styleUrls: ['./mcommunity.component.css']
})

export class McommunityComponent implements OnInit, OnDestroy {
    displayChats: boolean = false;
    displayMessages: boolean = false;
    displayGroups: boolean = false;
    activeClass: string;
    // activeClass: string = 'chatActive';
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    setTheme: ThemeType;
    private activatedSub: Subscription;

    constructor(private lang: LanguageService, private authService: AuthServiceService,
        private router: Router, private themes: ThemeService) {
        if (this.router.url == '/community') {
            this.displayChats = true;
            this.onClick(1)
        } else {

            var getParamFromUrl: string = this.router.url.split("/")['2'];
            if (getParamFromUrl != undefined && (getParamFromUrl == 'groups' || getParamFromUrl == 'community-groups')) {
                this.displayGroups = true;
                this.onClick(3)
                this.communityGroups();
            } else if (getParamFromUrl == 'messages' || getParamFromUrl == 'community-messages') {
                this.displayMessages = true;
                this.onClick(2)
            } else {
                this.displayChats = true;
                this.onClick(1)
            }
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
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (localStorage.getItem('backItem')) {
            if (localStorage.getItem('backItem') == 'groups') {
                localStorage.removeItem('backItem');
                this.communityGroups();
            }
        }
    }

    /**
    * Function is used to display chat list tab
    * @author  MangoIt Solutions
    */
    chatList() {
        this.displayChats = true;
        this.displayMessages = false;
        this.displayGroups = false;
    }

    /**
    * Function is used to display message tab
    * @author  MangoIt Solutions
    */
    Messages() {
        this.displayChats = false;
        this.displayMessages = true;
        this.displayGroups = false;
    }

    /**
    * Function is used to display group tab
    * @author  MangoIt Solutions
    */
    communityGroups() {
        this.displayChats = false;
        this.displayMessages = false;
        this.displayGroups = true;
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "chatActive" : check == 2 ? "messageActive" : check == 3 ? "groupActive" : "chatActive";
    }

    ngOnDestroy() {
        this.activatedSub.unsubscribe();
    }

}
