import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { LanguageService } from '../../../service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { NotificationService } from 'src/app/service/notification.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LoginDetails } from 'src/app/models/login-details.model';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-community-groups',
    templateUrl: './community-groups.component.html',
    styleUrls: ['./community-groups.component.css'],
})

export class CommunityGroupsComponent implements OnInit, OnDestroy {
    language: any;
    groupData: CommunityGroup[] = [];
    groupJoinData: CommunityGroup[];
    groupsYouManageData: CommunityGroup[];
    setTheme: ThemeType;
    displayGroup: boolean = true;
    displayJoinGroup: boolean;
    private activatedSub: Subscription;
    user_Id: any;
    bannerData: any;
    sliderOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
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
    }
    userDetails: LoginDetails;
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
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        if (this.allowAdvertisment  == 0 ){
            this.getDesktopAllGroupBanner();
        }
        this.user_Id = localStorage.getItem('user-id');

        this.language = this.lang.getLanguaageFile();
        this.teamAllGroups();
        this.joinAllGroups();
        this.groupsYouManage();

        var getParamFromUrl: string = this.router.url.split("/")['2'];
        setTimeout(() => {
            if (getParamFromUrl == 'groups-joined') {
                this.onGroups(2);
            }
        }, 2000);
    }

    /**
     * Function for get All the Banners
     * @author  MangoIt Solutions(M)
     * @param   {}
     * @return  {all the records of Banners} array of object
     */
    getDesktopAllGroupBanner() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForAllGroup_Desktop/', null)
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
                            if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                element['redirectLink'] = element.redirectLink;
                            } else {
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        })
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            )
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
                console.log(respData);
            })
    }

    /**
     * Function to get all the groups of clubs
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {Array of Object} all the groups
     */
    teamAllGroups() {
        this.authService.setLoader(true);
        this.groupData = [];
        this.authService.memberSendRequest('get', 'getGroupsNotParticipantPagination/user/' + this.user_Id + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe((respData: any) => {
                this.groupData = respData['result']['group'];
                this.totalgroupData = respData['result']['pagination']['rowCount'];
                this.authService.setLoader(false);
            });
    }

    /**
    * Function to get all the joined groups of clubs
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array of Object} all the groups
    */
    joinAllGroups() {
        this.authService.setLoader(true);
        this.groupJoinData = [];
        this.authService.memberSendRequest('get', 'web/get-groups-by-user-id/' + this.user_Id, null)
            .subscribe((respData: any) => {
                this.groupJoinData = respData.reverse();
                // this.totalJoinedGroupData = this.groupJoinData.length;
                this.authService.setLoader(false);
            });
    }

    /**
    * Function to get all the created group by particular user
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array of Object} all the groups
    */
    groupsYouManage() {
        this.authService.setLoader(true);
        this.groupsYouManageData = [];
        this.authService.memberSendRequest('get', 'getGroupsYouManage/' + this.user_Id, null).subscribe((respData: any) => {
            this.groupsYouManageData = respData.reverse();
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

    /**
    * Function is used to join the group by a participant
    * @author  MangoIt Solutions
    * @param   {GroupId}
    * @return  {}
    */
    joinGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(
            this.language.community_groups.join_group_popup,
            function () {
                let postData: object = {
                    participants: {
                        group_id: groupId,
                        user_id: self.user_Id,
                        approved_status: 2,
                    },
                };
                self.authService.setLoader(true);
                self.authService.memberSendRequest('post', 'joinGroup/user_id/' + self.user_Id + '/group_id/' + groupId, postData)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.teamAllGroups();
                            self.joinAllGroups();
                        }, 3000);
                    });
            },
            function () { }
        );
    }

    /**
    * Function is used to leave the group by a participant
    * @author  MangoIt Solutions
    * @param   {GroupId}
    * @return  {}
    */
    leaveGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.leave_group_popup,function () {
                self.authService.setLoader(true);
                self.authService.memberSendRequest('delete', 'leaveGroup/user/' + self.user_Id + '/group_id/' + groupId, null)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.teamAllGroups();
                            self.joinAllGroups();
                        }, 3000);
                    });
            },
            function () { }
        );
    }

    /**
     * Function is used to delete group
     * @author  MangoIt Solutions
     * @param   {GroupId}
     * @return  {}
     */
    deleteGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.delete_group_popup, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteGroup/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.joinAllGroups();
                        }, 2000);
                    }
                )
        }, function () {
        })
    }

    /**
   * Function is used to change the page of pagination
   * @author  MangoIt Solutions(M)
   */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.teamAllGroups();
    }

    /**
    * Function is used to go to the page of pagination
    * @author  MangoIt Solutions(M)
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
    * @author  MangoIt Solutions(M)
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
