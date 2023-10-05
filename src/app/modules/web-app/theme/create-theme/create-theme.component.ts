import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { LanguageService } from '../../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ThemeData, ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
import {NgxImageCompressService} from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;
@Component({
	selector: 'app-create-theme',
	templateUrl: './create-theme.component.html',
	styleUrls: ['./create-theme.component.css']
})
export class CreateThemeComponent implements OnInit, OnDestroy {

    language:any;
	submitted:boolean = false;
	showParticipants:boolean = false;
	updateThemeForm: UntypedFormGroup;
	userDetails:LoginDetails;
	participantDropdownSettings:IDropdownSettings;
    responseMessage:string = null;
	imageChangedEvent: Event = null;
	croppedImage: string = '';
	file: File;
    fileToReturn: File;
    setTheme: ThemeType;
	selected_Sidebar: string;
	selected_sideBarNavi: string;
	selected_btnEvent: string;
	selected_btnText: string;
	selected_btnIcon: string;
	selected_sideBarIcon: string;
    selected_sideBarLogoTextColor: string;
	show_sidebarr_color: string;
	show_navigation_color: string;
	show_icon_color: string;
	show_button_bgcolor: string;
	show_button_text: string;
	show_button_ic_color: string;
    show_create_button_bgcolor: string;
	show_create_button_text: string;
	show_create_button_ic_color: string;
    show_cancel_button_bgcolor: string;
	show_cancel_button_text: string;
	show_cancel_button_ic_color: string;
    show_logo_text_color:string;
	thumbnail: string = null;
	teamId:number;
	club_theme_id:string;
	getThemelength: number;
	getThemeData:  ThemeData;
	localTheme:  ThemeData;
	createThemeForm: UntypedFormGroup;
    private activatedSub: Subscription;
	public disabled:boolean = false;
	public color: ThemePalette = 'primary';
	public touchUi:boolean = false;
	public options:{ value: boolean, label: string }[] = [
		{ value: true, label: 'True' },
		{ value: false, label: 'False' }
	];
	public listColors:string[] = ['primary', 'accent', 'warn'];
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;

	constructor(
		private authService: AuthServiceService,
		public formBuilder: UntypedFormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private lang: LanguageService,
		private themes: ThemeService,
        private notificationService: NotificationService,
		private imageCompress: NgxImageCompressService,
		private commonFunctionService: CommonFunctionService
	) { }

	editorConfig: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		minHeight: '5rem',
		maxHeight: '15rem',
		translate: 'no',
		sanitize: true,
		toolbarPosition: 'top',
		defaultFontName: 'Arial',
		defaultFontSize: '2',
		defaultParagraphSeparator: 'p',
		fonts: [
            {class: 'gellix', name: 'Gellix'},
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
        ]
	};

	ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            this.localTheme = JSON.parse(localStorage.getItem('club_theme'));
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
            this.teamId = theme.team_id;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));

        this.createThemeForm = this.formBuilder.group({
            add_image: ['', Validators.required],
            logo_text: ['', Validators.maxLength(55)],
            logo_text_color: ['',],
            // sidebar_color: ['', [Validators.required, Validators.pattern("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")]],
            sidebar_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            navigation_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            icon_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            button_bgcolor: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            button_text: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            button_ic_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            team_id: [''],
            create_button_bgcolor: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            create_button_text: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            create_button_ic_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            cancel_button_bgcolor: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            cancel_button_text: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
            cancel_button_ic_color: ['', [Validators.required, Validators.pattern("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")]],
        });
	}

    onsideBarLogoTextEventLog(event:string){
        if(event){
			this.selected_sideBarLogoTextColor = event;
			this.createThemeForm.controls['logo_text_color'].setValue(this.selected_sideBarLogoTextColor);
        }
    }

	onsideBarEventLog(event:string){
		this.selected_Sidebar = event;
		this.createThemeForm.controls['sidebar_color'].setValue(this.selected_Sidebar);
	}

	onsideBarNaviEventLog(event:string){
		this.selected_sideBarNavi = event;
		this.createThemeForm.controls['navigation_color'].setValue(this.selected_sideBarNavi);
	}

	onsideBarIconEventLog(event:string){
		this.selected_sideBarIcon = event;
		this.createThemeForm.controls['icon_color'].setValue(this.selected_sideBarIcon);
	}

	onbtnEventLog(event:string){
		this.selected_btnEvent = event;
		this.createThemeForm.controls['button_bgcolor'].setValue(this.selected_btnEvent);
	}

	onbtnTextEventLog(event:string){
		this.selected_btnText = event;
		this.createThemeForm.controls['button_text'].setValue(this.selected_btnText);
	}

	onbtnIconEventLog(event:string){
		this.selected_btnIcon = event;
		this.createThemeForm.controls['button_ic_color'].setValue(this.selected_btnIcon);
	}

    onCreateBtnEventLog(event:string){
		this.selected_btnEvent = event;
		this.createThemeForm.controls['create_button_bgcolor'].setValue(this.selected_btnEvent);
	}

	onCreateBtnTextEventLog(event:string){
		this.selected_btnText = event;
		this.createThemeForm.controls['create_button_text'].setValue(this.selected_btnText);
	}

	onCreateBtnIconEventLog(event:string){
		this.selected_btnIcon = event;
		this.createThemeForm.controls['create_button_ic_color'].setValue(this.selected_btnIcon);
	}

    onCancelBtnEventLog(event:string){
		this.selected_btnEvent = event;
		this.createThemeForm.controls['cancel_button_bgcolor'].setValue(this.selected_btnEvent);
	}

	onCancelBtnTextEventLog(event:string){
		this.selected_btnText = event;
		this.createThemeForm.controls['cancel_button_text'].setValue(this.selected_btnText);
	}

	onCancelBtnIconEventLog(event:string){
		this.selected_btnIcon = event;
		this.createThemeForm.controls['cancel_button_ic_color'].setValue(this.selected_btnIcon);
	}

	createTheme() {
		this.submitted = true;
		if (this.createThemeForm.valid) {
			var formData: any = new FormData();
			let self = this;
			for (const key in this.createThemeForm.value) {
				if (Object.prototype.hasOwnProperty.call(this.createThemeForm.value, key)) {
					const element = this.createThemeForm.value[key];

					if (key == 'add_image') {
						if (this.fileToReturn) {
							formData.append('file', this.fileToReturn);
						} else {
							formData.append('imageUrl', this.thumbnail);
						}
					}
					if (key == 'sidebar_color') {
						formData.append('sidebar_color', element.split("#")[1]);
					}
					if (key == 'button_bgcolor') {
						formData.append('button_bgcolor', element.split("#")[1]);
					}
					if (key == 'navigation_color') {
						formData.append('navigation_color', element.split("#")[1]);
					}
					if (key == 'icon_color') {
						formData.append('icon_color', element.split("#")[1]);
					}
                    if (key == 'button_text') {
                        formData.append('button_text', element.split("#")[1]);
                    }
                    if (key == 'button_ic_color') {
                        formData.append('button_ic_color', element.split("#")[1]);
                    }
                    if (key == 'logo_text_color') {
                        if(element){
                            formData.append('logo_text_color', element.split("#")[1]);
                        }else{
                            formData.append('logo_text_color', '');
                        }
                    }
                    if (key == 'logo_text') {
                        if(element){
                            formData.append('logo_text', element);
                        }else{
                            formData.append('logo_text', '');
                        }
                    }
                    if (key == 'team_id') {
                        formData.append('team_id', this.teamId);
                    }
                    if (key == 'create_button_bgcolor') {
						formData.append('create_button_bgcolor', element.split("#")[1]);
					}
                    if (key == 'create_button_text') {
                        formData.append('create_button_text', element.split("#")[1]);
                    }
                    if (key == 'create_button_ic_color') {
                        formData.append('create_button_ic_color', element.split("#")[1]);
                    }

                    if (key == 'cancel_button_bgcolor') {
						formData.append('cancel_button_bgcolor', element.split("#")[1]);
					}
                    if (key == 'cancel_button_text') {
                        formData.append('cancel_button_text', element.split("#")[1]);
                    }
                    if (key == 'cancel_button_ic_color') {
                        formData.append('cancel_button_ic_color', element.split("#")[1]);
                    }
                }
            }
			this.authService.setLoader(true);
			this.authService.memberSendRequest('post', 'create-club-theme', formData)
				.subscribe(
					(respData:any) => {
						this.authService.setLoader(false);
						if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'],null);
							setTimeout(() => {
								this.router.navigate(["/web/themes"]);
							}, 2000);
						}else if (respData['code'] == 400) {
							this.notificationService.showError(respData['message'], null);
						}
					}
				);
		}
	}

	 /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
	errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	uploadFile(event:Event) {
		var file: File = (event.target as HTMLInputElement).files[0];
		if (file) {
			const mimeType:string = file.type;
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
        reader.readAsDataURL(this.file)
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
        this.imageCompress.compressFile(this.croppedImage,-1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile( compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.createThemeForm.patchValue({ add_image: this.fileToReturn });
                    this.createThemeForm.get('add_image').updateValueAndValidity();
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

