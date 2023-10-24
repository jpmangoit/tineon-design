import { Component, OnInit } from '@angular/core';
import {LoginDetails, ParticipateAccess, UserAccess} from '@core/models';
import {LanguageService} from '@core/services';
import {appSetting} from '@core/constants';

@Component({
    selector: 'app-mcrm-survey',
    templateUrl: './mcrm-survey.component.html',
    styleUrls: ['./mcrm-survey.component.css']
})
export class McrmSurveyComponent implements OnInit {

    displaySurvey: boolean = true;
    displayVotes: boolean = false;
    displayComvotes: boolean = false;
    activeClass: string = 'surveyActive';
    language: any;
	participateAccess: ParticipateAccess;
    userAccess: UserAccess;
    userDetails: LoginDetails;
    userRole: string;
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

    constructor(
        private lang: LanguageService
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.userRole = this.userDetails.roles[0];
		this.userAccess = appSetting.role;
		this.participateAccess = this.userAccess[this.userRole].participate;
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "surveyActive" : check == 2 ? "voteActive" : check == 3 ? "comvoteActive" : "surveyActive";
    }

}
