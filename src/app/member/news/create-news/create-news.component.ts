import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { ThemeType } from 'src/app/models/theme-type.model'; 
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-create-news',
    templateUrl: './create-news.component.html',
    styleUrls: ['./create-news.component.css'],
    providers: [DatePipe]
})

export class CreateNewsComponent implements OnInit ,OnDestroy{
    language:any;
    submitted:boolean  = false;
    createNewsForm: UntypedFormGroup;
    visiblityDropdownSettings:IDropdownSettings;
    dropdownSettings:IDropdownSettings;
    groupDropdownSettings:IDropdownSettings;
    userDetails: LoginDetails;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    file: File;
    fileToReturn: File;
    responseMessage: string = null;
    visiblity: { id: number, name: string }[] = []; 
    groupSelectedItem: number[] = [];
    groupVisiblity: number;
    teamId: number;
    groups: CommunityGroup;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;

    constructor(
        private authService: AuthServiceService,
        private router: Router,
        public formBuilder: UntypedFormBuilder,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
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
        defaultFontName: 'Gellix',
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
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        
        this.teamId = this.userDetails.team_id;
        this.getGroup();

        if (localStorage.getItem('create-message'))
            localStorage.removeItem('create-message');

        this.visiblity = [
            { "id": 0, "name": this.language.create_news.title },
            { "id": 2, "name": this.language.create_news.group_news },
            { "id": 3, "name": this.language.create_news.chairman },
        ];

        if (this.userDetails.roles[0] == 'member_light_admin') {
            this.visiblity = [{ "id": 0, "name": this.language.create_news.visible_everyone }];
        }

        this.visiblityDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };

        this.groupDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search
        };

        this.createNewsForm = this.formBuilder.group({
            title: ['', [Validators.required, this.noWhitespace]],
            content: ['', Validators.required],
            add_image: ['', Validators.required],
            visible_dropdown: ['', Validators.required],
            group_dropdown: [''],
            show_guest: [''],
            isHighlighted: ['']
        });
    }

    noWhitespace(control: UntypedFormControl) {
        if (control.value.length != 0) {
            let isWhitespace: boolean = (control.value || '').trim().length === 0;
            let isValid: boolean = !isWhitespace;
            return isValid ? null : { 'whitespace': true }
        }
        else {
            let isValid: boolean = true;
            return isValid ? null : { 'whitespace': true }
        }
    }

    /**
    * Function is used to get groups list as per team id
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} groups object
    */
    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'teamgroups/' + this.teamId, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.groups = respData;
                }
            );
        }
    }

    /**
    * Function is used to add validation as per Visiblity
    * @author  MangoIt Solutions
    * @param   {}
    * @return {}
    */
    onVisiblitySelect(item: { id: number, name: string }) {
        this.groupVisiblity = item.id;
        if (this.groupVisiblity == 2) {
            this.createNewsForm.get('group_dropdown').setValidators(Validators.required);
            this.createNewsForm.get('group_dropdown').updateValueAndValidity();
        } else {
            this.createNewsForm.get('group_dropdown').clearValidators();
            this.createNewsForm.get('group_dropdown').updateValueAndValidity();
        }
    }

    /**
    * Function is used to select Group
    * @author  MangoIt Solutions
    * @param   {}
    * @return {}
    */
    onGroupItemSelect(item: { id: number, name: string }) {
        this.groupSelectedItem.push(item.id);
    }

    /**
    * Function is used to DeSelect Participant
    * @author  MangoIt Solutions
    * @param   {}
    * @return {}
    */
    onGroupItemDeSelect(item: { id: number, name: string }) {
        // this.groupSelectedItem.push(item.id);
        const index = this.groupSelectedItem.indexOf(item.id);
        if (index > -1) {
            this.groupSelectedItem.splice(index, 1);
        }
    }

    /**
    * Function is used to create news and send data in formData formate
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} return success message
    */
    createNews() {
        this.submitted = true;
        if ((sessionStorage.getItem('token')) && (this.createNewsForm.valid) && (!this.errorImage.isError)) {
            // this.authService.setLoader(true);
            var approved_statud: number = 0;
            var tags: any = null;
            var attachment: any = null;
            var show_guest: boolean = this.createNewsForm.get('show_guest').value;
            var isHighlighted: boolean = this.createNewsForm.get('isHighlighted').value;
            if (this.userDetails.roles[0] == 'admin') {
                approved_statud = 1;
            }
            var formData: any = new FormData();
            formData.append("file", this.createNewsForm.get('add_image').value);
            formData.append("team_id", this.userDetails.team_id);
            formData.append("title", this.createNewsForm.get('title').value);
            formData.append("headline", this.createNewsForm.get('content').value);
            formData.append("text", this.createNewsForm.get('content').value);
            formData.append("author", localStorage.getItem('user-id'));
            formData.append("priority", 1);
            if ((attachment == null) || (tags == null)) {
                formData.append("attachment", attachment);
                formData.append("tags", tags);
            }
            formData.append("audience", this.groupVisiblity);
            formData.append("approved_statud", approved_statud);
            if (this.groupSelectedItem?.length > 0) {
                var uniqueGroupItem = this.authService.uniqueData(this.groupSelectedItem);
                formData.append("groups", "[" + uniqueGroupItem + "]");
            }
            if (show_guest) {
                formData.append("show_guest_list", show_guest.toString());
            } else {
                formData.append("show_guest_list", false);
            } 

            if (isHighlighted) {
                formData.append("highlighted", isHighlighted.toString());
            } else {
                formData.append("highlighted", false);
            }

            formData.append("publication_date_to", new Date().toISOString());
            formData.append("publication_date_from", new Date().toISOString());
            
            
            this.authService.memberSendRequest('post', 'createNews', formData)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.submitted = false;
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(this.language.response_message.news_success, null);
                        var self = this;
                        setTimeout(function () {
                            self.router.navigate(['clubwall']);
                        }, 1500);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                },
            );
        }
    }

    onCancel() {
        window.history.back();
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
        this.errorImage = { isError: false, errorMessage: ''};
        let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage,-1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.createNewsForm.patchValue({ add_image: this.fileToReturn });
                    this.createNewsForm.get('add_image').updateValueAndValidity();
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

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
