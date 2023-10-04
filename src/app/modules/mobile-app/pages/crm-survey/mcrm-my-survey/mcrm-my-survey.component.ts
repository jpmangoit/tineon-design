import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { LoginDetails } from 'src/app/models/login-details.model';
import { Survey } from 'src/app/models/survey.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-mcrm-my-survey',
    templateUrl: './mcrm-my-survey.component.html',
    styleUrls: ['./mcrm-my-survey.component.css']
})
export class McrmMySurveyComponent implements OnInit {
    language: any;
    setTheme: ThemeType;
    currentPageNmuber: number = 1;
    itemPerPage: number = 8;
    totalRecord: number = 0;
    totalActiveSurvey: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' },
        { value: '40' },
        { value: '50' }
    ];
    userDetails: LoginDetails;
    userRole: string;
    responseMessage: string;
    totalMyVotes: number = 0;
    totalCompletedSurvey: number = 0;
    Completed: Survey[];
    activeSurvey: Survey[];
    myVoteParam: Survey[] = [];
    myVotes: Survey[] = [];
    private activatedSub: Subscription;

    constructor(
        private authService: AuthServiceService,
        private notificationService: NotificationService,
        private lang: LanguageService,
        private themes: ThemeService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,
    ) { }

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
        this.getSurveyData();
    }

    /**
    * Function to get all the Voted survey by particular users
    * Date: 13 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {userId}
    * @return  {Array Of Object} all Voted surveys
    */
    getSurveyData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-myvotedsurvey/' + this.userDetails.userId + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false && respData['result']['survey'].length > 0) {
                        respData['result']['survey'].forEach(element => {
                            let cudate = new Date()
                            element.remain = this.language.Survey.day_left;
                            /* Progress Bar calculation */
                            element.progress = this.commonFunctionService.progressBarCalculation(element.survey_start_date, element.survey_end_date);

                            if (cudate.toISOString().split('T')[0] <= element.survey_end_date.split('T')[0]) {
                                element.dayCount = this.commonFunctionService.getDays(cudate, element.survey_end_date.split('T')[0]);
                                element.remain = this.language.Survey.day_left;
                            } else {
                                element.completed = element.survey_end_date;
                            }
                        });
                        this.myVotes = respData['result']['survey'];
                        this.myVotes.forEach((element: any) => {
                            if (element?.picture) {
                                element.picture = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.picture.substring(20))) as string;
                            }
                        })
                        this.totalMyVotes = respData.result['pagination']['rowCount'];
                    }
                }
            )
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getSurveyData();
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalMyVotes / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                this.getSurveyData();
            }
        }
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        this.getSurveyData();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
