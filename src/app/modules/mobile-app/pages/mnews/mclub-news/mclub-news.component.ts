import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {LoginDetails, NewsType, ThemeType} from '@core/models';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';

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
        this.language = this.lang.getLanguageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userData.roles[0];
        this.url = this.router.url;
        if (this.url == '/mobile/dashboard' || this.url == '/') {
            this.num = 4;
            this.num1 = 3;
            this.displayPopup = true;
            this.newsDisplay = 4;

        } else if (this.url == '/mobile/clubwall/club-news' || this.url == '/mobile/clubwall') {
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
                                if (element?.news_image[0]?.news_image) {
                                    element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20))) as string;
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
        if (this.newsData.news_image[0]?.news_image == '' || this.newsData.news_image[0]?.news_image == null) {
            this.newImg = '../../assets/img/no_image.png';
        } else {
            if (this.newsData.news_image[0]?.news_image) {
                this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData.news_image[0]?.news_image.substring(20)));
                this.newImg = this.newsData.news_image[0]?.news_image;
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
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            //mobile
            this.router.navigate(['/mobile/mclub-all-news']);
        } else {
            //desktop
            this.router.navigate(['/mobile/clubwall-news/1']);
        }
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
        this.commonFunctionService.deleteNews(newsId)
            .then((resp: any) => {
                this.notificationService.showSuccess(resp, null);
                this.getAllNews()
                const url: string[] = ["/mobile/clubwall"];
                this.router.navigate(url);
            })
            .catch((err: any) => {
                this.notificationService.showError(err, null);
            });
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId: number) {
        $('#exModal').modal('hide');
        const url: string[] = ["/mobile/update-news/" + newsId];
        this.router.navigate(url);
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
