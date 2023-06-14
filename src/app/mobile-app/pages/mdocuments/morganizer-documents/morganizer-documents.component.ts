import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { appSetting } from 'src/app/app-settings';
import { UploadDocVisibility } from 'src/app/models/documents-type.model';
import { Extentions } from 'src/app/models/extentions.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess } from 'src/app/models/user-access.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
declare var $: any;
@Component({
    selector: 'app-morganizer-documents',
    templateUrl: './morganizer-documents.component.html',
    styleUrls: ['./morganizer-documents.component.css']
})

export class MorganizerDocumentsComponent implements OnInit {
    activeClass: string = 'myDocActive';
    displayMydocument: boolean = true;
    displayClubdocument: boolean = false;
    displayCurrentstatus: boolean = false;
    displayArchivedocument: boolean = false;
    documentForm: UntypedFormGroup;
    userDetails: any;
    language: any;
    extensions: Extentions;
    responseMessage: string = '';
    doc_type: string;
    userAccess: {
        admin: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        member: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        guest: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        secretary: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        functionary: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        editor: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
        user: { create: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; contact_admin: string; email: string; theme: string; import_calendar: string; course: string; instructor: string; room: string; }; participate: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; personal_message: string; club_message: string; group_message: string; organizer_myDocument: string; organizer_clubDocument: string; organizer_currentStatus: string; organizer_archivedDocument: string; course: string; instructor: string; room: string; }; authorization: { event: string; message: string; appointments: string; group: string; news: string; task: string; subtask: string; document: string; chat: string; course: string; instructor: string; room: string; }; };
    };
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    setTheme: ThemeType;
    uploadDocVisibility: UploadDocVisibility;
    guestRole: string;
    myDocExtArr: string[] = [];
    myDocExt: string[] = [];
    myDocFileNameArr: string[] = [];
    clubDocExtArr: string[] = [];
    clubDocExt: string[] = [];
    clubDocFileNameArr: string[] = [];
    archivedDocExtArr: string[] = [];
    archivedDocExt: string[] = [];
    archivedDocFileNameArr: string[] = [];
    private activatedSub: Subscription;
    headline_word_option: number = 0

    myDocument() {
        this.displayMydocument = true;
        this.displayClubdocument = false;
        this.displayCurrentstatus = false;
        this.displayArchivedocument = false;
        $('.doc_upload_btn').show();
    }

    clubDocument() {
        this.displayMydocument = false;
        this.displayClubdocument = true;
        this.displayCurrentstatus = false;
        this.displayArchivedocument = false;
        this.checkUpload();
    }

    currentDocument() {
        this.displayMydocument = false;
        this.displayClubdocument = false;
        this.displayCurrentstatus = true;
        this.displayArchivedocument = false;
        this.checkUpload();
    }

    archiveDocument() {
        this.displayMydocument = false;
        this.displayClubdocument = false;
        this.displayCurrentstatus = false;
        this.displayArchivedocument = true;
        this.checkUpload();
    }

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router, private themes: ThemeService, private notificationService: NotificationService
    ) {
    }

    ngOnInit(): void {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
        this.language = this.lang.getLanguaageFile();
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.extensions = appSetting.extensions;
        this.uploadDocVisibility = appSetting.uploadDocument;
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.guestRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (this.guestRole == 'guest') {
            this.displayMydocument = true;
            this.displayClubdocument = false;
            this.displayCurrentstatus = false;
            this.displayArchivedocument = false;
        }
        this.authService.setLoader(false);
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "myDocActive" : check == 2 ? "clubDocActive" : check == 3 ? "currentDocActive" : check == 4 ? "archiveDocActive" : "myDocActive";
    }

    uploadFile(event: Event) {
        this.documentForm = new UntypedFormGroup({
            'add_image': new UntypedFormControl('', Validators.required),
            'category': new UntypedFormControl('', Validators.required),
            'club_id': new UntypedFormControl(this.userDetails.team_id)
        });
        const file: File = (event.target as HTMLInputElement).files[0];
        var category: string;
        if (this.displayMydocument) {
            category = 'personal';
        } else if (this.displayClubdocument) {
            category = 'club';
        } else if (this.displayArchivedocument) {
            category = 'archive';
        } else if (this.displayCurrentstatus) {
            category = 'current-statuses';
        }
        this.documentForm.patchValue({
            add_image: file,
            category: category
        });
        this.documentForm.get('category').updateValueAndValidity();
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        var url: any;
        reader.onload = (_event) => {
            url = reader.result;
        }
        var ext: string[] = file.name.split(".");
        let fileError: number = 0;
        for (const key in this.extensions) {
            if (Object.prototype.hasOwnProperty.call(this.extensions, key)) {
                const element: any = this.extensions[key];
                if (key == ext[(ext.length) - 1]) {
                    fileError++;
                }
            }
        }
        if (fileError != 0) {
            if (this.userDetails.isAdmin || this.userDetails.isFunctionary || this.userDetails.isSecretary) {
                this.insertDoc();
                this.authService.setLoader(true);
                this.authService.setLoader(false);
            } else if ((this.userDetails.guestUser || this.userDetails.isMember || this.userDetails.isEditor) && (category == 'personal')) {
                this.insertDoc();
            } else {
                this.notificationService.showError(this.language.error_message.permission_error, null);
            }
        }
        else {
            this.notificationService.showError(this.language.error_message.common_valid, null);
        }
    }

    insertDoc() {
        var formData: FormData = new FormData();
        this.authService.setLoader(true);
        for (const key in this.documentForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.documentForm.value, key)) {
                const element: any = this.documentForm.value[key];
                if (key == 'add_image') {
                    formData.append('file', element);
                }
                else {
                    if (key != 'add_image') {
                        formData.append(key, element);
                    }
                }
            }
        }
        this.authService.setLoader(true);
        this.authService.memberSendRequest('post', 'documents/insert', formData)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData.isError == false) {
                        this.notificationService.showSuccess(respData.result.message, null);
                        console.log(this.displayMydocument);
                        console.log(this.displayClubdocument);
                        console.log(this.displayCurrentstatus);
                        console.log(this.displayArchivedocument);
                        if (this.displayMydocument) {
                            this.myDocument();
                            $('#1').trigger('click');
                        } else if (this.displayClubdocument) {
                            this.clubDocument();
                            $('#2').trigger('click');
                        } else if (this.displayArchivedocument) {
                            $('#4').trigger('click');
                            this.archiveDocument();
                        } else if (this.displayCurrentstatus) {
                            $('#3').trigger('click');
                            this.currentDocument();
                        }
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            );
    }

    checkUpload() {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if (this.userDetails.isAdmin || this.userDetails.isFunctionary || this.userDetails.isSecretary) {
            $('.doc_upload_btn').show();
        } else {
            $('.doc_upload_btn').hide();
        }
    }

}
