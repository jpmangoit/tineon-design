import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';

declare var $: any;

@Component({
  selector: 'app-mactive-survey',
  templateUrl: './mactive-survey.component.html',
  styleUrls: ['./mactive-survey.component.css']
})

 export class MactiveSurveyComponent implements OnInit {
    language: any;
    alluserInformation: { member_id: number }[] = [];
    setTheme: ThemeType;
    currentPageNmuber: number = 1;
    itemPerPage: number = 10;
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
        private commonFunctionService: CommonFunctionService
        ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getAllUserInfo();

        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
    }

    /**
     * Function to get all the Club Users
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {Array Of Object} all the Users
     */
    getAllUserInfo() {
        let self = this;
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                    }
                    this.getSurveyData();

                }
            );
    }

    /**
    * Function is used to get type
    * @author  MangoIt Solutions
    */
    checkType(arrayOfObject: object[], objc: any) {
        if (objc.additional_cast_vote == 'true') {
            return false;
        } else if (objc.additional_cast_vote == 'false' || objc.additional_cast_vote == null && arrayOfObject && arrayOfObject.length > 0) {
            return arrayOfObject.some(obj => obj['user_id'] === this.userDetails.userId);
        }
    }

    /**
    * Function is used to get active survey list
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} survey object
    */
    getSurveyData() {
        var endPoints:any
        if(this.userRole == 'admin'){
            endPoints = 'getActivePollSurvey/' + this.currentPageNmuber + '/' + this.itemPerPage;
        }else if(this.userRole != 'admin'){
            endPoints = 'getActivePollSurveyUser/user/' + this.userDetails.userId + '/' + this.currentPageNmuber + '/' + this.itemPerPage;
        }
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', endPoints, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                 if (respData['isError'] == false) {
                    if(respData?.['result']?.['survey']?.length > 0){
                        respData['result']['survey'].forEach((element: any) => {

                            if (this.alluserInformation[element.user_name.id] != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user_name.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            element.userImage = this.thumb;
                                        },
                                        (error:any) => {
                                            element.userImage = null;
                                        });
                            } else {
                                element.userImage = null;
                            }

                            let cudate = new Date();
                            if (cudate.toISOString().split('T')[0] >= element.surveyStartDate.split('T')[0]) {
                                element.dayCount = this.commonFunctionService.getDays(cudate, element.surveyEndDate.split('T')[0]);
                                /* Progress Bar calculation */
                                element.progress =  this.commonFunctionService.progressBarCalculation(element.surveyStartDate, element.surveyEndDate);
                            } else {
                                element.dayCount = this.commonFunctionService.getDayDifference(element.surveyStartDate, element.surveyEndDate);
                                element.remain = this.language.courses.days;
                                /* Progress Bar calculation */
                                element.progress = 0
                            }
                        });
                    }
                    this.activeSurvey = respData['result']['survey'];
                    console.log(this.activeSurvey);
                    
                    this.totalActiveSurvey = respData['result'].pagination.rowCount;
                }
            })
    }

    /**
    * Function is used to change page
    * @author  MangoIt Solutions
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getSurveyData();
    }

    /**
    * Function is used to go to page
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalActiveSurvey / this.itemPerPage)) {
                this.notificationService.showSuccess(this.language.error_message.invalid_pagenumber,null);
            } else {
                this.currentPageNmuber = eve;
                this.getSurveyData();
            }
        }
    }

    /**
    * Function is used to set per page
    * @author  MangoIt Solutions
    */
    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        this.getSurveyData()
    }

    /**
    * Function is used to close survey
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {string} success message
    */
    surveyClose(id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('put', 'closeSurvey/survey/' + id, '')
        .subscribe((respData: any) => {
            this.authService.setLoader(false);
            if (respData['isError'] == false) {
                this.notificationService.showSuccess(respData['result'],null);
                var self = this;
                setTimeout(function () { self.ngOnInit(); }, 2000);
            }
            if (respData['code'] == 400) {
                this.notificationService.showError(respData['message'], null);
            }
        });
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
