import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { appSetting } from 'src/app/app-settings';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { DenyReasonConfirmDialogService } from '../../../../shared/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { ThemeService } from 'src/app/service/theme.service';
import { UpdateConfirmDialogService } from '../../../../shared/update-confirm-dialog/update-confirm-dialog.service';
declare var $: any;

@Component({
    selector: 'app-mnotification',
    templateUrl: './mnotification.component.html',
    styleUrls: ['./mnotification.component.css']
})
export class MnotificationComponent implements OnInit {

    createAccess: CreateAccess;
    userAccess: UserAccess;
    userDetails: LoginDetails;
    showNotifications: string[] = [];
    showNotificationsss: string[] = [];
    language: any;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    getNotificationInterval: number;
    alreadyAcceptMsg: string;
    alluserDetails: String[] = [];
    classToggled = false;
    loader: boolean;

    constructor(private _bottomSheetRef: MatBottomSheetRef<MnotificationComponent>, private _router: Router, private route: ActivatedRoute, private themes: ThemeService, public authService: AuthServiceService, private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService, private sanitizer: DomSanitizer, private notificationService: NotificationsService, private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService) { }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    ngOnInit(): void {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: any = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.showNotifications = [];
        this.showNotificationsss = this.notificationService.getNotifications();

        setTimeout(() => {
            this.showNotifications = this.showNotificationsss.sort(function (a: any, b: any) {
                return <any>new Date(b.created_at) - <any>new Date(a.created_at);
            });
        }, 3000);

        this.language = this.lang.getLanguaageFile();
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;

        clearInterval(this.getNotificationInterval);
        this.loader = true;
        this.getNotificationInterval = window.setInterval(() => {
            this.showNotificationsss = this.notificationService.getNotifications();
            setTimeout(() => {
                this.showNotifications = this.showNotificationsss.sort(function (a: any, b: any) {
                    return <any>new Date(b.created_at) - <any>new Date(a.created_at);
                });
            }, 10000);

        }, 30000);

        setTimeout(() => {
            this.loader = false;
        }, 3000);
    }


    in(data: any) {
    }

    acceptInvitedCourse(CourseId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation, function () {
            self.authService.memberSendRequest('put', 'acceptCourse/user/' + userId + '/course_id/' + CourseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            self.alreadyAcceptMsg = respData['result'];
                            self.ngOnInit();
                            self.toggleField();
                            self._router.navigate(["/mobile/course-detail/" + CourseId]);
                        }
                    }
                )
        }, function () {
        })
    }

    denyInvitedCourse(courseId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation, function () {
            self.authService.memberSendRequest('delete', 'denyCourse/user/' + userId + '/course_id/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

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
                            $('#notification-message').modal('show');
                            self.ngOnInit();
                            self.toggleField();

                            self._router.navigate(["/mobile/course-detail/" + courseId]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    approvedCourses(courseId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, function () {
            self.authService.memberSendRequest('get', 'set-approve-course-status/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/course-detail/" + courseId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateCourses(courseId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, function () {
            self.authService.memberSendRequest('get', 'approve-updatedcourse/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    approvedGroup(groupId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, function () {
            self.authService.memberSendRequest('get', 'approve-group-by-id/' + groupId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/group-detail/" + groupId]);
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
                        self.toggleField();

                        self._router.navigate(["/mobile/group-detail/" + groupId]);
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
                        self.toggleField();

                        self._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    acceptGroup(groupId: number) {   //notification
        let self = this;
        let userId: string = localStorage.getItem('user-id');
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
                        self.toggleField();

                        self._router.navigate(["/mobile/group-detail/" + groupId]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    rejectGroup(groupId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            self.authService.memberSendRequest('delete', 'denyGroup/user/' + userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedgroupByUser/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/group-detail/" + groupId]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewAcceptedGroup(groupId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'getreadGroupInvitaion/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/group-detail/" + groupId]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    readPublishedGroup(groupId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedgroup-notification/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/group-detail/" + groupId]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    acceptUpdatedGroup(groupId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-updatedGroupByAdmin/group_id/' + groupId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, function () {
        })
    }

    acceptNews(newsId: number) {
        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            let userId: string = localStorage.getItem('user-id');
            self.authService.memberSendRequest('get', 'approve-news-by-id/' + newsId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/clubnews-detail/" + newsId]);
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
                        self.toggleField();

                        self._router.navigate(["/mobile/clubnews-detail/" + newsId]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    approvedEvents(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'set-approve-status/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/event-detail/" + eventId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateEvents(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'approve-updatedevent/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/event-detail/" + eventId]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    acceptInvitedEvent(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.accept_event_invitation, function () {
            self.authService.memberSendRequest('put', 'acceptEvent/user/' + userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/event-detail/" + eventId]);
                    }
                )
        }, function () {
        })
    }

    denyInvitedEvent(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.deny_event_invitation, function () {
            self.authService.memberSendRequest('delete', 'denyEvent/user/' + userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    adminApprovedTasks(taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {

            self.authService.memberSendRequest('get', 'approve-task-as-admin/' + taskId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/task-detail/" + taskId]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    adminApprovedUpdateTasks(taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, function () {
            self.authService.memberSendRequest('get', 'approve-updatedtask/' + taskId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/task-detail/" + taskId]);
                    }
                )
        }, function () {
        })
    }

    acceptInvitedTask(taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'readtasknotification/' + taskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/task-detail/" + taskId]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    acceptInvitedSubTask(subtaskId: number, taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'readsubtasknotification/' + subtaskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self.ngOnInit();
                    self.toggleField();

                    self._router.navigate(["/mobile/task-detail/" + taskId]);
                }
            )
    }

    viewUpdatedTask(taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedtaskByUser/' + taskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/task-detail/" + taskId]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewCompletedTask(taskId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'readCompletedTasksNotification/' + taskId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/task-detail/" + taskId]);
                    self.ngOnInit();
                    self.toggleField();

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
                        self.toggleField();

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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    approvedRooms(roomId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'set-approve-room-status/' + roomId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/room-detail/" + roomId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateRooms(roomId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'approve-updatedrooms/' + roomId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/room-detail/" + roomId]);
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
                        self.toggleField();

                    }
                )
        }, function () {

        })
    }

    approvedInstructors(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        self.toggleField();

        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'set-approve-instructor-status/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdateInstructors(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        self.toggleField();

        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'approve-updatedinstructor/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
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
                        self.toggleField();

                    }
                )
        }, function () {
        })
    }

    approvedFaqs(faqId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, function () {
            self.authService.memberSendRequest('get', 'admin-approve-faq-by-id/' + faqId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();

                        self._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
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
                        self.toggleField();

                        self._router.navigate(["/mobile/vereins-faq-detail/" + faqsId]);
                    }
                )
        }, function () {
        })
    }

    // unapprovedFaqs(faqId: number) {
    //     let self = this;
    //     self.confirmDialogService.confirmThis(this.language.create_faq.unapproved_faqs, function () {
    //         self.authService.memberSendRequest('delete', 'deleteFaq/' + faqId, null)
    //             .subscribe(
    //                 (respData: any) => {
    //                  self.ngOnInit();
    //                     self.toggleField();
    //                     self._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
    //                 }
    //             )
    //     }, function () {
    //     })
    // }

    readApprovedFaqs(faqId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedfaq-notification/' + faqId + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self.ngOnInit();
                    self.toggleField();
                    this._router.navigate(["/mobile/vereins-faq"]);
                }
            );
    }

    readUpdatedFaqs(faqId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, function () {
            self.authService.memberSendRequest('get', 'read-notification-updatedfaq/' + faqId + '/user/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();
                        self._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
                    }
                )
        }, function () {
        })
    }

    approvedFaqsCategory(faqCategoryId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.create_faq.approved_category, function () {
            self.authService.memberSendRequest('get', 'admin-approve-faqCategory-by-id/' + faqCategoryId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();
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
                        self.toggleField();
                    }
                )
        }, function () {
        })
    }

    approvedSurvey(surveyId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
            self.authService.memberSendRequest('get', 'admin-approve-survey-by-id/' + surveyId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.toggleField();
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
                        self.toggleField();
                        self._router.navigate(['/survey-detail/' + surveyId]);
                    }
                )
        }, function () {
        })
    }

    approvedUpdatedSurvey(survey_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, function () {
        self.authService.memberSendRequest('get', 'approve-updatedsurvey/survey_id/' + survey_id + '/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/survey-detail/" + survey_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
        }, function () {
        })
    }

    acceptInvitedSurvey(surveyId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'getreadSurveyInvitation/' + surveyId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['success'] == false) {
                        self.alreadyAcceptMsg = respData['message'];

                    } else if (respData['isError'] == false) {
                        self._router.navigate(['/survey-detail/' + surveyId])
                        self.ngOnInit();
                        self.toggleField();

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
                    self._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    self.ngOnInit();
                    self.toggleField();


                }
            )
    }

    viewApproveUpdateNewsByAdmin(newsId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatednews/' + newsId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    self.ngOnInit();
                    self.toggleField();

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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedtask-notification/' + task_id + '/organizer/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/task-detail/" + task_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewAcceptUpdatedTaskByAdmin(task_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedtask/' + task_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/task-detail/" + task_id]);
                    self.ngOnInit();
                    self.toggleField();

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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedinstructor-notification/' + instructor_id + '/author/' + userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                self.ngOnInit();
                self.toggleField();

            })
    }

    viewApproveUpdateInstructorByAdmin(instructor_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedinstructor/' + instructor_id + '/user/' + userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                self.ngOnInit();
                self.toggleField();

            })
    }

    viewAcceptPublishSurveyByAdmin(survey_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedsurvey-notification/survey_id/' + survey_id + '/author/' + userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/mobile/survey-detail/" + survey_id]);
            })
    }

    viewPublishUpdateSurveyByAdmin(survey_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedsurvey/' + survey_id + '/user/' + userId, null).subscribe(
            (respData: any) => {
                self._router.navigate(["/mobile/survey-detail/" + survey_id]);
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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedroom-notification/' + room_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/room-detail/" + room_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewApproveUpdateRoomByAdmin(room_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedroom/' + room_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/room-detail/" + room_id]);
                    self.ngOnInit();
                    self.toggleField();

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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedevent-notification/' + event_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/event-detail/" + event_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }


    viewApproveUpdateEventByAdmin(event_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedevent/' + event_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/event-detail/" + event_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewUpdateEvent(event_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedeventByUser/' + event_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/event-detail/" + event_id]);
                    self.ngOnInit();
                    self.toggleField();

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
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-approvedcourse-notification/' + course_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewApproveUpdateCourseByAdmin(course_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedcourses/' + course_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewUpdateCourse(course_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-notification-updatedCourseByUser/' + course_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewInternalCourse(course_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-courseinternalinstructor-notification/internal-instructor/' + userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewInternalUpdateCourse(course_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'readupdate-courseinternalinstructor-notification/internal-instructor/' + userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();

                }
            )
    }

    viewJoinedCourse(course_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.authService.memberSendRequest('get', 'read-course-join-message/' + course_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    self._router.navigate(["/mobile/course-detail/" + course_id]);
                    self.ngOnInit();
                    self.toggleField();


                }
            )
    }

    public toggleField() {
        this.classToggled = !this.classToggled;
    }

    ngOnDestroy(): void {
        clearInterval(this.getNotificationInterval);
    }
}

