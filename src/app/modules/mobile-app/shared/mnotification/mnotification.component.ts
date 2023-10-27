import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthorizationAccess, CreateAccess, LoginDetails, ParticipateAccess, UserAccess} from '@core/models';
import {AuthServiceService, LanguageService, NotificationsService, ThemeService} from '@core/services';
import {ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService} from '@shared/components';
import {appSetting} from '@core/constants';

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

        this.language = this.lang.getLanguageFile();
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
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation, () => {
            this.authService.memberSendRequest('put', 'acceptCourse/user/' + userId + '/course_id/' + CourseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.alreadyAcceptMsg = respData['result'];
                            this.ngOnInit();
                            this.toggleField();
                            this._router.navigate(["/mobile/course-detail/" + CourseId]);
                        }
                    }
                )
        }, () => {
        })
    }

    denyInvitedCourse(courseId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation, () => {
            this.authService.memberSendRequest('delete', 'denyCourse/user/' + userId + '/course_id/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    acceptJoinUser(courseId: number, userIId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_course_invitation, () => {
            this.authService.memberSendRequest('get', 'adminapprove-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.alreadyAcceptMsg = respData['result'];
                            $('#notification-message').modal('show');
                            this.ngOnInit();
                            this.toggleField();

                            this._router.navigate(["/mobile/course-detail/" + courseId]);
                        }
                    }
                )
        }, () => {
        })
    }

    denyJoinUser(courseId: number, userIId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_course_invitation, () => {
            this.authService.memberSendRequest('delete', 'admindeny-waitingtojoin-courserequests/course_id/' + courseId + '/user_id/' + userIId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    approvedCourses(courseId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, () => {
            this.authService.memberSendRequest('get', 'set-approve-course-status/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/course-detail/" + courseId]);
                    }
                )
        }, () => {
        })
    }

    approvedUpdateCourses(courseId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, () => {
            this.authService.memberSendRequest('get', 'approve-updatedcourse/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }


    unapprovedCourse(courseId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-course/course_id/' + courseId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    approvedGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, () => {
            this.authService.memberSendRequest('get', 'approve-group-by-id/' + groupId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, () => {
        })
    }

    unapproveGroup(groupId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'adminDenyGroup/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, () => {
        })
    }

    joinGroup(groupId: number, userId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, () => {
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
                        this.toggleField();

                        this._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, () => {
        })
    }

    acceptGroup(groupId: number) {   //notification
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, () => {
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
                        this.toggleField();

                        this._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, () => {
        })
    }

    denyGroup(groupId: number, userId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, () => {
            this.authService.memberSendRequest('delete', 'denyGroup/user/' + userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    rejectGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, () => {
            this.authService.memberSendRequest('delete', 'denyGroup/user/' + userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    viewGroup(groupId: number) {
        let section = 'Group'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_group, groupId, section, () => {

        }, () => {
        })
    }

    viewUpdatedGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedgroupByUser/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/group-detail/" + groupId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewAcceptedGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'getreadGroupInvitaion/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/group-detail/" + groupId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    readPublishedGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedgroup-notification/' + groupId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/group-detail/" + groupId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    acceptUpdatedGroup(groupId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, () => {
            this.authService.memberSendRequest('get', 'approve-updatedGroupByAdmin/group_id/' + groupId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/group-detail/" + groupId]);
                    }
                )
        }, () => {
        })
    }

    acceptNews(newsId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, () => {
            let userId: string = localStorage.getItem('user-id');
            this.authService.memberSendRequest('get', 'approve-news-by-id/' + newsId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    }
                )
        }, () => {
        })
    }

    acceptUpdatedNews(newsId: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, () => {
            this.authService.memberSendRequest('get', 'approve-updatednews/' + newsId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    }
                )
        }, () => {
        })
    }

    denyNews(newsId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_article, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-news/news_id/' + newsId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    approvedEvents(eventId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, () => {
            this.authService.memberSendRequest('get', 'set-approve-status/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/event-detail/" + eventId]);
                    }
                )
        }, () => {
        })
    }

    approvedUpdateEvents(eventId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, () => {
            this.authService.memberSendRequest('get', 'approve-updatedevent/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/event-detail/" + eventId]);
                    }
                )
        }, () => {
        })
    }

    unapprovedEvent(eventId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_event, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-event/event_id/' + eventId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    acceptInvitedEvent(eventId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_event_invitation, () => {
            this.authService.memberSendRequest('put', 'acceptEvent/user/' + userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/event-detail/" + eventId]);
                    }
                )
        }, () => {
        })
    }

    denyInvitedEvent(eventId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_event_invitation, () => {
            this.authService.memberSendRequest('delete', 'denyEvent/user/' + userId + '/event_id/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    adminApprovedTasks(taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, () => {

            this.authService.memberSendRequest('get', 'approve-task-as-admin/' + taskId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/task-detail/" + taskId]);
                    }
                )
        }, () => {
        })
    }

    adminUnapprovedTasks(taskId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_task, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-task/task_id/' + taskId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    adminApprovedUpdateTasks(taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_task, () => {
            this.authService.memberSendRequest('get', 'approve-updatedtask/' + taskId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/task-detail/" + taskId]);
                    }
                )
        }, () => {
        })
    }

    acceptInvitedTask(taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'readtasknotification/' + taskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/task-detail/" + taskId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    acceptInvitedSubTask(subtaskId: number, taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'readsubtasknotification/' + subtaskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this.ngOnInit();
                    this.toggleField();

                    this._router.navigate(["/mobile/task-detail/" + taskId]);
                }
            )
    }

    viewUpdatedTask(taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedtaskByUser/' + taskId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/task-detail/" + taskId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewCompletedTask(taskId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'readCompletedTasksNotification/' + taskId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/task-detail/" + taskId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    acceptMessage(msgId: number, esdb_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_msg, () => {
            this.authService.memberSendRequest('get', 'message/approve-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    denyMessage(msgId: number, esdb_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_msg, () => {
            this.authService.memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    approvedRooms(roomId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_room, () => {
            this.authService.memberSendRequest('get', 'set-approve-room-status/' + roomId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/room-detail/" + roomId]);
                    }
                )
        }, () => {
        })
    }

    approvedUpdateRooms(roomId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_room, () => {
            this.authService.memberSendRequest('get', 'approve-updatedrooms/' + roomId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/room-detail/" + roomId]);
                    }
                )
        }, () => {
        })
    }

    unapprovedRooms(roomId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_room, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-rooms/room_id/' + roomId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {

        })
    }

    approvedInstructors(instructor_id: number) {
        this.ngOnInit();
        this.toggleField();

        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_instructor, () => {
            this.authService.memberSendRequest('get', 'set-approve-instructor-status/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                    }
                )
        }, () => {
        })
    }

    approvedUpdateInstructors(instructor_id: number) {
        this.ngOnInit();
        this.toggleField();

        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_instructor, () => {
            this.authService.memberSendRequest('get', 'approve-updatedinstructor/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                    }
                )
        }, () => {
        })
    }

    unapprovedInstuctors(instructor_id: number) {
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_instructor, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-instructor/instructor_id/' + instructor_id, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    approvedFaqs(faqId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, () => {
            this.authService.memberSendRequest('get', 'admin-approve-faq-by-id/' + faqId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
                    }
                )
        }, () => {
        })
    }

    denyFaqs(faqsId: number) {
        this.updateConfirmDialogService.confirmThis(this.language.create_faq.unapproved_faqs, (reason) => {
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-faq/faq_id/' + faqsId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();

                        this._router.navigate(["/mobile/vereins-faq-detail/" + faqsId]);
                    }
                )
        }, () => {
        })
    }

    // unapprovedFaqs(faqId: number) {
    //
    //     this.confirmDialogService.confirmThis(this.language.create_faq.unapproved_faqs, ()=> {
    //         this.authService.memberSendRequest('delete', 'deleteFaq/' + faqId, null)
    //             .subscribe(
    //                 (respData: any) => {
    //                  this.ngOnInit();
    //                     this.toggleField();
    //                     this._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
    //                 }
    //             )
    //     }, ()=> {
    //     })
    // }

    readApprovedFaqs(faqId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedfaq-notification/' + faqId + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this.ngOnInit();
                    this.toggleField();
                    this._router.navigate(["/mobile/vereins-faq"]);
                }
            );
    }

    readUpdatedFaqs(faqId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_faqs, () => {
            this.authService.memberSendRequest('get', 'read-notification-updatedfaq/' + faqId + '/user/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();
                        this._router.navigate(["/mobile/vereins-faq-detail/" + faqId]);
                    }
                )
        }, () => {
        })
    }

    approvedFaqsCategory(faqCategoryId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.create_faq.approved_category, () => {
            this.authService.memberSendRequest('get', 'admin-approve-faqCategory-by-id/' + faqCategoryId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();
                    }
                )
        }, () => {
        })
    }

    unapprovedFaqsCategory(faqCategoryId: number) {
        this.confirmDialogService.confirmThis(this.language.create_faq.unapproved_category, () => {
            this.authService.memberSendRequest('delete', 'category/' + faqCategoryId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();
                    }
                )
        }, () => {
        })
    }

    approvedSurvey(surveyId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, () => {
            this.authService.memberSendRequest('get', 'admin-approve-survey-by-id/' + surveyId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();
                        this._router.navigate(['/mobile/survey-detail/' + surveyId])
                    }
                )
        }, () => {
        })
    }

    unapprovedSurvey(surveyId: number) {
        var reason = '';
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_survey, () => {
            reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": this.userDetails.userId
            };
            this.authService.memberSendRequest('put', 'deny-survey/survey_id/' + surveyId, postData)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                        this.toggleField();
                        this._router.navigate(['/mobile/survey-detail/' + surveyId]);
                    }
                )
        }, () => {
        })
    }

    approvedUpdatedSurvey(survey_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_survey, () => {
            this.authService.memberSendRequest('get', 'approve-updatedsurvey/survey_id/' + survey_id + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this._router.navigate(["/mobile/survey-detail/" + survey_id]);
                        this.ngOnInit();
                        this.toggleField();

                    }
                )
        }, () => {
        })
    }

    acceptInvitedSurvey(surveyId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'getreadSurveyInvitation/' + surveyId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['success'] == false) {
                        this.alreadyAcceptMsg = respData['message'];

                    } else if (respData['isError'] == false) {
                        this._router.navigate(['/mobile/survey-detail/' + surveyId])
                        this.ngOnInit();
                        this.toggleField();

                    }
                }
            )
    }

    viewNews(newsId: number) {
        let section = 'News'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_news, newsId, section, () => {

        }, () => {
        })
    }

    viewApprovePublishNewsByAdmin(newsId: number) {
        this.authService.memberSendRequest('get', 'read-approvedpublishednews/news_id/' + newsId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    this.ngOnInit();
                    this.toggleField();


                }
            )
    }

    viewApproveUpdateNewsByAdmin(newsId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatednews/' + newsId + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/clubnews-detail/" + newsId]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewFaqs(faqId: number) {
        let section = 'FAQS'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_faq, faqId, section, () => {

        }, () => {
        })
    }

    viewDenyPublishTaskByAdmin(taskId: number) {
        let section = 'Task'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_task, taskId, section, () => {

        }, () => {
        })
    }

    viewAcceptPublishTaskByAdmin(task_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedtask-notification/' + task_id + '/organizer/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/task-detail/" + task_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewAcceptUpdatedTaskByAdmin(task_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedtask/' + task_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/task-detail/" + task_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewDenyPublishInstructorByAdmin(instructor_id: number) {
        let section = 'Instructor'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_instructor, instructor_id, section, () => {

        }, () => {
        })
    }

    viewApprovePublishInstructorByAdmin(instructor_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedinstructor-notification/' + instructor_id + '/author/' + userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                this.ngOnInit();
                this.toggleField();

            })
    }

    viewApproveUpdateInstructorByAdmin(instructor_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedinstructor/' + instructor_id + '/user/' + userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/mobile/instructor-detail/" + instructor_id]);
                this.ngOnInit();
                this.toggleField();

            })
    }

    viewAcceptPublishSurveyByAdmin(survey_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedsurvey-notification/survey_id/' + survey_id + '/author/' + userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/mobile/survey-detail/" + survey_id]);
            })
    }

    viewPublishUpdateSurveyByAdmin(survey_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedsurvey/' + survey_id + '/user/' + userId, null).subscribe(
            (respData: any) => {
                this._router.navigate(["/mobile/survey-detail/" + survey_id]);
            })
    }



    viewDenyPublishSurveyByAdmin(survey_id: number) {
        let section = 'Survey'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_survey, survey_id, section, () => {

        }, () => {
        })
    }

    viewApprovePublishRoomByAdmin(room_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedroom-notification/' + room_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/room-detail/" + room_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewApproveUpdateRoomByAdmin(room_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedroom/' + room_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/room-detail/" + room_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewDenyPublishRoomByAdmin(room_id: number) {
        let section = 'Room'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_room, room_id, section, () => {

        }, () => {
        })
    }

    viewDenyPublishEventByAdmin(event_id: number) {
        let section = 'Event'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_event, event_id, section, () => {

        }, () => {
        })
    }

    viewApprovePublishEventByAdmin(event_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedevent-notification/' + event_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/event-detail/" + event_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }


    viewApproveUpdateEventByAdmin(event_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedevent/' + event_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/event-detail/" + event_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewUpdateEvent(event_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedeventByUser/' + event_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/event-detail/" + event_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewDenyPublishCourseByAdmin(course_id: number) {
        let section = 'Course'
        this.denyReasonService.confirmThis(this.language.confirmation_message.admin_denied_course, course_id, section, () => {
        }, () => {
        })
    }

    viewApprovePublishCourseByAdmin(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-approvedcourse-notification/' + course_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewApproveUpdateCourseByAdmin(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedcourses/' + course_id + '/author/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewUpdateCourse(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-notification-updatedCourseByUser/' + course_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewInternalCourse(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-courseinternalinstructor-notification/internal-instructor/' + userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewInternalUpdateCourse(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'readupdate-courseinternalinstructor-notification/internal-instructor/' + userId + '/course_id/' + course_id, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();

                }
            )
    }

    viewJoinedCourse(course_id: number) {
        let userId: string = localStorage.getItem('user-id');
        this.authService.memberSendRequest('get', 'read-course-join-message/' + course_id + '/user/' + userId, null)
            .subscribe(
                (respData: any) => {
                    this._router.navigate(["/mobile/course-detail/" + course_id]);
                    this.ngOnInit();
                    this.toggleField();


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

