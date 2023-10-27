import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess } from '@core/models';
import { AuthService, LanguageService, ThemeService } from '@core/services';
import { appSetting } from '@core/constants';

declare var $: any;

@Component({
    selector: 'app-club-wall',
    templateUrl: './club-wall.component.html',
    styleUrls: ['./club-wall.component.css']
})

export class ClubWallComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    displayNews: boolean = false;
    displayDates: boolean = false;
    displayEvents: boolean = false;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    userRole: string;

    // isLoading: boolean = true;
    // Set the number of child components that should load data
    totalChildComponents = 2;
    loadedChildComponents = 0;
    showButtonBox: boolean = false;


    constructor(private lang: LanguageService, public authService: AuthService, private router: Router, private themes: ThemeService) {
        this.authService.setLoader(true);
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        var getParamFromUrl = this.router.url.split("/")['2'];
        if (getParamFromUrl == 'club-events') {
            this.displayEvents = true;

        } else if (getParamFromUrl == 'club-dates') {
            this.displayDates = true;

        } else {
            this.displayNews = true;
        }
    }

    onChildDataLoaded() {
        this.loadedChildComponents++;
        // Check if all child components have loaded data
        if (this.loadedChildComponents === this.totalChildComponents) {
            // this.isLoading = false; // Set the loading state to false
            this.authService.setLoader(false);
        }
    }

    ngOnInit(): void {
        this.authService.setLoader(true);
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data') || '');
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[this.userRole].create;
        this.participateAccess = this.userAccess[this.userRole].participate;
    }

    isClubEventsRoute(): boolean {
        // Check if the current route is '/clubwall/club-events'
        return this.router.url === '/web/clubwall/club-events';
    }

    isClubNewsRoute(): boolean {
        // Check if the current route is '/clubwall/club-events'
        return this.router.url === '/web/clubwall/club-news';
    }

    isClubDatesRoute(): boolean {
        // Check if the current route is '/clubwall/club-events'
        return this.router.url === '/web/clubwall/club-dates';
    }

    isClubwall(): boolean {
        // Check if the current route is '/clubwall/club-events'
        return this.router.url === '/web/clubwall';
    }


    /**
    * Function is used to display news tab
    * @author  MangoIt Solutions
    */
    onNews() {
        // this.authService.setLoader(true);
        this.displayNews = true;
        this.displayDates = false;
        this.displayEvents = false;
    }

    /**
    * Function is used to display dates tab
    * @author  MangoIt Solutions
    */
    onDates() {
        this.displayNews = false;
        this.displayDates = true;
        this.displayEvents = false;
    }

    /**
    * Function is used to display event tab
    * @author  MangoIt Solutions
    */
    onEvents() {
        this.displayNews = false;
        this.displayDates = false;
        this.displayEvents = true;
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
