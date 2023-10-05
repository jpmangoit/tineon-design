import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Instructors } from 'src/app/models/instructors.model';
import { ClubDetail, LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LanguageService } from 'src/app/service/language.service';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogService } from '../../../../shared/update-confirm-dialog/update-confirm-dialog.service';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { DenyReasonConfirmDialogService } from '../../../../shared/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-instructor-details',
    templateUrl: './instructor-details.component.html',
    styleUrls: ['./instructor-details.component.css']
})
export class InstructorDetailsComponent implements OnInit {

    updateInstructorData: any
    instructorDetails: Instructors;
    responseMessage: any;
    imageShow: string;
    userDetails: LoginDetails;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    language: any;
    displayError: boolean = false
    getclubInfo: ClubDetail;
    profile_data: ProfileDetails;
    thumbnail: string;
    memberid: number;
    birthdateStatus: boolean;
    memberStartDateStatus: Date;
    private refreshPage:Subscription
    private denyRefreshPage:Subscription
    private removeUpdate:Subscription
    instructorCalendar:any;
    calendarOptions: CalendarOptions;
    selectLanguage: string;
    allExternlCalndr: any[];
    allUser: any[]=[];
    alluserInformation:{member_id: number}[] = [];
    allWeekDayArray: any[];
    allWeekDayArrayName: { id: number; name: string[]; }[];

    constructor(private authService: AuthServiceService,private commonFunctionService: CommonFunctionService,
        private notificationService: NotificationService,private notifi:NotificationsService,
        private sanitizer: DomSanitizer,
        private denyReasonService: DenyReasonConfirmDialogService,private lang: LanguageService, private confirmDialogService: ConfirmDialogService,
        private themes: ThemeService, private router: Router, private updateConfirmDialogService: UpdateConfirmDialogService, private route: ActivatedRoute) {
            this.refreshPage =  this.confirmDialogService.dialogResponse.subscribe(message => {
                setTimeout(() => {
                    this.ngOnInit();
                }, 2000);
            });
            this.denyRefreshPage = this.updateConfirmDialogService.denyDialogResponse.subscribe(resp =>{
                setTimeout(() => {
                    this.ngOnInit();
                }, 2000);
            });
            this.removeUpdate = this.denyReasonService.remove_deny_update.subscribe(resp =>{
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
        if(this.selectLanguage  == 'sp'){
            this.selectLanguage = 'es'
        }
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.getAllUserInfo();
        setTimeout(() => {
            this.route.params.subscribe(params => {
                const instructor_id: number = params['instructorId'];
                this.getInstructorDetail(instructor_id);
            });
        }, 1000);

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
            { id: 0, name: ["Sonntag","Sunday","dimanche","domenica","Воскресенье","domingo","Pazar"]},
            { id: 1, name: ["Montag","Monday","lundi","lunedì","понедельник","lunes","Pazartesi"]},
            { id: 2, name: ["Dienstag","Tuesday","mardi","martedì","вторник", "martes","Salı"]},
            { id: 3, name: ["Mittwoch","Wednesday","mercredi","mercoledì","среда","miércoles","Çarşamba"]},
            { id: 4, name: ["Donnerstag","Thursday","jeudi","giovedì","четверг","jueves","Perşembe"]},
            { id: 5, name: ["Freitag","Friday","vendredi","venerdì","Пятница","viernes","Cuma"]},
            { id: 6, name: ["Samstag", "Saturday","samedi","sabato","Суббота","sábado","Cumartesi"]}
        ]
    }

        /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
	getAllUserInfo() {
		this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
		.subscribe(
			(respData: any) => {
                if(respData?.length > 0){
                    this.allUser = respData;
                    Object(respData).forEach((val, key) => {
                        this.alluserInformation[val.id] = { member_id: val.member_id };
                    })
                }
			}
		);
	}

    /**
    * Function is used to get Instructor Detail by id
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} Details of the Instructor
    */
    getInstructorDetail(id: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getInstructorById/' + id, null).subscribe((respData: any) => {
            this.authService.setLoader(false);
            if (respData['isError'] == false) {
                this.instructorDetails = null;
                this.updateInstructorData = null;
                this.instructorDetails = respData['result'];
                if (this.instructorDetails?.instructor_image[0]?.['instructor_image']){
                    this.instructorDetails.instructor_image[0]['instructor_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.instructorDetails.instructor_image[0]['instructor_image'].substring(20)));
                }
                if(this.instructorDetails?.user?.member_id){
                    this.memberid = this.instructorDetails?.user?.member_id;
                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.memberid, null)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.instructorDetails.user.thumbnail = respData;
                        },
                        (error:any) => {
                            this.instructorDetails.user.thumbnail = null;
                        });
                }else{
                    this.instructorDetails['user']['thumbnail'] = null;
                }
                if (this.instructorDetails['author'] == JSON.parse(this.userDetails.userId) || this.userDetails.roles[0] == 'admin') {
                    if (this.instructorDetails.updated_record && this.instructorDetails.updated_record != null) {
                        this.updateInstructorData = JSON.parse(this.instructorDetails.updated_record);
                        this.updateInstructorData.qualifications = this.updateInstructorData['qualifications'];
                        this.updateInstructorData.weekdays = JSON.parse(this.updateInstructorData['weekdays']);
                        if (this.updateInstructorData?.newImage){
                            this.updateInstructorData.newImage = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.updateInstructorData.newImage.substring(20)));
                        }
                        if ( this.allUser?.length > 0) {
                                this.allUser.forEach(el => {
                                if (el.id == this.updateInstructorData.author) {
                                    this.updateInstructorData.user = el;
                                    if (this.updateInstructorData.user.member_id != null) {
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.updateInstructorData.user.member_id, null)
                                            .subscribe(
                                                (resppData: any) => {
                                                    this.updateInstructorData.user.imagePro = resppData;
                                                },
                                                (error:any) => {
                                                    this.updateInstructorData.user.imagePro = null;
                                                });
                                    } else {
                                        this.updateInstructorData.user.imagePro = null;
                                    }
                                }
                            });
                        }
                    }
                }
                setTimeout(() => {
                    this.externalInstructorCalendar(this.instructorDetails);
                }, 500);
            } else if (respData['code'] == 400) {
                this.notificationService.showError(respData['message'], null);
            }
        });
    }



    externalInstructorCalendar(instructorById:any){
        // this.instructorCalendar =  this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.allExternlCalndr = this.commonFunctionService.externalInstructorCalendar(instructorById);
        this.instructorCalendar = this.allExternlCalndr[0].cal;
        this.calendarOptions = {
         plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
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
         firstDay:1,
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
         if(arg.event['_def'].publicId && arg.event['_def']['extendedProps']['date_start'] && arg.event['_def']['extendedProps']['type']){
             this.viewDetails(arg.event['_def'].publicId,arg.event['_def']['extendedProps']['date_start'] ,arg.event['_def']['extendedProps']['type'])
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
     viewDetails(id: any, date: any ,type:any) {
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
    * Function is used to delete Instructor by id
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
    deleteInstructor(instructor_id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_instructor, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteInstructor/' + instructor_id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.responseMessage = respData['result']['message'];
                            self.notificationService.showSuccess(self.responseMessage,null);
                            setTimeout(function () {
                                self.router.navigate(["/instructor"]);
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            self.responseMessage = respData['message'];
                            self.notificationService.showError(self.responseMessage,null);
                        }
                    }
                )
        }, function () { }
        )
    }

    /**
    * Function is used to delete update Instructor by id
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
    deleteUpdateInstructor(instructor_id: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_instructor, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('get', 'get-reset-updatedinstructor/' + instructor_id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.router.navigate(['web/instructor-detail/' + instructor_id]);
                    }
                )
        }, function () {
        }, 'deleteUpdate')
    }

    /**
    * Function is used to approve created Instructor
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
    approveInstructor(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'set-approve-instructor-status/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to approve updated Instructor
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
    approvedUpdateInstructors(instructor_id: number) {
        let self = this;
        self.ngOnInit();
        let userId: string = localStorage.getItem('user-id');
        self.confirmDialogService.confirmThis(self.language.confirmation_message.approved_instructor, function () {
            self.authService.memberSendRequest('get', 'approve-updatedinstructor/' + instructor_id + '/approvedby/' + userId, null)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.getInstructorDetail(instructor_id)
                    }
                )
        }, function () {
        })
    }

    /**
    * Function is used to un approve Instructor
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
    unapprovedInstuctors(instructor_id: number) {
        let self = this;
        this.updateConfirmDialogService.confirmThis(this.language.confirmation_message.deny_group, function () {
            let reason = $("#message-text").val();
            let postData = {
                "deny_reason": reason,
                "deny_by_id": self.userDetails.userId
            };
            self.authService.memberSendRequest('put', 'deny-instructor/instructor_id/' + instructor_id, postData)
                .subscribe(
                    (respData: any) => {
                        self.ngOnInit();
                        self.getInstructorDetail(instructor_id)
                    }
                )
        }, function () {

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
        this.router.navigate(['/web/instructor']);
    }

    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemId(id: number) {
        this.thumbnail = '';
        this.commonFunctionService.getMemberId(id)
            .then((resp: any) => {
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumbnail = resp.thumbnail
                this.displayError = resp.displayError
            })
            .catch((err: any) => {
                console.log(err);
            })
    }

     getDayName(id:any){
        if (!isNaN(id)) {
            return this.allWeekDayArray[id];
        }else{
            let obj = this.allWeekDayArrayName.find(o => o.name.includes(id));
            if (obj?.name) {
                return this.allWeekDayArray[obj.id];
            }else{
                return id;
            }
        }
    }

    ngOnDestroy(): void {
        this.refreshPage.unsubscribe();
        this.activatedSub.unsubscribe();
        this.denyRefreshPage.unsubscribe();
        this.removeUpdate.unsubscribe();
    }

}
