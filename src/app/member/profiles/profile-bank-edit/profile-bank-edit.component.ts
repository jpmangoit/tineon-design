import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
    selector: 'app-profile-bank-edit',
    templateUrl: './profile-bank-edit.component.html',
    styleUrls: ['./profile-bank-edit.component.css'],
})
export class ProfileBankEditComponent implements OnInit {
    language: any;
    userDetails: ProfileDetails;
    updateBankForm: UntypedFormGroup;
    responseMessage: string = null;
    submitted: boolean = false;
    displayGeneral: boolean;
    displayPayment: boolean = true;
    displayMaster: boolean;
    displayClub: boolean;
    setTheme: ThemeType;
    user: ProfileDetails;
    userData: { bic: string; iban: string; name: string };
    private activatedSub: Subscription;
    userDataProfile: any;
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
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: true
    }
    thumbnail: SafeUrl = null;
    memberPhoto: string;
    isNotGerman: boolean = true;
    headline_word_option: number = 0;

    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.userDataProfile = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option =parseInt(localStorage.getItem('headlineOption'));

        this.language = this.lang.getLanguaageFile();
        this.updateBankForm = this.formBuilder.group({
            userName: ['', Validators.required],
            iban: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{22}$')]],
            bic: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{11}$')]],
            name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')]],
        });
        this.getBankDetails();
        this.getProfileData();
        this.getUserImage();
    }

    /**
    * Function is used to get Bank Details
    * Date: 02 Feb 2023
    * @author  MangoIt Solutions (T)
    * @param   {}
    * @return  {object} user details
    */
    getBankDetails() {
        let userDetail: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        this.authService.setLoader(true);
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'member-info/' + userDetail.database_id + '/' + userDetail.team_id + '/' + userDetail.member_id, userDetail)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.user = respData;

                    if(this.user.changeRequest.bank.status == 'pending'){
                        this.userData = this.user.changeRequest.bank.dataChanges;
                    }else{
                        this.userData = respData['bankData'];
                    }
                    this.setBankDetails();
                });
        }
    }

    /**
    * Function is used to set Bank Details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    setBankDetails() {
        let userDetail: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        this.updateBankForm = this.formBuilder.group({
            database_id: [userDetail.database_id],
            club_id: [userDetail.team_id],
            member_id: [userDetail.member_id],

            userName: [this.user.firstName + ' ' + this.user.lastName, Validators.required,],
            iban: [this.userData.iban, [Validators.required, Validators.pattern('^[A-Z0-9]{22}$')],],
            bic: [this.userData.bic, [Validators.required, Validators.pattern('^[A-Z0-9]{11}$')]],
            name: [this.userData.name, [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),]],
        });
    }

    /**
    * Function is used to set Bank Details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    validateIban(iban: string): void {
        if (this.isNotGerman == true) {
            if (sessionStorage.getItem('token')) {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'validate-iban/' + iban, null)
                    .subscribe((respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'].message, null);
                        } else {
                            if (toString.call(respData) == '[object String]') {
                                this.responseMessage = respData;
                                setTimeout(() => {
                                    this.responseMessage = '';
                                }, 2000);
                            } else if (toString.call(respData) == '[object Object]') {
                                this.responseMessage = '';
                                this.updateBankForm.patchValue({
                                    bic: respData.bic,
                                    name: respData.name
                                });
                            }
                        }
                    });
            }
        }
    }

    onSelectCheckBox(event: any) {
        if (event.target.checked == true) {
            this.isNotGerman = false;
        } else if (event.target.checked == false) {
            this.isNotGerman = true;
            this.updateBankForm.controls.bic.setValue('');
            this.updateBankForm.controls.name.setValue('');
        }
    }

    /**
    * Function is used to set Bank Details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    updateBankData() {
        this.submitted = true;
        if (sessionStorage.getItem('token') && this.updateBankForm.valid) {
            this.authService.setLoader(true);
            let formValue: any = this.updateBankForm.value;
            delete formValue['userName'];
            this.authService.memberSendRequest('post', 'bank-info', formValue)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.successMessage(respData);
                    this.submitted = false;
                    setTimeout(() => {
                        this.getBankDetails();
                        this.router.navigate(['profile-bank']);
                    }, 2000);
                    if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'].message, null);
                    }
                });
        }
    }

    successMessage(msg: string) {
        if (msg == 'OK') {
            this.notificationService.showSuccess(this.language.profile_bank.success_msg, null);
            this.updateBankForm.reset();
            return true;
        }
    }

    onCancel() {
        this.router.navigate(['/profile-bank']);
    }

    onPaymentData() {
        this.displayGeneral = false;
        this.displayPayment = true;
        this.displayMaster = false;
        this.displayClub = false;
    }

    getUserImage() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'].message, null);
                        } else {
                            this.memberPhoto = respData;
                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                        }
                    }
                );
        }
    }

    getProfileData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'member-info/' + userData.database_id + '/' + userData.team_id + '/' + userData.member_id, userData)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.userDetails = respData;
                });
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
