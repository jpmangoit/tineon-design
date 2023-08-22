import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NewsType } from 'src/app/models/news-type.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
declare var $: any;

@Component({
    selector: 'app-mall-news',
    templateUrl: './mall-news.component.html',
    styleUrls: ['./mall-news.component.css']
})
export class MallNewsComponent implements OnInit {

    scroll: boolean = false;
    language: any;
    role: string = '';
    responseMessage: string = null;

    currentPageNmuber: number = 1;
    itemPerPage: number = 10;
    newsTotalRecords: number = 0;
    guestNewsRecords: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' },
        { value: '40' },
        { value: '50' }
    ];
    thumbnails: string[] = [];
    memberid: number;
    thumb: string;
    thumbnail: string;
    userData: LoginDetails;
    dashboardData: any[] = [];
    guestNews: NewsType[] = [];
    newsData: NewsType;
    setTheme: ThemeType;
    newImg: string;
    allUser: any[]=[];
    alluserInformation:{member_id: number}[] = [];

    private activatedSub: Subscription;
    // @HostListener('window:scroll', ['$event']) // for window scroll events
    // onScroll(event) {
    // }
    constructor(
        private authService: AuthServiceService,
        private router: Router,
        private lang: LanguageService, private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer,
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
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userData.roles[0];
        this.getAllUserInfo();
        this.getAllNews();
    }

           /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
	getAllUserInfo() {
		this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userData.team_id, null)
		.subscribe(
			(respData: any) => {
                if(respData?.length > 0){
                    this.allUser = respData;
                    Object(respData).forEach((val, key) => {
                        this.alluserInformation[val.id] = { member_id: val.member_id };
                    });
                }
			}
		);
	}


    /**
    * Function to get all news records
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all News
    */
    getAllNews() {
        if (sessionStorage.getItem('token')) {
            this.dashboardData = [];
            this.guestNews = [];
            if (this.role == 'admin') {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'posts/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.newsTotalRecords = respData.pagination.rowCount;
                            this.dashboardData = respData.news;

                            this.dashboardData?.forEach(val => {
                                if (this.alluserInformation[val?.user?.id]?.member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.alluserInformation[val?.user?.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                // this.thumb = resppData;
                                                val.user.imagePro = resppData;
                                            },
                                            (error:any) => {
                                                val.user.imagePro = null;
                                            }
                                        );
                                } else {
                                    val.user.imagePro = null;
                                }
                                if (val?.news_image[0]?.news_image){
                                    val.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(val?.news_image[0]?.news_image.substring(20)));
                                }
                            });
                        });
            } else if (this.role == 'guest') {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'posts/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.newsTotalRecords = respData.pagination.rowCount;
                            this.guestNewsRecords = respData.pagination.rowCount;
                            this.dashboardData = respData.news;

                            if (this.dashboardData && this.dashboardData.length > 0) {
                                this.dashboardData.forEach(element => {
                                    if (element.user.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.authService.setLoader(false);
                                                    this.thumb = resppData;
                                                    element.user.imagePro = this.thumb;
                                                },
                                                (error:any) => {
                                                    element.user.imagePro = null;
                                                })
                                    } else {
                                        element.user.imagePro = '';
                                    }
                                    if (element?.news_image[0]?.news_image){
                                        element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20)));
                                    }

                                });
                            }
                            this.guestNews = [];
                            for (const key in this.dashboardData) {
                                if (Object.prototype.hasOwnProperty.call(this.dashboardData, key)) {
                                    const element = this.dashboardData[key];
                                    if (element.show_guest_list == 'true') {
                                        this.guestNews.push(element);
                                    }
                                }
                            }
                        });
            } else if ((this.role != 'admin') && (this.role != 'guest')) {
                let userId: string = localStorage.getItem('user-id');
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'news/user/' + userId, null)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.dashboardData = respData;
                            this.newsTotalRecords = this.dashboardData.length;
                            if (this.dashboardData && this.dashboardData.length > 0) {
                                this.dashboardData.forEach((element, index) => {
                                    if (element.user.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + element.user.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    element.user.imagePro = this.thumb;
                                                    this.authService.setLoader(false);
                                                },
                                                (error:any) => {
                                                    element.user.imagePro = null;
                                                })
                                    } else {
                                        element.user.imagePro = '';
                                    }
                                    if (element?.news_image[0]?.news_image){
                                        element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20)));
                                    }
                                });

                            }
                        }
                    );
            }
        }
    }

    /**
    * Function is used to get new details by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
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
        if (this.newsData.news_image[0]?.news_image == '' || this.newsData.news_image[0]?.news_image == null) {
            this.newImg = '../../assets/img/no_image.png';
        } else {
            if (this.newsData.news_image[0]?.news_image){
                this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData.news_image[0]?.news_image.substring(20)));
                this.newImg = this.newsData.news_image[0]?.news_image;
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
                (error:any) => {
                    this.thumbnail = null;
                }
            );
    }

    goBack() {
        window.history.back();
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
