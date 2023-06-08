import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ParticipateAccess,UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';

declare var $: any;

@Component({
	selector: 'app-crm-survey',
	templateUrl: './crm-survey.component.html',
	styleUrls: ['./crm-survey.component.css']
})

export class CrmSurveyComponent implements OnInit ,OnDestroy{
    language: any;
    userDetails: LoginDetails;
    userRole: string;
    responseMessage: string;
    displayActiveSurvey: boolean = true;
    displayMySurvey: boolean = false;
    displayCompletedSurvey: boolean = false;
    setTheme: ThemeType;
	private activatedSub: Subscription;
	participateAccess: ParticipateAccess;
    userAccess: UserAccess;

	constructor(private authService: AuthServiceService, private themes: ThemeService,
		private lang: LanguageService, private confirmDialogService: ConfirmDialogService) { }

	ngOnInit(): void {
		if (localStorage.getItem('club_theme') != null) {
			let theme:ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
			this.setTheme = resp;
		});

		this.language = this.lang.getLanguaageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.userRole = this.userDetails.roles[0];
		this.userAccess = appSetting.role;
		this.participateAccess = this.userAccess[this.userRole].participate;
		this.authService.setLoader(false);
	}

	onSurvey(id:number) {
		$('.tab-pane').removeClass('active');
		$('.nav-link').removeClass('active');
		if (id == 1) {
			this.displayActiveSurvey = true;
			this.displayMySurvey = false;
			this.displayCompletedSurvey = false;
			$('#tabs-1').addClass('active');
			$('#head-allTask').addClass('active');
		}
		if (id == 2) {
			this.displayActiveSurvey = false;
			this.displayMySurvey = true;
			this.displayCompletedSurvey = false;
			$('#tabs-2').addClass('active');
			$('#head-personalTask').addClass('active');
		}
		if (id == 3) {
			this.displayActiveSurvey = false;
			this.displayMySurvey = false;
			this.displayCompletedSurvey = true;
			$('#tabs-3').addClass('active');
			$('#head-groupTask').addClass('active');
		}
	}

	ngOnDestroy(): void {
		this.activatedSub.unsubscribe();
	}
}
