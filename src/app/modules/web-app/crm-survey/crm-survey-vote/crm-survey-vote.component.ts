import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'src/app/service/language.service';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { CRM_Survey } from 'src/app/models/survey.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-crm-survey-vote',
    templateUrl: './crm-survey-vote.component.html',
    styleUrls: ['./crm-survey-vote.component.css']
})

export class CrmSurveyVoteComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userRole: string;
    surveyVoteForm: UntypedFormGroup;
    formSubmit: boolean = false;
    responseMessage: string;
    surveyId: string;
    surveyData: CRM_Survey;
    surveyAnswerId: number[] = [];
    surveyVoteResult: { TotalCount: number, answerCount: { AnswerId: number, count: number }, userCount: number }[];
    setTheme: ThemeType;
    btnDisable: string;
    voting_option: boolean = true;
    vote_answer: any;
    private activatedSub: Subscription;

    constructor(private authService: AuthServiceService, private router: Router, public formBuilder: UntypedFormBuilder, private themes: ThemeService,
        private lang: LanguageService, private route: ActivatedRoute, private notificationService: NotificationService
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
        this.surveyId = this.route.snapshot.paramMap.get('surveyId');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getSurveyData();
        this.surveyVoteForm = this.formBuilder.group({ tineon_user_id: [''], surveyType: [''], });
    }

    /**
    * Function to get RM Survey Vote Results
    * @author  MangoIt Solutions
    */
    getSurveyData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-crm-surveybyid/' + this.surveyId, null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false && respData['result']['survey'].length > 0) {
                    respData['result']['survey'].forEach(element => {
                        let cudate = new Date()
                        let cuday = cudate.getDate().toString().padStart(2, "0");
                        let cumonth = (cudate.getMonth() + 1).toString().padStart(2, "0");
                        let cuyear = cudate.getFullYear();
                        var date1 = cuyear + "-" + cumonth + "-" + cuday + "T00:0.000Z;";
                        var d1 = new Date(date1.split('T')[0]);
                        var date2 = new Date(element.created_at.split('T')[0]);
                        var time = (d1.getTime() - date2.getTime()) / 1000;
                        var year = Math.abs(Math.round((time / (60 * 60 * 24)) / 365.25));
                        var month = Math.abs(Math.round(time / (60 * 60 * 24 * 7 * 4)));
                        var days = Math.abs(Math.round(time / (3600 * 24)));
                        if (days > 31) {
                            element.month = month + this.language.Survey.month_ago;
                        } else if (days < 31) {
                            element.month = days + this.language.Survey.day_ago;
                        }
                        var countdate2 = new Date(element.survey_start_date.split('T')[0]);
                        var Days = (d1.getTime() - countdate2.getTime()) / 1000;
                        var dayLeft = Math.abs(Math.round(Days / (3600 * 24)))
                        element.dayLeft = dayLeft + this.language.Survey.day_left;
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
                    let votes = this.surveyData[0].votes;
                    if (votes && votes.length > 0) {
                        votes.forEach(element => {
                            element.tineon_user_id == this.userDetails.userId;
                            this.voting_option = false;
                        });
                    }
                    this.getUserVoteOnSurvey();
                    var date = new Date() // Today's date
                    var date1 = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
                    var dt2 = new Date(this.surveyData[0].survey_start_date);
                    var date2 = ((dt2.getMonth() > 8) ? (dt2.getMonth() + 1) : ('0' + (dt2.getMonth() + 1))) + '/' + ((dt2.getDate() > 9) ? dt2.getDate() : ('0' + dt2.getDate())) + '/' + dt2.getFullYear()
                    if (date2 <= date1) {
                        this.btnDisable = "false";
                    } else {
                        this.btnDisable = "true";
                    }
                }
            }
        )
    }

    getUserVoteOnSurvey() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'crm-surveyvotebyuser/' + this.surveyId + '/user/' + this.userDetails.userId, null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.vote_answer = respData['result']['survey'];
                    if (this.vote_answer && this.surveyData[0].additional_cast_vote == 'true') {
                        let self = this;
                        if (self.vote_answer && self.vote_answer.length > 0) {
                            self.vote_answer.forEach(element => {
                                if (this.surveyData[0].votingOption == 0) {
                                    var inputs = document.querySelectorAll('.input-radio');
                                    if (this.surveyData[0] && this.surveyData[0].surveyAnswerOption.length > 0) {
                                        this.surveyData[0].surveyAnswerOption.forEach((elem: any, index: any) => {
                                            if (JSON.parse(element['survey_answer_id']) == elem.id) {
                                                $(inputs[index]).prop("checked", true);
                                                this.surveyAnswerId.push(element['survey_answer_id']);
                                            }
                                        });
                                    }
                                } else if (this.surveyData[0].votingOption == 1) {
                                    var inputs = document.querySelectorAll('.input-checkbox');
                                    if (this.surveyData[0] && this.surveyData[0].surveyAnswerOption.length > 0) {
                                        this.surveyData[0].surveyAnswerOption.forEach((elem: any, index: any) => {
                                            if (element['survey_answer_id'] == elem.id) {
                                                $(inputs[index]).prop("checked", true);
                                                this.surveyAnswerId.push(element['survey_answer_id']);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                };
            }
        )
    }

    onradioChange(e: Event) {
        if (e.target['checked']) {
            this.surveyAnswerId[0] = e.target['value'];
        }
    }

    onCheckboxChange(e: Event) {
        if (e.target['checked']) {
            this.surveyAnswerId.push(e.target['value']);
        } else {
            let i: number = 0;
            if (this.surveyAnswerId && this.surveyAnswerId.length > 0) {
                this.surveyAnswerId.forEach((item: any) => {
                    if (item == e.target['value']) {
                        this.surveyAnswerId.splice(i, 1);
                        return;
                    }
                    i++;
                });
            }
        }
    }

    errorAnswer: any = { isError: false, errorMessage: '' };
    serveyProcess() {
        if (this.surveyAnswerId && this.surveyAnswerId.length < 1) {
            this.errorAnswer = { isError: true, errorMessage: this.language.Survey.answer_option };
        } else {
            this.errorAnswer = { isError: false, errorMessage: '' };
            this.formSubmit = true;
            if (this.surveyVoteForm.valid && (!this.errorAnswer.isError)) {
                this.surveyVoteForm.controls["surveyType"].setValue(this.surveyData[0].survey_type);
                this.surveyVoteForm.controls["tineon_user_id"].setValue(this.userDetails.userId);
                if (this.vote_answer.length > 0) {
                    if (this.surveyAnswerId) {
                        this.surveyVoteForm.value.surveyAnswerId = this.surveyAnswerId;
                    }
                    this.surveyVoteForm.value.surveyId = this.surveyData[0].id;
                    this.authService.setLoader(true);
                    this.authService.memberSendRequest('put', 'crmUpdatevote', this.surveyVoteForm.value)
                        .subscribe(
                            (respData: any) => {
                                this.authService.setLoader(false);
                                this.formSubmit = false;
                                if (respData['isError'] == false) {
                                    this.notificationService.showSuccess(respData['result']['message']['messageList']['survey'], null);
                                    var self = this;
                                    setTimeout(function () {
                                        self.router.navigate(['web/crm-survey']);
                                    }, 2000);
                                } else if (respData['code'] == 400) {
                                    this.notificationService.showError(respData['message'], null);
                                }
                            }
                        );
                } else {
                    if (this.surveyAnswerId) {
                        this.surveyVoteForm.value.surveyAnswerId = this.surveyAnswerId;
                    }
                    this.surveyVoteForm.value.surveyId = this.surveyData[0].id;
                    this.authService.setLoader(true);
                    this.authService.memberSendRequest('post', 'crmaddvote', this.surveyVoteForm.value)
                        .subscribe(
                            (respData: any) => {
                                this.authService.setLoader(false);
                                this.formSubmit = false;
                                if (respData['isError'] == false) {
                                    this.notificationService.showSuccess(respData['result']['message']['messageList']['survey'], null);
                                    var self = this;
                                    setTimeout(function () {
                                        self.router.navigate(['web/crm-survey']);
                                    }, 4000);
                                } else if (respData['code'] == 400) {
                                    this.notificationService.showError(respData['message'], null);
                                }
                            }
                        );
                }
            }
        }
    }

    getVoteResult() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getResultSurveyById/survey/' + this.surveyId, null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                this.surveyVoteResult = respData['result'];
                if (this.surveyVoteResult && this.surveyVoteResult['answerCount'].length > 0) {
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

    showVote(vote: CRM_Survey) {
        if (vote.survey_view_option == 0) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                return true;
            }
        } else if (vote.survey_view_option == 2) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                return false;
            }
        } else if (vote.survey_view_option == 1) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                let cudate = new Date()
                let cuday = cudate.getDate().toString().padStart(2, "0");
                let cumonth = (cudate.getMonth() + 1).toString().padStart(2, "0");
                let cuyear = cudate.getFullYear();
                var date1 = cuyear + "-" + cumonth + "-" + cuday + "T00:0.000Z;";
                var d1 = new Date(date1.split('T')[0]);
                var date2 = new Date(vote.survey_end_date.split('T')[0]);
                if (date2 > d1) {
                    return false;
                } else if (date2 < d1) {
                    return true;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
