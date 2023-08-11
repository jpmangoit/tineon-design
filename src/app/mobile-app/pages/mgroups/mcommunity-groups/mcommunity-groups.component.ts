import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CommunityGroup, } from 'src/app/models/community-group.model';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-mcommunity-groups',
    templateUrl: './mcommunity-groups.component.html',
    styleUrls: ['./mcommunity-groups.component.css']
})
export class McommunityGroupsComponent implements OnInit {

    language: any;
    groupData: CommunityGroup[];
    groupJoinData: CommunityGroup[];
    groupsYouManageData: CommunityGroup[];
    setTheme: ThemeType;
    responseMessage: string;
    displayGroup: boolean = true;
    displayJoinGroup: boolean;
    private activatedSub: Subscription;
    user_Id: any;
    activeClass: string = 'Groupsm';
    displayGroups: boolean = true;
    displayManagegroup: boolean = false;
    bannerData: any;
    adsTineon: any;
    isShow: boolean = false;
    userData: any;
    allowAdvertisment: any;
    currentPageNmuber: number = 1;
    itemPerPage: number = 8;
    totalgroupData: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' },
    ];

    constructor(
        private authService: AuthServiceService,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private themes: ThemeService,
        private router: Router,
        private notificationService: NotificationService,
        private tostrNotificationService: NotificationService,
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
        this.user_Id = localStorage.getItem('user-id');
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.language = this.lang.getLanguaageFile();

        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            this.getTineonBanners();
        }
        this.teamAllGroups();
        this.joinAllGroups();
        this.groupsYouManage();
    }

    /**
  * Function for get All the Banners
  * @author  MangoIt Solutions(M)
  * @param   {}
  * @return  {all the records of Banners} array of object
  */
    getTineonBanners() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForAllGroupMobileApp/', null)
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
                            if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                element['redirectLink'] = element.redirectLink;
                            } else {
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        })
                        this.timeOut1();
                    } else if (respData['code'] == 400) {
                        this.tostrNotificationService.showError(respData['message'], null);
                    }
                })
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

    toggleDisplay() {
        this.isShow = !this.isShow;
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
            user_id: this.user_Id,
            display_mode: displayMode
        }
        this.authService.memberSendRequest('post', 'bannerClick/', data)
            .subscribe((respData: any) => {
                // console.log(respData);
            })
    }

    /**
     * Function to get all the groups of clubs
     * Date: 14 Mar 2023
     * @author  MangoIt Solutions (R)
     * @param   {}
     * @return  {Array of Object} all the groups
     */
    teamAllGroups() {
        let userId: string = localStorage.getItem('user-id');
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getGroupsNotParticipantPagination/user/' + this.user_Id + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe((respData: any) => {
                this.groupData = respData['result']['group'];
                this.groupData.forEach((element:any) => {
                    if (element.group_images[0]?.['group_image']) {
                        element.group_images[0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.group_images[0]?.['group_image'].substring(20)));
                    }
                })
                this.totalgroupData = respData['result']['pagination']['rowCount'];
                this.authService.setLoader(false);
            });
    }

    joinAllGroups() {
        let userId: string = localStorage.getItem('user-id');
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'web/get-groups-by-user-id/' + userId, null)
            .subscribe((respData: any) => {
                this.groupJoinData = respData.reverse();
                this.groupJoinData.forEach((element:any) => {
                    if (element.group_images[0]?.['group_image']) {
                        element.group_images[0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.group_images[0]?.['group_image'].substring(20)));
                    }
                })
                this.authService.setLoader(false);
            });
    }

    groupsYouManage() {
        let userId: string = localStorage.getItem('user-id');
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getGroupsYouManage/' + userId, null).subscribe((respData: any) => {
            this.groupsYouManageData = respData.reverse();
            this.groupsYouManageData.forEach((element:any) => {
                if (element.group_images[0]?.['group_image']) {
                    element.group_images[0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.group_images[0]?.['group_image'].substring(20)));
                }
            })
            this.authService.setLoader(false);
        });
    }

    onGroups(id: number) {
        $('.tab-pane').removeClass('active');
        $('.nav-link').removeClass('active');
        if (id == 1) {
            this.displayGroup = true;
            this.displayJoinGroup = false;

            $('#tabs-1').show();
            $('#tabs-2').hide();
            $('#tabs-1').addClass('active');
            $('.group_ic').addClass('active');
        } else {
            this.displayJoinGroup = true;
            this.displayGroup = false;

            $('#tabs-1').hide();
            $('#tabs-2').show();
            $('#tabs-2').addClass('active');
            $('.per_ic').addClass('active');
        }
    }

    joinGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(
            this.language.community_groups.join_group_popup,
            function () {
                let userId: string = localStorage.getItem('user-id');
                let postData: object = {
                    participants: {
                        group_id: groupId,
                        user_id: userId,
                        approved_status: 2,
                    },
                };
                self.authService.setLoader(true);
                self.authService.memberSendRequest('post', 'joinGroup/user_id/' + userId + '/group_id/' + groupId, postData)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = respData['result']['message'];
                        self.notificationService.showSuccess(self.responseMessage, null);
                        setTimeout(() => {
                            // self.responseMessage = '';
                            self.teamAllGroups();
                            self.joinAllGroups();
                        }, 3000);
                    });
            },
            function () { }
        );
    }

    leaveGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(
            this.language.community_groups.leave_group_popup,
            function () {
                let userId: string = localStorage.getItem('user-id');
                self.authService.setLoader(true);
                self.authService.memberSendRequest('delete', 'leaveGroup/user/' + userId + '/group_id/' + groupId, null)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = respData['result']['message'];
                        self.notificationService.showSuccess(self.responseMessage, null);
                        setTimeout(() => {
                            // self.responseMessage = '';
                            self.teamAllGroups();
                            self.joinAllGroups();
                        }, 3000);
                    });
            },
            function () { }
        );
    }

    deleteGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.delete_group_popup, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteGroup/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = respData['result']['message'];
                        self.notificationService.showSuccess(self.responseMessage, null);
                        setTimeout(() => {
                            // self.responseMessage = '';
                            self.joinAllGroups();
                        }, 2000);
                    }
                )
        }, function () {
        })
    }

    onGroup() {
        this.displayGroups = true;
        this.displayManagegroup = false;
    }

    onManagegroups() {
        this.displayGroups = false;
        this.displayManagegroup = true;
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "Groupsm" : check == 2 ? "Managegroup" : "Groupsm";
    }

    /**
    * Function is used to change the page of pagination
    * @author  MangoIt Solutions(R)
    */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.teamAllGroups();
    }

    /**
    * Function is used to go to the page of pagination
    * @author  MangoIt Solutions(R)
    */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalgroupData / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                this.teamAllGroups();
            }
        }
    }

    /**
    * Function is used to set the page of pagination
    * @author  MangoIt Solutions(R)
    */
    setItemPerPage(limit: number) {
        if (isNaN(limit)) {
            limit = this.itemPerPage;
        }
        this.itemPerPage = limit;
        this.teamAllGroups();
    }


    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
