import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RRule } from 'rrule';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { Courses } from 'src/app/models/courses.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { TaskCollaboratorDetails } from 'src/app/models/task-type.model';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
declare var $: any

@Component({
    selector: 'app-mcourse',
    templateUrl: './mcourse.component.html',
    styleUrls: ['./mcourse.component.css'],
    providers: [DatePipe]
})

export class McourseComponent implements OnInit, OnDestroy {
    language: any;
    allCourses: Courses[];
    internalInstructor: { user_id: number }[] = [];
    externalInstructor: { instructor_id: number }[] = [];
    roomSelect: { room: number }[] = [];
    displayCoursediv: boolean = true;
    displayInstructordiv: boolean = false;
    displayRoomdiv: boolean = false;
    activeClass: string = 'courseActive';
    courseByIdData: any;
    unapprovedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    approvedParticipants: { email: string, firstname: string, id: number, image: string, lastname: string, username: string }[]
    getInTouchCourse: UntypedFormGroup;
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
    private activatedSub: Subscription;
    allUsers: any;
    isTaskDetails: boolean = false;
    countParti: number = 0;
    taskOrganizerDetails: any[] = [];
    collaborators: any[] = [];
    collaboratorDetails: TaskCollaboratorDetails[] = [];
    result: any;
    documentData: any;
    dowloading: boolean = false;
    responseMessage: any;

    constructor(
        private formbuilder: UntypedFormBuilder, private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder, private confirmDialogService: ConfirmDialogService,
        private datePipe: DatePipe, private router: Router,
        private themes: ThemeService, private notificationService: NotificationService,
        private lang: LanguageService, private commonFunctionService: CommonFunctionService,
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
        this.getCourseOtherInfo();
        setTimeout(() => {
            this.getAllCourses();
        }, 700);
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

    hasComma(str: string) {
        if (str) {
            return str.replace(/,/g, ".");
        } else {
            return str;
        }
    }

    /**
    * Function is used to display course tab contain
    * @author  MangoIt Solutions
    */
    onCoursediv() {
        this.displayCoursediv = true;
        this.displayInstructordiv = false;
        this.displayRoomdiv = false;
    }

    /**
    * Function is used to display Instructor tab contain
    * @author  MangoIt Solutions
    */
    onInstructordiv() {
        this.displayCoursediv = false;
        this.displayInstructordiv = true;
        this.displayRoomdiv = false;
    }

    /**
    * Function is used to display Room tab contain
    * @author  MangoIt Solutions
    */
    onRoomdiv() {
        this.displayCoursediv = false;
        this.displayInstructordiv = false;
        this.displayRoomdiv = true;
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
            let self = this;
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'allCourses', null).subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.date = new Date(); // Today's date
                    this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                    respData && respData.result.forEach(element => {
                        element.recurring_dates = JSON.parse(element.recurring_dates);
                    });
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
                                    let self = this;
                                    url.forEach(el => {
                                        if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                            element.picture_video = el;
                                        }
                                    });
                                }
                                else {
                                    element['picture_video'] = '';
                                }
                                this.allCourses.forEach((element: any) => {
                                    if (element?.course_image && element.course_image.length > 0 && typeof element.course_image[0]?.course_image === 'string') {
                                        const base64String = element.course_image[0].course_image;
                                        const base64Data = base64String.substring(20);
                                        const blobUrl = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(base64Data)) as string;
                                        element.course_image[0].course_image = blobUrl;
                                    }
                                });
                                this.allData[key] = element;
                                if (element && element.recurrence != '' && element.recurrence != null) {
                                    let recurrence: string = element.recurrence;
                                    if (recurrence.includes('UNTIL') == false) {
                                        recurrence = recurrence + ';UNTIL=' + nextYear;
                                    }
                                    if (element?.CourseExternalInstructor && element?.CourseExternalInstructor?.length > 0 && typeof element?.CourseExternalInstructor[0]?.externalIns?.instructor_image[0]?.instructor_image === 'string') {
                                        element.CourseExternalInstructor[0].externalIns.instructor_image[0].instructor_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.CourseExternalInstructor[0]?.externalIns?.instructor_image[0]?.instructor_image.substring(20)));
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
                                            let rrDate: string = dt + "T" + element.date_from.split("T")["1"];
                                            let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let rrEvents: any = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "instructor_type": element.instructor_type,
                                                "name": element.name,
                                                "course_image": element.course_image[0]?.course_image,
                                                "course_document": element.course_image[0]?.course_document,
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
                                                "date_repeat": element.date_repeat
                                            }
                                            if (dt == self.todays_date) {
                                                self.currentCourse.push(rrEvents);
                                                self.currentCourseList.push(rrEvents);

                                            } else if (dt > self.todays_date) {
                                                self.upcomingCourse.push(rrEvents);
                                                self.upcomingCourseList.push(rrEvents);
                                            }
                                        })
                                    }
                                } else {
                                    if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        element.recurring_dates.forEach(dd => {
                                            let yourDate1: Date = new Date(dd.date_from);
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            var rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                            var rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let rrEvents1: any = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "instructor_type": element.instructor_type,
                                                "name": element.name,
                                                "course_image": element.course_image[0]?.course_image,
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
                                            if (dt1 == self.todays_date) {
                                                self.currentCourse.push(rrEvents1);
                                                self.currentCourseList.push(rrEvents1);

                                            } else if (dt1 > self.todays_date) {
                                                self.upcomingCourse.push(rrEvents1);
                                                self.upcomingCourseList.push(rrEvents1);

                                            }
                                        });
                                    } else {
                                        const dates: Date[] = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                        dates.forEach(dd => {
                                            let yourDate1: Date = new Date(dd)
                                            let dt1: string = yourDate1.toISOString().split('T')[0];
                                            var rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                            var rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                            let rrEvents1: any = {
                                                "id": element.id,
                                                "schedule": element.schedule,
                                                "official_club_date": element.official_club_date,
                                                "type": element.type,
                                                "instructor_type": element.instructor_type,
                                                "name": element.name,
                                                "course_image": element.course_image[0]?.course_image,
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
                                            if (dt1 == self.todays_date) {
                                                self.currentCourse.push(rrEvents1);
                                                self.currentCourseList.push(rrEvents1);

                                            } else if (dt1 > self.todays_date) {
                                                self.upcomingCourse.push(rrEvents1);
                                                self.upcomingCourseList.push(rrEvents1);

                                            }
                                        });
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
                            let self = this;
                            if (self.allUsers?.length > 0) {
                                self.allUsers.forEach(el => {
                                    if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                        if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
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
                            if (self.allUsers?.length > 0) {
                                self.allUsers.forEach(el => {
                                    if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                        if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
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
        this.authService.memberSendRequest('get', 'getCoursesById/' + id, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false) {
                        this.courseByIdData = respData['result'];

                        this.courseByIdData && this.courseByIdData.forEach(element => {
                            element.recurring_dates = JSON.parse(element.recurring_dates);
                            if (this.allUsers?.length > 0) {
                                this.allUsers.forEach(el => {
                                    if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                        if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                            element.CourseInternalInstructor[0].internalUsers.add_img = el;
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

                        if (this.courseByIdData[0]?.course_image[0]?.course_image != null) {
                            if (this.courseByIdData[0]?.course_image[0]?.course_image) {
                                this.hasPicture = true;
                                this.courseByIdData[0].course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.courseByIdData[0]?.course_image[0]?.course_image.substring(20)));
                                this.eventImage = this.courseByIdData[0]?.course_image[0]?.course_image
                            }
                        } else {
                            this.hasPicture = false;
                            this.eventImage = '';
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
                                                    });
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
    getParticipantDetails(eventid: number) {
        this.unapprovedParticipants = []
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.memImg = [];
            this.authService.memberSendRequest('get', 'unapprovedParticipants/course/' + eventid, null)
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
                        }
                        this.memImg = Object.assign(this.authService.uniqueObjData(this.memImg, 'id'));
                        this.unapprovedParticipants = Object.assign(this.authService.uniqueObjData(this.unapprovedParticipants, 'id'));
                        this.authService.setLoader(false);
                    }
                );
        }
    }


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

    onInstructorTypeDeSelect(item: { item_id: number, item_text: string }) {
        this.instrucType = null;
        this.getAllCourses()
    }

    changeInstructor() {
        if (this.getInstructorForm.controls.instructor_type.status == 'INVALID') {
            this.getInstructorForm.controls["instructor_external"].setValue('');
            this.getInstructorForm.controls["instructor_internal"].setValue('');
            this.instrucType = null;
        }
    }

    onExternalInstructorTypeSelect(item: { id: number, name: string }) {
        this.externalInstructor.push({ 'instructor_id': item.id });
    }

    onExternalInstructorTypeDeSelect(item: { id: number, name: string }) {
        if (this.externalInstructor && this.externalInstructor.length > 0) {
            this.externalInstructor.forEach((value, index) => {
                if (value.instructor_id == item.id) {
                    this.externalInstructor.splice(index, 1);
                }
            });
        }
    }

    onRoomSelect(item: { id: number, name: string }) {
        this.roomSelect.push({ 'room': item.id });
    }

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
        let self = this;
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'courseCommonInfo/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        if (respData?.result?.users?.length > 0) {
                            this.allUsers = respData.result.users;
                            Object(respData.result.users).forEach((val, key) => {
                                self.alluserInformation[val.id] = { member_id: val.member_id };
                                self.internalInstructorList.push({ 'id': val.id, 'name': val.firstname + ' ' + val.lastname });
                            });
                        }
                        if (respData?.result?.rooms?.length > 0) {
                            Object(respData.result.rooms).forEach((val, key) => {
                                self.roomList.push({ 'id': val.id, 'name': val.name });
                            });
                            self.roomDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: false
                            }
                        }

                        if (respData?.result?.instructors?.length > 0) {
                            Object(respData.result.instructors).forEach((val, key) => {
                                self.externalInstructorList.push({ 'id': val.id, 'name': val.first_name + ' ' + val.last_name });
                            });
                            self.externalDropdownSettings = {
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

    onInternalInstructorSelect(item: { id: number, name: string }) {
        this.internalInstructor.push({ 'user_id': item.id });
    }

    onInternalInstructorDeSelect(item: { id: number, name: string }) {
        if (this.internalInstructor && this.internalInstructor.length > 0) {
            this.internalInstructor.forEach((value, index) => {
                if (value.user_id == item.id)
                    this.internalInstructor.splice(index, 1);
            });
        }
    }

    onSelectAllInstructor(item: { id: number, name: string }) {
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const element = item[key];
                this.userSelected.push(element.id);
            }
        }
    }

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
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_course, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteCourse/' + id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.notificationService.showSuccess(respData['result']['message'], null);
                            setTimeout(function () {
                                self.currentCourseList = [];
                                self.upcomingCourseList = [];
                                self.getAllCourses();
                            }, 3000);

                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                )

        }, function () { }
        )
    }

    CourseAcceptByUninviteUser(course_id: number) {
        $('#view-course').modal('hide');
        var userId = this.userDetails.userId
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.join_course, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('post', 'acceptCourseByUnInvited/user/' + userId + "/course_id/" + course_id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.notificationService.showSuccess(respData['result'], null);
                            setTimeout(function () {
                                self.currentCourseList = [];
                                self.upcomingCourseList = [];
                                self.getAllCourses();
                            }, 4000);
                        } else if (respData['code'] == 400) {
                            self.notificationService.showError(respData['message'], null);
                            setTimeout(function () {
                                self.getAllCourses();
                            }, 4000);
                        }
                    }
                )
        }, function () { }
        )
    }

    updateCourse(id: number) {
        $('#view-course').modal('hide');
        var redirectUrl: string = 'update-course/' + id;
        this.router.navigate([redirectUrl]);
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
            if (arrayOfObject.author === this.userDetails.userId) {
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

    getInTouchCourses() {
        this.formSubmit = true;
        var formData: FormData = new FormData();
        this.authService.setLoader(false);
        let self = this;
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
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    },
                );
        }
    }

    isTodayCourse: boolean = true;
    isUpcomingCourse: boolean = false;
    onTodayCourse() {
        this.isTodayCourse = true;
        this.isUpcomingCourse = false;
    }

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
            let self = this;
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'instructorFilter', this.getInstructorForm.value)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.currentCourseList = [];
                        this.upcomingCourseList = [];
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        if (respData['isError'] == false) {
                            if (respData['result'].length > 0) {
                                this.allCourses = respData['result'];
                                var element = null;
                                for (var key in this.allCourses) {
                                    if (this.allCourses.hasOwnProperty(key)) {
                                        element = this.allCourses[key];

                                        this.allCourses.forEach((element: any) => {
                                            if (element?.course_image && element.course_image.length > 0 && typeof element.course_image[0]?.course_image === 'string') {
                                                const base64String = element.course_image[0].course_image;
                                                const base64Data = base64String.substring(20);
                                                const blobUrl = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(base64Data)) as string;
                                                element.course_image[0].course_image = blobUrl;
                                                this.eventImage = element.course_image[0].course_image
                                            }
                                        });

                                        var url = [];
                                        for (const key in element) {
                                            if (Object.prototype.hasOwnProperty.call(element, key)) {
                                                const value = element[key]
                                                if (key == 'picture_video' && value != null) {
                                                    url = value.split('\"');
                                                }
                                            }
                                        }
                                        if (url && url.length > 0) {
                                            // let imgArray: any = [];
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
                                                rules.forEach(function (val, index) {
                                                    let yourDate: Date = new Date(val)
                                                    let dt: string = yourDate.toISOString().split('T')[0];
                                                    let rDate: string = dt + "T" + element.date_from.split("T")["1"];
                                                    let rrDate = rDate.split("T")["0"];
                                                    let rrDateEnd: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                    let rrEvents: Courses = {
                                                        "id": element.id,
                                                        "schedule": element.schedule,
                                                        "official_club_date": element.official_club_date,
                                                        "type": element.type,
                                                        "instructor_type": element.instructor_type,
                                                        "name": element.name,
                                                        "course_image": element.course_image[0]?.course_image,
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
                                                    if (dt == self.todays_date) {
                                                        self.currentCourse.push(rrEvents);
                                                        self.currentCourseList.push(rrEvents);

                                                    } else if (dt > self.todays_date) {
                                                        self.upcomingCourse.push(rrEvents);
                                                        self.upcomingCourseList.push(rrEvents);

                                                    }
                                                    if ((self.allCourses.length == 0)) {
                                                        self.notificationService.showError(self.language.create_faq.search_not_found, null);
                                                        setTimeout(() => {
                                                            self.reSet();
                                                        }, 3000);
                                                    }
                                                })
                                            }
                                        } else {

                                            if (element && element.recurring_dates != '' && element.recurring_dates != null) {
                                                const dates = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))

                                                element.recurring_dates = JSON.parse(element.recurring_dates);
                                                element?.recurring_dates?.forEach(dd => {
                                                    let yourDate1: Date = new Date(dd.date_from)
                                                    let dt1: string = yourDate1.toISOString().split('T')[0];
                                                    let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                    let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                    let rrEvents1: Courses = {
                                                        "id": element.id,
                                                        "schedule": element.schedule,
                                                        "official_club_date": element.official_club_date,
                                                        "type": element.type,
                                                        "instructor_type": element.instructor_type,
                                                        "name": element.name,
                                                        "course_image": element.course_image[0]?.course_image,
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
                                                    if (dt1 == self.todays_date) {
                                                        self.currentCourse.push(rrEvents1);
                                                        self.currentCourseList.push(rrEvents1);
                                                    } else if (dt1 > self.todays_date) {
                                                        self.upcomingCourse.push(rrEvents1);
                                                        self.upcomingCourseList.push(rrEvents1);
                                                    }
                                                    if ((self.allCourses.length == 0)) {
                                                        self.notificationService.showError(self.language.create_faq.search_not_found, null);
                                                        setTimeout(() => {
                                                            self.reSet();
                                                        }, 3000);
                                                    }
                                                });
                                            } else {
                                                const dates = this.commonFunctionService.getDates(new Date(element.date_from), new Date(element.date_to))
                                                dates.forEach(dd => {
                                                    let yourDate1: Date = new Date(dd)
                                                    let dt1: string = yourDate1.toISOString().split('T')[0];
                                                    let rrDate1: string = dt1 + "T" + element.date_from.split("T")["1"];
                                                    let rrDateEnd1: string = element.date_to.split("T")["0"] + "T" + element.date_to.split("T")["1"];
                                                    let rrEvents1: Courses = {
                                                        "id": element.id,
                                                        "schedule": element.schedule,
                                                        "official_club_date": element.official_club_date,
                                                        "type": element.type,
                                                        "instructor_type": element.instructor_type,
                                                        "name": element.name,
                                                        "course_image": element.course_image[0]?.course_image,
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
                                                    if (dt1 == self.todays_date) {
                                                        self.currentCourse.push(rrEvents1);
                                                        self.currentCourseList.push(rrEvents1);
                                                    } else if (dt1 > self.todays_date) {
                                                        self.upcomingCourse.push(rrEvents1);
                                                        self.upcomingCourseList.push(rrEvents1);
                                                    }
                                                    if ((self.allCourses.length == 0)) {
                                                        self.notificationService.showError(self.language.create_faq.search_not_found, null);
                                                        setTimeout(() => {
                                                            self.reSet();
                                                        }, 3000);
                                                    }
                                                });
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
                                    let self = this;
                                    if (self.allUsers?.length > 0) {
                                        self.allUsers.forEach(el => {
                                            if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
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
                                    if (self.allUsers?.length > 0) {
                                        self.allUsers.forEach(el => {
                                            if (element?.CourseInternalInstructor[0]?.internalUsers.id) {
                                                if (el.id == element?.CourseInternalInstructor[0]?.internalUsers.id) {
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

                            } else {
                                this.notificationService.showError(this.language.create_faq.search_not_found, null);

                                setTimeout(() => {
                                    this.reSet();
                                }, 3000);
                            }
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        };
                    }
                );
        } else {
            this.notificationService.showError(this.language.instructor.text_for_search, null);
            setTimeout(() => {
                this.reSet();
            }, 3000);
        }
    }

    reSet() {
        this.instuctorTypeDropdownList = [];
        this.getInstructorForm.controls['instructor_type'].setValue('');
        this.getInstructorForm.controls["instructor_external"].setValue('');
        this.getInstructorForm.controls["instructor_internal"].setValue('');
        this.instrucType = null;
        this.instuctorTypeDropdownList = [
            { item_id: 1, item_text: this.language.courses.internal },
            { item_id: 2, item_text: this.language.courses.external },
        ]
        this.getAllCourses()
    }

    checkFor(arrayOfObject: any) {
        if (arrayOfObject.some(obj => (obj.user_id === this.userDetails.userId && obj.approved_status === 0))) {
            return true;
        } else if (arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 2)) { return false } else {
            return true
        }
    }

    checkForWaiting(arrayOfObject: any) {
        if (arrayOfObject.some(obj => obj.user_id === this.userDetails.userId && obj.approved_status === 2)) {
            return true;
        } else { return false }
    }

    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "courseActive" : check == 2 ? "instructorActive" : check == 3 ? "roomActive" : "courseActive";
    }

    /**
* Function is used to download document
* @author  MangoIt Solutions
* @param   {path}
*/
    download(path: any) {
        let data = {
            name: path
        }
        this.dowloading = true;
        var endPoint = 'get-documentbyname';
        if (data && data.name) {
            let filename = data.name.split('/').reverse()[0];
            this.authService.downloadDocument('post', endPoint, data).toPromise()
                .then((blob: any) => {
                    saveAs(blob, filename);
                    this.authService.setLoader(false);
                    this.dowloading = false;
                    setTimeout(() => {
                        this.authService.sendRequest('post', 'document-delete/uploads', data).subscribe((result: any) => {
                            this.result = result;
                            this.authService.setLoader(false);
                            if (this.result.success == false) {
                                this.notificationService.showError(this.result['result']['message'], null);
                            } else if (this.result.success == true) {
                                this.documentData = this.result['result']['message'];
                            }
                        })
                    }, 7000);
                })
                .catch(err => {
                    this.responseMessage = err;
                })
        }
    }


    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
