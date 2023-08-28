import { Component, OnInit } from '@angular/core';
import { TaskType } from 'src/app/models/task-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { LanguageService } from 'src/app/service/language.service';
import { Extentions } from 'src/app/models/extentions.model';
import { CreateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-morganizer-task',
    templateUrl: './morganizer-task.component.html',
    styleUrls: ['./morganizer-task.component.css']
})

export class MorganizerTaskComponent implements OnInit {
    activeClass: string = 'all';
    displayAll: boolean = true;
    displayPersonal: boolean = false;
    displayGroup: boolean = false;
    displayCreated: boolean = false;
    language: any;
    responseMessage: string;
    user_id: string;
    allTasks: TaskType[];
    toDoTask: TaskType[] = [];
    inProgress: TaskType[] = [];
    completed: TaskType[] = [];
    userDetails: any;
    endpoints: string;
    task_id: number;
    count: number = 0;
    personalTasks: TaskType[];
    perToDoTask: TaskType[] = [];
    perInProgress: TaskType[] = [];
    perCompleted: TaskType[] = [];
    groupTasks: TaskType[];
    groupToDoTask: TaskType[] = [];
    groupInProgress: TaskType[] = [];
    groupCompleted: TaskType[] = [];
    createdTasks: TaskType[];
    createdToDoTask: TaskType[] = [];
    createdInProgress: TaskType[] = [];
    createdCompleted: TaskType[] = [];
    userAccess: UserAccess;
    extensions: any;
    createAccess: CreateAccess;
    setTheme: ThemeType
    private activatedSub: Subscription;
    selected = '1';
    selectedProgress = '5'
    alluserInformation: { member_id: number }[] = [];
    thumb: any;


    displayToDo: boolean = true;
    displayInProgress: boolean = false;
    displayCompleted: boolean = false


    All() {
        this.displayAll = true;
        this.displayPersonal = false;
        this.displayGroup = false;
        this.displayCreated = false;
    }

    personalTask() {
        this.displayAll = false;
        this.displayPersonal = true;
        this.displayGroup = false;
        this.displayCreated = false;
    }

    groupTask() {
        this.displayAll = false;
        this.displayPersonal = false;
        this.displayGroup = true;
        this.displayCreated = false;
    }

    createdTask() {
        this.displayAll = false;
        this.displayPersonal = false;
        this.displayGroup = false;
        this.displayCreated = true;
    }



    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "all" : check == 2 ? "personalActive" : check == 3 ? "groupActive" : check == 4 ? "createdActive" : "all";
    }

    constructor(
        private authService: AuthServiceService,
        private confirmDialogService: ConfirmDialogService, private themes: ThemeService,
        private lang: LanguageService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.user_id = localStorage.getItem('user-id');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        this.createAccess = this.userAccess[userRole].create;
        this.getAllUserInfo();
        // this.getAllTask();
        // this.getTask();
        this.taskFilter('1');
        this.taskProgressFilter('5');
    }

    taskFilter(id: any) {
        if (id == 1) {
            this.All()
        } else if (id == 2) {
            this.personalTask()
        } else if (id == 3) {
            this.groupTask()
        } else if (id == 4) {
            this.createdTask()
        }
    }

    taskProgressFilter(id: any) {
        console.log(id);
        if (id == 5) {
            this.displayToDo = true;
            this.displayInProgress = false;
            this.displayCompleted = false;

        } else if (id == 6) {
            this.displayToDo = false;
            this.displayInProgress = true;
            this.displayCompleted = false;

        } else {
            this.displayToDo = false;
            this.displayInProgress = false;
            this.displayCompleted = true;
        }
    }

    /**
      * Function is used to get all user list
      * @author  MangoIt Solutions
      * @param   {}
      * @return  {object} user object
      */
    getAllUserInfo() {
        let self = this;
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                    }
                    this.getAllTask();
                    this.getTask();
                }
            );
    }


    getAllTask() {
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
                        // console.log(respData);
                        this.toDoTask = [];
                        this.inProgress = [];
                        this.completed = [];
                        if (respData['isError'] == false) {
                            if (respData['result'] && respData['result'].length > 0) {
                                respData['result'].forEach((element) => {
                                    if (this.alluserInformation[element.userstask.id] != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.userstask.id].member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    element.userImage = this.thumb;
                                                },
                                                (error: any) => {
                                                    element.userstask.userImage = null;
                                                });
                                    } else {
                                        element.userstask.userImage = null;
                                    }
                                    // console.log(element);

                                    if (element && element?.['task_image'] && element?.['task_image'][0]?.['task_image']) {
                                        element['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['task_image'][0]?.['task_image'].substring(20))) as string;
                                    }
                                    element.approvedCount = 0
                                    element.progressVal = 0
                                    if (element.subtasks.length > 0) {
                                        element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length
                                        element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                                    }

                                    let cudate: Date = new Date();
                                    element.dayCount = element.dayCount = this.commonFunctionService.getDays(cudate, element.date);
                                    if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                                        element.remain = this.language.Survey.day_left;
                                    } else {
                                        element.remain = this.language.organizer_task.daysOverride;
                                    }

                                    if (element.status == 0 && element.subtasks.every(obj => obj.status === 0)) {
                                        this.toDoTask.push(element)
                                        this.toDoTask;

                                    } else if (element.subtasks.some(obj => obj.status === 1)) {
                                        this.inProgress.push(element)
                                        this.inProgress;
                                    } else if (element.status == 1) {
                                        this.completed.push(element)
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

    getTask() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'getAllApprovedTasks/user/' + this.user_id, null)
                .subscribe(
                    (respData: any) => {
                        this.perToDoTask = [];
                        this.perInProgress = [];
                        this.perCompleted = [];
                        this.groupToDoTask = [];
                        this.groupInProgress = [];
                        this.groupCompleted = [];
                        this.createdToDoTask = [];
                        this.createdInProgress = [];
                        this.createdCompleted = [];
                        if (respData['isError'] == false) {
                            if (respData['result'] && respData['result'].length > 0) {
                                respData['result'].forEach((element) => {

                                    if (this.alluserInformation[element.userstask.id] != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.userstask.id].member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    element.userImage = this.thumb;
                                                },
                                                (error: any) => {
                                                    element.userstask.userImage = null;
                                                });
                                    } else {
                                        element.userstask.userImage = null;
                                    }
                                    // console.log(element);

                                    if (element && element?.['task_image'] && element?.['task_image'][0]?.['task_image']) {
                                        element['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['task_image'][0]?.['task_image'].substring(20))) as string;
                                    }
                                    if (element.group_id == 0 || element.group_id == null || element.group_id == '') {
                                        element.approvedCount = 0;
                                        element.progressVal = 0;
                                        if (element.subtasks.length > 0) {
                                            element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length
                                            element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                                        }
                                        let cudate: Date = new Date();
                                        element.dayCount = element.dayCount = this.commonFunctionService.getDays(cudate, element.date);
                                        if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                                            element.remain = this.language.Survey.day_left;
                                        } else {
                                            element.remain = this.language.organizer_task.daysOverride;
                                        }

                                        if ((element.group_id == null || element.group_id == 0) && (element.status == 0 && element.subtasks.every(obj => obj.status === 0))) {
                                            this.perToDoTask.push(element)
                                            this.perToDoTask;
                                        } else if ((element.group_id == null || element.group_id == 0) && (element.subtasks.some(obj => obj.status === 1) && element.status != 1)) {
                                            this.perInProgress.push(element)
                                            this.perInProgress;
                                        } else if ((element.group_id == null || element.group_id == 0) && (element.status == 1)) {
                                            this.perCompleted.push(element)
                                            this.perCompleted;
                                        }
                                    }
                                    if (element.group_id > 0) {
                                        element.approvedCount = 0;
                                        element.progressVal = 0;
                                        if (element.subtasks.length > 0) {
                                            element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length
                                            element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                                        }
                                        let cudate: Date = new Date();
                                        element.dayCount = element.dayCount = this.commonFunctionService.getDays(cudate, element.date);
                                        if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                                            element.remain = this.language.Survey.day_left;
                                        } else {
                                            element.remain = this.language.organizer_task.daysOverride;
                                        }

                                        if ((element.group_id > 0) && (element.status == 0 && element.subtasks.every(obj => obj.status === 0))) {
                                            this.groupToDoTask.push(element)
                                            this.groupToDoTask;
                                        } else if ((element.group_id > 0) && (element.subtasks.some(obj => obj.status === 1) && element.status != 1)) {
                                            this.groupInProgress.push(element)
                                            this.groupInProgress;
                                        } else if ((element.group_id > 0) && (element.status == 1)) {
                                            this.groupCompleted.push(element)
                                            this.groupCompleted;
                                        }
                                    }
                                    if (element.organizer_id == this.user_id) {
                                        element.approvedCount = 0;
                                        element.progressVal = 0;
                                        if (element.subtasks.length > 0) {
                                            element.approvedCount = element.subtasks.filter((obj: any) => obj.status === 1).length
                                            element.progressVal = Math.round(100 * (element.approvedCount / (element.subtasks.length)));
                                        }
                                        let cudate: Date = new Date();
                                        element.dayCount = element.dayCount = this.commonFunctionService.getDays(cudate, element.date);
                                        if (element.date.split('T')[0] > cudate.toISOString().split('T')[0]) {
                                            element.remain = this.language.Survey.day_left;
                                        } else {
                                            element.remain = this.language.organizer_task.daysOverride;
                                        }
                                        if (element.status == 0 && element.subtasks.every(obj => obj.status === 0)) {
                                            this.createdToDoTask.push(element)
                                            this.createdToDoTask;
                                        } else if (element.subtasks.some(obj => obj.status === 1) && element.status != 1) {
                                            this.createdInProgress.push(element)
                                            this.createdInProgress;
                                        } else if (element.status == 1) {
                                            this.createdCompleted.push(element)
                                            this.createdCompleted;
                                        }
                                    }
                                });
                            }
                        }
                        this.authService.setLoader(false);
                        this.personalTasks = respData['result'];
                    }
                );
        }
    }

    calculateDiff(dateSent: Date) {
        let currentDate: Date = new Date();
        dateSent = new Date(dateSent);
        return -1 * (Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24)));
    }

    closeModal() {
        let self = this;
        $('#subtask').modal('hide')
        $('#styled-checkbox-' + this.task_id).prop('checked', false);
    }

    closeModals() {
        $('#subtask1').modal('hide');
        $('#styled-checkbox-' + this.task_id).prop('checked', false);
    }

}
