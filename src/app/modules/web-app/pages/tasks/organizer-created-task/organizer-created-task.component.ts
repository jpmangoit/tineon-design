import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AuthServiceService, CommonFunctionService, LanguageService} from '@core/services';
declare var $: any;

@Component({
    selector: 'app-organizer-created-task',
    templateUrl: './organizer-created-task.component.html',
    styleUrls: ['./organizer-created-task.component.css']
})

export class OrganizerCreatedTaskComponent implements OnInit {
    @Input() organizerTask: any;
    language: any;
    user_id: string;
    createdTasks: TaskType[];
    toDoTask: TaskType[] = [];
    inProgress: TaskType[] = [];
    completed: TaskType[] = [];

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.user_id = localStorage.getItem('user-id');
        if (sessionStorage.getItem('token')) {
            this.toDoTask = [];
            this.inProgress = [];
            this.completed = [];
            if (this.organizerTask?.length > 0) {
                this.organizerTask?.forEach((element) => {
                    if (element.organizer_id == this.user_id) {
                        element.approvedCount = 0;
                        element.progressVal = 0;
                        if (element.subtasks && element.subtasks.length > 0) {
                            element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length;
                            element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                        }
                        let cudate: Date = new Date();
                        element.dayCount = this.commonFunctionService.getDays(cudate, element.date);
                        if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                            element.remain = this.language.Survey.day_left;
                        } else {
                            element.remain = this.language.organizer_task.daysOverride;
                        }
                        if (element.team_id != null) {
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
                        }

                    }
                });
            }
            this.authService.setLoader(false);
            this.createdTasks = this.organizerTask;
        }
    }
}
