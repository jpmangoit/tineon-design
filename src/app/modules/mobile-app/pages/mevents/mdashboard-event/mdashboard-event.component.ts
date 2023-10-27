import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import { RRule } from 'rrule';
import { Subscription } from 'rxjs';
import {EventsType, LoginDetails, ThemeType} from '@core/models';
import {AuthService, CommonFunctionService, LanguageService, ThemeService} from '@core/services';

declare var $: any;

@Component({
    selector: 'app-mdashboard-event',
    templateUrl: './mdashboard-event.component.html',
    styleUrls: ['./mdashboard-event.component.css'],
    providers: [DatePipe]
})
export class MdashboardEventComponent implements OnInit {

    language: any;
    calendarClicked: boolean = false;
    calendarEventClicked: boolean = false;
    calendarOptions: CalendarOptions;
    calendarOptionsTimeGrid: CalendarOptions;
    userDetails: LoginDetails;
    userRole: string;
    thumbnail: string;
    name: string = "";
    auth_name: string = "";
    date: Date;
    todays_date: string;
    selectLanguage: string;
    eventList: EventsType[] = [];
    currentEvent: EventsType[] = [];
    currentEventList: EventsType[] = [];
    upcomingEvent: EventsType[] = [];
    upcomingEventList: EventsType[] = [];
    newClickedEvent: EventApi;
    allData: EventsType[] = [];
    calendarEvents: any[] = [];
    clickedEventData: any[] = [];
    setTheme: ThemeType;
    eventTypeList: { name: string, class: string }[] = [];
    private activatedSub: Subscription;
    showEventList = false;
    showCalendar = true;
    courseList: any[] = [];
    allCourses: any[];

    constructor(
        private authService: AuthService,
        private datePipe: DatePipe,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
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

        this.selectLanguage = localStorage.getItem('language');
        if(this.selectLanguage  == 'sp'){
            this.selectLanguage = 'es'
        }
        this.language = this.lang.getLanguageFile();
        this.eventTypeList[1] = { name: this.language.create_event.club_event, class: "club-event-color" };
        this.eventTypeList[2] = { name: this.language.create_event.group_event, class: "group-event-color" };
        this.eventTypeList[3] = { name: this.language.create_event.functionaries_event, class: "functionaries-event-color" };
        this.eventTypeList[4] = { name: this.language.create_event.courses, class: "courses-event-color" };
        this.eventTypeList[5] = { name: this.language.create_event.seminar, class: "seminar-event-color" };

        if (sessionStorage.getItem('token')) {
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
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
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        var element: any = null;
                        for (var key in respData) {
                            if (respData.hasOwnProperty(key)) {
                                element = respData[key];
                                var url: string[] = [];
                                for (const key in element) {
                                    if (Object.prototype.hasOwnProperty.call(element, key)) {
                                        const value: any = element[key];
                                        if (key == 'picture_video' && value != null) {
                                            url = value.split('\"');
                                        }
                                    }
                                }
                                if (url && url.length > 0) {
                                    element['picture_video'] = url[1];

                                } else {
                                    element['picture_video'] = '';
                                }
                                this.allData[key] = element;
                                if (element && element.recurrence != '' && element.recurrence != null) {
                                    let recurrence: string = element.recurrence;
                                    if (recurrence.includes('UNTIL') == false) {
                                        recurrence = recurrence + ';UNTIL=' + nextYear;
                                    }
                                    if (recurrence.includes('T000000Z;')) {
                                        recurrence = recurrence.replace("T000000Z;", "T200000Z;");
                                        recurrence = recurrence.slice(0, -1);
                                    }
                                    var DTSTART = element.date_from.split('T')[0].replace(/-/gi, '') + "T000000Z";
                                    recurrence = recurrence + ';DTSTART=' + DTSTART;
                                    if (recurrence.includes(';UNTIL=20230725T200000Z;DTSTART=20220719T000000Z')) {
                                    }
                                    let rule: any = RRule.fromString(recurrence)
                                    let rules: Date[] = rule.all();
                                    if (rules && rules.length > 0) {
                                        rules.forEach((val, index) => {
                                            let yourDate: Date = new Date(val)
                                            let dt: string = yourDate.toISOString().split('T')[0];
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
                        const sortByDate = (arr: EventsType[]) => {
                            const sorter = (a: EventsType, b: EventsType) => {
                                return new Date(a.date_from).getTime() - new Date(b.date_from).getTime();
                            }
                            arr.sort(sorter);
                        };
                        sortByDate(this.upcomingEventList);
                        this.authService.setLoader(false);
                        this.getCalendarData();
                    }
                );

            this.getAllCourses();
        }
    }

    getAllCourses() {
        if (sessionStorage.getItem('token')) {
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'allCourses', null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        if (respData['isError'] == false) {
                            this.allCourses = respData['result'];
                            var element: any = null;
                            for (var key in this.allCourses) {
                                if (this.allCourses.hasOwnProperty(key)) {
                                    element = this.allCourses[key];
                                    var url: string[] = [];
                                    for (const key in element) {
                                        if (Object.prototype.hasOwnProperty.call(element, key)) {
                                            const value: string = element[key]
                                            if (key == 'picture_video' && value != null) {
                                                url = value.split('\"');
                                            }
                                        }
                                    }
                                    if (url && url.length > 0) {
                                        url.forEach(el => {
                                            if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                                element.picture_video = el;
                                            }
                                        });
                                    }
                                    else {
                                        element['picture_video'] = '';
                                    }
                                    this.allData[key] = element;
                                    if (element && element.recurrence != '' && element.recurrence != null) {
                                        let recurrence: string = element.recurrence;
                                        if (recurrence.includes('UNTIL') == false) {
                                            recurrence = recurrence + ';UNTIL=' + nextYear;
                                        }
                                        recurrence = recurrence.replace("T000000Z;", "T200000Z;");
                                        recurrence = recurrence.slice(0, -1);
                                        var DTSTART = element.date_from.split('T')[0].replace(/-/gi, '') + "T000000Z";
                                        recurrence = recurrence + ';DTSTART=' + DTSTART;
                                        let rule: RRule = RRule.fromString(recurrence)
                                        let rules: Date[] = rule.all();
                                        if (rules && rules.length > 0) {
                                            rules.forEach((val, index)=> {
                                                let yourDate: Date = new Date(val)
                                                let dt: string = yourDate.toISOString().split('T')[0];
                                                let rrDate: string = dt + "T" + element.date_from.split("T")["1"];
                                                let rrEvents: any = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": 4,
                                                    "instructor_type": element.instructor_type,
                                                    "name": element.name,
                                                    "picture_video": element.picture_video,
                                                    "allowed_persons": element.allowed_persons,
                                                    "date_from": rrDate,
                                                    "date_to": rrDate,
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
                                                    "CourseExternalInstructor": element.CourseExternalInstructor,
                                                    "courseUsers": element.courseUsers,
                                                    "RoomsDetails": element.RoomsDetails,
                                                    "CourseGroups": element.CourseGroups,
                                                    "CourseInternalInstructor": element.CourseInternalInstructor,
                                                    "team_id": element.team_id,
                                                    "date_repeat": element.date_repeat,
                                                    "isCourse": true
                                                }
                                                this.courseList.push(rrEvents);
                                            })
                                        }

                                    } else {
                                        if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                            const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                            JSON.parse(element.recurring_dates).forEach(dd => {
                                                let yourDate1: Date = new Date(dd.date_from);
                                                let dt1: string = yourDate1.toISOString().split('T')[0];
                                                var rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                let rrEvents1: any = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": 4,
                                                    "instructor_type": element.instructor_type,
                                                    "name": element.name,
                                                    "picture_video": element.picture_video,
                                                    "allowed_persons": element.allowed_persons,
                                                    "date_from": rrDate1,
                                                    "date_to": rrDate1,
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
                                                    "CourseExternalInstructor": element.CourseExternalInstructor,
                                                    "courseUsers": element.courseUsers,
                                                    "RoomsDetails": element.RoomsDetails,
                                                    "CourseGroups": element.CourseGroups,
                                                    "CourseInternalInstructor": element.CourseInternalInstructor,
                                                    "team_id": element.team_id,
                                                    "date_repeat": element.date_repeat,
                                                    "isCourse": true
                                                }
                                                this.courseList.push(rrEvents1);
                                            });
                                        } else {
                                            const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                            if (dates && dates.length > 0) {
                                                dates.forEach(dd => {
                                                    let yourDate1: Date = new Date(dd)
                                                    let dt1: string = yourDate1.toISOString().split('T')[0];
                                                    var rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                    let rrEvents1: any = {
                                                        "id": element.id,
                                                        "schedule": element.schedule,
                                                        "official_club_date": element.official_club_date,
                                                        "type": 4,
                                                        "instructor_type": element.instructor_type,
                                                        "name": element.name,
                                                        "picture_video": element.picture_video,
                                                        "allowed_persons": element.allowed_persons,
                                                        "date_from": rrDate1,
                                                        "date_to": rrDate1,
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
                                                        "CourseExternalInstructor": element.CourseExternalInstructor,
                                                        "courseUsers": element.courseUsers,
                                                        "RoomsDetails": element.RoomsDetails,
                                                        "CourseGroups": element.CourseGroups,
                                                        "CourseInternalInstructor": element.CourseInternalInstructor,
                                                        "team_id": element.team_id,
                                                        "date_repeat": element.date_repeat,
                                                        "isCourse": true
                                                    }
                                                    this.courseList.push(rrEvents1);
                                                });
                                            }
                                        }
                                    }

                                }
                            }
                        } else if (respData['code'] == 400) {
                        };

                        this.getCalendarData();
                    }
                );
        }
    }

    isTodayEvents: boolean = true;
    isUpcomingEvents: boolean = false;

    onTodayEvents() {
        this.isTodayEvents = true;
        this.isUpcomingEvents = false;
    }

    onUpcomingEvents() {
        this.isTodayEvents = false;
        this.isUpcomingEvents = true;
    }

    getCalendarData() {
        this.calendarEvents = [];
        var count: number = 0;
        if ((this.eventList && this.eventList.length > 0) && (this.courseList && this.courseList.length > 0)) {
            Array.prototype.push.apply(this.eventList, this.courseList);
        } else if ((this.eventList && this.eventList.length > 0) && (this.courseList && this.courseList.length == 0)) {
            Array.prototype.push.apply(this.eventList, this.courseList);
        } else if ((this.eventList && this.eventList.length == 0) && (this.courseList && this.courseList.length > 0)) {
            Array.prototype.push.apply(this.eventList, this.courseList);
        }
        if (this.eventList && this.eventList.length > 0) {
            this.eventList.forEach((keys: any, vals: any) => {
                let date_from: string = keys.date_from.replace('Z', '');
                let date_to: string = keys.date_to.replace('Z', '');
                this.calendarEvents[count] = {
                    'title': keys.name, 'start': date_from, 'end': date_to, 'description': keys.description, 'event_id': keys.id,
                    'type': keys.type, 'classNames': this.eventTypeList[keys.type].class, 'event_name': keys.name, 'picture_video': keys.picture_video, 'isCourse': keys.isCourse
                };
                count++;
            });
        }
        this.calendarOptionsTimeGrid = {
            locale: this.selectLanguage,
            events: this.calendarEvents,
            eventClick: this.handleEventClick.bind(this),
            eventTextColor: 'black',
            eventDisplay: 'list-item',
            expandRows: false,
            displayEventTime: true,
            displayEventEnd: false,
            defaultAllDay: false,
            forceEventDuration: true,
            height: 650,
            firstDay: 1,
            dateClick: this.onDateClick.bind(this),
            dayMaxEventRows: 2,
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
            }
        };
    }

    onDateClick(res: any) {
        for (let index: number = 0; index < res.dayEl.parentElement.parentElement.childElementCount; index++) {
            let element: any = res.dayEl.parentElement.parentElement.children[index].children;
            for (let i: number = 0; i < element.length; i++) {
                element[i].classList.remove("grid-active");
            }
        }
        if (this.datePipe.transform(res.date, "yyyy-MM-dd") == res.dayEl.attributes[1].textContent) {
            res.dayEl.classList.add("grid-active");
        }
        this.calendarClicked = true;
        var count: number = 0;
        this.clickedEventData = [];
        if (this.calendarEvents && this.calendarEvents.length > 0) {
            this.calendarEvents.forEach((keys: any, vals: any) => {
                if (res.dateStr >= this.datePipe.transform(keys.start, "yyyy-MM-dd") && res.dateStr <= this.datePipe.transform(keys.end, "yyyy-MM-dd")) {
                    this.clickedEventData[count] = {
                        'title': '', 'start': keys.start, 'end': keys.end, 'description': keys.description, 'event_id': keys.event_id,
                        'type': keys.type, 'picture_video': keys.type, 'display': 'background', 'event_name': keys.title,
                    };
                    count++;
                }
            });
        }
    }

    handleEventClick(res: any) {
        this.calendarEventClicked = true;
        this.newClickedEvent = res.event;
        this.thumbnail = this.newClickedEvent.extendedProps.picture_video;
        $('#exampleModalLabel').text(this.eventTypeList[this.newClickedEvent.extendedProps.type].name);
        $('#showPopup').trigger('click');
    }

    closeModal() {
        $('#showPopup').trigger('click');
    }

    viewDetails() {
        $('#showPopup').trigger('click');
        this.router.navigate(['/mobile/event-detail/' + this.newClickedEvent.extendedProps.event_id]);
    }

    showEvents(item: any) {
        if (item.value == 'showEventList') {
            this.showEventList = true;
            this.showCalendar = false;

        } else if (item.value == 'showCalendar') {
            this.showEventList = false;
            this.showCalendar = true;
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
