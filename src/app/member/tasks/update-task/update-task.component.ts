import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { TaskType } from 'src/app/models/task-type.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-update-task',
    templateUrl: './update-task.component.html',
    styleUrls: ['./update-task.component.css'],
    providers: [DatePipe],
})

export class UpdateTaskComponent implements OnInit, OnDestroy {
    language: any;
    organizer_id: any;
    submitted: boolean = false;
    showSubtask: boolean = false;
    type_visibility: number;
    showUsers: boolean = false;
    taskid: number;
    thumb: string;
    teamId: number;
    group_dropdown: CommunityGroup[];
    receiveData: UserDetails;
    userDetails: LoginDetails;
    taskDetails: TaskType;
    setTheme: ThemeType;
    collaboratorList: UntypedFormArray;
    subtaskList: UntypedFormArray;
    updateTaskForm: UntypedFormGroup;
    groupDropdownSettings: IDropdownSettings;
    typeDropdownSettings: IDropdownSettings;
    participantDropdownSettings: IDropdownSettings;
    subTaskUserDropdownSettings: IDropdownSettings;
    subTaskGroupUserDropdownSettings: IDropdownSettings;
    groups: { id: number; name: string }[] = [];
    type_dropdown: { id: number; name: string }[] = [];
    subTaskSelectedUser: { id: number; user_name: string }[] = [];
    user_dropdown: { id: number; user_email: string; user_name: string }[] = [];
    setTaskUsers: { id: string; user_email: string; user_name: string }[] = [];
    types: { id: number; name: string }[] = [];
    participantSelectedItem: number[] = [];
    participantSelectedToShow: any[] = [];
    alluserInformation: any[] = [];
    file: File;
    fileToReturn: File;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    private activatedSub: Subscription;
    dateError: boolean = false;
    indax: number;
    groupParticipants: any[] = [];
    subTaskVisibility: number;
    user_id: string;
    author_id: number = 0;
    showSubtasks: boolean = true;
    isImage: boolean = false;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        fonts: [
            { class: 'gellix', name: 'Gellix' },
        ],
        toolbarHiddenButtons: [
            [
                'link',
                'unlink',
                'subscript',
                'superscript',
                'insertUnorderedList',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode',
                'insertImage',
                'insertVideo',
                'italic',
                'fontSize',
                'undo',
                'redo',
                'underline',
                'strikeThrough',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
                'heading',
                'textColor',
                'backgroundColor',
                'customClasses',
                'insertOrderedList',
                'fontName'
            ]
        ],
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p',
    };
    imgHeight: any;
    imgWidth: any;
    taskImage: any;

    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
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
        $('#subtask').hide();
        $('#showSubtask').hide();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        this.user_id = this.userDetails.userId;
        this.getUserAndGroup();
        let self = this;
        this.route.params.subscribe((params) => {
            this.taskid = params['taskId'];
        });

        this.type_dropdown = [
            { id: 0, name: this.language.create_task.individual },
            { id: 1, name: this.language.create_task.group },
        ];
        this.typeDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };

        this.subTaskUserDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'user_name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
        };

        this.subTaskGroupUserDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'user_name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
        };

        this.participantDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'user_name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
        };

        this.groupDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };

        this.updateTaskForm = this.formBuilder.group({
            file: ["null"],
            title: ['', Validators.required],
            description: ['', Validators.required],
            organizer_id: [localStorage.getItem('user-id')],
            status: ['1'],
            groups: [''],
            group_id: [''],
            date: ['', Validators.required],
            type_dropdown: ['', Validators.required],
            user_participant: [''],
            collaborators: this.formBuilder.array([]),
            subtasks: this.formBuilder.array([]),
            team_id: this.teamId
        });
        this.collaboratorList = this.updateTaskForm.get('collaborators') as UntypedFormArray;
        this.subtaskList = this.updateTaskForm.get('subtasks') as UntypedFormArray;
    }

    get subtasks() {
        return this.updateTaskForm.get('subtasks') as UntypedFormArray;
    }

    /**
    * Function is used to create Subtask form
    * @author  MangoIt Solutions
    */
    createSubtask() {
        return this.formBuilder.group({
            id: ['', Validators.compose([Validators.required])],
            title: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            assigned_to: ['', Validators.compose([Validators.required])],
            status: ['0'],
            date: ['', Validators.compose([Validators.required])],
        });
    }

    /**
    * Function is used to add Subtask
    * @author  MangoIt Solutions
    */
    addSubtask() {
        $('#showSubtask').show();
        if (this.subtaskList?.value?.length > 0) {
            if (this.subtaskList?.controls?.length > 0) {
                this.subtaskList.controls.forEach(element => {
                    if (element.status == 'VALID') {
                        this.showSubtasks = true;
                    } else {
                        this.showSubtasks = false;
                    }
                });
            }
        }
        if (this.showSubtasks == true) {
            this.subtaskList.push(this.createSubtask());
        }
    }

    /**
    * Function is used to remove Subtask
    * @author  MangoIt Solutions
    */
    removeSubtask(index: number) {
        this.subtaskList.removeAt(index);
    }

    /**
    * Function is used to get Subtasks FormGroup
    * @author  MangoIt Solutions
    */
    getSubtasksFormGroup(index: number): UntypedFormGroup {
        const formGroup: UntypedFormGroup = this.subtaskList.controls[index] as UntypedFormGroup;
        return formGroup;
    }

    /**
    * Function is used to select sub task users
    * @author  MangoIt Solutions
    */
    onSubTaskUserSelect(item: { id: number; user_name: string }[], i: number) {
        this.subTaskSelectedUser.push(item['id']);
    }

    /**
    * Function is used to de select sub task users
    * @author  MangoIt Solutions
    */
    onSubTaskUserDeSelect(item: { id: number; user_name: string }[]) {
        if (this.subTaskSelectedUser && this.subTaskSelectedUser.length > 0) {
            this.subTaskSelectedUser.forEach((value, index) => {
                if (value == item['id']) {
                    this.subTaskSelectedUser.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function is used to get collaboratorList
    * @author  MangoIt Solutions
    */
    get collaboratorFormGroup() {
        return this.updateTaskForm.get('collaborators') as UntypedFormArray;
    }

    /**
    * Function is used to create collaborator
    * @author  MangoIt Solutions
    */
    createCollaborator(id: any): UntypedFormGroup {
        return this.formBuilder.group({
            user_id: [id, Validators.compose([Validators.required])],
            approved_status: [1, Validators.compose([Validators.required])],
        });
    }

    /**
    * Function is used to add collaborator
    * @author  MangoIt Solutions
    */
    addCollaborator(id: number) {
        this.collaboratorList.push(this.createCollaborator(id));
    }

    /**
    * Function is used to remove collaborator
    * @author  MangoIt Solutions
    */
    removeCollaborator(index: number) {
        this.collaboratorList.removeAt(index);
    }

    /**
    * Function to add selected users from the dropdown
    * @author  MangoIt Solutions
    * @param   {Id,Name}
    * @return  {Array Of Object} all  approved Group Users list
    */
    onUserSelect(item: { id: number; user_name: string }) {
        this.showUsers = true;
        this.participantSelectedToShow.push(item);
        this.participantSelectedItem.push(item.id);
        this.addCollaborator(item.id);
    }

    /**
 * Function to remove selected users from the dropdown
 * @author  MangoIt Solutions
 * @param   {Id,Name}
 * @return  {Array Of Object} all  approved Group Users list
 */
    onUserDeSelect(item: { id: number; user_name: string }) {
        if (this.updateTaskForm.get('collaborators').value.length > 0) {
            this.updateTaskForm.get('collaborators').value.forEach((value, index) => {
                if (value.user_id == item.id) {
                    this.removeCollaborator(index);
                }
            });
        }
        if (this.participantSelectedToShow && this.participantSelectedToShow.length > 0) {
            this.participantSelectedToShow.forEach((value, index) => {
                if (value.id == item.id) {
                    this.participantSelectedToShow.splice(index, 1);
                }
            });
        }
        if (this.participantSelectedItem && this.participantSelectedItem.length > 0) {
            this.participantSelectedItem.forEach((value, index) => {
                if (value == item.id) {
                    this.participantSelectedItem.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function to get all the Groups and club users
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the Groups
    */
    getUserAndGroup() {
        let self = this;
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService
                .memberSendRequest('get', 'teamGroupsAndUsers/' + this.teamId, null)
                .subscribe((respData: any) => {
                    if (respData['isError'] == false) {
                        if (respData && respData?.result?.groups?.length > 0) {
                            this.group_dropdown = respData.result.groups;
                        }
                        if (respData && respData?.result?.users?.length > 0) {
                            this.receiveData = respData.result.users;
                            for (const key in respData.result.users) {
                                if (Object.prototype.hasOwnProperty.call(respData.result.users, key)) {
                                    var element: any = respData.result.users[key];
                                    this.alluserInformation[element.keycloak_id] = { member_id: element.member_id };
                                    if ((element.role != 'guest')) {
                                        this.user_dropdown.push({
                                            id: element.id, user_email: element.email, user_name: element.firstname + ' ' + element.lastname,
                                        });
                                    }
                                }
                            }
                            this.user_dropdown = Object.assign(this.authService.uniqueObjData(this.user_dropdown, 'id'));
                        }
                        self.setUsers(this.taskid);
                        setTimeout(function () {
                            self.setTask(self.taskid);
                        }, 2000);
                    }
                });
        }
    }

    /**
    * Function is used to set users participants
    * @author  MangoIt Solutions (R)
    * @param   {taskId}
    * @return  {Array Of Object} users all detail
    */
    setUsers(taskid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskid, null).subscribe((respData: any) => {
                for (const key in respData) {
                    if (Object.prototype.hasOwnProperty.call(respData, key)) {
                        var element: any = respData[key];
                        if (element.user.length && element.user_id != this.organizer_id) {
                            this.setTaskUsers.push({
                                id: element.user_id, user_email: element.user[0].email, user_name: element.user[0].firstname + ' ' + element.user[0].lastname,
                            });
                            this.participantSelectedToShow.push({
                                id: element.user_id, user_name: element.user[0].firstname + ' ' + element.user[0].lastname, key_cloak: element.user[0].keycloak_id
                            });
                            this.addCollaborator(element.user_id);
                            this.showUsers = true;
                        }
                    }
                }
                if (this.participantSelectedToShow?.length > 0) {
                    Object(this.participantSelectedToShow).forEach((val, key) => {
                        if (this.alluserInformation && this.alluserInformation[val.key_cloak] && this.alluserInformation[val.key_cloak]['member_id'] != null) {
                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.key_cloak].member_id, null)
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
                    });
                }
                this.setTaskUsers = Object.assign(this.authService.uniqueObjData(this.setTaskUsers, 'id'));
                this.participantSelectedToShow = Object.assign(this.authService.uniqueObjData(this.participantSelectedToShow, 'id'));
            });
        }
    }

    /**
    * Function is used to set the task detail on the form input field
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {CourseId}
    * @return  {Array Of Object} users all detail
    */
    setTask(taskid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'get-task-by-id/' + taskid, null)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.taskDetails = respData['result'][0];
                        if (this.taskDetails) {
                            var task_date: string[];
                            if (this.taskDetails?.['task_image'][0]?.['task_image']) {
                                this.taskImage = this.taskDetails?.['task_image'][0]?.['task_image'];
                                this.taskDetails['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.taskDetails['task_image'][0]?.['task_image'].substring(20))) as string;
                            }
                            if (this.taskDetails.date) {
                                task_date = this.taskDetails.date.split('T');
                            }
                            if (this.taskDetails.group_id == null || this.taskDetails.group_id == 0) {
                                this.type_visibility = 0;
                                this.types = [{ id: 0, name: this.language.create_task.individual },];
                                this.subTaskVisibility = 0;
                                this.updateTaskForm.controls['groups'].setValue('');
                            } else {
                                let self = this;
                                this.type_visibility = 1;
                                this.types = [{ id: 1, name: this.language.create_task.group }];
                                this.subTaskVisibility = 1;
                                if (self.group_dropdown && self.group_dropdown.length > 0) {
                                    self.group_dropdown.forEach((value, index) => {
                                        if (value.id == this.taskDetails.group_id) {
                                            this.groups = [{ id: value.id, name: value.name }];
                                        }
                                    });
                                    this.groupParticipants = [];
                                    this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + this.groups[0].id, null).subscribe(
                                        (respData: any) => {
                                            if (respData?.length > 0) {
                                                if (respData[0]?.participants?.length > 0) {
                                                    respData[0].participants.forEach((value, index) => {
                                                        if (value?.groupusers?.length > 0) {
                                                            value.groupusers.forEach((elem) => {
                                                                this.groupParticipants.push({
                                                                    id: elem.id,
                                                                    user_email: elem.email,
                                                                    user_name: elem.firstname + ' ' + elem.lastname,
                                                                });
                                                            })
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                }
                            }
                            this.updateTaskForm.controls['title'].setValue(this.taskDetails.title);
                            this.updateTaskForm.controls['description'].setValue(this.taskDetails.description);
                            this.updateTaskForm.controls['organizer_id'].setValue(this.taskDetails.organizer_id);
                            this.updateTaskForm.controls['status'].setValue(this.taskDetails.status);
                            this.updateTaskForm.controls['date'].setValue(task_date[0]);
                            this.updateTaskForm.controls['type_dropdown'].setValue(this.types);
                            this.updateTaskForm.controls['user_participant'].setValue(this.setTaskUsers);
                            this.updateTaskForm.controls['groups'].setValue(this.groups);
                            this.updateTaskForm.controls['file'].setValue(this.taskImage);

                            if (this.taskDetails?.subtasks?.length > 0) {
                                this.taskDetails.subtasks.forEach((value, index) => {
                                    
                                    let subtask_user: { id: number; user_email: string; user_name: string; }[] = [];
                                    this.addSubtask();
                                    if (this.user_dropdown && this.user_dropdown.length > 0) {
                                        this.user_dropdown.forEach(function (val, key) {
                                            if (JSON.parse(value.assigned_to).length > 0) {
                                                JSON.parse(value.assigned_to).forEach(element => {
                                                    if (val.id == element.user_id) {
                                                        subtask_user.push({ id: val.id, user_email: val.user_email, user_name: val.user_name, });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    let subtask_date: string[];
                                    if (value.date) {
                                        subtask_date = value.date.split('T');
                                    }
                                    
                                    let createSubtask: UntypedFormGroup = (this.updateTaskForm.controls['subtasks'] as UntypedFormArray).at(index) as UntypedFormGroup;
                                    createSubtask?.get('id')?.patchValue(value.id);
                                    createSubtask?.get('title')?.patchValue(value.title);
                                    createSubtask?.get('description')?.patchValue(value.description);
                                    createSubtask?.get('date')?.patchValue(subtask_date[0]);
                                    createSubtask?.get('assigned_to')?.patchValue(subtask_user);
                                });

                            }
                        }
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }

    /**
    * Function is used to update task form
    * @author  MangoIt Solutions
    */
    onUpdateTask() {
        this.submitted = true;

        if (sessionStorage.getItem('token')) {
            if (this.updateTaskForm.get('subtasks').value.length) {
                var subtaskDetails = this.updateTaskForm.get('subtasks').value;
                if (subtaskDetails && subtaskDetails.length > 0) {
                    subtaskDetails.forEach((value, index) => {
                        var assigned: any = [];
                        if (value.assigned_to && value.assigned_to.length) {
                            value.assigned_to.forEach((elem: any) => {
                                assigned.push({ user_id: elem.id, approved_status: 1 });
                            });
                            subtaskDetails[index].assigned_to = [];
                            subtaskDetails[index].assigned_to = assigned;
                        }
                    });
                }
                this.updateTaskForm.controls['subtasks'].setValue(subtaskDetails);
            }

            for (const key in this.updateTaskForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.updateTaskForm.value, key)) {
                    const element: any = this.updateTaskForm.value[key];
                    if ((element == '' || (element && element.length == 0)) && key != 'subtasks') {
                        this.updateTaskForm.value[key] = null;
                    }
                }
            }
            if (this.updateTaskForm.valid && this.dateError == false) {
                if (this.updateTaskForm.get('groups').value.length) {
                    var groupId: number = this.updateTaskForm.get('groups').value[0].id;
                    this.updateTaskForm.get('group_id').setValue(groupId);
                    (<UntypedFormArray>this.updateTaskForm.get('collaborators')).clear();
                    this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + groupId, null)
                        .subscribe((respData: any) => {
                            if (respData && respData[0].participants && respData[0].participants.length > 0) {
                                respData[0].participants.forEach((value, index) => {
                                    this.addCollaborator(value.user_id);
                                    if (value.user_id == this.taskDetails.organizer_id) {
                                        this.author_id = 1;
                                    }
                                });
                            }
                            if (this.author_id == 0) {
                                this.addCollaborator(this.taskDetails.organizer_id);
                            }
                            this.updateTask();
                        });
                } else {
                    this.updateTaskForm.get('group_id').setValue(0);
                    if (this.updateTaskForm.get('collaborators')) {
                        this.updateTaskForm.get('collaborators').value.forEach(element => {
                            if (element.user_id == this.taskDetails.organizer_id) {
                                this.author_id = 1;
                            }
                        });
                    }
                    if (this.author_id == 0) {
                        this.addCollaborator(this.taskDetails.organizer_id);
                    }
                    this.updateTask();
                }
            }
        }
    }

    /**
    * Function is used to update and send task value in database
    * @author  MangoIt Solutions
    */
    updateTask() {
        this.updateTaskForm.removeControl('type_dropdown');
        this.updateTaskForm.removeControl('user_participant');
        this.updateTaskForm.removeControl('groups');
        var formData: FormData = new FormData();
        for (const key in this.updateTaskForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.updateTaskForm.value, key)) {
                const element: any = this.updateTaskForm.value[key];
                if (key == 'collaborators') {
                    var uniqueUsers = this.authService.uniqueData(element);
                    formData.append('collaborators', JSON.stringify(uniqueUsers));
                }
                if (key == 'date') {
                    formData.append('date', element);
                }
                if (key == 'description') {
                    formData.append('description', element);
                }
                if (key == 'group_id') {
                    formData.append('group_id', element);
                }
                if (key == 'organizer_id') {
                    formData.append('organizer_id', element);
                }
                if (key == 'status') {
                    formData.append('status', element);
                }
                if (key == 'subtasks') {
                    formData.append('subtasks', JSON.stringify(element));
                }
                if (key == 'file') {
                    if (this.fileToReturn) {
                        formData.append("file", this.fileToReturn);
                    } else {
                        this.updateTaskForm.controls['file'].setValue(this.taskImage);
                        formData.append("file", this.updateTaskForm.get('file').value);
                    }
                }
                if (key == 'title') {
                    formData.append('title', element);
                }
                else {
                    if ((key != 'collaborators') && (key != 'date') && (key != 'description') && (key != 'group_id')
                        && (key != 'organizer_id') && (key != 'status') && (key != 'subtasks') && (key != 'title') && (key != 'file'))
                        formData.append(key, element);
                }
            }
        }
        this.authService.setLoader(true);
        this.authService.memberSendRequest('put', 'updateTask/' + this.taskid, formData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.notificationService.showSuccess(respData['result']['message'], null);
                    setTimeout(() => {
                        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
                            //mobile
                            var redirectUrl: string = 'morganizer-task-detail/' + this.taskid;
                        } else {
                            //desktop
                            var redirectUrl: string = 'task-detail/' + this.taskid;
                        }

                        this.router.navigate([redirectUrl]);
                    }, 2000);
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            });
    }

    /**
    * Function to select task type from the dropdown
    * @author  MangoIt Solutions
    * @param   {typeId, type Name}
    * @return  {Array Of Object}
    */
    onTypeSelect(item: { id: number; name: string }) {
        this.type_visibility = item.id;
        this.subTaskVisibility = item.id;
        this.showUsers = false;
        this.participantSelectedToShow = [];
        (<UntypedFormArray>this.updateTaskForm.get('collaborators')).clear();
        this.updateTaskForm.controls['user_participant'].setValue([]);
        this.updateTaskForm.controls['group_id'].setValue([]);
        this.updateTaskForm.controls['groups'].setValue([]);
        this.updateTaskForm.controls['subtasks'].reset();
        this.updateTaskForm.value['subtasks'].forEach(() => {
            this.subtaskList.removeAt(0);
        });
        $('#showSubtask').hide();

        if (this.type_visibility == 1) {
            this.updateTaskForm.get('groups').setValidators(Validators.required);
            this.updateTaskForm.get('groups').updateValueAndValidity();
            this.updateTaskForm.get('user_participant').clearValidators();
            this.updateTaskForm.get('user_participant').updateValueAndValidity();
        } else {
            this.updateTaskForm.get('user_participant').setValidators(Validators.required);
            this.updateTaskForm.get('user_participant').updateValueAndValidity();
            this.updateTaskForm.get('groups').clearValidators();
            this.updateTaskForm.get('groups').updateValueAndValidity();
        }
    }

    /**
    * Function to remove task type from the dropdown
    * @author  MangoIt Solutions
    * @param   {typeId, type Name}
    * @return  {}
    */
    onTypeDeSelect(item: { id: number; name: string }) {
        this.type_visibility = null;
        this.showUsers = false;
        this.participantSelectedToShow = [];
        (<UntypedFormArray>this.updateTaskForm.get('collaborators')).clear();
        this.updateTaskForm.controls['user_participant'].setValue([]);
        this.updateTaskForm.controls['group_id'].setValue([]);
        this.updateTaskForm.controls['groups'].setValue([]);
        this.updateTaskForm.controls['subtasks'].reset();
        this.updateTaskForm.value['subtasks'].forEach(() => {
            this.subtaskList.removeAt(0);
        });
        $('#showSubtask').hide();
    }

    /**
    * Function to get all approved Group Users list
    * @author  MangoIt Solutions
    * @param   {Id,Name}
    * @return  {Array Of Object} all  approved Group Users list
    */
    onGroupSelect(item: { id: number; name: string }) {
        (<UntypedFormArray>this.updateTaskForm.get('collaborators')).clear();
        this.updateTaskForm.controls['user_participant'].setValue([]);
        this.groupParticipants = [];
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + item.id, null).subscribe(
            (respData: any) => {
                if (respData && respData[0].participants && respData[0].participants.length > 0) {
                    respData[0].participants.forEach((value, index) => {
                        if (value.approved_status == 1) {
                            value.groupusers.forEach((elem) => {
                                this.groupParticipants.push({
                                    id: elem.id,
                                    user_email: elem.email,
                                    user_name: elem.firstname + ' ' + elem.lastname + ' (' + elem.email + ' )',
                                });
                            })
                        }
                    });
                }
            });
    }

    /**
    * Function for remove the selected group from the dropdown
    * @author  MangoIt Solutions
    * @param   {groupId, Group Name}
    * @return  {}
    */
    onGroupDeSelect(item: { id: number; name: string }) {
        (<UntypedFormArray>this.updateTaskForm.get('collaborators')).clear();
        this.updateTaskForm.controls['user_participant'].setValue([]);
        this.updateTaskForm.controls['group_id'].setValue([]);
        this.updateTaskForm.controls['groups'].setValue([]);
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Function to check date
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {boolean} true;
     */
    checkDate(item: any) {
        this.indax = item;
        if (this.updateTaskForm && this.updateTaskForm.value['subtasks'] && this.updateTaskForm.value['subtasks'].length > 0) {
            this.updateTaskForm.value['subtasks'].forEach((element, key) => {
                if ((element.date > this.updateTaskForm.value['date'])) {
                    this.dateError = true;
                    return this.indax;
                } else {
                    this.dateError = false;
                }
            })
        }
    }

    /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    uploadFile(event: Event) {
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

    fileChangeEvent(event: Event): void {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        this.imageChangedEvent = event;
        this.file = (event.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                this.imgWidth = img.width;
                this.imgHeight = img.height;
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(this.file);
    }

    /**
   * Function is used to cropped and compress the uploaded image
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {object} file object
   */
    imageCropped(event: ImageCroppedEvent) {
        let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage, -1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.updateTaskForm.patchValue({ file: this.fileToReturn });
                    this.updateTaskForm.get('file').updateValueAndValidity();
                    $('.preview_txt').show(this.fileToReturn.name);
                    $('.preview_txt').text(this.fileToReturn.name);
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

    onCancel() {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
