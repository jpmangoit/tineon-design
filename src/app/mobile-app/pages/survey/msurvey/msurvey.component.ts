import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
declare var $: any;

@Component({
    selector: 'app-msurvey',
    templateUrl: './msurvey.component.html',
    styleUrls: ['./msurvey.component.css']
})

export class MsurveyComponent implements OnInit {
    displaySurvey: boolean = true;
    displayVotes: boolean = false;
    displayComvotes: boolean = false;
    activeClass: string = 'surveyActive';
    language: any;
    userDetails: LoginDetails;
    userRole: string;
    responseMessage: string;
    displayActiveSurvey: boolean = true;
    displayMySurvey: boolean = false;
    displayCompletedSurvey: boolean = false;
    setTheme: ThemeType;

    private activatedSub: Subscription;
    Activesurvey() {
        this.displaySurvey = true;
        this.displayVotes = false;
        this.displayComvotes = false;
    }

    Myvotes() {
        this.displaySurvey = false;
        this.displayVotes = true;
        this.displayComvotes = false;
    }

    Completedvotes() {
        this.displaySurvey = false;
        this.displayVotes = false;
        this.displayComvotes = true;
    }

    constructor(private authService: AuthServiceService, private themes: ThemeService,
        private lang: LanguageService, private confirmDialogService: ConfirmDialogService) { }

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
        this.userRole = this.userDetails.roles[0];
        this.authService.setLoader(false);
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "surveyActive" : check == 2 ? "voteActive" : check == 3 ? "comvoteActive" : "surveyActive";
    }
}
