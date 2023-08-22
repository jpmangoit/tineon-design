import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { Extentions } from 'src/app/models/extentions.model';
import { PersonalMessagesType } from 'src/app/models/messages-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { appSetting } from 'src/app/app-settings';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-mpersonal-message',
    templateUrl: './mpersonal-message.component.html',
    styleUrls: ['./mpersonal-message.component.css']
})
export class MpersonalMessageComponent implements OnInit {

    language: any;
    searchSentenceForm: UntypedFormGroup;
    replyMsgForm: UntypedFormGroup;
    messageForm: UntypedFormGroup;
    replyMsgFormError: any = [];
    replyMsgSubmitted: boolean = false;
    responseMessage: string = null;
    personalInbox: boolean = true;
    personalStarred: boolean = false;
    personalSent: boolean = false;
    personalDrafts: boolean = false;
    personalAllMail: boolean = false;
    personalTrash: boolean = false;
    isReplyMsgForm: boolean = false;
    singleParticipent: boolean = false;
    multipleParticipent: boolean = false;
    messageSubmitted: boolean = false;
    personalVisiable: boolean = true;
    groupVisiable: boolean = false;
    clubVisiable: boolean = false;
    userDetails: LoginDetails;
    visiblityDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    userDropdownCCSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    userDropdownList: { 'id': string, 'name': string }[] = [];
    userDropdownCCList: { 'id': string, 'name': string }[] = [];
    alluserDetails: { firstname: string, lastname: string, email: string }[] = [];
    alluserInfo: UserDetails;
    setTheme: ThemeType;
    extensions: any;
    imageType: string[];
    ccUser: number[] = [];
    alluserInformation: { member_id: number }[] = [];
    thumb: string;
    personalMessage: PersonalMessagesType[];
    selectedMessage: any[] = [];
    receiverUser: any[] = [];
    private activatedSub: Subscription;


    isPersonalList: boolean = true;
    selected = '1';
    // select: { value: string; viewValue: any; }[];

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder, private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        let self = this;
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.extensions = appSetting.extensions;
        this.imageType = appSetting.imageType;

        // this.select = [
        //     { value: '1', viewValue: this.language.community_messages.inbox },
        //     { value: '2', viewValue: this.language.community_messages.starred },
        //     { value: '3', viewValue: this.language.community_messages.sent },
        //     { value: '4', viewValue: this.language.community_messages.drafts },
        //     { value: '5', viewValue: this.language.community_messages.allmail },
        //     { value: '6', viewValue: this.language.community_messages.trash },
        // ];

        this.replyMsgForm = this.formBuilder.group({
            content: ['', Validators.required],
            add_image: ['']
        });
        this.searchSentenceForm = this.formBuilder.group({
            sentence: ['', Validators.required],
            currentUid: [2]
        });
        this.messageForm = new UntypedFormGroup({
            'kind': new UntypedFormControl('personal'),
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
                    if(respData && respData.length > 0){
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.keycloak_id] = { member_id: val.member_id };
                            this.alluserDetails[val.keycloak_id] = { firstname: val.firstname, lastname: val.lastname, email: val.email };
                            this.userDropdownList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
                            this.userDropdownCCList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
                        })
                    }
                    this.alluserInfo = respData;
                    self.userDropdownSettings = {
                        singleSelection: false,
                        idField: 'id',
                        textField: 'name',
                        selectAllText: 'Select All',
                        enableCheckAll: false,
                        unSelectAllText: 'UnSelect All',
                        allowSearchFilter: true,
                        searchPlaceholderText: this.language.header.search
                    };

                    self.userDropdownCCSettings = {
                        singleSelection: false,
                        idField: 'id',
                        textField: 'name',
                        selectAllText: 'Select All',
                        enableCheckAll: false,
                        unSelectAllText: 'UnSelect All',
                        allowSearchFilter: true,
                        searchPlaceholderText: this.language.header.search
                    };
                })
        this.getPersonalMessage();
        this.onSelectMsgType('1')
    }

    onSelectMsgType(value) {
        this.isPersonalList = true;
        if (value == 1) {
            this.personalMessages();

        } else if (value == 2) {
            this.personalStarredMessages()

        } else if (value == 3) {
            this.personalSentMessages()

        } else if (value == 4) {
            this.personalDraftsMessages()

        } else if (value == 5) {
            this.personalAllMailMessages();
        } else if (value == 6) {
            this.personalTrashMessages();
        }
    }

    back() {
        this.isPersonalList = true;
    }

    searchSentence() {
        $(document).ready(function () {
            $("#myInput").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $("#myList *").filter(function () {
                    var msg_data = $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    getPersonalMessage() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-inbox', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = true;
                    this.personalStarred = false;
                    this.personalSent = false;
                    this.personalDrafts = false;
                    this.personalAllMail = false;
                    this.personalTrash = false;
                    this.authService.setLoader(false);

                    if (this.personalMessage && this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0]);
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }

                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            };
                        })
                    }
                }
            )
    }

    personalMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-inbox', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = true;
                    this.personalStarred = false;
                    this.personalSent = false;
                    this.personalDrafts = false;
                    this.personalAllMail = false;
                    this.personalTrash = false;
                    this.authService.setLoader(false);
                    if (this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0])
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }

                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            };
                        })
                    }
                }
            )
    }

    personalStarredMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-starred', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = false;
                    this.personalStarred = true;
                    this.personalSent = false;
                    this.personalDrafts = false;
                    this.personalAllMail = false;
                    this.personalTrash = false;
                    this.authService.setLoader(false);
                    if (this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0])
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }

                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            };
                        })
                    }
                }
            )
    }

    personalSentMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-sent', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = false;
                    this.personalStarred = false;
                    this.personalSent = true;
                    this.personalDrafts = false;
                    this.personalAllMail = false;
                    this.personalTrash = false;
                    this.authService.setLoader(false);
                    if (this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0])
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }
                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }
                        })
                    }
                }
            )
    }

    personalDraftsMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-draft', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = false;
                    this.personalStarred = false;
                    this.personalSent = false;
                    this.personalDrafts = true;
                    this.personalAllMail = false;
                    this.personalTrash = false;
                    this.authService.setLoader(false);
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (this.alluserInformation[element.user.id].member_id != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            element.user.image = this.thumb;
                                        },
                                        (error:any) => {
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

    personalAllMailMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-all-mail', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = false;
                    this.personalStarred = false;
                    this.personalSent = false;
                    this.personalDrafts = false;
                    this.personalAllMail = true;
                    this.personalTrash = false;
                    this.authService.setLoader(false);
                    if (this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0])
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){
                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }

                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (this.alluserInformation[element.user.id].member_id != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            element.user.image = this.thumb;
                                        },
                                        (error:any) => {
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

    personalTrashMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-trash', null)
            .subscribe(
                (respData: any) => {
                    // this.responseMessage = null;
                    this.personalMessage = [];
                    this.personalMessage = respData.reverse();
                    this.personalInbox = false;
                    this.personalStarred = false;
                    this.personalSent = false;
                    this.personalDrafts = false;
                    this.personalAllMail = false;
                    this.personalTrash = true;
                    this.authService.setLoader(false);
                    if (this.personalMessage.length > 0) {
                        this.selectedMessage.push(this.personalMessage[0])
                    }
                    if(this.personalMessage && this.personalMessage.length > 0){

                        this.personalMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            }

                        })
                    }
                    if(this.selectedMessage && this.selectedMessage.length > 0){
                        this.selectedMessage.forEach(element => {
                            if (element.user) {
                                if (this.alluserInformation[element.user.id].member_id != null) {
                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.user.id].member_id, null)
                                        .subscribe(
                                            (resppData: any) => {
                                                this.thumb = resppData;
                                                element.user.image = this.thumb;
                                            },
                                            (error:any) => {
                                                element.user.image = null;
                                            });
                                } else {
                                    element.user.image = null;
                                }
                            };
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
                    this.notificationService.showSuccess(this.language.community_messages.move_starreds,null);

                    if (this.personalInbox == true) {
                        this.personalMessages();
                    } else if (this.personalStarred == true) {
                        this.personalStarredMessages();
                    } else if (this.personalSent == true) {
                        this.personalSentMessages();
                    } else if (this.personalDrafts == true) {
                        this.personalDraftsMessages();
                    } else if (this.personalAllMail == true) {
                        this.personalAllMailMessages();
                    } else if (this.personalTrash == true) {
                        this.personalTrashMessages();
                    }
                    setTimeout(() => {
                    }, 500);
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
                    this.notificationService.showSuccess(this.language.community_messages.move_inbox,null);
                    let selectedTab = $('.feature_tab .active a').text().trim();
                    setTimeout(() => {
                        this.personalStarredMessages();
                    }, 1000);
                }
            )
    }

    clickMessages(id: number, esdb_id: string) {
        this.isPersonalList = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $(".widget-app-content").removeClass("highlight");
        this.selectedMessage = [];
        if(this.personalMessage && this.personalMessage.length > 0){
            this.personalMessage.forEach((val, index) => {
                if (val.id == id) {
                    this.selectedMessage.push(val)
                    this.authService.setLoader(false);
                }
            });
        }

        this.isReplyMsgForm = false;
        $("#message-" + id).parent().addClass('highlight');
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
        this.isPersonalList = false;
        this.isReplyMsgForm = false;
        this.visiblityDropdownSettings = {};
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $(".widget-app-content").removeClass("highlight");
        this.selectedMessage = [];
        if(this.personalMessage && this.personalMessage.length > 0){
            this.personalMessage.forEach((val, index) => {
                if (val.id == id) {
                    this.selectedMessage.push(val)
                    this.authService.setLoader(false);
                }
            });
        }

        this.isReplyMsgForm = false;
        $("#message-" + id).parent().addClass('highlight');
        let toUsers = [];
        let ccUsers = [];
        if (this.selectedMessage[0].to.length > 0) {
            this.selectedMessage[0].to.forEach((val, index) => {
                if (val) {
                    toUsers.push({ 'id': val, 'name': this.alluserDetails[val].firstname + ' ' + this.alluserDetails[val].lastname });
                }
            });
        }

        if (this.selectedMessage[0].cc.length > 0) {
            this.selectedMessage[0].cc.forEach((val, index) => {
                if (val) {
                    ccUsers.push({ 'id': val, 'name': this.alluserDetails[val].firstname + ' ' + this.alluserDetails[val].lastname });
                }
            });
        }
        this.messageForm.controls["kind"].setValue('personal');
        this.messageForm.controls["subject"].setValue(this.selectedMessage[0].subject);
        this.messageForm.controls["content"].setValue(this.selectedMessage[0].content);
        this.messageForm.controls["receiver_id"].setValue(toUsers);
        this.messageForm.controls["cc"].setValue(ccUsers);
    }

    deleteMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;

        let self = this;
        self.confirmDialogService.confirmThis(this.language.confirmation_message.send_msg_trash, function () {

            self.selectedMessage = [];
            self.authService.setLoader(true);
            let msgMoveData: { id: number, esdb_id: string, to: string } = {
                "id": messageId,
                "esdb_id": esdb_id,
                "to": "trash"
            };
            self.authService.memberSendRequest('post', 'message/move', msgMoveData)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        this.notificationService.showSuccess(self.language.community_messages.move_trash,null);
                        if (self.personalInbox == true) {
                            self.personalMessages();
                        } else if (self.personalStarred == true) {
                            self.personalStarredMessages();
                        } else if (self.personalSent == true) {
                            self.personalSentMessages();
                        } else if (self.personalDrafts == true) {
                            self.personalDraftsMessages();
                        } else if (self.personalAllMail == true) {
                            self.personalAllMailMessages();
                        } else if (self.personalTrash == true) {
                            self.personalTrashMessages();
                        }
                    }
                )
        }, function () {
        })
    }

    deleteMessagesPermanently(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.permanently_delete_msg, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        this.notificationService.showSuccess(self.language.community_messages.permanently_delete,null);
                        let selectedTab: any = $('.feature_tab .active a').text().trim();
                        setTimeout(() => {
                            self.personalTrashMessages();
                        }, 500);
                    }
                )
        }, function () {
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
        let msgType: any = $("#replyMsgType").val();
        let esdb_id: any = $("#replyToMsgId").val();
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
                                this.notificationService.showSuccess(respData.result,null);
                            } else {
                                this.notificationService.showError(respData.result,null);
                            }
                            this.replyMsgForm.reset();
                            this.isReplyMsgForm = false;
                            let selectedTab: any = $('.feature_tab .active a').text().trim();

                            setTimeout(() => {
                                if (this.personalInbox == true) {
                                    this.personalMessages();
                                } else if (this.personalStarred == true) {
                                    this.personalStarredMessages();
                                } else if (this.personalSent == true) {
                                    this.personalSentMessages();
                                } else if (this.personalDrafts == true) {
                                    this.personalDraftsMessages();
                                } else if (this.personalAllMail == true) {
                                    this.personalAllMailMessages();
                                } else if (this.personalTrash == true) {
                                    this.personalTrashMessages();
                                }
                            }, 500);
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
                                this.notificationService.showSuccess(respData.result,null);
                            } else {
                                this.notificationService.showError(respData.result,null);
                            }
                            this.replyMsgForm.reset();
                            this.isReplyMsgForm = false;
                            let selectedTab: any = $('.feature_tab .active a').text().trim();
                            setTimeout(() => {
                                if (this.personalInbox == true) {
                                    this.personalMessages();
                                } else if (this.personalStarred == true) {
                                    this.personalStarredMessages();
                                } else if (this.personalSent == true) {
                                    this.personalSentMessages();
                                } else if (this.personalDrafts == true) {
                                    this.personalDraftsMessages();
                                } else if (this.personalAllMail == true) {
                                    this.personalAllMailMessages();
                                } else if (this.personalTrash == true) {
                                    this.personalTrashMessages();
                                }
                            }, 500);
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
                    this.receiverUser.push(val.id)
                });;
            }

            if (this.messageForm.controls["cc"].value.length > 0) {
                this.messageForm.controls["cc"].value.forEach((val, index) => {
                    this.ccUser.push(val.id)
                });;
            }
            this.messageForm.controls["receiver_id"].setValue(this.receiverUser);
            this.messageForm.controls["cc"].setValue(this.ccUser);

            for (const key in this.messageForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.messageForm.value, key)) {
                    const element: any = this.messageForm.value[key];
                    if (key == 'file') {
                        formData.append('file', element);
                    } else if (key == 'receiver_id') {
                        if(element && element.length > 0){
                            element.forEach(function (value, key) {
                                formData.append("receiver_id[" + key + "]", value);
                            });
                        }
                    } else if (key == 'cc') {
                        if(element && element.length > 0){
                            element.forEach(function (value, key) {
                                formData.append("cc[" + key + "]", value);
                            });
                        }
                    } else {
                        formData.append(key, element);
                    }
                }
            };

            this.authService.memberSendRequest('post', 'message/send', formData)
                .subscribe(
                    (respData: any) => {
                        this.messageSubmitted = false;
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result'],null);
                            this.messageForm.reset();
                            this.messageForm.controls["kind"].setValue([]);
                            this.messageForm.controls["receiver_id"].setValue([]);
                            this.messageForm.controls["cc"].setValue([]);
                            this.authService.memberSendRequest('delete', 'message/delete-draft/' + this.selectedMessage[0].id, null)
                                .subscribe(
                                    (respData: any) => {
                                        this.authService.setLoader(false);
                                        this.notificationService.showSuccess(this.language.community_messages.message_sent,null);
                                        setTimeout(() => {
                                            this.personalDraftsMessages();
                                        }, 500);
                                    }
                                )
                        }else  if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    deleteDraftMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.permanently_delete_msg, function () {
            self.selectedMessage = [];
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'message/delete-draft/' + messageId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = self.language.community_messages.permanently_delete;
                        self.notificationService.showSuccess(self.responseMessage,null);
                        let selectedTab = $('.feature_tab .active a').text().trim();
                        setTimeout(() => {
                            self.personalDraftsMessages();
                        }, 500);
                    }
                )
        }, function () {
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
