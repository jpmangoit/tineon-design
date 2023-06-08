import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Room } from 'src/app/models/room.model';
import { CreateAccess, UserAccess } from 'src/app/models/user-access.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NotificationService } from 'src/app/service/notification.service';
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
        public authService: AuthServiceService,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
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
                                    var url: string[] = [];
                                    if (elem.picture_video != null && elem.picture_video != '') {
                                        if (elem.picture_video) {
                                            url = elem.picture_video.split('"');
                                            if (url && url.length > 0) {
                                                url.forEach((el) => {
                                                    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                        elem.picture_video = el;
                                                    }
                                                });
                                            } else {
                                                elem.picture_video = '';
                                            }
                                        }
                                    }

                                });
                            }
                            if (element?.courses) {
                                element.courses.forEach(elem => {
                                    var url: string[] = [];
                                    if (elem?.picture_video != null && elem?.picture_video != '') {
                                        if (elem?.picture_video) {
                                            url = elem.picture_video.split('"');
                                            // url = JSON.parse(elem.picture_video);
                                            if (url?.length > 0) {
                                                url.forEach((el) => {
                                                    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                        elem.picture_video = el;
                                                    }
                                                });
                                            } else {
                                                elem.picture_video = '';
                                            }
                                        }
                                    }
                                });
                            }
                            if (element?.survey) {
                                element.survey.forEach(elem => {
                                    var url: string[] = [];
                                    if (elem?.image != null && elem?.image != '') {
                                        if (elem?.image) {
                                            url = elem.image.split('"');
                                            // url = JSON.parse(elem.image);
                                            if (url?.length > 0) {
                                                url.forEach((el) => {
                                                    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                        elem.image = el;
                                                    }else{
                                                        elem.image = '';
                                                    }
                                                });
                                            } else {
                                                elem.image = '';
                                            }
                                        }
                                    }
                                });
                            }
                            if (element?.faq) {
                                element.faq.forEach(elem => {
                                    var url: string[] = [];
                                    if (elem?.image != null && elem?.image != '') {
                                        if (elem?.image) {
                                            url = elem.image.split('"');
                                            // url = JSON.parse(elem.image);
                                            if (url?.length > 0) {
                                                url.forEach((el) => {
                                                    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                        elem.image = el;
                                                    }else{
                                                        elem.image = '';
                                                    }
                                                });
                                            } else {
                                                elem.image = '';
                                            }
                                        }
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
