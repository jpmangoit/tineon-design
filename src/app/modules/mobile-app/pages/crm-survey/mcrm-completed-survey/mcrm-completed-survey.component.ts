import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {LoginDetails, ThemeType} from '@core/models';
import {Survey} from '@core/models/survey.model';
import {Subscription} from 'rxjs';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';

declare var $: any;

@Component({
    selector: 'app-mcrm-completed-survey',
    templateUrl: './mcrm-completed-survey.component.html',
    styleUrls: ['./mcrm-completed-survey.component.css']
})
export class McrmCompletedSurveyComponent implements OnInit {
    language: any;
    currentPageNmuber: number = 1;
    itemPerPage: number = 8;
    totalCompletedSurvey: number = 0;
    userDetails: LoginDetails;
    responseMessage: string;
    userRole: string;
    curntPgNum: number;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' },
        { value: '40' },
        { value: '50' }
    ];
    setTheme: ThemeType;
    Completed: Survey[];
    private activatedSub: Subscription;
    alluserInformation: { member_id: number }[] = [];

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
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getCompletedData();
    }

    /**
    * Function to get all completed surveys
    * Date: 13 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {}
    * @return  {Array Of Object} all completed surveys
    */
    getCompletedData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-completesurvey/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false && respData['result']['survey'].length > 0) {
                        respData['result']['survey'].forEach(element => {
                            let cudate: Date = new Date()
                            let cuday: string = cudate.getDate().toString().padStart(2, "0");
                            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
                            let cuyear: number = cudate.getFullYear();
                            var date1: string = cuyear + "-" + cumonth + "-" + cuday + "T00:0.000Z;";
                            var d1: Date = new Date(date1.split('T')[0]);
                            var date2: Date = new Date(element.created_at.split('T')[0]);
                            var time: number = (d1.getTime() - date2.getTime()) / 1000;
                            var year: number = Math.abs(Math.round((time / (60 * 60 * 24)) / 365.25));
                            var month: number = Math.abs(Math.round(time / (60 * 60 * 24 * 7 * 4)));
                            var days: number = Math.abs(Math.round(time / (3600 * 24)));
                            if (days > 31) {
                                element.dayCount = this.language.Survey.expired + "  " + month + "  " + this.language.Survey.month_ago;
                            } else if (days < 31) {
                                element.dayCount = this.language.Survey.expired + "  " + days + "  " + this.language.Survey.day_ago;
                            }
                        });
                        this.Completed = respData['result']['survey'];
                        this.Completed.forEach((element: any) => {
                            if (element?.picture) {
                                element.picture = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.picture.substring(20))) as string;
                            }
                        })

                        this.totalCompletedSurvey = respData.result['pagination']['rowCount'];
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
        this.getCompletedData();
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalCompletedSurvey / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                this.getCompletedData()
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
        this.getCompletedData()
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

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
