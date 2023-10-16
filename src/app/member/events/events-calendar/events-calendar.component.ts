import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../../service/language.service';
import { RRule } from 'rrule';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { EventsType } from 'src/app/models/events-type.model';
import { appSetting } from 'src/app/app-settings';
import { CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { NotificationService } from 'src/app/service/notification.service';
import { element } from 'protractor';
declare var $:any;
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
    display: {
        monthYearLabel: { year: 'numeric', month: 'long' },
    }
};

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.css'],
  providers: [ { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe]
})

export class EventsCalendarComponent implements OnInit {
    language: any;
    setTheme: ThemeType;
    userRole: string;
    date: Date;
    eventTypeList: { name: string, class: string }[] = [];
    eventTypeVisibility: { name: string }[] = [];
    userDetails: LoginDetails;
    all_events: any[]=[];
    todays_date: any;
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
    selectedDate: any;
    clickedDateEvents: any[]=[];
    courseData:any[];
    allCourses: any[];
    courseList: any[] = [];
    allData: any[] = [];
    dateFilter = false;
    filterSelectedValue : any;
    selected = '0';
    currentUrl:string;
    filterOpt:boolean = false;
    headline_word_option: number = 0;
    minDate: Date;
    maxDate: Date;

    constructor(
        private authService: AuthServiceService,
        private datePipe: DatePipe,
        private router: Router,
        private lang: LanguageService, private themes: ThemeService, private route: ActivatedRoute,
        private commonFunctionService: CommonFunctionService,
        private notificationService: NotificationService,

    ) { }

    ngOnInit(): void {
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 1, 0, 1);
        this.maxDate = new Date(currentYear + 1, 11, 2);

        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.currentUrl = this.router.url;
        if(this.currentUrl == '/clubwall/club-events'){
            this.filterOpt = false;
        }else{
            this.filterOpt = true
        }
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option =parseInt(localStorage.getItem('headlineOption'));
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[this.userRole].create;
        this.participateAccess = this.userAccess[this.userRole].participate;
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.eventTypeList[1] = { name: this.language.create_event.club_event, class: "club-event-color" };
            this.eventTypeList[2] = { name: this.language.create_event.group_event, class: "group-event-color" };
            this.eventTypeList[3] = { name: this.language.create_event.functionaries_event, class: "functionaries-event-color" };
            this.eventTypeList[4] = { name: this.language.create_event.course_event, class: "courses-event-color" };
            this.eventTypeList[5] = { name: this.language.create_event.seminar, class: "seminar-event-color" };
            this.eventTypeList[6] = { name: this.language.create_event.courses, class: "courses-event-color" };

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
                        respData.forEach((elem:any) =>{
                            if(this.filterOpt == false){
                                if(elem.type == 1){
                                    this.all_events.push(elem);
                                }
                            }else{
                                this.all_events.push(elem);
                            }
                        })
                        var element: any = null;
                        let self = this;
                        for (var key in this.all_events) {
                            if (this.all_events.hasOwnProperty(key)) {
                                element = this.all_events[key];
                                if (element?.recurrence && element?.recurrence != '' && element?.recurrence != null) {
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
                                                // if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                //     recurring_dates[0].start_time ;
                                                //     recurring_dates[0].end_time;
                                                // }else{
                                                //     recurring_dates[0].start_time + ':00.000Z';
                                                //     recurring_dates[0].end_time + ':00.000Z'
                                                // }
                                                // recurring_time = recurring_dates[0].start_time;
                                                // recurring_etime = recurring_dates[0].end_time;
                                                recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }

                                            // let recurring_time = (recurring_dates) ? recurring_dates[0].start_time + ':00.000Z' : element.date_from.split("T")["1"];
                                            // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time + ':00.000Z' : element.date_to.split("T")["1"];
                                            let rrDate: string = dt + "T" + recurring_time;
                                            let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                            if(element.visibility  != 2){
                                                 self.pushCommonFunction(element, rrDate, rrDateEnd, dt, element.type);
                                            }
                                        })
                                    }
                                } else {
                                    if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                        JSON.parse(element.recurring_dates).forEach((dd:any,index:any) => {
                                            let yourDate1: Date = new Date(dd.date_from);
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            let recurring_dates = JSON.parse(element.recurring_dates);
                                            var recurring_time:any
                                            var recurring_etime:any
                                            if(recurring_dates){
                                                // if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                //     recurring_dates[0].start_time ;
                                                //     recurring_dates[0].end_time;
                                                // }else{
                                                //     recurring_dates[0].start_time + ':00.000Z';
                                                //     recurring_dates[0].end_time + ':00.000Z'
                                                // }
                                                // recurring_time = recurring_dates[0].start_time;
                                                // recurring_etime = recurring_dates[0].end_time;

                                                recurring_time = self.commonFunctionService.formatTime(recurring_dates[index].start_time);
                                                recurring_etime = self.commonFunctionService.formatTime(recurring_dates[index].end_time);

                                            }else{
                                                recurring_time = element.date_from.split("T")["1"]
                                                recurring_etime = element.date_to.split("T")["1"];
                                            }
                                            // let recurring_time = (recurring_dates) ? recurring_dates[index].start_time + ':00.000Z' : dd.start_time + ':00.000Z';
                                            // let recurring_etime = (recurring_dates) ? recurring_dates[index].end_time + ':00.000Z' : dd.end_time + ':00.000Z';
                                            let rrDate1: string = dt1 + "T" + recurring_time;
                                            let rrDateEnd1: string = dt1 + "T" + recurring_etime;
                                            if(element.visibility  != 2){
                                                self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, element.type);
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
                                                    // if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                    //     recurring_dates[0].start_time ;
                                                    //     recurring_dates[0].end_time;
                                                    // }else{
                                                    //     recurring_dates[0].start_time + ':00.000Z';
                                                    //     recurring_dates[0].end_time + ':00.000Z'
                                                    // }
                                                    // recurring_time = recurring_dates[0].start_time;
                                                    // recurring_etime = recurring_dates[0].end_time;

                                                    recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                    recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                                }else{
                                                    recurring_time = element.date_from.split("T")["1"]
                                                    recurring_etime = element.date_to.split("T")["1"];
                                                }
                                                // let recurring_time = (recurring_dates) ? recurring_dates[0].start_time + ':00.000Z' : element.date_from.split("T")["1"];
                                                // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time + ':00.000Z' : element.date_to.split("T")["1"];
                                                let rrDate1: string = dt1 + "T" + recurring_time;
                                                let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                                if(element.visibility  != 2){
                                                    self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, element.type);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        this.currentEventList.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
                        this.currentEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
                        if ((this.participateAccess.course == 'Yes') && (this.filterOpt == true)){
                            this.getAllCourses();
                        }else{
                            this.onDateClick(this.todays_date);
                        }
                    }
                );
        }
    }
    /**
    * Function to get current and upcomming Courses
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} All the Courses
    */
    getAllCourses() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'allCourses', null).subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.courseData = respData['result'];
                        this.courseList = [];
                        let cudate: Date = new Date()
                        let cuday: string = cudate.getDate().toString().padStart(2, "0");
                        let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
                        let cuyear: number = cudate.getFullYear() + 1;
                        let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
                        let self = this;

                        if(this.courseData?.length > 0){
                            this.date = new Date(); // Today's date
                            this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                            if(this.courseData){
                                this.courseData.forEach(element => {
                                    element.recurring_dates = JSON.parse(element.recurring_dates);
                                });
                            }
                            this.allCourses = this.courseData;
                            var element: any = null;
                            if(this.allCourses){
                                for (var key in this.allCourses) {
                                    if (this.allCourses.hasOwnProperty(key)) {
                                        element = this.allCourses[key];
                                        var url: string[] = [];
                            
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
                                            let rule: RRule = RRule.fromString(recurrence);
                                            let rules: Date[] = rule.all();

                                            if (rules && rules.length > 0) {
                                                rules.forEach(function (val, index) {
                                                    let yourDate: Date = new Date(val);
                                                    let dt: string = yourDate.toISOString().split('T')[0];
                                                    let recurring_dates = element.recurring_dates;
                                                    var recurring_time:any;
                                                    var recurring_etime:any;
                                                    if(recurring_dates){
                                                        // if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                        //     recurring_dates[0].start_time ;
                                                        //     recurring_dates[0].end_time;
                                                        // }else{
                                                        //     recurring_dates[0].start_time + ':00.000Z';
                                                        //     recurring_dates[0].end_time + ':00.000Z'
                                                        // }
                                                        // recurring_time = recurring_dates[0].start_time;
                                                        // recurring_etime = recurring_dates[0].end_time;
                                                        recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                        recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                                    }else{
                                                        recurring_time = element.date_from.split("T")["1"];
                                                        recurring_etime = element.date_to.split("T")["1"];
                                                    }
                                                    // let recurring_time =  (recurring_dates) ? recurring_dates[0].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                                    // let recurring_etime =  (recurring_dates) ? recurring_dates[0].end_time+':00.000Z' : element.date_to.split("T")["1"];
                                                    let rrDate: string = dt + "T" + recurring_time;
                                                    let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                                    if(element.visibility  != 2){
                                                        if(self.userDetails.roles[0] == 'guest'  && element.show_guest_list == 'true'){
                                                            self.pushCommonFunction(element, rrDate, rrDateEnd, dt, 6);
                                                        }else if(self.userDetails.roles[0] != 'guest'){
                                                            self.pushCommonFunction(element, rrDate, rrDateEnd, dt, 6);
                                                        }
                                                    }
                                                })
                                            }
                                        } else {
                                            if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                                const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                                element.recurring_dates.forEach((dd:any,index:any) => {
                                                    let yourDate1: Date = new Date(dd.date_from);
                                                    let dt1: string = yourDate1.toISOString().split('T')[0];
                                                    let recurring_dates = element.recurring_dates;
                                                    var recurring_time:any
                                                    var recurring_etime:any
                                                    if(recurring_dates){
                                                        // if(recurring_dates[index].start_time.includes(':00:00') && recurring_dates[index].end_time.includes(':00:00')){
                                                        //     recurring_dates[index].start_time ;
                                                        //     recurring_dates[index].end_time;
                                                        // }else{
                                                        //     recurring_dates[index].start_time + ':00.000Z';
                                                        //     recurring_dates[index].end_time + ':00.000Z'
                                                        // }
                                                        // recurring_time = recurring_dates[index].start_time;
                                                        // recurring_etime = recurring_dates[index].end_time;
                                                        recurring_time = self.commonFunctionService.formatTime(recurring_dates[index].start_time);
                                                        recurring_etime = self.commonFunctionService.formatTime(recurring_dates[index].end_time);
                                                    }else{
                                                        recurring_time = element.date_from.split("T")["1"]
                                                        recurring_etime = element.date_to.split("T")["1"];
                                                    }
                                                    // let recurring_time =  (recurring_dates) ? recurring_dates[index].start_time+':00.000Z' : dd.date_from.split("T")["1"];
                                                    // let recurring_etime = (recurring_dates) ? recurring_dates[index].end_time+':00.000Z' : dd.date_to.split("T")["1"]
                                                    let rrDate1: string = dt1 + "T" + recurring_time;
                                                    let rrDateEnd1: string = dt1 + "T" + recurring_etime;
                                                    if(element.visibility  != 2){
                                                        if(self.userDetails.roles[0] == 'guest'  && element.show_guest_list == 'true'){
                                                            self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, 6);
                                                        }else if(self.userDetails.roles[0] != 'guest'){
                                                            self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, 6);
                                                        }
                                                    }
                                                });
                                            } else {
                                                const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                                if(dates && dates.length > 0){
                                                    dates.forEach(dd => {
                                                        let yourDate1: Date = new Date(dd)
                                                        let dt1: string = yourDate1.toISOString().split('T')[0];
                                                        let recurring_dates = element.recurring_dates;
                                                        var recurring_time:any
                                                        var recurring_etime:any
                                                        if(recurring_dates){
                                                            // if(recurring_dates[0].start_time.includes(':00:00') && recurring_dates[0].end_time.includes(':00:00')){
                                                            //     recurring_dates[0].start_time ;
                                                            //     recurring_dates[0].end_time;
                                                            // }else{
                                                            //     recurring_dates[0].start_time + ':00.000Z';
                                                            //     recurring_dates[0].end_time + ':00.000Z'
                                                            // }
                                                            // recurring_time = recurring_dates[0].start_time;
                                                            // recurring_etime = recurring_dates[0].end_time;
                                                            recurring_time = self.commonFunctionService.formatTime(recurring_dates[0].start_time);
                                                            recurring_etime = self.commonFunctionService.formatTime(recurring_dates[0].end_time);
                                                        }else{
                                                            recurring_time = element.date_from.split("T")["1"]
                                                            recurring_etime = element.date_to.split("T")["1"];
                                                        }
                                                        // let recurring_time =  (recurring_dates) ? recurring_dates[0].start_time+':00.000Z' : element.date_from.split("T")["1"];
                                                        // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time+':00.000Z' : element.date_to.split("T")["1"]
                                                        let rrDate1: string = dt1 + "T" + recurring_time;
                                                        let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                                        if(element.visibility  != 2){
                                                            if(self.userDetails.roles[0] == 'guest'  && element.show_guest_list == 'true'){
                                                                self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, 6);
                                                            }else if(self.userDetails.roles[0] != 'guest'){
                                                                self.pushCommonFunction(element, rrDate1, rrDateEnd1, dt1, 6);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            this.currentEventList.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
                            this.currentEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
                        }
                        this.onDateClick(this.todays_date);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    };
                }
            );
        }
    }

    /**
    * Function to push value in currentEvent and upcomingEvent
    * @author  MangoIt Solutions (T)
    * @param   {selected date}
    * @return  {array of object} Events of given date
    */
    pushCommonFunction(element:any, rrDate:any,rrDateEnd:any, dt1:any, type:any){
        let self = this;
        let rrEvents1: any = {
            "id": element.id,
            "type": type,
            "name": element.name,
            "picture_video": element.picture_video,
            "date_from": rrDate,
            "date_to": rrDateEnd,
            "description": element.description,
            "start_time": element.start_time,
            "end_time": element.end_time,
            "isCourse": false,
            "show_guest_list" : element.show_guest_list,
            "visibility": element.visibility
        };
        self.eventList.push(rrEvents1);
        if (dt1 == self.todays_date) {
            self.currentEvent.push(rrEvents1);
            self.currentEventList.push(rrEvents1);
        } else if (dt1 > self.todays_date) {
            self.upcomingEvent.push(rrEvents1);
            self.upcomingEventList.push(rrEvents1);
        }
    }

    /**
    * Function to get events of the  given date
    * @author  MangoIt Solutions (M)
    * @param   {selected date}
    * @return  {array of object} Events of given date
    */
    onDateClick(date:any){
        this.clickedDateEvents = [];
        this.selectedDate = null;
        if(date){
            this.selectedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        }else{
            this.selectedDate = this.todays_date
        }
        this.eventList.forEach((element:any) =>{
            if(element.date_from.split('T')[0] == this.selectedDate){
                if(element.visibility  != 2){
                    if(this.userRole == 'guest' && element.show_guest_list == 'true' ){
                        this.clickedDateEvents.push(element);
                    }else{
                        this.clickedDateEvents.push(element);
                    }
                }
            }
        });
        this.clickedDateEvents.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
    }

    /**
    * Function to get the data of previous date
    * @author  MangoIt Solutions (M)
    * @param   {selected date}
    * @return  {array of object} Events of given date
    */
    previousClick(){
        var previousDate = new Date(this.todays_date);
        previousDate.setDate(previousDate.getDate() - 1);
        this.todays_date =  previousDate;
        this.nextPreviousData();
    }

    /**
    * Function to get the data of next date
    * @authPor  MangoIt Solutions (M)
    * @param   {selected date}
    * @return  {array of object} Events of given date
    */
    nextClick(){
        var nextDate = new Date(this.todays_date);
        nextDate.setDate(nextDate.getDate() + 1);
        this.todays_date = nextDate;
        this.nextPreviousData();
    }

    /**
    * Function to get the data of next an prev date
    * @authPor  MangoIt Solutions (M)
    * @param   {selected date}
    * @return  {array of object} Events of given date
    */
    nextPreviousData(){
        this.currentEvent = [];
        this.currentEventList = [];
        this.eventList.forEach((element:any) =>{

            if(this.datePipe.transform(element.date_from, 'yyyy-MM-dd','UTC') == this.datePipe.transform(this.todays_date, 'yyyy-MM-dd')){
                this.currentEvent.push(element);
                if(this.dateFilter == true){
                    if(this.filterSelectedValue == element.type){
                        this.currentEventList.push(element);
                    }else if(this.filterSelectedValue == 0){
                        this.currentEventList.push(element);
                    }
                }
            }

        });
        this.currentEventList.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
        this.currentEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
    }

    /**
     * Function to select the types of Events
     */
    eventFilter(filterValue:any) {
        let self = this;
        self.filterSelectedValue = filterValue;
        this.dateFilter = true;
        var todayEventToShow: EventsType[] = [];
        if (this.currentEvent?.length > 0) {
            this.currentEvent.forEach(function (value, key) {
                if (value.type == self.filterSelectedValue) {
                    todayEventToShow.push(value);
                }
            });
        }

        if (todayEventToShow?.length) {
            this.currentEventList.splice(0, this.currentEventList.length);
            if (todayEventToShow?.length > 0) {
                todayEventToShow.forEach((val, key) => {
                    if(this.datePipe.transform(val.date_from, 'yyyy-MM-dd','UTC') == this.datePipe.transform(this.todays_date, 'yyyy-MM-dd')){
                        this.currentEventList.push(val);
                    }
                });
            }
        } else {
            this.currentEventList.splice(0, this.currentEventList.length);
        }

        if (self.filterSelectedValue == 0) {
            this.currentEventList.splice(0, this.currentEventList.length);
            this.upcomingEventList.splice(0, this.upcomingEventList.length);
            if (this.currentEvent?.length > 0) {
                this.currentEvent.forEach((val, key) => {
                    if(this.datePipe.transform(val.date_from, 'yyyy-MM-dd','UTC') == this.datePipe.transform(this.todays_date, 'yyyy-MM-dd')){
                        this.currentEventList.push(val);
                    }
                });
            }
        }
        this.currentEventList.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
        this.currentEvent.sort((a: any, b: any) => Number(new Date(a.date_from)) - Number(new Date(b.date_from)));
    }

    /**
    * Function to redirect the user with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    viewDetails(id: any, date: any ,type:any) {
        if (type == 6) {
            this.router.navigate(['/course-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
        } else {
            this.router.navigate(['/event-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
