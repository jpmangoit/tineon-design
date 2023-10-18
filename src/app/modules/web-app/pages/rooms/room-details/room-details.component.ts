import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {ClubDetail, LoginDetails, ProfileDetails, ThemeType} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService, DenyReasonConfirmDialogService, UpdateConfirmDialogService} from '@shared/components';


declare var $: any;

@Component({
    selector: 'app-room-details',
    templateUrl: './room-details.component.html',
    styleUrls: ['./room-details.component.css'],
    providers: [DatePipe],
})

export class RoomDetailsComponent implements OnInit {
    updateRoomData: any
    roomDetails: any;
    responseMessage: any;
    imageShow: string;
    userDetails: LoginDetails;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    language: any;
    thumbnail: string;
    memberid: number;
    displayError: boolean = false
    getclubInfo: ClubDetail;
    profile_data: ProfileDetails;
    birthdateStatus: boolean;
    memberStartDateStatus: Date;
    private refreshPage: Subscription
    private denyRefreshPage: Subscription
    private removeUpdate: Subscription
    calendarRooms: any;
    calendarOptions: CalendarOptions;
    selectLanguage: string;
    allRoomCalndr: any[];
    allWeekDayArray: any[];

    constructor(private authService: AuthServiceService, private commonFunctionService: CommonFunctionService,
        private notificationService: NotificationService, private lang: LanguageService, private confirmDialogService: ConfirmDialogService,
        private themes: ThemeService, private denyReasonService: DenyReasonConfirmDialogService, private router: Router,
        private datePipe: DatePipe,
        private updateConfirmDialogService: UpdateConfirmDialogService, private route: ActivatedRoute,
        private sanitizer: DomSanitizer) {
        this.refreshPage = this.confirmDialogService.dialogResponse.subscribe(message => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });
        this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000);
        });

        this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp => {
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        })
    }

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

        this.route.params.subscribe(params => {
            const room_id: number = params['roomId'];
            this.getRoomDetail(room_id);
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
    }

    /**
    * Function is used to get room by Id
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {object array}
    */
    getRoomDetail(id: number) {
        this.commonFunctionService.roomsById(id)
            .then((resp: any) => {
                this.roomDetails = [];
                this.updateRoomData = null;
                this.roomDetails = resp;

                if (this.roomDetails?.room_image[0]?.room_image) {
                    this.roomDetails.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomDetails?.room_image[0]?.room_image.substring(20)));
                }
                this.memberid = this.roomDetails.user.member_id;
                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                    .subscribe((respData: any) => {
                        this.thumbnail = respData;
                    },
                        (error: any) => {
                            this.thumbnail = null;
                        });
                if (this.roomDetails['author'] == JSON.parse(this.userDetails.userId) || this.userDetails.roles[0] == 'admin') {
                    if (this.roomDetails.updated_record != null) {

                        this.updateRoomData = JSON.parse(this.roomDetails.updated_record);
                        if (this.updateRoomData?.newImage) {
                            this.updateRoomData.newImage = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updateRoomData?.newImage.substring(20)));
                        }
                        this.updateRoomData.weekdays = JSON.parse(this.updateRoomData['weekdays']);
                        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
                            .subscribe(
                                (respData: any) => {
                                    if (respData && respData.length > 0) {
                                        respData.forEach(el => {
                                            if (el.id == this.updateRoomData.author) {
                                                this.updateRoomData.user = el;
                                                if (this.updateRoomData.user.member_id != null) {
                                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.updateRoomData.user.member_id, null)
                                                        .subscribe(
                                                            (resppData: any) => {
                                                                this.updateRoomData.user.imagePro = resppData
                                                            },
                                                            (error: any) => {
                                                                this.updateRoomData.user.imagePro = null;
                                                            });
                                                } else {
                                                    this.updateRoomData.user.imagePro = null;
                                                }
                                            }
                                        });
                                    }
                                });
                    }
                }
                setTimeout(() => {
                    this.getRoomCalendar(this.roomDetails);
                }, 500);
            })
            .catch((erro: any) => {
                this.notificationService.showError(erro, null);
            });
    }
    getRoomCalendar(roomsByIdData: any) {
        // this.calendarRooms = this.commonFunctionService.getRoomCalendar(roomsByIdData);
        this.allRoomCalndr = this.commonFunctionService.getRoomCalendar(roomsByIdData);
        this.calendarRooms = this.allRoomCalndr[0].cal
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


    updateRoom(room_id: number) {
        this.router.navigate(['/web/update-room/' + room_id])
    }

    approveRoom(roomId: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'set-approve-room-status/' + roomId + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    approvedUpdateRoom(room_id: number) {
        let self = this;
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_room, function () {
            self.authService.memberSendRequest('get', 'approve-updatedrooms/' + room_id + '/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.getRoomDetail(room_id)
                    }
                )
        }, function () {
        })
    }

    unapprovedRoom(roomId: number) {
        let self = this;
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.unapproved_room, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-rooms/room_id/' + roomId, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }


    deleteRoom(room_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_Room, function () {
            self.authService.memberSendRequest('delete', 'deleteRooms/' + room_id, null)
                .subscribe(
                    (respData: any) => {
                        self.responseMessage = respData.result.message;
                        self.notificationService.showSuccess(self.responseMessage, null);
                        self.router.navigate(['/web/room'])
                    }
                )
        }, function () {
        })
    }

    deleteUpdateRoom(room_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_Room, function () {
            self.authService.memberSendRequest('get', 'get-reset-updatedroom/' + room_id, null)
                .subscribe(
                    (respData: any) => {
                        self.router.navigate(['web/room-detail/' + room_id]);
                        setTimeout(() => {
                            self.ngOnInit();
                            self.getRoomDetail(room_id)
                        }, 1000);
                    }
                )
        }, function () {
        }, 'deleteUpdate')
    }


    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemId(id: number) {
        $("#profileSpinner").show();
        this.thumbnail = '';
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data;
                this.memberStartDateStatus = resp.memberStartDateStatus;
                this.thumbnail = resp.thumbnail;
                this.displayError = resp.displayError;
            })
            .catch((err: any) => {
                console.log(err);
            })
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
        this.router.navigate(['/web/room']);
    }

    getDayName(id: any) {
        return this.allWeekDayArray[id];
    }

    ngOnDestroy(): void {
        this.refreshPage.unsubscribe();
        this.activatedSub.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
    }

}
