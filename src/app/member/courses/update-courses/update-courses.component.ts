import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl } from '@angular/forms';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DatePipe } from '@angular/common';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { Room } from 'src/app/models/room.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { RRule, Frequency } from 'rrule';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

declare var $: any;

@Component({
    selector: 'app-update-courses',
    templateUrl: './update-courses.component.html',
    styleUrls: ['./update-courses.component.css'],
    providers: [DatePipe]
})

export class UpdateCoursesComponent implements OnInit, OnDestroy {
    language: any;
    eventPriceDisplay: boolean = false;
    hasPicture: boolean = false;
    isCustom: boolean = false;
    checkNum: boolean = false;
    endDateRepeat: boolean = false;
    eventSubmitted: boolean = false;
    recurrenceDropdownField: boolean = false;
    courseForm: UntypedFormGroup;
    responseMessage: string = null;
    courseId: number;
    imageUrl: string;
    fileUrl: string = '';
    picVid1: any = '';
    recurrenceSelected: number;
    customRecurrenceTypeSelected: any;
    todayName: string;
    isRecurred: string;
    alluserDetails: UserDetails[] = [];
    finalCustomRecurrence: string;
    untilString: string = '';
    recurrenceString: string = "";
    datearr: number[] = [];
    datearrcustom: number[] = [];
    weekDayTypeSelected: number[] = [];
    visibility: number;
    eventImage: string;
    eventFile: string;
    image: string;
    instrucType: number;
    roomSelected: number;
    romData: Room[] = [];
    selectedRoom: Room;
    userDetails: LoginDetails;
    mustMatchs: number;
    teamId: number;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    file: File;
    fileToReturn: File;
    fileAndimage: string[] = [];
    setTheme: ThemeType;
    userSelected: number[] = [];
    setEventParticipants: { id: number, name: string }[] = [];
    internal: { id: number, name: string }[];
    external: { id: number, name: string }[];
    exitsRoom: { id: number, name: string }[] = [];
    groupGet: { group_id: number, name: string }[] = [];
    courseDetails: any;
    typerecc: string = ''
    interval: string = ''
    byDay: string = ''
    dateRepeat: string = '';
    checkRecc: boolean = false;
    naturalNumber: boolean = true;
    checkPric: boolean = false;
    recurrenceDropdownSettings: IDropdownSettings;
    customRecurrenceDropdownSettings: IDropdownSettings;
    visibilityDropdownSettings: IDropdownSettings;
    eventTypeDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    weekDayDropdownSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    instuctorTypeDropdownSettings: IDropdownSettings;
    internalDropdownSettings: IDropdownSettings;
    externalDropdownSettings: IDropdownSettings;
    roomDropdownSettings: IDropdownSettings;
    eventTypeDropdownList: { item_id: number, item_text: string }[] = [];
    visibilityDropdownList: { item_id: number, item_text: string }[] = [];
    customRecurrenceDropdownList: { item_id: number, item_text: string }[] = [];
    recurrenceDropdownList: { item_id: number, item_text: string }[] = [];
    userDropdownList: { id: number, name: string }[] = [];
    roomDropdownList: { id: number, name: string }[] = [];
    groupUserList: { user_id: any, approved_status: number }[] = [];
    weekDayDropdownList: { item_id: number, description: string }[] = [];
    externalInstructorList: { id: number, name: string }[] = [];
    instuctorTypeDropdownList: { item_id: number, item_text: string }[] = [];
    weekDaysArr: { item_id: number, description: string }[] = [];
    internalInstructor: { user_id: string }[] = [];
    externalInstructor: { instructor_id: number }[] = [];
    recurrenceType: { item_id: number, description: string }[] = [];
    group_dropdown: { group_id: number, name: string }[] = [];
    unapprovedParticipants: { id: any, username: string, firstname: string, lastname: string, email: string }[] = [];
    userObj: { user_id: any; approved_status: number }[] = [];
    typereccurenc: any[] = [];
    userId: string;
    private activatedSub: Subscription;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    calendarClicked: boolean = false;
    calendarEventClicked: boolean = false;
    calendarOptions: CalendarOptions;
    calendarOptionsTimeGrid: CalendarOptions;
    selectLanguage: string;
    calendarRooms: any[] = [];
    roomsByIdData: any
    date_end: string;
    courseDates: Date[] = [];
    todays_date: string;
    date: Date;
    course_allDates: Date[] = [];
    newGroupList: { user_id: any; approved_status: number; }[] = [];
    isTaskField: boolean = false
    type_dropdown: { id: number; name: string }[] = [];
    typeDropdownSettings: IDropdownSettings;
    type_visibility: number;
    showUsers: boolean;
    participantSelectedToShow: { id: number; user_name: string }[] = [];
    user_dropdown: { id: number; user_name: string }[] = [];
    participantDropdownSettings: IDropdownSettings;
    participantSelectedItem: number[] = [];
    task_user_selected: any[] = [];
    task_group_dropdown: any[];
    taskgroupDropdownSettings: IDropdownSettings;
    groups: { group_id: number; name: string; }[];
    setTaskUsers: any[] = [];
    taskStatus: any;
    taskId: any;
    errorDateTask = { isError: false, errorMessage: '' }
    taskEditorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        fonts: [
            { class: 'gellix', name: 'Gellix' },
        ],
        toolbarHiddenButtons: [
            [
                'link',
                'unlink',
                'subscript',
                'superscript',
                'insertUnorderedList',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode',
                'insertImage',
                'insertVideo',
                'italic',
                'fontSize',
                'undo',
                'redo',
                'underline',
                'strikeThrough',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
                'heading',
                'textColor',
                'backgroundColor',
                'customClasses',
                'insertOrderedList',
                'fontName'
            ]
        ],
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p'
    };
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        fonts: [
            { class: 'gellix', name: 'Gellix' },
        ],
        toolbarHiddenButtons: [
            [
                'link',
                'unlink',
                'subscript',
                'superscript',
                'insertUnorderedList',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode',
                'insertImage',
                'insertVideo',
                'italic',
                'fontSize',
                'undo',
                'redo',
                'underline',
                'strikeThrough',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
                'heading',
                'textColor',
                'backgroundColor',
                'customClasses',
                'insertOrderedList',
                'fontName'
            ]
        ],
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p'
    };
    matchDateError: any = { isError: false, errorMessage: '' };
    matchInstrctDateError: any = { isError: false, errorMessage: '' };
    instructorCalendar: any[];
    calendarOptionsExternal: CalendarOptions
    instructorById: any;
    allRoomCalndr: any[];
    allExternlCalndr: any[];
    customReccDateError: { isError: boolean; errorMessage: string; } = { isError: false, errorMessage: '' };

    result: any;
    documentData: any;
    dowloading: boolean = false;

    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private _router: Router,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private confirmDialogService: ConfirmDialogService,
        private commonFunctionService: CommonFunctionService,
        private datePipe: DatePipe,
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
        this.selectLanguage = localStorage.getItem('language');
        if (this.selectLanguage == 'sp') {
            this.selectLanguage = 'es'
        }
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        this.getCourseOtherInfo();
        this.route.params.subscribe(params => {
            const eventid: number = params['courseId'];
            this.courseId = params['courseId'];
            setTimeout(function () {
                $('.trigger_class').trigger('click');
            }, 4000);
        });

        this.userId = localStorage.getItem('user-id');
        this.eventTypeDropdownList = [
            { item_id: 4, item_text: this.language.create_event.courses },
        ];

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

        this.visibilityDropdownList = [
            { item_id: 1, item_text: this.language.create_event.public },
            { item_id: 2, item_text: this.language.create_event.private },
            { item_id: 3, item_text: this.language.create_event.group },
            { item_id: 4, item_text: this.language.create_event.club }
        ];

        this.weekDayDropdownList = [
            { item_id: 0, description: this.language.new_create_event.sunday },
            { item_id: 1, description: this.language.new_create_event.monday },
            { item_id: 2, description: this.language.new_create_event.tuesday },
            { item_id: 3, description: this.language.new_create_event.wednesday },
            { item_id: 4, description: this.language.new_create_event.thrusday },
            { item_id: 5, description: this.language.new_create_event.friday },
            { item_id: 6, description: this.language.new_create_event.saturday }
        ];

        this.type_dropdown = [
            { id: 0, name: this.language.create_task.individual },
            { id: 1, name: this.language.create_task.group },
        ];

        this.typeDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };

        this.weekDayDropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'description',
            enableCheckAll: false,
        };

        this.eventTypeDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        this.visibilityDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        this.groupDropdownSettings = {
            singleSelection: true,
            idField: 'group_id',
            textField: 'name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            closeDropDownOnSelection: true
        };

        this.recurrenceDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        this.customRecurrenceDropdownList = [
            { item_id: 1, item_text: this.language.new_create_event.repeat_daily },
            { item_id: 2, item_text: this.language.new_create_event.repeat_weekly },
            { item_id: 3, item_text: this.language.new_create_event.repeat_monthly },
            { item_id: 4, item_text: this.language.new_create_event.repeat_yearly }
        ];

        this.customRecurrenceDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        this.recurrenceDropdownList = [
            { item_id: 0, item_text: this.language.new_create_event.does_not_repeat },
            { item_id: 1, item_text: this.language.new_create_event.every_day },
            { item_id: 2, item_text: this.language.new_create_event.every_week },
            { item_id: 3, item_text: this.language.new_create_event.every_month },
            { item_id: 4, item_text: this.language.new_create_event.every_year },
            { item_id: 5, item_text: this.language.new_create_event.custom }
        ];

        this.weekDaysArr = [
            { item_id: 0, description: "SU" },
            { item_id: 1, description: "MO" },
            { item_id: 2, description: "TU" },
            { item_id: 3, description: "WE" },
            { item_id: 4, description: "TH" },
            { item_id: 5, description: "FR" },
            { item_id: 6, description: "SA" }
        ];
        this.courseForm = new UntypedFormGroup({
            'name': new UntypedFormControl('', Validators.required),
            'place': new UntypedFormControl('', Validators.required),
            'type': new UntypedFormControl('course'),
            'date_from': new UntypedFormControl('', Validators.required),
            'date_to': new UntypedFormControl('', Validators.required),
            'date_repeat': new UntypedFormControl(''),
            'start_time': new UntypedFormControl('', Validators.required),
            'end_time': new UntypedFormControl('', Validators.required),
            'room': new UntypedFormControl(''),
            'visibility': new UntypedFormControl('', Validators.required),
            'participant': new UntypedFormControl(''),
            'show_guest_list': new UntypedFormControl(''),
            'chargeable': new UntypedFormControl(''),
            'description': new UntypedFormControl('', Validators.required),
            'course_users': new UntypedFormControl(''),
            'author': new UntypedFormControl(this.userId),
            'approved_status': new UntypedFormControl(''),
            'participants': new UntypedFormControl('participants'),
            'file': new UntypedFormControl(''),
            'recurrence': new UntypedFormControl('', Validators.required),
            'course_groups': new UntypedFormControl(''),
            'audience': new UntypedFormControl('1'),
            'customRecurrence': new UntypedFormControl(''),
            // 'price_per_participant': new UntypedFormControl('', Validators.pattern("^[0-9]*$")), 
            'price_per_participant': new UntypedFormControl('', [Validators.pattern("^[0-9]+([,.][0-9]{1,2})?$"), this.currencySymbolValidator()]),
            'allowed_persons': new UntypedFormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
            'instructor_type': new UntypedFormControl('', Validators.required),
            'instructor_internal': new UntypedFormControl('', Validators.required),
            'instructor_external': new UntypedFormControl('', Validators.required),
            'isTask': new UntypedFormControl('',),
            courseDate: this.formBuilder.array([
                this.formBuilder.group({
                    date_from: ['', Validators.required],
                    start_time: ['', Validators.required],
                    end_time: ['', Validators.required],

                }),
            ]),
            task: this.formBuilder.array([]),
            courseReccurance: new UntypedFormControl(''),
            instructorReccurance: new UntypedFormControl(''),
            in_instructorReccurance: new UntypedFormControl('')
        });
    }

    currencySymbolValidator() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;
            if (typeof value === 'string' && /[€$!@#%^&*]/.test(value)) {

                return { currencySymbol: true };
            }
            return null;
        };

    }

    get f() {
        return this.courseForm.controls;
    }

    get courseDate() {
        return this.courseForm.get('courseDate') as UntypedFormArray;
    }

    get task() {
        return this.courseForm.get('task') as UntypedFormArray;
    }

    /**
     * Function to add More Dates and Times
     * @author MangoIt Solutions
     */
    addAvailableTimes() {
        if (this.errorTime.isError == false) {
            this.errorTime = { isError: false, errorMessage: '', index: '' };
            if (this.courseDate.valid) {
                const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                    date_from: ['', Validators.required],
                    start_time: ['', Validators.required],
                    end_time: ['', Validators.required],
                });
                this.courseDate.push(newAvailableTimes);
                if (this.courseForm.controls['courseDate'].value.length > 1) {
                    this.recurrenceDropdownField = false;
                    this.checkRecc = false;
                    this.courseForm.controls['recurrence'].setValue('');
                    this.courseForm.get('recurrence').clearValidators();
                    this.courseForm.get('recurrence').updateValueAndValidity();
                }
            }
        }
    }

    /**
    * Function to Remove Dates and Times
    * @author MangoIt Solutions
    */
    removeAvailableTimes(index) {
        this.errorTime = { isError: false, errorMessage: '', index: '' };
        this.courseDate.removeAt(index);
        if (this.courseForm.controls['courseDate'].value.length == 1) {
            this.courseForm.controls["recurrence"].setValue('');
            this.weekDaysArr = []
            this.recurrenceDropdownList = []
            this.recurrenceDropdownList.push(
                { item_id: 0, item_text: this.language.new_create_event.does_not_repeat },
                { item_id: 1, item_text: this.language.new_create_event.every_day },
                { item_id: 2, item_text: this.language.new_create_event.every_week },
                { item_id: 3, item_text: this.language.new_create_event.every_month },
                { item_id: 4, item_text: this.language.new_create_event.every_year },
                { item_id: 5, item_text: this.language.new_create_event.custom }
            );
            this.recurrenceDropdownField = true;
            this.checkRecc = true;
        }
        this.courseForm.controls["date_repeat"].setValue('');
        this.courseForm.get('date_repeat').clearValidators();
        this.courseForm.get('date_repeat').updateValueAndValidity();
        this.endDateRepeat = false;
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
                    this.userDropdownList = [];
                    this.externalInstructorList = [];
                    this.group_dropdown = [];
                    this.roomDropdownList = [];
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        if (respData && respData?.result?.users?.length > 0) {
                            Object(respData.result.users).forEach((val, key) => {
                                if ((val.id != localStorage.getItem('user-id') && val.role != 'guest')) {
                                    this.userDropdownList.push({ 'id': val.id, 'name': val.firstname + ' ' + val.lastname });
                                    this.user_dropdown.push({ id: val.id, user_name: val.firstname + ' ' + val.lastname, });
                                }
                            })
                            this.alluserDetails = respData.result.users;
                            self.userDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: true,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: true
                            };
                            self.internalDropdownSettings = {
                                singleSelection: true,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: false,
                                closeDropDownOnSelection: true
                            };

                            this.participantDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'user_name',
                                allowSearchFilter: true,
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                searchPlaceholderText: this.language.header.search,
                            };
                        }

                        if (respData && respData?.result?.groups?.length > 0) {
                            respData.result.groups.forEach(function (value, key) {
                                self.group_dropdown.push({ 'group_id': value.id, 'name': value.name });
                            })
                        }
                        console.log(respData);
                        
                        if (respData && respData?.result?.rooms?.length > 0) {
                            this.romData = respData.result.rooms;

                            Object(respData.result.rooms).forEach((val, key) => {
                                this.roomDropdownList.push({ 'id': val.id, 'name': val.name });
                            });
                            self.roomDropdownSettings = {
                                singleSelection: true,
                                idField: 'id',
                                textField: 'name',
                                enableCheckAll: false,
                                closeDropDownOnSelection: true
                            };
                        }
                        if (respData && respData?.result?.instructors?.length > 0) {
                            Object(respData.result.instructors).forEach((val, key) => {
                                this.externalInstructorList.push({ 'id': val.id, 'name': val.first_name + ' ' + val.last_name });
                            });
                            this.externalDropdownSettings = {
                                singleSelection: true,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: false,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: false,
                                closeDropDownOnSelection: true
                            }
                        }
                        this.getCourseInfo(this.courseId);
                    }
                }
            );
    }

    /**
     * Function to get course Detail
     * @author MangoIt Solutions
     * @param courseid
     */
    getCourseInfo(courseid: number) {
        let self = this;
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getCoursesById/' + courseid, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false && Object.keys(respData.result).length > 0) {
                        self.courseDetails = respData['result'][0];
                        if (respData?.result[0]?.courseUsers) {
                            respData.result[0].courseUsers.forEach(function (value, key) {
                                self.setEventParticipants.push({ 'id': value.users.id, 'name': value.users.firstname + ' ' + value.users.lastname });
                                self.userSelected.push(value.users.id);
                            })
                            self.setEventParticipants = Object.assign(this.authService.uniqueObjData(self.setEventParticipants, 'id'));
                            self.userSelected = this.authService.uniqueData(self.userSelected);
                        }
                        self.setCourseData();
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    } else {
                        this.notificationService.showError(this.language.courses.no_course_found, null);
                    }
                    this.authService.setLoader(false);
                }
            );
    }

    /**
    * Function to set course data in the form
    * @author MangoIt Solutions
    * @param courseid
    */
    setCourseData() {
        var start_time: string[] = [];;
        var end_time: string[] = [];;
        var date_to: string[] = [];
        var date_from: string[] = [];
        let instructorType: any = [];
        let coUser: any = [];
        if (this.courseDetails.date_from) {
            date_from = this.courseDetails.date_from.split("T");
            // start_time = date_from[1].split("Z");
            start_time = date_from[1].split(".");
        }
        if (this.courseDetails.date_to) {
            date_to = this.courseDetails.date_to.split("T");
            // end_time = date_to[1].split("Z");
            end_time = date_to[1].split(".");
        }

        if (this.courseDetails.recurrence != null && this.courseDetails.recurrence != "" && this.courseDetails.recurrence != 'undefined') {
            const textArray: string[] = this.courseDetails.recurrence.split(";", 1);
            const until = this.courseDetails.recurrence.split(";", 2)[1];
            const textUNTIL: string = until.split("=")[1].split("T", 1).toString()
            const untilDate: string[] = textUNTIL.split("T", 1);
            const endDate: string = untilDate[0].slice(4, 6) + "/" + untilDate[0].slice(6, 8) + "/" + untilDate[0].slice(0, 4);
            this.isRecurred = textArray[0].slice(5).concat("; UNTIL " + endDate);

            if (this.courseDetails.date_repeat) {
                this.endDateRepeat = true;
                this.dateRepeat = this.courseDetails.date_repeat.split("T")[0];
            }
            var recc = this.courseDetails.recurrence.split(";", 2)[0];
            this.typerecc = recc.split("=")[1];
            if (this.courseDetails.recurrence.includes('INTERVAL')) {
                this.interval = this.courseDetails.recurrence.split(";")[2].split("=")[1];
            }
            if (this.courseDetails.recurrence.includes('BYDAY')) {
                this.byDay = this.courseDetails.recurrence.split(";")[3].split("=")[1];
            }
            this.checkRecc = false;
            if (this.typerecc && (this.interval || this.byDay)) {
                this.recurrenceSelected = 5;
                this.typereccurenc.push({ item_id: 5, item_text: this.language.new_create_event.custom });
                this.checkRecc = true;

            } else if (this.typerecc == 'DAILY') {
                this.recurrenceSelected = 1;
                this.typereccurenc.push({ item_id: 1, item_text: this.language.new_create_event.every_day });
                this.checkRecc = true;

            } else if (this.typerecc == 'WEEKLY') {
                this.recurrenceSelected = 2;
                this.typereccurenc.push({ item_id: 2, item_text: this.language.new_create_event.every_week });
                this.checkRecc = true;

            } else if (this.typerecc == 'MONTHLY') {
                this.recurrenceSelected = 3;
                this.typereccurenc.push({ item_id: 3, item_text: this.language.new_create_event.every_month });
                this.checkRecc = true;

            } else if (this.typerecc == 'YEARLY') {
                this.recurrenceSelected = 4;
                this.typereccurenc.push({ item_id: 4, item_text: this.language.new_create_event.every_year });
                this.checkRecc = true;
            } else {
                this.recurrenceSelected = 0;
                this.typereccurenc.push({ item_id: 0, item_text: this.language.new_create_event.does_not_repeat });
                this.checkRecc = true;
            }
        } else {
            if (JSON.parse(this.courseDetails.recurring_dates).length == 1) {
                this.typereccurenc.push({ item_id: 0, item_text: this.language.new_create_event.does_not_repeat });
                this.checkRecc = true;
            }
            this.recurrenceSelected = 0;
            this.courseForm.controls['recurrence'].setValue('');
            this.courseForm.get('recurrence').clearValidators();
            this.courseForm.get('recurrence').updateValueAndValidity();
        }

        if (this.courseDetails.chargeable) {
            this.eventPriceDisplay = true;
        }

        if (this.courseDetails.course_image[0]?.course_image && this.courseDetails.course_image[0]?.course_image != "[]") {
            this.hasPicture = true;
            this.image = this.courseDetails.course_image[0]?.course_image;
            if (this.courseDetails.course_image[0]?.course_image) {
                this.imageUrl = this.courseDetails.course_image[0]?.course_image;
                this.courseDetails.course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.courseDetails.course_image[0]?.course_image.substring(20)));
                this.eventImage = this.courseDetails.course_image[0]?.course_image
            }
        }
        if (this.courseDetails?.course_image[0]?.course_document) {
            this.eventFile = this.courseDetails?.course_image[0]?.course_document;
            this.fileUrl = this.courseDetails?.course_image[0]?.course_document
        }

        // if (this.courseDetails.picture_video && this.courseDetails.picture_video != "[]") {
        //     this.hasPicture = true;
        //     let responseImg: string;
        //     responseImg = this.courseDetails.picture_video;
        //     this.image = this.courseDetails.picture_video;
        //     let resp: string[];
        //     resp = responseImg.split("\"");
        //     let imgArray: string[] = [];
        //     let self = this;
        //     if (resp && resp.length > 0) {
        //         resp.forEach(element => {
        //             if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => element.endsWith(char))) {
        //                 imgArray.push(element);
        //                 this.eventImage = imgArray[0];
        //                 this.imageUrl = element;
        //             } else if (['.pdf', '.doc', '.zip', '.docx', '.docm', '.dot', '.odt', '.txt', '.xml', '.wps', '.xps', '.html', '.htm', '.rtf'].some(char => element.endsWith(char))) {
        //                 this.eventFile = element;
        //                 this.fileUrl = element;
        //             }
        //         });
        //     }
        // }
        if (this.courseDetails.allowed_persons == null) {
            this.courseDetails.allowed_persons = null
        }
        if ((this.courseDetails.room == null) || (this.courseDetails.room == undefined)) {
            this.courseDetails.room = null;
        } else if (this.roomDropdownList?.length > 0) {
            this.roomDropdownList.forEach((value: any, key: number) => {
                if (value.id == this.courseDetails.room) {
                    this.roomSelected = value.id
                    this.exitsRoom.push(value);
                    this.roomsById(this.roomSelected)
                }
            });
            setTimeout(() => {
                if (this.romData?.length > 0) {
                    this.romData.forEach(element => {
                        if (element.id == this.courseDetails.room) {
                            this.selectedRoom = element
                            console.log(element);
                            
                        }
                    });
                }
            }, 2000);
        }
        if (this.courseDetails.instructor_type) {
            this.instrucType = this.courseDetails.instructor_type;
            if (this.courseDetails.instructor_type == 1) {
                instructorType.push({ item_id: 1, item_text: this.language.courses.internal });
                this.internal = []
                this.internalInstructor = []
                if (this.userDropdownList && this.userDropdownList.length > 0) {
                    this.userDropdownList.forEach((val, key) => {
                        let info: any = this.courseDetails.CourseInternalInstructor;
                        if (info && info.length > 0) {
                            info.forEach((value, key) => {
                                if (val.id == value.internalUsers.id) {
                                    this.internalInstructor.push({ 'user_id': value.internalUsers.id });
                                    this.internal.push({ id: value.internalUsers.id, name: value.internalUsers.firstname + " " + value.internalUsers.lastname })
                                }
                            })
                        }
                    })
                }
                this.courseForm.get('instructor_external').clearValidators();
            } else if (this.courseDetails.instructor_type == 2) {
                instructorType.push({ item_id: 2, item_text: this.language.courses.external });
                this.external = [];
                this.externalInstructor = [];
                if (this.externalInstructorList && this.externalInstructorList.length > 0) {
                    this.externalInstructorList.forEach((val, key) => {
                        let info: any = this.courseDetails.CourseExternalInstructor;
                        if (info) {
                            info.forEach((value, key) => {
                                if (val.id == value.externalIns.id) {
                                    this.externalInstructor.push({ 'instructor_id': value.externalIns.id })
                                    this.external.push({ id: value.externalIns.id, name: value.externalIns.first_name + " " + value.externalIns.last_name })
                                }
                            })
                        }
                    })
                    this.instructorDetailById(this.externalInstructor[0]['instructor_id'])
                }
                this.courseForm.get('instructor_internal').clearValidators();
            }
            if (this.courseDetails.courseUsers && this.courseDetails.courseUsers.length > 0) {
                this.courseDetails.courseUsers.forEach((val, key) => {
                    if (val.approved_status == 0) {
                        coUser.push({ 'id': val.user_id, 'name': val.users.firstname + ' ' + val.users.lastname });
                    }
                })
                this.courseForm.controls["course_users"].setValue(coUser);
            }
        }

        var visibility: number[] = [];
        var groupList: any = [];
        if (this.courseDetails.visibility) {
            this.visibility = this.courseDetails.visibility;
            if (this.visibilityDropdownList && this.visibilityDropdownList.length > 0) {
                this.visibilityDropdownList.forEach((value: any, key: number) => {
                    if (value.item_id == this.courseDetails.visibility) {
                        visibility.push(value);
                    }
                });
            }
            if (this.courseDetails.visibility == 3) {
                setTimeout(() => {
                    groupList = [this.group_dropdown];
                    if (groupList && groupList[0].length > 0) {
                        groupList[0].forEach((value: any, key: number) => {
                            if (value.group_id == this.courseDetails.group_id) {
                                this.groupGet.push({ group_id: value.group_id, name: value.name });
                                this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + value.group_id, null)
                                    .subscribe(
                                        (respData) => {
                                            this.authService.setLoader(false);
                                            if (respData[0].participants) {
                                                var groupParticipants: any = respData[0].participants;
                                                var groupUsers: any = [];
                                                groupParticipants.forEach(function (value, key) {
                                                    var status: number = 0;
                                                    if (value.approved_status == 1) {
                                                        var userGroupObj: any = { 'user_id': value.user_id, 'approved_status': status };
                                                        groupUsers.push(userGroupObj);
                                                    }
                                                });
                                                this.groupUserList = groupUsers;
                                            }
                                        }
                                    );
                            }
                        });
                    }
                    if (this.groupGet.length > 0) {
                        this.setEventParticipants = [];
                    }
                }, 2000);
            }
        }
        if (this.courseDetails) {
            this.courseForm.controls["name"].setValue(this.courseDetails.name);
            this.courseForm.controls["place"].setValue(this.courseDetails.place);

            this.courseForm.controls["date_from"].setValue(date_from[0]);
            this.courseForm.controls["start_time"].setValue(start_time[0]);
            this.courseForm.controls["end_time"].setValue(end_time[0]);
            this.courseForm.controls["date_to"].setValue(date_to[0]);

            this.courseForm.controls["recurrence"].setValue(this.typereccurenc);
            this.courseForm.controls["date_repeat"].setValue(this.dateRepeat);

            if (this.courseDetails.show_guest_list == 'false' || this.courseDetails.show_guest_list == '' || this.courseDetails.show_guest_list == null) {
                this.courseForm.controls['show_guest_list'].setValue(false);
            } else if (this.courseDetails.show_guest_list == 'true') {
                this.courseForm.controls['show_guest_list'].setValue(this.courseDetails.show_guest_list);
            }
            this.courseForm.controls["chargeable"].setValue(this.courseDetails.chargeable);
            this.courseForm.controls["description"].setValue(this.courseDetails.description);
            this.courseForm.controls["author"].setValue(this.courseDetails.author);
            this.courseForm.controls["approved_status"].setValue(this.courseDetails.approved_status);
            this.courseForm.controls["price_per_participant"].setValue(this.courseDetails.price_per_participant);
            this.courseForm.controls["allowed_persons"].setValue(this.courseDetails.allowed_persons);
            this.courseForm.controls["instructor_type"].setValue(instructorType);
            this.courseForm.controls["visibility"].setValue(visibility);
            this.courseForm.controls["room"].setValue(this.exitsRoom);
            this.courseForm.controls["instructor_external"].setValue(this.external);
            this.courseForm.controls["instructor_internal"].setValue(this.internal);
            this.courseForm.controls["participants"].setValue(this.courseDetails.participants);
            this.courseForm.controls["course_users"].setValue(this.courseDetails.courseUsers);

            if (this.courseDetails.visibility == 3) {
                this.courseForm.controls["course_groups"].setValue(this.groupGet);

            } else if (this.courseDetails.visibility == 1) {
                var uniqueUsers = this.authService.uniqueData(this.setEventParticipants);
                this.courseForm.controls["participant"].setValue(uniqueUsers);
            }
        }

        if (this.courseDetails && this.courseDetails.recurring_dates && this.courseDetails.recurring_dates.length) {

            for (let i = 0; i < JSON.parse(this.courseDetails.recurring_dates).length; i++) {
                this.courseDate.removeAt(i);
                if (this.courseDate.value[i] && this.courseDate.value[i].date_from == null && this.courseDate.value[i].start_time == null && this.courseDate.value[i].end_time == null) {
                    this.courseDate.removeAt(i);
                    this.addAvailableTimes()
                }
            }
            this.courseDate.removeAt(0);
            if (JSON.parse(this.courseDetails.recurring_dates)) {
                JSON.parse(this.courseDetails.recurring_dates).forEach((key, value) => {
                    if (key.start_time.includes(':00') && key.end_time.includes(':00')) {
                        key.start_time = key.start_time.slice(0, 5)
                        key.end_time = key.end_time.slice(0, 5)
                    }
                    const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                        date_from: [key.date_from, Validators.required],
                        start_time: [key.start_time, Validators.required],
                        end_time: [key.end_time, Validators.required],
                    });
                    this.courseDate.push(newAvailableTimes);
                });
            }
        }

        if (this.courseDetails && this.courseDetails.courseTask && Object.keys(this.courseDetails.courseTask).length != 0) {
            this.courseForm.controls["isTask"].setValue(true);
            this.isTaskField = true;
            var type_dropdown: any;
            this.taskStatus = this.courseDetails.courseTask.status
            this.taskId = this.courseDetails.courseTask.id
            if (this.courseDetails?.courseTask?.group_id == 0) {
                this.type_visibility = 0;
                type_dropdown = [{ id: 0, name: this.language.create_task.individual },];
                this.setUsers(this.courseDetails?.courseTask?.id, type_dropdown)
            } else {
                let self = this;
                this.type_visibility = 1;
                type_dropdown = [{ id: 1, name: this.language.create_task.group }];
                if (self.group_dropdown && self.group_dropdown.length > 0) {
                    self.group_dropdown.forEach((value, index) => {
                        if (value.group_id == this.courseDetails?.courseTask?.group_id) {
                            this.groups = [{ group_id: value.group_id, name: value.name }];
                        }
                    });
                    this.task_user_selected = [];
                    this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + this.courseDetails?.courseTask?.group_id, null).subscribe(
                        (respData: any) => {
                            if (respData && respData.length > 0) {
                                respData[0].participants.forEach((value, index) => {
                                    this.task_user_selected.push({ 'user_id': value.user_id, 'approved_status': value.read_status });
                                });
                            }
                        });
                }
                const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                    title: [this.courseDetails?.courseTask?.title, Validators.required],
                    description: [this.courseDetails?.courseTask?.description, Validators.required],
                    organizer_id: [this.courseDetails?.courseTask?.organizer_id],
                    status: [this.courseDetails?.courseTask?.status],
                    group_id: [this.courseDetails?.courseTask?.group_id],
                    date: [this.courseDetails?.courseTask?.date.split("T")[0], Validators.required],
                    type_dropdown: [type_dropdown, Validators.required],
                    groups: [this.groups, Validators.required],
                    user_select: [''],
                    taskCollaborators: [''],
                });
                this.task.push(newAvailableTimes);
            }
        } else {
            $("#isTask_check").prop("checked", false);
        }
        this.taskEditorConfig = {
            editable: this.taskStatus == 1 ? false : true,
            spellcheck: true,
            minHeight: '5rem',
            maxHeight: '15rem',
            translate: 'no',
            fonts: [
                { class: 'gellix', name: 'Gellix' },
            ],
            toolbarHiddenButtons: [
                [
                    'link',
                    'unlink',
                    'subscript',
                    'superscript',
                    'insertUnorderedList',
                    'insertHorizontalRule',
                    'removeFormat',
                    'toggleEditorMode',
                    'insertImage',
                    'insertVideo',
                    'italic',
                    'fontSize',
                    'undo',
                    'redo',
                    'underline',
                    'strikeThrough',
                    'justifyLeft',
                    'justifyCenter',
                    'justifyRight',
                    'justifyFull',
                    'indent',
                    'outdent',
                    'heading',
                    'textColor',
                    'backgroundColor',
                    'customClasses',
                    'insertOrderedList',
                    'fontName'
                ]
            ],
            sanitize: true,
            toolbarPosition: 'top',
            defaultFontName: 'Arial',
            defaultFontSize: '2',
            defaultParagraphSeparator: 'p'
        };
    }

    errorMatch: any = { isError: false, errorMessage: '' };
    /**
    * Function is used to set course value in form data and send to back end to store course information in db
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} message
    */
    courseProcess() {
        this.eventSubmitted = true;
        if (this.courseForm.valid) {
            this.mustMatchs = this.courseForm.value.allowed_persons;
            this.endRepeatDate()
            this.endRepeat()
            if (this.isCustom == true && this.naturalNumber == true) {
                this.customReccDateError = { isError: true, errorMessage: this.language.create_event.select_custom_recc };
            } else {
                this.customReccDateError = { isError: false, errorMessage: '' };
            }

            if (this.selectedRoom != null && this.mustMatchs != null) {
                if (this.course_allDates.length > 0) {
                    if ((new Date(this.courseForm.value['date_from']) >= new Date(this.roomsByIdData.active_from.split('T')[0])) &&
                        (new Date(this.courseForm.value['date_to']) <= new Date(this.roomsByIdData.active_to.split('T')[0]))) {
                        var roomsData: any[] = [];
                        var course_recuu: any = '';
                        var course_startTime: any
                        var course_endTime: any
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        this.calendarRooms.forEach((elem: any) => {
                            if (this.courseId == elem.id && elem.type == 'course') {
                                this.allRoomCalndr[1]['avail'].forEach((el: any) => {
                                    if (elem.date_start == el.date_start) {
                                        roomsData.push(el);
                                    }
                                })
                            } else {
                                roomsData.push(elem);
                            }
                        })
                        roomsData.sort((a: any, b: any) => Number(new Date(a.date_start)) - Number(new Date(b.date_start)));
                        if (this.recurrenceString && (this.recurrenceString != ' ' || this.recurrenceString != null)) {
                            course_recuu = this.recurrenceString;
                        } else if (this.finalCustomRecurrence && (this.finalCustomRecurrence != ' ' || this.finalCustomRecurrence != null)) {
                            course_recuu = this.finalCustomRecurrence;
                        }
                        if (course_recuu && (course_recuu != ' ' || course_recuu != null)) {   //if the recurrence
                            course_startTime = this.courseForm.value['start_time'];
                            course_endTime = this.courseForm.value['end_time'];
                            this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData, this.courseForm.value.courseDate);

                        } else if (this.courseForm.value.courseDate.length > 1) {  /// if the multiple dates
                            this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData, this.courseForm.value.courseDate);

                        } else { // no recurrence & no multiple dates
                            course_startTime = this.courseForm.value['start_time'];
                            course_endTime = this.courseForm.value['end_time'];
                            this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData, this.courseForm.value.courseDate);
                        }
                    } else {
                        this.notificationService.showError(this.language.courses.not_room, null);
                        this.matchDateError = { isError: true, errorMessage: this.language.courses.not_room };
                    }
                } else {
                    this.courseDetails.courseReccurance.forEach(function (v) { delete v.course_id });
                    this.courseForm.controls['courseReccurance'].setValue(JSON.stringify(this.courseForm.controls['courseDate'].value));
                }
            }
            if (this.courseForm?.controls['instructor_external']?.value?.length > 0 && this.instrucType == 2) {
                this.matchInstrctDateError = { isError: false, errorMessage: '' };
                if (this.course_allDates.length > 0) {
                    if ((new Date(this.courseForm.value['date_from']) >= new Date(this.instructorById.active_from.split('T')[0])) &&
                        (new Date(this.courseForm.value['date_to']) <= new Date(this.instructorById.active_to.split('T')[0]))) {
                        this.matchInstrctDateError = { isError: false, errorMessage: '' };
                        var instructorData: any[] = [];
                        var course_recuu: any = '';
                        var course_startTime: any
                        var course_endTime: any
                        this.date = new Date(); // Today's date
                        this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                        this.instructorCalendar.forEach((elem: any) => {
                            if (this.courseId == elem.id) {
                                this.allExternlCalndr[1]['avail'].forEach((el: any) => {
                                    if (elem.date_start == el.date_start) {
                                        instructorData.push(el);
                                    }
                                })
                            } else {
                                instructorData.push(elem);
                            }
                        })
                        instructorData.sort((a: any, b: any) => Number(new Date(a.date_start)) - Number(new Date(b.date_start)));
                        if (this.recurrenceString && (this.recurrenceString != ' ' || this.recurrenceString != null)) {
                            course_recuu = this.recurrenceString;
                        } else if (this.finalCustomRecurrence && (this.finalCustomRecurrence != ' ' || this.finalCustomRecurrence != null)) {
                            course_recuu = this.finalCustomRecurrence;
                        }

                        if (course_recuu && (course_recuu != ' ' || course_recuu != null)) {   //if the recurrence
                            course_startTime = this.courseForm.value['start_time'];
                            course_endTime = this.courseForm.value['end_time'];
                            this.checkInstructorAvailability(course_startTime, course_endTime, this.course_allDates, instructorData);

                        } else if (this.courseForm.value.courseDate.length > 1) {  /// if the multiple dates
                            this.checkInstructorAvailability(course_startTime, course_endTime, this.course_allDates, instructorData);

                        } else {                                                  // no recurrence & no multiple dates
                            course_startTime = this.courseForm.value['start_time'];
                            course_endTime = this.courseForm.value['end_time'];
                            this.checkInstructorAvailability(course_startTime, course_endTime, this.course_allDates, instructorData);
                        }
                    } else {
                        this.notificationService.showError(this.language.courses.not_instruct, null);
                        this.matchInstrctDateError = { isError: true, errorMessage: this.language.courses.not_instruct };
                    }
                } else {
                    this.courseDetails.instructorReccurance.forEach(function (v) { delete v.course_id });
                    this.courseForm.controls['instructorReccurance'].setValue(this.courseDetails.instructorReccurance);
                }
            } else if (this.courseForm?.controls['instructor_internal']?.value?.length > 0 && this.instrucType == 1) {
                if (this.course_allDates.length > 0) {
                    if (this.courseForm?.value?.courseDate.length > 1) {
                        var intr_instructorRecc: any[] = [];
                        this.courseForm?.value?.courseDate?.forEach((element: any, index: any) => {
                            element.start_time = this.commonFunctionService.formatTime(element.start_time);
                            element.end_time = this.commonFunctionService.formatTime(element.end_time);
                            intr_instructorRecc[index] = {
                                date_from: element.date_from,
                                start_time: element.start_time,
                                end_time: element.end_time
                            };
                        });
                        this.courseForm.controls['in_instructorReccurance'].setValue(JSON.stringify(intr_instructorRecc))
                    } else if (this.course_allDates) {
                        let course_startTime = this.commonFunctionService.formatTime(this.courseForm.value['start_time']);
                        let course_endTime = this.commonFunctionService.formatTime(this.courseForm.value['end_time']);
                        var intr_instructorRecc: any[] = [];
                        if (course_startTime && course_endTime) {
                            this.course_allDates.forEach((element: any, index: any) => {
                                intr_instructorRecc[index] = {
                                    date_from: this.datePipe.transform(new Date(element), 'YYYY-MM-dd'),
                                    start_time: course_startTime,
                                    end_time: course_endTime
                                };
                            });
                            if (intr_instructorRecc.length > 0) {
                                this.courseForm.controls['in_instructorReccurance'].setValue(JSON.stringify(intr_instructorRecc));
                            }
                        }
                    }
                } else {
                    this.courseDetails.in_instructorReccurance.forEach(function (v) { delete v.course_id });
                    this.courseForm.controls['in_instructorReccurance'].setValue(JSON.stringify(this.courseDetails.in_instructorReccurance));
                }

            }
        }
        if ((this.courseForm.valid) && (!this.errorTime.isError) && (!this.errorDate.isError) && (!this.errorImage.isError) && (!this.matchDateError.isError) && (!this.customReccDateError.isError)
            && (!this.matchInstrctDateError.isError) && (!this.errorMatch.isError) && (this.courseForm.value['allowed_persons'] != "" && (this.courseForm.value['allowed_persons'] > 0))) {
            if (this.isTaskField == true) {
                if (this.courseForm.controls['task']?.value?.length > 0 && this.task_user_selected?.length > 0) {
                    if (this.task_user_selected.find((obj: any) => obj.user_id != this.courseForm.controls['task'].value[0].organizer_id)) {
                        this.task_user_selected.push({
                            'user_id': this.courseForm.controls['task'].value[0].organizer_id,
                            'approved_status': 1
                        })
                    }
                    const unique2 = this.task_user_selected.filter((obj, index) => {
                        return index === this.task_user_selected.findIndex(o => obj.user_id === o.user_id);
                    });
                    this.courseForm.controls['task'].value[0].taskCollaborators = unique2
                }
            } else if (this.isTaskField == false) {
                if (this.task.length > 0) {
                    this.task_user_selected = [];
                    this.task.removeAt(0);
                    let self = this;
                    if (self.taskId > 0) {
                        self.authService.setLoader(true);
                        self.authService.memberSendRequest('delete', 'DeleteTask/' + self.taskId, null)
                            .subscribe(
                                (respData: any) => {
                                    self.authService.setLoader(false);
                                    if (respData['isError'] == false) {
                                    } else if (respData['code'] == 400) {
                                        this.notificationService.showError(respData['message'], null);
                                    }
                                }
                            )
                    }
                }
            }
            this.courseForm.controls["visibility"].setValue(this.courseForm.value.visibility[0]?.item_id);
            var uniqueUsers = this.authService.uniqueData(this.userSelected)

            this.courseForm.controls["course_users"].setValue(uniqueUsers);
            var date_from: string = this.courseForm.controls["date_from"].value;
            var start_time: string = this.courseForm.controls["start_time"].value;
            var date_to: string = this.courseForm.controls["date_to"].value;
            var end_time: string = this.courseForm.controls["end_time"].value;
            this.courseForm.controls["date_from"].setValue(date_from + " " + start_time);
            this.courseForm.controls["date_to"].setValue(date_to + " " + end_time);
            this.courseForm.controls["date_repeat"].setValue(this.courseForm.value.date_repeat);
            this.courseForm.controls["instructor_type"].setValue(this.instrucType);
            this.courseForm.value['team_id'] = this.teamId;
            this.fileAndimage = [];
            var formData: any = new FormData();
            this.authService.setLoader(false);
            let self = this;
            for (const key in this.courseForm.value) {
                if (Object.prototype.hasOwnProperty.call(self.courseForm.value, key)) {
                    const element = self.courseForm.value[key];

                    if (key == 'file' && (this.fileToReturn || this.imageUrl)) {
                        if (this.fileToReturn) {
                            formData.append('file', this.fileToReturn)
                        } else {
                            formData.append('course_image', this.imageUrl);
                        }
                    }
                    if (key == 'file' && (this.picVid1 || this.fileUrl)) {
                        if (self.picVid1 && self.picVid1 != undefined) {
                            formData.append('file', self.picVid1);

                        } else if (this.fileUrl != '' && this.fileUrl != null) {
                            formData.append('course_document', this.fileUrl);
                        }
                    } else if (key == 'file' && (this.picVid1 == null || this.picVid1 == '' || this.picVid1 == undefined)
                        && (this.fileUrl == null || this.fileUrl == '' || this.fileUrl == undefined)) {
                        formData.append('course_document', '')
                    }
                    if (key == 'instructor_internal' && this.instrucType == 1) {
                        let internalUser = this.authService.uniqueData(this.internalInstructor)
                        formData.append("instructor_internal", JSON.stringify(internalUser));
                    } else if (key == "instructor_external" && this.instrucType == 2) {
                        let externalUser = this.authService.uniqueData(this.externalInstructor)
                        formData.append("instructor_external", JSON.stringify(externalUser));
                    }
                    if (key == 'room') {
                        if ((this.roomSelected != undefined) && (this.roomSelected || this.roomSelected == null)) {
                            formData.append("room", this.roomSelected);
                        } else if (this.exitsRoom.length > 0) {
                            formData.append("room", this.exitsRoom);
                        } else {
                            formData.append("room", 'null');
                        }
                    }
                    if (key == 'recurrence') {
                        if (this.courseForm.controls['courseDate'].value.length > 1) {
                            formData.append('recurrence', '');
                        } else if (this.finalCustomRecurrence != null || this.recurrenceString != null || this.courseDetails.recurrence == "" ||
                            this.courseDetails.recurrence == null || this.courseDetails.recurrence) {
                            if (element[0] && element[0]['item_id'] == 5 && this.recurrenceSelected == 5) {
                                formData.append('recurrence', self.finalCustomRecurrence);
                            } else if (element[0] && element[0]['item_id'] == 0 && this.recurrenceSelected == 0) {
                                formData.append('recurrence', this.recurrenceString)
                            } else if (this.recurrenceString) {
                                formData.append('recurrence', this.recurrenceString);
                            } else if (this.finalCustomRecurrence) {
                                formData.append('recurrence', self.finalCustomRecurrence);

                            } else if (this.courseDetails.recurrence && this.recurrenceSelected == undefined) {
                                formData.append('recurrence', this.courseDetails.recurrence);
                            }
                        } else {
                            formData.append('recurrence', this.recurrenceString)
                        }
                    }
                    if (key == 'chargeable') {
                        if (this.courseForm.value.chargeable) {
                            formData.append('chargeable', this.courseForm.controls['price_per_participant'].value);
                        }
                    }
                    if (key == 'show_guest_list') {
                        formData.append('show_guest_list', this.courseForm.controls['show_guest_list'].value);
                    }
                    if (key == 'participant' && element[0] != null) {
                        if (element && element.length > 0) {
                            element.forEach(function (value, key) {
                                formData.append("participant[" + key + "]", JSON.stringify(value.id));
                            });
                        }
                    } else if (key == 'course_groups' && element[0] != null) {
                        var groupArray: number[] = [];
                        var grp_id: number;
                        if (element && element.length > 0) {
                            element.forEach(function (value, key) {
                                grp_id = value.group_id;
                                groupArray.push(value.group_id);
                            });
                        }
                        formData.append("group_id", JSON.stringify(grp_id));
                        formData.append("course_groups", JSON.stringify(groupArray));
                    }
                    if (key == 'course_users') {
                        this.userObj = [];
                        if (this.visibility == 2) {
                            this.userObj.push({ user_id: this.courseDetails.author, approved_status: 1, });
                            formData.append('course_users', JSON.stringify(this.userObj));
                        }
                        if (this.visibility == 1 || this.visibility == 4) {
                            let self = this;
                            if (element && element.length > 0) {
                                element.forEach(function (value, key) {
                                    var status: number = 0;
                                    if (self.internalInstructor) {
                                        self.internalInstructor.forEach((el: any, i: any) => {
                                            if (value == el['user_id']) {
                                                status = 1;
                                            }
                                        });
                                    }
                                    if (value == self.courseForm.controls['author'].value) {
                                        status = 1;
                                    }
                                    self.userObj.push({ user_id: value, approved_status: status });
                                });
                            }
                            let ifAuthor = 0;
                            if (self.userObj) {
                                self.userObj.forEach((val: any) => {
                                    if (val.user_id == this.courseDetails.author) {
                                        ifAuthor++;
                                    }
                                });
                            }
                            if (ifAuthor == 0) {
                                self.userObj.push({ 'user_id': this.courseDetails.author, 'approved_status': 1 });
                            }
                            formData.append("course_users", JSON.stringify(this.userObj));
                        }
                        if (this.visibility == 3 && this.groupUserList != null) {
                            let self = this;
                            if (this.groupUserList && this.groupUserList.length > 0) {
                                this.groupUserList.forEach((value: any, key: any) => {
                                    let status: number = 0;
                                    if (this.internalInstructor) {
                                        this.internalInstructor.forEach((el: any, i: any) => {
                                            if (value['user_id'] == el['user_id']) {
                                                status = 1;
                                            }
                                        });
                                    }
                                    if (value['user_id'] == this.courseDetails.author) {
                                        status = 1;
                                    }
                                    this.newGroupList.push({ user_id: value['user_id'], approved_status: status });
                                });
                            }

                            let ifAuthor = 0;
                            if (this.newGroupList && this.newGroupList.length > 0) {
                                this.newGroupList.forEach((val: any) => {
                                    if (val.user_id == this.courseDetails.author) {
                                        if (val.approved_status == 1) {
                                            ifAuthor++;
                                        }
                                    }
                                });
                            }
                            if (ifAuthor == 0) {
                                let author_id: number = this.courseDetails.author;
                                this.newGroupList.push({ 'user_id': author_id, 'approved_status': 1 });
                            }
                            formData.append("course_users", JSON.stringify(this.newGroupList));
                        }
                    }
                    if (key == 'in_instructorReccurance') {
                        formData.append('in_instructorReccurance', element);
                    }
                    if (key == 'instructorReccurance') {
                        formData.append('instructorReccurance', JSON.stringify(element));
                    }
                    if (key == 'courseDate') {
                        formData.append('courseDate', JSON.stringify(element));
                    }
                    if (key == 'task') {
                        formData.append('task', JSON.stringify(element));
                    } else {
                        if ((key != 'file') && (key != 'participant') && (key != 'course_users') && (key != 'courseDate') && (key != 'room')
                            && (key != 'chargeable') && (key != 'recurrence') && (key != 'customRecurrence') && (key != 'instructorReccurance') && (key != 'in_instructorReccurance')
                            && (key != 'instructor_external') && (key != 'instructor_internal') && (key != 'course_groups') && (key != 'show_guest_list') && (key != 'course_users')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'updateCourse/' + this.courseId, formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.eventSubmitted = false;
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'], null);
                            var self = this;
                            setTimeout(function () {
                                self._router.navigate(["/course-detail/" + self.courseId]);
                            }, 4000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                            this.setVisibilityOnError(this.visibility);
                            this.setInstructorTypeOnError(this.instrucType);
                            this.courseForm.controls['date_to'].setValue(date_to);
                            this.courseForm.controls['room'].setValue(date_to);
                            if (this.selectedRoom) {
                                let room_data = [];
                                room_data.push({ id: this.selectedRoom.id, name: this.selectedRoom.name });
                                this.courseForm.controls["room"].setValue(room_data);
                            }
                        }
                    }
                );
        }
    }

    /**
    * Function is used to set visibility when error is coming
    * @author  MangoIt Solutions
    */
    setVisibilityOnError(id: number) {
        let visibility_data = [];
        if (id == 1) {
            visibility_data.push({ item_id: 1, item_text: this.language.create_event.public });
        } else if (id == 2) {
            visibility_data.push({ item_id: 2, item_text: this.language.create_event.private });
        } else if (id == 3) {
            visibility_data.push({ item_id: 3, item_text: this.language.create_event.group });
        } else if (id == 4) {
            visibility_data.push({ item_id: 4, item_text: this.language.create_event.club });
        }
        this.courseForm.controls["visibility"].setValue(visibility_data);
    }

    /**
    * Function is used to set visibility when error is coming
    * @author  MangoIt Solutions
    */
    setInstructorTypeOnError(id: number) {
        let type_data = [];
        if (id == 1) {
            type_data.push({ item_id: 1, item_text: this.language.courses.internal });
        } else if (id == 2) {
            type_data.push({ item_id: 2, item_text: this.language.courses.external });
        }
        this.courseForm.controls["instructor_type"].setValue(type_data);
    }

    /**
    * Function is used check the availability of Instructor for the course dates
    * @author  MangoIt Solutions(M)
    * @param   {startTime,endTime,course all dates,instructor dates}
    * @return  {Array Of Object} if test pass then instructorRecurrence booking dates else error
    */
    checkInstructorAvailability(course_startTime: any, course_endTime: any, course_allDates: any, instructorData: any) {
        var count: number = 0;
        var finalInstructorData: any[] = []
        var instructorRecc: any[] = [];
        var course_dates_length: any;

        if (this.courseForm?.value?.courseDate.length > 1) {
            course_dates_length = this.courseForm.value.courseDate.length;
            this.courseForm.value.courseDate.forEach((elem: any, index: any) => {
                instructorData.forEach((element: any, idn: any) => {
                    elem.start_time = this.commonFunctionService.formatTime(elem.start_time);
                    elem.end_time = this.commonFunctionService.formatTime(elem.end_time);
                    if ((element.date_start == this.datePipe.transform(elem.date_from, 'yyyy-MM-dd')) &&
                        (elem.start_time >= element.start.split('T')[1]) &&
                        (elem.end_time <= element.end.split('T')[1]) &&
                        (element.classNames != 'exInstruct-booked')) {
                        finalInstructorData.push(elem);
                        count++;
                    }
                })
            })
        } else if (course_allDates) {
            course_dates_length = course_allDates.length;
            course_allDates.forEach((elem: any, index: any) => {
                instructorData.forEach((element: any, idn: any) => {
                    course_startTime = this.commonFunctionService.formatTime(course_startTime);
                    course_endTime = this.commonFunctionService.formatTime(course_endTime);
                    if ((element.date_start == this.datePipe.transform(elem, 'yyyy-MM-dd'))
                        && (course_startTime >= element.start.split('T')[1])
                        && (course_endTime <= element.end.split('T')[1]) &&
                        (element.classNames != 'exInstruct-booked')
                    ) {
                        finalInstructorData.push(elem);
                        count++;
                    }
                });
            });
        }
        finalInstructorData = this.authService.uniqueData(finalInstructorData);
        if (count >= course_dates_length) {
            this.matchInstrctDateError = { isError: false, errorMessage: '' };
            if (course_startTime && course_endTime) {
                finalInstructorData.forEach((element: any, index: any) => {
                    course_startTime = this.commonFunctionService.formatTime(course_startTime);
                    course_endTime = this.commonFunctionService.formatTime(course_endTime);
                    let el_date = (element?.date_from) ? element.date_from : element;
                    instructorRecc[index] = {
                        date_from: this.datePipe.transform(new Date(el_date), 'YYYY-MM-dd'),
                        start_time: course_startTime,
                        end_time: course_endTime
                    };
                });
                this.courseForm.controls['instructorReccurance'].setValue(instructorRecc);
            } else {
                this.courseForm.controls['instructorReccurance'].setValue(this.courseForm.value.courseDate);
            }
        } else {
            this.notificationService.showError(this.language.courses.instruct_not_avail, null);
            this.matchInstrctDateError = { isError: true, errorMessage: this.language.courses.instruct_not_avail };
        }
    }

    /**
    * Function is used check the availability of Room for the course dates
    * @author  MangoIt Solutions(M)
    * @param   {startTime,endTime,course all dates,rooms dates}
    * @return  {Array Of Object} if test pass then courseRecurrence booking dates else error
    */
    checkRoomAvailability(course_startTime: any, course_endTime: any, course_allDates: any, roomsData: any, courseForm_courseDate: any) {
        var count: number = 0;
        var finalCourseData: any[] = []
        var courseRecu: any[] = [];
        var course_dates_length: any;

        if (courseForm_courseDate.length > 1) {
            course_dates_length = courseForm_courseDate.length;
            courseForm_courseDate.forEach((elem: any, index: any) => {
                elem.start_time = this.commonFunctionService.formatTime(elem.start_time);
                elem.end_time = this.commonFunctionService.formatTime(elem.end_time);
                roomsData.forEach((element: any, idn: any) => {
                    if ((element.date_start == this.datePipe.transform(elem.date_from, 'yyyy-MM-dd')) &&
                        (elem.start_time >= element.start.split('T')[1]) &&
                        (elem.end_time <= element.end.split('T')[1]) &&
                        (element.classNames != 'room-booked')
                    ) {
                        finalCourseData.push(elem);
                        count++;
                    }

                })
            })
        } else if (course_allDates) {
            course_dates_length = course_allDates.length;
            course_allDates.forEach((elem: any, index: any) => {
                roomsData.forEach((element: any, idn: any) => {
                    course_startTime = this.commonFunctionService.formatTime(course_startTime);
                    course_endTime = this.commonFunctionService.formatTime(course_endTime);
                    if ((element.date_start == this.datePipe.transform(elem, 'yyyy-MM-dd')) &&
                        (course_startTime >= element.start.split('T')[1]) &&
                        (course_endTime <= element.end.split('T')[1]) &&
                        (element.classNames != 'room-booked')
                    ) {
                        finalCourseData.push(elem);
                        count++;
                    }
                });
            });
        }
        finalCourseData = this.authService.uniqueData(finalCourseData);
        if (count >= course_dates_length) {
            this.matchDateError = { isError: false, errorMessage: '' };
            if (this.mustMatchs > this.selectedRoom.no_of_persons) {
                this.errorMatch = { isError: true, errorMessage: this.language.courses.room_error, };
            } else {
                this.errorMatch = { isError: false, errorMessage: '' };
                if (course_startTime && course_endTime) {
                    finalCourseData.forEach((element: any, index: any) => {
                        course_startTime = this.commonFunctionService.formatTime(course_startTime);
                        course_endTime = this.commonFunctionService.formatTime(course_endTime);

                        let el_date = (element?.date_from) ? element.date_from : element;
                        courseRecu[index] = {
                            date_from: this.datePipe.transform(new Date(el_date), 'YYYY-MM-dd'),
                            start_time: course_startTime,
                            end_time: course_endTime
                        };
                    });
                    this.courseForm.controls['courseReccurance'].setValue(JSON.stringify(courseRecu));
                } else {
                    this.courseForm.controls['courseReccurance'].setValue(JSON.stringify(courseForm_courseDate));
                }
            }
        } else {
            this.notificationService.showError(this.language.courses.room_not_avail, null);
            this.matchDateError = { isError: true, errorMessage: this.language.courses.room_not_avail };
        }
    }

    /**
    * Function is used to get today date
    * @author  MangoIt Solutions
    */
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    errorDate: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorTime: { isError: boolean; errorMessage: string; index: '' } = { isError: false, errorMessage: '', index: '' };
    /**
    * Function is used to compare two date
    * @author  MangoIt Solutions
    */
    compareTwoDates(i: any) {
        if ((this.courseForm.controls['courseDate'].value[i] && this.courseForm.controls['courseDate'].value[i]?.date_from != '') && (this.courseForm.controls['courseDate'].value[i] && this.courseForm.controls['courseDate'].value[i]?.date_to != '')) {
            if (new Date(this.courseForm.controls['courseDate'].value[i]?.date_to) < new Date(this.courseForm.controls['courseDate'].value[i]?.date_from)) {
                this.errorDate = { isError: true, errorMessage: this.language.error_message.end_date_greater };
            } else {
                this.errorDate = { isError: false, errorMessage: '' };
            }
        }
    }

    /**
    * Function is used to compair two time
    * @author  MangoIt Solutions
    */
    compareTwoTimes(i: any) {
        if ((this.courseForm?.controls?.['courseDate']?.value[i]?.start_time != '') && (this.courseForm?.controls?.['courseDate']?.value[i]?.end_time != '')) {
            if ((this.courseForm.controls['courseDate'].value[i]?.start_time >= this.courseForm.controls['courseDate'].value[i]?.end_time)
            ) {
                this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same, index: i };
            } else {
                this.errorTime = { isError: false, errorMessage: '', index: '' };
            }
        }
    }

    /**
    * Function is used to get end date
    * @author  MangoIt Solutions
    */
    getEndDate() {
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["start_time"].setValue('');
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["date_from"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
        this.courseForm.controls["start_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
        this.courseForm.controls["end_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);
        return this.courseForm.controls.date_from.value
    }


    /**
    * Function is used to select Recurrence
    * @author  MangoIt Solutions
    */

    onRecurrenceSelect(item: { item_id: number, item_text: string }) {
        this.recurrenceSelected = item.item_id;
        var today: number = (new Date()).getDay();
        var self = this;
        if (this.weekDaysArr && this.weekDaysArr.length > 0) {
            this.weekDaysArr.forEach(function (vals, keys) {
                if (vals.item_id == today) {
                    self.todayName = vals.description;
                }
            });
        }
        if (item.item_id == 5) {
            this.isCustom = true;
            setTimeout(() => {
                $('#showPopup').trigger('click');
            }, 300);
        }
        else {
            this.isCustom = false;
        }
    }

    onRecurrenceDeSelect() {
        this.recurrenceSelected = null;
        this.courseForm.controls["date_to"].setValue('');
    }

    /**
    * Function is used to select custome Recurrence
    * @author  MangoIt Solutions
    */
    onCustomRecurrenceSelect(item: { item_id: number, item_text: string }[]) {
        this.customRecurrenceTypeSelected = item['item_id'];
        this.naturalNumber = true;
        if (item['item_id'] == 2) {
            this.courseForm.addControl('recc_week', this.formBuilder.control(''));
        } else {
            if (this.courseForm.contains('recc_week')) {
                this.courseForm.removeControl('recc_week');
            }
        }
    }

    checkOnlyNaturalNumber(event: any) {
        let n = event.target.value;
        var result = (n - Math.floor(n)) !== 0;
        if (n == null || n == '') {
            this.naturalNumber = true;
        } else {
            if (result) {
                this.naturalNumber = true;
            } else if (n && n <= 0) {
                this.naturalNumber = true;
            } else if (n && n > 99) {
                this.naturalNumber = true;
            } else {
                this.naturalNumber = false;
            }
        }
    }

    /**
     * Function to check the end date is always grater than the start date
     * @author  MangoIt Solutions
     */
    dateSubmit() {
        if ((this.courseForm.controls['courseDate'].value[0] && this.courseForm.controls['courseDate'].value[0]?.start_time != '')) {
            if (this.courseForm.controls['courseDate'].value.length == 1) {
                this.recurrenceDropdownField = true;
                this.checkRecc = true;
            }
        } else {
            this.recurrenceDropdownField = false;
        }
    }

    endRepeatDate() {
        if (this.courseForm.controls.date_to != null) {
            this.endDateRepeat = true;
            this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            this.onRec()
        }
    }

    /**
    * Function is used to set date in form
    * @author  MangoIt Solutions
    */
    endRepeat() {
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["start_time"].setValue('');
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["date_from"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
        this.courseForm.controls["start_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
        this.courseForm.controls["end_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);
        if (this.courseForm.controls.recurrence.value != '' && this.courseForm.controls.recurrence.value[0].item_id != 0) {
            if (this.dateRepeat) {
                this.endDateRepeat = true;
                this.onRec()
            } else {
                this.endDateRepeat = true;
                this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
                this.onRecurrence();
            }
        } else {
            this.courseForm.controls["date_repeat"].setValue('');
            this.endDateRepeat = false;
            this.getCourseAllDates();
        }
    }


    /**
    * Function is used to select Recurrence
    * @author  MangoIt Solutions
    */
    onRec() {
        if ((this.customRecurrenceTypeSelected) || (this.recurrenceSelected == 5 || this.recurrenceSelected)) {
            if (this.customRecurrenceTypeSelected) {
                this.setCustomRecurrence();
            } else if (this.recurrenceSelected == 5) {
                this.setCustomRecurrence();
            } else {
                this.onRecurrence()
            }
        } else {
            if ((this.typerecc) && (this.interval || this.byDay)) {
                this.setCustomRecurrence();
            } else {
                this.onRecurrence();
            }
        }
    }

    /**
     * Function to create the Recurrence
     * @author  MangoIt Solutions
     */
    onRecurrence() {
        if (this.recurrenceSelected != 5) {
            this.recurrenceString = '';
            let monthDates: any = []
            this.course_allDates = [];
            if (this.courseForm.controls['courseDate'] && this.courseForm.controls['courseDate'].value.length > 0) {
                this.courseForm.controls['courseDate'].value.sort().forEach(element => {
                    monthDates.push(new Date(element.date_from).getDate())
                });
            }
            if (this.courseForm.controls['courseDate'].value.length <= 1) {
                if (this.courseForm?.controls?.recurrence?.value != "") {
                    if (this.courseForm.controls.recurrence.value[0].item_id != 5 && this.courseForm.controls.date_repeat.value != '') {
                        if (this.courseForm.controls.recurrence.value[0].item_id == 0) {
                            this.recurrenceString = '';
                        } else if (this.courseForm.controls.recurrence.value[0].item_id == 1) {
                            let rule = new RRule({
                                "freq": RRule.DAILY,
                                'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                                'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                            });
                            let recc: string = rule.toString()
                            let re: string = recc.slice(0, 25).replace(":", "=");
                            let reccu: string = recc.slice(25);
                            this.recurrenceString = reccu + ';' + re;
                            this.course_allDates = RRule.fromString(this.recurrenceString).all();

                        } else if (this.courseForm.controls.recurrence.value[0].item_id == 2) {
                            let rule = new RRule({
                                "freq": RRule.WEEKLY,
                                'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                                'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                            });
                            let recc: string = rule.toString()
                            let re: string = recc.slice(0, 25).replace(":", "=");
                            let reccu: string = recc.slice(25);
                            this.recurrenceString = reccu + ';' + re;
                            this.course_allDates = RRule.fromString(this.recurrenceString).all();
                        } else if (this.courseForm.controls.recurrence.value[0].item_id == 3) {
                            let rule = new RRule({
                                "freq": RRule.MONTHLY,
                                'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                                'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                                'bymonthday': monthDates
                            });
                            let recc: string = rule.toString()
                            let re: string = recc.slice(0, 25).replace(":", "=");
                            let reccu: string = recc.slice(25);
                            this.recurrenceString = reccu + ';' + re;
                            this.course_allDates = RRule.fromString(this.recurrenceString).all();
                        } else if (this.courseForm.controls.recurrence.value[0].item_id == 4) {
                            let rule = new RRule({
                                "freq": RRule.YEARLY,
                                'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                                'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                            });
                            let recc: string = rule.toString()
                            let re: string = recc.slice(0, 25).replace(":", "=");
                            let reccu: string = recc.slice(25);
                            this.recurrenceString = reccu + ';' + re;
                            this.course_allDates = RRule.fromString(this.recurrenceString).all();
                        }
                    }
                } else if (this.typerecc == 'DAILY') {
                    let rule: any = new RRule({
                        "freq": RRule.DAILY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                    });
                    let recc: string = rule.toString()

                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all();
                } else if (this.typerecc == 'WEEKLY') {
                    let rule = new RRule({
                        "freq": RRule.WEEKLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                    });
                    let recc: string = rule.toString()
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else if (this.typerecc == 'MONTHLY') {
                    let rule = new RRule({
                        "freq": RRule.MONTHLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                        'bymonthday': monthDates
                    });
                    let recc: string = rule.toString()
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else if (this.typerecc == 'YEARLY') {
                    let rule = new RRule({
                        "freq": RRule.YEARLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    });
                    let recc: string = rule.toString()
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else {
                    this.recurrenceString = '';
                    this.getCourseAllDates();
                }
            }
        } else {
            this.setCustomRecurrence();
        }
    }

    /**
     * Function to create Custom Recurrence
     * @author  MangoIt Solutions
     */
    setCustomRecurrence() {
        if (this.recurrenceSelected == 5) {
            if (this.courseForm.controls["date_to"].value) {
                this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            } else {
                this.courseForm.controls["date_to"].setValue(this.courseForm.controls["date_from"].value);
                this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            }
            let monthDates: any = []
            if (this.courseForm.controls['courseDate'] && this.courseForm.controls['courseDate'].value.length > 0) {
                this.courseForm.controls['courseDate'].value.sort().forEach(element => {
                    monthDates.push(new Date(element.date_from).getDate())
                });
            }

            if (this.courseForm.controls['courseDate'].value.length <= 1) {
                let recurrenceData: string = '';
                if (this.customRecurrenceTypeSelected != null) {
                    if (this.customRecurrenceTypeSelected == 1) {
                        //daily
                        recurrenceData = '';
                        let numberWeek: number = $('.custom_recurrence_daily').val();
                        let r_rule = {
                            "freq": RRule.DAILY,
                            'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                            'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                        };
                        if (numberWeek > 0) {
                            r_rule["interval"] = numberWeek;
                        }
                        let rule = new RRule(r_rule);
                        let recc: string = rule.toString();
                        let re: string = recc.slice(0, 25).replace(":", "=");
                        let reccu: string = recc.slice(25);
                        recurrenceData = reccu + ';' + re;
                        this.course_allDates = RRule.fromString(recurrenceData).all();
                    } else if (this.customRecurrenceTypeSelected == 2) {
                        //weekly
                        var self = this;
                        recurrenceData = '';
                        let numberWeek: number = $('.custom_recurrence_weekly').val();
                        //interval
                        let byDay: any[] = [];
                        if (self.weekDaysArr && self.weekDaysArr.length > 0) {
                            self.weekDaysArr.forEach(function (weekName, weekIndex) {
                                self.weekDayTypeSelected.forEach(function (weekSelected, key) {
                                    if (weekName.item_id == weekSelected) {
                                        byDay.push(weekName.description);
                                    }
                                });
                            });
                        }
                        //byWeekDay
                        let r_rule = {
                            "freq": RRule.WEEKLY,
                            'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                            'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                        };
                        if (numberWeek > 0) {
                            r_rule["interval"] = numberWeek;
                        }
                        let rule = new RRule(r_rule);
                        var recc: string = rule.toString();
                        if (byDay.length > 0) {
                            let recc_str: string;
                            recc_str = rule.toString().concat(';BYDAY=');
                            if (byDay && byDay.length > 0) {
                                byDay.forEach((val, key) => {
                                    recc_str = recc_str.concat(val + ',')
                                    if (key == byDay.length - 1) {
                                        recc_str = recc_str.concat(val)
                                    }
                                });
                            }
                            recc = recc_str;
                        }
                        let re: string = recc.slice(0, 25).replace(":", "=");
                        let reccu: string = recc.slice(25);
                        recurrenceData = reccu + ';' + re;
                        this.course_allDates = RRule.fromString(recurrenceData).all();
                    } else if (this.customRecurrenceTypeSelected == 3) {
                        recurrenceData = '';
                        let numberWeek: number = $('.custom_recurrence_monthly').val();
                        let r_rule = {
                            "freq": RRule.MONTHLY,
                            'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                            'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                            'bymonthday': monthDates
                        };
                        if (numberWeek > 0) {
                            r_rule["interval"] = numberWeek;
                        }
                        let rule = new RRule(r_rule);
                        let recc: string = rule.toString();
                        let re: string = recc.slice(0, 25).replace(":", "=");
                        let reccu: string = recc.slice(25);
                        recurrenceData = reccu + ';' + re;
                        this.course_allDates = RRule.fromString(recurrenceData).all();
                    } else if (this.customRecurrenceTypeSelected == 4) {
                        recurrenceData = '';
                        let numberWeek: number = $('.custom_recurrence_yearly').val();
                        let r_rule = {
                            "freq": RRule.YEARLY,
                            'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                            'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                        };
                        if (numberWeek > 0) {
                            r_rule["interval"] = numberWeek;
                        }
                        let rule = new RRule(r_rule);
                        let recc: string = rule.toString();
                        let re: string = recc.slice(0, 25).replace(":", "=");
                        let reccu: string = recc.slice(25);
                        recurrenceData = reccu + ';' + re;
                        this.course_allDates = RRule.fromString(recurrenceData).all();
                    }
                } else if (this.typerecc == 'DAILY') {
                    //daily
                    recurrenceData = '';
                    let r_rule = {
                        "freq": RRule.DAILY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                    };
                    if (this.interval) {
                        r_rule["interval"] = this.interval;
                    }
                    let rule = new RRule(r_rule);
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    recurrenceData = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(recurrenceData).all();
                } else if (this.typerecc == 'WEEKLY') {
                    var self = this;
                    recurrenceData = '';
                    let numberWeek: string = this.interval;
                    let r_rule = {
                        "freq": RRule.WEEKLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
                    };
                    if (numberWeek) {
                        r_rule["interval"] = numberWeek;
                    }
                    let rule = new RRule(r_rule);
                    var recc: string = rule.toString();
                    if (this.byDay) {
                        let byday = this.byDay.split(",");
                        if (byday.length > 0) {
                            let recc_str: string;
                            recc_str = rule.toString().concat(';BYDAY=');
                            if (byday && byday.length > 0) {
                                byday.forEach((val, key) => {
                                    recc_str = recc_str.concat(val + ',')
                                    if (key == byday.length - 1) {
                                        recc_str = recc_str.concat(val)
                                    }
                                });
                                recc = recc_str;
                            }
                        }
                    };

                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    recurrenceData = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(recurrenceData).all();
                } else if (this.typerecc == 'MONTHLY') {
                    recurrenceData = '';
                    let numberWeek: string = this.interval
                    let r_rule: { freq: Frequency, dtstart: Date, until: Date, bymonthday: any } = {
                        "freq": RRule.MONTHLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                        'bymonthday': monthDates
                    };
                    if (numberWeek) {
                        r_rule["interval"] = numberWeek;
                    }
                    let rule: RRule = new RRule(r_rule);
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    recurrenceData = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(recurrenceData).all();
                } else if (this.typerecc == 'YEARLY') {
                    recurrenceData = '';
                    let numberWeek: string = this.interval;
                    let r_rule = {
                        "freq": RRule.YEARLY,
                        'dtstart': new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        'until': new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    };
                    if (numberWeek) {
                        r_rule["interval"] = numberWeek;
                    }
                    let rule = new RRule(r_rule);
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(":", "=");
                    let reccu: string = recc.slice(25);
                    recurrenceData = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(recurrenceData).all();
                }
                // $('#showPopup').trigger('click');
                // this.closeModal();
                this.finalCustomRecurrence = recurrenceData;
            }
        }
    }

    customReccModalClose() {
        $('#showPopup').trigger('click');
        this.closeModal();
    }

    getCourseAllDates() {
        var alldates: any[] = [];
        this.course_allDates = [];
        if (this.recurrenceSelected == 0) {
            this.courseForm.controls["date_to"].setValue(this.courseForm.value['date_from']);
        }
        if (this.courseForm.controls.courseDate.value.length > 1) {
            var cour_dates: any[] = [];
            alldates = this.courseForm.controls.courseDate.value;
            alldates.forEach(element => {
                cour_dates.push(new Date(element.date_from));
            });
            this.course_allDates = this.authService.uniqueData(cour_dates);
        } else {
            this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            alldates = this.commonFunctionService.getDates(new Date(this.courseForm.controls.date_from.value), new Date(this.courseForm.controls.date_to.value))
            this.course_allDates = alldates;
        }
    }

    /**
    * Function is used to select room in drop down
    * @author  MangoIt Solutions
    */
    onRoomSelect(item: { id: number, name: string }) {
        this.matchDateError = { isError: false, errorMessage: '' };
        this.roomsById(item.id);
        this.roomSelected = item.id;
        this.romData.forEach(element => {
            if (element.id == item.id) {
                this.selectedRoom = element
            }
        });
    }

    /**
    * Function is used to fr select room in drop down
    * @author  MangoIt Solutions
    */
    onRoomDeSelect(item: any) {
        this.matchDateError = { isError: false, errorMessage: '' };
        this.calendarRooms = [];
        this.exitsRoom = [];
        this.roomSelected = null;
        this.romData.forEach(element => {
            if (element.id == item.id) {
                this.selectedRoom = null;
            }
        });
    }

    /**
     * Function is used to get room by Id
     * @author  MangoIt Solutions
     * @param   {id}
     * @return  {object array}
     */
    roomsById(id: number) {
        this.commonFunctionService.roomsById(id)
            .then((resp: any) => {
                this.roomsByIdData = resp;
                setTimeout(() => {
                    this.getRoomCalendar(this.roomsByIdData);
                }, 500);

            })
            .catch((erro: any) => {
                this.notificationService.showError(erro, null);
            });
    }

    getRoomCalendar(roomsByIdData: any) {
        this.allRoomCalndr = this.commonFunctionService.getRoomCalendar(roomsByIdData);
        this.calendarRooms = this.allRoomCalndr[0].cal;
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            slotDuration: '00:02:30', // length of time slots
            height: 500,
            slotEventOverlap: false,
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
            events: this.calendarRooms,
            locale: this.selectLanguage,
            eventTextColor: 'black',
            eventDisplay: 'list-item',
            expandRows: true,
            displayEventTime: true,
            displayEventEnd: true,
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
        };
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

    onCancel() {
        window.history.back();
    }

    /**
    * Function is used to add validation as per visibility selection
    * @author  MangoIt Solutions
    */
    onVisibilitySelect(item: { item_id: number, item_text: string }) {
        this.visibility = item.item_id;
        if (this.visibility == 3) {
            this.courseForm.get('course_groups').setValidators(Validators.required);
            this.courseForm.get('course_groups').updateValueAndValidity();
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.userSelected = [];

        } else if (this.visibility == 1) {
            this.courseForm.get('participant').setValidators(Validators.required);
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
            this.userSelected = [];

        } else if (this.visibility == 2) {
            this.userSelected = [];
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();

        } else if (this.visibility == 4) {
            this.userSelected = [];
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
            if (this.alluserDetails && this.alluserDetails.length > 0) {
                this.alluserDetails.forEach((element) => {
                    this.userSelected.push(element.id);
                });
            }
        }
    }

    /**
    * Function is used to remove validation as per visibility selection
    * @author  MangoIt Solutions
    */
    changeVisibility() {
        if (this.courseForm.controls.visibility.status == 'INVALID') {
            this.courseForm.controls["course_groups"].setValue('');
            this.courseForm.controls["participant"].setValue('');
            this.visibility = null;
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
        }
    }

    /**
    * Function is used to select user
    * @author  MangoIt Solutions
    */
    onUserSelect(item: { id: number, name: string }) {
        this.userSelected.push(item.id);
    }

    /**
    * Function is used to de select user
    * @author  MangoIt Solutions
    */
    onUserDeSelect(item: { id: number, name: string }) {
        this.userSelected.forEach((value, index) => {
            if (value == item.id) this.userSelected.splice(index, 1);
        });
    }

    /**
    * Function is used to select all user
    * @author  MangoIt Solutions
    */
    onUserSelectAll(item: { id: number, name: string }[]) {
        this.userSelected = [];
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const element: any = item[key];
                this.userSelected.push(element.id);
            }
        }
    }

    /**
    * Function is used to de select all user
    * @author  MangoIt Solutions
    */
    onUserDeSelectAll(item: any) {
        this.userSelected = [];
    }

    onSelectAll(items: any) {
    }

    /**
    * Function is used to get approved Group Users
    * @author  MangoIt Solutions
    * @param   {group_id, name}
    * @return  {object} group user object
    */
    onGroupSelect(item: { group_id: number, name: string }) {
        this.userSelected = [];
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + item.group_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    var groupParticipants: any = respData[0].participants;
                    var groupUsers: { user_id: string, approved_status: number }[] = [];
                    if (groupParticipants && groupParticipants.length > 0) {
                        groupParticipants.forEach(function (value, key) {
                            var status: number = 0;
                            if (value.user_id == localStorage.getItem('user-id')) {
                                status = 1;
                            }
                            var userGroupObj: { user_id: string, approved_status: number } = { 'user_id': value.user_id, 'approved_status': status };
                            groupUsers.push(userGroupObj);
                        });
                    }
                    this.groupUserList = groupUsers;
                }
            );
    }

    /**
    * Function is used to add and remove validation as per Instructor type selection
    * @author  MangoIt Solutions
    */
    onInstructorTypeSelect(item: { item_id: number, item_text: string }[]) {
        this.instrucType = item['item_id'];
        if (this.instrucType == 1) {
            this.courseForm.get('instructor_internal').setValidators(Validators.required);
            this.courseForm.get('instructor_internal').updateValueAndValidity();
            this.courseForm.get('instructor_external').clearValidators();
            this.courseForm.get('instructor_external').updateValueAndValidity();
            this.courseForm.controls['instructor_internal'].reset();
            this.instructorById = '';
            this.instructorCalendar = [];
            this.externalInstructor = [];
        } else if (this.instrucType == 2) {
            this.courseForm.get('instructor_external').setValidators(Validators.required);
            this.courseForm.get('instructor_external').updateValueAndValidity();
            this.courseForm.get('instructor_internal').clearValidators();
            this.courseForm.get('instructor_internal').updateValueAndValidity();
            this.courseForm.controls['instructor_external'].reset();
            this.internalInstructor = [];
        }
    }

    onInstructorTypeDeSelect(item: { item_id: number; item_text: string }) {
        this.instrucType = null;
    }


    /**
    * Function is used to change Instructor in drop down
    * @author  MangoIt Solutions
    */
    changeInstructor() {
        if (this.courseForm.controls.instructor_type.status == 'INVALID') {
            this.courseForm.controls["instructor_external"].setValue('');
            this.courseForm.controls["instructor_internal"].setValue('');
            this.instrucType = null;
        }
    }

    /**
    * Function is used to select Internal Instructor in drop down
    * @author  MangoIt Solutions
    */
    onInternalInstructorSelect(item: { id: number, name: string }[]) {
        this.internalInstructor = [];
        this.internalInstructor.push({ 'user_id': item['id'] });
        if (this.internalInstructor) {
            // this.dateSubmit();
            this.endRepeat();
        }
    }

    /**
    * Function is used to de select Internal Instructor in drop down
    * @author  MangoIt Solutions
    */
    onInternalInstructorDeSelect(item: any) {
        this.internalInstructor.forEach((value, index) => {
            if (value.user_id == item.id)
                this.internalInstructor.splice(index, 1);
        });
    }

    /**
    * Function is used to select External Instructor in drop down
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeSelect(item: { id: number, name: string }) {
        this.externalInstructor = [];
        this.externalInstructor.push({ 'instructor_id': item.id });
        this.instructorDetailById(item.id);
    }

    /**
 * Function is used to get room by Id
 * @author  MangoIt Solutions
 * @param   {id}
 * @return  {object array}
 */
    instructorDetailById(id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getInstructorById/' + id, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.instructorById = respData['result'];
                    setTimeout(() => {
                        this.externalInstructorCalendar(respData['result']);
                    }, 500);
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            });
        // this.commonFunctionService.roomsById(id)
        // .then((resp: any) => {
        //     this.roomsByIdData = resp;
        //     setTimeout(() => {
        //         this.getRoomCalendar(this.roomsByIdData);
        //     }, 500);
        //     })
        // .catch((erro: any) => {
        //     this.notificationService.showError(erro, null);
        // });
    }

    externalInstructorCalendar(instructorById: any) {
        // this.instructorCalendar =  this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.allExternlCalndr = this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.instructorCalendar = this.allExternlCalndr[0].cal;
        this.calendarOptionsExternal = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            slotDuration: '00:02:30', // length of time slots
            height: 500,
            slotEventOverlap: false,
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
            eventClick: this.handleEventClickExtnl.bind(this),
            dateClick: this.handleDateClickExtnl.bind(this),
            events: this.instructorCalendar,
            locale: this.selectLanguage,
            eventTextColor: 'black',
            eventDisplay: 'list-item',
            expandRows: true,
            displayEventTime: true,
            displayEventEnd: true,
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


    handleEventClickExtnl(arg) {
        if (arg.event['_def'].publicId && arg.event['_def']['extendedProps']['date_start'] && arg.event['_def']['extendedProps']['type']) {
            this.viewDetailsExternal(arg.event['_def'].publicId, arg.event['_def']['extendedProps']['date_start'], arg.event['_def']['extendedProps']['type'])
        }
    }

    handleDateClickExtnl(arg) {
        console.log(arg.date);
    }

    /**
     * Function to redirect the user with date parameter
     * Date: 14 Mar 2023
     * @author  MangoIt Solutions (R)
     * @param   {id , date}
     * @return  {}
     */
    viewDetailsExternal(id: any, date: any, type: any) {
        $('#view-rooms').modal('hide');
        if (type == 'course') {
            // this.router.navigate(['/course-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
            const url = '/course-detail/' + id;
            const queryParams = { date: new Date(date).toISOString().split('T')[0] };
            const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
            const fullUrl = url + '?' + queryString;
            // Use window.open() to redirect to the URL in a new tab
            window.open(fullUrl);
        } else {
            // this.router.navigate(['/event-detail/' + id], { queryParams: { date: new Date(date).toISOString().split('T')[0] } });
            const url = '/event-detail/' + id;
            const queryParams = { date: new Date(date).toISOString().split('T')[0] };
            const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
            const fullUrl = url + '?' + queryString;
            // Use window.open() to redirect to the URL in a new tab
            window.open(fullUrl);
        }
    }

    /**
    * Function is used to de select External Instructor in drop down
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeDeSelect(item: { id: number, name: string }) {
        this.instructorCalendar = [];
        this.externalInstructor.forEach((value, index) => {
            if (value.instructor_id == item.id) {
                this.externalInstructor.splice(index, 1);
            }
        });
    }

    /**
    * Function is used to select week day
    * @author  MangoIt Solutions
    */
    onWeekDaySelect(item: { item_id: number, description: string }[]) {
        this.weekDayTypeSelected.push(item['item_id']);
    }

    /**
    * Function is used to de select week day
    * @author  MangoIt Solutions
    */
    onWeekDayDeSelect(item: { item_id: number, description: string }) {
        this.weekDayTypeSelected.forEach((value, index) => {
            if (value == item.item_id) {
                this.weekDayTypeSelected.splice(index, 1);
            }
        });
    }

    /**
   * Function to check the validation of allowed person field
   * @author  MangoIt Solutions
   */
    checkNumber() {
        if (this.courseForm.value['allowed_persons'] == "") {
            this.checkNum = false;
        } else if (this.courseForm.value['allowed_persons'] == '0') {
            this.checkNum = true;
        } else {
            this.checkNum = false;
        }
    }

    /**
     * Function to check the validation of Price field
     * @author  MangoIt Solutions
     */
    checkPrice() {
        if (this.courseForm.value['price_per_participant'] == "") {
            this.checkPric = false;
        } else if (this.courseForm.value['price_per_participant'] <= 0) {
            this.checkPric = true;
        } else {
            this.checkPric = false;
        }
    }

    /**
     * Function to Add task in the course
     * @author  MangoIt Solutions (R,M)
     */
    onTaskSelect() {
        this.isTaskField = !this.isTaskField
        let control = this.courseForm.controls.task['controls'][0] as UntypedFormGroup;
        if (this.isTaskField && (this.task && this.task.length < 1)) {
            const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                title: ['', Validators.required],
                description: ['', Validators.required],
                organizer_id: [localStorage.getItem('user-id')],
                status: [],
                group_id: [''],
                groups: [''],
                user_select: [''],
                date: ['', Validators.required],
                type_dropdown: ['', Validators.required],
                taskCollaborators: [''],
            });
            this.task.push(newAvailableTimes);
        }
    }

    /**
    * Function is used to select task type
    * @author  MangoIt Solutions
    */
    onTaskTypeSelect(item: { id: number; name: string }) {
        this.type_visibility = item.id;
        this.showUsers = false;
        this.participantSelectedToShow = [];
        this.task_user_selected = []
        let control = this.courseForm.controls.task['controls'][0] as UntypedFormGroup;
        control.controls['taskCollaborators'].setValue([]);
        if (this.type_visibility == 1) {
            control.get('groups').setValidators(Validators.required);
            control.get('groups').updateValueAndValidity();
            control.get('user_select').clearValidators();
            control.get('user_select').updateValueAndValidity();
        } else {
            control.controls['group_id'].setValue(0);
            control.get('user_select').setValidators(Validators.required);
            control.get('user_select').updateValueAndValidity();
            control.get('groups').clearValidators();
            control.get('groups').updateValueAndValidity();

        }
    }

    /**
    * Function is used to de select task type
    * @author  MangoIt Solutions
    */

    onTaskTypeDeSelect(item: { id: number; name: string }, index) {
        this.type_visibility = null;
        this.showUsers = false;
        this.participantSelectedToShow = [];
    }

    /**
    * Function is used to select task user
    * @author  MangoIt Solutions
    */
    onTaskUserSelect(item: { id: number; user_name: string }) {
        this.showUsers = true;
        this.participantSelectedToShow.push(item);
        this.participantSelectedItem.push(item.id);
        this.task_user_selected.push({
            'user_id': item.id,
            'approved_status': 1
        });
    }

    /**
    * Function is used to remove task user
    * @author  MangoIt Solutions
    */
    onTaskUserDeSelect(item: { id: number; user_name: string }) {
        if (this.task_user_selected) {
            this.task_user_selected.forEach((value, index) => {
                if (value.user_id == item.id) {
                    this.task_user_selected.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function is used to select task group
    * @author  MangoIt Solutions
    */
    onTaskGroupSelect(item: { group_id: number; user_name: string }) {
        let self = this;
        this.courseForm.controls['task'].value[0].group_id = item.group_id;
        this.task_user_selected = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + item.group_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData[0]?.participants) {
                        var groupParticipants = respData[0]?.participants;
                        if (groupParticipants && groupParticipants.length > 0) {
                            groupParticipants.forEach(function (value, key) {
                                if (value.approved_status == 1) {
                                    self.task_user_selected.push({
                                        'user_id': value.user_id,
                                        'approved_status': 1
                                    })
                                }
                            });
                        }
                    }
                }
            );
    }

    /**
    * Function is used to set users participants
    * Date: 03 Feb 2023
    * @author  MangoIt Solutions (R)
    * @param   {taskId}
    * @return  {Array Of Object} users all detail
    */
    setUsers(taskid: number, type_dropdown: any) {
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'getTaskCollaborator/task/' + taskid, null).subscribe((respData: any) => {
                for (const key in respData) {
                    if (Object.prototype.hasOwnProperty.call(respData, key)) {
                        var element: any = respData[key];
                        this.setTaskUsers.push({
                            id: element.user_id, user_email: element.user[0].email, user_name: element.user[0].firstname + ' ' + element.user[0].lastname,
                        });

                        this.task_user_selected.push({
                            'user_id': element.user_id,
                            'approved_status': 1
                        })
                    }
                }
                const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                    title: [this.courseDetails?.courseTask?.title, Validators.required],
                    description: [this.courseDetails?.courseTask?.description, Validators.required],
                    organizer_id: [this.courseDetails?.courseTask?.organizer_id],
                    status: [this.courseDetails?.courseTask?.status],
                    group_id: [this.courseDetails?.courseTask?.group_id],
                    groups: [''],
                    date: [this.courseDetails?.courseTask?.date.split("T")[0], Validators.required],
                    type_dropdown: [type_dropdown, Validators.required],
                    user_select: [this.setTaskUsers, Validators.required],
                    taskCollaborators: [''],
                });
                this.task.push(newAvailableTimes);
            });
        }
    }

    /**
   * Function is used to delete task by id
   * @author  MangoIt Solutions
   * @param   {taskId}
   * @return  success message
   */
    deleteTask(taskId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_task, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'DeleteTask/' + taskId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = respData.result.message;
                        self.notificationService.showSuccess(self.responseMessage, null);
                        setTimeout(() => {
                            self.taskStatus = 0
                            self.isTaskField = false;
                            $("#isTask_check").prop("checked", false);
                            self.task_user_selected = [];
                            self.task.removeAt(0);
                            self.getCourseInfo(self.courseId);
                            self.taskStatus = null;
                        }, 2000);
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to add task date validation
    * @author  MangoIt Solutions
    * @param   {taskId}
    * @return  success message
    */
    taskDateValidate(date: any) {
        var date_from: any;
        var date_to: any;
        if (this.courseForm?.value?.courseDate?.length == 1 && this.courseForm.controls?.date_to?.value != "") {
            if (this.courseForm.controls.date_from.value <= date.target.value && this.courseForm.controls.date_to.value >= date.target.value) {
                this.errorDateTask = { isError: false, errorMessage: '' };
            } else {
                this.errorDateTask = { isError: true, errorMessage: this.language.error_message.courseTaskDate };
            }
        } else {
            this.courseForm?.value?.courseDate?.forEach((element: any, index: any) => {
                if (index == 0) {
                    date_from = element.date_from;
                }
                if (this.courseForm?.value?.courseDate.length - 1 === index) {
                    date_to = element.date_from
                }
                if (date_from <= date.target.value && date_to >= date.target.value) {
                    this.errorDateTask = { isError: false, errorMessage: '' };
                } else {
                    this.errorDateTask = { isError: true, errorMessage: this.language.error_message.courseTaskDate };
                }
            });
        }
    }


    closeModal() {
        $('#modal_close').show('hide');
    }

    /**
     * Function to checked the box if price is there
     * @param event
     */
    eventCheck(event: Event) {
        if (event.target['checked']) {
            this.eventPriceDisplay = true;
        } else {
            this.eventPriceDisplay = false;
        }
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
        // var endPoint = 'get-documentbyname';
        var endPoint = 'download-course-document';
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
                this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 2000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event)
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
            this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
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
                    this.courseForm.patchValue({ file: this.fileToReturn });
                    this.courseForm.get('file').updateValueAndValidity();
                    $('.preview_txt').show(this.fileToReturn.name);
                    $('.preview_txt').text(this.fileToReturn.name);
                }
            );
    }

    getTime() { }

    imageLoaded() {
    }

    cropperReady() {
        /* cropper ready */
        this.isImage = false;
    }

    loadImageFailed() {
        /* show message */
    }

    errorFile: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorFiles: { Error: boolean, errorMessage: string } = { Error: false, errorMessage: '' };
    uploadFile1(event: Event) {
        this.picVid1 = null;
        $('.preview_txt1').hide();
        $('.preview_txt1').text('');
        this.errorFile = { isError: false, errorMessage: '' };
        const file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        const mimeType1: number = file.size;
        if (mimeType1 <= 20000000) {
            if (mimeType.match(/application\/*/) == null && mimeType.match(/text\/*/) == null) {
                this.errorFiles = { Error: true, errorMessage: this.language.error_message.common_valid };
                setTimeout(() => {
                    this.errorFiles = { Error: false, errorMessage: '' };
                }, 3000);
                this.picVid1 = null;
                $('.preview_txt1').hide();
                $('.preview_txt1').text('');
            } else {
                this.errorFiles = { Error: false, errorMessage: '' };
                this.picVid1 = file
                const reader: FileReader = new FileReader();
                reader.readAsDataURL(file);
                var urll: any;
                reader.onload = (_event) => {
                    urll = reader.result;
                }
                $('.message-upload-list').show();
            }
            $('.preview_txt1').show();
            $('.preview_txt1').text(file.name);
        } else {
            this.errorFile = { isError: true, errorMessage: this.language.create_message.file_size };
            setTimeout(() => {
                this.errorFile = { isError: false, errorMessage: '' };
            }, 3000);
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
