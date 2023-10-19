import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {Subscription} from 'rxjs';
import {LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


declare var $: any;

@Component({
    selector: 'app-mclubwall',
    templateUrl: './mclubwall.component.html',
    styleUrls: ['./mclubwall.component.css']
})
export class MclubwallComponent implements OnInit {
    displayNews: boolean = false;
    displayDates: boolean = false;
    displayEvents: boolean = false;

    activeClass: string = '';
    // activeClass: string = 'newsActive';
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    participateAccess: ParticipateAccess;
    styleClass: string;
    selectedClass: string;
    disabledClass: string;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    userRole: string;

    constructor(private lang: LanguageService, private router: Router, private themes: ThemeService) {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        var getParamFromUrl = this.router.url.split("/")['2'];
        if (getParamFromUrl == 'club-events') {
            this.onClick(3)
            this.displayEvents = true;

        } else if (getParamFromUrl == 'club-dates') {
            this.onClick(2)
            this.displayDates = true;

        } else {
            this.onClick(1)
            this.displayNews = true;
        }
    }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.participateAccess = this.userAccess[this.userRole].participate;
    }

    onNews() {
        this.displayNews = true;
        this.displayDates = false;
        this.displayEvents = false;
    }

    onDates() {
        this.displayNews = false;
        this.displayDates = true;
        this.displayEvents = false;
    }

    onEvents() {
        this.displayNews = false;
        this.displayDates = false;
        this.displayEvents = true;
    }
    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "newsActive" : check == 2 ? "dateActive" : check == 3 ? "eventActive" : "newsActive";
    }
}
