import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {LoginDetails, NewsType, ThemeType} from '@core/models';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {Router} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-club-news',
    templateUrl: './club-news.component.html',
    styleUrls: ['./club-news.component.css']
})

export class 
ClubNewsComponent implements OnInit, OnDestroy {
    @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();
    @Input() bannerData: any;

    language: any;
    role: string = '';
    thumbnail: string;
    memberid: number;
    displayError: boolean = false;
    displayPopup: boolean = false;
    responseMessage: string = null;
    userData: LoginDetails;
    dashboardNewsData: NewsType[];
    dashboardData: NewsType[];
    guestNews: NewsType[] = [];
    newsData: any;
    newsDetails: NewsType[] = [];
    newsDisplay: number;
    url: string;
    thumb: SafeUrl;
    proImage: SafeUrl;
    newImg: string;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    allowAdvertisment: any;
    headline_word_option: number = 0;
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
    };
    sliderOptionsOne: OwlOptions;
    currentPageNmuber: number = 1;
    totalPages: any
    itemPerPage: number = 4;
    newsTotalRecords: number = 0;
    showClubDash: boolean = true;
    newData: any;

    constructor(
        public authService: AuthServiceService,
        private lang: LanguageService,
        private router: Router,
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
        this.url = this.router.url;
        if (this.url == '/web/dashboard' || this.url == '/') {
            this.displayPopup = true;
            this.newsDisplay = 4;
            this.showClubDash = true;
        } else if (this.url == '/web/clubwall/club-news' || this.url == '/web/clubwall') {
            this.displayPopup = false;
            this.newsDisplay = 4;
            this.showClubDash = false;
        }
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.role = this.userData.roles[0];

        if (this.allowAdvertisment == 0) {
            this.getDesktopDeshboardBanner();
            setTimeout(() => {
                this.sliderOptionsOne = {
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
                };
            }, 1000);
        }
        this.getAllNews();
        this.getAllNewspagination();
    }

    /**
    * Function for get All the Banners
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {all the records of Banners} array of object
    */
    getDesktopDeshboardBanner() {
        console.log(this.bannerData);

        if (this.bannerData?.length > 0) {
            this.newsDisplay = 3;
        } else {
            // this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'getBannerForDashboard_Desktop/', null)
                .subscribe(
                    (respData: any) => {
                        // this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.bannerData = [];
                            this.bannerData = respData['result']['banner']
                            this.bannerData.forEach((element: any) => {
                                element['category'] = JSON.parse(element.category);
                                element['placement'] = JSON.parse(element.placement);
                                element['display'] = JSON.parse(element.display);
                                if (element.banner_image[0]?.banner_image) {
                                    element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0]?.banner_image.substring(20))) as string;
                                }
                                if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                    element['redirectLink'] = element.redirectLink;
                                } else {
                                    element['redirectLink'] = '//' + element.redirectLink;
                                }
                            })
                            if (this.allowAdvertisment == 0 && this.bannerData?.length > 0) {
                                this.newsDisplay = 3;
                                this.itemPerPage = 5;
                            }
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                )

        }
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
            //mobile
            displayMode = 1;
        } else {
            //desktop
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

    /**
    * Function is used to get top 5 news for user
    * @author  MangoIt Solutions
    * @param   {userId}
    * @return  {Object}
    */
    getAllNews() {
        if (sessionStorage.getItem('token')) {
            let userId: string = localStorage.getItem('user-id');
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'topNews/user/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.dashboardNewsData = respData;
                        console.log(this.dashboardNewsData);

                        if (this.dashboardNewsData && this.dashboardNewsData.length > 0) {
                            this.dashboardNewsData.forEach((element: any, index) => {
                                if (element?.news_image[0]?.news_image) {
                                    element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20)));
                                }
                                if (element.user.member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error: any) => {
                                                element.user.image = null;
                                            })
                                } else {
                                    element.user.image = '';
                                }
                            });
                            this.dataLoaded.emit();
                        }
                    }
                );
        }
    }

    getAllNewspagination() {
        (this.bannerData?.length == 0 || this.bannerData == undefined) ? this.itemPerPage = 5 : this.itemPerPage = 4;
        if (sessionStorage.getItem('token')) {
            this.dashboardData = [];
            this.guestNews = [];
            this.authService.setLoader(true);
            if (this.role == 'admin' || this.role == 'guest') {
                this.authService.memberSendRequest('get', 'posts/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                    .subscribe((respData: any) => {
                        this.authService.setLoader(false);
                        if (respData.news.length == 0) {
                            this.authService.setLoader(false);
                        } else {
                            this.newsTotalRecords = respData.pagination.rowCount;
                            this.totalPages = Math.ceil(this.newsTotalRecords / this.itemPerPage);
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
                                        // this.totalPages = respData.pagination.rowCount;
                                        this.newsTotalRecords = respData.pagination.rowCount;
                                        this.totalPages = Math.ceil(this.newsTotalRecords / this.itemPerPage);
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
                            // this.totalPages = respData.pagination.rowCount;
                            this.newsTotalRecords = respData.pagination.rowCount;
                            this.totalPages = Math.ceil(this.newsTotalRecords / this.itemPerPage);
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
                                        // this.totalPages = respData.pagination.rowCount;
                                        this.newsTotalRecords = respData.pagination.rowCount;
                                        this.totalPages = Math.ceil(this.newsTotalRecords / this.itemPerPage);

                                    }
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
        $('#exModal').modal('hide');
        this.newImg = '';
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-news-by-id/' + newsid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);

                        this.getFirstNews(respData);
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
                this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData?.news_image[0]?.news_image.substring(20)));
                this.newImg = this.newsData?.news_image[0]?.news_image;
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
                setTimeout(function () {
                    self.getAllNews()
                    self.getAllNewspagination()
                    const url: string[] = ["/web/clubwall"];
                    self.router.navigate(url);
                }, 3000);
            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            })
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId: number) {
        $('#exModal').modal('hide');
        const url: string[] = ["/web/update-news/" + newsId];
        this.router.navigate(url);
    }

    pageChanged(event: number) {
        if (event === -1) {
            // Previous button clicked
            this.currentPageNmuber--;
        } else if (event === 1) {
            // Next button clicked
            this.currentPageNmuber++;
        }
        this.getAllNewspagination();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
