import { Component, OnInit } from '@angular/core';
import {Survey, VoteSetting} from '@core/models/survey.model';
import {LoginDetails, ThemeType} from '@core/models';
import {AuthServiceService, LanguageService} from '@core/services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-crm-survey-view',
    templateUrl: './crm-survey-view.component.html',
    styleUrls: ['./crm-survey-view.component.css']
})

export class CrmSurveyViewComponent implements OnInit {
    language: any;
    surveyId: string;
    surveyData: Survey;
    userDetails: LoginDetails;
    userRole: string;
    voteCount: number;
    currentDate: Date;
    vote_setting: VoteSetting[];
    surveyVoteResult: { TotalCount: number, answerCount: { AnswerId: number, count: number }, result: Survey, userCount: number }[];
    setTheme: ThemeType;
    surveyAnswerName: string;

    constructor(private authService: AuthServiceService, private router: Router,
        private lang: LanguageService, private route: ActivatedRoute,) { }

    ngOnInit(): void {
        this.authService.setLoader(false);
        this.language = this.lang.getLanguageFile();
        this.surveyId = this.route.snapshot.paramMap.get('surveyId');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getSurveyData();
        this.getVoteResult();
    }

    /**
    * Function to get Survey data by surveyId
    * @author  MangoIt Solutions
    */
    getSurveyData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-surveybyid/' + this.surveyId, null).subscribe(
            (respData: JSON) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false && respData['result']['survey'].length > 0) {
                    respData['result']['survey'].forEach(element => {
                        let cudate = new Date()
                        let cuday = cudate.getDate().toString().padStart(2, "0");
                        let cumonth = (cudate.getMonth() + 1).toString().padStart(2, "0");
                        let cuyear = cudate.getFullYear();
                        var date1 = cuyear + "-" + cumonth + "-" + cuday + "T00:0.000Z;";
                        var d1 = new Date(date1.split('T')[0]);
                        var date2 = new Date(element.survey_start_date.split('T')[0]);
                        var time = (d1.getTime() - date2.getTime()) / 1000;
                        var year = Math.abs(Math.round((time / (60 * 60 * 24)) / 365.25));
                        var month = Math.abs(Math.round(time / (60 * 60 * 24 * 7 * 4)));
                        var days = Math.abs(Math.round(time / (3600 * 24)));
                        if (days > 31) {
                            element.month = month + this.language.Survey.month_ago;
                        } else if (days < 31) {
                            element.month = days + this.language.Survey.day_ago;
                        }
                    });
                    this.surveyData = respData['result']['survey'];
                    var surAns = this.surveyData[0].surveyAnswerOption;
                    if (surAns && surAns.length > 0) {
                        surAns.forEach((element: any) => {
                            if (this.surveyData[0].TotalVoteCount != 0) {
                                element.per = (((element.votedUsersCount) / this.surveyData[0].TotalVoteCount) * 100);
                            } else {
                                element.per = 0;
                            }
                        });
                    }
                }
            }
        )
    }

    /**
    * Function to get particular Survey Vote Results
    * @author  MangoIt Solutions
    */
    getVoteResult() {
        let per = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-surveybyid/' + this.surveyId, null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                this.surveyVoteResult = respData['result'];
                if (this.surveyVoteResult && this.surveyVoteResult['answerCount'] && this.surveyVoteResult['answerCount'].length > 0) {
                    this.surveyVoteResult['answerCount'].forEach(element => {
                        if (this.surveyVoteResult['TotalCount'] != 0) {
                            element.per = (((element.count) / this.surveyVoteResult['TotalCount']) * 100);
                        } else {
                            element.per = 0;
                        }
                    });
                }
            }
        )
    }

    /**
    * Function is used to show vote
    * @author  MangoIt Solutions
    */
    showVote(vote: Survey) {
        if (vote['survey_view_option'] == 0) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                return true;
            }
        } else if (vote['survey_view_option'] == 2) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                return false;
            }
        } else if (vote['survey_view_option'] == 1) {
            if (this.userRole == 'admin') {
                return true;
            }
            else {
                const cudate: Date = new Date();
                const cuday: string = cudate.getDate().toString().padStart(2, "0");
                const cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
                const cuyear: number = cudate.getFullYear();
                const date1: string = cuyear + "-" + cumonth + "-" + cuday + "T00:00:00.000Z"; // Fix the date format here

                if (vote && vote.surveyEndDate) {
                    const d1: Date = new Date(date1.split('T')[0]);
                    const date2: Date = new Date(vote.surveyEndDate.split('T')[0]);

                    if (date2 > d1) {
                        return false;
                    } else if (date2 < d1) {
                        return true;
                    }
                }
            }

            // else {
            //   let cudate:Date  = new Date()
            //   let cuday:string = cudate.getDate().toString().padStart(2, "0");
            //   let cumonth:string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            //   let cuyear:number  = cudate.getFullYear();
            //   var date1:string = cuyear + "-" + cumonth + "-" + cuday + "T00:0.000Z;";
            //   console.log(date1);
            //   var d1:Date = new Date(date1.split('T')[0]);
            //   var date2:Date = new Date(vote.surveyEndDate.split('T')[0]);
            //   if (date2 > d1) {
            //         return false;
            //     } else if (date2 < d1) {
            //         return true;
            //     }
            // }
        }
    }

}
