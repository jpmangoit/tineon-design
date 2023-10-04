import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { LanguageService } from '../../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CourseByExternalInstructor, Instructors } from 'src/app/models/instructors.model';
import { CreateAccess, UserAccess } from 'src/app/models/user-access.model';
import { appSetting } from 'src/app/app-settings';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-instructor',
    templateUrl: './instructor.component.html',
    styleUrls: ['./instructor.component.css'],
})

export class InstructorComponent implements OnInit, OnDestroy {
    language: any;
    userDetails: LoginDetails;
    editInstructorForm: UntypedFormGroup;
    getInTouchInstructorForm: UntypedFormGroup;
    qualificationList: UntypedFormArray;
    weekdayList: UntypedFormArray;
    formSubmit: boolean = false;
    imgErrorMsg: boolean;
    responseMessage: string = '';
    responseMessage1: string = '';
    searchForm: UntypedFormGroup;
    searchSubmit: boolean = false;
    responseMessage2: string;
    file: File;
    fileToReturn: File;
    imageName: string;
    weekdayArray: { name: any; id: number; }[];
    selectDay: string[] = [];
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    displayCourse: boolean;
    displayInstructor: boolean = true;
    displayRoom: boolean;
    indax: number;
    teamId: number;
    totalRecord: number = 0;
    totalInstructor: number = 0;
    editId: number;
    imageShow: string;
    setTheme: ThemeType;
    coursesTypeDropdownSettings: IDropdownSettings;
    weekdayDropdownSettings: IDropdownSettings;
    currentPageNmuber: number = 1;
    itemPerPage: number = 4;
    // itemPerPage: number = 8;
    totalPages: any
    limitPerPage: { value: string }[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' },
        { value: '40' },
    ];
    private activatedSub: Subscription;
    instructorData: Instructors[];
    instructorById: Instructors;
    CourseByExternalInstructorId: CourseByExternalInstructor[] = [];
    searchData: Instructors[];
    userAccess: UserAccess;
    createAccess: CreateAccess;
    userRole: string;
    thumbnail: string;
    memberid: any;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    instructorCalendar: any;
    calendarOptions: CalendarOptions;
    selectLanguage: string;
    minDate: any;
    allExternlCalndr: any[];
    allWeekDayArray: any[];
    allWeekDayArrayName: any[];
    instruct_img: any;
    idx: number;

    constructor(
        private formbuilder: UntypedFormBuilder,
        private lang: LanguageService,
        private router: Router,
        private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private authService: AuthServiceService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(
                localStorage.getItem('club_theme')
            );
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe(
            (resp: ThemeType) => {
                this.setTheme = resp;
            }
        );

        this.language = this.lang.getLanguaageFile();
        this.selectLanguage = localStorage.getItem('language');
        if (this.selectLanguage == 'sp') {
            this.selectLanguage = 'es'
        }
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[this.userRole].create;
        this.teamId = this.userDetails.team_id;
        this.getAllInstructor(1);

        this.editInstructorForm = this.formbuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', Validators.required],
            emaill: ['', [Validators.required, Validators.email]],
            phone_no: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),],],
            address: ['', Validators.required],
            courses_type: [''],
            add_img: [''],
            author: [this.userDetails.userId],
            approved_status: [''],
            weekdays: this.formbuilder.array([
                this.formbuilder.group({
                    day: ['', Validators.required],
                    time_from: ['', Validators.required],
                    time_to: ['', Validators.required],
                }),
            ]),
            qualifications: this.formbuilder.array([
                this.formbuilder.control('', Validators.required),
            ]),
            active_from: ['', Validators.required],
            active_to: ['', Validators.required],
        });

        this.getInTouchInstructorForm = this.formbuilder.group({
            subject: ['', Validators.required],
            body: ['', Validators.required],
            sender_email: [''],
            receiver_id: [''],
            sender_id: [''],
            receiver_email: ['', Validators.required],
            first_name: [''],
            last_name: [''],
        });

        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(''),
        });

        this.allWeekDayArray = [
            this.language.new_create_event.sunday,
            this.language.new_create_event.monday,
            this.language.new_create_event.tuesday,
            this.language.new_create_event.wednesday,
            this.language.new_create_event.thrusday,
            this.language.new_create_event.friday,
            this.language.new_create_event.saturday
        ];

        this.weekdayArray = [
            { id: 1, name: this.language.new_create_event.monday },
            { id: 2, name: this.language.new_create_event.tuesday },
            { id: 3, name: this.language.new_create_event.wednesday },
            { id: 4, name: this.language.new_create_event.thrusday },
            { id: 5, name: this.language.new_create_event.friday },
            { id: 6, name: this.language.new_create_event.saturday },
            { id: 0, name: this.language.new_create_event.sunday },
        ];

        this.allWeekDayArrayName = [
            { id: 0, name: ["Sonntag", "Sunday", "dimanche", "domenica", "Воскресенье", "domingo", "Pazar"] },
            { id: 1, name: ["Montag", "Monday", "lundi", "lunedì", "понедельник", "lunes", "Pazartesi"] },
            { id: 2, name: ["Dienstag", "Tuesday", "mardi", "martedì", "вторник", "martes", "Salı"] },
            { id: 3, name: ["Mittwoch", "Wednesday", "mercredi", "mercoledì", "среда", "miércoles", "Çarşamba"] },
            { id: 4, name: ["Donnerstag", "Thursday", "jeudi", "giovedì", "четверг", "jueves", "Perşembe"] },
            { id: 5, name: ["Freitag", "Friday", "vendredi", "venerdì", "Пятница", "viernes", "Cuma"] },
            { id: 6, name: ["Samstag", "Saturday", "samedi", "sabato", "Суббота", "sábado", "Cumartesi"] }
        ]

        this.weekdayDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            allowSearchFilter: false,
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        //this code for the set angular calendar initial weekly beacuse bydefault the calendar visible on monthly
        this.calendarOptions = {
            initialView: 'timeGridWeek',
        };
    }

    get qualifications() {
        return this.editInstructorForm.get('qualifications') as UntypedFormArray;
    }

    /**
    * Function is used to add qualification
    * @author  MangoIt Solutions
    */
    addQualifications() {
        if (this.qualifications.valid) {
            this.qualifications.push(this.formbuilder.control('', Validators.required));
        }
    }

    /**
    * Function is used to remove qualification
    * @author  MangoIt Solutions
    */
    removeQualification(index) {
        this.qualifications.removeAt(index);
    }

    get weekdays() {
        return this.editInstructorForm.get('weekdays') as UntypedFormArray;
    }

    /**
    * Function is used to add day and time
    * @author  MangoIt Solutions
    */
    addAvailableTimes() {
        if (this.errorTime.isError == false) {
            if (this.weekdays.valid) {
                const newAvailableTimes: UntypedFormGroup = this.formbuilder.group({
                    day: ['', Validators.required],
                    time_from: ['', Validators.required],
                    time_to: ['', Validators.required],
                });
                this.weekdays.push(newAvailableTimes);
            }
        }
    }

    /**
    * Function is used to remove day and time
    * @author  MangoIt Solutions
    */
    removeAvailableTimes(index) {
        this.errorTime = { isError: false, errorMessage: '' };
        this.weekdays.removeAt(index);
    }

    onWeekdayItemSelect(item: any) {
        this.selectDay.push(item.id);
    }

    onWeekdayItemDeSelect(item: string) {
        this.selectDay = [];
    }

    /**
    * Function is used to select course tab
    * @author  MangoIt Solutions
    */
    onCourse() {
        this.displayCourse = true;
        this.displayInstructor = false;
        this.displayRoom = false;
    }

    /**
    * Function is used to select Instructor tab
    * @author  MangoIt Solutions
    */
    onInstructor() {
        this.displayCourse = false;
        this.displayInstructor = true;
        this.displayRoom = false;
    }

    /**
    * Function is used to select room tab
    * @author  MangoIt Solutions
    */
    onRoom() {
        this.displayCourse = false;
        this.displayInstructor = false;
        this.displayRoom = true;
    }

    /**
    * Function to get all the  Instructors
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the Instructors
    */
    getAllInstructor(item: any) {
        this.currentPageNmuber = item;
        this.authService.setLoader(true);
        this.authService.memberSendRequest('post', 'getInstructor/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.instructorData = respData['result']['instructor'];
                    this.instructorData.forEach((element: any) => {
                        if (element['instructor_image'][0]?.['instructor_image']) {
                            element['instructor_image'][0]['instructor_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['instructor_image'][0]?.['instructor_image'].substring(20))) as string;
                        }
                    })
                    this.totalInstructor = respData['result'].pagination.rowCount;
                    // this.totalPages = Math.ceil(this.instructorData.length / this.itemPerPage);
                    this.totalPages = Math.ceil(this.totalInstructor / this.itemPerPage);

                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            });
    }

    /**
     * Returns object Data.
     * @author  MangoIt Solutions
     * @return {object} returns {Search Filter Data} The new Instructor object.
     */
    onSearch(item: any) {
        this.searchSubmit = true;
        let searchValue: string = this.searchForm.value.search;
        if (searchValue) {
            this.searchSubmit = false;
            this.currentPageNmuber = item;
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'getInstructor/' + this.currentPageNmuber + '/' + this.itemPerPage, this.searchForm.value)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.searchData = null;
                        this.instructorData = null;
                        this.totalInstructor = 0;
                        this.searchData = respData['result']['instructor'];
                        this.instructorData = respData['result']['instructor'];
                        this.instructorData.forEach((element: any) => {
                            if (element['instructor_image'][0]?.['instructor_image']) {
                                element['instructor_image'][0]['instructor_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['instructor_image'][0]?.['instructor_image'].substring(20))) as string;
                            }
                        })
                        this.totalInstructor = respData['result'].pagination.rowCount;
                        this.totalPages = Math.ceil(this.totalInstructor / this.itemPerPage);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        } else {
            this.notificationService.showError(this.language.instructor.text_for_search, null);
        }
    }

    /**
    * Function is used to reset form
    * @author  MangoIt Solutions
    * @param {}
    * @return {}
    */
    reSet() {
        this.searchForm.get('search').clearValidators();
        this.searchForm.get('search').updateValueAndValidity();
        this.searchForm.reset();
        this.searchData = [];
        this.getAllInstructor(1);
    }

    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    // pageChanged(event: number) {
    //     this.currentPageNmuber = event;
    //     if (this.searchData?.length > 0) {
    //         this.onSearch();
    //     } else {
    //         this.getAllInstructor();
    //     }
    // }
    pageChanged(event: number) {
        if (event === -1) {
            // Previous button clicked
            this.currentPageNmuber--;
        } else if (event === 1) {
            // Next button clicked
            this.currentPageNmuber++;
        }
        if (this.searchData?.length > 0) {
            this.onSearch(this.currentPageNmuber);
        } else {
            this.getAllInstructor(this.currentPageNmuber);
        }
    }


    /**
    * Function is used for pagination
    * @author  MangoIt Solutions
    */
    goToPg(eve: number) {
        // this.responseMessage = null;
        if (isNaN(eve)) {
            eve = this.currentPageNmuber;
        } else {
            if (eve > Math.round(this.totalInstructor / this.itemPerPage)) {
                this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
            } else {
                this.currentPageNmuber = eve;
                if (this.searchData?.length > 0) {
                    this.onSearch(this.currentPageNmuber);
                } else {
                    this.getAllInstructor('');
                }
            }
        }
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
        if (this.searchData?.length > 0) {
            this.onSearch('');
        } else {
            this.getAllInstructor('');
        }
    }

    /**
    * Function to Instructors details by Id
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object}  Instructor details
    */
    getInstructorById(id: number, type: any) {
        this.croppedImage = '';
        this.imageShow = '';
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getInstructorById/' + id, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.instructorById = respData['result'];
                    this.memberid = this.instructorById.user.member_id;
                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                        .subscribe(
                            (respData: any) => {
                                this.authService.setLoader(false);
                                this.thumbnail = respData;
                            },
                            (error: any) => {
                                this.thumbnail = null;
                            });

                    if (this.instructorById.instructor_image.length == 0 ||
                        (this.instructorById.instructor_image[0]['instructor_image'] == '' || this.instructorById.instructor_image[0]['instructor_image'] == null)) {
                        this.imageShow = '../../assets/img/no_image.png';
                    } else {
                        if (this.instructorById.instructor_image[0]?.['instructor_image']) {
                            this.instruct_img = this.instructorById.instructor_image[0]['instructor_image'];
                            this.instructorById.instructor_image[0]['instructor_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.instructorById.instructor_image[0]['instructor_image'].substring(20)));
                            this.imageShow = this.instructorById.instructor_image[0]['instructor_image'];
                        }
                    }
                    this.editId = this.instructorById.id;
                    setTimeout(() => {
                        this.externalInstructorCalendar(this.instructorById);
                    }, 500);
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
                if (type == "edit") {
                    this.setInstructorValue();
                }
            });
    }

    externalInstructorCalendar(instructorById: any) {
        //    this.instructorCalendar =  this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.allExternlCalndr = this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.instructorCalendar = this.allExternlCalndr[0].cal;
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            slotDuration: '00:02:30', // length of time slots
            allDaySlot: false, // display all-day events in a separate all-day slot
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            firstDay: 1,
            weekends: true,
            editable: false,
            selectable: false,
            selectMirror: false,
            eventClick: this.handleEventClick.bind(this),
            dateClick: this.handleDateClick.bind(this),
            events: this.instructorCalendar,
            locale: this.selectLanguage,
            eventTextColor: 'black',
            eventDisplay: 'list-item',
            expandRows: true,
            displayEventTime: true,
            displayEventEnd: true,
            height: 500,
            dayMaxEventRows: 2,
            eventOverlap: true,
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
            }
        };
        this.authService.setLoader(false);

    }


    handleEventClick(arg) {
        if (arg.event['_def'].publicId && arg.event['_def']['extendedProps']['date_start'] && arg.event['_def']['extendedProps']['type']) {
            this.viewDetails(arg.event['_def'].publicId, arg.event['_def']['extendedProps']['date_start'], arg.event['_def']['extendedProps']['type'])
        }
    }

    handleDateClick(arg) {
        console.log(arg.date);
    }

    /**
    * Function to redirect the user with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (R)
    * @param   {id , date}
    * @return  {}
    */
    viewDetails(id: any, date: any, type: any) {
        $('#view-rooms').modal('hide');
        if (type == 'course') {
            const url = '/course-detail/' + id;
            const queryParams = { date: new Date(date).toISOString().split('T')[0] };
            const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
            const fullUrl = url + '?' + queryString;
            // Use window.open() to redirect to the URL in a new tab
            window.open(fullUrl);
        } else {
            const url = '/event-detail/' + id;
            const queryParams = { date: new Date(date).toISOString().split('T')[0] };
            const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
            const fullUrl = url + '?' + queryString;
            // Use window.open() to redirect to the URL in a new tab
            window.open(fullUrl);
        }
    }

    /**
    * Function to set Instructors value in form feilds
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    setInstructorValue() {
        this.editInstructorForm.controls['author'].setValue(this.instructorById.author);
        this.editInstructorForm.controls['approved_status'].setValue(this.instructorById.approved_status);
        this.editInstructorForm.controls['first_name'].setValue(this.instructorById.first_name);
        this.editInstructorForm.controls['last_name'].setValue(this.instructorById.last_name);
        this.editInstructorForm.controls['emaill'].setValue(this.instructorById.emaill);
        this.editInstructorForm.controls['phone_no'].setValue(this.instructorById.phone_no);
        this.editInstructorForm.controls['address'].setValue(this.instructorById.address);

        this.editInstructorForm.controls['add_img'].setValue(this.instruct_img);

        this.editInstructorForm.controls['active_from'].setValue(this.instructorById.active_from);
        this.editInstructorForm.controls['active_to'].setValue(this.instructorById.active_to);
        this.getInTouchInstructorForm.controls['receiver_email'].setValue(this.instructorById.emaill);
        this.getInTouchInstructorForm.controls['receiver_id'].setValue(this.instructorById.id);
        this.getInTouchInstructorForm.controls['sender_email'].setValue(this.userDetails.email);
        this.getInTouchInstructorForm.controls['sender_id'].setValue(this.userDetails.userId);
        this.getInTouchInstructorForm.controls['first_name'].setValue(this.instructorById.first_name);
        this.getInTouchInstructorForm.controls['last_name'].setValue(this.instructorById.last_name);

        if (this.instructorById?.course_external_instructor.length > 0) {
            this.getCourseDetails(this.instructorById.course_external_instructor);
        }

        this.weekdays.reset();
        this.qualifications.reset();
        //------------Qualification-----------
        for (let i = 0; i < this.instructorById.qualification.length; i++) {
            this.qualifications.removeAt(i);
            if (this.qualifications.value[i] == null) {
                this.qualifications.removeAt(i);
            }
        }
        this.qualifications.removeAt(0);
        if (this.instructorById && this.instructorById.qualification.length > 0) {
            this.instructorById.qualification.forEach((element) => {
                this.qualifications.push(
                    this.formbuilder.control(element.qualification)
                );
            });
        }
        this.weekdays.reset();
        //-------------------weekdays-------------
        for (let i = 0; i < this.instructorById.availablity.length; i++) {
            this.weekdays.removeAt(i);
            if (
                this.weekdays.value[i] && this.weekdays.value[i].day == null &&
                this.weekdays.value[i].time_from == null && this.weekdays.value[i].time_to == null
            ) {
                this.weekdays.removeAt(i);
            }
        }
        this.weekdays.removeAt(0);

        if (this.instructorById && this.instructorById.availablity.length > 0) {
            this.instructorById.availablity.forEach((key, value) => {
                if (key.time_from.includes(':00') && key.time_to.includes(':00')) {
                    key.time_from = key.time_from.slice(0, 5)
                    key.time_to = key.time_to.slice(0, 5)
                }
                let instructor_info = [];
                instructor_info.push({ id: key.weekday, name: this.allWeekDayArray[this.getDayId(key.weekday)] });
                const newAvailableTimes: UntypedFormGroup = this.formbuilder.group({
                    day: [instructor_info, Validators.required],
                    time_from: [key.time_from, Validators.required],
                    time_to: [key.time_to, Validators.required],
                });
                this.weekdays.push(newAvailableTimes);
            });
        }
    }

    /**
    * Function to set Instructors value in form date feilds and call update API
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    editInstructor() {
        this.formSubmit = true;
        this.authService.setLoader(true);
        // for (let i = 0; i < this.editInstructorForm.controls.weekdays.value.length; i++) {
        //     this.editInstructorForm.value.weekdays[i].day = (this.editInstructorForm.controls.weekdays.value[i].day[0].length == 1) ? this.editInstructorForm.controls.weekdays.value[i].day : this.editInstructorForm.controls.weekdays.value[i].day[0];
        // }
        if (this.editInstructorForm.valid && this.errorTime['isError'] == false) {
            for (let i = 0; i < this.editInstructorForm.controls.weekdays.value.length; i++) {
                this.editInstructorForm.value.weekdays[i].day = this.editInstructorForm.controls.weekdays.value[i].day[0].id;
            }
            this.editInstructorForm.value['team_id'] = this.teamId;
            if (this.fileToReturn) {
                this.editInstructorForm.value['add_img'] = this.fileToReturn;
            } else {
                this.editInstructorForm.value['add_img'] = this.instruct_img;
            }
            var formData: FormData = new FormData();
            let self = this;
            for (const key in this.editInstructorForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.editInstructorForm.value, key)) {
                    const element = this.editInstructorForm.value[key];
                    if (key == 'first_name') {
                        formData.append('first_name', element);
                    }
                    if (key == 'last_name') {
                        formData.append('last_name', element);
                    }
                    if (key == 'emaill') {
                        formData.append('emaill', element);
                    }
                    if (key == 'phone_no') {
                        formData.append('phone_no', element);
                    }
                    if (key == 'address') {
                        formData.append('address', element);
                    }
                    if (key == 'add_img') {
                        formData.append('file', element);
                    }
                    if (key == 'qualifications') {
                        formData.append('qualifications', JSON.stringify(element));
                    }
                    if (key == 'weekdays') {
                        formData.append('weekdays', JSON.stringify(element));
                    }
                    if (key == 'team_id') {
                        formData.append('team_id', element);
                    } else {
                        if ((key != 'first_name') && (key != 'last_name') && (key != 'emaill') && (key != 'phone_no') && (key != 'address') && (key != 'add_img') && (key != 'qualifications')
                            && (key != 'weekdays') && (key != 'team_id')) {
                            formData.append(key, element);
                        }
                    }
                }
            }

            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'updateInstructor/' + this.editId, formData)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout(function () {
                            $('#edit_instructor').modal('hide');
                            self.router.navigate(['/instructor-detail/' + self.editId]);
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0];

    }

    /**
    * Function is used to get end date
    * @author  MangoIt Solutions
    */
    getEndDate() {
        this.editInstructorForm.get('active_from').valueChanges.subscribe((value) => {
            this.minDate = value;
        });
        if (this.minDate != undefined) {
            return this.minDate
        } else {
            return this.getToday()
        }
    }


    /**
     * Return responseMessage.
     *@return {response} return the success Message for send Mail.
     */
    getInTouchInstructor() {
        this.formSubmit = true;
        var formData: FormData = new FormData();
        this.authService.setLoader(false);
        let self = this;
        for (const key in this.getInTouchInstructorForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.getInTouchInstructorForm.value, key)) {
                const element = this.getInTouchInstructorForm.value[key];
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
                if (key == 'first_name') {
                    formData.append('first_name', element);
                }
                if (key == 'last_name') {
                    formData.append('last_name', element);
                }
            }
        }

        if (this.getInTouchInstructorForm.valid) {
            this.authService.setLoader(true);
            let self = this
            this.authService.memberSendRequest('post', 'instructor/sendmail', this.getInTouchInstructorForm.value)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result'], null);
                        this.getAllInstructor(this.currentPageNmuber);
                        setTimeout(function () {
                            self.goBack();
                            $('#get-in-touch-instructor').modal('hide');
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }

    /**
    * Function is used delete Instructor by Id
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {string} success message
    */
    deleteInstructor(id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_instructor, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteInstructor/' + id, null).subscribe((respData: any) => {
                self.authService.setLoader(false);
                if (respData['isError'] == false) {
                    self.responseMessage = respData['result']['message'];
                    self.notificationService.showSuccess(self.responseMessage, null);
                    setTimeout(function () {
                        self.getAllInstructor(this.currentPageNmuber);
                    }, 3000);
                } else if (respData['code'] == 400) {
                    self.responseMessage = respData['message'];
                    self.notificationService.showError(self.responseMessage, null);
                }
            });
        }, function () { }
        );
    }

    /**
    * Function is used to compare two time
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {string} success message
    */
    errorTime: { isError: boolean; errorMessage: string } = { isError: false, errorMessage: '' };
    // compareTwoTimes(item: number) {
    //     this.indax = item;
    //     this.errorTime = { isError: false, errorMessage: '' };
    //     for (let i = 0; i < this.editInstructorForm?.controls?.weekdays?.value?.length; i++) {
    //         if (this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] > this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_to'] ||
    //             this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] == this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_to']
    //         ) {
    //             this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same, };
    //             return this.indax;
    //         } else {
    //             this.errorTime = { isError: false, errorMessage: '' };
    //         }
    //     }
    // }

    compareTwoTimes(item: any) {
        this.indax = item;
        this.idx = item
        this.errorTime = { isError: false, errorMessage: '' };

        for (let i = 0; i < this.editInstructorForm?.controls?.weekdays?.value.length; i++) {
            if ((this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] != "" && this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_to'] != "") &&
                (this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] > this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_to']) ||
                (this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] == this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_to'])) {
                this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same };
                return this.indax;
            } else {
                this.errorTime = { isError: false, errorMessage: '' };
            }
            for (let j = 0; j < this.editInstructorForm.value?.weekdays?.length; j++) {
                if (this.editInstructorForm?.controls?.weekdays?.value[i]?.['day'][0] == this.editInstructorForm.controls.weekdays.value[j]['day'][0]) {
                    if (((i != j) && this.editInstructorForm?.controls?.weekdays?.value[i]?.['time_from'] < this.editInstructorForm.controls.weekdays.value[j]['time_to'])) {
                        this.errorTime = { isError: true, errorMessage: this.language.error_message.sameTimeNotSelect };
                        return this.idx;
                    }
                }
            }
        }
    }

    goBack() {
        this.formSubmit = false;
        this.getInTouchInstructorForm.reset();
        $('#edit_instructor').modal('hide');
        $('#get-in-touch-instructor').modal('hide');
    }


    /**
    * Function is used to get Course details
    * @author  MangoIt Solutions
    * @param   {Course object}
    * @return  {array of object} return course object
    */

    getCourseDetails(courseDetails: any) {
        this.CourseByExternalInstructorId = [];
        courseDetails && courseDetails.forEach((element, key) => {
            var url: string[] = [];
            if (element.coursesExIns.picture_video) {
                url = element.coursesExIns.picture_video.split('"');
                if (url && url.length > 0) {
                    url.forEach((el) => {
                        if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                            element.coursesExIns.picture_video = el;
                        }
                    });
                } else {
                    element.coursesExIns['picture_video'] = '';
                }
            }
            this.CourseByExternalInstructorId[key] = element.coursesExIns;
        });
    }

    /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    uploadFile(event: Event) {
        var file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
            const mimeType: string = file.type;
            if (mimeType.match(/image\/*/) == null) {
                this.errorImage = {
                    isError: true,
                    errorMessage: this.language.error_message.common_valid,
                };
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 2000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event);
            }
        }
    }

    fileChangeEvent(event: Event): void {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        this.imageChangedEvent = event;
        this.file = (event.target as HTMLInputElement).files[0];
        var mimeType: string = this.file.type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = {
                isError: true,
                errorMessage: this.language.error_message.common_valid,
            };
        }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                this.imgWidth = img.width;
                this.imgHeight = img.height;
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(this.file);
    }

    /**
    * Function is used to cropped and compress the uploaded image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} file object
    */

    imageCropped(event: ImageCroppedEvent) {
        let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage, -1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.editInstructorForm.patchValue({ add_img: this.fileToReturn });
                    this.editInstructorForm.get('add_img').updateValueAndValidity();
                    $('.preview_txt').show(this.fileToReturn.name);
                    $('.preview_txt').text(this.fileToReturn.name);
                }
            );
    }

    imageLoaded() { }

    cropperReady() {
        /* cropper ready */
        this.isImage = false;
    }

    loadImageFailed() {
        /* show message */
    }

    getDayName(id: any) {
        if (!isNaN(id)) {
            return this.allWeekDayArray[id];
        } else {
            let obj = this.allWeekDayArrayName.find(o => o.name.includes(id));
            if (obj?.name) {
                return this.allWeekDayArray[obj.id];
            } else {
                return id;
            }
        }
    }

    getDayId(id: any) {
        if (!isNaN(id)) {
            return id;
        } else {
            let obj = this.allWeekDayArrayName.find(o => o.name.includes(id));
            if (obj?.name) {
                return obj.id;
            } else {
                return id;
            }
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
