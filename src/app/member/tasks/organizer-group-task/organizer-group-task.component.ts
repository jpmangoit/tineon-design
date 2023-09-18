import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { TaskType } from 'src/app/models/task-type.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-organizer-group-task',
    templateUrl: './organizer-group-task.component.html',
    styleUrls: ['./organizer-group-task.component.css']
})
export class OrganizerGroupTaskComponent implements OnInit {
    @Input() organizerTask: any;
    language: any;
    user_id: string;
    personalTasks: TaskType[];
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
                    if (element.group_id > 0) {
                        element.approvedCount = 0;
                        element.progressVal = 0;
                        if (element.subtasks && element.subtasks.length > 0) {
                            element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length
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
                            if ((element.group_id > 0) && ((element.status == 0 || element.status == 2) && element.subtasks.every(obj => obj.status === 0))) {
                                this.toDoTask.push(element);
                                this.toDoTask;
                            } else if ((element.group_id > 0) && (element.subtasks.some(obj => obj.status === 1) && element.status != 1)) {
                                this.inProgress.push(element);
                                this.inProgress;
                            } else if ((element.group_id > 0) && (element.status == 1)) {
                                this.completed.push(element);
                                this.completed;
                            }
                        }
                    }
                });
            }
            this.authService.setLoader(false);
            this.personalTasks = this.organizerTask;
        }
    }
}
