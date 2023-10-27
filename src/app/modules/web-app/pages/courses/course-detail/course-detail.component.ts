import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import {LoginDetails, ProfileDetails, TaskCollaboratorDetails, ThemeType} from '@core/models';
import {Subscription} from 'rxjs';
import {AuthService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService} from '@shared/components';

declare var $: any;

@Component({
    selector: 'app-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.css']
})

export class CourseDetailComponent implements OnInit {
    language: any;
    updateCourseData: any
    courseDetails: any
    setTheme: ThemeType;
    userDetails: LoginDetails;
    role: any;
    userId: any;
    private activatedSub: Subscription;
    responseMessage: any;
    eventImage: string;
    eventUpdateImage: string;
    eventFile: string;
    eventUpdateFile: string;
    hasPicture: boolean = false;
    hasUpdatePicture: boolean = false;
    thumb: string;
    count: number;
    countParti: number = 0;
    alluserInformation: { member_id: string }[] = [];
    memImg: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[] = [];
    unapprovedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    approvedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    organizerDetails: { email: string, firstname: string, id: number, lastname: string, username: string }[] = [];
    private refreshPage: Subscription
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    collaborators: any[] = [];
    collaboratorDetails: TaskCollaboratorDetails[] = [];
    taskOrganizerDetails: any[] = [];
    taskOrganizerDetailsUpdated: any[] = [];
    isTaskDetails: boolean = false;
    isTaskDetailsUpdate: boolean = false;
    allUsers: any;
    getclubInfo: ProfileDetails;
    memberStartDateStatus: Date;
    displayError: boolean = false;
    birthdateStatus: boolean;
    profile_data: ProfileDetails;
    thumbnail: string;
    courseDate: any;

    result: any;
    documentData: any;
    dowloading: boolean = false;

    constructor(private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private updateConfirmDialogService: UpdateConfirmDialogService,
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
        this.route.queryParams.subscribe(params => {
            this.courseDate = params.date
        });
        this.getAllUserInfo()
    }

    /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
    getAllUserInfo() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData && respData.length > 0) {
                        this.allUsers = respData;
                        this.route.params.subscribe(params => {
                            const courseId: number = params['courseId'];
                            this.getCourseDetails(courseId);
                        });
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                    }
                },
            );
    }

    /**
    * Function is used to get Course details
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {CourseId}
    * @return  {Array Of Object} Courses detail
    */
    getCourseDetails(courseId: any) {
        this.authService.setLoader(true);
        this.memImg = [];
        this.eventImage = '';
        this.eventFile = '';
        this.authService.memberSendRequest('get', 'getCoursesById/' + courseId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false && Object.keys(respData.result).length > 0) {
                        this.courseDetails = null;
                        this.updateCourseData = null;
                        this.courseDetails = respData['result'];
                        if (this.courseDetails?.length > 0) {
                            this.courseDetails.forEach(element => {
                                if (this.allUsers?.length > 0) {
                                    this.allUsers.forEach(el => {
                                        if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                            if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                if (el.member_id != null) {
                                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                        .subscribe(
                                                            (resppData: any) => {
                                                                this.thumb = resppData;
                                                                element.CourseInternalInstructor[0].internalUsers.add_img = this.thumb;
                                                            },
                                                            (error: any) => {
                                                                element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                            });
                                                } else {
                                                    element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                }
                                            }
                                        }
                                    });
                                }
                                element.recurring_dates = JSON.parse(element.recurring_dates);
                            });
                        }
                        this.courseDetails[0]?.recurring_dates.forEach((element: any) => {
                            element.start_time = this.commonFunctionService.convertTime(element.start_time);
                            element.end_time = this.commonFunctionService.convertTime(element.end_time);
                        })

                        if (this.courseDate) {
                            this.courseDetails[0].recurring_dates.unshift(this.courseDetails[0].recurring_dates.splice(this.courseDetails[0].recurring_dates.findIndex(elt => elt.date_from === this.courseDate), 1)[0]);
                        }

                        this.courseDetails[0]['date_from'] = this.courseDate ? this.courseDate + 'T' + this.courseDetails[0]?.date_from.split('T')[1] : this.courseDetails[0]?.date_from;
                        if (this.courseDetails[0]?.course_image[0]?.course_image != "[]") {
                            this.hasPicture = true;
                            if (this.courseDetails[0]?.course_image[0]?.course_image) {
                                this.courseDetails[0].course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.courseDetails[0]?.course_image[0]?.course_image.substring(20)));
                                this.eventImage = this.courseDetails[0]?.course_image[0]?.course_image
                            }
                        } else {
                            this.hasPicture = false;
                            this.eventImage = '';
                        }
                        if (this.courseDetails[0]?.course_image[0]?.course_document) {
                            this.eventFile = this.courseDetails[0].course_image[0]?.course_document;
                        }
                        this.getOrganizerDetails(courseId);
                        this.getParticipantDetails(courseId);
                        if (this.courseDetails[0]?.['author'] == JSON.parse(this.userId) || this.userDetails.roles[0] == 'admin') {
                            if (this.courseDetails[0]['updated_record'] != null && this.courseDetails[0]['updated_record'] != "") {
                                this.updateCourseData = JSON.parse(this.courseDetails[0]['updated_record']);
                                // this.updateCourseData.date_from = this.courseDate ? this.courseDate + 'T' + this.updateCourseData.date_from.split(' ')[1] : this.updateCourseData.date_from
                                this.updateCourseData['course_users'] = JSON.parse(this.updateCourseData['course_users']);
                                this.updateCourseData['courseDate'] = JSON.parse(this.updateCourseData['courseDate']);
                                this.updateCourseData['task'] = JSON.parse(this.updateCourseData['task']);
                                this.updateCourseData['participant'] = this.updateCourseData['participant'];

                                if (this.updateCourseData['instructor_external']) {
                                    this.updateCourseData['instructor_external'] = JSON.parse(this.updateCourseData['instructor_external']);
                                }
                                if (this.updateCourseData['instructor_internal']) {
                                    this.updateCourseData['instructor_internal'] = JSON.parse(this.updateCourseData['instructor_internal']);
                                }

                                this.updateCourseData['course_users'] = this.updateCourseData['course_users'].filter((item) => item.user_id != this.courseDetails[0].author);
                                if (this.updateCourseData && this.updateCourseData['course_users'].length > 0) {
                                    this.updateCourseData['course_users'].forEach(element => {
                                        if (this.allUsers && this.allUsers.length > 0) {
                                            this.allUsers.forEach(el => {
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
                                    });
                                }

                                if (this.updateCourseData?.baseImage[0]?.image) {
                                    this.hasUpdatePicture = true;
                                    if (this.updateCourseData?.baseImage[0]?.image) {
                                        this.updateCourseData.baseImage[0].image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updateCourseData?.baseImage[0]?.image.substring(20)));
                                        this.eventUpdateImage = this.updateCourseData?.baseImage[0]?.image
                                    }
                                } else {
                                    this.hasUpdatePicture = false;
                                    this.eventUpdateImage = '';
                                }
                                if (this.updateCourseData?.baseImage[0]?.documentUrl) {
                                    this.eventUpdateFile = this.updateCourseData?.baseImage[0]?.documentUrl;
                                }

                                if (this.updateCourseData?.task?.length > 0) {
                                    this.isTaskDetailsUpdate = true
                                    this.taskOrganizerDetailsUpdated = [];
                                    this.updateCourseData?.task[0]?.taskCollaborators.forEach(element => {
                                        if (this.allUsers && this.allUsers.length > 0) {
                                            this.allUsers.forEach(el => {
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

                                        if (element.user_id == this.updateCourseData?.task[0]?.['organizer_id']) {
                                            this.taskOrganizerDetailsUpdated.push(element);
                                        }
                                    });
                                }
                                if (this.updateCourseData?.room != 'null') {
                                    this.commonFunctionService.roomsById(this.updateCourseData?.room)
                                        .then((resp: any) => {
                                            this.updateCourseData.roomData = resp;
                                        })
                                        .catch((erro: any) => {
                                            this.notificationService.showError(erro, null);
                                        });
                                }
                            }
                        }

                        if (this.courseDetails && this.courseDetails[0]?.courseTask && Object.keys(this.courseDetails[0]?.courseTask).length != 0) {
                            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + this.courseDetails[0]?.courseTask.id, null)
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
                                if (this.courseDetails && this.courseDetails[0]?.courseTask && this.courseDetails[0]?.courseTask['organizer_id'] == this.userDetails.userId || this.userDetails.isAdmin == true || this.countParti == 1) {
                                    this.isTaskDetails = true;
                                    this.setUsers(this.courseDetails[0]?.courseTask?.id);
                                }
                            }, 2000);
                        }
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    } else {
                        this.notificationService.showError(this.language.courses.no_course_found, null);
                    }
                    this.authService.setLoader(false);
                }
            )
    }

    /**
   * Function to get Organizer of particular Course
   * @author  MangoIt Solutions
   * @param   {CourseId}
   * @return  {Array Of Object} orgnizer detail
   */
    getOrganizerDetails(courseId: number) {
        this.organizerDetails = [];
        this.approvedParticipants = [];
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'approvedParticipants/course/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData && respData.length > 0) {
                            respData.forEach((value, key) => {
                                if (this.courseDetails[0].author == value.users.id) {
                                    this.organizerDetails.push(value);
                                    Object(this.organizerDetails).forEach((val, key) => {
                                        val.users.image = null;
                                        val.id = val.users.id;
                                        if (this.alluserInformation[val.users.id] && this.alluserInformation[val.users.id] != null) {
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
                        }
                    }
                );
        }
    }

    /**
    * Function to get the participants of particular Course
    * @author  MangoIt Solutions
    * @param   {CourseId}
    * @return  {Array Of Object} all the participants details
    */
    getParticipantDetails(courseId: number) {
        this.unapprovedParticipants = []
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.memImg = [];
            this.authService.memberSendRequest('get', 'unapprovedParticipants/course/' + courseId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData && respData.length > 0) {
                            this.unapprovedParticipants = respData;
                            Object(this.unapprovedParticipants).forEach((val, key) => {
                                if (this.alluserInformation[val.id]?.member_id != null) {
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
                                this.memImg.push(val);
                            });
                            this.memImg = Object.assign(this.authService.uniqueObjData(this.memImg, 'id'));
                            this.unapprovedParticipants = Object.assign(this.authService.uniqueObjData(this.unapprovedParticipants, 'id'));
                        }
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    availabilityCount(arrayOfObject) {
        const count: number = arrayOfObject.filter((obj: any) => obj.approved_status === 1).length;
        this.count = count;
        return count;
    }

    /**
     * Function  for Admin to approve the Course
     * @author  MangoIt Solutions
     * @param courseId
     */
    approvedCourses(courseId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, () => {
            this.authService.memberSendRequest('get', 'set-approve-course-status/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.ngOnInit();
                    }
                )
        }, () => {
        })
    }

    /**
    * Function  for Admin to approve Update the Course
    * @author  MangoIt Solutions
    * @param courseId
    */
    approvedUpdateCourses(courseId: number) {
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.approved_course, () => {
            this.authService.memberSendRequest('get', 'approve-updatedcourse/' + courseId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false) {
                            this.ngOnInit();
                            //this.getAllUserInfo();
                            this.getCourseDetails(courseId);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        } else {
                            this.notificationService.showError(this.language.courses.no_course_found, null);
                        }
                    }
                )
        }, () => {
        })
    }

    /**
    * Function  for Admin to Unapprove the Course
    * @author  MangoIt Solutions
    * @param courseId
    */
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
                    }
                )
        }, () => {
        })
    }

    updateCourse(id: number) {
        console.log(id);
        var redirectUrl: string = 'web/update-course/' + id;
        this.router.navigate([redirectUrl]);
    }

    /**
     * Function to delete a course
     * @author  MangoIt Solutions
     * @param   {courseId}
     * @return  Response Success or Error Message
     */
    deleteCourse(id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_course, () => {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('delete', 'deleteCourse/' + id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.responseMessage = respData['result']['message'];
                            this.notificationService.showSuccess(this.responseMessage, null);
                            setTimeout(() => {
                                // $('#responseMessage').delay(1000).fadeOut();
                                this.router.navigate(["/web/course"]);
                            }, 3000);

                        } else if (respData['code'] == 400) {
                            this.responseMessage = respData['message'];
                            this.notificationService.showError(this.responseMessage, null);
                        }
                    }
                )
        }, () => { }
        )
    }

    /**
    * Function to delete the Update course
    * @author  MangoIt Solutions
    * @param   {courseId}
    * @return  Response Success or Error Message
    */
    deleteUpdateCourse(id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_course, () => {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-reset-updatedCourses/' + id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.responseMessage = respData['result']['message'];
                            this.notificationService.showSuccess(this.responseMessage, null);
                            this.router.navigate(["/web/course-detail/" + id]);
                        } else if (respData['code'] == 400) {
                            this.responseMessage = respData['message'];
                            this.notificationService.showError(this.responseMessage, null);
                        }
                    }
                )
        }, () => { }, 'deleteUpdate'
        )
    }

    showToggle: boolean = false;
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
        this.router.navigate(['/web/course']);
    }

    /**
    * Function is used to set users participants
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {taskId}
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
                                if (value.user_id == this.courseDetails[0]?.courseTask?.['organizer_id']) {
                                    this.taskOrganizerDetails.push(value);
                                    org_id = 1;
                                } else {
                                    this.collaborators.push(value);
                                }
                            })
                            this.collaborators = Object.assign(this.authService.uniqueObjData(this.collaborators, 'user_id'));
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
        var subtaskStatus: number = 0;
        if (this.courseDetails[0]?.courseTask?.['id'] == taskId) {
            this.confirmDialogService.confirmThis(this.language.confirmation_message.complete_task, () => {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'approveTaskById/task/' + taskId, null).subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result'], null);
                            setTimeout(() => {
                                this.ngOnInit();

                            }, 3000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['result'], null);
                        }
                    }
                )
            }, () => {
                $('#styled-checkbox-' + taskId).prop('checked', false);
            })
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
        $("#profileSpinner").show();
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
    * Function is used to   document
    * @author  MangoIt Solutions
    * @param   {path}
    */
    download(path: any) {
        let data = {
            name: path
        }
        this.dowloading = true;
        var endPoint = 'download-course-document';
        if (data && data.name) {
            let filename = data.name.split('/').reverse()[0];
            this.authService.downloadDocument('post', endPoint, data).toPromise()
                .then((blob: any) => {
                    saveAs(blob, filename);
                    this.authService.setLoader(false);
                    this.dowloading = false;
                    setTimeout(() => {
                        this.authService.sendRequest('post', 'delete-course-document/uploads', data).subscribe((result: any) => {
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

}
