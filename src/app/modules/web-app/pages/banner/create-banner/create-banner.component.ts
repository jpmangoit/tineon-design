import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import {LoginDetails, ThemeType} from '@core/models';

import {
  AuthService,
  CommonFunctionService,
  LanguageService,
  NavigationService,
  NotificationService,
  ThemeService
} from '@core/services';

declare var $: any;

@Component({
    selector: 'app-create-banner',
    templateUrl: './create-banner.component.html',
    styleUrls: ['./create-banner.component.css']
})
export class CreateBannerComponent implements OnInit, OnDestroy {

    language: any;
    createBannerForm: UntypedFormGroup;
    formSubmit: boolean = false;
    bannerCategoryOption: { name: string, value: string }[];
    bannerPlacementOption: { name: any; value: string; }[];
    setTheme: ThemeType;
    file: File;
    fileToReturn: File;
    croppedImage: string = '';
    imageChangedEvent: Event = null;
    image: File
    isImage: boolean = false;
    private activatedSub: Subscription;
    bannerDisplayOption: { name: any; id: string; }[];
    displayedDropdownSettings: IDropdownSettings;
    bannerDispledSelected: any[] = [];
    userData: LoginDetails;
    imgHeight: any;
    imgWidth: any;
    minDate: any;

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
        defaultParagraphSeparator: 'p'
    };

    constructor(private authService: AuthService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        private notificationService: NotificationService,
        public navigation: NavigationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.authService.setLoader(false);
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.language = this.lang.getLanguageFile();

        this.bannerCategoryOption = [
            { name: this.language.banner.app_sponsor, value: '1' },
            { name: this.language.banner.sponsor, value: '2' },
            { name: this.language.banner.free_space, value: '3' },
        ];

        this.bannerPlacementOption = [
            { name: this.language.banner.dashboard, value: '1' },
            { name: this.language.banner.all_news, value: '2' },
            { name: this.language.banner.news_details, value: '3' },
            { name: this.language.banner.all_groups, value: '4' },
            { name: this.language.banner.groups_details, value: '5' },
        ];

        this.bannerDisplayOption = [
            { name: this.language.banner.mobile_app, id: '1' },
            { name: this.language.banner.desktop, id: '2' },
            { name: this.language.banner.notification_section, id: '3' },
            { name: this.language.banner.everywhere, id: '4' },
        ];

        this.displayedDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        }

        this.createBannerForm = this.formBuilder.group({
            bannerName: ['', [Validators.required]],
            description: ['', Validators.required],
            bannerStartDate: ['', Validators.required],
            bannerEndDate: ['', Validators.required],
            image: ['', Validators.required],
            redirectLink: ['', Validators.compose([Validators.required, Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")])],
            status: ['', Validators.required],
            invoice: ['', Validators.required],
            category: this.formBuilder.array([], [Validators.required]),
            placement: this.formBuilder.array([], [Validators.required]),
            display: ['', Validators.required]
        });
    }

    get formControls() {
        return this.createBannerForm.controls;
    }

    /**
    * Function for create a banner
    * @author  MangoIt Solutions(M)
    * @param   {Banner Id}
    * @return  {}
    */
    bannerProcess() {
        this.formSubmit = true;
        this.createBannerForm.controls["display"].setValue(this.bannerDispledSelected);
        this.createBannerForm.value.author = this.userData.userId;
        this.createBannerForm.value.team_id = this.userData.team_id;
        var formData: any = new FormData();
        for (const key in this.createBannerForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.createBannerForm.value, key)) {
                const element: any = this.createBannerForm.value[key];
                if (key == 'category') {
                    formData.append('category', JSON.stringify(element));
                }
                if (key == 'placement') {
                    formData.append('placement', JSON.stringify(element));
                }
                if (key == 'display') {
                    formData.append('display', JSON.stringify(element));
                }
                if (key == 'image') {
                    formData.append('file', element);
                } else {
                    if ((key != 'image') && (key != 'category') && (key != 'placement') && (key != 'display')) {
                        formData.append(key, element);
                    }
                }
            }
        }
        if (this.createBannerForm.valid) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'createBanner', formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.formSubmit = false;
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            setTimeout( () => {
                                this.router.navigate(['/web/banner-detail/' + respData['result']['banner']['id']]);
                            }, 1000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                );
        }
    }

    /**
    * Function is used to get end date
    * @author  MangoIt Solutions
    */
    getEndDate() {
        this.createBannerForm.get('bannerStartDate').valueChanges.subscribe((value) => {
            this.minDate = value;
        });
        if (this.minDate != undefined) {
            return this.minDate
        } else {
            return this.getToday()
        }
    }

    /**
    * Function is used to select checkbox Category option
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Array} numbers array
    */
    oncategoryChange(e: Event) {
        const categoryOption: UntypedFormArray = this.createBannerForm.get('category') as UntypedFormArray;
        if (e.target['checked']) {
            categoryOption.push(new UntypedFormControl(e.target['value']));
        } else {
            let i: number = 0;
            if (categoryOption.controls && categoryOption.controls.length > 0) {
                categoryOption.controls.forEach((item: UntypedFormControl) => {
                    if (item.value == e.target['value']) {
                        categoryOption.removeAt(i);
                        return;
                    }
                    i++;
                });
            }
        }
    }

    /**
    * Function is used to select checkbox Placement option
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Array} numbers array
    */
    onPlacementChange(e: Event) {
        const placementOption: FormArray = this.createBannerForm.get('placement') as FormArray;
        if (e.target['checked']) {
            placementOption.push(new FormControl(e.target['value']));
        } else {
            let i: number = 0;
            if (placementOption.controls && placementOption.controls.length > 0) {
                placementOption.controls.forEach((item: UntypedFormControl) => {
                    if (item.value == e.target['value']) {
                        placementOption.removeAt(i);
                        return;
                    }
                    i++;
                });
            }
        }
    }

    /**
    * Function is used to select dropdown display Option
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Array} numbers array
    */
    onbannerDispledSelect(item: any) {
        this.bannerDispledSelected.push(item.id);
    }


    /**
    * Function is used to remove dropdown display option
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Array} numbers array
    */
    onbannerDispledDeSelect(item: any) {
        this.bannerDispledSelected = [];
    }

    /**
    * Function is used to today date
    * @author  MangoIt Solutions(M)
    */

    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    onCancel() {
        window.history.back();
    }

    /**
   * Function is used to validate file type is image and upload images
   * @author  MangoIt Solutions(M)
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
                // this.imageChangedEvent = '';
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
        this.errorImage = { isError: false, errorMessage: '' };
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
                    this.createBannerForm.patchValue({ image: this.fileToReturn });
                    this.createBannerForm.get('image').updateValueAndValidity();
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
