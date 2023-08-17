import { Component, OnDestroy, OnInit } from '@angular/core';
import { appSetting } from '../../../app-settings';
import { LanguageService } from '../../../service/language.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;
@Component({
	selector: 'app-contact-admin',
	templateUrl: './contact-admin.component.html',
	styleUrls: ['./contact-admin.component.css']
})

export class ContactAdminComponent implements OnInit,OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    responseMessage: string = null;
    responseMessage1: string = '';
    messageForm: UntypedFormGroup;
    messageSubmitted: boolean = false;
    setTheme: ThemeType;
    files: string[] = [];
	private activatedSub: Subscription;

	constructor(
		private lang: LanguageService,
		private authService: AuthServiceService,
		public formBuilder: UntypedFormBuilder,
		private router: Router, private themes: ThemeService,private notificationService: NotificationService
	) { }

	ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
		console.log(this.setTheme);
		
		this.language = this.lang.getLanguaageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		let userRole:string = this.userDetails.roles[0];
		this.userAccess = appSetting.role;
		this.createAccess = this.userAccess[userRole].create;
		this.participateAccess = this.userAccess[userRole].participate;
		this.authorizationAccess = this.userAccess[userRole].authorization;
		this.messageForm = new UntypedFormGroup({
			'subject': new UntypedFormControl('', Validators.required),
			'message': new UntypedFormControl('', Validators.required),
			'type': new UntypedFormControl('text'),
			'sender_id': new UntypedFormControl(this.userDetails.id),
			'file': new UntypedFormControl(''),
			'message_type': new UntypedFormControl('inbox'),
		});
		if (userRole != 'guest') {
			const url: string[] = ["/dashboard"];
			this.router.navigate(url);
		}
	}

	messageProcess() {
		this.messageSubmitted = true;
		if (this.messageForm.valid) {
			var formData: any = new FormData();
			for (const key in this.messageForm.value) {
				if (Object.prototype.hasOwnProperty.call(this.messageForm.value, key)) {
					const element:any = this.messageForm.value[key];
					formData.append(key, element);
				}
			};
			this.authService.setLoader(true);
			this.authService.memberSendRequest('post', 'contact-admin', formData)
            .subscribe(
                (respData:any) => {
                    this.authService.setLoader(false);
                    this.messageSubmitted = false;
                    if (respData['isError'] == false) {
                        const url: string[] = ["/community"];
                        this.router.navigate(url);
                    }else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
		}
	}

	uploadFile(event:Event) {
		const file:File = (event.target as HTMLInputElement).files[0];
		const mimeType:string = file.type;
		const mimeType1:number = file.size;
		if (mimeType1 > 20000000) {
            this.notificationService.showError(this.language.create_message.file_size,null);
		} else {
			// this.responseMessage1 = '';
			this.messageForm.patchValue({
				file: file
			});
			this.messageForm.get('file').updateValueAndValidity();
			const reader: FileReader = new FileReader();
			reader.readAsDataURL(file);
			var url:any;
			reader.onload = (_event) => {
				url = reader.result;

				if (mimeType.match(/image\/*/)) {
					$('.preview_img').attr('src', url);
				} else {
					$('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
				}
			}
			$('.message-upload-list').show();
			$('.preview_txt').show();
			$('.preview_txt').text(file.name);
		}
	}

	onFileChange(event:Event) {
		for (var i:number = 0; i < event.target['files'].length; i++) {
			this.files.push(event.target['files'][i]);
		}
	}

	ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
