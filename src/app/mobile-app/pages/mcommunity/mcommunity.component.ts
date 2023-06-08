import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LanguageService } from 'src/app/service/language.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { appSetting } from 'src/app/app-settings';

@Component({
    selector: 'app-mcommunity',
    templateUrl: './mcommunity.component.html',
    styleUrls: ['./mcommunity.component.css']
})

export class McommunityComponent implements OnInit {
    displayChats: boolean = true;
    displayMessages: boolean = false;
    displayGroups: boolean = false;
    activeClass: string = 'chatActive';
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    setTheme: ThemeType;
    private activatedSub: Subscription;

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

    constructor(private lang: LanguageService, private authService: AuthServiceService,
        private router: Router, private themes: ThemeService) {
        var getParamFromUrl: string = this.router.url.split("/")['2'];
        if (getParamFromUrl == 'community-groups') {
            this.displayGroups = true;
        } else {
            this.displayChats = true;
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
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (localStorage.getItem('backItem')) {
            if (localStorage.getItem('backItem') == 'groups') {
                localStorage.removeItem('backItem');
                this.communityGroups();
            }
        }

    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "chatActive" : check == 2 ? "messageActive" : check == 3 ? "groupActive" : "chatActive";
    }

}
