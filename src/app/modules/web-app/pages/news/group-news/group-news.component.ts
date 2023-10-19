import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { logging } from 'protractor';
import {LoginDetails, NewsGroup, NewsType, ThemeType} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';


declare var $: any;

@Component({
    selector: 'app-group-news',
    templateUrl: './group-news.component.html',
    styleUrls: ['./group-news.component.css']
})

export class GroupNewsComponent implements OnInit {
    @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();

    language: any;
    userData: LoginDetails;
    role: string = '';
    thumbnail: string;
    memberid: number;
    setTheme: ThemeType;
    groupNewsData: NewsGroup[];
    guestGroupNews: NewsGroup[] = [];
    newsData: NewsType;
    newsTitle: string;
    groupNewsImg: string;
    private activatedSub: Subscription;

    constructor(
        private authService: AuthServiceService,
        private router: Router, private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService, private themes: ThemeService,
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
        this.getAllNews();
    }

    /**
    * Function is used to get all group news
    * @author  MangoIt Solutions
    * @param   {userId}
    * @return  {Object}
    */
    getAllNews() {
        if (sessionStorage.getItem('token')) {
            let userId: string = localStorage.getItem('user-id');
            // this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-group-news-by-user-id/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.groupNewsData = respData['result'];
                        this.groupNewsData.forEach((groupNewsItem: any) => {
                            if (groupNewsItem?.news?.news_image[0]?.news_image) {
                                groupNewsItem.news.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(groupNewsItem?.news?.news_image[0]?.news_image.substring(20))) as string;
                            }
                            if (groupNewsItem?.news?.user) {
                                if (groupNewsItem?.news?.user?.member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + groupNewsItem?.news?.user.member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                let thumb = resppData;
                                                groupNewsItem.news.user.image = thumb;
                                            },
                                            (error: any) => {
                                                groupNewsItem.news.user.image = null;
                                            })
                                } else {
                                    groupNewsItem.news.user.image = '';
                                }
                            }
                        });
                        this.dataLoaded.emit();

                        this.authService.setLoader(false);
                        // if (this.role == 'guest') {
                        //     this.guestGroupNews = [];
                        //     for (const key in this.groupNewsData) {
                        //         if (Object.prototype.hasOwnProperty.call(this.groupNewsData, key)) {
                        //             const element: NewsGroup = this.groupNewsData[key];
                        //             if (element.news['show_guest_list'] == 'true') {
                        //                 this.guestGroupNews.push(element);
                        //             }
                        //         }
                        //     }
                        // }


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
        this.groupNewsImg = '';
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
   * Function is used to get new details by news Id
   * @author  MangoIt Solutions
   * @param   {newsId}
   * @return  {Object}
   */
    getFirstNews(allNews: NewsType) {
        let news: NewsType = allNews['result'];
        this.newsData = news;

        if (this.newsData.news_image[0]?.news_image == '' || this.newsData.news_image[0]?.news_image == null) {
            this.groupNewsImg = '../../assets/img/no_image.png';
        } else {
            if (this.newsData?.news_image[0]?.news_image) {
                this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData?.news_image[0]?.news_image.substring(20))) as string;
                this.groupNewsImg = this.newsData?.news_image[0]?.news_image;
            }

        }
        this.newsTitle = this.newsData.title
        this.memberid = this.newsData.user.member_id;
        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.memberid, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.thumbnail = respData;
                },
                (error: any) => {
                    this.authService.setLoader(false);
                    this.thumbnail = null;
                }

            );
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId: number) {
        $('#exModal1').modal('hide');
        const url: string[] = ["/web/update-news/" + newsId];
        this.router.navigate(url);
    }

    /**
    * Function is used to delete news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteNews(newsId: number) {
        $('#exModal1').modal('hide');
        let self = this;
        this.commonFunctionService.deleteNews(newsId)
            .then((resp: any) => {
                self.notificationService.showSuccess(resp, null);
                self.getAllNews()
                const url: string[] = ["/web/clubwall"];
                self.router.navigate(url);
            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            });
    }

    removeHtml(str: any) {
        var tmp: HTMLElement = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    showToggle: boolean = false;
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

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
