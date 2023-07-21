import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Location } from '@angular/common';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';


@Component({
    selector: 'app-banner-detail',
    templateUrl: './banner-detail.component.html',
    styleUrls: ['./banner-detail.component.css']
})
export class BannerDetailComponent implements OnInit {
    language: any;
    setTheme: ThemeType;
    banner: any
    private activatedSub: Subscription;
    bannerDetail: any;
    showImage: any;
    selectedCategory: any[] = [];
    bannerCategoryOption: { name: string, value: string }[];
    bannerPlacementOption: { name: any; value: string; }[];
    selectedPlacement: any[] = [];
    bannerDisplayOption: { name: any; id: string; }[];
    selectedDisplayed: any[] = [];

    constructor(
        private themes: ThemeService,
        private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private router: Router,
        private _location: Location,
        private authService: AuthServiceService,
        private route: ActivatedRoute,
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

        this.route.params.subscribe(params => {
            const bannerId: number = params['bannerId'];
            this.getBannerById(bannerId);
        })

        this.bannerCategoryOption = [
            { name: this.language.banner.app_sponsor, value: '1' },
            { name: this.language.banner.sponsor, value: '2' },
            { name: this.language.banner.free_space, value: '3' },
        ];

        this.bannerPlacementOption = [
            { name: this.language.banner.dashboard, value: '1' },
            { name: this.language.banner.all_news, value: '2' },
            { name: this.language.banner.news_details, value: '3' },
            { name: this.language.banner.all_groups, value: '4' },
            { name: this.language.banner.groups_details, value: '5' },
        ];

        this.bannerDisplayOption = [
            { name: this.language.banner.mobile_app, id: '1' },
            { name: this.language.banner.desktop, id: '2' },
            { name: this.language.banner.notification_section, id: '3' },
            { name: this.language.banner.everywhere, id: '4' },
        ];
    }

    /**
    * Function for get Banner detail by Id
    * @author  MangoIt Solutions(M)
    * @param   {Banner Id}
    * @return  {Banner Detail} array of object
    */
    getBannerById(id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerbyId/' + id, null)
            .subscribe(
                (respData: any) => {
                    console.log(respData);

                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.bannerDetail = respData['result']


                            this.bannerDetail['category'] = JSON.parse(this.bannerDetail.category);
                            this.bannerDetail['placement'] = JSON.parse(this.bannerDetail.placement);
                            this.bannerDetail['display'] = JSON.parse(this.bannerDetail.display);
                            // this.bannerDetail['image'] = JSON.parse(this.bannerDetail.image);

                            if (this.bannerDetail.banner_image[0].banner_image ) {
                                this.bannerDetail.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.bannerDetail.banner_image[0].banner_image.substring(20))) as string;
                                this.showImage =  this.bannerDetail.banner_image[0].banner_image
                            }

                            if ((this.bannerDetail['redirectLink'].includes('https://')) || (this.bannerDetail['redirectLink'].includes('http://'))) {
                                this.bannerDetail['redirectLink'] = this.bannerDetail.redirectLink;
                            } else {
                                this.bannerDetail['redirectLink'] = '//' + this.bannerDetail.redirectLink;
                            }

                        // this.bannerDetail.forEach((element: any) => {
                        //     element['category'] = JSON.parse(element.category);
                        //     element['placement'] = JSON.parse(element.placement);
                        //     element['display'] = JSON.parse(element.display);
                        //     // element['image'] = JSON.parse(element.image);

                        //     if (element.banner_image[0].banner_image ) {
                        //         element.banner_image[0].banner_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.banner_image[0].banner_image.substring(20))) as string;
                        //         this.showImage =  element.banner_image[0].banner_image
                        //     }

                        //     if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                        //         element['redirectLink'] = element.redirectLink;
                        //     } else {
                        //         element['redirectLink'] = '//' + element.redirectLink;
                        //     }

                        // })

                        this.bannerDetail['category'].forEach((element: any) => {
                            this.bannerCategoryOption.forEach((elem: any) => {
                                if (element == elem.value) {
                                    this.selectedCategory.push(elem);
                                }
                            })
                        });

                        this.bannerDetail['placement'].forEach((element: any) => {
                            this.bannerPlacementOption.forEach((elem: any) => {
                                if (element == elem.value) {
                                    this.selectedPlacement.push(elem);
                                }
                            })
                        });

                        this.bannerDetail['display'].forEach((element: any) => {
                            this.bannerDisplayOption.forEach((elem: any) => {
                                if (element == elem.id) {
                                    this.selectedDisplayed.push(elem);
                                }
                            })
                        });
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            )
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
                        const url: string[] = ["/banner-list"];
                        self.router.navigate(url);
                    }
                )
        }, function () {
        })
    }

    /**
    * Function  for display Hamburger Menu
    */
    showToggle: boolean = false;
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

    goBack() {
        this.router.navigate(['/banner-list']);
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
