import { Component, OnInit } from '@angular/core';
import { CrmNews } from 'src/app/models/crm-news.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ParticipateAccess,UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-crm-news',
    templateUrl: './crm-news.component.html',
    styleUrls: ['./crm-news.component.css']
})

export class CrmNewsComponent implements OnInit {
    language :any;
    userData:LoginDetails;
    role:string= '';
    currentPageNmuber: number = 1;
    itemPerPage:number = 8;
    totalDashboardData: number = 0;
    limitPerPage :{value: string}[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' },
        { value: '40' }
    ];
    dashboardData:CrmNews[] = [];
    newsData :CrmNews;
    participateAccess: ParticipateAccess;
    userAccess: UserAccess;

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userData.roles[0];
        this.userAccess = appSetting.role;
        this.participateAccess = this.userAccess[this.role].participate;
        if (this.participateAccess.crm_news == 'Yes'){
            this.getAllNews();
        }
    }


    /**
    * Function to get all news records
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all News
    */
    getAllNews() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-all-crmnews/' + this.currentPageNmuber + '/pagesize/' + this.itemPerPage , null)
            .subscribe(
                (respData: CrmNews) => {
                    if (respData.isError == false) {
                        this.authService.setLoader(false);
                        this.dashboardData = respData.result.news[0];
                        this.totalDashboardData = respData.result.news[1]['pagination']['rowCount'];
                    } else if (respData.isError == true) {
                        this.notificationService.showError(respData.result,null);
                    }
                }
            );
        }
    }

    /**
    * Function to get news detail of particular news
    * @author  MangoIt Solutions
    * @param   {NewsId}
    * @return  {Array Of Object}  News record
    */
    getNewsDetails(newsid:number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-crm-newsbyid/' + newsid, null)
            .subscribe(
                (respData: CrmNews) => {
                    this.authService.setLoader(false);
                    this.newsData = respData.result.news;
                    $('#exModal').modal('show');
                }
            );
        }
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
            if (eve > Math.round(this.totalDashboardData / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber,null);
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

}
