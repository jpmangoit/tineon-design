import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'src/app/service/language.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { Survey, VoteAnswer, VoteSetting } from 'src/app/models/survey.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;
@Component({
	selector: 'app-servey-vote',
	templateUrl: './servey-vote.component.html',
	styleUrls: ['./servey-vote.component.css'],
})
export class ServeyVoteComponent implements OnInit ,OnDestroy{
	language: any;
    userDetails: LoginDetails;
	userRole: string;
    surveyVoteForm: UntypedFormGroup;
	surveyId:string;
	surveyData: Survey;
	surveyAnswerId: number[] = [];
	surveyTypeId: number[] = [];
	voteCount: number;
	vote_setting: VoteSetting[];
	surveyVoteResult:  {TotalCount: number,answerCount: {AnswerId: number, count: number},result:Survey,userCount: number}[];
	setTheme: ThemeType;
    vote_answer: VoteAnswer[];
	btnDisable: string;
	show_name: string;
	surveyAnswerName: string;
	private activatedSub: Subscription;
    showImage: any;
    showFile: any;

	constructor(private authService: AuthServiceService,  private themes: ThemeService,
		private router: Router, public formBuilder: UntypedFormBuilder,private notificationService: NotificationService,
		private lang: LanguageService, private route: ActivatedRoute,) { }

	ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
			let theme:ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
        	this.setTheme = resp;
        });
		this.language = this.lang.getLanguaageFile();
		this.surveyId = this.route.snapshot.paramMap.get('surveyId');
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.userRole = this.userDetails.roles[0];
		this.getVoteResult();
		this.getVoteAnswer();
		this.surveyVoteForm = this.formBuilder.group({
			user_id: [''],
			team_id: [''],
			surveyType: [''],
			surveyTypeId: [''],
		});
	}

	/**
    * Function to get survey and vote details by survey Id
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {Array Of Object}
    */
	getVoteResult() {
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'getResultSurveyById/survey/' + this.surveyId, null).subscribe(
			(respData: any) => {
				this.authService.setLoader(false);
				this.surveyVoteResult = respData['result'];
				if(this.surveyVoteResult?.['result']?.length > 0){
                    this.surveyData = this.surveyVoteResult['result'];
                    this.show_name = this.surveyData[0].additional_anonymous_voting;
					var date: Date = new Date() // Today's date
					var date1: string = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
					var dt2: Date = new Date(this.surveyData[0].surveyStartDate.split('T')[0]);
					var date2: string = ((dt2.getMonth() > 8) ? (dt2.getMonth() + 1) : ('0' + (dt2.getMonth() + 1))) + '/' + ((dt2.getDate() > 9) ? dt2.getDate() : ('0' + dt2.getDate())) + '/' + dt2.getFullYear()
					if (date2 <= date1) {
						this.btnDisable = "false";
					} else {
						this.btnDisable = "true";
					}
                    if (this.surveyData[0].image != null) {
                        if (['.jpg','.jpeg','.png','.gif','.svg','.webp','.avif','.apng','.jfif','.pjpeg', '.pjp'].some(char => this.surveyData[0].image.endsWith(char))) {
                            this.showImage = this.surveyData[0].image;
                        } else if (['.pdf','.doc','.zip','.docx','.docm','.dot','.odt','.txt','.xml','.wps', '.xps', '.html','.htm','.rtf'].some(char => this.surveyData[0].image.endsWith(char))) {
                            this.showFile = this.surveyData[0].image;
                            $('.preview_img').attr('src', '../../../../assets/img/doc-icons/folder.svg');
                        }
                    }
                }
                if(this.surveyVoteResult && this.surveyVoteResult['answerCount'] && this.surveyVoteResult['answerCount'].length > 0){
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
    * Function to get survey vote answer by user Id
    * @author  MangoIt Solutions
    * @param   {survey Id, User Id}
    * @return  {Array Of Object}
    */
	getVoteAnswer() {
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'surveyResultDetails/' + 'survey/' + this.surveyId + '/userId/' + this.userDetails.userId, null)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					if (respData['isError'] == false) {
						this.vote_answer = respData['result'];
						if (this.vote_answer) {
							let self = this;
                            if(self.vote_answer?.length > 0){
                                self.vote_answer?.forEach(element => {
                                    if (this.surveyData[0]?.surveyOption == 0) {
                                        var inputs: NodeListOf<Element> = document.querySelectorAll('.input-radio');
                                        if(this.surveyData[0] && this.surveyData[0].surveyAnswer && this.surveyData[0].surveyAnswer.length > 0){
                                            this.surveyData[0].surveyAnswer.forEach((elem: any, index: any) => {
                                                if (element.surveyAnswerId == elem.id) {
                                                    $(inputs[index]).prop("checked", true);
                                                    this.surveyAnswerId.push(element.surveyAnswerId);
                                                }
                                            });
                                        }
                                    } else if (this.surveyData[0]?.surveyOption == 1) {
                                        var inputs: NodeListOf<Element> = document.querySelectorAll('.input-checkbox');
                                        if(this.surveyData[0] && this.surveyData[0].surveyAnswer && this.surveyData[0].surveyAnswer.length > 0){
                                            this.surveyData[0].surveyAnswer.forEach((elem: any, index: any) => {
                                                if (element.surveyAnswerId == elem.id) {

                                                    $(inputs[index]).prop("checked", true);
                                                    this.surveyAnswerId.push(element.surveyAnswerId);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
							this.surveyVoteForm.value['surveyAnswerId'] = this.surveyAnswerId;
						}
					}
				}
			)
	}

	onradioChange(e:Event) {
		if (e.target['checked']) {
			this.surveyAnswerId[0] = e.target['value'];
		}
	}

	onCheckboxChange(e:Event) {
		if (e.target['checked']) {
			this.surveyAnswerId.push(e.target['value']);
		} else {
			let i: number = 0;
            if(this.surveyAnswerId && this.surveyAnswerId.length > 0){
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

	/**
    * Function is used to save user vote
    * @author  MangoIt Solutions
    * @param   {form data}
    * @return  {string} success message
    */
	errorAnswer:  { isError:boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	serveyProcess() {
		if (this.surveyAnswerId && this.surveyAnswerId.length < 1) {
			this.errorAnswer = { isError: true, errorMessage: this.language.Survey.answer_option };
		} else {
			this.btnDisable = "true";
			this.errorAnswer = { isError: false, errorMessage: '' };
			if (this.surveyVoteForm.valid && (!this.errorAnswer.isError)) {
				this.authService.setLoader(true)
				this.surveyVoteForm.controls["surveyType"].setValue(this.surveyData[0].surveyType);
				this.surveyVoteForm.controls["user_id"].setValue(this.userDetails.userId);
				this.surveyVoteForm.controls["team_id"].setValue(this.surveyData[0].team_id);
				this.surveyVoteForm.controls["surveyTypeId"].setValue(this.surveyData[0].surveyTypeId);
				if (this.surveyData[0] && this.surveyData[0].survey_type) {
					this.surveyTypeId = [];
                    if(this.surveyData[0] && this.surveyData[0].survey_type.length > 0){
                        this.surveyData[0].survey_type.forEach(element => {
                            this.surveyTypeId.push(element.surveyTypeId);
                        });
                    }
					this.surveyVoteForm.value.surveyTypeId = this.surveyTypeId;
				} else {
					this.surveyVoteForm.value.surveyTypeId = null;
				}

				if (this.vote_answer && this.vote_answer.length > 0) {
					if (this.surveyAnswerId) {
						this.surveyVoteForm.value.survey_AnswerId = this.surveyAnswerId;
					}
					this.authService.memberSendRequest('put', 'surveyVotesUpdate/' + this.surveyId, this.surveyVoteForm.value)
						.subscribe(
							(respData:any) => {
								this.authService.setLoader(false);
								if (respData['isError'] == false) {
                                    this.notificationService.showSuccess(respData['result']['message'],null);
									var self = this;
									setTimeout(function () {self.router.navigate(['survey']);}, 2000);
								}else if (respData['code'] == 400) {
									this.btnDisable = "false";
									this.notificationService.showError(respData['message'], null);
								}
							});
				} else {
					if (this.surveyAnswerId) {
						this.surveyVoteForm.value.surveyAnswerId = this.surveyAnswerId;
					}
					this.surveyVoteForm.value.surveyId = this.surveyData[0].id;
					this.authService.setLoader(true);
					this.authService.memberSendRequest('post', 'surveyVotes', this.surveyVoteForm.value)
					.subscribe(
						(respData:any) => {
							this.authService.setLoader(false);
							if (respData['isError'] == false) {
                                this.notificationService.showSuccess(respData['result']['message'],null);
								var self = this;
								setTimeout(function () {self.router.navigate(['survey']);}, 2000);
							}else if (respData['code'] == 400) {
								this.btnDisable = "false";
								this.notificationService.showError(respData['message'], null);
							}
						}
					);
				}
			}
		}
	}

	/**
    * Function is used to get how many user choose slected answer
    * @author  MangoIt Solutions
    * @param   {surevy Id, Answer Id}
    * @return  {array object}
    */
	getAnswerResult(ans_id:number) {
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'surveyResult/' + 'survey/' + this.surveyId + '/answerId/' + ans_id, null)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					if (respData['isError'] == false) {
						this.vote_setting = respData['result']['result'];
						this.surveyAnswerName = respData['result']['SurveyAnswer'][0].surveyAnswer;
						this.voteCount = this.vote_setting.length;
					}
				}
			)
	}

	showVote(vote:Survey) {
		if (vote.surveyViewOption == 0) {
			if (this.userRole == 'admin') {
				return true;
			} else {
				return true;
			}
		} else if (vote.surveyViewOption == 2) {
			if (this.userRole == 'admin') {
				return true;
			} else {
				return false;
			}
		} else if (vote.surveyViewOption == 1) {
			if (this.userRole == 'admin') {
				return true;
			} else {
                if(this.vote_answer && this.vote_answer.length > 0){
                        return true;
                }else{
                    return false;
                }
			}
		}
	}

	ngOnDestroy(): void {
		this.activatedSub.unsubscribe();
	}
}
