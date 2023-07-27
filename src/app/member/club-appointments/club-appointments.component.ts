import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EventsType } from 'src/app/models/events-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthServiceService } from '../../service/auth-service.service';
import { LanguageService } from '../../service/language.service';
import { DatePipe } from '@angular/common';
import { RRule } from 'rrule';
import { Courses } from 'src/app/models/courses.model';
import { ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
// import { NotificationService } from 'src/app/service/notification.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-club-appointments',
    templateUrl: './club-appointments.component.html',
    styleUrls: ['./club-appointments.component.css'],
    providers: [DatePipe]
})

export class ClubAppointmentsComponent implements OnInit {
    @Input() bannerData: any;
    @Input() eventData: any;
    @Input() courseData: any;
    language: any;
    eventTypeList: { name: string, class: string }[] = [];
    eventTypeVisibility: { name: string }[] = [];
    currentEvent: EventsType[] = [];
    upcomingEvent: EventsType[] = [];
    userDetails: LoginDetails;
    date: Date;
    todays_date: string;
    eventList: EventsType[] = [];
    currentEventList: EventsType[] = [];
    upcomingEventList: EventsType[] = [];
    events: any;
    allCourses: any[];
    courseList: any[] = [];
    allData: EventsType[] = [];
    upcomingCourse: Courses[] = [];
    upcomingCourseList: Courses[] = [];
    currentCourse: Courses[] = [];
    participateAccess: ParticipateAccess;
    userAccess: UserAccess;
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
    checkBanner: boolean = false;
    allowAdvertisment: any;
    headline_word_option: number = 0;

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private datePipe: DatePipe,
        private router: Router, private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService
    ) {
    }

    ngOnInit(): void {

        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.userDetails = JSON.parse(localStorage.getItem('user-data'));
            this.headline_word_option = JSON.parse(localStorage.getItem('headlineOption'));
            this.allowAdvertisment = localStorage.getItem('allowAdvertis');
            let role = this.userDetails.roles[0];
            this.userAccess = appSetting.role;
            this.participateAccess = this.userAccess[role].participate;
            if (!this.userDetails.isMember_light && !this.userDetails.isMember_light_admin) {
                this.getDesktopDeshboardBanner();
                this.getEvent();
                this.getAllCourses();
            }
        }
    }

    /**
    * Function is check banner exist or allowAdvertisment allow or not to display
    * @author  MangoIt Solutions
    */
    getDesktopDeshboardBanner() {
        if (this.allowAdvertisment == 1 || this.bannerData?.length == 0 || this.bannerData == undefined || this.bannerData == null) {
            this.checkBanner = true;
        }
    }

    /**
    * Function to get current and upcomming Events
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} All the Events
    */
    getEvent() {
        if (sessionStorage.getItem('token')) {
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
            if (this.eventData && this.eventData.length > 0) {
                this.date = new Date(); // Today's date
                this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                var element: any = null;
                var url: string[] = [];

                for (var key in this.eventData) {
                    if (this.eventData && this.eventData.hasOwnProperty(key)) {
                        element = this.eventData[key];

                        // if (element && element.picture_video && element.picture_video != null && element.picture_video != '') {
                        //     if (element.picture_video) {
                        //         url = element.picture_video.split('"');
                        //         if (url && url.length > 0) {
                        //             url.forEach((el) => {
                        //                 if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                        //                     element.picture_video = el;
                        //                 }
                        //             });
                        //         } else {
                        //             element.picture_video = '';
                        //         }
                        //     }
                        // }
                        let self = this;
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
                                rules.forEach(function (val, index) {
                                    let yourDate: Date = new Date(val)
                                    let dt: string = yourDate.toISOString().split('T')[0];
                                    let recurring_dates = JSON.parse(element.recurring_dates);
                                    var recurring_time: any
                                    var recurring_etime: any
                                    if (recurring_dates) {
                                        if (recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')) {
                                            recurring_dates[0].start_time;
                                            recurring_dates[0].end_time;
                                        } else {
                                            recurring_dates[0].start_time + ':00.000Z';
                                            recurring_dates[0].end_time + ':00.000Z'
                                        }
                                        recurring_time = recurring_dates[0].start_time;
                                        recurring_etime = recurring_dates[0].end_time;
                                    } else {
                                        recurring_time = element.date_from.split("T")["1"]
                                        recurring_etime = element.date_to.split("T")["1"];
                                    }
                                    let rrDate: string = dt + "T" + recurring_time;
                                    let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                    let rrEvents: any = {
                                        "id": element.id,
                                        "type": element.type,
                                        "name": element.name,
                                        "event_image": element?.event_images[0]?.event_image,
                                        "event_document": element?.event_images[0]?.event_document,
                                        "date_from": rrDate,
                                        "date_to": rrDateEnd,
                                        "description": element.description,
                                        "start_time": element.start_time,
                                        "end_time": element.end_time,
                                        "isCourse": false
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
                            if (element && element.recurring_dates && element.recurring_dates != '' && element.recurring_dates != null) {
                                JSON.parse(element.recurring_dates).forEach((dd: any, index: any) => {
                                    let yourDate1: Date = new Date(dd.date_from);
                                    let dt1: string = yourDate1.toISOString().split('T')[0];
                                    let recurring_dates = JSON.parse(element.recurring_dates);
                                    var recurring_time: any
                                    var recurring_etime: any
                                    if (recurring_dates) {
                                        if (recurring_dates[index].start_time.includes(':00:00') && recurring_dates[index].end_time.includes(':00:00')) {
                                            recurring_dates[index].start_time;
                                            recurring_dates[index].end_time;
                                        } else {
                                            recurring_dates[index].start_time + ':00.000Z';
                                            recurring_dates[index].end_time + ':00.000Z'
                                        }
                                        recurring_time = recurring_dates[index].start_time;
                                        recurring_etime = recurring_dates[index].end_time;
                                    } else {
                                        recurring_time = element.date_from.split("T")["1"]
                                        recurring_etime = element.date_to.split("T")["1"];
                                    }
                                    let rrDate1: string = dt1 + "T" + recurring_time;
                                    let rrDateEnd1: string = dt1 + "T" + recurring_etime;
                                    let rrEvents1: any = {
                                        "id": element.id,
                                        "type": element.type,
                                        "name": element.name,
                                        "event_image": element?.event_images[0]?.event_image,
                                        "event_document": element?.event_images[0]?.event_document,
                                        "date_from": rrDate1,
                                        "date_to": rrDateEnd1,
                                        "description": element.description,
                                        "start_time": element.start_time,
                                        "end_time": element.end_time,
                                        "isCourse": false
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
                                const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to));
                                if (dates && dates.length > 0) {
                                    dates.forEach(dd => {
                                        let yourDate1: Date = new Date(dd)
                                        let dt1: string = yourDate1.toISOString().split('T')[0];
                                        let recurring_dates = element.recurring_dates;
                                        var recurring_time: any
                                        var recurring_etime: any
                                        if (recurring_dates) {
                                            if (recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')) {
                                                recurring_dates[0].start_time;
                                                recurring_dates[0].end_time;
                                            } else {
                                                recurring_dates[0].start_time + ':00.000Z';
                                                recurring_dates[0].end_time + ':00.000Z'
                                            }
                                            recurring_time = recurring_dates[0].start_time;
                                            recurring_etime = recurring_dates[0].end_time;
                                        } else {
                                            recurring_time = element.date_from.split("T")["1"]
                                            recurring_etime = element.date_to.split("T")["1"];
                                        }
                                        // let recurring_time =  (recurring_dates) ? recurring_dates[0].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                        // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time+':00.000Z' : element.date_to.split("T")["1"]
                                        let rrDate1: string = dt1 + "T" + recurring_time;
                                        let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                        let rrEvents1: any = {
                                            "id": element.id,
                                            "type": element.type,
                                            "name": element.name,
                                            "event_image": element?.event_images[0]?.event_image,
                                            "event_document": element?.event_images[0]?.event_document,
                                            "date_from": rrDate1,
                                            "date_to": rrDateEnd1,
                                            "description": element.description,
                                            "start_time": element.start_time,
                                            "end_time": element.end_time,
                                            "isCourse": false
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
                this.events = this.eventData;
                this.getCalendarData();
            }
        }
    }

    /**
    * Function to get current and upcomming Courses
    * @author  MangoIt Solutions(R,M)
    * @param   {}
    * @return  {Array Of Object} All the Courses
    */
    getAllCourses() {
        if (sessionStorage.getItem('token')) {
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
            let self = this;
            if (this.courseData && this.courseData.length > 0) {
                this.allCourses = this.courseData;
                var element: any = null;
                if (this.allCourses) {
                    this.currentCourse = [];
                    this.upcomingCourse = [];
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
                                let self = this;
                                url.forEach(el => {
                                    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                        element.picture_video = el;
                                    }
                                });
                            } else {
                                element['picture_video'] = '';
                            }
                            this.allData[key] = element;
                            if (element && element.recurrence && element.recurrence != '' && element.recurrence != null) {
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
                                    rules.forEach(function (val, index) {
                                        let yourDate: Date = new Date(val)
                                        let dt: string = yourDate.toISOString().split('T')[0];
                                        let recurring_dates = element.recurring_dates;
                                        var recurring_time: any
                                        var recurring_etime: any
                                        if (recurring_dates) {
                                            if (recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')) {
                                                recurring_dates[0].start_time;
                                                recurring_dates[0].end_time;
                                            } else {
                                                recurring_dates[0].start_time + ':00.000Z';
                                                recurring_dates[0].end_time + ':00.000Z'
                                            }
                                            recurring_time = recurring_dates[0].start_time;
                                            recurring_etime = recurring_dates[0].end_time;
                                        } else {
                                            recurring_time = element.date_from.split("T")["1"]
                                            recurring_etime = element.date_to.split("T")["1"];
                                        }
                                        // let recurring_time =  (recurring_dates) ? recurring_dates[0].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                        // let recurring_etime =  (recurring_dates) ? recurring_dates[0].end_time+':00.000Z' : element.date_to.split("T")["1"];
                                        let rrDate: string = dt + "T" + recurring_time;
                                        let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                        let rrEvents: any = {
                                            "id": element.id,
                                            "type": '4',
                                            "name": element.name,
                                            "course_image": element?.course_image[0]?.course_image,
                                            "course_document": element?.course_image[0]?.course_document,
                                            "allowed_persons": element.allowed_persons,
                                            "date_from": rrDate,
                                            "date_to": rrDateEnd,
                                            "description": element.description,
                                            "start_time": element.start_time,
                                            "end_time": element.end_time,
                                            "isCourse": true,
                                            "show_guest_list": element.show_guest_list
                                        }
                                        self.courseList.push(rrEvents);
                                        if (dt == self.todays_date) {
                                            if (rrEvents.visibility == 2) {
                                                if (rrEvents.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                    self.currentEvent.push(rrEvents);
                                                    self.currentEventList.push(rrEvents);
                                                }
                                            } else {
                                                if (self.userDetails.roles[0] == 'guest' && rrEvents.show_guest_list == 'true') {
                                                    self.currentEvent.push(rrEvents);
                                                    self.currentEventList.push(rrEvents);
                                                } else if (self.userDetails.roles[0] != 'guest') {
                                                    self.currentEvent.push(rrEvents);
                                                    self.currentEventList.push(rrEvents);
                                                }
                                            }
                                        } else if (dt > self.todays_date) {
                                            if (rrEvents.visibility == 2) {
                                                if (rrEvents.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                    self.upcomingEvent.push(rrEvents);
                                                    self.upcomingEventList.push(rrEvents);
                                                }
                                            } else {
                                                if (self.userDetails.roles[0] == 'guest' && rrEvents.show_guest_list == 'true') {
                                                    self.upcomingEvent.push(rrEvents);
                                                    self.upcomingEventList.push(rrEvents);
                                                } else if (self.userDetails.roles[0] != 'guest') {
                                                    self.upcomingEvent.push(rrEvents);
                                                    self.upcomingEventList.push(rrEvents);
                                                }
                                            }
                                        }
                                    })
                                }
                            } else {
                                if (element && element.recurring_dates && element.recurring_dates != '' && element.recurring_dates != null) {
                                    const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to));
                                    element.recurring_dates.forEach((dd: any, index: any) => {
                                        let yourDate1: Date = new Date(dd.date_from);
                                        let dt1: string = yourDate1.toISOString().split('T')[0];
                                        let recurring_dates = element.recurring_dates;
                                        var recurring_time: any
                                        var recurring_etime: any
                                        if (recurring_dates) {
                                            if (recurring_dates[index].start_time.includes(':00:00') && recurring_dates[index].end_time.includes(':00:00')) {
                                                recurring_dates[index].start_time;
                                                recurring_dates[index].end_time;
                                            } else {
                                                recurring_dates[index].start_time + ':00.000Z';
                                                recurring_dates[index].end_time + ':00.000Z'
                                            }
                                            recurring_time = recurring_dates[index].start_time;
                                            recurring_etime = recurring_dates[index].end_time;
                                        } else {
                                            recurring_time = element.date_from.split("T")["1"]
                                            recurring_etime = element.date_to.split("T")["1"];
                                        }
                                        // let recurring_time =  (recurring_dates) ? recurring_dates[index].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                        // let recurring_etime = (recurring_dates) ? recurring_dates[index].end_time+':00.000Z' : element.date_to.split("T")["1"]
                                        let rrDate1: string = dt1 + "T" + recurring_time;
                                        let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                        let rrEvents1: any = {
                                            "id": element.id,
                                            "type": 4,
                                            "name": element.name,
                                            "course_image": element?.course_image[0]?.course_image,
                                            "course_document": element?.course_image[0]?.course_document,
                                            "allowed_persons": element.allowed_persons,
                                            "date_from": rrDate1,
                                            "date_to": rrDateEnd1,
                                            "description": element.description,
                                            "start_time": element.start_time,
                                            "end_time": element.end_time,
                                            "isCourse": true,
                                            "show_guest_list": element.show_guest_list
                                        }
                                        self.courseList.push(rrEvents1);
                                        if (dt1 == self.todays_date) {
                                            if (rrEvents1.visibility == 2) {
                                                if (rrEvents1.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                    self.currentEvent.push(rrEvents1);
                                                    self.currentEventList.push(rrEvents1);
                                                }
                                            } else {
                                                if (self.userDetails.roles[0] == 'guest' && rrEvents1.show_guest_list == 'true') {
                                                    self.currentEvent.push(rrEvents1);
                                                    self.currentEventList.push(rrEvents1);
                                                } else if (self.userDetails.roles[0] != 'guest') {
                                                    self.currentEvent.push(rrEvents1);
                                                    self.currentEventList.push(rrEvents1);
                                                }
                                            }
                                        } else if (dt1 > self.todays_date) {
                                            if (rrEvents1.visibility == 2) {
                                                if (rrEvents1.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                    self.upcomingEvent.push(rrEvents1);
                                                    self.upcomingEventList.push(rrEvents1);
                                                }
                                            } else {
                                                if (self.userDetails.roles[0] == 'guest' && rrEvents1.show_guest_list == 'true') {
                                                    self.upcomingEvent.push(rrEvents1);
                                                    self.upcomingEventList.push(rrEvents1);
                                                } else if (self.userDetails.roles[0] != 'guest') {
                                                    self.upcomingEvent.push(rrEvents1);
                                                    self.upcomingEventList.push(rrEvents1);
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to));
                                    if (dates && dates.length > 0) {
                                        dates.forEach(dd => {
                                            let yourDate1: Date = new Date(dd)
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            let recurring_dates = element.recurring_dates;
                                            var recurring_time: any
                                            var recurring_etime: any
                                            if (recurring_dates) {
                                                if (recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')) {
                                                    recurring_dates[0].start_time;
                                                    recurring_dates[0].end_time;
                                                } else {
                                                    recurring_dates[0].start_time + ':00.000Z';
                                                    recurring_dates[0].end_time + ':00.000Z'
                                                }
                                                recurring_time = recurring_dates[0].start_time;
                                                recurring_etime = recurring_dates[0].end_time;
                                            } else {
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            // let recurring_time =  (recurring_dates) ? recurring_dates[0].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                            // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time+':00.000Z' : element.date_to.split("T")["1"]
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                            let rrEvents1: any = {
                                                "id": element.id,
                                                "type": 4,
                                                "name": element.name,
                                                "course_image": element?.course_image[0]?.course_image,
                                                "course_document": element?.course_image[0]?.course_document,
                                                "allowed_persons": element.allowed_persons,
                                                "date_from": rrDate1,
                                                "date_to": rrDateEnd1,
                                                "description": element.description,
                                                "start_time": element.start_time,
                                                "end_time": element.end_time,
                                                "group_id": element.group_id,
                                                "isCourse": true,
                                                "show_guest_list": element.show_guest_list
                                            }
                                            self.courseList.push(rrEvents1);
                                            if (dt1 == self.todays_date) {
                                                if (rrEvents1.visibility == 2) {
                                                    if (rrEvents1.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                        self.currentEvent.push(rrEvents1);
                                                        self.currentEventList.push(rrEvents1);
                                                    }
                                                } else {
                                                    if (self.userDetails.roles[0] == 'guest' && rrEvents1.show_guest_list == 'true') {
                                                        self.currentEvent.push(rrEvents1);
                                                        self.currentEventList.push(rrEvents1);
                                                    } else if (self.userDetails.roles[0] != 'guest') {
                                                        self.currentEvent.push(rrEvents1);
                                                        self.currentEventList.push(rrEvents1);
                                                    }
                                                }
                                            } else if (dt1 > self.todays_date) {
                                                if (rrEvents1.visibility == 2) {
                                                    if (rrEvents1.author == self.userDetails.userId || self.userDetails.isAdmin == true) {
                                                        self.upcomingEvent.push(rrEvents1);
                                                        self.upcomingEventList.push(rrEvents1);
                                                    }
                                                } else {
                                                    if (self.userDetails.roles[0] == 'guest' && rrEvents1.show_guest_list == 'true') {
                                                        self.upcomingEvent.push(rrEvents1);
                                                        self.upcomingEventList.push(rrEvents1);
                                                    } else if (self.userDetails.roles[0] != 'guest') {
                                                        self.upcomingEvent.push(rrEvents1);
                                                        self.upcomingEventList.push(rrEvents1);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                this.getCalendarData();
            }
        }
    }

    /**
    * Function to get Calendar Data
    * @author  MangoIt Solutions(R,M)
    */
    getCalendarData() {
        this.upcomingEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
        this.currentEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
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
            user_id: this.userDetails.userId,
            banner_id: bannerId,
            display_mode: displayMode
        }
        this.authService.memberSendRequest('post', 'bannerClick', data)
            .subscribe((respData: any) => {
            })
    }

    /**
    * Function to redirect the user to event-details page with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    eventDetails(id: any, date: any) {
        // this.router.navigate(['/event-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
        this.router.navigate(['/event-detail/' + id], { queryParams: { date: date.split('T')[0] } });
    }

    /**
    * Function to redirect the user to course details with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    courseDetails(id: any, date: any) {
        // this.router.navigate(['/course-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
        this.router.navigate(['/course-detail/' + id], { queryParams: { date: date.split('T')[0] } });
    }

}
