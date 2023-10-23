import { Component, OnDestroy, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import {ClubDetail, LoginDetails, ProfileDetails, ThemeType} from '@core/models';
import {Survey} from '@core/models/survey.model';
import {Subscription} from 'rxjs';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService} from '@shared/components';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder} from '@angular/forms';
declare var $: any;

@Component({
    selector: 'app-survey-detail',
    templateUrl: './survey-detail.component.html',
    styleUrls: ['./survey-detail.component.css']
})
export class SurveyDetailComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    surveyId: string;
    surveyData: Survey;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    updateSurveyData: any;
    showToggle: any;
    thumbnail: string;
    memberid: number;
    displayError: boolean = false
    getclubInfo: ClubDetail;
    profile_data: ProfileDetails;
    birthdateStatus: boolean;
    memberStartDateStatus: Date;
    private refreshPage: Subscription
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    showImage: any;
    showUpdatedImage: any;
    showFile: any;
    showUpdatedFile: any;
    thumb: string;

    responseMessage: string = null;
    result: any;
    documentData: any;
    dowloading: boolean = false;
    constructor(
        private authService: AuthServiceService,
        private commonFunctionService: CommonFunctionService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private themes: ThemeService,
        private router: Router,
        public formBuilder: UntypedFormBuilder,
        private notificationService: NotificationService,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private updateConfirmDialogService: UpdateConfirmDialogService,
        private _location: Location) {
        this.refreshPage = this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });
        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        })
    }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;

        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguageFile();
        this.surveyId = this.route.snapshot.paramMap.get('surveyId');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.getSurveyData();
    }


    /**
    * Function to get survey details by survey Id
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {Array Of Object}
    */
    getSurveyData() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getSurveyById/' + this.surveyId, null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    if (respData?.['result']?.length > 0) {
                        this.surveyData = respData['result'];
                        this.memberid = this.surveyData[0].user_name['member_id'];

                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                            .subscribe(
                                (respData: any) => {
                                    this.authService.setLoader(false);
                                    this.thumbnail = respData;
                                },
                                (error: any) => {
                                    this.thumbnail = null;
                                });

                        if (this.surveyData[0]?.surevyImage[0]?.survey_image) {
                            this.surveyData[0].surevyImage[0].survey_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.surveyData[0]?.surevyImage[0]?.survey_image.substring(20))) as string;
                            this.showImage = this.surveyData[0]?.surevyImage[0]?.survey_image;

                        } else if (this.surveyData[0]?.surevyImage[0]?.surevy_document) {
                            this.showFile = this.surveyData[0]?.surevyImage[0]?.surevy_document
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


                        if (this.surveyData[0]['user_id'] == JSON.parse(this.userDetails.userId) || this.userDetails.roles[0] == 'admin') {
                            this.updateSurveyData = JSON.parse(this.surveyData[0]['updated_record']);
                            if (this.updateSurveyData != null) {
                                this.updateSurveyData.survey_Answers = JSON.parse(this.updateSurveyData.survey_Answers);
                                if (this.updateSurveyData?.baseImage) {
                                    if (this.updateSurveyData?.baseImage[0]?.image) {
                                        this.updateSurveyData.baseImage[0].image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updateSurveyData?.baseImage[0]?.image.substring(20))) as string;
                                        this.showUpdatedImage = this.updateSurveyData?.baseImage[0]?.image;
                                    } else if (this.updateSurveyData?.baseImage[0]?.documentUrl) {
                                        this.showUpdatedFile = this.updateSurveyData?.baseImage[0]?.documentUrl;

                                    }

                                }


                                // if (this.updateSurveyData?.image) {
                                //     if (this.updateSurveyData.image) {
                                //         if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => this.updateSurveyData.image.endsWith(char))) {
                                //             this.showUpdatedImage = this.updateSurveyData.image;
                                //         } else if (['.pdf', '.doc', '.zip', '.docx', '.docm', '.dot', '.odt', '.txt', '.xml', '.wps', '.xps', '.html', '.htm', '.rtf'].some(char => this.updateSurveyData.image.endsWith(char))) {
                                //             this.showUpdatedFile = this.updateSurveyData.image;
                                //             $('.preview_img').attr('src', '../../../../assets/img/doc-icons/folder.svg');
                                //         }
                                //     }
                                // }
                            }
                        }
                    } else {
                        this.notificationService.showError(this.language.Survey.no_survey, null);
                    }
                } else {
                    this.notificationService.showError(respData['result'], null);
                }
            }
        )
    }

    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "bunch_drop show";
        }
        else {
            this.showToggle = false;
            el[0].className = "bunch_drop";
        }
    }

    goBack() {
        this.router.navigate(['/web/survey']);
    }

    /**
    * Function is used to Approve survey BY admin
    * @author  MangoIt Solutions
    * @param   {survey_id,userId}
    * @return  {staring}
    */
    approveSurvey(survey_id: number) {
        let userId: string = localStorage.getItem('user-id');
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
            self.authService.memberSendRequest('get', 'admin-approve-survey-by-id/' + survey_id + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        const url: string[] = ["/web/survey-vote/" + survey_id];
                        self.router.navigate(url);
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
   * Function is used to Approve updated survey BY admin
   * @author  MangoIt Solutions
   * @param   {survey_id,userId}
   * @return  {staring}
   */
    approveUpdateSurvey(survey_id: number) {
        let userId: string = localStorage.getItem('user-id');
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
            self.authService.memberSendRequest('get', 'approve-updatedsurvey/survey_id/' + survey_id + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to deny survey BY admin
    * @author  MangoIt Solutions
    * @param   {survey_id,userId}
    * @return  {staring}
    */
    denySurvey(survey_id: number) {
        let self = this;
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_survey, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-survey/survey_id/' + survey_id, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        const url: string[] = ["/web/survey-detail/" + survey_id];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to delete survey BY admin
    * @author  MangoIt Solutions
    * @param   {survey_id,userId}
    * @return  {staring}
    */
    surveyDelete(id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_survey, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteSurvey/' + id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.notificationService.showSuccess(respData['result']['message'], null);
                            self.router.navigate(['web/survey'])
                        } else if (respData['code'] == 400) {
                            self.notificationService.showError(respData['message'], null);
                        }
                    }
                )
        }, function () { }
        )
    }

    /**
    * Function is used to delete updated survey BY admin
    * @author  MangoIt Solutions
    * @param   {survey_id,userId}
    * @return  {staring}
    */
    deleteUpdatedSurvey(id: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_survey, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('get', 'get-reset-updatedsurvey/' + id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        const url: string[] = ['/web/survey-detail/' + id];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        }, 'deleteUpdate')
    }

    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemId(id: number) {
        $("#profileSpinner").show();
        this.thumb = '';
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumb = resp.thumbnail
                this.displayError = resp.displayError
            })
            .catch((err: any) => {
                console.log(err);
            })
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
        this.refreshPage.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
    }
}
