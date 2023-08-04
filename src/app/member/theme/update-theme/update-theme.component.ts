import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ThemeData, ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-theme',
    templateUrl: './update-theme.component.html',
    styleUrls: ['./update-theme.component.css'],
})
export class UpdateThemeComponent implements OnInit, OnDestroy {
    language: any;
    submitted: boolean = false;
    showParticipants: boolean = false;
    updateThemeForm: UntypedFormGroup;
    userDetails: LoginDetails;
    participantDropdownSettings: IDropdownSettings;
    responseMessage: string = null;
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
    selected_create_btnEvent: string;
    selected_create_btnText: string;
    selected_create_btnIcon: string;
    selected_cancel_btnEvent: string;
    selected_cancel_btnText: string;
    selected_cancel_btnIcon: string;
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
    show_logo_text_color: string;
    private activatedSub: Subscription;
    thumbnail: string = null;
    teamId: number;
    club_theme_id: string;
    getThemelength: number;
    getThemeData: ThemeData;
    localTheme: ThemeData;
    public disabled: boolean = false;
    public color: ThemePalette = 'primary';
    public touchUi: boolean = false;
    public options: { value: boolean, label: string }[] = [
        { value: true, label: 'True' },
        { value: false, label: 'False' }
    ];
    public listColors: string[] = ['primary', 'accent', 'warn'];
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    originalImg: string;


    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
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
        ]
    };

    ngOnInit(): void {
        this.authService.setLoader(true);
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.club_theme_id = this.route.snapshot.paramMap.get('clubThemeId');
        this.getTheme(this.club_theme_id);
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));

        this.updateThemeForm = this.formBuilder.group({
            add_image: ['', Validators.required],
            logo_text: ['', Validators.maxLength(55)],
            logo_text_color: ['',],
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
        this.authService.setLoader(false);
    }

    getTheme(club_theme_id: string) {
        let self = this;
        this.authService.sendRequest('get', 'club-theme-bythemeid/' + club_theme_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false && Object.keys(respData.result).length > 0) {
                        this.getThemelength = respData['result']['clubTheme'];
                        this.getThemeData = respData['result']['clubTheme'][0];
                        if (respData['result']['clubTheme'] && respData['result']['clubTheme'].length > 0) {
                            this.show_sidebarr_color = '#' + this.getThemeData.sidebar_color;
                            this.show_navigation_color = '#' + this.getThemeData.navigation_color;
                            this.show_icon_color = '#' + this.getThemeData.icon_color;
                            this.show_button_bgcolor = '#' + this.getThemeData.button_bgcolor;
                            this.show_button_text = '#' + this.getThemeData.button_text;
                            this.show_button_ic_color = '#' + this.getThemeData.button_ic_color;

                            this.show_create_button_bgcolor = '#' + this.getThemeData.create_button_bgcolor;
                            this.show_create_button_text = '#' + this.getThemeData.create_button_text;
                            this.show_create_button_ic_color = '#' + this.getThemeData.create_button_ic_color;
                            this.show_cancel_button_bgcolor = '#' + this.getThemeData.cancel_button_bgcolor;
                            this.show_cancel_button_text = '#' + this.getThemeData.cancel_button_text;
                            this.show_cancel_button_ic_color = '#' + this.getThemeData.cancel_button_ic_color;

                            if (this.getThemeData.logo_text_color) {
                                this.show_logo_text_color = '#' + this.getThemeData.logo_text_color;
                            }
                            this.setThemes();
                        } else {
                            this.setDefaultTheme()
                        }
                    } else {
                        this.notificationService.showError(this.language.theme.no_theme, null);
                    }
                }
            );
    }

    setThemes() {
        if (this.getThemeData?.club_image[0]?.theme_url) {
            ;
            this.originalImg = this.getThemeData?.club_image[0]?.theme_url
            this.getThemeData.club_image[0].theme_url = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.getThemeData?.club_image[0]?.theme_url.substring(20))) as string;
        }
        this.thumbnail = this.getThemeData?.club_image[0]?.theme_url;
        this.updateThemeForm.controls["add_image"].setValue(this.getThemeData?.club_image[0]?.theme_url);
        this.updateThemeForm.controls["sidebar_color"].setValue('#' + this.getThemeData.sidebar_color);
        this.updateThemeForm.controls["navigation_color"].setValue('#' + this.getThemeData.navigation_color);
        this.updateThemeForm.controls["icon_color"].setValue('#' + this.getThemeData.icon_color);
        this.updateThemeForm.controls["team_id"].setValue('#' + this.getThemeData.team_id);
        this.updateThemeForm.controls["button_bgcolor"].setValue('#' + this.getThemeData.button_bgcolor);
        this.updateThemeForm.controls["button_text"].setValue('#' + this.getThemeData.button_text);
        this.updateThemeForm.controls["button_ic_color"].setValue('#' + this.getThemeData.button_ic_color);
        this.updateThemeForm.controls["create_button_bgcolor"].setValue('#' + this.getThemeData.create_button_bgcolor);
        this.updateThemeForm.controls["create_button_text"].setValue('#' + this.getThemeData.create_button_text);
        this.updateThemeForm.controls["create_button_ic_color"].setValue('#' + this.getThemeData.create_button_ic_color);
        this.updateThemeForm.controls["cancel_button_bgcolor"].setValue('#' + this.getThemeData.cancel_button_bgcolor);
        this.updateThemeForm.controls["cancel_button_text"].setValue('#' + this.getThemeData.cancel_button_text);
        this.updateThemeForm.controls["cancel_button_ic_color"].setValue('#' + this.getThemeData.cancel_button_ic_color);

        if (this.getThemeData.logo_text) {
            this.updateThemeForm.controls["logo_text"].setValue(this.getThemeData.logo_text);
        }
        if (this.getThemeData.logo_text_color) {
            this.updateThemeForm.controls["logo_text_color"].setValue('#' + this.getThemeData.logo_text_color);
        }
    }

    setDefaultTheme() {
        this.thumbnail = this.localTheme.logo_url;
        this.updateThemeForm.controls["add_image"].setValue(this.localTheme.logo_url);
        this.updateThemeForm.controls["sidebar_color"].setValue(this.localTheme.sidebar_color.split("#")[1]);
        this.updateThemeForm.controls["navigation_color"].setValue(this.localTheme.navigation_color.split("#")[1]);
        this.updateThemeForm.controls["icon_color"].setValue(this.localTheme.icon_color.split("#")[1]);
        this.updateThemeForm.controls["team_id"].setValue(this.localTheme.team_id);
        this.updateThemeForm.controls["button_bgcolor"].setValue(this.localTheme.button_bgcolor.split("#")[1]);
        this.updateThemeForm.controls["button_text"].setValue(this.localTheme.button_text.split("#")[1]);
        this.updateThemeForm.controls["button_ic_color"].setValue(this.localTheme.button_ic_color.split("#")[1]);
        this.updateThemeForm.controls["create_button_bgcolor"].setValue('#' + this.localTheme.create_button_bgcolor.split("#")[1]);
        this.updateThemeForm.controls["create_button_text"].setValue('#' + this.localTheme.create_button_text.split("#")[1]);
        this.updateThemeForm.controls["create_button_ic_color"].setValue('#' + this.localTheme.create_button_ic_color.split("#")[1]);
        this.updateThemeForm.controls["cancel_button_bgcolor"].setValue('#' + this.localTheme.cancel_button_bgcolor.split("#")[1]);
        this.updateThemeForm.controls["cancel_button_text"].setValue('#' + this.localTheme.cancel_button_text.split("#")[1]);
        this.updateThemeForm.controls["cancel_button_ic_color"].setValue('#' + this.localTheme.cancel_button_ic_color.split("#")[1]);

        if (this.localTheme.logo_text) {
            this.updateThemeForm.controls["logo_text"].setValue(this.localTheme.button_ic_color.split("#")[1]);
        }
        if (this.localTheme.logo_text_color) {
            this.updateThemeForm.controls["logo_text_color"].setValue(this.localTheme.button_ic_color.split("#")[1]);
        }
    }

    onsideBarLogoTextEventLog(event: string) {
        if (event) {
            this.selected_sideBarLogoTextColor = event;
        }
    }

    onsideBarEventLog(event: string) {
        this.selected_Sidebar = event;
    }

    onsideBarNaviEventLog(event: string) {
        this.selected_sideBarNavi = event;
    }

    onsideBarIconEventLog(event: string) {
        this.selected_sideBarIcon = event;
    }

    onbtnEventLog(event: string) {
        this.selected_btnEvent = event;
    }

    onbtnTextEventLog(event: string) {
        this.selected_btnText = event;
    }

    onbtnIconEventLog(event: string) {
        this.selected_btnIcon = event;
    }

    onCreateBtnEventLog(event: string) {
        this.selected_create_btnEvent = event;
    }

    onCreateBtnTextEventLog(event: string) {
        this.selected_create_btnText = event;
    }

    onCreateBtnIconEventLog(event: string) {
        this.selected_create_btnIcon = event;
    }

    onCancelBtnEventLog(event: string) {
        this.selected_cancel_btnEvent = event;
    }

    onCancelBtnTextEventLog(event: string) {
        this.selected_cancel_btnText = event;
    }

    onCancelBtnIconEventLog(event: string) {
        this.selected_cancel_btnIcon = event;
    }

    updateTheme() {
        this.submitted = true;
        if (this.updateThemeForm.valid) {
            if (this.selected_Sidebar) {
                this.updateThemeForm.value["sidebar_color"] = this.selected_Sidebar.split("#")[1];
            } else {
                this.updateThemeForm.value["sidebar_color"] = this.getThemeData.sidebar_color;
            }

            if (this.selected_sideBarNavi) {
                this.updateThemeForm.value["navigation_color"] = this.selected_sideBarNavi.split("#")[1];
            } else {
                this.updateThemeForm.value["navigation_color"] = this.getThemeData.navigation_color;
            }

            if (this.selected_sideBarIcon) {
                this.updateThemeForm.value["icon_color"] = this.selected_sideBarIcon.split("#")[1];
            } else {
                this.updateThemeForm.value["icon_color"] = this.getThemeData.icon_color;
            }

            if (this.selected_btnEvent) {
                this.updateThemeForm.value["button_bgcolor"] = this.selected_btnEvent.split("#")[1];
            } else {
                this.updateThemeForm.value["button_bgcolor"] = this.getThemeData.button_bgcolor;
            }

            if (this.selected_btnText) {
                this.updateThemeForm.value["button_text"] = this.selected_btnText.split("#")[1];
            } else {
                this.updateThemeForm.value["button_text"] = this.getThemeData.button_text;
            }

            if (this.selected_btnIcon) {
                this.updateThemeForm.value["button_ic_color"] = this.selected_btnIcon.split("#")[1];
            } else {
                this.updateThemeForm.value["button_ic_color"] = this.getThemeData.button_ic_color;
            }

            if (this.selected_create_btnEvent) {
                this.updateThemeForm.value["create_button_bgcolor"] = this.selected_create_btnEvent.split("#")[1];
            } else {
                this.updateThemeForm.value["create_button_bgcolor"] = this.getThemeData.create_button_bgcolor;
            }

            if (this.selected_create_btnText) {
                this.updateThemeForm.value["create_button_text"] = this.selected_create_btnText.split("#")[1];
            } else {
                this.updateThemeForm.value["create_button_text"] = this.getThemeData.create_button_text;
            }

            if (this.selected_create_btnIcon) {
                this.updateThemeForm.value["create_button_ic_color"] = this.selected_create_btnIcon.split("#")[1];
            } else {
                this.updateThemeForm.value["create_button_ic_color"] = this.getThemeData.create_button_ic_color;
            }

            if (this.selected_cancel_btnEvent) {
                this.updateThemeForm.value["cancel_button_bgcolor"] = this.selected_cancel_btnEvent.split("#")[1];
            } else {
                this.updateThemeForm.value["cancel_button_bgcolor"] = this.getThemeData.cancel_button_bgcolor;
            }

            if (this.selected_cancel_btnText) {
                this.updateThemeForm.value["cancel_button_text"] = this.selected_cancel_btnText.split("#")[1];
            } else {
                this.updateThemeForm.value["cancel_button_text"] = this.getThemeData.cancel_button_text;
            }

            if (this.selected_cancel_btnIcon) {
                this.updateThemeForm.value["cancel_button_ic_color"] = this.selected_cancel_btnIcon.split("#")[1];
            } else {
                this.updateThemeForm.value["cancel_button_ic_color"] = this.getThemeData.cancel_button_ic_color;
            }

            if (this.selected_sideBarLogoTextColor) {
                this.updateThemeForm.value["logo_text_color"] = this.selected_sideBarLogoTextColor.split("#")[1];
            } else if (this.getThemeData.logo_text_color) {
                this.updateThemeForm.value["logo_text_color"] = this.getThemeData.logo_text_color;
            } else {
                this.updateThemeForm.value["logo_text_color"] = '';
            }

            var formData: any = new FormData();
            let self = this;
            for (const key in this.updateThemeForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.updateThemeForm.value, key)) {
                    const element = this.updateThemeForm.value[key];
                    if (key == 'add_image') {
                        if (this.fileToReturn) {
                            formData.append('file', this.fileToReturn);

                        } else {
                            formData.append('file', this.originalImg);
                        }
                    }
                    if (key == 'sidebar_color') {
                        formData.append('sidebar_color', element);
                    }
                    if (key == 'button_bgcolor') {
                        formData.append('button_bgcolor', element);
                    }
                    if (key == 'navigation_color') {
                        formData.append('navigation_color', element);
                    }
                    if (key == 'icon_color') {
                        formData.append('icon_color', element);
                    }
                    if (key == 'team_id') {
                        formData.append('team_id', this.userDetails.team_id);
                    }
                    if (key == 'button_text') {
                        formData.append('button_text', element);
                    }
                    if (key == 'button_ic_color') {
                        formData.append('button_ic_color', element);
                    }
                    if (key == 'logo_text_color') {
                        formData.append('logo_text_color', element);
                    }
                    if (key == 'create_button_bgcolor') {
                        formData.append('create_button_bgcolor', element);
                    }
                    if (key == 'create_button_text') {
                        formData.append('create_button_text', element);
                    }
                    if (key == 'create_button_ic_color') {
                        formData.append('create_button_ic_color', element);
                    }
                    if (key == 'cancel_button_bgcolor') {
                        formData.append('cancel_button_bgcolor', element);
                    }
                    if (key == 'cancel_button_text') {
                        formData.append('cancel_button_text', element);
                    }
                    if (key == 'cancel_button_ic_color') {
                        formData.append('cancel_button_ic_color', element);
                    }
                    if (key == 'logo_text') {
                        if (element) {
                            formData.append('logo_text', element);
                        } else {
                            formData.append('logo_text', '');
                        }
                    } else {
                        if ((key != 'add_image') && (key != 'sidebar_color') && (key != 'button_bgcolor') && (key != 'navigation_color') && (key != 'icon_color') &&
                            (key != 'team_id') && (key != 'button_text') && (key != 'button_ic_color') && (key != 'logo_text_color') && (key != 'logo_text')
                            && (key != 'create_button_bgcolor') && (key != 'create_button_text') && (key != 'create_button_ic_color')
                            && (key != 'cancel_button_bgcolor') && (key != 'cancel_button_text') && (key != 'cancel_button_ic_color')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'update-club-theme/' + this.club_theme_id, formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            let changeTheme: ThemeType = respData['result']['clubTheme'];
                            console.log(changeTheme);

                            // if (changeTheme?.['theme_url']){
                            //     changeTheme['theme_url'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(changeTheme?.['theme_url'].substring(20)));
                            // }
                            if (this.getThemeData.status == 1) {
                                this.themes.getClubTheme(changeTheme)
                            }
                            setTimeout(() => {
                                this.router.navigate(["/themes"]);
                            }, 3000);
                        } else if (respData['code'] == 400) {
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
                    this.updateThemeForm.patchValue({ add_image: this.fileToReturn });
                    this.updateThemeForm.get('add_image').updateValueAndValidity();
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
