import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogService } from '../../../update-confirm-dialog/update-confirm-dialog.service';
import { Location } from '@angular/common';
import { LanguageService } from '../../../service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ClubDetail, LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { NewsType } from 'src/app/models/news-type.model';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { DenyReasonConfirmDialogService } from 'src/app/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-club-news-details',
    templateUrl: './club-news-details.component.html',
    styleUrls: ['./club-news-details.component.css'],
})

export class ClubNewsDetailsComponent implements OnInit,OnDestroy {
    language:any;
    userDetails:LoginDetails;
    newsData:NewsType;
    updateNewsData:any;
    viewImage: boolean = false;
    displayError:boolean = false
    getclubInfo: ClubDetail;
    profile_data: ProfileDetails;
    thumbnail:string;
    memberid: number;
    birthdateStatus: boolean;
    memberStartDateStatus: Date;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    private refreshPage:Subscription
    private denyRefreshPage:Subscription
    private removeUpdate:Subscription
    responseMessage: any;
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
        autoplay:true
    }
    bannerData: any;
    mobBannerData: any;
    adsTineon: any;
    allowAdvertisment: any;
    isShow: boolean = false;

    constructor(
        private authService: AuthServiceService,
        private router: Router,
        private route: ActivatedRoute, private themes: ThemeService,
        private _location: Location,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private commonFunctionService: CommonFunctionService,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer

    ) {
        this.refreshPage =  this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp =>{
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        });
        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp =>{
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        })
     }

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
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.route.params.subscribe(params => {
            const newsid:number = params['newsid'];
            this.getNewsDetails(newsid);
        });

        if (this.allowAdvertisment  == 0 ){
            if (sessionStorage.getItem('token') && window.innerWidth < 768) {
                this.getMobileNewsDetailBanners();
            } else {
                this.getDesktopNewsDetailBanners();
            }
        }
    }

      /**
    * Function for get All the Banners
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {all the records of Banners} array of object
    */
    getDesktopNewsDetailBanners(){
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForNewsDetails_Desktop/', null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.bannerData = respData['result']['banner']
                    this.bannerData.forEach((element: any) => {
                        element['category'] = JSON.parse(element.category);
                        element['placement'] = JSON.parse(element.placement);
                        element['display'] = JSON.parse(element.display);
                        // element['image'] = JSON.parse(element.image);
                        if (element.banner_image[0]?.banner_image) {
                            element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0]?.banner_image.substring(20)));
                        }

                        if((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))){
                            element['redirectLink'] = element.redirectLink;
                        }else{
                            element['redirectLink'] = '//' + element.redirectLink;
                        }
                    })
                }else  if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            }
        )
    }

      /**
    * Function for get All the Banners
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {all the records of Banners} array of object
    */
    getMobileNewsDetailBanners(){
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForNewsDetailsMobileApp/', null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.mobBannerData = respData['result']['banner']
                    this.mobBannerData.forEach((element: any) => {
                        element['category'] = JSON.parse(element.category);
                        element['placement'] = JSON.parse(element.placement);
                        element['display'] = JSON.parse(element.display);
                        // element['image'] = JSON.parse(element.image);
                        if (element.banner_image[0]?.banner_image) {
                            element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0]?.banner_image.substring(20)));
                        }
                        if((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))){
                            element['redirectLink'] = element.redirectLink;
                        }else{
                            element['redirectLink'] = '//' + element.redirectLink;
                        }
                    })
                    this.timeOut1();
                }else  if (respData['code'] == 400) {
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
    onClickBanner(bannerId:number){
        let displayMode:number
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            //mobile
            displayMode = 1 ;
        }else{
            //desktop
            displayMode = 0 ;
        }
        let data = {
            banner_id: bannerId,
            user_id : this.userDetails.userId,
            display_mode : displayMode
        }
        this.authService.memberSendRequest('post','bannerClick/',data)
        .subscribe((respData:any) =>{
        })
    }

    /**
    * Function is used to get new details by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  {Object}
    */
    getNewsDetails(newsid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-news-by-id/' + newsid, null)
                .subscribe(
                    (respData: any) => {
                        if (respData['isError'] == false && Object.keys(respData.result).length > 0) {
                            this.getFirstNews(respData);
                        } else {
                            this.notificationService.showError(this.language.community_groups.no_news, null);
                        }
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
        if (this.newsData?.['imageUrls']){
            this.newsData['imageUrls'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData['imageUrls'].substring(20)));
        }

        this.memberid = this.newsData.user.member_id;
            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.thumbnail = respData;
                    },
                    (error:any) => {
                        this.thumbnail = null;
                    });
        if (this.newsData['author'] == JSON.parse(this.userDetails.userId) || this.userDetails.roles[0] == 'admin') {
            this.updateNewsData = JSON.parse(news.updated_record);
        }
    }

    /**
    * Function is used to delete news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteNews(newsId: number) {
        let self = this;
        this.commonFunctionService.deleteNews(newsId)
            .then((resp: any) => {
                self.notificationService.showSuccess(resp, null);
                const url: string[] = ["/clubwall"];
                self.router.navigate(url);
            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            });
    }

    /**
    * Function is used to delete update news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteUpdateNews(newsId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_article, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('get', 'get-reset-updatednews/' + newsId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        const url: string[] = ["/clubwall"];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        }, 'deleteUpdate')
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId:number) {
        const url: string[] = ["/update-news/" + newsId];
        this.router.navigate(url);
    }

    /**
    * Function is used to aprove news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    approveNews(newsId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-news-by-id/' + newsId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        const url: string[] = ["/clubwall"];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to aprove update news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    approveUpdteNews(newsId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-updatednews/' + newsId, null)
                .subscribe(
                    (respData: any) => {
                        const url: string[] = ["/clubwall"];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to deny news by news Id by admin
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    denyNews(newsId: number) {
        let self = this;
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_article, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-news/news_id/' + newsId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemId(id: number) {
        let self = this;
        $("#profileSpinner").show();
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumbnail = resp.thumbnail
                this.displayError = resp.displayError
            })
            .catch((err: any) => {
                console.log(err);
            })
    }

    showToggle: boolean = false;
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

    removeHtml(str) {
        var tmp: HTMLElement = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    goBack() {
        this.router.navigate(['/clubwall']);
    }


    toggleDisplay() {
        this.isShow = !this.isShow;
    }


    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
        this.refreshPage.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
    }
}
