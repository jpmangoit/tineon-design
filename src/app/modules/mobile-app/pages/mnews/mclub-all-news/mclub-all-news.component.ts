import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import {LoginDetails, NewsType, ThemeType} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';
import {DomSanitizer} from '@angular/platform-browser';

declare var $: any;


@Component({
    selector: 'app-mclub-all-news',
    templateUrl: './mclub-all-news.component.html',
    styleUrls: ['./mclub-all-news.component.css']
})
export class MclubAllNewsComponent implements OnInit, OnDestroy {
    language: any;
    role: string = '';
    responseMessage: string = null;
    currentPageNmuber: number = 1;
    itemPerPage: number = 8;
    newsTotalRecords: number = 0;
    guestNewsRecords: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' },
        { value: '40' }
    ];
    thumbnails: string[] = [];
    memberid: number;
    thumb: string;
    thumbnail: any;
    userData: LoginDetails;
    dashboardData: NewsType[] = [];
    guestNews: NewsType[] = [];
    newsData: NewsType;
    setTheme: ThemeType;
    newImg: string
    private activatedSub: Subscription;
    sliderOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        margin: 24,
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
        nav: false,
        autoplay: true
    }
    bannerData: any;
    mobBannerData: any;
    adsTineon: any;
    allowAdvertisment: any;
    isShow: boolean = false;

    constructor(
        private authService: AuthServiceService,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
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
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.role = this.userData.roles[0];
        if (this.allowAdvertisment == 0) {
            if (sessionStorage.getItem('token') && window.innerWidth < 768) {
                this.getMobileAllNewsBanners()
            }
        }
        this.getAllNews();
    }


    /**
  * Function for get All the Banners
  * @author  MangoIt Solutions(M)
  * @param   {}
  * @return  {all the records of Banners} array of object
  */
    getMobileAllNewsBanners() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForAllNewsMobileApp/', null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.mobBannerData = respData['result']['banner']
                        this.mobBannerData.forEach((element: any) => {
                            element['category'] = JSON.parse(element.category);
                            element['placement'] = JSON.parse(element.placement);
                            element['display'] = JSON.parse(element.display);
                            if (element.banner_image[0]?.banner_image) {
                                element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0]?.banner_image.substring(20)));
                            }
                            if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                element['redirectLink'] = element.redirectLink;
                            } else {
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        })
                        this.timeOut1();
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            )
    }

    timeOut1() {
        let count = 0;
        setInterval(() => {
            if (count === this.mobBannerData.length) {
                count = 0;
            }
            this.adsTineon = this.mobBannerData[count];
            count++;
        }, 3000);
    }


    /**
  * Function is used to add click count for a the particular mobile or desktop Banner
  * @author  MangoIt Solutions(M)
  * @param   {BannerId}
  * @return  {Object}
  */
    onClickBanner(bannerId: number) {
        let displayMode: number
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            displayMode = 1;
        } else {
            displayMode = 0;
        }

        let data = {
            banner_id: bannerId,
            user_id: this.userData.userId,
            display_mode: displayMode
        }

        this.authService.memberSendRequest('post', 'bannerClick/', data)
            .subscribe((respData: any) => {
            })
    }

    getAllNews() {
        if (sessionStorage.getItem('token')) {
            this.dashboardData = [];
            this.guestNews = [];
            this.authService.setLoader(true);
            if (this.role == 'admin' || this.role == 'guest') {
                this.authService.memberSendRequest('get', 'posts/' + this.currentPageNmuber + '/' + this.itemPerPage, null).subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData.news.length == 0) {
                        this.authService.setLoader(false);
                    } else {
                        this.newsTotalRecords = respData.pagination.rowCount;
                        this.dashboardData = respData.news;
                        if (this.dashboardData && this.dashboardData.length > 0) {
                            this.dashboardData.forEach(element => {
                                if (element?.news_image[0]?.news_image) {
                                    element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20))) as string;
                                }
                                if (element.user.member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.authService.setLoader(false);
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error: any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = '';
                                }
                                if (this.role == 'guest') {
                                    if (element.show_guest_list == 'true') {
                                        this.guestNews.push(element);
                                    }
                                    this.guestNewsRecords = respData.pagination.rowCount;
                                }
                            });
                        }
                    }
                });
            } else if ((this.role != 'admin') && (this.role != 'guest')) {
                let userId: string = localStorage.getItem('user-id');

                this.authService.memberSendRequest('get', 'uposts/' + userId + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null).subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData.news.length == 0) {
                            this.authService.setLoader(false);
                        } else {
                            this.newsTotalRecords = respData.pagination.rowCount;
                            this.dashboardData = respData.news;
                            if (this.dashboardData && this.dashboardData.length > 0) {
                                this.dashboardData.forEach(element => {
                                    if (element?.news_image[0]?.news_image) {
                                        element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20))) as string;
                                    }

                                    if (element.user.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.authService.setLoader(false);
                                                    this.thumb = resppData;
                                                    element.user.image = this.thumb;
                                                },
                                                (error: any) => {
                                                    element.user.image = null;
                                                });
                                    } else {
                                        element.user.image = '';
                                    }
                                    // if (this.role == 'guest') {
                                    //     if (element.show_guest_list == 'true') {
                                    //         this.guestNews.push(element);
                                    //     }
                                    //     this.guestNewsRecords = respData.pagination.rowCount;
                                    // }
                                });
                            }
                        }
                    });
            }
        }
    }

    /**
    * Function is used to get news details by news id
    * @author  MangoIt Solutions
    * @param   {newsid}
    * @return  {Object}
    */
    getNewsDetails(newsid: number) {
        this.newsData = null;
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

        if (this.newsData?.news_image[0]?.news_image == '' || this.newsData?.news_image[0]?.news_image == null) {
            this.newImg = '../../assets/img/no_image.png';
        } else {

            if (this.newsData?.news_image[0]?.news_image) {
                this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData?.news_image[0]?.news_image.substring(20))) as string;
                this.newImg = this.newsData?.news_image[0]?.news_image;
            }
        }
        this.memberid = this.newsData.user.member_id;
        this.authService.setLoader(true);
        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.memberid, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.thumbnail = respData;
                },
                (error: any) => {
                    this.thumbnail = null;
                }
            );
    }

    goBack() {
        window.history.back();
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getAllNews();
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.newsTotalRecords / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                this.getAllNews();
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
        this.getAllNews();
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
        } else {
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
                setTimeout(function () {
                    this.getAllNews()
                    const url: string[] = ["/mobile/clubwall"];
                    this.router.navigate(url);
                }, 3000);
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

    /**
    * Function to close the banner
    * Date: 15 Mar 2023
    * @author  MangoIt Solutions (R)
    */
    toggleDisplay() {
        this.isShow = !this.isShow;
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
