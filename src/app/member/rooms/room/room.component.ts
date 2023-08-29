import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Room } from 'src/app/models/room.model';
import { CreateAccess, UserAccess } from 'src/app/models/user-access.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { appSetting } from 'src/app/app-settings';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { formatDate } from '@fullcalendar/core';
import { Dayjs } from 'dayjs';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css'],
    providers: [DatePipe],
})

export class RoomComponent implements OnInit, OnDestroy {
    language: any;
    userData: LoginDetails;
    responseMessage: string;
    searchSubmit: boolean = false;
    searchForm: UntypedFormGroup;
    displayCourse: boolean;
    displayInstructor: boolean;
    displayRoom: boolean = true;
    setTheme: ThemeType;
    roomImg: string;
    roomsByIdData: Room;
    allRooms: Room[] = [];
    searchData: Room[] = [];
    private activatedSub: Subscription;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    userRole: string;
    thumbnail: any;
    memberid: any;
    currentPageNmuber: number = 1;
    // itemPerPage: number = 8;
    itemPerPage: number = 4;
    totalRoomData: number = 0;
    totalPages: any
    limitPerPage: { value: string }[] = [
        { value: '8' },
        { value: '16' },
        { value: '24' },
        { value: '32' },
        { value: '40' }
    ];
    calendarRooms: any;
    calendarOptions: CalendarOptions;
    selectLanguage: string;
    allRoomCalndr: any[];
    allWeekDayArray: any[];
    allWeekDayArrayName: any[];

    constructor(
        private authService: AuthServiceService,
        private themes: ThemeService,
        private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService,
        private router: Router,
        private notificationService: NotificationService,
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

        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userData.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[this.userRole].create;
        this.getAllRooms(1);
        this.searchForm = new UntypedFormGroup({
            name: new UntypedFormControl(''),
            persons: new UntypedFormControl('', Validators.pattern('^[0-9]*$')),
        });

        //this code for the set angular calendar initial weekly beacuse bydefault the calendar visible on monthly
        this.calendarOptions = {
            initialView: 'timeGridWeek',
        };

        this.allWeekDayArray = [
            this.language.new_create_event.sunday,
            this.language.new_create_event.monday,
            this.language.new_create_event.tuesday,
            this.language.new_create_event.wednesday,
            this.language.new_create_event.thrusday,
            this.language.new_create_event.friday,
            this.language.new_create_event.saturday
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
    }

    /**
    * Function is used to get all rooms
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {object array}
    */
    getAllRooms(item:any) {
        if (sessionStorage.getItem('token')) {
        this.currentPageNmuber = item;
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'getAllRooms/' + this.currentPageNmuber + '/' + this.itemPerPage, null)
                .subscribe((respData: Room) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.allRooms = respData['result']['room'];
                        this.allRooms.forEach((element: any) => {
                            if (element?.room_image[0]?.room_image) {
                                element.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.room_image?.[0].room_image.substring(20))) as string;
                            }
                        })
                        this.totalRoomData = respData['result'].pagination.rowCount;
                        this.totalPages = Math.ceil(this.totalRoomData / this.itemPerPage);

                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }
    }

    onSearch(item: any) {
        if (
            (this.searchForm.value.name == '' && this.searchForm.value.persons == '') ||
            (this.searchForm.value.name == '' && this.searchForm.value.persons == null) ||
            (this.searchForm.value.name == null && this.searchForm.value.persons == null)
        ) {
            this.notificationService.showError(this.language.instructor.text_for_search, null);
            //this.searchSubmit = true;
        } else {
            this.searchSubmit = false;
            if (this.searchForm.valid) {
                this.currentPageNmuber = item;
                this.authService.setLoader(true);
                this.authService.memberSendRequest('post', 'getAllRooms/' + this.currentPageNmuber + '/' + this.itemPerPage, this.searchForm.value)
                    .subscribe((respData: Room) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.searchData = null;
                            this.allRooms = null;
                            this.totalRoomData = 0;
                            this.searchData = respData['result']['room'];
                            this.allRooms = respData['result']['room'];
                            this.allRooms.forEach((element: any) => {
                                if (element?.room_image[0]?.room_image) {
                                    element.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.room_image?.[0].room_image.substring(20))) as string;
                                }
                            })
                            this.totalRoomData = respData['result'].pagination.rowCount;
                            this.totalPages = Math.ceil(this.totalRoomData / this.itemPerPage);


                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    });
            }
        }
    }

    /**
    * Function is used to reset form
    * @author  MangoIt Solutions
    * @param {}
    * @return {}
    */
    reSet() {
        this.searchSubmit = false;
        this.searchForm.controls['name'].setValue('');
        this.searchForm.controls['persons'].setValue('');
        this.searchData = [];
        this.getAllRooms(1);
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
    //         this.getAllRooms();
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
            this.getAllRooms(this.currentPageNmuber);
        }
    }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    // goToPg(eve: number) {
    //     if (isNaN(eve)) {
    //         eve = this.currentPageNmuber;
    //     } else {
    //         if (eve > Math.round(this.totalRoomData / this.itemPerPage)) {
    //             this.notificationService.showError(this.language.error_message.invalid_pagenumber, null);
    //         } else {
    //             this.currentPageNmuber = eve;
    //             if (this.searchData?.length > 0) {
    //                 this.onSearch(this.currentPageNmuber);
    //             } else {
    //                 this.getAllRooms('');
    //             }
    //         }
    //     }
    // }

    /**
 * Function is used for pagination
 * @author  MangoIt Solutions
 */
    // setItemPerPage(limit: number) {
    //     if (isNaN(limit)) {
    //         limit = this.itemPerPage;
    //     }
    //     this.itemPerPage = limit;
    //     if (this.searchData?.length > 0) {
    //         this.onSearch('');
    //     } else {
    //         this.getAllRooms('');
    //     }
    // }

    /**
    * Function is used to get room by Id
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {object array}
    */
    roomsById(id: number) {
        this.roomImg = '';
        this.commonFunctionService.roomsById(id)
            .then((resp: any) => {
                this.roomsByIdData = resp;
                this.memberid = this.roomsByIdData.user.member_id;
                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.memberid, null)
                    .subscribe((respData: any) => {
                        this.thumbnail = respData;
                    },
                        (error: any) => {
                            this.thumbnail = null;
                        });

                if (this.roomsByIdData?.room_image[0]?.room_image == undefined || this.roomsByIdData?.room_image[0]?.room_image == '' || this.roomsByIdData?.room_image[0]?.room_image == null || !this.roomsByIdData?.room_image[0]?.room_image) {
                    this.roomImg = '../../assets/img/no_image.png';
                } else {
                    // this.roomsByIdData.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomsByIdData?.room_image[0]?.room_image.substring(20)));
                    // this.roomImg = this.roomsByIdData?.room_image[0]?.room_image;
                    if (this.roomsByIdData?.room_image[0]?.room_image) {
                        this.roomsByIdData.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomsByIdData?.room_image[0]?.room_image.substring(20)));
                        this.roomImg = this.roomsByIdData?.room_image[0]?.room_image;
                    }
                }
                // if (this.roomsByIdData['room_image']?.[0]['room_image'] == '' || this.roomsByIdData['room_image']?.[0]['room_image'] == null) {
                //     this.roomImg = '../../assets/img/no_image.png';
                // } else {
                //     this.roomsByIdData['room_image'][0]['room_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomsByIdData['room_image']?.[0]['room_image'].substring(20)));
                //     this.roomImg = this.roomsByIdData['room_image']?.[0]['room_image'];
                // }

                setTimeout(() => {
                    this.getRoomCalendar(this.roomsByIdData);
                }, 500);
            })
            .catch((erro: any) => {
                $('#view-rooms').modal('hide');
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

    onCourse() {
        this.displayCourse = true;
        this.displayInstructor = false;
        this.displayRoom = false;
    }

    onInstructor() {
        this.displayCourse = false;
        this.displayInstructor = true;
        this.displayRoom = false;
    }

    onRoom() {
        this.displayCourse = false;
        this.displayInstructor = false;
        this.displayRoom = true;
    }

    showToggle: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName('bunch_drop');
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = 'bunch_drop show';
        } else {
            this.showToggle = false;
            el[0].className = 'bunch_drop';
        }
    }

    updateRooms(id: number) {
        $('#view-rooms').modal('hide');
        var redirectUrl: string = 'update-room/' + id;
        this.router.navigate([redirectUrl]);
    }

    /**
    * Function is used delete Room by Id
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {string} success message
    */
    deleteRoom(id: number) {
        $('#view-rooms').modal('hide');
        let self = this;
        let roomid: number = id;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_Room,
            function () {
                self.authService.setLoader(true);
                self.authService.memberSendRequest('delete', 'deleteRooms/' + roomid, null)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.notificationService.showSuccess(respData['result']['message'], null);
                            setTimeout(function () {
                                self.ngOnInit();
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            self.notificationService.showError(respData['message'], null);
                        }
                    });
            },
            function () { }
        );
    }

    ngOnDestroy() {
        this.activatedSub.unsubscribe();
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
}
