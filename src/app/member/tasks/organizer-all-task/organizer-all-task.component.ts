import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { TaskType } from 'src/app/models/task-type.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-organizer-all-task',
    templateUrl: './organizer-all-task.component.html',
    styleUrls: ['./organizer-all-task.component.css']
})

export class OrganizerAllTaskComponent implements OnInit {
    language: any;
    user_id: string;
    allTasks: TaskType[];
    toDoTask: TaskType[] = [];
    inProgress: TaskType[] = [];
    completed: TaskType[] = [];
    userDetails: any;
    task_id:number;
    count: number = 0;

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.user_id = localStorage.getItem('user-id');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if (sessionStorage.getItem('token')) {
            var endpoint
            if (this.userDetails.roles[0] == 'admin') {
                endpoint = 'getAllApprovedTasks'
            } else {
                endpoint = 'getAllApprovedTasks/user/' + this.user_id
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', endpoint, null)
                .subscribe(
                    (respData: any) => {
                        this.toDoTask = [];
                        this.inProgress = [];
                        this.completed = [];
                        if (respData['isError'] == false) {

                            if (respData['result']?.length > 0) {

                                respData?.['result']?.forEach((element) => {
                                    if (element && element?.['task_image'] && element?.['task_image'][0]?.['task_image']) {
                                        element['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.['task_image'][0]?.['task_image'].substring(20)))as string;
                                    }
                                    element.approvedCount = 0
                                    element.progressVal = 0
                                    if (element?.subtasks?.length > 0) {
                                        element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length;
                                        element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                                    }

                                    let cudate: Date = new Date();
                                    element.dayCount = element.dayCount = this.commonFunctionService.getDays(cudate, element.date);

                                    if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                                        element.remain = this.language.Survey.day_left;
                                    } else {
                                        element.remain = this.language.organizer_task.daysOverride;
                                    }

                                    if ((element.status == 0 || element.status == 2) && element.subtasks.every(obj => obj.status === 0)) {
                                        this.toDoTask.push(element);
                                        this.toDoTask;
                                    } else if (element.subtasks.some(obj => obj.status === 1 && element.status != 1)) {
                                        this.inProgress.push(element);
                                        this.inProgress;
                                    } else if (element.status == 1) {
                                        this.completed.push(element);
                                        this.completed;
                                    }
                                });
                            }
                        }

                        this.authService.setLoader(false);
                        this.allTasks = respData['result'];
                    }
                );
        }
    }
}
