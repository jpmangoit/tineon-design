import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {AuthorizationAccess, CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {AuthServiceService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


declare var $: any;

@Component({
	selector: 'app-organizer',
	templateUrl: './organizer.component.html',
	styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit,OnDestroy {
	language:any ;
	userDetails: LoginDetails;
	userAccess: UserAccess;
	createAccess: CreateAccess;
	participateAccess: ParticipateAccess;
	authorizationAccess: AuthorizationAccess;
	documentForm: UntypedFormGroup;
	displayEvents: boolean = false;
	displayTasks: boolean = false;
	displayDocs: boolean = false;
	setTheme:ThemeType;
	responseMessage:string = '';
	extensions: any;
	doc_type: string;
	private activatedSub: Subscription;
    uploadResp: any;

	constructor(
		private lang: LanguageService,
		private authService: AuthServiceService,
		public formBuilder: UntypedFormBuilder,
		private router: Router, private themes: ThemeService,private notificationService: NotificationService
	) {
		var url:string = this.router.url.split("/")['2'];
		if(url == 'organizer-task'){
			this.displayTasks = true;
		}else if( url == 'organizer-documents'){
			this.displayDocs = true;
		}else{
			this.displayEvents = true;
		}
	 }

	ngOnInit(): void {
		if(localStorage.getItem('club_theme') != null){
			let theme :ThemeType=  JSON.parse(localStorage.getItem('club_theme'));
      		this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp) => {
      		this.setTheme = resp;
		});
		this.language = this.lang.getLanguageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		let userRole:string = this.userDetails.roles[0];
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
		this.displayEvents = true;
		this.displayTasks = false;
		this.displayDocs = false;
	}

	onTasks() {
		this.displayTasks = true;
		this.displayEvents = false;
		this.displayDocs = false;
	}

	onDocuments() {
		this.displayTasks = false;
		this.displayEvents = false;
		this.displayDocs = true;
	}
	showMenu: boolean = false;
	onOpen() {
		let el:HTMLCollectionOf<Element> = document.getElementsByClassName("all_btn_group btn_collapse");
		if (!this.showMenu) {
			this.showMenu = true;
			el[0].className = "all_btn_group btn_collapse open";
		}
		else {
			this.showMenu = false;
			el[0].className = "all_btn_group btn_collapse";
		}
	}

	uploadFile(event:Event) {
		this.documentForm = new UntypedFormGroup({
			'add_image': new UntypedFormControl('', Validators.required),
			'category': new UntypedFormControl('', Validators.required),
			'club_id': new UntypedFormControl(this.userDetails.team_id)
		});
		const file :File= (event.target as HTMLInputElement).files[0];
		let category_text:string = '';
		for (let index = 0; index < $('.nav-tabs ').children().length; index++) {
			const element:any = $('.nav-tabs').children().children();
			if (element[index].classList.length > 2) {
				category_text = element[index].text;
			}
		}
		category_text = ( (category_text == '') ? document.querySelector('.nav-tabs .active').textContent : category_text);
		if (category_text != '') {
			var category:string;
			category_text =  category_text.trim();

			if (category_text == this.language.club_document.my_documents.trim()) {
				category = 'personal';
			} else if (category_text == this.language.club_document.club_documents.trim() || category_text == this.language.club_document.club_documents_untern.trim()) {
				category = 'club';
			} else if (category_text == this.language.club_document.archived_documents.trim() ) {
				category = 'archive';
			} else if (category_text == this.language.club_document.current_status.trim() || category_text == this.language.club_document.current_status_untern.trim()) {
				category = 'current-statuses';
			}

			this.documentForm.patchValue({
				add_image: file,
				category: category
			});
			this.documentForm.get('category').updateValueAndValidity();
			const reader: FileReader = new FileReader();
			reader.readAsDataURL(file);
			var url:any;
			reader.onload = (_event) => {
				url = reader.result;
			}
			var ext:string[] = file.name.split(".");
			let fileError:number = 0;
			for (const key in this.extensions) {
				if (Object.prototype.hasOwnProperty.call(this.extensions, key)) {
					const element:any = this.extensions[key];
					if (key == ext[(ext.length) - 1]) {
						fileError++;
					}
				}
			}
			if (fileError != 0) {
				if (this.userDetails.isAdmin || this.userDetails.isFunctionary || this.userDetails.isSecretary){
					this.insertDoc();
				}else if ( (this.userDetails.guestUser || this.userDetails.isMember || this.userDetails.isEditor) && (category == 'personal')){
					this.insertDoc();
                }else{
                    this.notificationService.showError(this.language.error_message.permission_error,null);
				}
			}else {
                this.notificationService.showError(this.language.error_message.common_valid,null);
			}
		}
	}

	insertDoc() {
		var formData: FormData = new FormData();
		this.authService.setLoader(true);
		for (const key in this.documentForm.value) {
			if (Object.prototype.hasOwnProperty.call(this.documentForm.value, key)) {
				const element:any = this.documentForm.value[key];
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
		this.authService.memberSendRequest('post', 'documents/insert', formData)
        .subscribe(
            (respData:any) => {
                if(respData.isError == false){
                    if (respData['result']['message'] == "uploaded") {
                        this.responseMessage = respData['result']['message'];
                        this.notificationService.showSuccess(this.responseMessage,null);
                        setTimeout(() => {
                            if(this.responseMessage == 'uploaded'){
                                for (let index = 0; index < $('.tab-content').children().length; index++) {
                                    const element:any = $('.tab-content').children();
                                    if (element[index].classList.length > 2) {
                                        this.doc_type = element[index].id;
                                    }
                                }
                                $('#organizer_task').trigger('click');
                                setTimeout(() => {
                                    localStorage.setItem("trigger-doc", "doc");
                                    $('#organizer_doc').trigger('click');
                                    $('#'+this.doc_type).trigger('click');
                                },20);
                                this.authService.setLoader(false);
                            }
                    },2000);
                    }
                }else  if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            }
        );
	}

	ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
