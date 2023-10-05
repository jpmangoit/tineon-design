import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '../../../../service/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { CreateAccess } from 'src/app/models/user-access.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Email } from 'src/app/models/email.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import {NgxImageCompressService} from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-email',
    templateUrl: './update-email.component.html',
    styleUrls: ['./update-email.component.css']
})

 export class UpdateEmailComponent implements OnInit,OnDestroy {
    language :any;
    createAccess:CreateAccess;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    file: File;
    fileToReturn: File;
    messageSubmitted:boolean = false;
    messageForm: UntypedFormGroup;
    responseMessage:string = null;
    visiblityDropdownSettings:IDropdownSettings;
    userDetails: LoginDetails;
    selectedVisiblity: any;
    setTheme: ThemeType;
    visiblity: {id:string, name: string}[] = [];
    updateEmailForm: UntypedFormGroup;
    emailSubmitted:boolean = false;
    emailId: number;
    imageUrl: string = null;
    emailType: string;
    emailDetails: Email;
    isImage: boolean = false;
    type: { id: string, name: string}[];
    private activatedSub: Subscription;
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
    imgHeight: any;
    imgWidth: any;

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme :ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.route.params.subscribe(params => {
            this.emailId = params['emailId'];
            this.getEmailById(this.emailId);
        })
        this.visiblity = [
            { id: 'course', name: this.language.header.course },
            { id: 'updatedcourse', name: this.language.courses.update_course },
            { id: 'instructor', name: this.language.room.instructor },
            { id: 'survey', name: this.language.Survey.survey },
        ];
        this.visiblityDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            closeDropDownOnSelection: true
        };

        this.updateEmailForm = new UntypedFormGroup({
            'template_type': new UntypedFormControl('', Validators.required),
            'file': new UntypedFormControl('', Validators.required),
            'subject': new UntypedFormControl('', Validators.required),
            'header_content': new UntypedFormControl('', Validators.required),
            'template_body': new UntypedFormControl('', Validators.required),
            'footer_content': new UntypedFormControl('', Validators.required),
            'email_url': new UntypedFormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
        });
    }

    getEmailById(emailId:number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getEmailTemplateById/' + emailId, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                this.emailDetails = respData['result'][0];
                this.setEmailData();
            }
        );
    }

    setEmailData() {
        if (this.emailDetails.template_type) {
            this.type = [];
            this.emailType = this.emailDetails.template_type;
            this.selectedVisiblity = this.emailType
            if (this.emailType == 'course') {
                this.type.push({ id: 'course', name: this.language.header.course });

            } else if (this.emailType == 'instructor') {
                this.type.push({ id: 'instructor', name: this.language.room.instructor });

            } else if (this.emailType == 'survey') {
                this.type.push({ id: 'survey', name: this.language.Survey.survey });

            } else if (this.emailType == 'updatedcourse') {
                this.type.push({ id: 'updatedcourse', name: this.language.courses.update_course });
            }
            this.updateEmailForm.controls["template_type"].setValue(this.type);
        }
        if(this.emailDetails.template_logo.length == 0){
            this.imageUrl = '../../../../assets/img/no_image.png';

        } else if(this.emailDetails.template_logo[0]?.template_image){
            this.updateEmailForm.controls["file"].setValue(this.emailDetails.template_logo[0]?.template_image);
            this.emailDetails.template_logo[0].template_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.emailDetails.template_logo[0]?.template_image.substring(20)));
            this.imageUrl = this.emailDetails.template_logo[0]?.template_image;

        }


        // if (this.emailDetails.logo) {
        //     this.imageUrl = this.emailDetails.logo;
        //     this.updateEmailForm.controls["file"].setValue(this.emailDetails.logo);
        // }
        this.updateEmailForm.controls["subject"].setValue(this.emailDetails.subject);
        this.updateEmailForm.controls["header_content"].setValue(this.emailDetails.header_content);
        this.updateEmailForm.controls["template_body"].setValue(this.emailDetails.template_body);
        this.updateEmailForm.controls["footer_content"].setValue(this.emailDetails.footer_content);
        this.updateEmailForm.controls["email_url"].setValue(this.emailDetails.url);
    }

    updateEmailProcess() {
        this.emailSubmitted = true;
        if (this.selectedVisiblity) {
            this.updateEmailForm.controls["template_type"].setValue(this.selectedVisiblity);
        }
        //  else {
        //     this.updateEmailForm.controls["template_type"].setValue(this.type[0].id);
        // }
        if (this.updateEmailForm.valid) {
            var formData: FormData = new FormData();
            for (const key in this.updateEmailForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.updateEmailForm.value, key)) {
                    const element = this.updateEmailForm.value[key];

                    if (key == 'template_type') {
                        formData.append('template_type', element);
                    }
                    if (key == 'file') {
                        formData.append('file', element);
                    }
                    if (key == 'subject') {
                        formData.append('subject', element);
                    }
                    if (key == 'header_content') {
                        formData.append('header_content', element);
                    }
                    if (key == 'template_body') {
                        formData.append('template_body', element);
                    }
                    if (key == 'footer_content') {
                        formData.append('footer_content', element);
                    }
                    if (key == 'email_url') {
                        formData.append('url', element);
                    }
                }
            };
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'updateEmailTemplate/' + this.emailId, formData)
            .subscribe(
                (respData:any) => {
                    this.emailSubmitted = false;
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'],null);
                        setTimeout(() => {
                            this.router.navigate(['/web/show-email']);
                        }, 2000);
                    }else  if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    onVisiblitySelect(item: {id:number, name: string}) {
        this.selectedVisiblity = item.id;
    }

    onVisiblityDeSelect(item: {id:number, name: string}) {
        this.selectedVisiblity = null;
    }

     /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage: { isError: boolean, errorMessage: string }  = { isError: false, errorMessage: '' };
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
                }, 2000);
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
        var mimeType:string = this.file.type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
        }
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
        this.imageCompress.compressFile(this.croppedImage,-1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile( compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.updateEmailForm.patchValue({ file: this.fileToReturn });
                    this.updateEmailForm.get('file').updateValueAndValidity();
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
