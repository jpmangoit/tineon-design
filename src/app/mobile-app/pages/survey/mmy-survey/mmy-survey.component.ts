import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { Survey } from 'src/app/models/survey.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-mmy-survey',
    templateUrl: './mmy-survey.component.html',
    styleUrls: ['./mmy-survey.component.css']
})
export class MmySurveyComponent implements OnInit {

    language: any;
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
    totalMyVotes: number = 0;
    totalCompletedSurvey: number = 0;
    Completed: Survey[];
    activeSurvey: Survey[];
    myVoteParam: Survey[] = [];
    myVotes: Survey[] = [];
    alluserInformation: { member_id: number }[] = [];
    private activatedSub: Subscription;
    thumb: any;
    constructor(
        private authService: AuthServiceService,
        private themes: ThemeService,
        private notificationService: NotificationService,
        private lang: LanguageService,
        private commonFunctionService: CommonFunctionService
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
        this.getAllUserInfo();
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
                if(respData && respData.length > 0){
                    Object(respData).forEach((val, key) => {
                        this.alluserInformation[val.id] = { member_id: val.member_id };
                    })
                }
                this.getMyAllVotes();
            }
        );
    }

    /**
    * Function is used to get all user survey which User have added vote
    * @author  MangoIt Solutions
    * @param   {userId}
    * @return  {object} survey object
    */
    getMyAllVotes(){
        this.authService.memberSendRequest('get', 'getMySurveyVotes/user/' + this.userDetails.userId + '/' + this.currentPageNmuber + '/' +this.itemPerPage, null)
        .subscribe(
            (respData: any) => {

                if (respData['isError'] == false) {
                    if(respData?.['result']?.['survey']?.length > 0){
                        respData['result']['survey'].forEach((element,index) => {
                            if (this.alluserInformation[element.survey.user_id] != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.survey.user_id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            element.survey.userImage = this.thumb;
                                        },
                                        (error:any) => {
                                            element.survey.userImage = null;
                                        });
                            } else {
                                element.survey.userImage = null;
                            }
                            let cudate: Date = new Date();
                            if (cudate.toISOString().split('T')[0] >= element.survey.surveyStartDate.split('T')[0]) {
                                var days = this.commonFunctionService.getDays(cudate, element.survey.surveyEndDate.split('T')[0]);
                                element.survey.dayCount = days;
                                element.survey.remain = this.language.courses.days;

                                if (element.survey.dayCount > 1) {
                                    element.survey.dayCount = days + "  " + this.language.courses.days;
                                } else if (element.survey.dayCount == 1 || element.survey.dayCount == 0) {
                                    element.survey.dayCount = days + "  " + this.language.courses.day;
                                }
                                /* Progress Bar calculation */
                                element.survey.progress = this.commonFunctionService.progressBarCalculation(element.survey.surveyStartDate, element.survey.surveyEndDate);
                            } else {
                                var days = this.commonFunctionService.getDayDifference(element.survey.surveyStartDate, element.survey.surveyEndDate);

                                element.survey.dayCount = days;
                                element.survey.remain = this.language.courses.days;
                                if (element.survey.dayCount > 1) {
                                    element.survey.dayCount = days + "  " + this.language.courses.days;
                                } else if (element.survey.dayCount == 1 || element.survey.dayCount == 0) {
                                    element.survey.dayCount = days + "  " + this.language.courses.day;
                                }
                                element.survey.progress = 0
                            }
                            this.myVoteParam.push(element.survey);
                        });
                        this.totalMyVotes = respData['result'].pagination.rowCount;
                    }
                }
            }
        );
    }

    /**
    * Function is used to change page
    * @author  MangoIt Solutions
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getMyAllVotes();
    }

    /**
    * Function is used to go to page
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        }
        else {
            if (eve > Math.round(this.totalMyVotes / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber,null);
            }
            else {
                this.currentPageNmuber = eve;
                this.getMyAllVotes();
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
        this.getMyAllVotes();
    }



    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
