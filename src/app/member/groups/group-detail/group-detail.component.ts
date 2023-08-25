import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { LanguageService } from '../../../service/language.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { ClubDetail, LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { UpdateConfirmDialogService } from 'src/app/update-confirm-dialog/update-confirm-dialog.service';
import { DenyReasonConfirmDialogService } from 'src/app/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrls: ['./group-detail.component.css']
})

export class GroupDetailComponent implements OnInit {
    language: any;
    currentPageNmuber: number = 1;
    itemPerPage: number = 8;
    newsTotalRecords: number = 0;
    tasksTotalRecords: number = 0;
    eventsTotalRecords: number = 0;
    limitPerPage: { value: string }[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' }, 
        { value: '40' }
    ];
    displayError: boolean;
    userId: any;
    profile_data: ProfileDetails;
    memberStartDateStatus: Date;
    birthdateStatus: boolean;
    userDetails: LoginDetails
    getclubInfo: ClubDetail;
    thumb: string;
    thumbnail: string;
    setTheme: ThemeType;
    // groupDetails: CommunityGroup[];
    groupDetails: any;
    alluserInformation: { member_id: number }[] = [];
    private activatedSub: Subscription;
    groupNewsDetails: any;
    groupTasksDetails: any;
    groupEventsDetails: any;
    groupAction: number = 0;
    updatedGroupData: any;
    updatedGroupAction: number;
    updatedGroupNewsDetails: any;
    updatedNewsTotalRecords: number;
    organizerDetails: any[] = [];
    groupParticipnts: any[] = [];
    updatedOrganizerDetails: any[] = [];
    updatedGroupParticipnts: any[] = [];
    invited: boolean = false;
    notInvited: boolean = false;
    private refreshPage: Subscription;
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    isShow: boolean = false;
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
        autoplay: true
    }
    bannerData: any;
    mobBannerData: any;
    adsTineon: any;
    allUser: any[] = [];
    allowAdvertisment: any;
    groupId: any;
    imageURL: SafeUrl;
    displayNews: boolean = true;
    displayTasks: boolean = false;
    displayEvents: boolean = false;


    constructor(
        private authService: AuthServiceService,
        private router: Router,
        private route: ActivatedRoute,
        private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private lang: LanguageService,
        private updateConfirmDialogService: UpdateConfirmDialogService,
        private denyReasonService: DenyReasonConfirmDialogService,
        private notificationService: NotificationService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) {
        this.refreshPage = this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });
        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp => {
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

        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.allowAdvertisment = localStorage.getItem('allowAdvertis');
        this.language = this.lang.getLanguaageFile();
        this.userId = localStorage.getItem('user-id');
        this.getAllUserInfo();
        this.route.params.subscribe(params => {
            const groupid: number = params['groupid'];
            this.groupId = groupid;
        });

        if (this.allowAdvertisment == 0) {
            if (sessionStorage.getItem('token') && window.innerWidth < 768) {
                this.getMobileGroupsDetailBanners()
            } else {
                this.getDesktopGroupsDetailBanners()
            }
        }
    }

    onTabChange(id: number) {
        $('.tab-pane').removeClass('active');
        $('.nav-link').removeClass('active');
        if (id == 1) {
            this.getGroupNews(this.groupId);
            this.displayNews = true;
            this.displayTasks = false;
            this.displayEvents = false;
            $('#tabs-1').show();
            $('#tabs-2').hide();
            $('#tabs-3').hide();
            $('#tabs-1').addClass('active');
            $('.news_ic').addClass('active');
        } else if (id == 2) {
            this.getGroupTasks(this.groupId);
            this.displayTasks = true;
            this.displayNews = false;
            this.displayEvents = false;
            $('#tabs-1').hide();
            $('#tabs-2').show();
            $('#tabs-3').hide();
            $('#tabs-2').addClass('active');
            $('.tasks_ic').addClass('active');
        } else {
            this.getGroupEvents(this.groupId);
            this.displayEvents = true;
            this.displayNews = false;
            this.displayTasks = false;
            $('#tabs-1').hide();
            $('#tabs-2').hide();
            $('#tabs-3').show();
            $('#tabs-3').addClass('active');
            $('.events_ic').addClass('active');
        }
    }

    /**
    * Function is used for getting all the Desktop Notifications for Banner
    * @author  MangoIt Solutions(M)
    * @param   {}
    * @return  {Object}
    */
    getDesktopGroupsDetailBanners() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForGroupDetails_Desktop/', null)
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
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            )
    }

    /**
  * Function is used for getting all the Mobile Notifications for Banner
  * @author  MangoIt Solutions(M)
  * @param   {}
  * @return  {Object}
  */
    getMobileGroupsDetailBanners() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getBannerForGroupDetailsMobileApp/', null)
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
                            if ((element['redirectLink'].includes('https://')) || (element['redirectLink'].includes('http://'))) {
                                element['redirectLink'] = element.redirectLink;
                            } else {
                                element['redirectLink'] = '//' + element.redirectLink;
                            }
                        })
                        this.timeOut1();
                    } else if (respData['code'] == 400) {
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
            user_id: this.userId,
            display_mode: displayMode
        }
        this.authService.memberSendRequest('post', 'bannerClick/', data)
            .subscribe((respData: any) => {
                //console.log(respData);
            })
    }

    /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
    getAllUserInfo() {
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData && respData.length > 0) {
                        this.allUser = respData;
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                            
                        })
                        this.getGroupDetails(this.groupId);
                    }
                }
            );
    }

    /**
   * Function to used get the records of the particular group
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {Array Of Object} all the Users
   */
    getGroupDetails(groupid: number) {
        if (sessionStorage.getItem('token')) {
            this.organizerDetails = [];
            this.groupParticipnts = [];
            //this.groupDetails = [];
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + groupid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groupDetails = respData[0];
                        // this.groupDetails.groupTaskCount = 0
                        
                        if(this.groupDetails?.groupEventCount != 0){
                            this.onTabChange(3);
                        }
                        if(this.groupDetails?.groupTaskCount != 0){
                            this.onTabChange(2);
                        }

                        if(this.groupDetails?.groupNewsCount != 0){
                            this.onTabChange(1);
                        } 
                     
                        this.groupAction = 0;
                        let count = 0;
                        if (this.groupDetails?.['group_images'][0]?.['group_image']) {
                            this.groupDetails['group_images'][0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.groupDetails?.['group_images'][0]?.['group_image'].substring(20)));
                        }

                        if (this.groupDetails && this.groupDetails['participants']) {
                            Object(this.groupDetails['participants']).forEach((val, key) => {
                                if (this.alluserInformation?.[val.user_id]?.member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.user_id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                val.imagePro = this.thumb;
                                            },
                                            (error: any) => {
                                                val.imagePro = null;
                                            }
                                        );
                                } else {
                                    val.imagePro = null;
                                }
                                if (val.user_id == this.groupDetails['created_by']) {
                                    this.organizerDetails.push(val)
                                } else {
                                    this.groupParticipnts.push(val);
                                }
                                if (val.user_id.toString() == this.userId && val.approved_status == 1) {
                                    this.groupAction = 1;
                                    // this.getGroupNews(groupid);
                                }
                                if (this.groupDetails['approved_status'] == 1) {
                                    if (val.user_id == this.userId) {
                                        count = 1;
                                    }
                                    if (count == 1) {
                                        if ((val.user_id == this.userId && val.approved_status == 0)) {
                                            this.invited = true;
                                            this.notInvited = false;

                                        } else if ((val.user_id == this.userId && val.user_id == this.groupDetails['created_by']) || (val.user_id == this.userId && val.approved_status == 1)) {
                                            this.invited = false;
                                            this.notInvited = false;
                                        }
                                    } else if (count != 1) {
                                        this.notInvited = true;
                                        this.invited = false;
                                    }
                                    if ((val.user_id == this.userId && val.approved_status == 2)) {
                                        this.notInvited = false;
                                    }
                                }
                            });

                            this.organizerDetails = Object.assign(this.authService.uniqueObjData(this.organizerDetails, 'id'));
                            this.groupParticipnts = Object.assign(this.authService.uniqueObjData(this.groupParticipnts, 'id'));
                            if (this.groupDetails['created_by'] == this.userDetails.userId || this.userDetails.roles[0] == 'admin') {
                                this.updatedGroupData = JSON.parse(this.groupDetails['updated_record']);
                                if (this.updatedGroupData?.file) {
                                    this.updatedGroupData.file = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updatedGroupData?.file.substring(20)));
                                }
                                if (this.updatedGroupData != null) {
                                    this.updatedOrganizerDetails = [];
                                    this.updatedGroupParticipnts = [];
                                    this.updatedGroupData['participants'] = JSON.parse(this.updatedGroupData['participants']);
                                    if (this.updatedGroupData['participants'] && this.updatedGroupData['participants'].length > 0) {
                                        Object(this.updatedGroupData['participants']).forEach((val, key) => {
                                            if (this.allUser?.length > 0) {
                                                this.allUser.forEach(el => {
                                                    if (el.id == val.user_id) {
                                                        val.user = el;
                                                        if (val.user.member_id != null) {
                                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + val.user.member_id, null)
                                                                .subscribe(
                                                                    (resppData: any) => {
                                                                        this.thumb = resppData;
                                                                        val.user.image = this.thumb
                                                                    },
                                                                    (error: any) => {
                                                                        val.user.image = null;
                                                                    });
                                                        } else {
                                                            val.user.image = null;
                                                        }
                                                    }
                                                });
                                            }
                                            if (val.user_id == this.updatedGroupData['created_by']) {
                                                this.updatedOrganizerDetails.push(val)
                                            } else {
                                                this.updatedGroupParticipnts.push(val);
                                            }
                                        });
                                    }
                                    this.updatedGroupAction = 0;
                                    for (const key in this.updatedGroupData['participants']) {
                                        if (Object.prototype.hasOwnProperty.call(this.updatedGroupData['participants'], key)) {
                                            const element: any = this.updatedGroupData['participants'][key];
                                            if ((element.user_id.toString() == this.userId && element.approved_status == 1) || this.userDetails.isAdmin) {
                                                this.updatedGroupAction = 1;
                                                this.getUpdatedGroupNews(groupid);
                                            }
                                        }
                                    }
                                    this.updatedGroupData['participantsCount'] = this.updatedGroupData['participants'].length;
                                }
                                this.updatedOrganizerDetails = Object.assign(this.authService.uniqueObjData(this.updatedOrganizerDetails, 'id'));
                                // this.updatedGroupParticipnts = Object.assign(this.authService.uniqueObjData(this.updatedGroupParticipnts,'id'));
                            }
                        } else {
                            this.notificationService.showError(this.language.community_groups.no_groups, null);
                        }
                    }
                );
        }
    }

    /**
   * Function to get group news of particular group
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {Array Of Object}
   */
    getGroupNews(groupid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            // /api/groupNews/groupId/:id/:page/:pageSize
            this.authService.memberSendRequest('get', 'groupNews/groupId/' + groupid + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groupNewsDetails = respData.groupNews;
                        this.groupNewsDetails.forEach((element: any) => {
                            if (element?.['news_image'][0]?.['news_image']) {
                                element['news_image'][0]['news_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.['news_image'][0]?.['news_image'].substring(20)));
                            }
                        });
                        this.newsTotalRecords = respData.pagination.rowCount;

                        this.getProfileImages(this.groupNewsDetails);
                    }
                );
        }
    }


    /**
    * Function to get group news of particular updated group
    * @author  MangoIt Solutions
    * @param   {GroupId}
    * @return  {Array Of Object}
    */
    getUpdatedGroupNews(groupid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            // this.authService.memberSendRequest('get', 'groupNews/groupId/' + groupid, null)
            this.authService.memberSendRequest('get', 'groupNews/groupId/' + groupid + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.updatedNewsTotalRecords = respData.groupNews.length;
                        this.updatedGroupNewsDetails = respData;
                        if (this.updatedNewsTotalRecords != 0) {
                            this.getProfileImages(this.updatedGroupNewsDetails);
                        }

                    }
                );
        }

    }

    /**
    * Function to get group tasks of particular group
    * @author  MangoIt Solutions
    * @param   {GroupId}
    * @return  {Array Of Object}
    */
    getGroupTasks(groupid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            // /api/getGroupTask/ByGroudId/:group_id/:page/:pageSize
            this.authService.memberSendRequest('get', 'getGroupTask/ByGroudId/' + groupid + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groupTasksDetails = respData?.groupTask;
                        this.groupTasksDetails.forEach(val => {
                            if (val?.['task_image'][0]?.['task_image']) {
                                val['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(val?.['task_image'][0]?.['task_image'].substring(20)));
                            }
                            if (this.alluserInformation[val?.userstask?.id]?.member_id != null) {

                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val?.userstask?.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            val.userstask.imagePro = resppData;

                                        },
                                        (error: any) => {
                                            val.userstask.imagePro = null;
                                        }
                                    );
                            } else {
                                val.userstask.imagePro = null;
                            }
                        });
                        this.tasksTotalRecords = respData.pagination.rowCount;
                        // this.getProfileImages(this.groupTasksDetails);
                    }
                );
        }
    }

    /**
    * Function to get group events of particular group
    * @author  MangoIt Solutions
    * @param   {GroupId}
    * @return  {Array Of Object}
    */
    getGroupEvents(groupid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            // /api/getGroupsEvents/ByGroudId/:group_id/:page/:pageSize
            this.authService.memberSendRequest('get', 'getGroupsEvents/ByGroudId/' + groupid + '/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groupEventsDetails = respData?.groupEvents;
                        this.groupEventsDetails.forEach((element: any) => {
                            if (element?.['event_images'][0]?.['event_image']) {
                                element['event_images'][0]['event_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.['event_images'][0]?.['event_image'].substring(20)));
                            }
                        });
                        this.eventsTotalRecords = respData.pagination.rowCount;
                        this.getProfileImages(this.groupEventsDetails);
                    }
                );
        }
    }


    /**
   * Function to get profile images
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {Array Of Object}
   */
    getProfileImages(usersAllData: any) {
        usersAllData?.forEach(val => {
            if (this.alluserInformation[val?.user?.id]?.member_id != null) {
                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val?.user?.id].member_id, null)
                    .subscribe(
                        (resppData: any) => {
                            val.user.imagePro = resppData;

                        },
                        (error: any) => {
                            val.user.imagePro = null;
                        }
                    );
            }
            else {
                val.user.imagePro = null;
            }
            // if (val?.['news_image'][0]?.['news_image']) {
            //     val['news_image'][0]['news_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(val?.['news_image'][0]?.['news_image'].substring(20)));
            // }
        });

        return usersAllData;
    }

    /**
   * Function is used to accept the group
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {}
   */
    approvedGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_group, function () {
            self.authService.memberSendRequest('get', 'approve-group-by-id/' + groupId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
* Function is used to accept the group
* @author  MangoIt Solutions
* @param   {GroupId}
* @return  {}
*/
    unapproveGroup(groupId: number) {
        let self = this;
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userId
            };
            self.authService.memberSendRequest('put', 'adminDenyGroup/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
* Function is used to accept the updated group
* @author  MangoIt Solutions
* @param   {GroupId}
* @return  {}
*/
    acceptUpdatedGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.publish_article, function () {
            self.authService.memberSendRequest('get', 'approve-updatedGroupByAdmin/group_id/' + groupId + '/' + self.userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        this.getGroupDetails(groupId)
                    }
                )
        }, function () {
        })
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
                        self.notificationService.showSuccess(respData.result.message, null);
                        self.router.navigate(['community/groups-joined']);
                    }
                )
        }, function () {
        })
    }

    /**
   * Function is used to delete the updated group
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {}
   */
    deleteUpdateGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.delete_group_popup, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('get', 'get-reset-updatedGroupDetails/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.router.navigate(['group-detail/' + groupId]);
                        self.getGroupDetails(groupId)
                    }
                )
        }, function () {
        }, 'deleteUpdate')
    }

    /**
* Function is used to accept the group by a participant
* @author  MangoIt Solutions
* @param   {GroupId}
* @return  {}
*/
    acceptGroup(groupId: number) {   //notification
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.accept_group, function () {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": self.userId,
                    "approved_status": 1
                }
            };
            self.authService.memberSendRequest('put', 'acceptGroup/user/' + self.userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
   * Function is used to reject the group by a participant
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {}
   */
    rejectGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            self.authService.memberSendRequest('delete', 'denyGroup/user/' + self.userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
* Function is used to join the group by a participant
* @author  MangoIt Solutions
* @param   {GroupId}
* @return  {}
*/
    joinGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.join_group_popup, function () {
            let postData: object = {
                "participants": {
                    "group_id": groupId,
                    "user_id": self.userId,
                    "approved_status": 2
                }
            };
            self.authService.setLoader(false);
            self.authService.memberSendRequest('post', 'joinGroup/user_id/' + self.userId + '/group_id/' + groupId, postData)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.ngOnInit();
                        }, 3000);

                    }
                )
        }, function () {
        })
    }

    /**
* Function is used to leave the group by a participant
* @author  MangoIt Solutions
* @param   {GroupId}
* @return  {}
*/
    leaveGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.leave_group_popup, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'leaveGroup/user/' + self.userId + '/group_id/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(() => {
                            self.ngOnInit();
                        }, 3000);
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
        this.thumbnail = '';
        $("#profileSpinner").show();
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumbnail = resp.thumbnail
                this.displayError = resp.displayError
                $("#profileSpinner").hide();
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

    goBack() {
        localStorage.setItem('backItem', 'groups');
        this.router.navigate(['/community/groups']);
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    pageChanged(event: number) {
        this.currentPageNmuber = event;
        this.getGroupNews(this.groupId);
        this.getUpdatedGroupNews(this.groupId);
        this.getGroupTasks(this.groupId);
        this.getGroupEvents(this.groupId);
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    goToPg(eve: number) {
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        }
        this.currentPageNmuber = eve;
        this.getGroupNews(this.groupId);
        this.getUpdatedGroupNews(this.groupId);
        this.getGroupTasks(this.groupId);
        this.getGroupEvents(this.groupId);
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
        this.getGroupNews(this.groupId);
        this.getUpdatedGroupNews(this.groupId);
        this.getGroupTasks(this.groupId);
        this.getGroupEvents(this.groupId);

    }

    getNewsDetails(news_id: number) {
        this.router.navigate(['clubnews-detail/' + news_id]);
    }

    getTasksDetails(task_id: number) {
        this.router.navigate(['task-detail/' + task_id]);
    }

    getEventsDetails(event_id: number) {
        this.router.navigate(['event-detail/' + event_id]);
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
