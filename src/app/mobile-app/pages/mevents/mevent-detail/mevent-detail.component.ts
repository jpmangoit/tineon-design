import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { SafeUrl } from '@angular/platform-browser';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { EventsType } from 'src/app/models/events-type.model';
import { LanguageService } from 'src/app/service/language.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
  selector: 'app-mevent-detail',
  templateUrl: './mevent-detail.component.html',
  styleUrls: ['./mevent-detail.component.css']
})
export class MeventDetailComponent implements OnInit {
    language :any;
	eventDetails: EventsType = null;
	showImage:boolean = false;
	displayError:boolean = false;
    setTheme:ThemeType;
	organizerDetails:{ email: string, firstname: string, id:number, image: SafeUrl, lastname: string,username: string}[] = [];
	unapprovedParticipants: { email: string, firstname: string, id:number, image: SafeUrl, lastname: string,username: string}[] = [];
	approvedParticipants: { email: string, firstname: string, id:number, image: SafeUrl, lastname: string,username: string}[] = [];
	memImg: { email: string, firstname: string, id:number, image: SafeUrl, lastname: string,username: string}[] = [];
	member_id:number;
	un_id:number;
	profile_data:ProfileDetails;
    memberStartDateStatus:Date;
	birthdateStatus:boolean;
	getclubInfo:ProfileDetails;
	thumbnail: string;
	alluserInformation:{member_id: number}[] = [];
    thumb: SafeUrl;
	docFile: string;
	fileArray:string[] = [];
	imageurl:string
	userDetails:LoginDetails;
    role:any;
    userId:any;
    private activatedSub: Subscription;

	constructor(
		private authService: AuthServiceService,
		private router: Router,
		private route: ActivatedRoute, private themes: ThemeService,
		private _location: Location,
		private confirmDialogService: ConfirmDialogService,
		private lang: LanguageService,
        private commonFunctionService: CommonFunctionService
	) { }

	ngOnInit(): void {
        if(localStorage.getItem('club_theme') != null){
        let theme:ThemeType =  JSON.parse(localStorage.getItem('club_theme'));
        this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
        this.setTheme = resp;
        });
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.role = this.userDetails.roles[0];
        this.userId = this.userDetails.userId;
        this.language = this.lang.getLanguaageFile();
        this.route.params.subscribe(params => {
            const eventid:number = params['eventid'];
            this.getEventDetails(eventid);
        });
        this.getAllUserInfo();
	}


    /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
	getAllUserInfo() {
		let self = this;
		this.authService.memberSendRequest('get', 'teamUsers/team/'+ this.userDetails.team_id, null)
		.subscribe(
			(respData: any) => {
                if(respData && respData.length > 0){
                    Object(respData).forEach((val, key) => {
                        this.alluserInformation[val.id] = { member_id: val.member_id };
                    })
                }
			}
		);
	}

	getEventDetails(eventid:number) {
		if (sessionStorage.getItem('token')) {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('get', 'get-event-by-id/' + eventid, null)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					this.eventDetails = respData['result'][0];
					if (this.eventDetails) {
						if(this.eventDetails.picture_video != null){
							var url:string[] = this.eventDetails.picture_video.split('\"');
							let self = this;
                            if(url && url.length > 0){
                                url.forEach(element => {
                                    self.showImage = true;
                                    if (['.jpg','.jpeg','.png','.gif','.svg','.webp','.avif','.apng','.jfif','.pjpeg', '.pjp'].some(char => element.endsWith(char))) {
                                        self.showImage = true;
                                        self.fileArray.push(element);
                                        self.imageurl = self.fileArray[0];
                                    } else if (['.pdf','.doc','.zip','.docx','.docm','.dot','.odt','.txt','.xml','.wps', '.xps', '.html','.htm','.rtf'].some(char => element.endsWith(char))) {
                                        self.docFile = element;
                                    }
                                });
                            }
						}
						this.getOrganizerDetails(eventid);
						this.getParticipantDetails(eventid);
					}
				}
			);
		}
	}

	getOrganizerDetails(eventid:number) {
		if (sessionStorage.getItem('token')) {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('get', 'approvedParticipants/event/' + eventid, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						for (const key in respData) {
							if (Object.prototype.hasOwnProperty.call(respData, key)) {
								const element:any = respData[key];
								if (this.eventDetails.author == element.users.id) {
									this.organizerDetails.push(element.users);
                                    if(this.organizerDetails && this.organizerDetails.length > 0){
                                        Object(this.organizerDetails).forEach((val, key) => {
                                            if (this.alluserInformation[val.id] != null) {
                                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.id].member_id, null)
                                                    .subscribe(
                                                        (resppData: any) => {
                                                            this.thumb = resppData;
                                                            val.image = this.thumb;
                                                        },
                                                        (error:any) => {
                                                            val.image = null;
                                                        });
                                            } else {
                                                val.image = null;
                                            }
                                        });
                                    }
								}else {
									this.approvedParticipants.push(element);
                                    if(this.approvedParticipants && this.approvedParticipants.length > 0){
                                        Object(this.approvedParticipants).forEach((val, key) => {
                                            if (this.alluserInformation[val.users.id].member_id != null) {
                                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[val.users.id].member_id, null)
                                                    .subscribe(
                                                        (resppData: any) => {
                                                            this.thumb = resppData;
                                                            val.users.image = this.thumb;
                                                        },
                                                        (error:any) => {
                                                            val.users.image = null;
                                                        });
                                            } else {
                                                val.users.image = null;
                                            }
                                        });
                                    }
								}
							}
						}
					}
				);
		}
	}

	getParticipantDetails(eventid:number) {
		if (sessionStorage.getItem('token')) {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('get', 'unapprovedParticipants/event/' + eventid, null)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					this.unapprovedParticipants = respData;
                    if(this.unapprovedParticipants && this.unapprovedParticipants.length > 0){
                        Object(this.unapprovedParticipants).forEach((val, key) => {
                            if (this.alluserInformation[val.id].member_id != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id='+this.userDetails.database_id+'&club_id='+this.userDetails.team_id+'&member_id=' + this.alluserInformation[val.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            val.image = this.thumb;
                                        },
                                        (error:any) => {
                                            val.image = null;
                                        });
                            } else {
                                val.image = null;
                            }
                            this.memImg.push(val);
                        });
                    }

					this.authService.setLoader(false);
				}
			);
		}
	}

    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
	getMemId(id:number) {
		this.thumbnail = '';
        this.commonFunctionService.getMemberId(id)
        .then((resp:any)=>{
                this.getclubInfo = resp.getclubInfo;
                this.birthdateStatus = resp.birthdateStatus;
                this.profile_data = resp.profile_data
                this.memberStartDateStatus = resp.memberStartDateStatus
                this.thumbnail = resp.thumbnail
                this.displayError = resp.displayError
        })
        .catch((err:any) => {
            console.log(err);
        })
	}

	showToggle: boolean = false;
	onShow() {
		let el: HTMLCollectionOf<Element> = document.getElementsByClassName("bunch_drop");
		if (!this.showToggle) {
			this.showToggle = true;
			el[0].className = "bunch_drop show";

		}	else {
			this.showToggle = false;
			el[0].className = "bunch_drop";
		}
	}

	deleteEvents(eventId:number) {
		let self = this;
		this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_event, function () {
			self.authService.setLoader(true);
			self.authService.memberSendRequest('delete', 'event/' + eventId, null)
				.subscribe(
					(respData: any) => {
						self.authService.setLoader(false);
						const url: string[] = ["/organizer"];
						self.router.navigate(url);
					}
				)
		}, function () {
			$('.dropdown-toggle').trigger('click');
		})
	}

	ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
