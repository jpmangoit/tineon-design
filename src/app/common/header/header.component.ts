import { CommonFunctionService } from './../../service/common-function.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appSetting } from '../../app-settings';
import { AuthServiceService } from '../../service/auth-service.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogService } from '../../update-confirm-dialog/update-confirm-dialog.service';
import { LanguageService } from '../../service/language.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ClubDetail, LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { DenyReasonConfirmDialogService } from 'src/app/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { serverUrl } from 'src/environments/environment';
import { io, Socket } from "socket.io-client";
import { NotificationService } from 'src/app/service/notification.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    clubData: ClubDetail;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    displayFlag: string = 'de';
    alluserDetails: String[] = [];
    getNotificationInterval: number;
    userRespData: string;
    thumbnail: string;
    alreadyAcceptMsg: string;
    showNotifications: string[] = [];
    showNotificationsss: string[] = [];
    responseMessage: string = '';
    memberPhotosuccess: string;
    documentForm: UntypedFormGroup;
    globalSearchForm: UntypedFormGroup;
    setTheme: ThemeType;
    pageUrl: any;
    socket: Socket;
    chatUserArr: any;
    totalUnreadChats: any = 0;
    userId:any;
    file: File;
    fileToReturn: File;
    imageChangedEvent:Event = null;
    image:File
    imgName:string;
    imgErrorMsg: boolean  = false;
    docErrorMsg: boolean = false;
    croppedImage: string = '';
    isImage: boolean = false;
    private activatedSub: Subscription;
    private activatedPro: Subscription;
    private refreshPage:Subscription
    private denyRefreshPage:Subscription
    private removeUpdate:Subscription
    private activatedHeadline:Subscription
    headline_word_option: number = 0;


    constructor(private _router: Router, private route: ActivatedRoute, private themes: ThemeService, private authService: AuthServiceService, private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService, private sanitizer: DomSanitizer,private tostrNotificationService: NotificationService, private notificationService: NotificationsService, private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService, private formbuilder: UntypedFormBuilder,
         private imageCompress: NgxImageCompressService,private commonFunctionService: CommonFunctionService) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe(
            (resp: ThemeType) => {this.setTheme = resp; }
        );
        this.activatedPro = this.themes.profile_imge.subscribe(
            (resp: string) => { this.getUserImage(); }
        );

        this.refreshPage =  this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp =>{
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp =>{
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        })
        this.activatedHeadline = this.commonFunctionService.changeHeadline.subscribe((resp:any) => {
            this.headline_word_option = resp;
        });

        this.showNotifications = [];
        this.showNotificationsss = this.notificationService.getNotifications();

        // setTimeout(() => {
        //     var uniqueArray: any;
        //     uniqueArray = this.showNotificationsss.sort((a: any, b: any) => Number(new Date(a.created_at)) - Number(new Date(b.created_at))).reverse();
        //     if (uniqueArray.length > 0) {
        //         this.showNotifications = uniqueArray.filter((thing, index) => {
        //             const _thing = JSON.stringify(thing);
        //             return index === uniqueArray.findIndex(obj => {
        //                 return JSON.stringify(obj) === _thing;
        //             });
        //         });
        //     }
        // }, 3000);
        this.displayFlag = localStorage.getItem('language');
        this.language = this.lang.getLanguaageFile();
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userId = this.userDetails.userId;
        this.getUserImage();
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        // clearInterval(this.getNotificationInterval);
        // this.getNotificationInterval = window.setInterval(() => {
        //     this.showNotificationsss = this.notificationService.getNotifications();
        //     setTimeout(() => {
        //         this.showNotifications = this.showNotificationsss.sort((a: any, b: any) => Number(new Date(a.created_at)) - Number(new Date(b.created_at))).reverse()
        //         this.showNotifications = this.showNotifications.filter((thing, index) => {
        //             const _thing = JSON.stringify(thing);
        //             return index === this.showNotifications.findIndex(obj => {
        //                 return JSON.stringify(obj) === _thing;
        //             });
        //         });
        //     }, 10000);
        //     this.chats();
        // }, 30000);
        this.globalSearchForm = this.formbuilder.group({
            searchOption: ['', [Validators.required]],
        });
        this.socket = io(serverUrl, { transports: ['websocket'] });
        this.chats();
        this.socket.on('firstusermsg', (msg: any) => {
            this.chats();
        })
    }
    get formControls() { return this.globalSearchForm.controls; }

    globalSearch() {
        if (this.globalSearchForm.invalid) {
            return;
        } else {
            this._router.navigate(['search/' + this.globalSearchForm.value.searchOption]);
            this.globalSearchForm.reset();
        }
    }

    getUserImage() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['code'] == 400) {
                        this.responseMessage = respData['message'].message;
                        this.tostrNotificationService.showError(this.responseMessage,null);
                    } else {
                        this.userRespData = respData;
                        this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                    }
                }
            );
        }
    }

    onLanguageSelect(lan: string) {
        localStorage.setItem('language', lan);
        window.location.reload();
    }

    acceptInvitedCourse(CourseId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation, function () {
            self.authService.memberSendRequest('put', 'acceptCourse/user/' + self.userId + '/course_id/' + CourseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            self.alreadyAcceptMsg = respData['result'];
                            self.tostrNotificationService.showSuccess(self.alreadyAcceptMsg,null);
                            self.ngOnInit();
                            self._router.navigate(["/course-detail/" + CourseId]);
                        }
                    }
                )
        }, function () {
        })
    }

    denyInvitedCourse(courseId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation, function () {
            self.authService.memberSendRequest('delete', 'denyCourse/user/' + self.userId + '/course_id/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    acceptJoinUser(courseId: number, userIId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation, function () {
            self.authService.memberSendRequest('get', 'adminapprove-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            self.alreadyAcceptMsg = respData['result'];
                            // $('#notification-message').modal('show');
                            self.ngOnInit();
                            self._router.navigate(["/course-detail/" + courseId]);
                        }
                    }
                )
        }, function () {
        })
    }

    denyJoinUser(courseId: number, userIId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation, function () {
            self.authService.memberSendRequest('delete', 'admindeny-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedCourses(courseId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, function () {
            self.authService.memberSendRequest('get', 'set-approve-course-status/' + courseId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/course-detail/" + courseId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateCourses(courseId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, function () {
            self.authService.memberSendRequest('get', 'approve-updatedcourse/' + courseId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            self.ngOnInit();
                        } else if (respData['code'] == 400) {
                            self.tostrNotificationService.showError(respData['message'], null);
                        } else {
                            self.tostrNotificationService.showError(this.language.courses.no_course_found, null);
                        }
                    }
                )
        }, function () {
        })
    }


    unapprovedCourse(courseId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-course/course_id/' + courseId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedGroup(groupId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, function () {
            self.authService.memberSendRequest('get', 'approve-group-by-id/' + groupId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    unapproveGroup(groupId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'adminDenyGroup/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    joinGroup(groupId: number, userId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, function () {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": userId,
                    "approved_status": 1
                }
            };
            self.authService.memberSendRequest('put', 'acceptGroup/user/' + userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    acceptGroup(groupId: number) {   //notification
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, function () {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": self.userId,
                    "approved_status": 1
                }
            };
            self.authService.memberSendRequest('put', 'acceptGroup/user/' + self.userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    denyGroup(groupId: number, userId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            self.authService.memberSendRequest('delete', 'denyGroup/user/' + userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    rejectGroup(groupId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            self.authService.memberSendRequest('delete', 'denyGroup/user/' + self.userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    viewGroup(groupId: number) {
        let section = 'Group'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_group, groupId, section, function () {

        }, function () {
        })
    }

    viewUpdatedGroup(groupId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedgroupByUser/' + groupId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/group-detail/" + groupId]);
                    self.ngOnInit();
                }
            )
    }

    viewAcceptedGroup(groupId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'getreadGroupInvitaion/' + groupId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/group-detail/" + groupId]);
                    self.ngOnInit();
                }
            )
    }

    readPublishedGroup(groupId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedgroup-notification/' + groupId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/group-detail/" + groupId]);
                    self.ngOnInit();
                }
            )
    }

    acceptUpdatedGroup(groupId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-updatedGroupByAdmin/group_id/' + groupId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    acceptNews(newsId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-news-by-id/' + newsId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/clubnews-detail/" + newsId]);
                    }
                )
        }, function () {
        })
    }

    acceptUpdatedNews(newsId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-updatednews/' + newsId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/clubnews-detail/" + newsId]);
                    }
                )
        }, function () {
        })
    }

    denyNews(newsId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_article, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-news/news_id/' + newsId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedEvents(eventId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'set-approve-status/' + eventId + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/event-detail/" + eventId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateEvents(eventId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'approve-updatedevent/' + eventId + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {


                        if (respData['isError'] == false) {
                            self.ngOnInit();
                            self._router.navigate(["/event-detail/" + eventId]);
                        } else if (respData['code'] == 400) {
                            self.tostrNotificationService.showError(respData['message'], null);
                        } else {
                            self.tostrNotificationService.showError(this.language.courses.no_course_found, null);
                        }
                    }
                )
        }, function () {
        })
    }

    unapprovedEvent(eventId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_event, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-event/event_id/' + eventId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    acceptInvitedEvent(eventId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_event_invitation, function () {
            self.authService.memberSendRequest('put', 'acceptEvent/user/' + self.userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/event-detail/" + eventId]);
                    }
                )
        }, function () {
        })
    }

    denyInvitedEvent(eventId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_event_invitation, function () {
            self.authService.memberSendRequest('delete', 'denyEvent/user/' + self.userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    adminApprovedTasks(taskId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {

            self.authService.memberSendRequest('get', 'approve-task-as-admin/' + taskId + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/task-detail/" + taskId]);
                    }
                )
        }, function () {
        })
    }

    adminUnapprovedTasks(taskId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_task, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-task/task_id/' + taskId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    adminApprovedUpdateTasks(taskId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {
            self.authService.memberSendRequest('get', 'approve-updatedtask/' + taskId + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/task-detail/" + taskId]);
                    }
                )
        }, function () {
        })
    }

    acceptInvitedTask(taskId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'readtasknotification/' + taskId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/task-detail/" + taskId]);
                    self.ngOnInit();
                }
            )
    }

    acceptInvitedSubTask(subtaskId: number, taskId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'readsubtasknotification/' + subtaskId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self.ngOnInit();
                    self._router.navigate(["/task-detail/" + taskId]);
                }
            )
    }

    viewUpdatedTask(taskId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedtaskByUser/' + taskId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/task-detail/" + taskId]);
                    self.ngOnInit();
                }
            )
    }

    viewCompletedTask(taskId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'readCompletedTasksNotification/' + taskId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/task-detail/" + taskId]);
                    self.ngOnInit();
                }
            )
    }

    acceptMessage(msgId: number, esdb_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_msg, function () {
            self.authService.memberSendRequest('get', 'message/approve-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    denyMessage(msgId: number, esdb_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_msg, function () {
            self.authService.memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedRooms(roomId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'set-approve-room-status/' + roomId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/room-detail/" + roomId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateRooms(roomId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'approve-updatedrooms/' + roomId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/room-detail/" + roomId]);
                    }
                )
        }, function () {
        })
    }

    unapprovedRooms(roomId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_room, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-rooms/room_id/' + roomId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {

        })
    }

    approvedInstructors(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'set-approve-instructor-status/' + instructor_id + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/instructor-detail/" + instructor_id]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateInstructors(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'approve-updatedinstructor/' + instructor_id + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/instructor-detail/" + instructor_id]);
                    }
                )
        }, function () {
        })
    }

    unapprovedInstuctors(instructor_id: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_instructor, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-instructor/instructor_id/' + instructor_id, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedFaqs(faqId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, function () {
            self.authService.memberSendRequest('get', 'admin-approve-faq-by-id/' + faqId + '/approvedby/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/vereins-faq-detail/" + faqId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateFaqs(faqId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, function () {
            self.authService.memberSendRequest('get', 'approve-updatedfaq/' + faqId + '/approvedby/' +self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/vereins-faq-detail/" + faqId]);
                    }
                )
        }, function () {
        })
    }

    denyFaqs(faqsId: number) {
        let self = this;
        self.updateConfirmDialogService.confirmThis(this.language.create_faq.unapproved_faqs, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-faq/faq_id/' + faqsId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/vereins-faq-detail/" + faqsId]);
                    }
                )
        }, function () {
        })
    }

    readApprovedFaqs(faqId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedfaq-notification/' + faqId + '/author/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self.ngOnInit();
                    this._router.navigate(["/vereins-faq"]);
                }
            );
    }

    readUpdatedFaqs(faqId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, function () {
            self.authService.memberSendRequest('get', 'read-notification-updatedfaq/' + faqId + '/user/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(["/vereins-faq-detail/" + faqId]);
                    }
                )
        }, function () {
        })
    }

    approvedFaqsCategory(faqCategoryId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_category, function () {
            self.authService.memberSendRequest('get', 'admin-approve-faqCategory-by-id/' + faqCategoryId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    unapprovedFaqsCategory(faqCategoryId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.create_faq.unapproved_category, function () {
            self.authService.memberSendRequest('delete', 'category/' + faqCategoryId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedSurvey(surveyId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
            self.authService.memberSendRequest('get', 'admin-approve-survey-by-id/' + surveyId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(['/survey-detail/' + surveyId])
                    }
                )
        }, function () {
        })
    }

    unapprovedSurvey(surveyId: number) {
        let self = this;
        var reason = '';
        self.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_survey, function () {
            reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-survey/survey_id/' + surveyId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self._router.navigate(['/survey-detail/' + surveyId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdatedSurvey(survey_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
        self.authService.memberSendRequest('get', 'approve-updatedsurvey/survey_id/' + survey_id + '/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/survey-detail/" + survey_id]);
                    self.ngOnInit();
                }
            )
        }, function () {
        })
    }

    acceptInvitedSurvey(surveyId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'getreadSurveyInvitation/' + surveyId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['success'] == false) {
                        self.alreadyAcceptMsg = respData['message'];

                    } else if (respData['isError'] == false) {
                        self._router.navigate(['/survey-detail/' + surveyId])
                        self.ngOnInit();
                    }
                }
            )
    }

    viewNews(newsId: number) {
        let section = 'News'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_news, newsId, section, function () {

        }, function () {
        })
    }

    viewApprovePublishNewsByAdmin(newsId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedpublishednews/news_id/' + newsId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/clubnews-detail/" + newsId]);
                    self.ngOnInit();
                }
            )
    }

    viewApproveUpdateNewsByAdmin(newsId: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatednews/' + newsId + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/clubnews-detail/" + newsId]);
                    self.ngOnInit();
                }
            )
    }

    viewFaqs(faqId: number) {
        let section = 'FAQS'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_faq, faqId, section, function () {

        }, function () {
        })
    }

    viewDenyPublishTaskByAdmin(taskId: number) {
        let section = 'Task'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_task, taskId, section, function () {

        }, function () {
        })
    }

    viewAcceptPublishTaskByAdmin(task_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedtask-notification/' + task_id + '/organizer/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/task-detail/" + task_id]);
                    self.ngOnInit();
                }
            )
    }

    viewAcceptUpdatedTaskByAdmin(task_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedtask/' + task_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/task-detail/" + task_id]);
                    self.ngOnInit();
                }
            )
    }

    viewDenyPublishInstructorByAdmin(instructor_id: number) {
        let section = 'Instructor'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_instructor, instructor_id, section, function () {

        }, function () {
        })
    }

    viewApprovePublishInstructorByAdmin(instructor_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedinstructor-notification/' + instructor_id + '/author/' + self.userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/instructor-detail/" + instructor_id]);
                self.ngOnInit();
            })
    }

    viewApproveUpdateInstructorByAdmin(instructor_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedinstructor/' + instructor_id + '/user/' + self.userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/instructor-detail/" + instructor_id]);
                self.ngOnInit();
            })
    }

    viewAcceptPublishSurveyByAdmin(survey_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedsurvey-notification/survey_id/' + survey_id + '/author/' + self.userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/survey-detail/" + survey_id]);
            })
    }

    viewPublishUpdateSurveyByAdmin(survey_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedsurvey/' + survey_id + '/user/' + self.userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/survey-detail/" + survey_id]);
            })
    }



    viewDenyPublishSurveyByAdmin(survey_id: number) {
        let section = 'Survey'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_survey, survey_id, section, function () {

        }, function () {
        })
    }

    viewApprovePublishRoomByAdmin(room_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedroom-notification/' + room_id + '/author/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/room-detail/" + room_id]);
                    self.ngOnInit();
                }
            )
    }

    viewApproveUpdateRoomByAdmin(room_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedroom/' + room_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/room-detail/" + room_id]);
                    self.ngOnInit();
                }
            )
    }

    viewDenyPublishRoomByAdmin(room_id: number) {
        let section = 'Room'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_room, room_id, section, function () {

        }, function () {
        })
    }

    viewDenyPublishEventByAdmin(event_id: number) {
        let section = 'Event'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_event, event_id, section, function () {

        }, function () {
        })
    }

    viewApprovePublishEventByAdmin(event_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedevent-notification/' + event_id + '/author/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/event-detail/" + event_id]);
                    self.ngOnInit();
                }
            )
    }


    viewApproveUpdateEventByAdmin(event_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedevent/' + event_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/event-detail/" + event_id]);
                    self.ngOnInit();
                }
            )
    }

    viewUpdateEvent(event_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedeventByUser/' + event_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/event-detail/" + event_id]);
                    self.ngOnInit();
                }
            )
    }

    viewDenyPublishCourseByAdmin(course_id: number) {
        let section = 'Course'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_course, course_id, section, function () {
        }, function () {
        })
    }

    viewApprovePublishCourseByAdmin(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-approvedcourse-notification/' + course_id + '/author/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    viewApproveUpdateCourseByAdmin(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedcourses/' + course_id + '/author/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    viewUpdateCourse(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-notification-updatedCourseByUser/' + course_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    viewInternalCourse(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-courseinternalinstructor-notification/internal-instructor/' + self.userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    viewInternalUpdateCourse(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'readupdate-courseinternalinstructor-notification/internal-instructor/' + self.userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    viewJoinedCourse(course_id: number) {
        let self = this;
        self.authService.memberSendRequest('get', 'read-course-join-message/' + course_id + '/user/' + self.userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/course-detail/" + course_id]);
                    self.ngOnInit();
                }
            )
    }

    uploadFile(event: Event) {
        let userId: string = localStorage.getItem('user-id');
        this.documentForm = new UntypedFormGroup({
            'add_calendar': new UntypedFormControl('',),
            'author': new UntypedFormControl(userId),
            'event_type': new UntypedFormControl('', Validators.required)
        });
        const file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        this.documentForm.patchValue({
            add_calendar: file
        });
        this.documentForm.get('add_calendar').updateValueAndValidity();
        this.insertDoc(file);
        setTimeout(() => {
            this._router.navigate(["/dashboard"]);
            this.authService.setLoader(false);
        }, 3000);
    }

    insertDoc(doc: File) {
        var formData: FormData = new FormData();
        for (const key in this.documentForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.documentForm.value, key)) {
                const element = this.documentForm.value[key];
                if (key == 'add_calendar') {
                    formData.append('file', element);
                }
                else {
                    if (key != 'add_calendar') {
                        formData.append(key, element);
                    }
                }
            }
        }
        this.authService.setLoader(true);
        this.authService.memberSendRequest('post', 'update-calendar', formData)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.responseMessage = respData;
                    this.tostrNotificationService.showSuccess(this.responseMessage,null);

                    if (respData['code'] == 400) {
                        this.responseMessage = respData['message'];
                        this.tostrNotificationService.showError(this.responseMessage,null);
                    }
                }
            );
    }

    chats() {
        this.totalUnreadChats = 0;
        if(!this.userDetails.isMember_light && !this.userDetails.isMember_light_admin){
            this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userDetails.userId, '')
                .subscribe(
                    (resp: any) => {
                        this.chatUserArr = resp;
                        let grp: any;
                        if(this.chatUserArr && this.chatUserArr.length > 0){
                            this.chatUserArr.forEach(element => {
                                this.totalUnreadChats += element.count
                            });
                        }
                    }
                );
        }
    }

    uploadImage(){
        $('#profileImagepPopup').modal('show')
        $("#profileSpinnerHeader").hide();

    }

    closeImagePopup(){
        this.croppedImage = '';
        this.imageChangedEvent = null;
        $('.preview_txt').hide();
        $('.preview_txt').text('');
        $('#profileImagepPopup').modal('hide')
        $("#profileSpinnerHeader").hide();
    }

    /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image or application or text
    */
    errorImage: any = { isError: false, errorMessage: '' };
    uploadFileEvt1(event: Event) {
        // this.thumbnail = '';
        var file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
            const mimeType: string = file.type;
            if (mimeType.match(/image\/*/) == null) {
                this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 3000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event)
            }
        }
    }

    fileChangeEvent(event: any): void {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        this.imageChangedEvent = event;
        const file = (event.target as HTMLInputElement).files[0];
        var mimeType: string = file.type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
        }
    }

    /**
     * Function is used to cropped and compress the uploaded image
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {object} file object
     */
    imageCropped(event: ImageCroppedEvent) {
        this.imageCompress.compressFile(event.base64,-1,50,50, 100, 100) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.croppedImage = compressedImage;
                }
            );
    }

    imageLoaded() {
    }

    cropperReady() {
        /* cropper ready */
        this.isImage = false;

    }

    loadImageFailed() {
        /* show message */
    }

    reloadCurrentRoute() {
        let self = this;
        let currentUrl: string = self._router.url;
        self._router.navigate([currentUrl]);
    }

    /**
    * Function is used to changed user profile Image
    * M-Date: 03 Feb 2023
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {object} user details
    */
    changeImage(){
        if(this.croppedImage){
            $("#profileSpinnerHeader").show();
            let data = {
                "image_file": this.croppedImage.split('base64,')[1]
            }
            let self = this;
            this.authService.memberSendRequest('post', 'change-profile-picture/', data).subscribe(
            (respData: any) => {
                this.memberPhotosuccess = respData;
                if (this.memberPhotosuccess == 'OK') {
                    this.themes.getProfilePicture(this.memberPhotosuccess);
                    this.tostrNotificationService.showSuccess(this.language.profile.upload_profile,null);
                    setTimeout(() => {
                        this.croppedImage = '';
                        $('#profileImagepPopup').modal('hide')
                        $("#profileSpinnerHeader").hide();
                        this.croppedImage = '';
                        this.imageChangedEvent = null;
                        $('.preview_txt').hide();
                        $('.preview_txt').text('');
                    }, 2000);
                }else if (respData['code'] == 400) {
                    $("#profileSpinnerHeader").hide();
                    this.tostrNotificationService.showError(this.language.community_messages.code_error,null);
                }
            });
        }else{
            this.tostrNotificationService.showError(this.language.profile.upload_pic,null);
        }
    }

    isVisible: boolean = false;
    showDropdown() {
        if (!this.isVisible)
            this.isVisible = true;
        else
            this.isVisible = false;
    }

    showMenu: boolean = false;
    onOpen() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("sidebar");
        if (!this.showMenu) {
            this.showMenu = true;
            el[0].className = "sidebar open";
        } else {
            this.showMenu = false;
            el[0].className = "sidebar";
        }
    }

    showToggle: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("navbar-collapse");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "navbar-collapse show";
        } else {
            this.showToggle = false;
            el[0].className = "navbar-collapse";
        }
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this._router.navigate(["/login"]);
    }

    goToProfile() {
        this.showDropdown();
        this._router.navigate(["/profile"]);
    }

    ngOnDestroy(): void {
        clearInterval(this.getNotificationInterval);
        this.activatedSub.unsubscribe();
        this.activatedPro.unsubscribe();
        this.refreshPage.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
        this.activatedHeadline.unsubscribe();
    }
}


