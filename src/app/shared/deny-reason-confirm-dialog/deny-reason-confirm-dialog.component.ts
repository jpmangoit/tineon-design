import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../service/language.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DenyReasonConfirmDialogService } from './deny-reason-confirm-dialog.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-deny-reason-confirm-dialog',
    templateUrl: './deny-reason-confirm-dialog.component.html',
    styleUrls: ['./deny-reason-confirm-dialog.component.css']
})
export class DenyReasonConfirmDialogComponent implements OnInit {
    language: any;
    message: any;
    denyGroupForm: UntypedFormGroup;
    delete_id: any;
    approved_status: number;
    userDetails: any;
    endPoints: string;
    method: string;
    delete_endpoints: string;
    navigation_path: string;

    constructor(private lang: LanguageService, public formBuilder: UntypedFormBuilder, private authService: AuthServiceService, private _router: Router,
        private denyReasonService: DenyReasonConfirmDialogService) { }

    ngOnInit(): void {
        this.denyGroupForm = this.formBuilder.group({
            reason: ['']
        });
        this.language = this.lang.getLanguaageFile();
        this.denyReasonService.getMessage().subscribe(message => {
            this.message = message;
            this.userDetails = JSON.parse(localStorage.getItem('user-data'));
            console.log(this.message);

            if (this.message && this.message.section) {
                if (this.message.section == 'Group') {
                    this.endPoints = 'getAdminDenyGroups/'

                } else if (this.message.section == 'Task') {
                    this.endPoints = 'get-users-denytask/'

                } else if (this.message.section == 'Instructor') {
                    this.endPoints = 'get-users-denyinstructor/'

                } else if (this.message.section == 'Room') {
                    this.endPoints = 'get-users-denyroom/'

                } else if (this.message.section == 'Event') {
                    this.endPoints = 'get-users-denyevent/'

                } else if (this.message.section == 'Course') {
                    this.endPoints = 'get-admin-denyCourses/'

                } else if (this.message.section == 'Survey') {
                    this.endPoints = 'get-users-denysurvey/user_id/'

                } else if (this.message.section == 'News') {
                    this.endPoints = 'get-users-denynews/'

                } else if (this.message.section == 'FAQS') {
                    this.endPoints = 'get-users-denyfaq/'
                }
                this.authService.memberSendRequest('get', this.endPoints + this.userDetails.userId, null)
                    .subscribe(
                        (respData: any) => {
                            let self = this;
                            if (respData && respData.length > 0) {
                                respData.forEach(element => {
                                    if (element.id == this.message.id) {
                                        this.delete_id = this.message.id;
                                        if (this.message.section == 'Task') {
                                            this.approved_status = element.status;
                                        } else {
                                            this.approved_status = element.approved_status;
                                        }
                                        self.denyGroupForm.controls['reason'].setValue(element.deny_reason);
                                    }
                                });
                            }
                        }
                    );
            }
        });
    }

    deleteFunction() {
        if (this.message.section == 'News') {
            if (this.approved_status == 1) {
                let self = this;
                self.authService.memberSendRequest('get', 'get-reset-updatednews/' + this.delete_id, null)
                    .subscribe(
                        (respData: any) => {
                            self.authService.setLoader(false);
                            const url: string[] = ["/web/clubnews-detail/" + this.delete_id];
                            self._router.navigate(url);
                            this.ngOnInit();
                            setTimeout(() => {
                                this.message.yesFn();
                            }, 1000);
                        }
                    )
            } else if (this.approved_status == 0) {
                let self = this;
                let userId: string = localStorage.getItem('user-id');
                self.authService.memberSendRequest('delete', 'news/' + this.delete_id + '/user/' + userId, null)
                    .subscribe(
                        (respData: any) => {
                            self.authService.setLoader(false);
                            const url: string[] = ["/web/clubwall"];
                            self._router.navigate(url);
                            this.message.noFn();
                        }
                    )
            }
        }

        if (this.message.section != 'News') {
            if (this.message.section == 'Group') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedGroupDetails/group_id/'
                    this.navigation_path = 'group-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteGroup/'
                    this.navigation_path = 'community/groups';
                }

            } else if (this.message.section == 'Task') {
                if (this.approved_status == 0) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedtask/'
                    this.navigation_path = 'task-detail/' + this.delete_id;

                } else if (this.approved_status == 2) {
                    this.method = 'delete';
                    this.delete_endpoints = 'DeleteTask/'
                    this.navigation_path = 'organizer/organizer-task';
                }
            } else if (this.message.section == 'Instructor') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedinstructor/'
                    this.navigation_path = 'instructor-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteInstructor/'
                    this.navigation_path = '/instructor';
                }
            } else if (this.message.section == 'Room') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedroom/'
                    this.navigation_path = 'room-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteRooms/'
                    this.navigation_path = '/room';
                }
            } else if (this.message.section == 'Survey') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedsurvey/'
                    this.navigation_path = 'survey-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteSurvey/'
                    this.navigation_path = '/survey';
                }
            } else if (this.message.section == 'Event') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedevent/'
                    this.navigation_path = 'event-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'event/'
                    this.navigation_path = '/organizer';
                }
            } else if (this.message.section == 'Course') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedCourses/'
                    this.navigation_path = 'course-detail/' + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteCourse/'
                    this.navigation_path = '/course';
                }
            } else if (this.message.section == 'FAQS') {
                if (this.approved_status == 1) {
                    this.method = 'get';
                    this.delete_endpoints = 'get-reset-updatedfaq/'
                    this.navigation_path = "/vereins-faq-detail/" + this.delete_id;

                } else if (this.approved_status == 0) {
                    this.method = 'delete';
                    this.delete_endpoints = 'deleteFaq/'
                    this.navigation_path = '/vereins-faq';
                }
            }
            this.authService.memberSendRequest(this.method, this.delete_endpoints + this.delete_id, null)
                .subscribe(
                    (respData: any) => {
                        let self = this;
                        self.ngOnInit();
                        self._router.navigate([self.navigation_path]);
                        setTimeout(() => {
                            self.message.yesFn();
                        }, 1000);
                    }
                )
        }
    }
}

