import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeData, ThemeType } from 'src/app/models/theme-type.model';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
    selector: 'app-themes',
    templateUrl: './themes.component.html',
    styleUrls: ['./themes.component.css'],
})

export class ThemesComponent implements OnInit {
    language: any;
    userDetails: LoginDetails;
    userRole: string;
    setTheme: ThemeType;
    themeData: ThemeData[];
    theme_data: ThemeData;
    private activatedSub: Subscription;
    currentPageNmuber: number = 1;
    itemPerPage: number = 10;
    totalRecord: number = 0;
    totalThemes: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' }, 
        { value: '40' },
        { value: '50' }
    ];

    constructor(
        private authService: AuthServiceService,
        private themes: ThemeService,
        private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
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

        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.getThemeData();
    }

    DefaultTheme() {
        this.authService.setLoader(true);
        this.authService.sendRequest('put', 'setdefault-club-theme', null)
            .subscribe((respData: any) => {
                if (respData['isError'] == false) {
                    this.themes.getClubDefaultTheme(this.userDetails.team_id);
                    this.getThemeData();
                } else if (respData['code'] == 400) {
                    this.authService.setLoader(false);
                }
            }); 
    }

    activate(themeId: number) {
        this.authService.setLoader(true);
        this.authService.sendRequest('put', 'activate-club-theme/' + themeId, null)
            .subscribe((respData: any) => {
                
                if (respData['isError'] == false) {
                    if (respData && respData.result && respData.result.clubTheme && respData.result.clubTheme.length > 0) {
                        this.theme_data = respData['result']['clubTheme'][0];
                        this.themes.getClubTheme(this.theme_data); 
                    } else {
                        this.themes.getClubDefaultTheme(this.userDetails.team_id);
                    }
                    this.getThemeData();
                } else if (respData['code'] == 400) {
                    this.authService.setLoader(false);
                }
            });
    }

    getThemeData() {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if (this.userRole == 'admin') {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'club-theme/' + this.userDetails.team_id, null)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.themeData = respData['result']['clubTheme'];
                        this.themeData.forEach((element:any)=>{
                            if (element?.club_image[0]?.theme_url) {
                                element.club_image[0].theme_url = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.club_image[0]?.theme_url .substring(20))) as string;
                            }
                        })
                        this.themeData.sort((a, b) => b.status - a.status);
                        this.totalThemes = this.themeData.length;
                    }
                });
        } 
    }

    pageChanged(event: number) {
        this.currentPageNmuber = event;
        // this.getThemeData();
    }

    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalThemes / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                // this.getThemeData();
            }
        }
    }

    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        // this.getThemeData();
    }


    /**
    * Function for delete the particular Theme by Id
    * @author  MangoIt Solutions(M)
    * @param   {Theme Id}
    * @return  {}
    */
    deleteTheme(themeId: number, status: number) {
        let confirmMessage: string;
        if (status == 0) {
            confirmMessage = this.language.theme.delete_theme;
        } else {
            confirmMessage = this.language.theme.apply_default_theme;
        }
        let self = this;
        self.confirmDialogService.confirmThis(confirmMessage, function () {
            self.authService.setLoader(true);
            self.authService
                .memberSendRequest('delete', 'delete-club-theme/' + themeId, null)
                .subscribe((respData: string) => {
                    self.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(function () {
                            if (status == 1) {
                                self.themes.getClubDefaultTheme(self.userDetails.team_id);
                            }
                            self.ngOnInit();
                        }, 3000);
                    } else if (respData['code'] == 400) {
                        self.notificationService.showError(respData['message'], null);
                    }
                });
        },
            function () { }
        );
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
