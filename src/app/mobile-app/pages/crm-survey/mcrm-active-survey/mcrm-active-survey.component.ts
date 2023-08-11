import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service'
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-mcrm-active-survey',
  templateUrl: './mcrm-active-survey.component.html',
  styleUrls: ['./mcrm-active-survey.component.css']
})
export class McrmActiveSurveyComponent implements OnInit {
    language: any;
    alluserInformation: { member_id: number }[] = [];
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
    activeSurvey: any[];
    private activatedSub: Subscription;
    thumb: any;

    constructor(
        private authService: AuthServiceService,
        private themes: ThemeService,
        private notificationService: NotificationService,
        private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];

        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.getSurveyData();
    }


    /**
    * Function to get all active surveys
    * Date: 13 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {}
    * @return  {Array Of Object} all active surveys
    */
    getSurveyData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-activesurvey/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false && respData['result']['survey'].length > 0) {
                        respData['result']['survey'].forEach(element => {
                            let cudate: Date = new Date()
                            element.dayCount = this.commonFunctionService.getDays(cudate, element.survey_end_date.split('T')[0]);
                            element.remain = this.language.Survey.day_left;
                            /* Progress Bar calculation */
                            element.progress = this.commonFunctionService.progressBarCalculation(element.survey_start_date, element.survey_end_date);
                        });
                        this.activeSurvey = respData['result']['survey'];
                        this.activeSurvey.forEach((element:any) =>{
                            if (element?.picture) {
                                element.picture = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.picture.substring(20))) as string;
                            } 
                        }) 
                        this.totalActiveSurvey = respData.result['pagination']['rowCount'];
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    };
                }
            )
    }

    /**
     * Function to check Allow to correct after the vote is given
     * @param arrayOfObject
     * @returns {boolean}
     */
    checkType(arrayOfObject: object) {
        if (arrayOfObject['additional_cast_vote'] == 'true') {
            return false;
        } else if (arrayOfObject['additional_cast_vote'] == 'false') {
            return false;
        }
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
            if (eve > Math.round(this.totalActiveSurvey / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber,null);
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
        this.getSurveyData()
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
