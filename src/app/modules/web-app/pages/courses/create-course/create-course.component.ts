import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, UntypedFormArray, Validators, } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { RRule } from 'rrule';
import { NgxImageCompressService } from "ngx-image-compress";
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import {LoginDetails, Room, ThemeType, UserDetails} from '@core/models';
import {
  AuthServiceService,
  CommonFunctionService,
  LanguageService,
  NavigationService,
  NotificationService,
  ThemeService
} from '@core/services';

declare var $: any;

@Component({
    selector: 'app-create-course',
    templateUrl: './create-course.component.html',
    styleUrls: ['./create-course.component.css'],
    providers: [DatePipe],
})

export class CreateCourseComponent implements OnInit, OnDestroy {
    language: any;
    eventPriceDisplay: boolean = false;
    responseMessage: string = null;
    courseForm: UntypedFormGroup;
    eventSubmitted: boolean = false;
    file: File;
    fileToReturn: File;
    isCustom: boolean = false;
    recurrenceDropdownField: boolean = false;
    endDateRepeat: boolean = false;
    userDetails: LoginDetails;
    alluserDetails: UserDetails[] = [];
    userSelected: number[] = [];
    recurrenceSelected: number = 0;
    roomSelected: number;
    customRecurrenceTypeSelected: number;
    weekDayTypeSelected: number[] = [];
    datearr: number[] = [];
    datearrcustom: number[] = [];
    recurrenceString: string = '';
    setTheme: ThemeType;
    visibility: number;
    type: number;
    untilString: string = '';
    todayName: string;
    finalCustomRecurrence: string;
    instrucType: number;
    romData: Room[] = [];
    selectedRoom: Room;
    mustMatchs: number;
    teamId: number;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    naturalNumber: boolean = true;
    checkNum: boolean = false;
    checkPric: boolean = false;
    eventTypeDropdownSettings: IDropdownSettings;
    visibilityDropdownSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    roomDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    customRecurrenceDropdownSettings: IDropdownSettings;
    weekDayDropdownSettings: IDropdownSettings;
    instuctorTypeDropdownSettings: IDropdownSettings;
    externalDropdownSettings: IDropdownSettings;
    internalDropdownSettings: IDropdownSettings;
    recurrenceDropdownSettings: IDropdownSettings;
    visibilityDropdownList: { item_id: number; item_text: string }[] = [];
    eventTypeDropdownList: { item_id: number; item_text: string }[] = [];
    customRecurrenceDropdownList: { item_id: number; item_text: string }[] = [];
    recurrenceDropdownList: { item_id: number; item_text: string }[] = [];
    userDropdownList: { id: number; name: string }[] = [];
    roomDropdownList: { id: number; name: string }[] = [];
    groupUserList: { user_id: string; approved_status: number }[] = [];
    weekDayDropdownList: { item_id: number; description: string }[] = [];
    externalInstructorList: { id: number; name: string }[] = [];
    instuctorTypeDropdownList: { item_id: number; item_text: string }[] = [];
    weekDaysArr: { item_id: number; description: string }[] = [];
    internalInstructor: { user_id: string }[] = [];
    externalInstructor: { instructor_id: number }[] = [];
    recurrenceType: { item_id: number; description: string }[] = [];
    group_dropdown: { group_id: number; name: string }[] = [];
    userObj: { user_id: any; approved_status: number }[] = [];

    private activatedSub: Subscription;

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
        defaultParagraphSeparator: 'p',
    };
    isImage: boolean = false;
    isTaskField: boolean = false
    type_dropdown: { id: number; name: string }[] = [];
    typeDropdownSettings: IDropdownSettings;
    type_visibility: number;
    showUsers: boolean;
    participantSelectedToShow: { id: number; user_name: string }[] = [];
    user_dropdown: { id: number; user_email: string; user_name: string }[] = [];
    participantDropdownSettings: IDropdownSettings;
    participantSelectedItem: number[] = [];
    task_user_selected: any[] = [];
    task_group_dropdown: any[];
    taskgroupDropdownSettings: IDropdownSettings;
    errorDateTask = { isError: false, errorMessage: '' }
    calendarClicked: boolean = false;
    calendarEventClicked: boolean = false;
    calendarOptions: CalendarOptions;
    calendarOptionsTimeGrid: CalendarOptions;
    selectLanguage: string;
    calendarRooms: any[] = [];
    roomsByIdData: any
    date_end: string;
    course_allDates: Date[] = [];
    imgHeight: any;
    imgWidth: any;
    todays_date: string;
    date: Date;
    matchDateError: any = { isError: false, errorMessage: '' };
    matchInstrctDateError: any = { isError: false, errorMessage: '' };
    instructorCalendar: any[];
    calendarOptionsExternal: CalendarOptions
    instructorById: any;
    selectedInstructorValue: any;
    allExternlCalndr: any[];
    allRoomCalndr: any[];
    customReccDateError: { isError: boolean; errorMessage: string; } = { isError: false, errorMessage: '' };

    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private datePipe: DatePipe
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

        $('#date_end').on('keypress', function (e) {
            // e.preventDefault();
        });
        $('#date_start').on('keypress', function (e) {
            // e.preventDefault();
        });

        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        this.language = this.lang.getLanguaageFile();
        this.selectLanguage = localStorage.getItem('language');
        if (this.selectLanguage == 'sp') {
            this.selectLanguage = 'es'
        }

        this.getCourseOtherInfo();
        let userId = localStorage.getItem('user-id');
        this.instuctorTypeDropdownList = [
            { item_id: 1, item_text: this.language.courses.internal },
            { item_id: 2, item_text: this.language.courses.external },
        ];
        this.eventTypeDropdownList = [
            { item_id: 4, item_text: this.language.create_event.courses },
        ];

        this.visibilityDropdownList = [
            { item_id: 1, item_text: this.language.create_event.public },
            { item_id: 2, item_text: this.language.create_event.private },
            { item_id: 3, item_text: this.language.create_event.group },
            { item_id: 4, item_text: this.language.create_event.club },
        ];

        this.customRecurrenceDropdownList = [
            { item_id: 1, item_text: this.language.new_create_event.repeat_daily },
            { item_id: 2, item_text: this.language.new_create_event.repeat_weekly },
            { item_id: 3, item_text: this.language.new_create_event.repeat_monthly },
            { item_id: 4, item_text: this.language.new_create_event.repeat_yearly },
        ];

        this.recurrenceDropdownList = [
            { item_id: 0, item_text: this.language.new_create_event.does_not_repeat },
            { item_id: 1, item_text: this.language.new_create_event.every_day },
            { item_id: 2, item_text: this.language.new_create_event.every_week },
            { item_id: 3, item_text: this.language.new_create_event.every_month },
            { item_id: 4, item_text: this.language.new_create_event.every_year },
            { item_id: 5, item_text: this.language.new_create_event.custom },
        ];

        this.weekDaysArr = [
            { item_id: 0, description: 'SU' },
            { item_id: 1, description: 'MO' },
            { item_id: 2, description: 'TU' },
            { item_id: 3, description: 'WE' },
            { item_id: 4, description: 'TH' },
            { item_id: 5, description: 'FR' },
            { item_id: 6, description: 'SA' },
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

        this.recurrenceType = [
            { item_id: 0, description: '' },
            { item_id: 1, description: '' },
            { item_id: 2, description: 'FREQ=WEEKLY;WKST=SU;BYDAY=' },
            { item_id: 3, description: 'FREQ=MONTHLY;WKST=SU' },
            { item_id: 4, description: 'FREQ=YEARLY;WKST=SU' },
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

        this.eventTypeDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true,
        };

        this.visibilityDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };

        this.recurrenceDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true,
        };

        this.customRecurrenceDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true,
        };

        this.weekDayDropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'description',
            enableCheckAll: false,
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

        this.instuctorTypeDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true,
        };

        this.internalDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: false,
            closeDropDownOnSelection: true
        };

        this.courseForm = new UntypedFormGroup({
            name: new UntypedFormControl('', [Validators.required, this.noWhitespace]),
            place: new UntypedFormControl('', [
                Validators.required,
                this.noWhitespace,
            ]),
            type: new UntypedFormControl('course'),
            date_from: new UntypedFormControl('', Validators.required),
            date_to: new UntypedFormControl('', Validators.required),
            date_repeat: new UntypedFormControl('', Validators.required),
            start_time: new UntypedFormControl('', Validators.required),
            end_time: new UntypedFormControl('', Validators.required),
            room: new UntypedFormControl(''),
            allowed_persons: new UntypedFormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),]),
            visibility: new UntypedFormControl('', Validators.required),
            recurrence: new UntypedFormControl('', Validators.required),
            customRecurrence: new UntypedFormControl(''),
            show_guest_list: new UntypedFormControl(''),
            chargeable: new UntypedFormControl(''),
            description: new UntypedFormControl('', Validators.required),
            course_users: new UntypedFormControl(''),
            author: new UntypedFormControl(userId),
            approved_status: new UntypedFormControl(0),
            participant: new UntypedFormControl(''),
            participants: new UntypedFormControl('participants'),
            course_groups: new UntypedFormControl(''),
            instructor_type: new UntypedFormControl('', Validators.required),
            instructor_internal: new UntypedFormControl('', Validators.required),
            instructor_external: new UntypedFormControl('', Validators.required),
            add_image: new UntypedFormControl('', Validators.required),
            add_docfile: new UntypedFormControl(''),
            // price_per_participant: new UntypedFormControl('', Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")),
            'price_per_participant': new UntypedFormControl('', [Validators.pattern("^[0-9]+([,.][0-9]{1,2})?$"), this.currencySymbolValidator()]),
            isTask: new UntypedFormControl('',),
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

    noWhitespace(control: UntypedFormControl) {
        if (control?.value.length != 0) {
            let isWhitespace: boolean =
                (control.value || '').trim().length === 0;
            let isValid: boolean = !isWhitespace;
            return isValid ? null : { whitespace: true };
        } else {
            let isValid: boolean = true;
            return isValid ? null : { whitespace: true };
        }
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
     * @author  MangoIt Solutions
     */
    addAvailableTimes() {
        this.recurrenceDropdownField = false;
        this.courseForm.controls['recurrence'].setValue('');
        this.recurrenceString = ''
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
                    this.courseForm.controls['recurrence'].setValue('');
                    this.courseForm.get('recurrence').clearValidators();
                    this.courseForm.get('recurrence').updateValueAndValidity();
                    this.courseForm.controls['date_repeat'].setValue('');
                    this.courseForm.controls['date_to'].setValue('');
                }
            }
        }
    }

    /**
     * Function to Remove Dates and Times
     * @author  MangoIt Solutions
     */
    removeAvailableTimes(index) {
        this.errorTime = { isError: false, errorMessage: '', index: '' };
        this.courseDate.removeAt(index);
        if (this.courseForm.controls['courseDate'].value.length == 1) {
            this.courseForm.controls["recurrence"].setValue('');
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
            this.courseForm.get('recurrence').setValidators(Validators.required);
            this.courseForm.get('recurrence').updateValueAndValidity();
        }
        this.courseForm.controls["date_repeat"].setValue('');
        this.courseForm.get('date_repeat').clearValidators();
        this.courseForm.get('date_repeat').updateValueAndValidity();
        this.endDateRepeat = false;
    }

    checkOnlyNaturalNumber(event: any) {
        let n = event.target.value;
        var result = n - Math.floor(n) !== 0;
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
                                    this.user_dropdown.push({
                                        id: val.id,
                                        user_email: val.email,
                                        user_name: val.firstname + ' ' + val.lastname,
                                        // user_name: val.firstname + ' ' + val.lastname + ' (' + val.email + ' )',
                                    });
                                }
                            })
                            this.alluserDetails = respData.result.users;
                            this.userDropdownSettings = {
                                singleSelection: false,
                                idField: 'id',
                                textField: 'name',
                                selectAllText: 'Select All',
                                enableCheckAll: true,
                                unSelectAllText: 'UnSelect All',
                                allowSearchFilter: true,
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
                            respData.result.groups.forEach((value, key) =>{
                                this.group_dropdown.push({ 'group_id': value.id, 'name': value.name });
                            })
                        }

                        if (respData && respData?.result?.rooms?.length > 0) {
                            this.romData = respData.result.rooms;
                            Object(respData.result.rooms).forEach((val, key) => {
                                this.roomDropdownList.push({ 'id': val.id, 'name': val.name });
                            });
                            this.roomDropdownSettings = {
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
                            };
                        }
                    }
                }
            );
    }

    /**
     * Function is used to check price
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {boolean} true/false
     */
    checkPrice() {
        if (this.courseForm.value['price_per_participant'] == '') {
            this.checkPric = false;
        } else if (this.courseForm.value['price_per_participant'] <= 0) {
            this.checkPric = true;
        } else {
            this.checkPric = false;
        }
    }

    /**
     * Function is used to check numver
     * @author  MangoIt Solutions(M)
     * @param   {}
     * @return  {boolean} true/false
     */
    checkNumber() {
        if (this.courseForm.value['allowed_persons'] == '') {
            this.checkNum = false;
        } else if (this.courseForm.value['allowed_persons'] <= 0) {
            this.checkNum = true;
        } else {
            this.checkNum = false;
        }
    }

    /**
    * Function is used to set course value in form data and send to back end to store course information in db
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} message
    */
    courseProcess() {
        if (this.recurrenceSelected == 0) {
            let endDate = ((<UntypedFormArray>this.courseForm.get('courseDate')).controls.slice(-1));
            this.courseForm.controls["date_to"].setValue(endDate[0].value.date_from);
            this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
        }
        this.eventSubmitted = true;
        this.endRepeat();
        if ((this.recurrenceSelected == 5)) {
            if (this.finalCustomRecurrence == 'undefined' || this.finalCustomRecurrence == '' || this.finalCustomRecurrence == null) {
                this.customReccDateError = { isError: true, errorMessage: this.language.create_event.select_custom_recc };
            } else {
                this.customReccDateError = { isError: false, errorMessage: this.language.create_event.select_custom_recc };
            }
        }

        if (this.courseForm.valid) {
            if (this.courseForm.controls['task']?.value?.length > 0 && this.task_user_selected?.length > 0) {
                let count = 0;
                this.task_user_selected.forEach((elem: any) => {
                    if (elem.user_id == this.courseForm.controls['task'].value[0].organizer_id) {
                        count++;
                    }
                })
                if (count == 0) {
                    this.task_user_selected.push({
                        'user_id': this.courseForm.controls['task'].value[0].organizer_id,
                        'approved_status': 1
                    })
                }
                let uniqueTaskUsers = this.authService.uniqueData(this.task_user_selected)
                this.courseForm.controls['task'].value[0].taskCollaborators = uniqueTaskUsers
            }
            this.mustMatchs = this.courseForm.value.allowed_persons;
            if (this.selectedRoom != null && this.mustMatchs != null) {
                if ((new Date(this.courseForm.value['date_from']) >= new Date(this.roomsByIdData.active_from.split('T')[0])) &&
                    (new Date(this.courseForm.value['date_to']) <= new Date(this.roomsByIdData.active_to.split('T')[0]))) {
                    this.matchDateError = { isError: false, errorMessage: '' };
                    var roomsData: any[] = [];
                    var course_recuu: any = '';
                    var course_startTime: any
                    var course_endTime: any
                    this.date = new Date(); // Today's date
                    this.todays_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                    this.calendarRooms.forEach((elem: any) => {
                        if (elem.date_start >= this.todays_date) {
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
                        this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData);

                    } else if (this.courseForm.value.courseDate.length > 1) {  /// if the multiple dates
                        this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData);

                    } else {// no recurrence & no multiple dates
                        course_startTime = this.courseForm.value['start_time'];
                        course_endTime = this.courseForm.value['end_time'];
                        this.checkRoomAvailability(course_startTime, course_endTime, this.course_allDates, roomsData);
                    }
                } else {
                    this.notificationService.showError(this.language.courses.not_room, null);
                    this.matchDateError = { isError: true, errorMessage: this.language.courses.not_room };
                }
            }
            if (this.courseForm?.controls['instructor_external']?.value?.length > 0) {
                this.matchInstrctDateError = { isError: false, errorMessage: '' };
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
                        if (elem.date_start >= this.todays_date) {
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

                    } else {
                        course_startTime = this.courseForm.value['start_time'];
                        course_endTime = this.courseForm.value['end_time'];                                           // no recurrence & no multiple dates
                        this.checkInstructorAvailability(course_startTime, course_endTime, this.course_allDates, instructorData);
                    }
                } else {
                    this.notificationService.showError(this.language.courses.not_instruct, null);
                    this.matchInstrctDateError = { isError: true, errorMessage: this.language.courses.not_instruct };
                }

            } else if (this.courseForm?.controls['instructor_internal']?.value?.length > 0) {
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
                    this.courseForm.controls['in_instructorReccurance'].setValue(intr_instructorRecc)
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
                        this.courseForm.controls['in_instructorReccurance'].setValue(intr_instructorRecc);
                    }
                }
            }
        }
        if ((this.courseForm.valid) && (!this.errorTime.isError) && (!this.errorDate.isError) && (!this.errorImage.isError) && (!this.customReccDateError.isError)
            && (!this.matchDateError.isError) && (!this.matchInstrctDateError.isError) && (!this.errorMatch.isError) &&
            (this.courseForm.value['allowed_persons'] != '') && (this.courseForm.value['allowed_persons'] > 0)) {
            this.authService.setLoader(true);
            if (this.roomSelected) {
                this.courseForm.controls['room'].setValue(this.roomSelected);
            } else {
                this.courseForm.controls['room'].setValue(null);
            }
            this.courseForm.controls['visibility'].setValue(this.visibility);
            var uniqueUsers = this.authService.uniqueData(this.userSelected)
            this.courseForm.controls['course_users'].setValue(uniqueUsers);
            var date_from: Date = this.courseForm.controls['date_from'].value;
            var start_time: number = this.courseForm.controls['start_time'].value;
            var end_time: number = this.courseForm.controls['end_time'].value;
            this.courseForm.controls['date_from'].setValue(date_from + ' ' + start_time);
            var date_to: Date = this.courseForm.controls['date_to'].value;
            if (date_to) {
                this.courseForm.controls['date_to'].setValue(date_to + ' ' + end_time);
                this.courseForm.controls["date_repeat"].setValue(date_to + " " + end_time);
            }
            this.courseForm.controls['instructor_type'].setValue(this.instrucType);
            this.courseForm.value['team_id'] = this.teamId;
            this.authService.setLoader(false);
            var formData: FormData = new FormData();
            for (const key in this.courseForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.courseForm.value, key)) {
                    const element = this.courseForm.value[key];
                    if (key == 'add_image') {
                        formData.append('file', element);
                    }
                    if (key == 'add_docfile') {
                        formData.append('file', element);
                    }
                    if (key == 'instructor_internal' && this.instrucType == 1) {
                        var uniqueInternal = this.authService.uniqueData(this.internalInstructor)
                        formData.append('instructor_internal', JSON.stringify(uniqueInternal));
                    }
                    if (key == 'instructor_external' && this.instrucType == 2) {
                        var uniqueExternal = this.authService.uniqueData(this.externalInstructor)
                        formData.append('instructor_external', JSON.stringify(uniqueExternal));
                    }
                    if (key == 'recurrence') {
                        if (element[0] && element[0].item_id == 5) {
                            formData.append('recurrence', this.finalCustomRecurrence);
                        } else {
                            formData.append('recurrence', this.recurrenceString);
                        }
                    }
                    if (key == 'chargeable') {
                        if (element == true) {
                            formData.append('chargeable', this.courseForm.controls['price_per_participant'].value);
                        }
                    }
                    if (key == 'show_guest_list') {
                        if (element == true) {
                            formData.append('show_guest_list', this.courseForm.controls['show_guest_list'].value);
                        } else {
                            this.courseForm.controls['show_guest_list'].setValue(false);
                            formData.append('show_guest_list', this.courseForm.controls['show_guest_list'].value);
                        }
                    }
                    if (key == 'participant' && element[0] != null) {
                        if (element && element.length > 0) {
                            element.forEach( (value, key) => {
                                formData.append('participant[' + key + ']', JSON.stringify(value.id));
                            });
                        }
                    } else if (key == 'course_groups' && element[0] != null) {
                        var groupArray: number[] = [];
                        var grp_id: number;
                        if (element && element.length > 0) {
                            element.forEach( (value, key) => {
                                grp_id = value.group_id;
                                groupArray.push(value.group_id);
                            });
                        }
                        formData.append('group_id', JSON.stringify(grp_id));
                        formData.append('course_groups', JSON.stringify(groupArray));
                    }
                    if (key == 'course_users') {
                        if (this.visibility == 2) {
                            this.userObj.push({ user_id: JSON.parse(localStorage.getItem('user-id')), approved_status: 1, });

                            let uniqueUsers = this.authService.uniqueData(this.userObj)
                            formData.append('course_users', JSON.stringify(uniqueUsers));
                        }
                        if (this.visibility == 1 || this.visibility == 4) {
                            this.userObj.push({ user_id: JSON.parse(localStorage.getItem('user-id')), approved_status: 1 });

                            if (element && element.length > 0) {
                                element.forEach((value, key) => {
                                    if (value != localStorage.getItem('user-id')) {
                                        var status: number = 0;
                                        if (this.internalInstructor) {
                                            this.internalInstructor.forEach((el: any, i: any) => {
                                                if (value == el['user_id']) {
                                                    if (el['user_id'] != localStorage.getItem('user-id')) {
                                                        status = 1;
                                                    }
                                                }
                                            });
                                        }
                                        this.userObj.push({ user_id: value, approved_status: status });
                                    }
                                });
                            }
                            let uniqueUsers = this.authService.uniqueData(this.userObj)
                            formData.append('course_users', JSON.stringify(uniqueUsers));
                        }
                        if (this.visibility == 3 && this.groupUserList != null) {
                            let isAuthor = 0;
                            this.groupUserList.forEach((val: any) => {
                                if (val.user_id == JSON.parse(localStorage.getItem('user-id')) && val.approved_status == 1) {
                                    isAuthor++;
                                }
                            });
                            if (isAuthor < 1) {
                                this.groupUserList.push({ user_id: JSON.parse(localStorage.getItem('user-id')), approved_status: 1 });
                            }
                            this.groupUserList.forEach((value: any) => {
                                if (this.internalInstructor) {
                                    this.internalInstructor.forEach((el: any, i: any) => {
                                        if (value['user_id'] == el['user_id']) {
                                            value.approved_status = 1;
                                        }
                                    });
                                }
                            })
                            let uniqueGroupUsers = this.authService.uniqueData(this.groupUserList);
                            formData.append('course_users', JSON.stringify(uniqueGroupUsers));
                        }
                    }
                    if (key == 'in_instructorReccurance') {
                        formData.append('in_instructorReccurance', JSON.stringify(element));
                    }
                    if (key == 'instructorReccurance') {
                        formData.append('instructorReccurance', JSON.stringify(element));
                    }
                    if (key == 'courseReccurance') {
                        formData.append('courseReccurance', JSON.stringify(element));
                    }
                    if (key == 'courseDate') {
                        formData.append('courseDate', JSON.stringify(element));

                    } else if (key == 'task') {
                        formData.append('task', JSON.stringify(element));
                    } else {
                        if (key != 'add_image' && key != 'add_docfile' && key != 'course_users' && key != 'participant' && key != 'chargeable' && key != 'recurrence' && key != 'customRecurrence' &&
                            key != 'instructor_internal' && key != 'instructor_external' && key != 'course_groups' && key != 'show_guest_list' && (key != 'courseDate') &&
                            key != 'courseReccurance' && key != 'instructorReccurance' && key != 'in_instructorReccurance') {
                            formData.append(key, element);
                        }
                    }
                }
            }

            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'createCourse', formData)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.eventSubmitted = false;
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'], null);
                        setTimeout( ()=> {
                            this.router.navigate(['web/course-detail/' + respData['result']['news']['id']]);
                        }, 2500);
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
                });
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
                    if (element.classNames == 'exInstruct-availability') {
                        elem.start_time = this.commonFunctionService.formatTime(elem.start_time);
                        elem.end_time = this.commonFunctionService.formatTime(elem.end_time);
                        if ((element.date_start == this.datePipe.transform(elem.date_from, 'yyyy-MM-dd')) &&
                            (elem.start_time >= element.start.split('T')[1]) &&
                            (elem.end_time <= element.end.split('T')[1])) {
                            finalInstructorData.push(elem);
                            count++;
                        }
                    }
                })
            })
        } else if (course_allDates) {
            course_dates_length = course_allDates.length;
            course_allDates.forEach((elem: any, index: any) => {
                instructorData.forEach((element: any, idn: any) => {
                    if (element.classNames == 'exInstruct-availability') {
                        course_startTime = this.commonFunctionService.formatTime(course_startTime);
                        course_endTime = this.commonFunctionService.formatTime(course_endTime);
                        if ((element.date_start == this.datePipe.transform(elem, 'yyyy-MM-dd'))
                            && (course_startTime >= element.start.split('T')[1])
                            && (course_endTime <= element.end.split('T')[1])
                        ) {
                            finalInstructorData.push(elem);
                            count++;
                        }
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
    checkRoomAvailability(course_startTime: any, course_endTime: any, course_allDates: any, roomsData: any) {
        var count: number = 0;
        var finalCourseData: any[] = []
        var courseRecu: any[] = [];
        var course_dates_length: any;
        if (this.courseForm?.value?.courseDate.length > 1) {
            course_dates_length = this.courseForm.value.courseDate.length;
            this.courseForm.value.courseDate.forEach((elem: any, index: any) => {
                roomsData.forEach((element: any, idn: any) => {
                    if (element.classNames == 'room-availability') {
                        elem.start_time = this.commonFunctionService.formatTime(elem.start_time);
                        elem.end_time = this.commonFunctionService.formatTime(elem.end_time);
                        if ((element.date_start == this.datePipe.transform(elem.date_from, 'yyyy-MM-dd')) &&
                            (elem.start_time >= element.start.split('T')[1]) &&
                            (elem.end_time <= element.end.split('T')[1])) {
                            finalCourseData.push(elem);
                            count++;
                        }
                    }
                })
            })
        } else if (course_allDates) {
            course_dates_length = course_allDates.length;
            course_allDates.forEach((elem: any, index: any) => {
                roomsData.forEach((element: any, idn: any) => {
                    course_startTime = this.commonFunctionService.formatTime(course_startTime);
                    course_endTime = this.commonFunctionService.formatTime(course_endTime);
                    if (element.classNames == 'room-availability') {
                        if ((element.date_start == this.datePipe.transform(elem, 'yyyy-MM-dd')) &&
                            (course_startTime >= element.start.split('T')[1]) && (course_endTime <= element.end.split('T')[1])) {
                            finalCourseData.push(elem);
                            count++;
                        }
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
                    this.courseForm.controls['courseReccurance'].setValue(courseRecu);
                } else {
                    this.courseForm.controls['courseReccurance'].setValue(this.courseForm.value.courseDate);
                }
            }
        } else {
            this.notificationService.showError(this.language.courses.room_not_avail, null);
            this.matchDateError = { isError: true, errorMessage: this.language.courses.room_not_avail };
        }
    }

    /**
* Function is used to check event
* @author  MangoIt Solutions
*/
    eventCheck(event: Event) {
        if (event.target['checked']) {
            this.eventPriceDisplay = true;
        } else {
            this.eventPriceDisplay = false;
        }
    }

    /**
    * Function is used to get today date
    * @author  MangoIt Solutions
    */
    getToday(): string {
        return new Date().toISOString().split('T')[0];
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
    * Function to compare two time
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    compareTwoTimes(i: any) {
        if ((this.courseForm?.controls?.['courseDate']?.value[i]?.start_time != '') &&
            (this.courseForm?.controls?.['courseDate']?.value[i]?.end_time != '')) {
            if ((this.courseForm.controls['courseDate'].value[i]?.start_time >= this.courseForm.controls['courseDate'].value[i]?.end_time)
            ) {
                this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same, index: i };
            } else {
                this.errorTime = { isError: false, errorMessage: '', index: '' };
            }
        }
    }

    errorDate: { isError: boolean; errorMessage: string } = { isError: false, errorMessage: '' };
    errorTime: { isError: boolean; errorMessage: string; index: '' } = { isError: false, errorMessage: '', index: '' };
    /**
    * Function to compare two date
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    compareTwoDates(i: any) {
        if ((this.courseForm.controls['courseDate'].value[i] && this.courseForm.controls['courseDate'].value[i]?.date_from != '') && (this.courseForm.controls['courseDate'].value[i] && this.courseForm.controls['courseDate'].value[i]?.date_to != '')) {
            if (new Date(this.courseForm.controls['courseDate'].value[i]?.date_to) < new Date(this.courseForm.controls['courseDate'].value[i]?.date_from)) {
                this.errorDate = {
                    isError: true, errorMessage: this.language.error_message.end_date_greater
                };
            } else {
                this.errorDate = { isError: false, errorMessage: '' };
            }
        }
    }

    /**
    * Function to select recurrence
    * @author  MangoIt Solutions
    */
    onRecurrenceSelect(item: { item_id: number; item_text: string }) {
        this.recurrenceSelected = item.item_id;
        var today: number = new Date().getDay();
        if (this.weekDaysArr && this.weekDaysArr.length > 0) {
            this.weekDaysArr.forEach((vals, keys)=> {
                if (vals.item_id == today) {
                    this.todayName = vals.description;
                }
            });
        }
        if (item.item_id == 5) {
            this.isCustom = true;
            setTimeout(() => {
                $('#showPopup').trigger('click');
            }, 300);
        } else {
            this.isCustom = false;
        }
    }

    onRecurrenceDeSelect() { this.recurrenceSelected = null; }


    /**
    * Function is used to submit the data
    * @author  MangoIt Solutions
    */
    dateSubmit() {
        if ((this.courseForm.controls['courseDate'].value[0] && this.courseForm.controls['courseDate'].value[0]?.start_time != '')) {
            if (this.courseForm.controls['courseDate'].value.length == 1) {
                this.recurrenceDropdownField = true;
            }
        } else {
            this.recurrenceDropdownField = false;
        }
    }

    /**
    * Function is used to update the date
    * @author  MangoIt Solutions
    */
    endRepeat() {
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["start_time"].setValue('');
        this.courseForm.controls["date_from"].setValue('');
        this.courseForm.controls["date_from"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
        this.courseForm.controls["start_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
        this.courseForm.controls["end_time"].setValue(this.courseForm.controls['courseDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);
        if (this.courseForm?.controls?.recurrence?.value != '' && this.courseForm?.controls?.recurrence?.value[0]?.item_id != 0) {
            this.endDateRepeat = true;
            this.onRecurrence();
            this.courseForm.get('date_repeat').setValidators(Validators.required);
            this.courseForm.get('date_repeat').updateValueAndValidity();
        } else {
            this.courseForm.controls['date_repeat'].setValue('');
            this.courseForm.get('date_repeat').clearValidators();
            this.courseForm.get('date_repeat').updateValueAndValidity();
            this.endDateRepeat = false;
            this.getCourseAllDates();
        }
    }

    /**
    * Function to create Reccurence
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    onRecurrence() {
        if (this.recurrenceSelected != 5) {
            this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            let monthDates: any = []
            this.recurrenceString = '';
            this.course_allDates = [];
            if (this.courseForm.controls['courseDate'].value) {
                this.courseForm.controls['courseDate'].value.sort().forEach(element => {
                    monthDates.push(new Date(element.date_from).getDate())
                });
            }
            if (this.courseForm.controls.recurrence.value != "" && this.courseForm.controls.recurrence.value != null && this.courseForm.controls.recurrence.value[0] != 0 &&
                this.courseForm.controls.recurrence.value[0] != 5 && this.courseForm.controls.recurrence.value[0] != 1 && this.courseForm.controls.date_repeat.value != '') {
                if (this.courseForm.controls.recurrence.value[0].item_id == 1) {
                    let rule = new RRule({
                        freq: RRule.DAILY,
                        dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    });
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(':', '=');
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else if (this.courseForm.controls.recurrence.value[0].item_id == 2) {
                    let rule = new RRule({
                        freq: RRule.WEEKLY,
                        dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    });
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(':', '=');
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else if (this.courseForm.controls.recurrence.value[0].item_id == 3) {
                    let rule = new RRule({
                        freq: RRule.MONTHLY,
                        dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                        bymonthday: monthDates
                    });
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(':', '=');
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else if (this.courseForm.controls.recurrence.value[0].item_id == 4) {
                    let rule = new RRule({
                        freq: RRule.YEARLY,
                        dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                        until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    });
                    let recc: string = rule.toString();
                    let re: string = recc.slice(0, 25).replace(':', '=');
                    let reccu: string = recc.slice(25);
                    this.recurrenceString = reccu + ';' + re;
                    this.course_allDates = RRule.fromString(this.recurrenceString).all()
                } else {
                    this.recurrenceString = '';
                    this.getCourseAllDates();
                }
            } else {
                this.recurrenceString = '';
                this.getCourseAllDates();
            }
        } else {
            this.setCustomRecurrence();
        }
    }


    /**
    * Function is used to select the Recurrence
    * @author  MangoIt Solutions
    */
    onCustomRecurrenceSelect(item: { item_id: number; item_text: string }[]) {
        this.customRecurrenceTypeSelected = item['item_id'];
        this.naturalNumber = true;
        if (item['item_id'] == 2) {
            this.courseForm.addControl('recc_week', this.formBuilder.control(''));
        } else if (this.courseForm.contains('recc_week')) {
            this.courseForm.removeControl('recc_week');
        }
    }

    /**
    * Function is used to create Custom Reccerence
    * @author  MangoIt Solutions
    */
    setCustomRecurrence() {
        if (this.recurrenceSelected == 5 && this.customRecurrenceTypeSelected) {
            if (this.courseForm.controls["date_to"].value) {
                this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            } else {
                this.courseForm.controls["date_to"].setValue(this.courseForm.controls["date_from"].value);
                this.courseForm.controls["date_repeat"].setValue(this.courseForm.controls["date_to"].value);
            }
            let monthDates: any = []
            this.recurrenceString = '';
            this.course_allDates = [];
            if (this.courseForm.controls['courseDate'].value) {
                this.courseForm.controls['courseDate'].value.sort().forEach(element => {
                    monthDates.push(new Date(element.date_from).getDate())
                });
            }
            let recurrenceData: string = '';
            if (this.customRecurrenceTypeSelected == 1) {
                recurrenceData = '';
                let numberWeek: number = $('.custom_recurrence_daily').val();
                let r_rule = {
                    freq: RRule.DAILY,
                    dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                    until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                };
                if (numberWeek > 0) {
                    r_rule['interval'] = numberWeek;
                }
                let rule = new RRule(r_rule);
                let recc: string = rule.toString();
                let re: string = recc.slice(0, 25).replace(':', '=');
                let reccu: string = recc.slice(25);
                recurrenceData = reccu + ';' + re;
                this.course_allDates = RRule.fromString(recurrenceData).all();
            } else if (this.customRecurrenceTypeSelected == 2) {
                recurrenceData = '';
                let numberWeek: number = $('.custom_recurrence_weekly').val();
                //interval
                let byDay: any[] = [];
                if (this.weekDaysArr && this.weekDaysArr.length > 0) {
                    this.weekDaysArr.forEach( (weekName, weekIndex) => {
                        this.weekDayTypeSelected.forEach( (weekSelected, key) => {
                            if (weekName.item_id == weekSelected) {
                                byDay.push(weekName.description);
                            }
                        });
                    });
                }
                //byWeekDay
                let r_rule = {
                    freq: RRule.WEEKLY,
                    dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                    until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                };
                if (numberWeek > 0) {
                    r_rule['interval'] = numberWeek;
                }
                let rule = new RRule(r_rule);

                var recc: string = rule.toString();
                if (byDay.length > 0) {
                    let recc_str: string;
                    recc_str = rule.toString().concat(';BYDAY=');
                    if (byDay && byDay.length > 0) {
                        byDay.forEach((val, key) => {
                            recc_str = recc_str.concat(val + ',');
                            if (key == byDay.length - 1) {
                                recc_str = recc_str.concat(val);
                            }
                        });
                    }
                    recc = recc_str;
                }
                let re: string = recc.slice(0, 25).replace(':', '=');
                let reccu: string = recc.slice(25);
                recurrenceData = reccu + ';' + re;
                this.course_allDates = RRule.fromString(recurrenceData).all();
            } else if (this.customRecurrenceTypeSelected == 3) {
                recurrenceData = '';
                let numberWeek: number = $('.custom_recurrence_monthly').val();
                let r_rule = {
                    freq: RRule.MONTHLY,
                    dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                    until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                    bymonthday: monthDates
                };
                if (numberWeek > 0) {
                    r_rule['interval'] = numberWeek;
                }
                let rule = new RRule(r_rule);

                let recc: string = rule.toString();
                let re: string = recc.slice(0, 25).replace(':', '=');
                let reccu: string = recc.slice(25);
                recurrenceData = reccu + ';' + re;
                this.course_allDates = RRule.fromString(recurrenceData).all();
            } else if (this.customRecurrenceTypeSelected == 4) {
                recurrenceData = '';
                let numberWeek: number = $('.custom_recurrence_yearly').val();
                let r_rule = {
                    freq: RRule.YEARLY,
                    dtstart: new Date(Date.UTC(new Date(this.courseForm.controls.date_from.value).getFullYear(), new Date(this.courseForm.controls.date_from.value).getMonth(), new Date(this.courseForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
                    until: new Date(Date.UTC(new Date(this.courseForm.controls.date_repeat.value).getFullYear(), new Date(this.courseForm.controls.date_repeat.value).getMonth(), new Date(this.courseForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
                };
                if (numberWeek > 0) {
                    r_rule['interval'] = numberWeek;
                }
                let rule = new RRule(r_rule);

                let recc: string = rule.toString();
                let re: string = recc.slice(0, 25).replace(':', '=');
                let reccu: string = recc.slice(25);
                recurrenceData = reccu + ';' + re;
                this.course_allDates = RRule.fromString(recurrenceData).all();
            }
            this.finalCustomRecurrence = recurrenceData;
        }
    }

    customReccModalClose() {
        $('#showPopup').trigger('click');
        this.closeModal();
    }

    getCourseAllDates() {
        var alldates: any[] = [];
        this.course_allDates = [];
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

    closeModal() { }

    /**
    * Function is used to select the room
    * @author  MangoIt Solutions
    */
    errorMatch: any = { isError: false, errorMessage: '' };
    onRoomSelect(item: { id: number; name: string }) {
        this.matchDateError = { isError: false, errorMessage: '' };
        this.roomsById(item.id);
        this.roomSelected = item.id;
        if (this.romData?.length > 0) {
            this.romData.forEach((element) => {
                if (element.id == item.id) {
                    this.selectedRoom = element;
                }
            });
        }
    }

    /**
    * Function is used to de select the room
    * @author  MangoIt Solutions
    */
    onRoomDeSelect(item: any) {
        this.matchDateError = { isError: false, errorMessage: '' };
        this.calendarRooms = [];
        this.roomSelected = null;
        if (this.romData && this.romData.length > 0) {
            this.romData.forEach((element) => {
                if (element.id == item.id) {
                    this.selectedRoom = null;
                }
            });
        }
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

    /**
  * Function to get the room availability and booked room details
  * @author  MangoIt Solutions(M)
  * @param   {Room data by id}
  * @return  {object array}
  */
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

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        // Handle the date value as needed
    }


    /**
    * Function to redirect the user with date parameter
    * Date: 14 Mar 2023
    * @author  MangoIt Solutions (M)
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


    /**
    * Function to add dynamically validation
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    onInstructorTypeSelect(item: { item_id: number; item_text: string }) {
        this.instrucType = item['item_id'];
        this.selectedInstructorValue = item['item_id'];
        if (this.instrucType == 1) {
            this.courseForm.get('instructor_internal').setValidators(Validators.required);
            this.courseForm.get('instructor_internal').updateValueAndValidity();
            this.courseForm.get('instructor_external').clearValidators();
            this.courseForm.get('instructor_external').updateValueAndValidity();
            this.courseForm.controls['instructor_external'].reset();
            this.courseForm.controls['instructorReccurance'].setValue('');
            this.instructorById = [];
            this.instructorCalendar = [];
            this.externalInstructor = [];
        } else if (this.instrucType == 2) {
            this.courseForm.get('instructor_external').setValidators(Validators.required);
            this.courseForm.get('instructor_external').updateValueAndValidity();
            this.courseForm.get('instructor_internal').clearValidators();
            this.courseForm.get('instructor_internal').updateValueAndValidity();
            this.courseForm.controls['instructor_internal'].reset();
            this.courseForm.controls['in_instructorReccurance'].setValue('');
            this.internalInstructor = [];
        }
    }

    onInstructorTypeDeSelect(item: { item_id: number; item_text: string }) {
        this.instrucType = null;
    }

    /**
    * Function is used to change the Instructor
    * @author  MangoIt Solutions
    */
    changeInstructor() {
        // this.internalInstructor = [];
        // this.instructorById = '';
        // this.instructorCalendar = [];
        // this.externalInstructor = [];
        // if (this.courseForm.controls.instructor_type.status == 'INVALID') {
        //     this.courseForm.controls['instructor_external'].setValue('');
        //     this.courseForm.controls['instructor_internal'].setValue('');
        //     this.instrucType = null;
        // }
    }

    /**
    * Function is used to select the External Instructor
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeSelect(item: { id: number; name: string }) {
        this.externalInstructor = [];
        this.externalInstructor.push({ instructor_id: item.id });

        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getInstructorById/' + item.id, null)
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
    }

    externalInstructorCalendar(instructorById: any) {
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
    * Function is used to de select the External Instructor
    * @author  MangoIt Solutions
    */
    onExternalInstructorTypeDeSelect(item: { id: number; name: string }) {
        if (this.externalInstructor && this.externalInstructor.length > 0) {
            this.externalInstructor.forEach((value, index) => {
                if (value.instructor_id == item.id) {
                    this.externalInstructor.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function is used to select the Internal Instructor
    * @author  MangoIt Solutions
    */
    onInternalInstructorSelect(item: { id: number; name: string }[]) {
        this.internalInstructor = [];
        this.internalInstructor.push({ user_id: item['id'] });
    }

    /**
    * Function is used to de select the Internal Instructor
    * @author  MangoIt Solutions
    */
    onInternalInstructorDeSelect(item: any) {
        this.instructorCalendar = [];
        if (this.internalInstructor && this.internalInstructor.length > 0) {
            this.internalInstructor.forEach((value, index) => {
                if (value.user_id == item.id)
                    this.internalInstructor.splice(index, 1);
            });
        }
    }

    /**
   * Function to get all approved Group Users list
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all  approved Group Users list
   */
    onGroupSelect(item: { group_id: number; name: string }) {
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + item.group_id, null)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                var groupParticipants: any = respData[0].participants;
                var groupUsers: { user_id: string; approved_status: number }[] = [];
                if (groupParticipants && groupParticipants.length > 0) {
                    groupParticipants.forEach( (value, key) => {
                        if (value.approved_status == 1) {
                            var status: number = 0;
                            if (value.user_id == localStorage.getItem('user-id')) {
                                status = 1;
                            }
                            var userGroupObj: { user_id: string; approved_status: number; } = { user_id: value.user_id, approved_status: status };
                            groupUsers.push(userGroupObj);
                        }
                    });
                }
                this.groupUserList = groupUsers;
            });
    }

    /**
    * Function to add dynamically validation
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {}
    */
    onVisibilitySelect(item: { item_id: number; item_text: string }) {
        this.visibility = item.item_id;
        this.userSelected = [];
        if (this.visibility == 3) {
            this.courseForm.get('course_groups').setValidators(Validators.required);
            this.courseForm.get('course_groups').updateValueAndValidity();
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
        } else if (this.visibility == 1) {
            this.courseForm.get('participant').setValidators(Validators.required);
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
        } else if (this.visibility == 2) {
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
        } else if (this.visibility == 4) {
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
            if (this.alluserDetails && this.alluserDetails.length > 0) {
                this.alluserDetails.forEach((element) => {
                    this.userSelected.push(element.id);
                })
            }
        }
    }

    /**
    * Function is used to change the visibility
    * @author  MangoIt Solutions
    */
    changeVisibility() {
        if (this.courseForm.controls.visibility.status == 'INVALID') {
            this.courseForm.controls['course_groups'].setValue('');
            this.courseForm.controls['participant'].setValue('');
            this.courseForm.get('course_groups').clearValidators();
            this.courseForm.get('course_groups').updateValueAndValidity();
            this.courseForm.get('participant').clearValidators();
            this.courseForm.get('participant').updateValueAndValidity();
            this.visibility = null;
        }
    }

    /**
    * Function is used to select the week
    * @author  MangoIt Solutions
    */
    onWeekDaySelect(item: { item_id: number; description: string }[]) {
        this.weekDayTypeSelected.push(item['item_id']);
    }

    /**
    * Function is used to de select the week
    * @author  MangoIt Solutions
    */
    onWeekDayDeSelect(item: { item_id: number; description: string }) {
        this.weekDayTypeSelected.forEach((value, index) => {
            if (value == item.item_id) {
                this.weekDayTypeSelected.splice(index, 1);
            }
        });
    }


    /**
    * Function is used to select user
    * @author  MangoIt Solutions
    */
    onUserSelect(item: { id: number; name: string }) {
        this.userSelected.push(item.id);
    }

    /**
    * Function is used to de select user
    * @author  MangoIt Solutions
    */
    onUserDeSelect(item: { id: number; name: string }) {
        this.userSelected.forEach((value, index) => {
            if (value == item.id) this.userSelected.splice(index, 1);
        });
    }

    /**
    * Function is used to select all user
    * @author  MangoIt Solutions
    */
    onUserSelectAll(item: { id: number; name: string }[]) {
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

    onCancel() {
        window.history.back();
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
                this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid, };
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                this.croppedImage = '';
                this.imageChangedEvent = null;
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 5000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event);
            }
        }
    }

    fileChangeEvent(event: Event) {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        this.imageChangedEvent = event;
        this.file = (event.target as HTMLInputElement).files[0];
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
        this.errorImage = { isError: false, errorMessage: '' };
        let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage, -1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.courseForm.patchValue({ add_image: this.fileToReturn });
                    this.courseForm.get('add_image').updateValueAndValidity();
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

    // errorFile: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorFile: any = { isError: false, errorMessage: '' };
    uploadFile1(event: Event) {
        $('.preview_txt1').hide();
        $('.preview_txt1').text('');
        this.errorFile = { isError: false, errorMessage: '' };
        const file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        const mimeType1: number = file.size;

        if (mimeType1 <= 20000000) {
            if (
                mimeType.match(/application\/*/) == null &&
                mimeType.match(/text\/*/) == null
            ) {
                this.errorFile = {
                    Error: true,
                    errorMessage: this.language.error_message.common_valid,
                };
                setTimeout(() => {
                    this.errorFile = { Error: false, errorMessage: '' };
                }, 3000);
                $('.preview_txt1').hide();
                $('.preview_txt1').text('');
            } else {
                this.errorFile = { Error: false, errorMessage: '' };
                this.courseForm.patchValue({
                    add_docfile: file,
                });
                this.courseForm.get('add_docfile').updateValueAndValidity();

                const reader: FileReader = new FileReader();
                reader.readAsDataURL(file);
                var urll: any;
                reader.onload = (_event) => {
                    urll = reader.result;
                };
                $('.message-upload-list').show();
            }
            $('.preview_txt1').show();
            $('.preview_txt1').text(file.name);
        } else {
            this.errorFile = {
                isError: true,
                errorMessage: this.language.create_message.file_size,
            };
            setTimeout(() => {
                this.errorFile = { isError: false, errorMessage: '' };
            }, 3000);
        }
    }

    /**
    * Function is used to select task
    * @author  MangoIt Solutions
    */
    onTaskSelect() {
        this.isTaskField = !this.isTaskField
        // let control = this.courseForm.controls.task['controls'][0] as UntypedFormGroup;
        if (this.isTaskField && (this.task && this.task.length < 1)) {
            const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                title: ['', Validators.required],
                description: ['', Validators.required],
                organizer_id: [localStorage.getItem('user-id')],
                status: ['1'],
                group_id: [''],
                groups: [''],
                user_select: [''],
                date: ['', Validators.required],
                type_dropdown: ['', Validators.required],
                taskCollaborators: [''],
            });
            this.task.push(newAvailableTimes);
        } else {
            this.task_user_selected = [];
            this.task.removeAt(0);
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
        })
    }

    /**
    * Function is used to de select task user
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
        this.task_user_selected = [];
        let control = this.courseForm.controls.task['controls'][0] as UntypedFormGroup;
        control.controls['group_id'].setValue('');
        control.controls['group_id'].setValue(item.group_id);
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + item.group_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData[0]?.participants) {
                        var groupParticipants = respData[0]?.participants;
                        if (groupParticipants?.length > 0) {
                            groupParticipants.forEach( (value, key) => {
                                this.task_user_selected.push({ 'user_id': value.user_id, 'approved_status': 1 })
                            });
                        }
                    }
                }
            );
    }

    /**
    * Function is used to de select task group
    * @author  MangoIt Solutions
    */
    onTaskGroupDeSelect() {
        this.task_user_selected = [];
    }

    /**
    * Function is used to add task date validation
    * @author  MangoIt Solutions
    */
    taskDateValidate(date: any) {
        var date_from: any;
        var date_to: any;
        if (this.courseForm?.value?.courseDate?.length == 1) {
            if (this.courseForm.controls?.date_to?.value != "") {
                if (this.courseForm.controls.date_from.value <= date.target.value && this.courseForm.controls.date_to.value >= date.target.value) {
                    this.errorDateTask = { isError: false, errorMessage: '' };
                } else {
                    this.errorDateTask = { isError: true, errorMessage: this.language.error_message.courseTaskDate };
                }
            } else {
                if (this.courseForm.controls.date_from.value >= date.target.value) {
                    this.errorDateTask = { isError: false, errorMessage: '' };
                } else {
                    this.errorDateTask = { isError: true, errorMessage: this.language.error_message.courseTaskDate };
                }
            }
            // if (this.courseForm.controls.date_from.value <= date.target.value && this.courseForm.controls.date_to.value >= date.target.value) {
            //         this.errorDateTask = { isError: false, errorMessage: '' };
            // } else {
            //         this.errorDateTask = { isError: true, errorMessage: this.language.error_message.courseTaskDate };
            // }
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

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
