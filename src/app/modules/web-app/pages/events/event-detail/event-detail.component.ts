import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { LoginDetails, ProfileDetails, TaskCollaboratorDetails, ThemeType } from '@core/models';
import { AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService } from '@core/services';
import { ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService } from '@shared/components';


declare var $: any;

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css']
})

export class EventDetailComponent implements OnInit, OnDestroy {
    language: any;
    eventDetails: any = null;
    showImage: boolean = false;
    showUpdateImage: boolean = false
    displayError: boolean = false;
    setTheme: ThemeType;
    organizerDetails: { email: string, firstname: string, id: number, image: SafeUrl, lastname: string, username: string }[] = [];
    unapprovedParticipants: { email: string, firstname: string, id: number, image: SafeUrl, lastname: string, username: string }[] = [];
    approvedParticipants: { email: string, firstname: string, id: number, image: SafeUrl, lastname: string, username: string }[] = [];
    memImg: { email: string, firstname: string, id: number, image: SafeUrl, lastname: string, username: string }[] = [];
    member_id: number;
    un_id: number;
    profile_data: ProfileDetails;
    memberStartDateStatus: Date;
    birthdateStatus: boolean;
    getclubInfo: ProfileDetails;
    thumbnail: string;
    alluserInformation: { member_id: number }[] = [];
    thumb: SafeUrl;
    docFile: string;
    fileArray: string[] = [];
    updateFileArray: string[] = [];
    imageurl: string
    updateImageurl: string
    userDetails: LoginDetails;
    role: any;
    userId: any;
    private activatedSub: Subscription;
    updateEventData: any;
    private refreshPage: Subscription;
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    collaborators: any[] = [];
    collaboratorDetails: TaskCollaboratorDetails[] = [];
    taskOrganizerDetails: any[] = [];
    taskOrganizerDetailsUpdated: any[] = [];
    count: number = 0;
    isTaskDetails: boolean = false;
    isTaskDetailsUpdate: boolean = false;
    responseMessage: any;
    countParti: number = 0;
    allUsers: any;
    eventId: any;
    eventDate: any;
    result: any;
    documentData: any;
    dowloading: boolean = false;
    approvedParticipantsNew: any[] = [];
    deniedParticipants: any[] = [];

    selectedTask: any;

    constructor(
        private authService: AuthServiceService,
        private router: Router,
        private route: ActivatedRoute, private themes: ThemeService,
        private _location: Location,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private notificationService: NotificationService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) {
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
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userDetails.roles[0];
        this.userId = this.userDetails.userId;
        this.language = this.lang.getLanguageFile();
        this.route.params.subscribe(params => {
            const eventid: number = params['eventid'];
            this.eventId = eventid;
            //this.getEventDetails(eventid);
        });
        this.route.queryParams.subscribe(params => {
            this.eventDate = params.date
        });
        this.getAllUserInfo();
    }

    /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
    getAllUserInfo() {
        let self = this;
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData?.length > 0) {
                        this.allUsers = respData;
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                        this.getEventDetails(this.eventId);
                    }
                }
            );
    }

    /**
    * Function to get particular Event Detail
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {}
    * @return  {Array Of Object} Event all detail
    */
    getEventDetails(eventid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-event-by-id/' + eventid, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.eventDetails = [];
                            this.organizerDetails = [];
                            this.approvedParticipants = [];
                            this.unapprovedParticipants = [];
                            this.authService.setLoader(false);
                            this.updateEventData = null;
                            this.eventDetails = respData['result'][0];
                            console.log( this.eventDetails);
                            

                            this.eventDetails.date_from = this.eventDate ? this.eventDate + 'T' + this.eventDetails.date_from.split('T')[1] : this.eventDetails.date_from
                            this.eventDetails.recurring_dates = JSON.parse(this.eventDetails.recurring_dates);
                            this.eventDetails.recurring_dates.forEach((element: any) => {
                                element.start_time = this.commonFunctionService.convertTime(element.start_time);
                                element.end_time = this.commonFunctionService.convertTime(element.end_time);
                            });
                            if (this.eventDate) {
                                this.eventDetails.recurring_dates.unshift(this.eventDetails.recurring_dates.splice(this.eventDetails.recurring_dates.findIndex(elt => elt.date_from === this.eventDate), 1)[0]);
                            }
                            if (this.eventDetails) {

                                if (this.eventDetails?.event_images[0]?.event_image) {
                                    this.showImage = true;
                                    this.eventDetails.event_images[0].event_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.eventDetails?.event_images[0]?.event_image.substring(20)));
                                    this.imageurl = this.eventDetails?.event_images[0]?.event_image
                                }
                                else {
                                    this.showImage = false;
                                    this.imageurl = '';
                                }

                                if (this.eventDetails?.event_images[0]?.event_document) {
                                    this.docFile = this.eventDetails?.event_images[0]?.event_document;
                                }
                                this.getOrganizerDetails(eventid);
                                this.getParticipantDetails(eventid);

                                if (this.eventDetails['author'] == JSON.parse(this.userDetails.userId) || this.userDetails.roles[0] == 'admin') {
                                    if (this.eventDetails['updated_record'] != null && this.eventDetails['updated_record'] != "") {
                                        this.updateEventData = JSON.parse(this.eventDetails['updated_record']);
                                        this.updateEventData['users'] = JSON.parse(this.updateEventData['users']);
                                        this.updateEventData['task'] = JSON.parse(this.updateEventData['task']);
                                        this.updateEventData['recurring_dates'] = JSON.parse(this.updateEventData['eventDate']);
                                        console.log(this.eventDetails);

                                        if (this.updateEventData?.baseImage[0]?.image != null) {
                                            this.showUpdateImage = true;
                                            if (this.updateEventData?.baseImage[0]?.image) {
                                                this.updateEventData.baseImage[0].image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updateEventData?.baseImage[0]?.image.substring(20)));
                                                this.updateImageurl = this.updateEventData?.baseImage[0]?.image
                                            }
                                        } else {
                                            this.showUpdateImage = false;
                                            this.updateImageurl = '';
                                        }
                                        if (this.updateEventData?.baseImage[0]?.documentUrl) {
                                            this.docFile = this.updateEventData?.baseImage[0]?.documentUrl;
                                        }
                                        if (this.updateEventData && this.updateEventData.users.length > 0) {
                                            // this.updateEventData.date_from = this.eventDate ? this.eventDate + 'T' + this.updateEventData.date_from.split(' ')[1] : this.updateEventData.date_from
                                            this.updateEventData.users.forEach(element => {
                                                if (parseInt(element.user_id) != parseInt(this.eventDetails['author'])) {
                                                    if (this.allUsers?.length > 0) {
                                                        this.allUsers.forEach((el: any) => {
                                                            if (parseInt(el.id) == parseInt(element.user_id)) {
                                                                element.user = el;
                                                                if (element.user.member_id != null) {
                                                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + element.user.member_id, null)
                                                                        .subscribe(
                                                                            (resppData: any) => {
                                                                                this.thumb = resppData;
                                                                                element.user.image = this.thumb
                                                                            },
                                                                            (error: any) => {
                                                                                element.user.image = null;
                                                                            });
                                                                } else {
                                                                    element.user.image = null;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                            this.updateEventData.users = Object.assign(this.authService.uniqueObjData(this.updateEventData.users, 'user_id'));
                                            this.updateEventData.users = this.updateEventData.users.filter(item => item.user !== undefined);

                                        }
                                        if (this.updateEventData?.task?.length > 0) {
                                            this.isTaskDetailsUpdate = true
                                            this.updateEventData?.task[0]?.taskCollaborators.forEach(element => {
                                                // if (element.user_id != this.updateEventData[0]?.['organizer_id']) {
                                                if (this.allUsers?.length > 0) {
                                                    this.allUsers.forEach((el: any) => {
                                                        if (el.id == element.user_id) {
                                                            element.user = el;
                                                            if (element.user.member_id != null) {
                                                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + element.user.member_id, null)
                                                                    .subscribe(
                                                                        (resppData: any) => {
                                                                            this.thumb = resppData;
                                                                            element.user.image = this.thumb
                                                                        },
                                                                        (error: any) => {
                                                                            element.user.image = null;
                                                                        });
                                                            } else {
                                                                element.user.image = null;
                                                            }
                                                        }
                                                    });
                                                }
                                                // }
                                                if (element.user_id == this.updateEventData?.task[0]?.['organizer_id']) {
                                                    this.taskOrganizerDetailsUpdated.push(element);
                                                }
                                            });
                                        }

                                        if (this.updateEventData.room != 'null') {
                                            this.commonFunctionService.roomsById(this.updateEventData.room)
                                                .then((resp: any) => {
                                                    this.updateEventData.roomData = resp;
                                                })
                                                .catch((erro: any) => {
                                                    this.notificationService.showError(erro, null);
                                                });
                                        }
                                    }
                                }
                            }
                            if (this.eventDetails && this.eventDetails.eventTask && Object.keys(this.eventDetails.eventTask).length != 0) {
                                this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + this.eventDetails?.eventTask.id, null)
                                    .subscribe((respData: any) => {
                                        if (respData && respData.length > 0) {
                                            respData.forEach(ele => {
                                                if (ele.user_id == this.userDetails.userId) {
                                                    this.countParti = 1;
                                                }
                                            });
                                        }
                                    });
                                setTimeout(() => {
                                    if (this.eventDetails?.eventTask['organizer_id'] == this.userDetails.userId || this.userDetails.isAdmin == true || this.countParti == 1)
                                        this.isTaskDetails = true;
                                    this.setUsers(this.eventDetails?.eventTask?.id)

                                }, 2000);
                            }
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    /**
   * Function to get Organizer of particular Event
   * @author  MangoIt Solutions
   * @param   {CourseId}
   * @return  {Array Of Object} orgnizer detail
   */
    getOrganizerDetails(eventid: number) {
        if (sessionStorage.getItem('token')) {
            this.organizerDetails = [];
            this.approvedParticipants = []
            this.unapprovedParticipants = [];
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'approvedParticipants/event/' + eventid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData?.length > 0) {
                            respData.forEach((value, key) => {
                                if (this.eventDetails.author == value.users.id) {
                                    this.organizerDetails.push(value.users);
                                    Object(this.organizerDetails).forEach((val, key) => {
                                        val.image = null;
                                        if (this.alluserInformation[val.id] && this.alluserInformation[val.id] != null) {
                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.id].member_id, null)
                                                .subscribe(
                                                    (resppData: any) => {
                                                        this.thumb = resppData;
                                                        val.image = this.thumb;
                                                    },
                                                    (error: any) => {
                                                        val.image = null;
                                                    });
                                        }
                                    })
                                } else {
                                    this.approvedParticipants.push(value);
                                    Object(this.approvedParticipants).forEach((val, key) => {
                                        val.users.image = null;
                                        val.id = val.users.id;
                                        if (this.alluserInformation[val.users.id] && this.alluserInformation[val.users.id].member_id != null) {
                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.users.id].member_id, null)
                                                .subscribe(
                                                    (resppData: any) => {
                                                        this.thumb = resppData;
                                                        val.users.image = this.thumb;
                                                    },
                                                    (error: any) => {
                                                        val.users.image = null;
                                                    });
                                        }
                                    });
                                }
                            });
                            this.organizerDetails = Object.assign(this.authService.uniqueObjData(this.organizerDetails, 'id'));
                            this.approvedParticipants = Object.assign(this.authService.uniqueObjData(this.approvedParticipants, 'id'));
                            this.approvedParticipantsNew = this.approvedParticipants.filter((item: any) => item.approved_status === 1);
                            this.deniedParticipants = this.approvedParticipants.filter((item: any) => item.approved_status === 3);
                        }
                    }
                );
        }
    }

    /**
    * Function to get the participants of particular Event
    * @author  MangoIt Solutions
    * @param   {EventId}
    * @return  {Array Of Object} all the participants details
    */
    getParticipantDetails(eventid: number) {
        if (sessionStorage.getItem('token')) {
            this.unapprovedParticipants = [];
            this.memImg = [];
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'unapprovedParticipants/event/' + eventid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.unapprovedParticipants = respData;
                        if (this.unapprovedParticipants && this.unapprovedParticipants.length > 0) {
                            Object(this.unapprovedParticipants).forEach((val, key) => {
                                if (val) {
                                    if (this.alluserInformation[val.id] && this.alluserInformation[val.id].member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.id].member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    val.image = this.thumb;
                                                },
                                                (error: any) => {
                                                    val.image = null;
                                                });
                                    } else {
                                        val.image = null;
                                    }
                                }
                                this.memImg.push(val);
                            });
                            this.memImg = Object.assign(this.authService.uniqueObjData(this.memImg, 'id'));
                        }
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemId(id: number) {
        this.thumbnail = '';
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumbnail = resp.thumbnail
                this.displayError = resp.displayError
            })
            .catch((err: any) => {
                console.log(err);
            })
    }

    /**
   * Function to get a particular tasks' details
   * @author MangoIt Solutions (M)
   * @param {user id}
   * @returns {Object} Details of the task
   */
    getTaskDetails(taskInfo: any) {
        this.selectedTask = taskInfo;
    }

    approvedEvents(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'set-approve-status/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedUpdateEvents(eventId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_event, function () {
            self.authService.memberSendRequest('get', 'approve-updatedevent/' + eventId + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            self.ngOnInit();
                            self.getEventDetails(eventId)
                        } else if (respData['code'] == 400) {
                            self.notificationService.showError(respData['message'], null);
                        } else {
                            self.notificationService.showError(this.language.courses.no_course_found, null);
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

    deleteEvents(eventId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_event, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'event/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        const url: string[] = ["/web/organizer"];
                        self.router.navigate(url);
                    }
                )
        }, function () {
            $('.dropdown-toggle').trigger('click');
        })
    }

    deleteUpdateEvents(eventId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_event, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('get', 'get-reset-updatedevent/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.responseMessage = respData['result']['message'];
                            self.notificationService.showSuccess(self.responseMessage, null);
                            self.router.navigate(["/web/event-detail/" + eventId]);
                        } else if (respData['code'] == 400) {
                            self.responseMessage = respData['message'];
                            self.notificationService.showError(self.responseMessage, null);
                        }
                    }
                )
        }, function () { }, 'deleteUpdate')
    }

    /**
     * Function  for display Hamburger Menu
     */
    showToggle: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "bunch_drop show";

        } else {
            this.showToggle = false;
            el[0].className = "bunch_drop";
        }
    }
    onShowTask() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("Task-toggle");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "Task-toggle show";

        } else {
            this.showToggle = false;
            el[0].className = "Task-toggle";
        }
    }
    goBack() {
        this.router.navigate(['/web/organizer']);
    }

    /**
    * Function is used to set users participants
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {TaskId}
    * @return  {Array Of Object} users all detail
    */
    setUsers(taskid: number) {
        if (sessionStorage.getItem('token')) {
            this.taskOrganizerDetails = [];
            this.collaborators = [];
            this.collaboratorDetails = []
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.collaboratorDetails = respData;
                        Object(this.collaboratorDetails) && Object(this.collaboratorDetails).forEach((val, key) => {
                            if (val?.user?.length > 0) {
                                val.user.forEach(element => {
                                    if (element.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + element.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    val.image = this.thumb
                                                },
                                                (error: any) => {
                                                    val.image = null;
                                                });
                                    } else {
                                        val.image = null;
                                    }
                                });
                            }
                        });
                        let org_id = 0;
                        if (this.collaboratorDetails && this.collaboratorDetails.length > 0) {
                            this.collaboratorDetails.forEach((value: any) => {
                                if (value.user_id == this.eventDetails?.eventTask?.['organizer_id']) {
                                    this.taskOrganizerDetails.push(value);
                                    org_id = 1;
                                } else {
                                    this.collaborators.push(value);
                                }
                            })
                            this.collaborators = Object.assign(this.authService.uniqueObjData(this.collaborators, 'id'));
                        }
                    }
                );
        }
    }

    /**
    * Function is used to make the task completed
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {Taskid}
    * @return  {success and error message}
    */
    mainTaskMarkComplete(taskId: number) {
        let self = this;
        var subtaskStatus: number = 0;
        if (this.eventDetails.eventTask['id'] == taskId) {

            this.confirmDialogService.confirmThis(this.language.confirmation_message.complete_task, function () {
                self.authService.setLoader(true);
                self.authService.memberSendRequest('get', 'approveTaskById/task/' + taskId, null).subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.notificationService.showSuccess(respData['result'], null);
                            setTimeout(() => {
                                self.ngOnInit();

                            }, 3000);
                        } else if (respData['code'] == 400) {
                            self.notificationService.showError(respData['result'], null);
                        }
                    }
                )
            }, function () {
                $('#styled-checkbox-' + taskId).prop('checked', false);
            })

        }
    }

    /**
    * Function is used to download document
    * @author  MangoIt Solutions
    * @param   {path}
    */
    download(path: any) {
        let data = {
            name: path
        }
        this.dowloading = true;
        var endPoint = 'download-document';
        if (data && data.name) {
            let filename = data.name.split('/').reverse()[0];
            this.authService.downloadDocument('post', endPoint, data).toPromise()
                .then((blob: any) => {
                    saveAs(blob, filename);
                    this.authService.setLoader(false);
                    this.dowloading = false;
                    setTimeout(() => {
                        this.authService.sendRequest('post', 'delete-document/uploads', data).subscribe((result: any) => {
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

    ngOnDestroy(): void {
        this.refreshPage.unsubscribe();
        this.activatedSub.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
    }

    hasComma(str: string) {
        if (str) {
            return str.replace(/,/g, ".");
        } else {
            return str;
        }
    }
}
