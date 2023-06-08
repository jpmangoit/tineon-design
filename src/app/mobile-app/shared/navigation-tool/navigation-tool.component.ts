import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { ActionToolComponent } from '../action-tool/action-tool.component';
import { MnotificationComponent } from '../mnotification/mnotification.component';
import { SettingToolComponent } from '../setting-tool/setting-tool.component';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-navigation-tool',
    templateUrl: './navigation-tool.component.html',
    styleUrls: ['./navigation-tool.component.css']
})

export class NavigationToolComponent implements OnInit {
    isShow = false;
    isShowTineon = false;
    Clicked: boolean;
    step: any = 'step1';
    step2: any;
    step3: any;
    step4: any;
    showNotifications: string[] = [];
    showNotificationsss: string[] = [];
    language: any;
    advertisement: any;
    ads: any;
    userDetails: LoginDetails;
    bannerData: any;
    adsTineon: any;
    allowAdvertisment: any;

    constructor(private _bottomSheet: MatBottomSheet,private tostrNotificationService: NotificationService,private router:Router,
        private notificationService: NotificationsService, private lang: LanguageService,private authService:AuthServiceService) { }

    openBottomSheet(): void {
        this._bottomSheet.open(ActionToolComponent);
    }

    openSettingSheet(): void {
        this._bottomSheet.open(SettingToolComponent);
    }

    openNotification(): void {
        this._bottomSheet.open(MnotificationComponent);
    }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.showNotificationsss = this.notificationService.getNotifications();
        setTimeout(() => {
            this.showNotifications = this.showNotificationsss.sort(function (a: any, b: any) {
                return <any>new Date(b.created_at) - <any>new Date(a.created_at);
            });
        }, 3000);
        this.getAdvertisement();
        let currentUrl:string = this.router.url;
        if(currentUrl == '/dashboard'){
            this.getTineonBanners();
        }
    }

    onClick(check) {
        if (check == 1) {
            this.step = 'step1';
        } else if (check == 2) {
            this.step = 'step2';
        } else if (check == 3) {
            this.step = 'step3';
        } else {
            this.step = 'step4';
        }

    }

    onSwitch(check) {
        switch (check) {
            case 1:
                return 'step1';
            case 2:
                return 'step2';
            case 3:
                return 'step3';
            case 4:
                return 'step4';
        }
    }

    toggleDisplay() {
        this.isShow = !this.isShow;
    }

    toggleDisplayTineon() {
        this.isShowTineon = !this.isShowTineon;
    }

    getAdvertisement() {
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-all-crmadvertisement', null)
                .subscribe(
                    (respData: any) => {
                        if (respData.isError == false) {
                            this.authService.setLoader(false);
                            this.advertisement = respData.result.advertisement;
                            this.timeOut();
                        }
                    }
            );
        }
    }

    timeOut() {
        let count = 0;
        setInterval(() => {
            if (count === this.advertisement.length) {
                count = 0;
            }
            this.ads = this.advertisement[count];
            count++;
        }, 3000);
      }

    /**
    * Function for get All the Banners
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {all the records of Banners} array of object
    */
    getTineonBanners(){
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForDashboardMobileApp/', null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.bannerData = respData['result']['banner']
                    this.bannerData.forEach((element: any) => {
                        element['category'] = JSON.parse(element.category);
                        element['placement'] = JSON.parse(element.placement);
                        element['display'] = JSON.parse(element.display);
                        element['image'] = JSON.parse(element.image);
                        if((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))){
                            element['redirectLink'] = element.redirectLink;
                        }else{
                            element['redirectLink'] = '//' + element.redirectLink;
                        }
                    })
                    this.timeOut1();
                }else  if (respData['code'] == 400) {
                    this.tostrNotificationService.showError(respData['message'], null);
                }
            })
        }
    }

    timeOut1() {
        let count = 0;
        setInterval(() => {
            if (count === this.bannerData.length) {
                count = 0;
            }
            this.adsTineon = this.bannerData[count];
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

}
