import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthorizationAccess, CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {Subscription} from 'rxjs';
import {AuthService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';

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
        private authService: AuthService,
        public formBuilder: UntypedFormBuilder,
        private router: Router, private themes: ThemeService
    ) {
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
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (localStorage.getItem("trigger-doc") !== null) {
            setTimeout( () =>{
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
