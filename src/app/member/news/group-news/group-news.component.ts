import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NewsGroup } from 'src/app/models/community-group.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NewsType } from 'src/app/models/news-type.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-group-news',
    templateUrl: './group-news.component.html',
    styleUrls: ['./group-news.component.css']
})

export class GroupNewsComponent implements OnInit {
    language: any;
    userData:LoginDetails;
    role:string = '';
    thumbnail: string;
    memberid: number;
    setTheme: ThemeType;
    groupNewsData:NewsGroup[];
    guestGroupNews:NewsGroup[] = [];
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
            let theme :ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
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
            this.authService.memberSendRequest('get', 'get-group-news-by-user-id/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        this.groupNewsData = respData['result'];
                        if (this.role == 'guest') {
                            this.guestGroupNews = [];
                            for (const key in this.groupNewsData) {
                                if (Object.prototype.hasOwnProperty.call(this.groupNewsData, key)) {
                                    const element: NewsGroup = this.groupNewsData[key];
                                    if (element.news['show_guest_list'] == 'true') {
                                        this.guestGroupNews.push(element);
                                    }
                                }
                            }
                        }
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
                        this.getFirstNews(respData);
                        this.authService.setLoader(false);
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
    getFirstNews(allNews:NewsType) {
        let news:NewsType = allNews['result'];
        this.newsData = news;
        if(this.newsData.imageUrls == '' || this.newsData.imageUrls == null){
            this.groupNewsImg = '../../assets/img/no_image.png';
        }else{
            if (this.newsData?.['imageUrls']){
                this.newsData['imageUrls'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData['imageUrls'].substring(20)));
                this.groupNewsImg = this.newsData.imageUrls;
            }
        }
        this.newsTitle = this.newsData.title
        this.memberid = this.newsData.user.member_id;
        this.authService.memberInfoRequest('get', 'profile-photo?database_id='+this.userData.database_id+'&club_id='+this.userData.team_id+'&member_id=' + this.memberid, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                this.thumbnail = respData;
            },
            (error:any) => {
                this.thumbnail = null;
            });
    }

    /**
    * Function is used to redirect on update news page
    * @author  MangoIt Solutions
    */
    updateNews(newsId: number) {
        $('#exModal1').modal('hide');
        const url: string[] = ["/update-news/" + newsId];
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
                const url: string[] = ["/clubwall"];
                self.router.navigate(url);
            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            });
    }

    removeHtml(str:any) {
        var tmp: HTMLElement = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    showToggle: boolean = false;
    showToggles:boolean = false;
    onShow(){
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
        if(!this.showToggle){
            this.showToggle = true;
            el[0].className = "bunch_drop show";
        }
        else{
            this.showToggle = false;
            el[0].className = "bunch_drop";
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
