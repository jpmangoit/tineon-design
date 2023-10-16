import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { EventsType } from 'src/app/models/events-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NewsType } from 'src/app/models/news-type.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { DatePipe } from '@angular/common';
import { RRule } from 'rrule';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-m-dashboard',
    templateUrl: './m-dashboard.component.html',
    styleUrls: ['./m-dashboard.component.css'],
    providers: [DatePipe]
})

export class MDashboardComponent implements OnInit {
    activeClass: string = 'all';
    displayAll: boolean = true;
    displayNews: boolean = false;
    displayEvents: boolean = false;
    displayGroups: boolean = false;
    language: any;
    userDetails: LoginDetails;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    clubNewsCount: number = 0;
    communityCount: number = 0;
    organizerCount: number = 0;
    userRespData: string;
    thumbnail: string;
    newsData: any;
    newImg: string;
    memberid: number;
    modalNews: any;
    groupData: any;
    displayGroup: boolean;
    displayJoinGroup: boolean;
    groupJoinData: any;
    currentEvent: EventsType[] = [];
    upcomingEvent: EventsType[] = [];
    userRole: string;
    all_events: EventsType[];
    date: Date;
    todays_date: string;
    eventList: EventsType[] = [];
    currentEventList: EventsType[] = [];
    upcomingEventList: EventsType[] = [];
    events: any;
    bannerData: any;
    adsTineon: any;
    userId: string
    allUser: any[] = [];
    alluserInformation: { member_id: number }[] = [];
    userInfo: any;
    All() {
        this.displayAll = true;
        this.displayNews = false;
        this.displayEvents = false;
        this.displayGroups = false;
    }

    News() {
        this.displayAll = false;
        this.displayNews = true;
        this.displayEvents = false;
        this.displayGroups = false;
    }

    Events() {
        this.displayAll = false;
        this.displayNews = false;
        this.displayEvents = true;
        this.displayGroups = false;
    }
    Groups() {
        this.displayAll = false;
        this.displayNews = false;
        this.displayEvents = false;
        this.displayGroups = true;
    }

    classToggled = false;
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
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
        nav: true
    }
    upcomingOption: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        margin: 10,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1.3
            },
            400: {
                items: 1.3
            },
            740: {
                items: 2.3
            },
            940: {
                items: 3.3
            }
        },
        nav: false
    }

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

    constructor(private lang: LanguageService,
        private themes: ThemeService,
        public authService: AuthServiceService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private notificationService: NotificationService,
        private datePipe: DatePipe,
        private confirmDialogService: ConfirmDialogService,
        private commonFunctionService: CommonFunctionService,
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
        this.userId = localStorage.getItem('user-id');
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));

        if (this.userDetails['qrcode_url']) {
            this.userDetails['qrcode_url'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.userDetails['qrcode_url'].substring(20)));
        }
        this.userRole = this.userDetails.roles[0];
        this.authService.memberSendRequest('get', 'numberOfPostEventsMessage/user/' + this.userId, null)
            .subscribe(
                (respData: any) => {
                    this.clubNewsCount = respData.result.posts;
                    this.organizerCount = respData.result.events;
                    this.communityCount = respData.result.message;
                }
            );
        this.getAllUserInfo();
        this.getUserImage();
        this.getAllNews();
        this.getEvent();
        this.joinAllGroups();
        this.getProfileData();
    }

    public toggleField() {
        this.classToggled = !this.classToggled;
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

    showAll() {
        if (sessionStorage.getItem('token') && window.innerWidth < 768) {
            //mobile
            this.router.navigate(['/mclub-all-news']);
        } else {
            //desktop
            this.router.navigate(['/clubwall-news/1']);
        }
    }


    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "all" : check == 2 ? "news" : check == 3 ? "events" : check == 4 ? "group" : "all";
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
                    }
                }
            );
    }

    /**
    * FUnction to get a login user image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object}  login user image
    */
    getUserImage() {
        if (sessionStorage.getItem('token')) {
            this.authService.memberInfoRequest('get', 'member-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.userDetails.member_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'].message, null);
                        } else {
                            this.userRespData = respData;
                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                            localStorage.setItem('profile-image', JSON.stringify(respData.changingThisBreaksApplicationSecurity));
                        }
                    }
                );
        }
    }


    /**
    * FUnction to get all the news
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the news
    */
    getAllNews() {
        this.newsData = [];
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'topNews/user/' + this.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.newsData = respData;
                        this.newsData.forEach(val => {
                            if (this.alluserInformation[val?.user?.id]?.member_id != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val?.user?.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            // this.thumb = resppData;
                                            val.user.imagePro = resppData;
                                        },
                                        (error: any) => {
                                            val.user.imagePro = null;
                                        }
                                    );
                            } else {
                                val.user.imagePro = null;
                            }
                            if (val?.news_image[0]?.news_image) {
                                val.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(val?.news_image[0]?.news_image.substring(20)));
                            }
                        });
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
        this.newImg = '';
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-news-by-id/' + newsid, null)
                .subscribe(
                    (respData: any) => {
                        this.modalNews = respData['result'];
                        if (this.modalNews?.news_image[0]?.news_image == '' || this.modalNews?.news_image[0]?.news_image == null) {
                            this.newImg = '../../assets/img/no_image.png';
                        } else {
                            if (this.modalNews?.news_image[0]?.news_image) {
                                this.modalNews.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.modalNews?.news_image[0]?.news_image.substring(20)));
                                this.newImg = this.modalNews?.news_image[0]?.news_image;
                            }
                        }
                        this.memberid = this.modalNews.user.member_id;
                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                            .subscribe(
                                (respData: any) => {
                                    this.authService.setLoader(false);
                                    this.thumbnail = respData;
                                },
                                (error: any) => {
                                    this.thumbnail = null;
                                });
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    getEvent() {
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
            this.currentEvent = [];
            this.upcomingEvent = [];
            this.userDetails = JSON.parse(localStorage.getItem('user-data'));
            if (this.userDetails['qrcode_url']) {
                this.userDetails['qrcode_url'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.userDetails['qrcode_url'].substring(20)));
            }

            this.userRole = this.userDetails.roles[0];
            this.authService.setLoader(true);
            let eventUrl: string;
            if (this.userRole == 'guest') {
                eventUrl = 'openevents/';
            } else {
                eventUrl = 'approvedEvents/user/' + this.userId;
            }

            this.authService.memberSendRequest('get', eventUrl, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.all_events = respData;
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        var element: any = null;

                        for (var key in respData) {
                            if (respData.hasOwnProperty(key)) {
                                element = respData[key];
                                if (element?.event_images[0]?.event_image) {
                                    element.event_images[0].event_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.event_images[0]?.event_image.substring(20)));
                                }
                                if (element && element.recurrence != '' && element.recurrence != null) {
                                    let recurrence: string = element.recurrence;
                                    if (recurrence.includes('UNTIL') == false) {
                                        recurrence = recurrence + ';UNTIL=' + nextYear;
                                    }
                                    recurrence = recurrence.replace("T000000Z;", "T200000Z;");
                                    recurrence = recurrence.slice(0, -1);
                                    let rule: RRule = RRule.fromString(recurrence)
                                    let rules: Date[] = rule.all();
                                    let self = this;
                                    if (rules && rules.length > 0) {
                                        rules.forEach(function (val, index) {
                                            let yourDate: Date = new Date(val)
                                            let dt: string = yourDate.toISOString().split('T')[0];

                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time: any
                                            var recurring_etime: any
                                            if (recurring_dates) {
                                                recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                            } else {
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate: string = dt + "T" + recurring_time;
                                            let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;

                                            // let rrDate: string = dt + "T" + element.date_from.split("T")["1"];
                                            // let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];

                                            let rrEvents: any = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "name": element.name,
                                                "event_image": (element?.event_images[0]?.event_image && element?.event_images[0]?.event_image != undefined) ? element.event_images[0]?.event_image : '../../../../assets/img/new-design/dashboard/event-img.png',
                                                "event_document": element?.event_images?.[0]?.event_document,
                                                "date_from": rrDate,
                                                "date_to": rrDateEnd,
                                                "place": element.place,
                                                "room": element.room,
                                                "visibility": element.visibility,
                                                "limitation_of_participants": element.limitation_of_participants,
                                                "participants": element.participants,
                                                "waiting_list": element.waiting_list,
                                                "max_on_waiting_list": element.max_on_waiting_list,
                                                "attachments": element.attachments,
                                                "link_to_ticket_store": element.link_to_ticket_store,
                                                "tags": element.tags,
                                                "author": element.author,
                                                "approved_status": element.approved_status,
                                                "audience": element.audience,
                                                "created_at": element.created_at,
                                                "updated_at": element.created_at,
                                                "coorganizer": element.coorganizer,
                                                "invite_friends": element.invite_friends,
                                                "description": element.description,
                                                "show_guest_list": element.show_guest_list,
                                                "chargeable": element.chargeable,
                                                "price_per_participant": element.price_per_participant,
                                                "create_invoice": element.create_invoice,
                                                "start_time": element.start_time,
                                                "end_time": element.end_time,
                                                "group_id": element.group_id,
                                                "recurrence": element.recurrence,
                                                "group": element.group,
                                                "team_id": element.team_id,
                                                "date_repeat": element.date_repeat
                                            }
                                            self.eventList.push(rrEvents);
                                            if (dt == self.todays_date) {
                                                self.currentEvent.push(rrEvents);
                                                self.currentEventList.push(rrEvents);
                                            } else if (dt > self.todays_date) {
                                                self.upcomingEvent.push(rrEvents);
                                                self.upcomingEventList.push(rrEvents);
                                            }
                                        })
                                    }
                                } else {
                                    if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        dates?.forEach((dd: any, index: any) => {
                                            let yourDate1: Date = new Date(dd)
                                            let dt1: string = yourDate1.toISOString().split('T')[0];

                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time: any
                                            var recurring_etime: any
                                            if (recurring_dates) {
                                                recurring_time = this.commonFunctionService.formatTime(recurring_dates[index]?.start_time);
                                                recurring_etime = this.commonFunctionService.formatTime(recurring_dates[index]?.end_time);
                                            } else {
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = dt1 + "T" + recurring_etime;


                                            // let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                            // let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let self = this;
                                            let rrEvents1: any = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "name": element.name,
                                                "event_image": (element?.event_images[0]?.event_image && element?.event_images[0]?.event_image != undefined) ? element.event_images[0]?.event_image : '../../../../assets/img/new-design/dashboard/event-img.png',
                                                "event_document": element?.event_images?.[0]?.event_document,
                                                "date_from": rrDate1,
                                                "date_to": rrDateEnd1,
                                                "place": element.place,
                                                "room": element.room,
                                                "visibility": element.visibility,
                                                "limitation_of_participants": element.limitation_of_participants,
                                                "participants": element.participants,
                                                "waiting_list": element.waiting_list,
                                                "max_on_waiting_list": element.max_on_waiting_list,
                                                "attachments": element.attachments,
                                                "link_to_ticket_store": element.link_to_ticket_store,
                                                "tags": element.tags,
                                                "author": element.author,
                                                "approved_status": element.approved_status,
                                                "audience": element.audience,
                                                "created_at": element.created_at,
                                                "updated_at": element.created_at,
                                                "coorganizer": element.coorganizer,
                                                "invite_friends": element.invite_friends,
                                                "description": element.description,
                                                "show_guest_list": element.show_guest_list,
                                                "chargeable": element.chargeable,
                                                "price_per_participant": element.price_per_participant,
                                                "create_invoice": element.create_invoice,
                                                "start_time": element.start_time,
                                                "end_time": element.end_time,
                                                "group_id": element.group_id,
                                                "recurrence": element.recurrence,
                                                "group": element.group,
                                                "team_id": element.team_id,
                                                "date_repeat": element.date_repeat
                                            }
                                            self.eventList.push(rrEvents1);
                                            if (dt1 == self.todays_date) {
                                                self.currentEvent.push(rrEvents1);
                                                self.currentEventList.push(rrEvents1);

                                            } else if (dt1 > self.todays_date) {
                                                self.upcomingEvent.push(rrEvents1);
                                                self.upcomingEventList.push(rrEvents1);
                                            }
                                        });

                                    } else {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        if (dates && dates.length > 0) {
                                            dates.forEach(dd => {
                                                let yourDate1: Date = new Date(dd)
                                                let dt1: string = yourDate1.toISOString().split('T')[0];
                                                let recurring_dates = JSON.parse(element.recurring_dates);
                                                var recurring_time: any
                                                var recurring_etime: any
                                                if (recurring_dates) {
                                                    recurring_time = this.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                    recurring_etime = this.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                                } else {
                                                    recurring_time = element.date_from.split("T")["1"]
                                                    recurring_etime = element.date_to.split("T")["1"];
                                                }
                                                let rrDate1: string = dt1 + "T" + recurring_time;
                                                let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;

                                                // let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                // let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                let self = this;
                                                let rrEvents1: any = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": element.type,
                                                    "name": element.name,
                                                    "event_image": (element?.event_images[0]?.event_image && element?.event_images[0]?.event_image != undefined) ? element.event_images[0]?.event_image : '../../../../assets/img/new-design/dashboard/event-img.png',
                                                    "event_document": element?.event_images?.[0]?.event_document,
                                                    "date_from": rrDate1,
                                                    "date_to": rrDateEnd1,
                                                    "place": element.place,
                                                    "room": element.room,
                                                    "visibility": element.visibility,
                                                    "limitation_of_participants": element.limitation_of_participants,
                                                    "participants": element.participants,
                                                    "waiting_list": element.waiting_list,
                                                    "max_on_waiting_list": element.max_on_waiting_list,
                                                    "attachments": element.attachments,
                                                    "link_to_ticket_store": element.link_to_ticket_store,
                                                    "tags": element.tags,
                                                    "author": element.author,
                                                    "approved_status": element.approved_status,
                                                    "audience": element.audience,
                                                    "created_at": element.created_at,
                                                    "updated_at": element.created_at,
                                                    "coorganizer": element.coorganizer,
                                                    "invite_friends": element.invite_friends,
                                                    "description": element.description,
                                                    "show_guest_list": element.show_guest_list,
                                                    "chargeable": element.chargeable,
                                                    "price_per_participant": element.price_per_participant,
                                                    "create_invoice": element.create_invoice,
                                                    "start_time": element.start_time,
                                                    "end_time": element.end_time,
                                                    "group_id": element.group_id,
                                                    "recurrence": element.recurrence,
                                                    "group": element.group,
                                                    "team_id": element.team_id,
                                                    "date_repeat": element.date_repeat
                                                }
                                                self.eventList.push(rrEvents1);
                                                if (dt1 == self.todays_date) {
                                                    self.currentEvent.push(rrEvents1);
                                                    self.currentEventList.push(rrEvents1);

                                                } else if (dt1 > self.todays_date) {
                                                    self.upcomingEvent.push(rrEvents1);
                                                    self.upcomingEventList.push(rrEvents1);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        this.upcomingEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
                        this.upcomingEventList.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));

                    }
                );
        }
    }

    /**
    * Function to get all the joined groups of clubs
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array of Object} all the groups
    */
    joinAllGroups() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'mv/web/get-groups-by-user-id/' + this.userId, null)
            .subscribe((respData: any) => {
                this.groupJoinData = respData.reverse();
                this.groupJoinData.forEach((element: any) => {
                    if (element.group_images[0]?.['group_image']) {
                        element.group_images[0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.group_images[0]?.['group_image'].substring(20)));
                    }
                })
                this.authService.setLoader(false);
            });
    }

    /**
    * Function is used to delete news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteNews(newsId: number) {
        $('#exModal').modal('hide');
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

    updateNews(newsId: number) {
        $('#exModal').modal('hide');
        this.router.navigate(["/update-news/" + newsId]);
    }

    /**
    * Function to redirect the user to event details with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    eventDetails(id: any, date: any) {
        this.router.navigate(['/event-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

    openbox(id: number) {
        if (id = 1) {
            $('.qr-info-main.profile-qr-box').addClass('open');
            $('.profile-inner-or').removeClass('show');
        } else if (id = 2) {
            $('.profile-inner-or').addClass('show');
            $('.qr-info-main.profile-qr-box').removeClass('open');
        }

    }

    openbox1() {
        $('.profile-inner-or').addClass('show');
        $('.qr-info-main.profile-qr-box').removeClass('open');
    }

    getProfileData() {
        if (sessionStorage.getItem('token')) {
            let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'member-info/' + userData.database_id + '/' + userData.team_id + '/' + userData.member_id, userData)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.userInfo = respData;

                });
        }
    }
}
