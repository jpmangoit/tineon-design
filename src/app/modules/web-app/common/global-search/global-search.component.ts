import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {CreateAccess, LoginDetails, Room, ThemeType, UserAccess} from '@core/models';
import {Subscription} from 'rxjs';
import {AuthService, CommonFunctionService, LanguageService, NotificationService} from '@core/services';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-global-search',
    templateUrl: './global-search.component.html',
    styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {

    language: any;
    responseMessage: string;
    searchSubmit: boolean = false;
    searchForm: UntypedFormGroup;
    displayCourse: boolean;
    displayInstructor: boolean;
    displayRoom: boolean = true;
    setTheme: ThemeType;
    roomImg: string;
    allRooms: Room[] = [];
    roomsByIdData: Room;
    searchData: Room;
    private activatedSub: Subscription;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    userRole: string;
    searchResult: any;

    constructor(
        public authService: AuthService,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private notificationService: NotificationService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguageFile();
        this.route.params.subscribe((params) => {
            this.searchData = params.searchValue;
            this.getSearchData();
        });
    }

    getSearchData() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberSendRequest('get', 'globalSearch/' + this.searchData + '/' + userData.team_id, null)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.searchResult = respData['result'];

                        if (this.searchResult?.length > 0) {
                            this.searchResult.forEach(element => {

                                if (element?.event) {
                                    element.event.forEach(elem => {
                                        if (elem.event_images[0]?.event_image) {
                                            elem.event_images[0].event_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.event_images[0]?.event_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.courses) {
                                    element.courses.forEach(elem => {
                                        if (elem.course_image[0]?.course_image) {
                                            elem.course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.course_image[0]?.course_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.survey) {
                                    element.survey.forEach(elem => {
                                        if (elem.surevyImage[0]?.survey_image) {
                                            elem.surevyImage[0].survey_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.surevyImage[0]?.survey_image.substring(20)));
                                        }

                                    });
                                }
                                if (element?.faq) {
                                    element.faq.forEach(elem => {
                                        if (elem.faq_image[0]?.faq_image) {
                                            elem.faq_image[0].faq_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.faq_image[0]?.faq_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.news) {
                                    element.news.forEach(elem => {
                                        if (elem.news_image[0]?.news_image) {
                                            elem.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.news_image[0]?.news_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.groups) {
                                    element.groups.forEach(elem => {
                                        if (elem.group_images[0]?.group_image) {
                                            elem.group_images[0].group_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.group_images[0].group_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.instructor) {
                                    element.instructor.forEach(elem => {
                                        if (elem.instructor_image[0]?.instructor_image) {
                                            elem.instructor_image[0].instructor_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.instructor_image[0]?.instructor_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.task) {
                                    element.task.forEach(elem => {
                                        if (elem.task_image[0]?.task_image) {
                                            elem.task_image[0].task_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.task_image[0]?.task_image.substring(20)));
                                        }
                                    });
                                }
                                if (element?.room) {
                                    element.room.forEach(elem => {
                                        if (elem.room_image[0]?.room_image) {
                                            elem.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(elem.room_image[0]?.room_image.substring(20)));
                                        }
                                    });
                                }
                            });
                        }
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }
}
