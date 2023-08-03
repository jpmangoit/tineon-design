import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { UntypedFormGroup } from '@angular/forms';
import { Survey, VoteAnswer, VoteSetting } from 'src/app/models/survey.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { saveAs } from 'file-saver';
declare var $:any;

@Component({
    selector: 'app-view-servey',
    templateUrl: './view-servey.component.html',
    styleUrls: ['./view-servey.component.css'],
})
export class ViewServeyComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails; 
    userRole: string;
    surveyId: string;
    surveyData: Survey;
    voteCount: number;
    currentDate: Date;
    vote_setting: VoteSetting[];
    surveyVoteResult: { TotalCount: number, answerCount: { AnswerId: number, count: number }, result: Survey, userCount: number }[];
    setTheme: ThemeType;
    vote_answer: VoteAnswer[];
    show_name: string;
    private activatedSub: Subscription;
    showImage: any;
    showFile: any;

    responseMessage:string = null;
	result: any;
    documentData: any;
    dowloading: boolean = false;

    constructor(private authService: AuthServiceService, private themes: ThemeService,private notificationService: NotificationService,
        private lang: LanguageService, private route: ActivatedRoute,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }

        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.authService.setLoader(false);
        this.language = this.lang.getLanguaageFile();
        this.surveyId = this.route.snapshot.paramMap.get('surveyId');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getVoteResult();
        this.getVoteAnswer()
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
                this.surveyVoteResult = [];
                this.authService.setLoader(false);
                this.surveyVoteResult = respData['result'];
                if(this.surveyVoteResult && this.surveyVoteResult['result'] && this.surveyVoteResult['result'].length > 0){
                    this.surveyData = this.surveyVoteResult['result'];
                    this.show_name = this.surveyData[0].additional_anonymous_voting;

                    if (this.surveyData[0]?.surevyImage[0]?.survey_image) {
                        this.surveyData[0].surevyImage[0].survey_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.surveyData[0]?.surevyImage[0]?.survey_image.substring(20)));
                        this.showImage = this.surveyData[0]?.surevyImage[0]?.survey_image
                    }

                    if (this.surveyData[0]?.surevyImage[0]?.surevy_document) {
                        this.showFile = this.surveyData[0]?.surevyImage[0]?.surevy_document;
                        $('.preview_img').attr('src', '../../../../assets/img/doc-icons/folder.svg');
                    }
                    // if (this.surveyData[0].image != null) {
                    //     if (['.jpg','.jpeg','.png','.gif','.svg','.webp','.avif','.apng','.jfif','.pjpeg', '.pjp'].some(char => this.surveyData[0].image.endsWith(char))) {
                    //         this.showImage = this.surveyData[0].image;
                    //     } else if (['.pdf','.doc','.zip','.docx','.docm','.dot','.odt','.txt','.xml','.wps', '.xps', '.html','.htm','.rtf'].some(char => this.surveyData[0].image.endsWith(char))) {
                    //         this.showFile = this.surveyData[0].image;
                    //         $('.preview_img').attr('src', '../../../../assets/img/doc-icons/folder.svg');
                    //     }
                    // }
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
                    this.vote_answer = [];
                    if (respData['isError'] == false) {
                        this.vote_answer = respData['result'];
                    }
                }
            )
    }

    /**
    * Function is used to get how many user choose slected answer
    * @author  MangoIt Solutions
    * @param   {surevy Id, Answer Id}
    * @return  {array object}
    */
    getAnswerResult(ans_id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'surveyResult/' + 'survey/' + this.surveyId + '/answerId/' + ans_id, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.vote_setting = respData['result']['result'];
                    this.voteCount = this.vote_setting.length;
                    this.currentDate = new Date();
                }
            }
        )
    }

    showVote(vote: Survey) {
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
        }
        else if (vote.surveyViewOption == 1) {
            if (this.userRole == 'admin') {
                return true;
            } else {
                if (this.vote_answer && this.vote_answer.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
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
                this.ngOnInit();
            }else if (respData['code'] == 400) {
                this.notificationService.showError(respData['message'], null);
            }
        });
    }

    /**
    * Function is used to download document
    * @author  MangoIt Solutions
    * @param   {path}
    */
    downloadDoc(path: any) {
        let data = {
            name: path
        }
        this.dowloading = true;
        var endPoint = 'download-survey-document';
        if (data && data.name) {
            let filename = data.name.split('/').reverse()[0];
            this.authService.downloadDocument('post', endPoint, data).toPromise()
                .then((blob: any) => {
                    saveAs(blob, filename);
                    this.authService.setLoader(false);
                    this.dowloading = false;
                    setTimeout(() => {
                        this.authService.sendRequest('post', 'delete-survey-document/uploads', data).subscribe((result: any) => {
                            this.result = result;
                            this.authService.setLoader(false);
                            if (this.result.success == false) {
                                this.notificationService.showError(this.result['result']['message'], null);
                            } else if (this.result.success == true) {
                                this.documentData = this.result['result']['message'];
                            }
                        })
                    }, 7000);
                })
                .catch(err => {
                    this.responseMessage = err;
                })
        }
    }

    downloadImage(blobUrl: any) {
        window.open(blobUrl.changingThisBreaksApplicationSecurity, '_blank');
    }
    
    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
