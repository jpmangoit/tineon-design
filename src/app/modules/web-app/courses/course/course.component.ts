import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { LanguageService } from '../../../../service/language.service';
import { RRule } from 'rrule';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { Courses } from 'src/app/models/courses.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { NotificationService } from 'src/app/service/notification.service';
import { TaskCollaboratorDetails } from 'src/app/models/task-type.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    providers: [DatePipe]
})

export class CourseComponent implements OnInit, OnDestroy {
    language: any;
    allCourses: Courses[];
    responseMessage: string;
    responseMessage1: string;
    internalInstructor: { user_id: number }[] = [];
    externalInstructor: { instructor_id: number }[] = [];
    roomSelect: { room: number }[] = [];
    courseByIdData: any;
    unapprovedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    approvedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    getInTouchCourse: UntypedFormGroup;
    displayCourse: boolean = true;
    displayInstructor: boolean;
    displayRoom: boolean;
    getInstructorForm: UntypedFormGroup;
    formSubmit: boolean = false;
    hasPicture: boolean = false;
    thumb: string;
    setTheme: ThemeType;
    image: string;
    eventImage: string;
    eventFile: string;
    userRole: string;
    userDetails: LoginDetails;
    count: number;
    organizerDetails: { email: string, firstname: string, id: number, lastname: string, username: string }[] = [];
    date: Date;
    todays_date: string;
    instrucType: number;
    userSelected: number[];
    instuctorTypeDropdownSettings: IDropdownSettings;
    internalDropdownSettings: IDropdownSettings;
    externalDropdownSettings: IDropdownSettings;
    roomDropdownSettings: IDropdownSettings;
    instuctorTypeDropdownList: { item_id: number, item_text: string }[];
    externalInstructorList: { id: number, name: string }[] = [];
    internalInstructorList: { id: number, name: string }[] = [];
    roomList: { id: number, name: string }[] = [];
    alluserInformation: { member_id: string }[] = [];
    currentCourse: Courses[] = [];
    currentCourseList: Courses[] = [];
    upcomingCourse: Courses[] = [];
    upcomingCourseList: Courses[] = [];
    allData: Courses[] = [];
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    memImg: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[] = [];
    isTaskDetails: boolean = false;
    collaborators: any[] = [];
    collaboratorDetails: TaskCollaboratorDetails[] = [];
    taskOrganizerDetails: any[] = [];
    private activatedSub: Subscription;
    taskPopId: number;
    countParti: number = 0;
    allUsers: any;

    constructor(private formbuilder: UntypedFormBuilder,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private confirmDialogService: ConfirmDialogService,
        private datePipe: DatePipe,
        private router: Router,
        private themes: ThemeService,
        private lang: LanguageService,
        private notificationService: NotificationService,
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
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[this.userRole].create;
        this.participateAccess = this.userAccess[this.userRole].participate;
        this.authorizationAccess = this.userAccess[this.userRole].authorization;
        if (this.participateAccess.course == 'Yes') {
            this.getCourseOtherInfo();
            setTimeout(() => {
                this.getAllCourses();
            }, 500);
        }
        this.getInTouchCourse = this.formbuilder.group({
            subject: [''],
            body: [''],
            sender_email: [''],
            receiver_id: [''],
            sender_id: [''],
            receiver_email: [''],
        });

        this.getInstructorForm = new UntypedFormGroup({
            'instructor_type': new UntypedFormControl('', Validators.required),
            'instructor_internal': new UntypedFormControl(''),
            'instructor_external': new UntypedFormControl(''),
            'room_id': new UntypedFormControl(''),
        });

        this.instuctorTypeDropdownList = [
            { item_id: 1, item_text: this.language.courses.internal },
            { item_id: 2, item_text: this.language.courses.external },
        ]

        this.instuctorTypeDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        }

        this.internalDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: false
        }
    }

    /**
    * Function is used to display course tab contain
    * @author  MangoIt Solutions
    */
    onCourse() {
        this.displayCourse = true;
        this.displayInstructor = false;
        this.displayRoom = false;
    }

    /**
    * Function is used to display Instructor tab contain
    * @author  MangoIt Solutions
    */
    onInstructor() {
        this.displayCourse = false;
        this.displayInstructor = true;
        this.displayRoom = false;
    }

    /**
    * Function is used to display Room tab contain
    * @author  MangoIt Solutions
    */
    onRoom() {
        this.displayCourse = false;
        this.displayInstructor = false;
        this.displayRoom = true;
    }

    /**
    * Function to get current and upcomming Courses
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} All the Courses
    */
    getAllCourses() {
        if (sessionStorage.getItem('token')) {
            this.currentCourseList = [];
            this.upcomingCourseList = [];
            this.currentCourse = [];
            this.upcomingCourse = [];
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'allCourses', null).subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        if (respData && respData['result']) {
                            respData.result.forEach(element => {
                                element.recurring_dates = JSON.parse(element.recurring_dates);
                            });
                        }
                        this.allCourses = respData['result'];
                        var element: any = null;
                        if (this.allCourses) {
                            for (var key in this.allCourses) {
                                if (this.allCourses.hasOwnProperty(key)) {
                                    element = this.allCourses[key];
                                    if (element?.course_image && element.course_image.length > 0 && typeof element.course_image[0]?.course_image === 'string') {
                                        const base64String = element.course_image[0].course_image;
                                        const base64Data = base64String.substring(20);
                                        const blobUrl = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(base64Data)) as string;
                                        element.course_image[0].course_image = blobUrl;
                                        this.eventImage = element.course_image[0].course_image
                                    }
                                    if (element?.CourseExternalInstructor && element?.CourseExternalInstructor['length'] > 0) {
                                        if (element.CourseExternalInstructor[0]?.externalIns?.instructor_image) {
                                            element.CourseExternalInstructor[0].externalIns.instructor_image[0].instructor_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.CourseExternalInstructor[0]?.externalIns?.instructor_image[0].instructor_image.substring(20)));
                                        }
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
                                                // let recurring_time = (recurring_dates) ? recurring_dates[0].start_time + ':00.000Z' : element.date_from.split("T")["1"];
                                                // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time + ':00.000Z' : element.date_to.split("T")["1"];
                                                let rrDate: string = dt + "T" + recurring_time;
                                                let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + recurring_etime;
                                                let rrEvents: any = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": element.type,
                                                    "instructor_type": element.instructor_type,
                                                    "name": element.name,
                                                    "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                    "course_document": element.course_image[0]?.course_document,
                                                    "allowed_persons": element.allowed_persons,
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
                                                    "CourseExternalInstructor": element.CourseExternalInstructor,
                                                    "courseUsers": element.courseUsers,
                                                    "RoomsDetails": element.RoomsDetails,
                                                    "CourseGroups": element.CourseGroups,
                                                    "CourseInternalInstructor": element.CourseInternalInstructor,
                                                    "team_id": element.team_id,
                                                    "date_repeat": element.date_repeat
                                                }
                                                if (dt == this.todays_date) {
                                                    this.currentCourse.push(rrEvents);
                                                    this.currentCourseList.push(rrEvents);

                                                } else if (dt > this.todays_date) {
                                                    this.upcomingCourse.push(rrEvents);
                                                    this.upcomingCourseList.push(rrEvents);
                                                }
                                            });

                                        }
                                    } else {
                                        if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                            const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                            element.recurring_dates.forEach(dd => {
                                                let yourDate1: Date = new Date(dd.date_from);
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

                                                // let recurring_time = (recurring_dates) ? recurring_dates[0].start_time + ':00.000Z' : element.date_from.split("T")["1"];
                                                // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time + ':00.000Z' : element.date_to.split("T")["1"]
                                                let rrDate1: string = dt1 + "T" + recurring_time;
                                                let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;

                                                let rrEvents1: any = {
                                                    "id": element.id,
                                                    "schedule": element.schedule,
                                                    "official_club_date": element.official_club_date,
                                                    "type": element.type,
                                                    "instructor_type": element.instructor_type,
                                                    "name": element.name,
                                                    "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                    "course_document": element.course_image[0]?.course_document,
                                                    "allowed_persons": element.allowed_persons,
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
                                                    "CourseExternalInstructor": element.CourseExternalInstructor,
                                                    "courseUsers": element.courseUsers,
                                                    "RoomsDetails": element.RoomsDetails,
                                                    "CourseGroups": element.CourseGroups,
                                                    "CourseInternalInstructor": element.CourseInternalInstructor,
                                                    "team_id": element.team_id,
                                                    "date_repeat": element.date_repeat
                                                }
                                                if (dt1 == this.todays_date) {
                                                    this.currentCourse.push(rrEvents1);
                                                    this.currentCourseList.push(rrEvents1);
                                                } else if (dt1 > this.todays_date) {
                                                    this.upcomingCourse.push(rrEvents1);
                                                    this.upcomingCourseList.push(rrEvents1);
                                                }

                                            });
                                        } else {
                                            const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
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
                                                    // let recurring_time = (recurring_dates) ? recurring_dates[0].start_time + ':00.000Z' : element.date_from.split("T")["1"];
                                                    // let recurring_etime = (recurring_dates) ? recurring_dates[0].end_time + ':00.000Z' : element.date_to.split("T")["1"]
                                                    let rrDate1: string = dt1 + "T" + recurring_time;
                                                    let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + recurring_etime;

                                                    let rrEvents1: any = {
                                                        "id": element.id,
                                                        "schedule": element.schedule,
                                                        "official_club_date": element.official_club_date,
                                                        "type": element.type,
                                                        "instructor_type": element.instructor_type,
                                                        "name": element.name,
                                                        "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                        "course_document": element.course_image[0]?.course_document,
                                                        "allowed_persons": element.allowed_persons,
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
                                                        "CourseExternalInstructor": element.CourseExternalInstructor,
                                                        "courseUsers": element.courseUsers,
                                                        "RoomsDetails": element.RoomsDetails,
                                                        "CourseGroups": element.CourseGroups,
                                                        "CourseInternalInstructor": element.CourseInternalInstructor,
                                                        "team_id": element.team_id,
                                                        "date_repeat": element.date_repeat
                                                    }
                                                    if (dt1 == this.todays_date) {
                                                        this.currentCourse.push(rrEvents1);
                                                        this.currentCourseList.push(rrEvents1);
                                                    } else if (dt1 > this.todays_date) {
                                                        this.upcomingCourse.push(rrEvents1);
                                                        this.upcomingCourseList.push(rrEvents1);
                                                    }
                                                });

                                            }
                                        }
                                    }
                                }
                            }
                        }
                        const sortByDate = (arr: Courses[]) => {
                            const sorter = (a: Courses, b: Courses) => {
                                return new Date(a.date_from).getTime() - new Date(b.date_from).getTime();
                            }
                            arr.sort(sorter);
                        };
                        sortByDate(this.upcomingCourseList);
                        this.currentCourseList.forEach(element => {

                            if (this.allUsers?.length > 0) {
                                this.allUsers.forEach(el => {
                                    if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                        if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                            // element.CourseInternalInstructor[0].internalUsers.add_img = el;
                                            if (el.member_id != null) {
                                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                    .subscribe(
                                                        (resppData: any) => {
                                                            this.thumb = resppData;
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = this.thumb;
                                                        },
                                                        (error: any) => {
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                        });
                                            } else {
                                                element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        this.upcomingCourseList.forEach(element => {
                            if (this.allUsers?.length > 0) {
                                this.allUsers.forEach(el => {
                                    if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                        if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                            // element.CourseInternalInstructor[0].internalUsers.add_img = el;
                                            if (el.member_id != null) {
                                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                    .subscribe(
                                                        (resppData: any) => {
                                                            this.thumb = resppData;
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = this.thumb;
                                                        },
                                                        (error: any) => {
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                        });
                                            } else {
                                                element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        this.authService.setLoader(false);

                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    };
                }
            );
        }
    }

    isStartDateEqualToEndDate(): boolean {
        return this.upcomingCourseList['date_from']?.getTime() === this.upcomingCourseList['date_to']?.getTime();
    }

    /**
    * Function to get particular Course by Id
    * @author  MangoIt Solutions
    * @param   {CourseId}
    * @return  {Array Of Object} particular Courses
    */
    courseById(id: number) {
        this.authService.setLoader(true);
        this.memImg = [];
        this.eventImage = '';
        this.eventFile = '';
        this.taskPopId = id;
        this.authService.memberSendRequest('get', 'getCoursesById/' + id, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false) {
                        this.courseByIdData = respData['result'];
                        if (this.courseByIdData?.length > 0) {
                            this.courseByIdData.forEach(element => {
                                element.recurring_dates = JSON.parse(element.recurring_dates);
                                if (this.allUsers?.length > 0) {
                                    this.allUsers.forEach(el => {
                                        if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                            if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                if (el.member_id != null) {
                                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                        .subscribe(
                                                            (resppData: any) => {
                                                                element.CourseInternalInstructor[0].internalUsers.add_img = resppData;
                                                            },
                                                            (error: any) => {
                                                                element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                            });
                                                } else {
                                                    element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        this.courseByIdData[0].recurring_dates.forEach((element: any) => {
                            element.start_time = this.commonFunctionService.convertTime(element.start_time);
                            element.end_time = this.commonFunctionService.convertTime(element.end_time);
                        })

                        if (this.courseByIdData[0]?.course_image[0]?.course_image != "[]") {
                            this.hasPicture = true;
                            if (this.courseByIdData[0]?.course_image[0]?.course_image) {
                                this.courseByIdData[0].course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.courseByIdData[0]?.course_image[0]?.course_image.substring(20)));
                                this.eventImage = this.courseByIdData[0]?.course_image[0]?.course_image
                            }
                        } else {
                            this.hasPicture = false;
                            this.eventImage = '../../../assets/img/no_image.png';
                        }

                        if (this.courseByIdData[0]?.document_url) {
                            this.eventFile = this.courseByIdData[0].document_url;
                        }
                        this.getOrganizerDetails(id);
                        this.getParticipantDetails(id);
                        if (this.courseByIdData[0]?.courseTask?.id) {
                            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + this.courseByIdData[0]?.courseTask.id, null)
                                .subscribe((respData: any) => {
                                    if (respData && respData.length > 0) {
                                        respData.forEach(ele => {
                                            if (ele.user_id == this.userDetails.userId) {
                                                this.countParti = 1;
                                            }
                                        });
                                    }
                                });
                            setTimeout(() => {
                                if (this.courseByIdData && this.courseByIdData[0]?.courseTask && this.courseByIdData[0]?.courseTask['organizer_id'] == this.userDetails.userId || this.userDetails.isAdmin == true || this.countParti == 1) {
                                    this.isTaskDetails = true;
                                    this.setUsers(this.courseByIdData[0]?.courseTask?.id);
                                }
                            }, 1000);
                        }
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                    this.authService.setLoader(false);
                }
            )
    }

    /**
    * Function is used to get users Details
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {TaskId}
    * @return  {Array Of Object} users all detail
    */
    setUsers(taskid: number) {
        if (sessionStorage.getItem('token')) {
            this.taskOrganizerDetails = [];
            this.collaborators = [];
            this.collaboratorDetails = []
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.collaboratorDetails = respData;
                        Object(this.collaboratorDetails) && Object(this.collaboratorDetails).forEach((val, key) => {
                            if (val?.user?.length > 0) {
                                val.user.forEach(element => {
                                    if (element.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + element.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.thumb = resppData;
                                                    val.image = this.thumb
                                                },
                                                (error: any) => {
                                                    val.image = null;
                                                });
                                    } else {
                                        val.image = null;
                                    }
                                });
                            }
                        });
                        let org_id = 0;
                        if (this.collaboratorDetails && this.collaboratorDetails.length > 0) {
                            this.collaboratorDetails.forEach((value: any) => {
                                if (value.user_id == this.courseByIdData[0]?.courseTask?.['organizer_id']) {
                                    this.taskOrganizerDetails.push(value);
                                    org_id = 1;
                                } else {
                                    this.collaborators.push(value);
                                }
                            })
                            this.collaborators = Object.assign(this.authService.uniqueObjData(this.collaborators, 'user_id'));
                        }
                    }
                );
        }
    }

    /**
    * Function to get Organizer of particular Course
    * @author  MangoIt Solutions
    * @param   {CourseId}
    * @return  {Array Of Object} orgnizer detail
    */
    getOrganizerDetails(courseid: number) {
        this.organizerDetails = [];
        this.approvedParticipants = [];
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'approvedParticipants/course/' + courseid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData && respData.length > 0) {
                            respData.forEach((value, key) => {
                                if (this.courseByIdData[0].author == value.users.id) {
                                    this.organizerDetails.push(value);
                                    Object(this.organizerDetails).forEach((val, key) => {
                                        val.users.image = null;
                                        val.id = val.users.id;
                                        if (this.alluserInformation[val.users.id] && this.alluserInformation[val.users.id] != null) {
                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.users.id].member_id, null)
                                                .subscribe(
                                                    (resppData: any) => {
                                                        this.thumb = resppData;
                                                        val.users.image = this.thumb;
                                                    },
                                                    (error: any) => {
                                                        val.users.image = null;
                                                    }
                                                );
                                        }
                                    })
                                } else {
                                    this.approvedParticipants.push(value);
                                    Object(this.approvedParticipants).forEach((val, key) => {
                                        val.users.image = null;
                                        val.id = val.users.id;
                                        if (this.alluserInformation[val.users.id] && this.alluserInformation[val.users.id].member_id != null) {
                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.users.id].member_id, null)
                                                .subscribe(
                                                    (resppData: any) => {
                                                        this.thumb = resppData;
                                                        val.users.image = this.thumb;
                                                    },
                                                    (error: any) => {
                                                        val.users.image = null;
                                                    });
                                        }
                                    });
                                }
                            });
                            this.organizerDetails = Object.assign(this.authService.uniqueObjData(this.organizerDetails, 'id'));
                            this.approvedParticipants = Object.assign(this.authService.uniqueObjData(this.approvedParticipants, 'id'));
                        }
                    }
                );
        }
    }

    /**
    * Function to get the participants of particular Course
    * @author  MangoIt Solutions
    * @param   {CourseId}
    * @return  {Array Of Object} all the participants
    */
    getParticipantDetails(courseid: number) {
        this.unapprovedParticipants = []
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.memImg = [];
            this.authService.memberSendRequest('get', 'unapprovedParticipants/course/' + courseid, null)
                .subscribe(
                    (respData: any) => {
                        if (respData && respData.length > 0) {
                            this.unapprovedParticipants = respData;
                            Object(this.unapprovedParticipants).forEach((val, key) => {
                                if (this.alluserInformation[val.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                val.image = this.thumb;
                                            },
                                            (error: any) => {
                                                val.image = null;
                                            });
                                } else {
                                    val.image = null;
                                }
                                this.memImg.push(val);
                            });
                            this.memImg = Object.assign(this.authService.uniqueObjData(this.memImg, 'id'));
                            this.unapprovedParticipants = Object.assign(this.authService.uniqueObjData(this.unapprovedParticipants, 'id'));
                        }
                        this.authService.setLoader(false);
                    }
                );
        }
    }

    /**
    * Function is used to change the Instructor dropdown
    * @author  MangoIt Solutions
    */
    changeInstructor() {
        if (this.getInstructorForm.controls.instructor_type.status == 'INVALID') {
            this.getInstructorForm.controls["instructor_external"].setValue('');
            this.getInstructorForm.controls["instructor_internal"].setValue('');
            this.instrucType = null;
        }
    }

    /**
    * Function is used to select instructor type
    * @author  MangoIt Solutions
    */
    onInstructorTypeSelect(item: { item_id: number, item_text: string }) {
        this.instrucType = item.item_id;
        if (this.instrucType == 1) {
            this.getInstructorForm.get('instructor_internal').setValidators(Validators.required);
            this.getInstructorForm.get('instructor_internal').updateValueAndValidity();
            this.getInstructorForm.get('instructor_external').clearValidators();
            this.getInstructorForm.get('instructor_external').updateValueAndValidity();
        } else if (this.instrucType == 2) {
            this.getInstructorForm.get('instructor_external').setValidators(Validators.required);
            this.getInstructorForm.get('instructor_external').updateValueAndValidity();
            this.getInstructorForm.get('instructor_internal').clearValidators();
            this.getInstructorForm.get('instructor_internal').updateValueAndValidity();
        }
    }

    /**
    * Function is used to de select instructor type
    * @author  MangoIt Solutions
    */
    onInstructorTypeDeSelect(item: { item_id: number, item_text: string }) {
        this.instrucType = null;
        this.getAllCourses()
    }

    /**
    * Function is used to select External Instructor
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeSelect(item: { id: number, name: string }) {
        this.externalInstructor.push({ 'instructor_id': item.id });
    }

    /**
    * Function is used to De select External Instructor
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeDeSelect(item: { id: number, name: string }) {
        if (this.externalInstructor && this.externalInstructor.length > 0) {
            this.externalInstructor.forEach((value, index) => {
                if (value.instructor_id == item.id) {
                    this.externalInstructor.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function is used to select room
    * @author  MangoIt Solutions
    */
    onRoomSelect(item: { id: number, name: string }) {
        this.roomSelect.push({ 'room': item.id });
    }

    /**
    * Function is used to de select room
    * @author  MangoIt Solutions
    */
    onRoomDeSelect(item: { id: number, name: string }) {
        if (this.roomSelect && this.roomSelect.length > 0) {
            this.roomSelect.forEach((value, index) => {
                if (value.room == item.id) {
                    this.roomSelect.splice(index, 1);
                }
            });
        }
    }

    /**
     * Function to get Course Other Information
     * @author  MangoIt Solutions (T)
     * @param   {}
     * @return  {Array Of Object} all the Users
     */
    getCourseOtherInfo() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'courseCommonInfo/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        if (respData && respData?.result?.users?.length > 0) {
                            this.allUsers = respData.result.users;
                            Object(respData.result.users).forEach((val, key) => {
                                this.alluserInformation[val.id] = { member_id: val.member_id };
                                this.internalInstructorList.push({ 'id': val.id, 'name': val.firstname + ' ' + val.lastname });
                            });
                        }

                        if (respData && respData?.result?.rooms?.length > 0) {
                            Object(respData.result.rooms).forEach((val, key) => {
                                this.roomList.push({ 'id': val.id, 'name': val.name });
                            });
                            this.roomDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: false
                            }
                        }

                        if (respData && respData?.result?.instructors?.length > 0) {
                            Object(respData.result.instructors).forEach((val, key) => {
                                this.externalInstructorList.push({ 'id': val.id, 'name': val.first_name + ' ' + val.last_name });
                            });
                            this.externalDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: false,
                            };
                        }
                    }
                }
            );
    }

    /**
    * Function is used to select Internal Instructor
    * @author  MangoIt Solutions
    */
    onInternalInstructorSelect(item: { id: number, name: string }) {
        this.internalInstructor.push({ 'user_id': item.id });
    }

    /**
    * Function is used to de select Internal Instructor
    * @author  MangoIt Solutions
    */
    onInternalInstructorDeSelect(item: { id: number, name: string }) {
        if (this.internalInstructor && this.internalInstructor.length > 0) {
            this.internalInstructor.forEach((value, index) => {
                if (value.user_id == item.id)
                    this.internalInstructor.splice(index, 1);
            });
        }
    }

    /**
    * Function is used to select all Internal Instructor
    * @author  MangoIt Solutions
    */
    onSelectAllInstructor(item: { id: number, name: string }) {
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const element = item[key];
                this.userSelected.push(element.id);
            }
        }
    }

    /**
    * Function is used to de select all Internal Instructor
    * @author  MangoIt Solutions
    */
    onDeSelectAllInstructor(item: { id: number, name: string }) {
        this.internalInstructor = []
    }

    /**
    * Function to delete a course
    * @author  MangoIt Solutions
    * @param   {courseId}
    * @return  Response Success or Error Message
    */
    deleteCourse(id: number) {
        $('#view-course').modal('hide');
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_course, () => {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('delete', 'deleteCourse/' + id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            setTimeout(() => {
                                this.currentCourseList = [];
                                this.upcomingCourseList = [];
                                this.getAllCourses();
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                )
        }, () => { }
        )
    }

    /**
    * Function is used to accept Course By Un Invited user
    * @author  MangoIt Solutions
    * @param   {userId, course_id}
    * @return  Response Success or Error Message
    */
    CourseAcceptByUninviteUser(course_id: number) {
        $('#view-course').modal('hide');
        var userId = this.userDetails.userId
        this.confirmDialogService.confirmThis(this.language.confirmation_message.join_course, () => {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'acceptCourseByUnInvited/user/' + userId + "/course_id/" + course_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result'], null);
                            setTimeout(() => {
                                this.currentCourseList = [];
                                this.upcomingCourseList = [];
                                this.getAllCourses();
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                            setTimeout(() => {
                                this.getAllCourses();
                            }, 2000);
                        }
                    }
                )
        }, () => { }
        )
    }

    /**
    * Function is used to redirect user to update course page
    * @author  MangoIt Solutions
    */
    updateCourse(id: number) {
        $('#view-course').modal('hide');
        var redirectUrl: string = 'web/update-course/' + id;
        this.router.navigate([redirectUrl]);
    }

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
        $('#view-course').modal('hide');
    }

    /**
     * Returns True or False.
     * @param {object}  arrayOfObject.visibility is the number to check the visibility.
     * @return {boolean} depends on condition it returns return the function value true or false .
     */
    checkType(arrayOfObject: any) {
        if ((arrayOfObject.show_guest_list == 'true') && (this.userRole == 'guest')) {
            return true;
        } else if ((arrayOfObject.show_guest_list == 'false') && (this.userRole == 'guest')) {
            return false;
        } else if (arrayOfObject.visibility == '1' || this.userRole == 'admin') {
            return true;
        } else if (arrayOfObject.visibility == '2') {
            if (arrayOfObject.author == this.userDetails.userId) {
                return true;
            }
        } else if (arrayOfObject.visibility == '3' || this.userRole == 'admin') {
            // return arrayOfObject.courseUsers.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 1);
            return arrayOfObject.courseUsers.some(obj => obj.user_id === this.userDetails.userId);
        } else if (arrayOfObject.visibility == '4') {
            // if (this.userRole == 'admin') {
            return true;
            // }
        }
    }

    /**
  * Returns True or False.
  * @param {object}  arrayOfObject.visibility is the number(user_id) to check ,equal to the login userId.
  * @param {object}  internalInstructor.user_id is the number(user_id) to check, equal to the login userId.
  * @return {boolean} depends on condition it returns return the function value true or false .
  */
    checkAcceptOrNot(arrayOfObject: any, internalInstructor: any) {

        if (internalInstructor && internalInstructor.length == 0) {
            if (this.userRole != 'admin') {
                return arrayOfObject.some((obj: any) => obj.user_id === this.userDetails.userId && obj.approved_status === 1);
            } else if (this.userRole == 'admin') {
                return arrayOfObject.some((obj: any) => obj.user_id === this.userDetails.userId && obj.approved_status === 1);
            }
        } else {
            if (this.userRole != 'admin') {
                if (internalInstructor.some((obj: any) => obj.user_id != this.userDetails.userId &&
                    arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 1))) {
                    return true;
                } else { return internalInstructor.some((obj: any) => obj.user_id === this.userDetails.userId); }
            } else if (this.userRole == 'admin') {

                if (internalInstructor.some((obj: any) => obj.user_id != this.userDetails.userId &&
                    arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 1))) {
                    return true;
                } else { return internalInstructor.some((obj: any) => obj.user_id === this.userDetails.userId); }
            }
        }
    }

    availabilityCount(arrayOfObject) {
        const count: number = arrayOfObject.filter((obj: any) => obj.approved_status === 1).length;
        this.count = count
        return count;
    }

    /**
    * Function is used to send email to instructor
    * @author  MangoIt Solutions
    * @param   {}
    * @return  Response Success or Error Message
    */
    getInTouchCourses() {
        this.formSubmit = true;
        var formData: FormData = new FormData();
        this.authService.setLoader(false);
        for (const key in this.getInTouchCourse.value) {
            if (Object.prototype.hasOwnProperty.call(this.getInTouchCourse.value, key)) {
                const element = this.getInTouchCourse.value[key];
                if (key == 'subject') {
                    formData.append('subject', element);
                }
                if (key == 'body') {
                    formData.append('body', element);
                }
                if (key == 'receiver_id') {
                    formData.append('receiver_id', element);
                }
                if (key == 'sender_id') {
                    formData.append('sender_id', element);
                }
                if (key == 'sender_email') {
                    formData.append('sender_email', element);
                }
                if (key == 'receiver_email') {
                    formData.append('receiver_email', element);
                }
            }
        }

        if (this.getInTouchCourse.valid) {
            this.authService.setLoader(true)
            this.authService.memberSendRequest('post', 'instructor/sendmail', formData)
                .subscribe(
                    (respData) => {
                        this.authService.setLoader(false)
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            setTimeout(() => {
                                $('#responseMessage1').delay(1000).fadeOut();
                                $('#get-in-touch-instructor').modal('hide');
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    },
                );
        }
    }

    isTodayCourse: boolean = true;
    isUpcomingCourse: boolean = false;

    /**
    * Function is used to select today course
    * @author  MangoIt Solutions
    */
    onTodayCourse() {
        this.isTodayCourse = true;
        this.isUpcomingCourse = false;
    }

    /**
    * Function is used to select up comeing course
    * @author  MangoIt Solutions
    */
    onUpcomingCourse() {
        this.isTodayCourse = false;
        this.isUpcomingCourse = true;
    }

    /**
     * Returns object.
     * @return {object} returns {Instructor Search Filter Data} The new Course object.
     */
    getInstructor() {

        if (this.getInstructorForm.value.instructor_type.length > 0 || this.getInstructorForm.value.room_id.length > 0) {
            if (this.getInstructorForm.value.instructor_type.length > 0 && this.getInstructorForm.value.instructor_type[0].item_id == 1) {
                var internal = [];
                var instData = this.getInstructorForm.value.instructor_internal;
                if (instData) {
                    instData.forEach(element => {
                        internal.push(element.id)
                    });
                }
                this.getInstructorForm.value["instructor_type"] = this.getInstructorForm.value.instructor_type[0].item_id;
                this.getInstructorForm.value["user_id"] = internal;
            } else if (this.getInstructorForm.value.instructor_type.length > 0 && this.getInstructorForm.value.instructor_type[0].item_id == 2) {
                var external = [];
                var exData = this.getInstructorForm.value.instructor_external;
                if (exData) {
                    exData.forEach(element => {
                        external.push(element.id)
                    });
                }
                this.getInstructorForm.value["instructor_type"] = this.getInstructorForm.value.instructor_type[0].item_id;
                this.getInstructorForm.value["instructor_id"] = external;
            }
            if (this.getInstructorForm.value.room_id) {
                var room_ids = [];
                var roomData = this.getInstructorForm.value.room_id;
                if (roomData) {
                    roomData.forEach(element => {
                        room_ids.push(element.id)
                    });
                }
                this.getInstructorForm.value["room_id"] = room_ids;
            }
            let cudate: Date = new Date()
            let cuday: string = cudate.getDate().toString().padStart(2, "0");
            let cumonth: string = (cudate.getMonth() + 1).toString().padStart(2, "0");
            let cuyear: number = cudate.getFullYear() + 1;
            let nextYear: string = cuyear + "" + cumonth + "" + cuday + "T000000Z;";

            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'allCourses', this.getInstructorForm.value)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.currentCourseList = [];
                        this.upcomingCourseList = [];
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        if (respData['isError'] == false) {
                            if (respData['result'] && respData['result'].length > 0) {
                                this.allCourses = respData['result'];
                                var element = null;
                                if (this.allCourses) {
                                    for (var key in this.allCourses) {
                                        if (this.allCourses.hasOwnProperty(key)) {
                                            element = this.allCourses[key];
                                            if (element?.course_image && element.course_image.length > 0 && typeof element.course_image[0]?.course_image === 'string') {
                                                const base64String = element.course_image[0].course_image;
                                                const base64Data = base64String.substring(20);
                                                const blobUrl = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(base64Data)) as string;
                                                element.course_image[0].course_image = blobUrl;
                                                this.eventImage = element.course_image[0].course_image
                                            }
                                            this.allData[key] = element;
                                            if (element && element.recurrence != '' && element.recurrence != null) {
                                                let recurrence = element.recurrence;
                                                if (recurrence.includes('UNTIL') == false) {
                                                    recurrence = recurrence + ';UNTIL=' + nextYear;
                                                }
                                                recurrence = recurrence.replace("T000000Z;", "T200000Z;");
                                                recurrence = recurrence.slice(0, -1);

                                                let rule: RRule = RRule.fromString(recurrence)
                                                let rules: Date[] = rule.all();
                                                if (rules && rules.length > 0) {
                                                    rules.forEach((val, index) => {
                                                        let yourDate: Date = new Date(val)
                                                        let dt: string = yourDate.toISOString().split('T')[0];
                                                        let rDate: string = dt + "T" + element.date_from.split("T")["1"];
                                                        let rrDate = rDate.split("T")["0"];
                                                        let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                        let rrEvents: any = {
                                                            "id": element.id,
                                                            "schedule": element.schedule,
                                                            "official_club_date": element.official_club_date,
                                                            "type": element.type,
                                                            "instructor_type": element.instructor_type,
                                                            "name": element.name,
                                                            // "picture_video": element.picture_video,
                                                            "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                            "course_document": element.course_image[0]?.course_document,
                                                            "allowed_persons": element.allowed_persons,
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
                                                            "CourseExternalInstructor": element.CourseExternalInstructor,
                                                            "courseUsers": element.courseUsers,
                                                            "RoomsDetails": element.RoomsDetails,
                                                            "CourseGroups": element.CourseGroups,
                                                            "CourseInternalInstructor": element.CourseInternalInstructor,
                                                            "team_id": element.team_id,
                                                            "date_repeat": element.date_repeat
                                                        }
                                                        if (dt == this.todays_date) {
                                                            this.currentCourse.push(rrEvents); 46
                                                            this.currentCourseList.push(rrEvents);

                                                        } else if (dt > this.todays_date) {
                                                            this.upcomingCourse.push(rrEvents);
                                                            this.upcomingCourseList.push(rrEvents);

                                                        }
                                                        if ((this.allCourses.length == 0)) {
                                                            this.notificationService.showError(this.language.create_faq.search_not_found, null);
                                                        }
                                                    })
                                                }
                                            } else {
                                                if (element && element.recurring_dates && element.recurring_dates != '' && element.recurring_dates != null) {
                                                    const dates = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                                    JSON.parse(element.recurring_dates).forEach(dd => {
                                                        let yourDate1: Date = new Date(dd.date_from)
                                                        let dt1: string = yourDate1.toISOString().split('T')[0];
                                                        let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                        let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                        let rrEvents1: any = {
                                                            "id": element.id,
                                                            "schedule": element.schedule,
                                                            "official_club_date": element.official_club_date,
                                                            "type": element.type,
                                                            "instructor_type": element.instructor_type,
                                                            "name": element.name,
                                                            "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                            "course_document": element.course_image[0]?.course_document,
                                                            "allowed_persons": element.allowed_persons,
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
                                                            "CourseExternalInstructor": element.CourseExternalInstructor,
                                                            "courseUsers": element.courseUsers,
                                                            "RoomsDetails": element.RoomsDetails,
                                                            "CourseGroups": element.CourseGroups,
                                                            "CourseInternalInstructor": element.CourseInternalInstructor,
                                                            "team_id": element.team_id,
                                                            "date_repeat": element.date_repeat
                                                        }
                                                        if (dt1 == this.todays_date) {
                                                            this.currentCourse.push(rrEvents1);
                                                            this.currentCourseList.push(rrEvents1);

                                                        } else if (dt1 > this.todays_date) {
                                                            this.upcomingCourse.push(rrEvents1);
                                                            this.upcomingCourseList.push(rrEvents1);
                                                        }
                                                        if ((this.allCourses.length == 0)) {
                                                            this.notificationService.showError(this.language.create_faq.search_not_found, null);
                                                        }
                                                    });
                                                } else {
                                                    const dates = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to));
                                                    if (dates && dates.length > 0) {
                                                        dates.forEach(dd => {
                                                            let yourDate1: Date = new Date(dd)
                                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                                            let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                            let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                            let rrEvents1: any = {
                                                                "id": element.id,
                                                                "schedule": element.schedule,
                                                                "official_club_date": element.official_club_date,
                                                                "type": element.type,
                                                                "instructor_type": element.instructor_type,
                                                                "name": element.name,
                                                                "course_image": (element.course_image[0]?.course_image) ? (element.course_image[0]?.course_image) : '../../../../assets/img/no_image.png',
                                                                "course_document": element.course_image[0]?.course_document,
                                                                "allowed_persons": element.allowed_persons,
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
                                                                "CourseExternalInstructor": element.CourseExternalInstructor,
                                                                "courseUsers": element.courseUsers,
                                                                "RoomsDetails": element.RoomsDetails,
                                                                "CourseGroups": element.CourseGroups,
                                                                "CourseInternalInstructor": element.CourseInternalInstructor,
                                                                "team_id": element.team_id,
                                                                "date_repeat": element.date_repeat
                                                            }
                                                            if (dt1 == this.todays_date) {
                                                                this.currentCourse.push(rrEvents1);
                                                                this.currentCourseList.push(rrEvents1);

                                                            } else if (dt1 > this.todays_date) {
                                                                this.upcomingCourse.push(rrEvents1);
                                                                this.upcomingCourseList.push(rrEvents1);
                                                            }
                                                            if ((this.allCourses.length == 0)) {
                                                                this.notificationService.showError(this.language.create_faq.search_not_found, null);
                                                            }
                                                        });
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                                const sortByDate = (arr: any) => {
                                    const sorter = (a: any, b: any) => {
                                        return new Date(a.date_from).getTime() - new Date(b.date_from).getTime();
                                    }
                                    arr.sort(sorter);
                                };
                                sortByDate(this.upcomingCourseList);
                                this.currentCourseList.forEach(element => {
                                    if (this.allUsers?.length > 0) {
                                        this.allUsers.forEach(el => {
                                            if (element?.CourseInternalInstructor != undefined) {
                                                if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                    if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                        // element.CourseInternalInstructor[0].internalUsers.add_img = el;
                                                        if (el.member_id != null) {
                                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                                .subscribe(
                                                                    (resppData: any) => {
                                                                        this.thumb = resppData;
                                                                        element.CourseInternalInstructor[0].internalUsers.add_img = this.thumb;
                                                                    },
                                                                    (error: any) => {
                                                                        element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                                    });
                                                        } else {
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                        }
                                                    }
                                                }
                                            }

                                        });
                                    }
                                });
                                this.upcomingCourseList.forEach(element => {
                                    if (this.allUsers?.length > 0) {
                                        this.allUsers.forEach(el => {
                                            if (element?.CourseInternalInstructor != undefined) {
                                                if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                    if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                        // element.CourseInternalInstructor[0].internalUsers.add_img = el;
                                                        if (el.member_id != null) {
                                                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + el.member_id, null)
                                                                .subscribe(
                                                                    (resppData: any) => {
                                                                        this.thumb = resppData;
                                                                        element.CourseInternalInstructor[0].internalUsers.add_img = this.thumb;
                                                                    },
                                                                    (error: any) => {
                                                                        element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                                    });
                                                        } else {
                                                            element.CourseInternalInstructor[0].internalUsers.add_img = null;
                                                        }
                                                    }
                                                }
                                            }

                                        });
                                    }
                                });
                                console.log(this.upcomingCourseList);

                                this.authService.setLoader(false);
                            } else {
                                this.notificationService.showError(this.language.create_faq.search_not_found, null);
                            }
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        };
                    }
                );
        } else {
            this.notificationService.showError(this.language.instructor.text_for_search, null);
        }
    }

    /**
    * Function is used to reset the form
    * @author  MangoIt Solutions
    */
    reSet() {
        this.responseMessage = "";
        this.instuctorTypeDropdownList = [];
        this.getInstructorForm.controls['instructor_type'].setValue('');
        this.getInstructorForm.controls["instructor_external"].setValue('');
        this.getInstructorForm.controls["instructor_internal"].setValue('');
        this.getInstructorForm.controls["room_id"].setValue('');
        this.instrucType = null;
        this.instuctorTypeDropdownList = [
            { item_id: 1, item_text: this.language.courses.internal },
            { item_id: 2, item_text: this.language.courses.external },
        ]
        this.getAllCourses()
    }

    /**
    * Function is used to check seats are available or sold out to join the course
    * @author  MangoIt Solutions
    */
    checkFor(arrayOfObject: any) {
        if (arrayOfObject.some(obj => (obj.user_id === this.userDetails.userId && obj.approved_status === 0))) {
            return true;
        } else if (arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 2)) { return false } else {
            return true
        }
    }

    /**
    * Function is used to check waiting for approve or joined the course
    * @author  MangoIt Solutions
    */
    checkForWaiting(arrayOfObject: any) {
        if (arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 2)) {
            return true;
        } else { return false }
    }

    /**
    * Function is used to complete the main task
    * @author  MangoIt Solutions
    * @param   {taskId}
    * @return  {string} success message
    */
    mainTaskMarkComplete(taskId: number) {
        var subtaskStatus: number = 0;
        if (this.courseByIdData[0]?.courseTask?.['id'] == taskId) {
            this.confirmDialogService.confirmThis(this.language.confirmation_message.complete_task, () => {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('get', 'approveTaskById/task/' + taskId, null).subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result'], null);
                            setTimeout(() => {
                                this.ngOnInit();
                            }, 3000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['result'], null);
                        }
                    }
                )
            }, () => {
                $('#styled-checkbox-' + taskId).prop('checked', false);
            })
        }
    }

    closeModals() {
        $('#subtask1').modal('hide');
        $('#styled-checkbox-' + this.taskPopId).prop('checked', false);
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

    hasComma(str: string) {
        if (str) {
            return str.replace(/,/g, ".");
        } else {
            return str;
        }
    }
}
