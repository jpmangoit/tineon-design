import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Email } from 'src/app/models/email.model';
import { NotificationService } from 'src/app/service/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any

@Component({
    selector: 'app-show-email',
    templateUrl: './show-email.component.html',
    styleUrls: ['./show-email.component.css']
})

export class ShowEmailComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    userRole: string;
    responseMessage: string;
    setTheme: ThemeType;
    emailData: Email[];
    totalEmail: number;
    private activatedSub: Subscription;
    currentPageNmuber: number = 1;
    itemPerPage: number = 10;
    totalRecord: number = 0;
    totalEmails: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' },
        { value: '40' },
        { value: '50' }
    ];

    constructor(
        private notificationService: NotificationService,
        private authService: AuthServiceService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
        private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService
    ) { }

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
        this.userRole = this.userDetails.roles[0];
        this.getEmail();
    }

    getEmail() {
        this.authService.memberSendRequest('get', 'getAllEmailTemplate', null).subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                this.emailData = respData;
                this.emailData.forEach((element: any) => {
                    if ( element?.template_logo[0]?.template_image) {
                        element.template_logo[0].template_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.template_logo[0]?.template_image.substring(20)));
                    }
                });  
                this.totalEmails = this.emailData.length;
            }
        )
    }

    deleteEmail(id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_Email, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteEmailTemplate/' + id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);

                        if (respData['isError'] == false) {
                            // $('#responseMessage').show();
                            self.responseMessage = respData['result']['message'];
                            self.notificationService.showSuccess(self.responseMessage, null);
                            setTimeout(function () {
                                // $('#responseMessage').delay(1000).fadeOut();
                                // self.responseMessage = '';
                                self.getEmail()
                            }, 1000);
                        } else if (respData['code'] == 400) {
                            self.responseMessage = respData['message'];
                            self.notificationService.showError(self.responseMessage, null);
                            // setTimeout(function () {
                            // 	$('#responseMessage').delay(1000).fadeOut();
                            // 	self.responseMessage = '';
                            // },1000);
                        }
                    }
                )
        }, function () { }
        )
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalEmails / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                // this.getEmail();
            }
        }
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        // this.getEmail();
    }


    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
