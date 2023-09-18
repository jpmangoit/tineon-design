import { Injectable } from '@angular/core';
import { appSetting } from '../app-settings';
import { LoginDetails } from '../models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from '../models/user-access.model';
import { AuthServiceService } from '../service/auth-service.service';
import { LanguageService } from '../service/language.service';
import { CommonFunctionService } from './common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any

@Injectable({
    providedIn: 'root'
})

export class NotificationsService {
    language: any;
    userDetails: LoginDetails;
    user_id: any;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    displayFlag: string = 'de';
    alluserDetails: { firstname: string, lastname: string }[] = [];
    showNotifications: any[] = [];
    allowAdvertisment: any;
    constructor(private authService: AuthServiceService, private lang: LanguageService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,) { }

    getNotifications() {
        this.showNotifications = [];
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.user_id = this.userDetails.userId;
        this.userAccess = appSetting.role;
        let userRole: string = this.userDetails.roles[0];
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        let self = this;
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData) {
                        Object(respData).forEach((val, key) => {
                            this.alluserDetails[val.id] = { firstname: val.firstname, lastname: val.lastname };
                        })
                        if (userRole == 'admin') {
                            // ----------Group---------
                            self.getAllGroupsNotifications();
                            // ----------News----------
                            self.getAllNewsNotifications();
                            //----------FAQ----------
                            self.getAllFAQsNotifications();
                            //----------Task----------
                            self.getAllTasksNotifications();
                            //----------Instructor----------
                            self.getAllInstructorsNotifications();
                            //----------Room----------
                            self.getAllRoomsNotifications();
                            //----------Event----------
                            self.getAllEventsNotifications();
                            //----------Course----------
                            self.getAllCoursesNotifications();
                            //----------Survey----------
                            self.getAllSurveysNotifications();
                            // ----------Message----------
                            self.getMessageWaitingToApprove();
                            // // ----------Banners----------
                            if (self.allowAdvertisment == 0) {
                                self.getBanners();
                            }
                        } else if (userRole == 'member_light_admin' || userRole == 'member_light') {
                        } else {
                            // ----------Group---------
                            self.getAllGroupsUsersNotifications();
                            // ----------News----------
                            self.getAllNewsUsersNotifications();
                            //----------FAQ----------
                            self.getAllFAQsUsersNotifications();
                            //----------Task----------
                            self.getAllTasksUsersNotifications()
                            //----------Instructor----------
                            self.getAllInstructorsUsersNotifications();
                            //----------Room----------
                            self.getAllRoomsUsersNotifications();
                            //----------Event----------
                            self.getAllEventsUsersNotifications();
                            //----------Course----------
                            self.getAllCoursesUsersNotifications();
                            //----------Survey----------
                            self.getAllSurveysUsersNotifications();
                            // ----------Banners----------
                            if (self.allowAdvertisment == 0) {
                                self.getBanners();
                            }
                        }
                    }
                });
        return this.showNotifications;
    }

    //----------Admin Roles--------
    getAllGroupsNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedGroupNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })

                    }
                }
            );
    }


    getAllNewsNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedNewsNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllFAQsNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedFaqNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllInstructorsNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedInstructorNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllRoomsNotifications() {
        this.authService.memberSendRequest('get', 'UnapprovedRoomsNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllEventsNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedEventNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllSurveysNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedSurveyNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllCoursesNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedCourseNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllTasksNotifications() {
        this.authService.memberSendRequest('get', 'unapprovedTaskNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getMessageWaitingToApprove() {
        this.authService.memberSendRequest('get', 'message/waiting-to-approve', null)
            .subscribe(
                (respData: any) => {
                    if (respData && respData.length > 0) {
                        respData.forEach(element => {
                            if (element && (element.id != null || element.id != '')) {
                                this.showNotifications.push({
                                    'id': element.id,
                                    'firstName': this.alluserDetails[element.user]?.firstname,
                                    'lastName': this.alluserDetails[element.user]?.lastname,
                                    'title': element.subject,
                                    'notificationType': 'messageNotifications',
                                    'created_at': element.created_at,
                                    'esdb_id': element.esdb_id
                                });
                            }
                        });
                    }
                }
            );
    }

    getBanners() {
        this.authService.memberSendRequest('get', 'getBannerDetailsForNotification', null)
            .subscribe(
                (respData: any) => {
                    if (respData.isError == false) {
                        let bannerLists = respData['result']['banner']
                        if (bannerLists?.length > 0) {
                            bannerLists.forEach((element: any) => {
                                element['category'] = JSON.parse(element.category);
                                element['placement'] = JSON.parse(element.placement);
                                element['display'] = JSON.parse(element.display);
                                if (element.banner_image[0]?.banner_image) {
                                    element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0]?.banner_image.substring(20)));
                                }
                                if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                    element['redirectLink'] = element.redirectLink;
                                } else {
                                    element['redirectLink'] = '//' + element.redirectLink;
                                }
                                this.showNotifications.push({
                                    'id': element.id,
                                    'bannerName': element.bannerName,
                                    'image': element.banner_image[0].banner_image,
                                    'redirectLink': element.redirectLink,
                                    'description': element.description,
                                    'notificationType': 'banners',
                                    'created_at': element.created_at,
                                })
                            });
                        }
                    }
                })
    }

    //----------others Roles--------
    getAllNewsUsersNotifications() {
        this.authService.memberSendRequest('get', 'newsNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllFAQsUsersNotifications() {
        this.authService.memberSendRequest('get', 'faqNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllRoomsUsersNotifications() {
        this.authService.memberSendRequest('get', 'roomsNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllGroupsUsersNotifications() {
        this.authService.memberSendRequest('get', 'groupNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllInstructorsUsersNotifications() {
        this.authService.memberSendRequest('get', 'instructorNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllEventsUsersNotifications() {
        this.authService.memberSendRequest('get', 'eventNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllSurveysUsersNotifications() {
        this.authService.memberSendRequest('get', 'surveyNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllCoursesUsersNotifications() {
        this.authService.memberSendRequest('get', 'courseNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

    getAllTasksUsersNotifications() {
        this.authService.memberSendRequest('get', 'taskNotificationForUser', null)
            .subscribe(
                (respData: any) => {
                    if (respData?.['result']?.length > 0) {
                        respData['result'].forEach((element: any) => {
                            this.showNotifications.push(element);
                        })
                    }
                }
            );
    }

}
