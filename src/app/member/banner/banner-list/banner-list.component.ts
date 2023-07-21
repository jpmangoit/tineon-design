import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';

@Component({
    selector: 'app-banner-list',
    templateUrl: './banner-list.component.html',
    styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {

    language: any;
    userRole: string;
    setTheme: ThemeType;
    banner: any
    private activatedSub: Subscription;
    currentPageNmuber: number = 1;
    itemPerPage: number = 10;
    totalBanners: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '10' },
        { value: '20' },
        { value: '30' },
        { value: '40' },
        { value: '50' },
    ];
    bannerDetail: any;
    bannerLists: any;

    constructor(
        private authService: AuthServiceService, private notificationService: NotificationService,
        private themes: ThemeService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,
        private lang: LanguageService, private confirmDialogService: ConfirmDialogService

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
        this.getAllBanners()
    }

    /**
    * Function for get All the Banners
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {all the records of Banners} array of object
    */
    getAllBanners() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'allBanners/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe(
                (respData: any) => {
                    console.log(respData);

                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.bannerLists = respData['result']['banner'];
                        console.log(this.bannerLists);

                        this.bannerLists.forEach((element: any) => {
                            element['category'] = JSON.parse(element.category);
                            element['placement'] = JSON.parse(element.placement);
                            element['display'] = JSON.parse(element.display);
                            // element['image'] = JSON.parse(element.image);
                            // console.log(element);

                            if (element?.banner_image[0]?.banner_image ) {
                                element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.banner_image?.[0].banner_image.substring(20))) as string;
                            }
                            if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                element['redirectLink'] = element.redirectLink;
                            } else {
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        });
                        this.totalBanners = respData['result'].pagination.rowCount;
                    }
                }
            )
    }


    /**
    * Function is used to change the page of pagination
    * @author  MangoIt Solutions(M)
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getAllBanners();
    }

    /**
    * Function is used to go to the page of pagination
    * @author  MangoIt Solutions(M)
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalBanners / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber,null);
            } else {
                this.currentPageNmuber = eve;
                this.getAllBanners();
            }
        }
    }

    /**
    * Function is used to set the page of pagination
    * @author  MangoIt Solutions(M)
    */
    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        this.getAllBanners();
    }

    /**
    * Function for delete the particular Banner by Id
    * @author  MangoIt Solutions(M)
    * @param   {Banner Id}
    * @return  {}
    */
    deleteBanner(bannerId: any) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_banner, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteBanner/' + bannerId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.ngOnInit();
                        }, 2000);
                    }
                )
        }, function () {
        })
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
