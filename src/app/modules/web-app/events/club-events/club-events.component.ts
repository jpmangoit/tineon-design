import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../../../service/language.service';
import { RRule } from 'rrule';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { EventsType } from 'src/app/models/events-type.model';
import { appSetting } from 'src/app/app-settings';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';

@Component({
    selector: 'app-club-events',
    templateUrl: './club-events.component.html',
    styleUrls: ['./club-events.component.css'],
    providers: [DatePipe]
})

export class ClubEventsComponent implements OnInit, OnDestroy {
    language: any;
    setTheme: ThemeType;
    userRole: string;
    date: Date;
    eventTypeList: { name: string, class: string }[] = [];
    eventTypeVisibility: { name: string }[] = [];
    userDetails: LoginDetails;
    all_events: EventsType[];
    todays_date: string;
    eventList: EventsType[] = [];
    currentEvent: EventsType[] = [];
    currentEventList: EventsType[] = [];
    upcomingEvent: EventsType[] = [];
    upcomingEventList: EventsType[] = [];
    private activatedSub: Subscription;
    calendarBtn: boolean = false;
    visibilityDropdownList: { item_id: number, item_text: string }[] = [];
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;

    constructor(
        private authService: AuthServiceService,
        private datePipe: DatePipe,
        private router: Router,
        private lang: LanguageService, private themes: ThemeService, private route: ActivatedRoute,
        private commonFunctionService: CommonFunctionService

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
        let userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        let currentUrl: string = this.router.url;
        if (currentUrl == '/clubwall/club-events') {
            this.calendarBtn = true;
        } else {
            this.calendarBtn = false;
        }
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.eventTypeList[1] = { name: this.language.create_event.club_event, class: "club-event-color" };
            this.eventTypeList[2] = { name: this.language.create_event.group_event, class: "group-event-color" };
            this.eventTypeList[3] = { name: this.language.create_event.functionaries_event, class: "functionaries-event-color" };
            this.eventTypeList[4] = { name: this.language.create_event.courses, class: "courses-event-color" };
            this.eventTypeList[5] = { name: this.language.create_event.seminar, class: "seminar-event-color" };

            this.eventTypeVisibility[1] = { name: this.language.create_event.public },
            this.eventTypeVisibility[2] = { name: this.language.create_event.private },
            this.eventTypeVisibility[3] = { name: this.language.create_event.group },
            this.eventTypeVisibility[4] = { name: this.language.create_event.club }

            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
            this.currentEvent = [];
            this.upcomingEvent = [];
            let userId: string = localStorage.getItem('user-id');
            this.userDetails = JSON.parse(localStorage.getItem('user-data'));
            this.userRole = this.userDetails.roles[0];
            this.authService.setLoader(true);
            let eventUrl: string;
            if (this.userRole == 'guest') {
                eventUrl = 'openevents/';
            } else {
                eventUrl = 'approvedEvents/user/' + userId;
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
                                var url: string[] = [];
                                if (element.picture_video != null && element.picture_video != '') {
                                    if (element.picture_video) {
                                        url = element.picture_video.split('"');
                                        if (url && url.length > 0) {
                                            url.forEach((el) => {
                                                if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                    element.picture_video = el;
                                                }
                                            });
                                        } else {
                                            element.picture_video = '';
                                        }
                                    }
                                }

                                if (element && element.recurrence && element.recurrence != '' && element.recurrence != null) {
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
                                            var recurring_time:any
                                            var recurring_etime:any
                                            if(recurring_dates){
                                                recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate: string = dt + "T" + recurring_time;
                                            let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                            // let rrDate: string = dt + "T" + element.date_from.split("T")["1"];
                                            // let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let rrEvents: EventsType = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "name": element.name,
                                                "picture_video": element.picture_video,
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
                                        JSON.parse(element.recurring_dates).forEach((dd:any,index:any) => {
                                            let yourDate1: Date = new Date(dd.date_from);
                                            let dt1: string = yourDate1.toISOString().split('T')[0];

                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time:any
                                            var recurring_etime:any
                                            if(recurring_dates){
                                                recurring_time = this.commonFunctionService.formatTime(recurring_dates[index].start_time);
                                                recurring_etime = this.commonFunctionService.formatTime(recurring_dates[index].end_time);
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = dt1 + "T" + recurring_etime;
                                            // let rrDate1: string = dt1 + "T" + dd.start_time + ':00.000Z'
                                            // let rrDateEnd1: string = dt1 + "T" + dd.end_time + ':00.000Z';

                                            let self = this;
                                            let rrEvents1: EventsType = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "name": element.name,
                                                "picture_video": element.picture_video,
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
                                                var recurring_time:any
                                                var recurring_etime:any
                                                if(recurring_dates){
                                                    recurring_time = this.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                    recurring_etime = this.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                                }else{
                                                    recurring_time = element.date_from.split("T")["1"]
                                                    recurring_etime = element.date_to.split("T")["1"];
                                                }
                                                let rrDate1: string = dt1 + "T" + recurring_time;
                                                let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                                // let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                // let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                let self = this;
                                                let rrEvents1: EventsType = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": element.type,
                                                    "name": element.name,
                                                    "picture_video": element.picture_video,
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
     * Function is used to redirect to organizer page
     * @author  MangoIt Solutions
     */
    redirectCalendar() {
        var self = this;
        self.router.navigate(['organizer']);
    }

    /**
    * Function to redirect the user with date parameter
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

}
