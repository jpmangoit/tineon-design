import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { LanguageService } from '../../service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from 'src/app/service/theme.service';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ClubTheme, LoginDetails } from 'src/app/models/login-details.model';
import { filter, map, take, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    language: any;
    loginsubmitted: boolean = false;
    validError: boolean = false;
    formError: string;
    displayFlag: string = 'de';
    loginForm: UntypedFormGroup;
    theme_data: ThemeType;
    tokenn: string;
    isMobile: boolean = false;

    constructor(
        public authService: AuthServiceService,
        private router: Router,
        private lang: LanguageService,
        private cookieService: CookieService,
        private themes: ThemeService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        if (window.innerWidth < 768) {
            this.isMobile = true;
        }
        this.language = this.lang.getLanguaageFile();
        this.loginForm = new UntypedFormGroup({
            username: new UntypedFormControl('', [Validators.required]),
            password: new UntypedFormControl('', [Validators.required]),
            remember: new UntypedFormControl(''),
            isMobile: new UntypedFormControl('')
        });
        if (this.cookieService.get('username') != null && this.cookieService.get('password') != null) {
            this.loginForm.controls["username"].setValue(this.cookieService.get('username'));
            this.loginForm.controls["password"].setValue(this.cookieService.get('password'));
        }
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'de');
        }
        this.displayFlag = localStorage.getItem('language');
        if (this.cookieService.get('remember')) {
            let self = this;
            setTimeout(function () {
                $(".rememberMe").trigger('click');
                $(".username").val(self.cookieService.get('username'));
                $(".password").val(self.cookieService.get('password'));
            }, 300);
        }
        if (this.authService.IsLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }
    }

    loginProcess() {
        this.formError = '';
        this.loginsubmitted = true;
        this.validError = false;
        if (this.loginForm.valid) {
            this.loginForm.controls["isMobile"].setValue(this.isMobile);
            if (this.loginForm.controls['remember'].value) {
                this.cookieService.set('username', this.loginForm.controls['username'].value);
                this.cookieService.set('password', this.loginForm.controls['password'].value);
                this.cookieService.set('remember', "rememberme");
            }
            this.authService.setLoader(true);
            this.authService.sendRequest('post', 'login-keycloak', this.loginForm.value)
                .subscribe(
                    (respData: LoginDetails) => {
                        this.loginsubmitted = false;
                        this.validError = false;
                        var club_id = respData.team_id;
                        if (respData['access_token']) {
                            this.tokenn = respData['access_token'];
                            sessionStorage.setItem('token', respData['access_token']);
                            sessionStorage.setItem('refresh_token', respData['refresh_token']);
                            localStorage.setItem('token', respData['access_token']);
                            localStorage.setItem('refresh_token', respData['refresh_token']);
                            localStorage.setItem('user-id', respData['userId']);
                            localStorage.setItem('allowAdvertis', respData['allowAdvertis']);
                            localStorage.setItem('headlineOption', respData['headlineOption']);
                            localStorage.setItem('mobileThemeOption', respData['mobileThemeColour'] ? respData['mobileThemeColour'] : "mobile-red");
                            const bodyTag = document.body;
                            bodyTag.classList.remove('mobile-red');
                            bodyTag.classList.remove('mobile-green');
                            bodyTag.classList.add(localStorage.getItem('mobileThemeOption'));
                            localStorage.setItem('user-data', JSON.stringify(respData));
                            var status = '1';
                            localStorage.setItem('loginStatus', status);
                            this.authService.sendRequest('get', 'club-active-theme/' + respData.team_id, null)
                                .subscribe(
                                    (respData: any) => {
                                        if (respData['isError'] == false) {
                                            
                                            if (respData.result.clubTheme.length > 0) {
                                                this.theme_data = respData['result']['clubTheme'][0];
                                                // if (this.theme_data?.['club_image'][0]?.theme_url){
                                                //     this.theme_data['club_image'][0].theme_url = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.theme_data?.['club_image'][0]?.theme_url.substring(20)));
                                                // }
                                                this.themes.getClubTheme(this.theme_data);
                                            } else {
                                                this.themes.getClubDefaultTheme(club_id);
                                            }
                                        } else if (respData['code'] == 400 || respData['code'] == 404) {
                                            this.themes.getClubDefaultTheme(club_id);
                                            this.authService.setLoader(false);
                                        };
                                    }
                                );
                            const url: string[] = ["/dashboard"];
                            this.router.navigate(url);
                            this.authService.setLoader(false);
                        }
                        else if (respData['code'] == 400) {
                            this.validError = true;
                            this.formError = respData['message'];
                            this.authService.setLoader(false);
                        }
                    }
                );
        }
    }

    showToggle: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("lang-drop");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "dropdown lang-drop show";

        } else {
            this.showToggle = false;
            el[0].className = "dropdown lang-drop";
        }
    }

    onLanguageSelect(lan: any) {
        localStorage.setItem('language', lan);
        window.location.reload();
    }
}
