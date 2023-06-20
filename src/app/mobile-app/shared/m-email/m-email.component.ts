import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-m-email',
  templateUrl: './m-email.component.html',
  styleUrls: ['./m-email.component.css']
})
export class MEmailComponent implements OnInit {
    language: any;
    isMobile: boolean = false;
    emailForm: UntypedFormGroup;
    emailsubmitted: boolean = false;
    formError: string;
    validError: boolean = false;

  constructor(
    public authService: AuthServiceService,private lang: LanguageService, public router: Router,
     private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 768) {
        this.isMobile = true;
    }
    this.language = this.lang.getLanguaageFile();
    this.emailForm = new UntypedFormGroup({
        name: new UntypedFormControl('', [Validators.required, this.noWhitespace]),
        club_name: new UntypedFormControl('', [Validators.required, this.noWhitespace]),
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        association_purpose: new UntypedFormControl(''),
        number_of_members: new UntypedFormControl(''),
        club_Website: new UntypedFormControl(''),
        // isMobile: new UntypedFormControl('')
    });
  }

  noWhitespace(control: UntypedFormControl) {
    if (control?.value.length != 0) {
        let isWhitespace: boolean = (control.value || '').trim().length === 0;
        let isValid: boolean = !isWhitespace;
        return isValid ? null : { 'whitespace': true }
    } else {
        let isValid: boolean = true;
        return isValid ? null : { 'whitespace': true }
    }
}

  emailProcess() {
    this.formError = '';
    this.emailsubmitted = true;
    this.validError = false;
    console.log(this.emailForm);
    if (this.emailForm.valid) {
        console.log(this.emailForm.value);
        this.authService.setLoader(true);
        this.authService.memberSendRequest('post', 'tineonInfoCreate', this.emailForm.value)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.emailsubmitted = false;
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message']['messageList']['tineon'], null);
                        var self = this;
                        setTimeout(function () {
                            self.router.navigate(['/login']);
                        }, 1000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            );
    }

  }

}
