import {Component,OnInit,ViewChild,ElementRef,OnDestroy,} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
  selector: 'app-mprofile-edit',
  templateUrl: './mprofile-edit.component.html',
  styleUrls: ['./mprofile-edit.component.css'],
  providers: [DatePipe],
})
export class MprofileEditComponent implements OnInit {
    language: any;
    registrationForm: FormGroup;
    datePipeString: string;
    submitted: boolean = false;
    file: File;
    fileToReturn: File;
    responseMessage: string = null;
    thumbnail: SafeUrl;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    memberPhoto: SafeUrl;
    role: string;
    userData: ProfileDetails;
    memberPhotosuccess: string;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    private activatedPro: Subscription;
    @ViewChild('fileInput') fileInput: ElementRef;
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 1
            },
            740: {
                items: 1
            },
            940: {
                items: 1
            }
        },
        nav: true
    }
    userDataProfile: any;
    isImage: boolean = false;
    allowAdvertisment: any;
    imgHeight: any;
    imgWidth: any;

    constructor(
        private authService: AuthServiceService,
        public formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private _router: Router,
        private lang: LanguageService,
        private sanitizer: DomSanitizer,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
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

        this.activatedPro = this.themes.profile_imge.subscribe((resp: string) => {
            this.getUserImage();
        });
        this.userDataProfile = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.language = this.lang.getLanguaageFile();
        this.getProfileData();
        this.getUserImage();
        this.registrationForm = this.formBuilder.group({
            street: ['', Validators.required],
            street2: ['', Validators.required],
            city: ['', Validators.required],
            countryCode: [''],
            postCode: ['', Validators.required],
            poboxCity: [''],
            email: [''],
            phone:  ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            share: [''],
            birthDate: [''],
            allowAdvertis:['']
        });
    }

    /**
    * Function is used to get member photo
    * @author  MangoIt Solutions
    * @param   {}
    * @return  mebmber phto in blob formate
    */
    getUserImage() {
        if (sessionStorage.getItem('token') ) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'].message,null);

                    } else {
                        this.memberPhoto = respData;
                        this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                    }
                }
            );
        }
    }

    /**
    * Function is used to get member information
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {array} member information detsails
    */
    getProfileData() {
        if (sessionStorage.getItem('token')) {
            let userDetail: LoginDetails = JSON.parse(
                localStorage.getItem('user-data')
            );
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get','member-info/' + userDetail.database_id + '/' + userDetail.team_id + '/' + userDetail.member_id, userDetail )
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    // if (Object.keys(respData).length) {
                        this.userData = respData;
                        this.role = userDetail.roles[0];
                        this.setValue();
                    // }
                });
        }
    }

    /**
    *  Function is used to gset value at the time edit user details
    * Date: 15 Mar 2023
    * @author  MangoIt Solutions (R)
    */
    setValue() {
        
        if(this.userData.changeRequest.member.status == 'pending'){
            this.registrationForm = this.formBuilder.group({
                street: [this.userData.changeRequest.member.dataChanges.street, [Validators.required, this.noWhitespace]],
                street2: [this.userData.street2,[this.noWhitespace]],
                city: [this.userData.changeRequest.member.dataChanges.city, [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]],
                countryCode: [this.userData.countryCode],
                postCode: [this.userData.changeRequest.member.dataChanges.postCode,[Validators.required, Validators.pattern('^[1-9]{1}?[0-9]*$')]],
                poboxCity: [this.userData.poboxCity],
                email: [this.userData.email],
                phone: [this.userData.changeRequest.member.dataChanges.phone, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
                birthDate: [this.datePipe.transform(this.userData.changeRequest.member.dataChanges.birthDate,'yyyy-MM-dd')],

                share: [this.userData.shareBirthday],
                allowAdvertis:[''],
            });
            if(this.allowAdvertisment == 1){
                this.registrationForm.controls.allowAdvertis.setValue(this.allowAdvertisment);
            }

        }else{
            if (this.userData.birthDate) {
                this.datePipeString = this.datePipe.transform(this.userData.birthDate,'yyyy-MM-dd');
            }
            this.registrationForm = this.formBuilder.group({
                street: [this.userData.street, [Validators.required, this.noWhitespace]],
                street2: [this.userData.street2,[this.noWhitespace]],
                city: [this.userData.city, [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]],
                countryCode: [this.userData.countryCode],
                postCode: [this.userData.postCode,[Validators.required, Validators.pattern('^[1-9]{1}?[0-9]*$')]],
                poboxCity: [this.userData.poboxCity],
                email: [this.userData.email],
                phone: [this.userData.phone, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
                birthDate: [this.datePipeString],
                share: [this.userData.shareBirthday],
                allowAdvertis:['']
            });
            if(this.allowAdvertisment == 1){
                this.registrationForm.controls.allowAdvertis.setValue(this.allowAdvertisment);
            }
        }

        // if (this.userData.birthDate) {
        //     this.datePipeString = this.datePipe.transform(this.userData.birthDate,'yyyy-MM-dd');
        // }
        // this.registrationForm = this.formBuilder.group({
        //     street: [this.userData.street.trim(), [Validators.required, this.noWhitespace]],
        //     street2: [this.userData.street2,[Validators.required, this.noWhitespace]],
        //     city: [this.userData.city, [Validators.required, this.noWhitespace]],
        //     countryCode: [this.userData.countryCode],
        //     postCode: [this.userData.postCode,[Validators.required, Validators.pattern('^[1-9]{1}?[0-9]*$')]],
        //     poboxCity: [this.userData.poboxCity],
        //     email: [this.userData.email],
        //     phone: [this.userData.phone.trim(), [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        //     birthDate: [this.datePipeString],
        //     share: [this.userData.shareBirthday],
        //     allowAdvertis:['']

        // });
        // if(this.allowAdvertisment == 1){
        //     this.registrationForm.controls.allowAdvertis.setValue(this.allowAdvertisment);
        // }
    }

    noWhitespace(control: FormControl) {
        if (control?.value != null) {
            if(control?.value.length != 0){
                let isWhitespace: boolean = (control.value || '').trim().length === 0;
                let isValid: boolean = !isWhitespace;
                return isValid ? null : { 'whitespace': true }
            }else {
                let isValid: boolean = true;
                return isValid ? null : { 'whitespace': true }
            }
        } else {
            let isValid: boolean = true;
            return isValid ? null : { 'whitespace': true }
        }
    }

     /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage: { isError: boolean; errorMessage: string } = {isError: false, errorMessage: ''};
        uploadFile(event: Event) {
        var file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
            const mimeType: string = file.type;
            if (mimeType.match(/image\/*/) == null) {
                this.errorImage = {isError: true, errorMessage: this.language.error_message.common_valid};
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 2000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event);
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
        var mimeType: string = this.file.type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = {
            isError: true,
            errorMessage: this.language.error_message.common_valid,
            };
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
    * Function is used to cropped the uploaded image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} file object
    */
    imageCropped(event: ImageCroppedEvent) {
        this.imageCompress.compressFile(event.base64,-1,100,100, 100, 100) // 50% ratio, 50% quality
        .then(
            (compressedImage) => {
                this.croppedImage = compressedImage;
            }
        );
    }

    imageLoaded() {}

    cropperReady() {
        /* cropper ready */
        this.isImage = false;
    }

    loadImageFailed() {
        /* show message */
    }

    reloadCurrentRoute() {
        let currentUrl = '/profile';
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigate([currentUrl]);
        });
    }

    /**
    * Function is used to changed user profile Image
    * M-Date: 03 Feb 2023
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {object} user details
    */

    changeImage(){
        if(this.croppedImage){
            let data = {
                "image_file": this.croppedImage.split('base64,')[1]
            }
            let self = this;
            self.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'change-profile-picture/', data).subscribe(
            (respData: any) => {
                self.authService.setLoader(false);
                this.memberPhotosuccess = respData;
                if (this.memberPhotosuccess == 'OK') {
                    this.themes.getProfilePicture(this.memberPhotosuccess);
                    this.notificationService.showSuccess(this.language.profile.upload_profile,null);
                    setTimeout(() => {
                        self._router.navigate(['/profile']);
                    }, 3000);
                }else if (respData['code'] == 400) {
                    self.authService.setLoader(false)
                    this.notificationService.showError(this.language.community_messages.code_error,null);
                }
            });
        }
    }

    cancel() {
        this._router.navigate(['/profile']);
    }

    /**
    * Function is used to print page
    * @author  MangoIt Solutions
    */
    print() {
        window.print();
    }

    /**
    * Function is used to get date
    * @author  MangoIt Solutions
    */
    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

     /**
    * Function is used to update user personal information
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} success message
    */
    registrationProcess() {
        this.submitted = true;
        if (sessionStorage.getItem('token') && this.registrationForm.valid) {
            if(this.registrationForm.value['allowAdvertis'] == true){
                this.registrationForm.value['allowAdvertis'] = 1;
            }else{
                this.registrationForm.value['allowAdvertis'] = 0;
            }
            let userData: LoginDetails = JSON.parse(
                localStorage.getItem('user-data')
            );
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post','modify-user-data/' + userData.database_id + '/' + userData.team_id + '/' + userData.member_id,
                    this.registrationForm.value
                )
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.successMessage(respData);
                    this.submitted = false;
                    if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }

    successMessage(msg: string) {
        if (msg == 'OK') {
            localStorage.removeItem('allowAdvertis');
            localStorage.setItem('allowAdvertis', this.registrationForm.value['allowAdvertis']);
            this.notificationService.showSuccess(this.language.profile_bank.success_msg,null);
            this.registrationForm.reset();
            let self = this;
            setTimeout(function () {
                self._router.navigate(['/profile']);
            }, 2000);
            return true;
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
        this.activatedPro.unsubscribe();
    }
}
