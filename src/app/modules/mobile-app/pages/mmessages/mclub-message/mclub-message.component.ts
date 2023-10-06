import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Extentions } from 'src/app/models/extentions.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ClubMessagesType } from 'src/app/models/messages-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { appSetting } from 'src/app/app-settings';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DropdownService } from 'src/app/service/dropdown.service';
declare var $: any;

@Component({
	selector: 'app-mclub-message',
	templateUrl: './mclub-message.component.html',
	styleUrls: ['./mclub-message.component.css']
})
export class MclubMessageComponent implements OnInit {

	language: any;
	replyMsgForm: UntypedFormGroup;
	messageForm: UntypedFormGroup;
	replyMsgSubmitted: boolean = false;
	clubInbox: boolean = true;
	clubStarred: boolean = false;
	clubSent: boolean = false;
	clubDrafts: boolean = false;
	clubAllMail: boolean = false;
	clubTrash: boolean = false;
	isReplyMsgForm: boolean = false;
	singleParticipent: boolean = false;
	multipleParticipent: boolean = false;
	messageSubmitted: boolean = false;
	personalVisiable: boolean = true;
	groupVisiable: boolean = false;
	clubVisiable: boolean = false
	visiblityDropdownSettings: IDropdownSettings;
	userDropdownSettings: IDropdownSettings;
	userDropdownCCSettings: IDropdownSettings;
	groupDropdownSettings: IDropdownSettings;
	alluserDetails: { firstname: string, lastname: string, email: string }[] = [];
	userDropdownList: { 'id': string, 'name': string }[] = [];
	userDropdownCCList: { 'id': string, 'name': string }[] = [];
	extensions: any;
	imageType: string[];
	responseMessage: string = null;
	userDetails: LoginDetails;
	alluserInfo: UserDetails;
	setTheme: ThemeType;
	selectedMessage: any[] = [];
	receiverUser: any[] = [];
	ccUser: number[] = [];
	alluserInformation: { member_id: number }[] = [];
	thumb: string;
	clubMessage: ClubMessagesType[];
	private activatedSub: Subscription;
	selected = '1';

	isClublList: boolean = true;
	selectedValue: any;
	// select: { value: string; viewValue: any; }[];
	todayDate: any;
	constructor(
		private lang: LanguageService,
		private authService: AuthServiceService,
		public formBuilder: UntypedFormBuilder, private notificationService: NotificationService,
		private confirmDialogService: ConfirmDialogService, private themes: ThemeService, private dropdownService: DropdownService
	) { }

	ngOnInit(): void {
		this.todayDate = new Date();
		if (localStorage.getItem('club_theme') != null) {
			let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
			this.setTheme = resp;
		});

		this.dropdownService.getDropdownValue().subscribe(value => {
			this.selectedValue = value;
			this.onSelect(this.selectedValue);
			// Do something with the value
		});

		this.language = this.lang.getLanguaageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.extensions = appSetting.extensions;
		this.imageType = appSetting.imageType;
		this.getclubMessage();
		this.replyMsgForm = this.formBuilder.group({
			content: ['', Validators.required],
			add_image: ['']
		});
		this.messageForm = new UntypedFormGroup({
			'kind': new UntypedFormControl('club'),
			'receiver_id': new UntypedFormControl('', Validators.required),
			'subject': new UntypedFormControl('', Validators.required),
			'content': new UntypedFormControl('', Validators.required),
			'type': new UntypedFormControl('text'),
			'sender_id': new UntypedFormControl(this.userDetails.id),
			'file': new UntypedFormControl(''),
			'message_type': new UntypedFormControl('inbox'),
			'kind_id': new UntypedFormControl(''),
			'cc': new UntypedFormControl('')
		})
		this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
			.subscribe(
				(respData: any) => {
					if (respData && respData.length > 0) {
						Object(respData).forEach((val, key) => {
							this.alluserInformation[val.keycloak_id] = { member_id: val.member_id };
							this.alluserDetails[val.keycloak_id] = { firstname: val.firstname, lastname: val.lastname, email: val.email, };
							this.userDropdownList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
						})
					}
					this.alluserInfo = respData;
					this.userDropdownSettings = {
						singleSelection: false,
						idField: 'id',
						textField: 'name',
						selectAllText: 'Select All',
						enableCheckAll: false,
						unSelectAllText: 'UnSelect All',
						allowSearchFilter: true,
						searchPlaceholderText: this.language.header.search
					};
				}
			)

		// this.select = [
		//     { value: '1', viewValue: this.language.community_messages.inbox },
		//     { value: '2', viewValue: this.language.community_messages.starred },
		//     { value: '3', viewValue: this.language.community_messages.sent },
		//     { value: '4', viewValue: this.language.community_messages.drafts },
		//     { value: '5', viewValue: this.language.community_messages.allmail },
		//     { value: '6', viewValue: this.language.community_messages.trash },
		// ];
		this.onSelect('1')
	}

	onSelect(value) {
		this.isClublList = true;
		if (value == 1) {
			this.clubMessages();
		} else if (value == 2) {
			this.clubStarredMessages()

		} else if (value == 3) {
			this.clubSentMessages()

		} else if (value == 4) {
			this.clubDraftsMessages()

		} else if (value == 5) {
			this.clubAllMailMessages();
		} else if (value == 6) {
			this.clubTrashMessages();
		}
	}

	back() {
		this.isClublList = true;
	}

	getclubMessage() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-inbox', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = true;
					this.clubStarred = false;
					this.clubSent = false;
					this.clubDrafts = false;
					this.clubAllMail = false;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubMessages() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-inbox', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = true;
					this.clubStarred = false;
					this.clubSent = false;
					this.clubDrafts = false;
					this.clubAllMail = false;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}
					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubStarredMessages() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-starred', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = false;
					this.clubStarred = true;
					this.clubSent = false;
					this.clubDrafts = false;
					this.clubAllMail = false;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubSentMessages() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-sent', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = false;
					this.clubStarred = false;
					this.clubSent = true;
					this.clubDrafts = false;
					this.clubAllMail = false;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubDraftsMessages() {
		this.selectedMessage = [];
		this.isReplyMsgForm = false;
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-draft', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = false;
					this.clubStarred = false;
					this.clubSent = false;
					this.clubDrafts = true;
					this.clubAllMail = false;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubAllMailMessages() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-allmails', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = false;
					this.clubStarred = false;
					this.clubSent = false;
					this.clubDrafts = false;
					this.clubAllMail = true;
					this.clubTrash = false;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	clubTrashMessages() {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.authService.memberSendRequest('get', 'message/get-club-trash', null)
			.subscribe(
				(respData: any) => {
					// this.responseMessage = null;
					this.clubMessage = [];
					this.clubMessage = respData.reverse();
					this.clubInbox = false;
					this.clubStarred = false;
					this.clubSent = false;
					this.clubDrafts = false;
					this.clubAllMail = false;
					this.clubTrash = true;
					this.authService.setLoader(false);
					if (this.clubMessage.length > 0) {
						this.selectedMessage.push(this.clubMessage[0])
					}
					if (this.clubMessage && this.clubMessage.length > 0) {
						this.clubMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}


					if (this.selectedMessage && this.selectedMessage.length > 0) {
						this.selectedMessage.forEach(element => {
							if (this.alluserInformation && this.alluserInformation[element.user.id] && this.alluserInformation[element.user.id].member_id != null) {
								this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
									.subscribe(
										(resppData: any) => {
											this.thumb = resppData;
											element.user.image = this.thumb;
										},
										(error: any) => {
											element.user.image = null;
										});
							} else {
								element.user.image = null;
							}
						})
					}

				}
			)
	}

	markedStarredMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		let msgMoveData: { id: number, esdb_id: string, to: string } = {
			"id": messageId,
			"esdb_id": esdb_id,
			"to": "starred"
		};
		this.authService.memberSendRequest('post', 'message/move', msgMoveData)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					// let selectedTab:any = $('.feature_tab .active a').text().trim();
					setTimeout(() => {
						if (this.clubInbox == true) {
							this.clubMessages();
						} else if (this.clubStarred == true) {
							this.clubStarredMessages();
						} else if (this.clubSent == true) {
							this.clubSentMessages();
						} else if (this.clubDrafts == true) {
							this.clubDraftsMessages();
						} else if (this.clubAllMail == true) {
							this.clubAllMailMessages();
						} else if (this.clubTrash == true) {
							this.clubTrashMessages();
						}
						// if (selectedTab == 'Inbox') {
						// 	this.clubMessages();
						// } else if (selectedTab == 'Starred') {
						// 	this.clubStarredMessages();
						// } else if (selectedTab == 'Sent') {
						// 	this.clubSentMessages();
						// } else if (selectedTab == 'Drafts') {
						// 	this.clubDraftsMessages();
						// } else if (selectedTab == 'All Mails') {
						// 	this.clubAllMailMessages();
						// } else if (selectedTab == 'Trash') {
						// 	this.clubTrashMessages();
						// }
					}, 500);
					// setTimeout(() => {
					// 	this.responseMessage = '';
					// }, 3000);
				}
			)
	}

	unmarkedStarredMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		let msgMoveData: { id: number, esdb_id: string, to: string } = {
			"id": messageId,
			"esdb_id": esdb_id,
			"to": "inbox"
		};
		this.authService.memberSendRequest('post', 'message/move', msgMoveData)
			.subscribe(
				(respData: any) => {
					this.authService.setLoader(false);
					this.responseMessage = this.language.community_messages.move_inbox;
					this.notificationService.showSuccess(this.responseMessage, null);
					let selectedTab: any = $('.feature_tab .active a').text().trim();
					setTimeout(() => {
						this.clubStarredMessages();
					}, 1000);
				}
			)
	}

	clickMessages(id: number, esdb_id: string) {
		this.isClublList = false;
		this.selectedMessage = [];
		this.authService.setLoader(true);
		$(".widget-app-content").removeClass("highlight");
		this.selectedMessage = [];
		if (this.clubMessage && this.clubMessage.length > 0) {
			this.clubMessage.forEach((val, index) => {
				if (val.id == id) {
					this.selectedMessage.push(val)
					this.authService.setLoader(false);
				}
			});
		}

		this.isReplyMsgForm = false;

		if (this.selectedMessage) {
			if (this.selectedMessage[0].is_read == 0) {
				this.authService.memberSendRequest('get', 'message/read-message/' + id, null)
					.subscribe(
						(respData: any) => {
							setTimeout(() => {
								$("#envelope-" + id).removeClass("fa-envelope-o").addClass("fa-envelope-open-o");
							}, 500);
						}
					)
			}
		}
	}

	clickDraftMessages(id: number, esdb_id: string) {
		this.isClublList = false;
		this.isReplyMsgForm = false;
		this.visiblityDropdownSettings = {};
		this.language = this.lang.getLanguaageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.selectedMessage = [];
		this.authService.setLoader(true);
		this.replyMsgSubmitted = false;
		$(".widget-app-content").removeClass("highlight");
		this.selectedMessage = [];
		if (this.clubMessage && this.clubMessage.length > 0) {

			this.clubMessage.forEach((val, index) => {
				if (val.id == id) {
					this.selectedMessage.push(val)
					this.authService.setLoader(false);
				}
			});
		}
		this.isReplyMsgForm = false;
		$("#message-" + id).parent().addClass('highlight');
		let toUsers: { 'id': any, 'name': string }[] = [];
		let ccUsers: { 'id': any, 'name': string }[] = [];
		if (this.selectedMessage[0].to.length > 0) {
			this.selectedMessage[0].to.forEach((val, index) => {
				if (val && this.alluserDetails[val]) {
					toUsers.push({ 'id': val, 'name': this.alluserDetails[val].firstname + ' ' + this.alluserDetails[val].lastname })
				}
			});
		}
		this.messageForm.controls["kind"].setValue('club');
		this.messageForm.controls["subject"].setValue(this.selectedMessage[0].subject);
		this.messageForm.controls["content"].setValue(this.selectedMessage[0].content);
		this.messageForm.controls["receiver_id"].setValue(toUsers);
		this.messageForm.controls["cc"].setValue(ccUsers);
	}



	deleteMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = false;
		this.confirmDialogService.confirmThis(this.language.confirmation_message.send_msg_trash, () => {
			this.selectedMessage = [];
			this.authService.setLoader(true);
			let msgMoveData: { id: number, esdb_id: string, to: string } = {
				"id": messageId,
				"esdb_id": esdb_id,
				"to": "trash"
			};
			this.authService.memberSendRequest('post', 'message/move', msgMoveData)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.responseMessage = this.language.community_messages.move_trash;
						this.notificationService.showSuccess(this.responseMessage, null);
						// setTimeout(() => {
						// 	this.responseMessage = '';
						// }, 2000);
						// let selectedTab:any = $('.feature_tab .active a').text().trim();
						setTimeout(() => {
							if (this.clubInbox == true) {
								this.clubMessages();
							} else if (this.clubStarred == true) {
								this.clubStarredMessages();
							} else if (this.clubSent == true) {
								this.clubSentMessages();
							} else if (this.clubDrafts == true) {
								this.clubDraftsMessages();
							} else if (this.clubAllMail == true) {
								this.clubAllMailMessages();
							} else if (this.clubTrash == true) {
								this.clubTrashMessages();
							}
						}, 500);
					}
				)
		}, () => {
		})
	}

	deleteMessagesPermanently(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = false;
		this.confirmDialogService.confirmThis(this.language.confirmation_message.permanently_delete_msg, () => {
			this.authService.setLoader(true);
			this.authService.memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.responseMessage = this.language.community_messages.permanently_delete;
						this.notificationService.showSuccess(this.responseMessage, null);
						// setTimeout(() => {
						// 	this.responseMessage = '';
						// }, 400);
						let selectedTab: any = $('.feature_tab .active a').text().trim();
						setTimeout(() => {
							this.clubTrashMessages();
						}, 500);
					}
				)
		}, () => {
		})
	}

	stringifiedData(data: string) {
		if (data) {
			return JSON.parse(data)
		}
	}

	replyToMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = true;
		this.singleParticipent = true;
		this.multipleParticipent = false;
		setTimeout(() => {
			$("#reply-heading").text("Reply");
			$("#replyMsgType").val('reply');
			$("#replyToMsgId").val(esdb_id);
		}, 500)
	}

	replayToAllMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = true;
		this.singleParticipent = false;
		this.multipleParticipent = true;
		setTimeout(() => {
			$("#reply-heading").text("Reply to all");
			$("#replyMsgType").val('replyAll');
			$("#replyToMsgId").val(esdb_id);
		}, 500);

	}

	replyMessage() {
		let msgType = $("#replyMsgType").val();
		let esdb_id = $("#replyToMsgId").val();
		this.replyMsgSubmitted = true;
		if ((this.replyMsgForm.valid)) {
			var formData: FormData = new FormData();
			formData.append("file", this.replyMsgForm.get('add_image').value);
			formData.append("content", this.replyMsgForm.get('content').value)
			if (msgType == 'reply') {
				this.authService.setLoader(true);
				this.authService.memberSendRequest('post', 'message/reply/' + esdb_id, formData)
					.subscribe(
						(respData: any) => {
							this.authService.setLoader(false);
							this.replyMsgSubmitted = false;
							if (respData.isError == false) {
								this.notificationService.showSuccess(respData.result, null);
							} else {
								this.notificationService.showError(respData.result, null);
							}
							this.replyMsgForm.reset();
							this.isReplyMsgForm = false;
						}
					)
			} else {
				this.authService.setLoader(true);
				this.authService.memberSendRequest('post', 'message/reply-to-all/' + esdb_id, formData)
					.subscribe(
						(respData: any) => {
							this.authService.setLoader(false);
							this.replyMsgSubmitted = false;
							if (respData.isError == false) {
								this.notificationService.showSuccess(respData.result, null);
							} else {
								this.notificationService.showError(respData.result, null);
							}
							this.replyMsgForm.reset();
							this.isReplyMsgForm = false;
						}
					)
			}
		}

	}

	errorImage: any = { isError: false, errorMessage: '' };
	uploadFile(event: Event) {
		const file: File = (event.target as HTMLInputElement).files[0];
		const mimeType: string = file.type;
		this.errorImage = { Error: true, errorMessage: '' };
		this.replyMsgForm.patchValue({
			add_image: file
		});
		this.replyMsgForm.get('add_image').updateValueAndValidity();

		const reader: FileReader = new FileReader();
		reader.readAsDataURL(file);
		var url: any;
		reader.onload = (_event) => {
			url = reader.result;
			$('.message-upload-list').show();
			if (mimeType.match(/image\/*/)) {
				$('.preview_img').attr('src', url);
			} else {
				$('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
			}

		}
		$('.preview_txt').show();
		$('.preview_txt').text(file.name);
	}

	uploadDraftFile(event: Event) {
		const file: File = (event.target as HTMLInputElement).files[0];
		const mimeType: string = file.type;
		this.messageForm.patchValue({
			file: file
		});
		this.messageForm.get('file').updateValueAndValidity();
		const reader: FileReader = new FileReader();
		reader.readAsDataURL(file);
		var url: any;
		reader.onload = (_event) => {
			url = reader.result;
			$('.message-upload-list').show();
			if (mimeType.match(/image\/*/)) {
				$('.preview_img').attr('src', url);
			} else {
				$('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
			}

		}
		$('.preview_txt').show();
		$('.preview_txt').text(file.name);
	}

	showToggle: boolean = false;
	onShow() {
		let el: HTMLCollectionOf<Element> = document.getElementsByClassName("reply-users");
		if (!this.showToggle) {
			this.showToggle = true;
			el[0].className = "reply-users show";
		}
		else {
			this.showToggle = false;
			el[0].className = "reply-users";
		}
	}
	showMore: boolean = false;
	onOpen() {
		let el: HTMLCollectionOf<Element> = document.getElementsByClassName("multipl-participent-reply reply-users");
		if (!this.showMore) {
			this.showMore = true;
			el[0].className = "multipl-participent-reply reply-users show";
		}
		else {
			this.showMore = false;
			el[0].className = "multipl-participent-reply reply-users";
		}
	}

	messageProcess() {
		this.messageSubmitted = true;
		if (this.messageForm.valid) {
			var formData: FormData = new FormData();
			this.receiverUser = [];
			this.ccUser = [];
			if (this.messageForm.controls["receiver_id"].value.length > 0) {
				this.messageForm.controls["receiver_id"].value.forEach((val, index) => {
					if (val.id) {
						this.receiverUser.push(val.id)
					}
				});
			}
			if (this.messageForm.controls["cc"].value.length > 0) {
				this.messageForm.controls["cc"].value.forEach((val, index) => {
					if (val.id) {
						this.ccUser.push(val.id)
					}
				});
			}
			this.messageForm.controls["receiver_id"].setValue(this.receiverUser);
			this.messageForm.controls["cc"].setValue(this.ccUser);
			for (const key in this.messageForm.value) {
				if (Object.prototype.hasOwnProperty.call(this.messageForm.value, key)) {
					const element: any = this.messageForm.value[key];
					if (key == 'file') {
						formData.append('file', element);
					} else if (key == 'receiver_id') {
						if (element && element.length > 0) {
							element.forEach(function (value, key) {
								formData.append("receiver_id[" + key + "]", value);
							});
						}
					} else if (key == 'cc') {
						if (element && element.length > 0) {
							element.forEach(function (value, key) {
								formData.append("cc[" + key + "]", value);
							});
						}
					} else {
						formData.append(key, element);
					}
				}
			};
			this.authService.setLoader(true);
			this.authService.memberSendRequest('post', 'message/send-club-message', formData)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.messageSubmitted = false;
						if (respData['isError'] == false) {
							this.notificationService.showSuccess(respData['result'], null);
							this.messageForm.reset();
							this.messageForm.controls["kind"].setValue([]);
							this.messageForm.controls["receiver_id"].setValue([]);
							this.messageForm.controls["cc"].setValue([]);
							this.authService.memberSendRequest('delete', 'message/delete-draft/' + this.selectedMessage[0].id, null)
								.subscribe(
									(respData: any) => {
										this.authService.setLoader(false);
										this.notificationService.showSuccess(this.language.community_messages.message_sent, null);
										setTimeout(() => {
											this.clubDraftsMessages();
										}, 500);
									}
								)
						} else if (respData['code'] == 400) {
							this.notificationService.showError(respData['message'], null);
						}
					},
				);

		}
	}

	deleteDraftMessages(messageId: number, esdb_id: string) {
		this.isReplyMsgForm = false;
		this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_draft_msg, () => {
			this.selectedMessage = [];
			this.authService.setLoader(true);
			this.authService.memberSendRequest('delete', 'message/delete-draft/' + messageId, null)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.responseMessage = this.language.community_messages.permanently_delete;
						this.notificationService.showError(this.responseMessage, null);
						// setTimeout(() => {
						// 	this.responseMessage = '';
						// }, 400);
						let selectedTab: any = $('.feature_tab .active a').text().trim();
						setTimeout(() => {
							this.clubDraftsMessages();
						}, 500);
					}
				)
		}, () => {
		})
	}

	onReceiverSelect(item: { 'id': string, 'name': string }) {
		this.receiverUser.push(item.id);
	}

	onReceiverDeSelect(item: { 'id': string, 'name': string }) {
		const index = this.receiverUser.indexOf(item.id);
		if (index > -1) {
			this.receiverUser.splice(index, 1);
		}
	}

	onCCSelect(item: { 'id': number, 'name': string }) {
		this.ccUser.push(item.id);
	}

	ngOnDestroy(): void {
		this.activatedSub.unsubscribe();
	}

}
