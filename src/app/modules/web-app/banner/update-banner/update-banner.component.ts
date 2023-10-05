import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxImageCompressService, DOC_ORIENTATION } from 'ngx-image-compress';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-banner',
    templateUrl: './update-banner.component.html',
    styleUrls: ['./update-banner.component.css']
})
export class UpdateBannerComponent implements OnInit, OnDestroy {

    language: any;
    updateBannerForm: UntypedFormGroup;
    hasPicture: boolean = false;
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
    bannerDisplayOption: { name: any; id: string; }[];
    displayedDropdownSettings: IDropdownSettings;
    bannerDispledSelected: any[] = [];
    userData: LoginDetails;
    bannerDetail: any;
    showBannerImage: any;
    bannerDropdown: { name: any; id: string; }[] = [];
    bannerId: any;
    checkedStatus: any;
    checkedInvoice: number;
    bannerDisplayed: any[] = [];
    checkActive: boolean = false;
    checkInactive: boolean = false;
    imgHeight: any;
    imgWidth: any;
    minDate: any;

    constructor(private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
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
        this.language = this.lang.getLanguaageFile();
        this.route.params.subscribe(params => {
            this.bannerId = params['bannerId'];
        })

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

        this.updateBannerForm = this.formBuilder.group({
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
            display: ['', Validators.required],
        });
        this.getBannerInfo(this.bannerId);
    }

    get formControls() {
        return this.updateBannerForm.controls;
    }

    /**
    * Function for get Banner detail by Id
    * @author  MangoIt Solutions(M)
    * @param   {Banner Id}
    * @return  {Banner Detail} array of object
    */
    getBannerInfo(id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerbyId/' + id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.bannerDetail = respData['result']
                        this.setBannerData(this.bannerDetail)
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            )
    }

    /**
    * Function is used to set the all values in the form
    * @author  MangoIt Solutions(M)
    * @param   {Banner detail by Id}
    * @return  {}
    */
    setBannerData(bannerInfo: any) {
        var date_to: string[];
        var date_from: string[];
        this.updateBannerForm.controls['bannerName'].setValue(bannerInfo.bannerName);
        this.updateBannerForm.controls['description'].setValue(bannerInfo.description);
        this.updateBannerForm.controls['redirectLink'].setValue(bannerInfo.redirectLink);

        if (bannerInfo['bannerStartDate']) {
            date_from = bannerInfo['bannerStartDate'].split("T");
            this.updateBannerForm.controls['bannerStartDate'].setValue(date_from[0]);
        }

        if (bannerInfo['bannerEndDate']) {
            date_to = bannerInfo['bannerEndDate'].split("T");
            this.updateBannerForm.controls['bannerEndDate'].setValue(date_to[0]);
        }

        this.checkedStatus = bannerInfo['status'];
        this.updateBannerForm.controls['status'].setValue(this.checkedStatus);

        this.checkedInvoice = bannerInfo['invoice'];
        this.updateBannerForm.controls['invoice'].setValue(this.checkedInvoice);

        if (bannerInfo.banner_image[0]?.banner_image != null) {
            this.hasPicture = true;
            if (bannerInfo.banner_image[0].banner_image) {
                this.showBannerImage = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(bannerInfo.banner_image[0].banner_image.substring(20))) as string;
                this.updateBannerForm.controls['image'].setValue(this.showBannerImage);

            }

        } else if (bannerInfo.banner_image.length == 0) {
            this.hasPicture = true;
            this.showBannerImage = '../../../assets/img/no_image.png'
        }
        if (bannerInfo['category']) {
            let bennerCate = JSON.parse(bannerInfo['category']);
            if (this.bannerCategoryOption?.length > 0) {
                this.bannerCategoryOption.forEach((element: any, index: any) => {
                    let cateVal: number = bennerCate.find((data: any) => data == element.value);
                    if (cateVal) {
                        const formArray: UntypedFormArray = this.updateBannerForm.get('category') as UntypedFormArray;
                        formArray.push(new UntypedFormControl(cateVal));
                        this.bannerCategoryOption[index]['cat_val'] = cateVal;
                    } else {
                        this.bannerCategoryOption[index]['cat_val'] = '';
                    }
                })
            }
        }
        if (bannerInfo['placement']) {
            let bannerPlace = JSON.parse(bannerInfo['placement']);
            if (this.bannerPlacementOption?.length > 0) {
                this.bannerPlacementOption.forEach((element: any, index: any) => {
                    let placeVal: number = bannerPlace.find((data: any) => data == element.value);
                    if (placeVal) {
                        const formArray: UntypedFormArray = this.updateBannerForm.get('placement') as UntypedFormArray;
                        formArray.push(new UntypedFormControl(placeVal));
                        this.bannerPlacementOption[index]['place_val'] = placeVal;
                    } else {
                        this.bannerPlacementOption[index]['place_val'] = '';
                    }
                });

            }
        }
        if (bannerInfo['display']) {
            let bannerDisp = JSON.parse(bannerInfo['display']);
            if (this.bannerDisplayOption?.length > 0) {
                this.bannerDisplayOption.forEach((element: any) => {
                    bannerDisp.forEach((elem: any) => {
                        if (elem == element.id) {
                            this.bannerDisplayed.push({ name: element.name, id: element.id })
                            this.bannerDispledSelected.push(element.id)
                        }
                    })

                })
            }
            this.updateBannerForm.controls['display'].setValue(this.bannerDisplayed);
        }
    }

    /**
    * Function for update the changes on the banner
    * @author  MangoIt Solutions(M)
    * @param   {Banner detail by Id}
    * @return  {}
    */
    updateBannerProcess() {
        this.formSubmit = true;
        this.updateBannerForm.controls["display"].setValue(this.bannerDispledSelected);
        if (this.fileToReturn) {
            this.updateBannerForm.controls["image"].setValue(this.fileToReturn);
        } else {
            // this.updateBannerForm.controls["image"].setValue(JSON.parse(this.bannerDetail[0].image));
            this.updateBannerForm.controls["image"].setValue(this.bannerDetail.banner_image[0].banner_image);
        }
        this.updateBannerForm.value.author = this.userData.userId;
        this.updateBannerForm.value.team_id = this.userData.team_id;
        var formData: any = new FormData();
        for (const key in this.updateBannerForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.updateBannerForm.value, key)) {
                const element: any = this.updateBannerForm.value[key];
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
        if (this.updateBannerForm.valid) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'updateBanner/' + this.bannerId, formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.formSubmit = false;

                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            var self = this;
                            setTimeout(function () {
                                self.router.navigate(['/web/banner-detail/' + respData['result']['banner']['id']]);
                            }, 2000);
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
        this.updateBannerForm.get('bannerStartDate').valueChanges.subscribe((value) => {
            this.minDate = value;
        });
        if (this.minDate != undefined) {
            return this.minDate
        } else {
            return this.updateBannerForm.controls['bannerStartDate'].value
        }
    }

    /**
    * Function for select the status
    * @author  MangoIt Solutions(M)
    */
    checkStatusRadioBtn(val: any) {
        this.updateBannerForm.controls['status'].setValue('');
        this.updateBannerForm.controls['status'].setValue(val);
    }

    /**
    * Function for select the Invoices
    * @author  MangoIt Solutions(M)
    */
    checkInvoicesRadioBtn(value: any) {
        this.updateBannerForm.controls['invoice'].setValue('')
        this.updateBannerForm.controls['invoice'].setValue(value)
    }

    /**
    * Function is used to select checkbox Category option
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Array} numbers array
    */
    oncategoryChange(e: Event) {
        const categoryOption: UntypedFormArray = this.updateBannerForm.get('category') as UntypedFormArray;
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
        const placementOption: FormArray = this.updateBannerForm.get('placement') as FormArray;
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
        this.bannerDispledSelected = [];
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
                    this.updateBannerForm.patchValue({ image: this.fileToReturn });
                    this.updateBannerForm.get('image').updateValueAndValidity();
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
