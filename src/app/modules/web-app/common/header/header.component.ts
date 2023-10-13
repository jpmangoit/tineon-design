import { CommonFunctionService } from '../../../../service/common-function.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appSetting } from '../../../../app-settings';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogService } from '../../../../shared/update-confirm-dialog/update-confirm-dialog.service';
import { LanguageService } from '../../../../service/language.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ClubDetail, LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { DenyReasonConfirmDialogService } from '../../../../shared/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
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
    userId: any;
    file: File;
    fileToReturn: File;
    imageChangedEvent: Event = null;
    image: File
    imgName: string;
    imgErrorMsg: boolean = false;
    docErrorMsg: boolean = false;
    croppedImage: string = '';
    isImage: boolean = false;
    private activatedSub: Subscription;
    private activatedPro: Subscription;
    private refreshPage: Subscription
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    private activatedHeadline: Subscription
    headline_word_option: number = 0;


    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private themes: ThemeService,
        private authService: AuthServiceService,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private sanitizer: DomSanitizer,
        private tostrNotificationService: NotificationService,
        private notificationService: NotificationsService,
        private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private formbuilder: UntypedFormBuilder,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe(
            (resp: ThemeType) => { this.setTheme = resp; }
        );
        this.activatedPro = this.themes.profile_imge.subscribe(
            (resp: string) => { this.getUserImage(); }
        );

        this.refreshPage = this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        })
        this.activatedHeadline = this.commonFunctionService.changeHeadline.subscribe((resp: any) => {
            this.headline_word_option = resp;
        });

        this.showNotifications = [];
        this.showNotificationsss = this.notificationService.getNotifications();

        setTimeout(() => {
            var uniqueArray: any;
            uniqueArray = this.showNotificationsss.sort((a: any, b: any) => Number(new Date(a.created_at)) - Number(new Date(b.created_at))).reverse();
            if (uniqueArray.length > 0) {
                this.showNotifications = uniqueArray.filter((thing, index) => {
                    const _thing = JSON.stringify(thing);
                    return index === uniqueArray.findIndex(obj => {
                        return JSON.stringify(obj) === _thing;
                    });
                });
            }
        }, 3000);
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
        clearInterval(this.getNotificationInterval);
        this.getNotificationInterval = window.setInterval(() => {
            this.showNotificationsss = this.notificationService.getNotifications();
            setTimeout(() => {
                this.showNotifications = this.showNotificationsss.sort((a: any, b: any) => Number(new Date(a.created_at)) - Number(new Date(b.created_at))).reverse()
                this.showNotifications = this.showNotifications.filter((thing, index) => {
                    const _thing = JSON.stringify(thing);
                    return index === this.showNotifications.findIndex(obj => {
                        return JSON.stringify(obj) === _thing;
                    });
                });
            }, 10000);
            this.chats();
        }, 30000);
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
            this._router.navigate(['/web/search/' + this.globalSearchForm.value.searchOption]);
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
                            this.tostrNotificationService.showError(this.responseMessage, null);
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
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation,  () => {
            this.authService.memberSendRequest('put', 'acceptCourse/user/' + this.userId + '/course_id/' + CourseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.alreadyAcceptMsg = respData['result'];
                            this.tostrNotificationService.showSuccess(this.alreadyAcceptMsg, null);
                            this.ngOnInit();
                            this._router.navigate(["/web/course-detail/" + CourseId]);
                        }
                    }
                )
        },  () => {
        })
    }

    denyInvitedCourse(courseId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation,  () => {
            this.authService.memberSendRequest('delete', 'denyCourse/user/' + this.userId + '/course_id/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    acceptJoinUser(courseId: number, userIId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation,  () => {
            this.authService.memberSendRequest('get', 'adminapprove-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.alreadyAcceptMsg = respData['result'];
                            // $('#notification-message').modal('show');
                            this.ngOnInit();
                            this._router.navigate(["/web/course-detail/" + courseId]);
                        }
                    }
                )
        },  () => {
        })
    }

    denyJoinUser(courseId: number, userIId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation,  () => {
            this.authService.memberSendRequest('delete', 'admindeny-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedCourses(courseId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course,  () => {
            this.authService.memberSendRequest('get', 'set-approve-course-status/' + courseId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/course-detail/" + courseId]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdateCourses(courseId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedcourse/' + courseId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.ngOnInit();
                        } else if (respData['code'] == 400) {
                            this.tostrNotificationService.showError(respData['message'], null);
                        } else {
                            this.tostrNotificationService.showError(this.language.courses.no_course_found, null);
                        }
                    }
                )
        },  () => {
        })
    }


    unapprovedCourse(courseId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-course/course_id/' + courseId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedGroup(groupId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group,  () => {
            this.authService.memberSendRequest('get', 'approve-group-by-id/' + groupId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/group-detail/" + groupId]);
                    }
                )
        },  () => {
        })
    }

    unapproveGroup(groupId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'adminDenyGroup/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/group-detail/" + groupId]);
                    }
                )
        },  () => {
        })
    }

    joinGroup(groupId: number, userId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group,  () => {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": userId,
                    "approved_status": 1
                }
            };
            this.authService.memberSendRequest('put', 'acceptGroup/user/' + userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/group-detail/" + groupId]);
                    }
                )
        },  () => {
        })
    }

    acceptGroup(groupId: number) {   //notification
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group,  () => {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": this.userId,
                    "approved_status": 1
                }
            };
            this.authService.memberSendRequest('put', 'acceptGroup/user/' + this.userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/group-detail/" + groupId]);
                    }
                )
        },  () => {
        })
    }

    denyGroup(groupId: number, userId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group,  () => {
            this.authService.memberSendRequest('delete', 'denyGroup/user/' + userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    rejectGroup(groupId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group,  () => {
            this.authService.memberSendRequest('delete', 'denyGroup/user/' + this.userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    viewGroup(groupId: number) {
        let section = 'Group'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_group, groupId, section,  () => {

        },  () => {
        })
    }

    viewUpdatedGroup(groupId: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedgroupByUser/' + groupId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/group-detail/" + groupId]);
                    this.ngOnInit();
                }
            )
    }

    viewAcceptedGroup(groupId: number) {
        this.authService.memberSendRequest('get', 'getreadGroupInvitaion/' + groupId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/group-detail/" + groupId]);
                    this.ngOnInit();
                }
            )
    }

    readPublishedGroup(groupId: number) {
        this.authService.memberSendRequest('get', 'read-approvedgroup-notification/' + groupId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/group-detail/" + groupId]);
                    this.ngOnInit();
                }
            )
    }

    acceptUpdatedGroup(groupId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedGroupByAdmin/group_id/' + groupId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/group-detail/" + groupId]);
                    }
                )
        },  () => {
        })
    }

    acceptNews(newsId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article,  () => {
            this.authService.memberSendRequest('get', 'approve-news-by-id/' + newsId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/clubnews-detail/" + newsId]);
                    }
                )
        },  () => {
        })
    }

    acceptUpdatedNews(newsId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article,  () => {
            this.authService.memberSendRequest('get', 'approve-updatednews/' + newsId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/clubnews-detail/" + newsId]);
                    }
                )
        },  () => {
        })
    }

    denyNews(newsId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_article,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-news/news_id/' + newsId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedEvents(eventId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event,  () => {
            this.authService.memberSendRequest('get', 'set-approve-status/' + eventId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/event-detail/" + eventId]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdateEvents(eventId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedevent/' + eventId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {


                        if (respData['isError'] == false) {
                            this.ngOnInit();
                            this._router.navigate(["/web/event-detail/" + eventId]);
                        } else if (respData['code'] == 400) {
                            this.tostrNotificationService.showError(respData['message'], null);
                        } else {
                            this.tostrNotificationService.showError(this.language.courses.no_course_found, null);
                        }
                    }
                )
        },  () => {
        })
    }

    unapprovedEvent(eventId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_event,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-event/event_id/' + eventId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    acceptInvitedEvent(eventId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_event_invitation,  () => {
            this.authService.memberSendRequest('put', 'acceptEvent/user/' + this.userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/event-detail/" + eventId]);
                    }
                )
        },  () => {
        })
    }

    denyInvitedEvent(eventId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_event_invitation,  () => {
            this.authService.memberSendRequest('delete', 'denyEvent/user/' + this.userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    adminApprovedTasks(taskId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task,  () => {

            this.authService.memberSendRequest('get', 'approve-task-as-admin/' + taskId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/task-detail/" + taskId]);
                    }
                )
        },  () => {
        })
    }

    adminUnapprovedTasks(taskId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_task,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-task/task_id/' + taskId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    adminApprovedUpdateTasks(taskId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedtask/' + taskId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/task-detail/" + taskId]);
                    }
                )
        },  () => {
        })
    }

    acceptInvitedTask(taskId: number) {
        this.authService.memberSendRequest('get', 'readtasknotification/' + taskId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/task-detail/" + taskId]);
                    this.ngOnInit();
                }
            )
    }

    acceptInvitedSubTask(subtaskId: number, taskId: number) {
        this.authService.memberSendRequest('get', 'readsubtasknotification/' + subtaskId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this.ngOnInit();
                    this._router.navigate(["/web/task-detail/" + taskId]);
                }
            )
    }

    viewUpdatedTask(taskId: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedtaskByUser/' + taskId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/task-detail/" + taskId]);
                    this.ngOnInit();
                }
            )
    }

    viewCompletedTask(taskId: number) {
        this.authService.memberSendRequest('get', 'readCompletedTasksNotification/' + taskId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/task-detail/" + taskId]);
                    this.ngOnInit();
                }
            )
    }

    acceptMessage(msgId: number, esdb_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_msg,  () => {
            this.authService.memberSendRequest('get', 'message/approve-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    denyMessage(msgId: number, esdb_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_msg,  () => {
            this.authService.memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedRooms(roomId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_room,  () => {
            this.authService.memberSendRequest('get', 'set-approve-room-status/' + roomId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/room-detail/" + roomId]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdateRooms(roomId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_room,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedrooms/' + roomId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/room-detail/" + roomId]);
                    }
                )
        },  () => {
        })
    }

    unapprovedRooms(roomId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_room,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-rooms/room_id/' + roomId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {

        })
    }

    approvedInstructors(instructor_id: number) {
        this.ngOnInit();
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_instructor,  () => {
            this.authService.memberSendRequest('get', 'set-approve-instructor-status/' + instructor_id + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/instructor-detail/" + instructor_id]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdateInstructors(instructor_id: number) {
        this.ngOnInit();
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_instructor,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedinstructor/' + instructor_id + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/instructor-detail/" + instructor_id]);
                    }
                )
        },  () => {
        })
    }

    unapprovedInstuctors(instructor_id: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_instructor,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-instructor/instructor_id/' + instructor_id, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedFaqs(faqId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs,  () => {
            this.authService.memberSendRequest('get', 'admin-approve-faq-by-id/' + faqId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/vereins-faq-detail/" + faqId]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdateFaqs(faqId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedfaq/' + faqId + '/approvedby/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/vereins-faq-detail/" + faqId]);
                    }
                )
        },  () => {
        })
    }

    denyFaqs(faqsId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.create_faq.unapproved_faqs,  () => {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-faq/faq_id/' + faqsId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/vereins-faq-detail/" + faqsId]);
                    }
                )
        },  () => {
        })
    }

    readApprovedFaqs(faqId: number) {
        this.authService.memberSendRequest('get', 'read-approvedfaq-notification/' + faqId + '/author/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this.ngOnInit();
                    this._router.navigate(["/web/vereins-faq"]);
                }
            );
    }

    readUpdatedFaqs(faqId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs,  () => {
            this.authService.memberSendRequest('get', 'read-notification-updatedfaq/' + faqId + '/user/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(["/web/vereins-faq-detail/" + faqId]);
                    }
                )
        },  () => {
        })
    }

    approvedFaqsCategory(faqCategoryId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_category,  () => {
            this.authService.memberSendRequest('get', 'admin-approve-faqCategory-by-id/' + faqCategoryId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    unapprovedFaqsCategory(faqCategoryId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.unapproved_category,  () => {
            this.authService.memberSendRequest('delete', 'category/' + faqCategoryId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    approvedSurvey(surveyId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey,  () => {
            this.authService.memberSendRequest('get', 'admin-approve-survey-by-id/' + surveyId + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(['/web/survey-detail/' + surveyId])
                    }
                )
        },  () => {
        })
    }

    unapprovedSurvey(surveyId: number) {
        var reason = '';
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_survey,  () => {
            reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-survey/survey_id/' + surveyId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this._router.navigate(['/web/survey-detail/' + surveyId]);
                    }
                )
        },  () => {
        })
    }

    approvedUpdatedSurvey(survey_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey,  () => {
            this.authService.memberSendRequest('get', 'approve-updatedsurvey/survey_id/' + survey_id + '/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this._router.navigate(["/web/survey-detail/" + survey_id]);
                        this.ngOnInit();
                    }
                )
        },  () => {
        })
    }

    acceptInvitedSurvey(surveyId: number) {
        this.authService.memberSendRequest('get', 'getreadSurveyInvitation/' + surveyId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['success'] == false) {
                        this.alreadyAcceptMsg = respData['message'];

                    } else if (respData['isError'] == false) {
                        this._router.navigate(['/web/survey-detail/' + surveyId])
                        this.ngOnInit();
                    }
                }
            )
    }

    viewNews(newsId: number) {
        console.log(newsId);

        let section = 'News'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_news, newsId, section,  () => {

        },  () => {
        })
    }

    viewApprovePublishNewsByAdmin(newsId: number) {
        this.authService.memberSendRequest('get', 'read-approvedpublishednews/news_id/' + newsId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/clubnews-detail/" + newsId]);
                    this.ngOnInit();
                }
            )
    }

    viewApproveUpdateNewsByAdmin(newsId: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatednews/' + newsId + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/clubnews-detail/" + newsId]);
                    this.ngOnInit();
                }
            )
    }

    viewFaqs(faqId: number) {
        let section = 'FAQS'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_faq, faqId, section,  () => {

        },  () => {
        })
    }

    viewDenyPublishTaskByAdmin(taskId: number) {
        let section = 'Task'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_task, taskId, section,  () => {

        },  () => {
        })
    }

    viewAcceptPublishTaskByAdmin(task_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedtask-notification/' + task_id + '/organizer/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/task-detail/" + task_id]);
                    this.ngOnInit();
                }
            )
    }

    viewAcceptUpdatedTaskByAdmin(task_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedtask/' + task_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/task-detail/" + task_id]);
                    this.ngOnInit();
                }
            )
    }

    viewDenyPublishInstructorByAdmin(instructor_id: number) {
        let section = 'Instructor'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_instructor, instructor_id, section,  () => {

        },  () => {
        })
    }

    viewApprovePublishInstructorByAdmin(instructor_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedinstructor-notification/' + instructor_id + '/author/' + this.userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/web/instructor-detail/" + instructor_id]);
                this.ngOnInit();
            })
    }

    viewApproveUpdateInstructorByAdmin(instructor_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedinstructor/' + instructor_id + '/user/' + this.userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/web/instructor-detail/" + instructor_id]);
                this.ngOnInit();
            })
    }

    viewAcceptPublishSurveyByAdmin(survey_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedsurvey-notification/survey_id/' + survey_id + '/author/' + this.userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/web/survey-detail/" + survey_id]);
            })
    }

    viewPublishUpdateSurveyByAdmin(survey_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedsurvey/' + survey_id + '/user/' + this.userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/web/survey-detail/" + survey_id]);
            })
    }



    viewDenyPublishSurveyByAdmin(survey_id: number) {
        let section = 'Survey'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_survey, survey_id, section,  () => {

        },  () => {
        })
    }

    viewApprovePublishRoomByAdmin(room_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedroom-notification/' + room_id + '/author/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/room-detail/" + room_id]);
                    this.ngOnInit();
                }
            )
    }

    viewApproveUpdateRoomByAdmin(room_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedroom/' + room_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/room-detail/" + room_id]);
                    this.ngOnInit();
                }
            )
    }

    viewDenyPublishRoomByAdmin(room_id: number) {
        let section = 'Room'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_room, room_id, section,  () => {

        },  () => {
        })
    }

    viewDenyPublishEventByAdmin(event_id: number) {
        let section = 'Event'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_event, event_id, section,  () => {

        },  () => {
        })
    }

    viewApprovePublishEventByAdmin(event_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedevent-notification/' + event_id + '/author/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/event-detail/" + event_id]);
                    this.ngOnInit();
                }
            )
    }


    viewApproveUpdateEventByAdmin(event_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedevent/' + event_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/event-detail/" + event_id]);
                    this.ngOnInit();
                }
            )
    }

    viewUpdateEvent(event_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedeventByUser/' + event_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/event-detail/" + event_id]);
                    this.ngOnInit();
                }
            )
    }

    viewDenyPublishCourseByAdmin(course_id: number) {
        let section = 'Course'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_course, course_id, section,  () => {
        },  () => {
        })
    }

    viewApprovePublishCourseByAdmin(course_id: number) {
        this.authService.memberSendRequest('get', 'read-approvedcourse-notification/' + course_id + '/author/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
                }
            )
    }

    viewApproveUpdateCourseByAdmin(course_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedcourses/' + course_id + '/author/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
                }
            )
    }

    viewUpdateCourse(course_id: number) {
        this.authService.memberSendRequest('get', 'read-notification-updatedCourseByUser/' + course_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
                }
            )
    }

    viewInternalCourse(course_id: number) {
        this.authService.memberSendRequest('get', 'read-courseinternalinstructor-notification/internal-instructor/' + this.userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
                }
            )
    }

    viewInternalUpdateCourse(course_id: number) {
        this.authService.memberSendRequest('get', 'readupdate-courseinternalinstructor-notification/internal-instructor/' + this.userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
                }
            )
    }

    viewJoinedCourse(course_id: number) {
        this.authService.memberSendRequest('get', 'read-course-join-message/' + course_id + '/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/web/course-detail/" + course_id]);
                    this.ngOnInit();
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
            this._router.navigate(["/web/dashboard"]);
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
                    this.tostrNotificationService.showSuccess(this.responseMessage, null);

                    if (respData['code'] == 400) {
                        this.responseMessage = respData['message'];
                        this.tostrNotificationService.showError(this.responseMessage, null);
                    }
                }
            );
    }

    chats() {
        this.totalUnreadChats = 0;
        if (!this.userDetails.isMember_light && !this.userDetails.isMember_light_admin) {
            this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userDetails.userId, '')
                .subscribe(
                    (resp: any) => {
                        this.chatUserArr = resp;
                        let grp: any;
                        if (this.chatUserArr && this.chatUserArr.length > 0) {
                            this.chatUserArr.forEach(element => {
                                this.totalUnreadChats += element.count
                            });
                        }
                    }
                );
        }
    }

    uploadImage() {
        $('#profileImagepPopup').modal('show')
        $("#profileSpinnerHeader").hide();

    }

    closeImagePopup() {
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
        this.imageCompress.compressFile(event.base64, -1, 50, 50, 100, 100) // 50% ratio, 50% quality
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
        let currentUrl: string = this._router.url;
        this._router.navigate([currentUrl]);
    }

    /**
    * Function is used to changed user profile Image
    * M-Date: 03 Feb 2023
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {object} user details
    */
    changeImage() {
        if (this.croppedImage) {
            $("#profileSpinnerHeader").show();
            let data = {
                "image_file": this.croppedImage.split('base64,')[1]
            }

            this.authService.memberSendRequest('post', 'change-profile-picture/', data).subscribe(
                (respData: any) => {
                    this.memberPhotosuccess = respData;
                    if (this.memberPhotosuccess == 'OK') {
                        this.themes.getProfilePicture(this.memberPhotosuccess);
                        this.tostrNotificationService.showSuccess(this.language.profile.upload_profile, null);
                        setTimeout(() => {
                            this.croppedImage = '';
                            $('#profileImagepPopup').modal('hide')
                            $("#profileSpinnerHeader").hide();
                            this.croppedImage = '';
                            this.imageChangedEvent = null;
                            $('.preview_txt').hide();
                            $('.preview_txt').text('');
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        $("#profileSpinnerHeader").hide();
                        this.tostrNotificationService.showError(this.language.community_messages.code_error, null);
                    }
                });
        } else {
            this.tostrNotificationService.showError(this.language.profile.upload_pic, null);
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
        this.authService.sendRequest('put', 'setLoginStatus/' + this.userDetails.userId, null).subscribe((resp) => {
            if (resp['isError'] == false) {
                sessionStorage.clear();
                localStorage.clear();
                this._router.navigate(["/login"]);
            } else if (resp['code'] == 400) {
                // this.notificationService.showError(resp['message'], null);

            }
        })
    }

    goToProfile() {
        this.showDropdown();
        this._router.navigate(["/web/profile"]);
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


