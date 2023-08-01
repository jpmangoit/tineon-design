import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Extentions } from 'src/app/models/extentions.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { appSetting } from 'src/app/app-settings';
import { LanguageService } from 'src/app/service/language.service';
declare var $: any;

@Component({
    selector: 'app-morganizer',
    templateUrl: './morganizer.component.html',
    styleUrls: ['./morganizer.component.css']
})

export class MorganizerComponent implements OnInit {
    displayEvent: boolean = false;
    displayTasks: boolean = false;
    displayDocuments: boolean = false;
    activeClass: string;
    // activeClass: string = 'eventsActive';
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    documentForm: UntypedFormGroup;
    // displayEvents: boolean = false;
    // displayDocs: boolean = false;
    setTheme: ThemeType;
    responseMessage: string = '';
    extensions: any;
    doc_type: string;
    private activatedSub: Subscription;

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router, private themes: ThemeService
    ) {
        // console.log(this.router.url);
        if(this.router.url == '/organizer'){
            this.displayEvent = true;
            this.onClick(1)
        }else{
            var url: string = this.router.url.split("/")['2'];
            if (url == 'organizer-task') {
                this.displayTasks = true;
                this.onClick(2)
            } else if (url == 'organizer-documents') {
                this.displayDocuments = true;
                this.onClick(3)
            } else {
                this.displayEvent = true;
                this.onClick(1)
            }
        }
    }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (localStorage.getItem("trigger-doc") !== null) {
            setTimeout(function () { 
                let triggered = localStorage.getItem("trigger-doc");
                $('#organizer_doc').trigger('click');
                localStorage.removeItem("trigger-doc");
            }, 3000);
        }
    }

    onEvents() {
        this.displayEvent = true;
        this.displayTasks = false;
        this.displayDocuments = false;
    }

    onTasks() {
        this.displayEvent = false;
        this.displayTasks = true;
        this.displayDocuments = false;
    }

    onDocuments() {
        this.displayEvent = false;
        this.displayTasks = false;
        this.displayDocuments = true;
    }
    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "eventsActive" : check == 2 ? "tasksActive" : check == 3 ? "documentsActive" : "eventsActive";
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
