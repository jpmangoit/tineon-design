import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RRule } from 'rrule';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {CreateAccess, EventsType, LoginDetails, ThemeType, UserAccess} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


@Component({
    selector: 'app-morganizer-events',
    templateUrl: './morganizer-events.component.html',
    styleUrls: ['./morganizer-events.component.css'],
    providers: [DatePipe]
})

export class MorganizerEventsComponent implements OnInit {
    activeClass: string = 'all';
    displayAll: boolean = true;
    displayToday: boolean = false;
    displayUpcoming: boolean = false;
    displayEvents: boolean = false;
    displayTickets: boolean = false;
    createAccess: CreateAccess;
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
    extensions: any;
    showActionBtn: boolean = false;

    All() {
        this.displayAll = true;
        this.displayToday = false;
        this.displayUpcoming = false;
        this.displayEvents = false;
        this.displayTickets = false;
    }

    Today() {
        this.displayAll = false;
        this.displayToday = true;
        this.displayUpcoming = false;
        this.displayEvents = false;
        this.displayTickets = false;
    }

    Upcoming() {
        this.displayAll = false;
        this.displayToday = false;
        this.displayUpcoming = true;
        this.displayEvents = false;
        this.displayTickets = false;
    }

    Eventstab() {
        this.displayAll = false;
        this.displayToday = false;
        this.displayUpcoming = false;
        this.displayEvents = true;
        this.displayTickets = false;
    }

    Tickets() {
        this.displayAll = false;
        this.displayToday = false;
        this.displayUpcoming = false;
        this.displayEvents = false;
        this.displayTickets = true;
    }
    constructor(private authService: AuthServiceService,
        private datePipe: DatePipe,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,

    ) { }


    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "all" : check == 2 ? "todayActive" : check == 3 ? "upcomingActive" : check == 4 ? "eventsActive" : check == 5 ? "ticketsActive" : "all";
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
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.extensions = appSetting.extensions;
        this.createAccess = this.userAccess[userRole].create;
        let currentUrl: string = this.router.url;
        // currentUrl == (('/organizer') || ('/clubwall/club-events')) ?  this.showActionBtn = true:  this.showActionBtn = false;
        // if(currentUrl == ('/organizer') || ('/clubwall/club-events')){
        if(currentUrl.includes('/organizer') || currentUrl.includes('/clubwall/club-events')){
            this.showActionBtn = true
        } else{
            this.showActionBtn = false;
        }

        if (currentUrl == '/clubwall/club-events') {
            this.calendarBtn = true;
        } else {
            this.calendarBtn = false;
        }


        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguageFile();
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
            this.authService.setLoader(true);
            let eventUrl: string;
            if (userRole == 'guest') {
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

                                    if (rules && rules.length > 0) {
                                        rules.forEach( (val, index) => {
                                            let yourDate: Date = new Date(val)
                                            let dt: string = yourDate.toISOString().split('T')[0];
                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time:any
                                            var recurring_etime:any

                                            if(recurring_dates){
                                                if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                    recurring_dates[0].start_time ;
                                                    recurring_dates[0].end_time;
                                                }else{
                                                    recurring_dates[0].start_time + ':00.000Z';
                                                    recurring_dates[0].end_time + ':00.000Z'
                                                }
                                                recurring_time = recurring_dates[0].start_time;
                                                recurring_etime = recurring_dates[0].end_time;
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate: string = dt + "T" + recurring_time;
                                            let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                            // let rrDate: string = dt + "T" + element.date_from.split("T")["1"];
                                            // let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let rrEvents: any = {
                                                "id": element.id,
                                                "type": element.type,
                                                "name": element.name,
                                                "event_image": (element?.event_images[0]?.event_image && element?.event_images[0]?.event_image != undefined) ? element.event_images[0]?.event_image : '../../../../assets/img/new-design/dashboard/event-img.png',
                                                "event_document": element?.event_images?.[0]?.event_document,
                                                "date_from": rrDate,
                                                "date_to": rrDateEnd,
                                                "description": element.description,
                                                "start_time": element.start_time,
                                                "end_time": element.end_time,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
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
                                                "show_guest_list": element.show_guest_list,
                                                "chargeable": element.chargeable,
                                                "price_per_participant": element.price_per_participant,
                                                "create_invoice": element.create_invoice,
                                                "group_id": element.group_id,
                                                "recurrence": element.recurrence,
                                                "group": element.group,
                                                "team_id": element.team_id,
                                                "date_repeat": element.date_repeat
                                            }
                                            this.eventList.push(rrEvents);
                                            if (dt == this.todays_date) {
                                                this.currentEvent.push(rrEvents);
                                                this.currentEventList.push(rrEvents);
                                            } else if (dt > this.todays_date) {
                                                this.upcomingEvent.push(rrEvents);
                                                this.upcomingEventList.push(rrEvents);
                                            }

                                        })
                                    }
                                } else {
                                    if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        JSON.parse(element.recurring_dates).forEach(dd => {
                                            let yourDate1: Date = new Date(dd.date_from);
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time:any
                                            var recurring_etime:any
                                            if(recurring_dates){
                                                if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                    recurring_dates[0].start_time ;
                                                    recurring_dates[0].end_time;
                                                }else{
                                                    recurring_dates[0].start_time + ':00.000Z';
                                                    recurring_dates[0].end_time + ':00.000Z'
                                                }
                                                recurring_time = recurring_dates[0].start_time;
                                                recurring_etime = recurring_dates[0].end_time;
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = dt1 + "T" + recurring_etime;
                                            // let rrDate1: string = dt1 + "T" + dd.start_time + ':00.000Z'
                                            // let rrDateEnd1: string = dt1 + "T" + dd.end_time + ':00.000Z';

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
                                            this.eventList.push(rrEvents1);
                                            if (dt1 == this.todays_date) {
                                                this.currentEvent.push(rrEvents1);
                                                this.currentEventList.push(rrEvents1);

                                            } else if (dt1 > this.todays_date) {
                                                this.upcomingEvent.push(rrEvents1);
                                                this.upcomingEventList.push(rrEvents1);
                                            }
                                        });

                                    } else {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        dates.forEach(dd => {
                                            let yourDate1: Date = new Date(dd)
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            let recurring_dates = element.recurring_dates;
                                            var recurring_time:any
                                            var recurring_etime:any
                                            if(recurring_dates){
                                                if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                    recurring_dates[0].start_time ;
                                                    recurring_dates[0].end_time;
                                                }else{
                                                    recurring_dates[0].start_time + ':00.000Z';
                                                    recurring_dates[0].end_time + ':00.000Z'
                                                }
                                                recurring_time = recurring_dates[0].start_time;
                                                recurring_etime = recurring_dates[0].end_time;
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                            // let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                            // let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];

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
                                            this.eventList.push(rrEvents1);
                                            if (dt1 == this.todays_date) {
                                                this.currentEvent.push(rrEvents1);
                                                this.currentEventList.push(rrEvents1);
                                            } else if (dt1 > this.todays_date) {
                                                this.upcomingEvent.push(rrEvents1);
                                                this.upcomingEventList.push(rrEvents1);
                                            }
                                        });
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
        this.router.navigate(['mobile/organizer']);
    }

    /**
    * Function to redirect the user with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    eventDetails(id: any, date: any) {
        this.router.navigate(['/mobile/event-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

    hasComma(str: string) {
        if(str){
            return str.replace(/,/g, ".");
        }else{
            return str;
        }
    }

}
