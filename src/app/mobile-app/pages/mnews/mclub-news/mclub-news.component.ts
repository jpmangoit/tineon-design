import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NewsType } from 'src/app/models/news-type.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-mclub-news',
    templateUrl: './mclub-news.component.html',
    styleUrls: ['./mclub-news.component.css']
}) 
export class MclubNewsComponent implements OnInit {

    language: any;
    role: string = '';
    thumbnail: string;
    thumbnail1: string;
    num: number = 4;
    num1: number = 3;
    memberid: number;
    displayError: boolean = false;
    displayPopup: boolean = false;
    responseMessage: string = null;
    userData: LoginDetails;
    dashboardData: NewsType[];
    guestNews: NewsType[] = [];
    newsData: NewsType;
    newsDetails: NewsType[] = [];
    newsDisplay: number;
    url: string;
    thumb: SafeUrl;
    proImage: SafeUrl;
    newImg: string;
    setTheme: ThemeType;
    private activatedSub: Subscription;

    constructor(
        public authService: AuthServiceService,
        private lang: LanguageService,
        private router: Router,
        private confirmDialogService: ConfirmDialogService,
        private themes: ThemeService,
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
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userData.roles[0];
        this.url = this.router.url;
        if (this.url == '/dashboard' || this.url == '/') {
            this.num = 4;
            this.num1 = 3;
            this.displayPopup = true;
            this.newsDisplay = 4;

        } else if (this.url == '/clubwall/club-news' || this.url == '/clubwall') {
            this.num = 3;
            this.num1 = 4;
            this.displayPopup = false;
            this.newsDisplay = 4;
        }
        this.getAllNews();
    }

    /**
    * Function is used to get all news
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Object}
    */
    getAllNews() {
        if (sessionStorage.getItem('token')) {
            let userId: string = localStorage.getItem('user-id');
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'mv/news/user/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.dashboardData = respData;
                        if (this.dashboardData?.length > 0) {
                            this.dashboardData.forEach((element, index) => {
                                
                                if (element?.news_image[0]?.news_image ) {
                                    element.news_image[0].news_image= this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20))) as string;
                                }
                                if (index < 7) {
                                    if (element.user.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    element.user.image = this.thumb;
                                                    this.authService.setLoader(false);
                                                },
                                                (error: any) => {
                                                    element.user.image = '';
                                                })
                                    } else {
                                        element.user.image = '';
                                    }
                                }
                            });
                        }
                        this.dashboardData.reverse();
                    }
                );
        }
    }

    /**
    * Function is used to get new details by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  {Object}
    */
    getNewsDetails(newsid: number) {
        this.newImg = '';
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-news-by-id/' + newsid, null)
                .subscribe(
                    (respData: any) => {
                        this.getFirstNews(respData);
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    /**
    * Function is used to get first news
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Object}
    */
    getFirstNews(allNews: NewsType) {
        let news: NewsType = allNews['result'];
        this.newsData = news;
        if (this.newsData.imageUrls == '' || this.newsData.imageUrls == null) {
            this.newImg = '../../assets/img/no_image.png';
        } else {
            if (this.newsData.imageUrls) {
                this.newsData.imageUrls = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData.imageUrls.substring(20)));
                this.newImg = this.newsData.imageUrls;
            }
        }
        this.memberid = this.newsData.user.member_id;
        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.memberid, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.thumbnail = respData;
                },
                (error: any) => {
                    this.thumbnail = null;
                });
    }

    showAll() {
        this.router.navigate(['/clubwall-news/1']);
    }

    showToggle: boolean = false;
    removeHtml(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    showToggles: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = "bunch_drop show";
        }
        else {
            this.showToggle = false;
            el[0].className = "bunch_drop";
        }
    }

    /**
    * Function is used to delete news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteNews(newsId: number) {
        $('#exModal').modal('hide');
        let self = this;
        this.commonFunctionService.deleteNews(newsId)
            .then((resp: any) => {
                self.notificationService.showSuccess(resp, null);
                self.getAllNews()
                const url: string[] = ["/clubwall"];
                self.router.navigate(url);
            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            });
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId: number) {
        $('#exModal').modal('hide');
        const url: string[] = ["/update-news/" + newsId];
        this.router.navigate(url);
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
