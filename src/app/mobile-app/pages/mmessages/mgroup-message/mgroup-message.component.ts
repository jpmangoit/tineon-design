import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { Extentions } from 'src/app/models/extentions.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { appSetting } from 'src/app/app-settings';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DropdownService } from 'src/app/service/dropdown.service';
declare var $: any;

@Component({
    selector: 'app-mgroup-message',
    templateUrl: './mgroup-message.component.html',
    styleUrls: ['./mgroup-message.component.css']
})
export class MgroupMessageComponent implements OnInit {

    language: any;
    replyMsgForm: UntypedFormGroup;
    messageForm: UntypedFormGroup;
    replyMsgSubmitted: boolean = false;
    groupInbox: boolean = true;
    groupStarred: boolean = false;
    groupSent: boolean = false;
    groupDrafts: boolean = false;
    groupAllMail: boolean = false;
    isReplyMsgForm: boolean = false;
    singleParticipent: boolean = false;
    multipleParticipent: boolean = false;
    messageSubmitted: boolean = false;
    personalVisiable: boolean = true;
    groupVisiable: boolean = false;
    clubVisiable: boolean = false;
    groupTrash: boolean = false;
    responseMessage: string = null;
    extensions: any;
    imageType: string[];
    setTheme: ThemeType;
    visiblityDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    userDropdownCCSettings: IDropdownSettings;
    userDropdownList: { id: string; name: string }[] = [];
    userDropdownCCList: { id: string; name: string }[] = [];
    alluserDetails: { firstname: string; lastname: string; email: string }[] = [];
    alluserInfo: UserDetails;
    ccUser: number[] = [];
    userDetails: LoginDetails;
    teamId: number;
    groups: CommunityGroup[];
    receipientUsers: any = [];
    selectedMessage: any[] = [];
    receiverUser: any[] = [];
    thumb: string;
    alluserInformation: { member_id: number }[] = [];
    groupMessage: any[];
    private activatedSub: Subscription;
    isGroupList: boolean = true;
    selected = '1';
    selectedValue :any;
    // select: { value: string; viewValue: any; }[];

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private dropdownService: DropdownService
    ) { }

    ngOnInit(): void {
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
        this.teamId = this.userDetails.team_id;
        this.extensions = appSetting.extensions;
        this.imageType = appSetting.imageType;
        this.getGroupMessage();
        this.replyMsgForm = this.formBuilder.group({
            content: ['', Validators.required],
            add_image: [''],
        });
        this.getGroup();
        this.messageForm = new UntypedFormGroup({
            kind: new UntypedFormControl('group'),
            receiver_id: new UntypedFormControl(''),
            subject: new UntypedFormControl('', Validators.required),
            content: new UntypedFormControl('', Validators.required),
            type: new UntypedFormControl('text'),
            sender_id: new UntypedFormControl(this.userDetails.id),
            file: new UntypedFormControl(''),
            message_type: new UntypedFormControl('inbox'),
            kind_id: new UntypedFormControl('', Validators.required),
            cc: new UntypedFormControl(''),
        });
        this.authService
            .memberSendRequest(
                'get',
                'teamUsers/team/' + this.userDetails.team_id,
                null
            )
            .subscribe((respData: any) => {
                Object(respData).forEach((val, key) => {
                    this.alluserInformation[val.keycloak_id] = { member_id: val.member_id };

                    this.alluserDetails[val.keycloak_id] = {
                        firstname: val.firstname,
                        lastname: val.lastname,
                        email: val.email,
                    };
                });
            });

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
        this.isGroupList = true;
        if (value == 1) {
            this.groupMessages();

        } else if (value == 2) {
            this.groupStarredMessages()

        } else if (value == 3) {
            this.groupSentMessages()

        } else if (value == 4) {
            this.groupDraftsMessages()

        } else if (value == 5) {
            this.groupAllMailMessages();
        } else if (value == 6) {
            this.groupTrashMessages();
        }
    }

    back() {
        this.isGroupList = true;
    }

    getGroupMessage() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-inbox', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = true;
                this.groupStarred = false;
                this.groupSent = false;
                this.groupDrafts = false;
                this.groupAllMail = false;
                this.groupTrash = false;
                this.authService.setLoader(false);
                if (this.groupMessage.length > 0) {
                    this.selectedMessage.push(this.groupMessage[0]);
                }
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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
            });
    }

    groupMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-inbox', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = true;
                this.groupStarred = false;
                this.groupSent = false;
                this.groupDrafts = false;
                this.groupAllMail = false;
                this.groupTrash = false;
                this.authService.setLoader(false);
                if (this.groupMessage.length > 0) {
                    this.selectedMessage.push(this.groupMessage[0]);
                }
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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
            });
    }

    stringifiedData(data: string) {
        return JSON.parse(data);
    }

    groupStarredMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-starred', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = false;
                this.groupStarred = true;
                this.groupSent = false;
                this.groupDrafts = false;
                this.groupAllMail = false;
                this.groupTrash = false;
                this.authService.setLoader(false);
                if (this.groupMessage.length > 0) {
                    this.selectedMessage.push(this.groupMessage[0]);
                }
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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
            });
    }

    groupSentMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-sent', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = false;
                this.groupStarred = false;
                this.groupSent = true;
                this.groupDrafts = false;
                this.groupAllMail = false;
                this.groupTrash = false;
                this.authService.setLoader(false);
                if (this.groupMessage.length > 0) {
                    this.selectedMessage.push(this.groupMessage[0]);
                }
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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

            });
    }

    groupDraftsMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-draft', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = false;
                this.groupStarred = false;
                this.groupSent = false;
                this.groupDrafts = true;
                this.groupAllMail = false;
                this.groupTrash = false;
                this.authService.setLoader(false);
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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
            });
    }

    groupAllMailMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'message/get-group-allmails', null)
        .subscribe((respData: any) => {
            // this.responseMessage = null;
            this.groupMessage = [];
            this.groupMessage = respData.reverse();
            this.groupInbox = false;
            this.groupStarred = false;
            this.groupSent = false;
            this.groupDrafts = false;
            this.groupAllMail = true;
            this.groupTrash = false;
            this.authService.setLoader(false);
            if (this.groupMessage.length > 0) {
                this.selectedMessage.push(this.groupMessage[0]);
            }
            if(this.groupMessage && this.groupMessage.length > 0){
                this.groupMessage.forEach(element => {
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
        });
    }

    groupTrashMessages() {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.authService
            .memberSendRequest('get', 'message/get-group-trash', null)
            .subscribe((respData: any) => {
                // this.responseMessage = null;
                this.groupMessage = [];
                this.groupMessage = respData.reverse();
                this.groupInbox = false;
                this.groupStarred = false;
                this.groupSent = false;
                this.groupDrafts = false;
                this.groupAllMail = false;
                this.groupTrash = true;
                this.authService.setLoader(false);
                if (this.groupMessage.length > 0) {
                    this.selectedMessage.push(this.groupMessage[0]);
                }
                if(this.groupMessage && this.groupMessage.length > 0){
                    this.groupMessage.forEach(element => {
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
            });
    }

    markedStarredMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        let msgMoveData: { id: number; esdb_id: string; to: string } = {
            id: messageId,
            esdb_id: esdb_id,
            to: 'starred',
        };
        this.authService
            .memberSendRequest('post', 'message/move', msgMoveData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                setTimeout(() => {
                    if (this.groupInbox == true) {
                        this.groupMessages();
                    } else if (this.groupStarred == true) {
                        this.groupStarredMessages();
                    } else if (this.groupSent == true) {
                        this.groupSentMessages();
                    } else if (this.groupDrafts == true) {
                        this.groupDraftsMessages();
                    } else if (this.groupAllMail == true) {
                        this.groupAllMailMessages();
                    } else if (this.groupTrash == true) {
                        this.groupTrashMessages();
                    }
                }, 500);
            });
    }

    unmarkedStarredMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        this.selectedMessage = [];
        this.authService.setLoader(true);
        let msgMoveData: { id: number; esdb_id: string; to: string } = {
            id: messageId,
            esdb_id: esdb_id,
            to: 'inbox',
        };
        this.authService.memberSendRequest('post', 'message/move', msgMoveData)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                this.notificationService.showSuccess(this.language.community_messages.move_inbox,null);
                let selectedTab: any = $('.feature_tab .active a').text().trim();
                setTimeout(() => {
                    this.groupStarredMessages();
                }, 1000);
            });
    }

    clickMessages(id: number, esdb_id: string) {
        this.isGroupList = false
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $('.widget-app-content').removeClass('highlight');
        this.selectedMessage = [];
        if(this.groupMessage && this.groupMessage.length > 0){
            this.groupMessage.forEach((val, index) => {
                if (val.id == id) {
                    this.selectedMessage.push(val);
                    this.authService.setLoader(false);
                }
            });
        }
        this.isReplyMsgForm = false;
        $('#message-' + id)
            .parent()
            .addClass('highlight');

        if (this.selectedMessage) {
            if (this.selectedMessage[0].is_read == 0) {
                this.authService.memberSendRequest('get', 'message/read-message/' + id, null)
                .subscribe((respData: any) => {
                    setTimeout(() => {
                        $('#envelope-' + id)
                            .removeClass('fa-envelope-o')
                            .addClass('fa-envelope-open-o');
                    }, 500);
                });
            }
        }
    }

    clickDraftMessages(id: number, esdb_id: string) {
        this.isGroupList = false;
        this.isReplyMsgForm = false;
        this.visiblityDropdownSettings = {};
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.getGroup();
        this.visiblityDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $('.widget-app-content').removeClass('highlight');
        this.selectedMessage = [];
        if(this.groupMessage && this.groupMessage.length > 0){
            this.groupMessage.forEach((val, index) => {
                if (val.id == id) {
                    this.selectedMessage.push(val);
                    this.authService.setLoader(false);
                }
            });
        }
        this.isReplyMsgForm = false;
        $('#message-' + id).parent().addClass('highlight');
        let toGroup: { id: any; name: string }[] = [];
        if (this.selectedMessage[0].group) {
            toGroup.push({
                id: this.selectedMessage[0].group.id,
                name: this.selectedMessage[0].group.name,
            });
        }
        this.messageForm.controls['kind'].setValue('group');
        this.messageForm.controls['subject'].setValue(
            this.selectedMessage[0].subject
        );
        this.messageForm.controls['content'].setValue(
            this.selectedMessage[0].content
        );
        this.messageForm.controls['kind_id'].setValue(toGroup);
    }

    deleteMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        let self = this;
        this.confirmDialogService.confirmThis(
            this.language.confirmation_message.send_msg_trash,
            function () {
                self.selectedMessage = [];
                self.authService.setLoader(true);
                let msgMoveData: { id: number; esdb_id: string; to: string } = {
                    id: messageId,
                    esdb_id: esdb_id,
                    to: 'trash',
                };
                self.authService
                    .memberSendRequest('post', 'message/move', msgMoveData)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        setTimeout(() => {
                            if (self.groupInbox == true) {
                                self.groupMessages();
                            } else if (self.groupStarred == true) {
                                self.groupStarredMessages();
                            } else if (self.groupSent == true) {
                                self.groupSentMessages();
                            } else if (self.groupDrafts == true) {
                                self.groupDraftsMessages();
                            } else if (self.groupAllMail == true) {
                                self.groupAllMailMessages();
                            } else if (self.groupTrash == true) {
                                self.groupTrashMessages();
                            }
                        }, 500);
                    });
            },
            function () { }
        );
    }

    deleteMessagesPermanently(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        let self = this;
        this.confirmDialogService.confirmThis(
            this.language.confirmation_message.permanently_delete_msg,
            function () {
                self.authService.setLoader(true);
                self.authService
                    .memberSendRequest('delete', 'message/deny-message/' + esdb_id, null)
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage =  self.language.community_messages.permanently_delete;
                        self.notificationService.showSuccess(self.responseMessage,null);
                        let selectedTab: any = $('.feature_tab .active a').text().trim();
                        setTimeout(() => {
                            self.groupTrashMessages();
                        }, 500);
                    });
            },
            function () { }
        );
    }

    replyToMessages(messageId: number, esdb_id: string, groupId) {
        this.isReplyMsgForm = true;
        this.singleParticipent = true;
        this.multipleParticipent = false;
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + groupId, null)
        .subscribe((respData: any) => {
            this.receipientUsers = respData[0].participants;
            setTimeout(() => {
                $('#reply-heading').text('Reply');
                $('#replyMsgType').val('reply');
                $('#replyToMsgId').val(esdb_id);
            }, 500);
        });
    }

    replyMessage() {
        let msgType: any = $('#replyMsgType').val();
        let esdb_id: any = $('#replyToMsgId').val();
        this.replyMsgSubmitted = true;
        if (this.replyMsgForm.valid) {
            var formData: FormData = new FormData();
            formData.append('file', this.replyMsgForm.get('add_image').value);
            formData.append('content', this.replyMsgForm.get('content').value);
            if (msgType == 'reply') {
                this.authService.setLoader(true);
                this.authService
                    .memberSendRequest('post', 'message/reply/' + esdb_id, formData)
                    .subscribe((respData: any) => {
                        this.authService.setLoader(false);
                        this.replyMsgSubmitted = false;
                        if (respData.isError == false) {
                            this.notificationService.showSuccess(respData.result,null);
                        } else {
                            this.notificationService.showError(respData.result,null);
                        }
                        this.replyMsgForm.reset();
                        this.isReplyMsgForm = false;
                        setTimeout(() => {
                            if (this.groupInbox == true) {
                                this.groupMessages();
                            } else if (this.groupStarred == true) {
                                this.groupStarredMessages();
                            } else if (this.groupSent == true) {
                                this.groupSentMessages();
                            } else if (this.groupDrafts == true) {
                                this.groupDraftsMessages();
                            } else if (this.groupAllMail == true) {
                                this.groupAllMailMessages();
                            } else if (this.groupTrash == true) {
                                this.groupTrashMessages();
                            }
                        }, 500);
                    });
            } else {
                this.authService.setLoader(true);
                this.authService
                    .memberSendRequest('post', 'message/reply-to-all/' + esdb_id,formData ).subscribe((respData: any) => {
                        this.authService.setLoader(false);
                        this.replyMsgSubmitted = false;
                        if (respData.isError == false) {
                            this.notificationService.showSuccess(respData.result,null);
                        } else {
                            this.notificationService.showError(respData.result,null);
                        }
                        this.replyMsgForm.reset();
                        this.isReplyMsgForm = false;
                        setTimeout(() => {
                            if (this.groupInbox == true) {
                                this.groupMessages();
                            } else if (this.groupStarred == true) {
                                this.groupStarredMessages();
                            } else if (this.groupSent == true) {
                                this.groupSentMessages();
                            } else if (this.groupDrafts == true) {
                                this.groupDraftsMessages();
                            } else if (this.groupAllMail == true) {
                                this.groupAllMailMessages();
                            } else if (this.groupTrash == true) {
                                this.groupTrashMessages();
                            }
                        }, 500);
                    });
            }
        }
    }

    errorImage: any = { isError: false, errorMessage: '' };
    uploadFile(event: Event) {
        const file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        this.errorImage = { Error: true, errorMessage: '' };
        this.replyMsgForm.patchValue({
            add_image: file,
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
        };
        $('.preview_txt').show();
        $('.preview_txt').text(file.name);
    }

    uploadDraftFile(event: Event) {
        const file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        this.messageForm.patchValue({
            file: file,
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
        };
        $('.preview_txt').show();
        $('.preview_txt').text(file.name);
    }

    showToggle: boolean = false;
    onShow() {
        let el: HTMLCollectionOf<Element> =
            document.getElementsByClassName('reply-users');
        if (!this.showToggle) {
            this.showToggle = true;
            el[0].className = 'reply-users show';
        } else {
            this.showToggle = false;
            el[0].className = 'reply-users';
        }
    }

    showMore: boolean = false;
    onOpen() {
        let el: HTMLCollectionOf<Element> = document.getElementsByClassName(
            'multipl-participent-reply reply-users'
        );
        if (!this.showMore) {
            this.showMore = true;
            el[0].className = 'multipl-participent-reply reply-users show';
        } else {
            this.showMore = false;
            el[0].className = 'multipl-participent-reply reply-users';
        }
    }

    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService
                .memberSendRequest('get', 'teamgroups/' + this.teamId, null)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.groups = respData;
                    this.groupDropdownSettings = {
                        singleSelection: true,
                        idField: 'id',
                        textField: 'name',
                        selectAllText: 'Select All',
                        enableCheckAll: false,
                        unSelectAllText: 'UnSelect All',
                        allowSearchFilter: true,
                        searchPlaceholderText: this.language.header.search,
                        closeDropDownOnSelection: true
                    };
                });
        }
    }

    messageProcess() {
        this.messageSubmitted = true;
        if (this.messageForm.valid) {
            let groupIds: any;
            if (this.messageForm.controls['kind_id'].value.length > 0) {
                this.messageForm.controls['kind_id'].value.forEach((val, index) => {
                    groupIds = val.id;
                });
            }
            var formData: FormData = new FormData();
            this.messageForm.controls['receiver_id'].setValue(this.receiverUser);
            this.messageForm.controls['cc'].setValue(this.ccUser);
            this.messageForm.controls['kind_id'].setValue(groupIds);
            for (const key in this.messageForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.messageForm.value, key)) {
                    const element: any = this.messageForm.value[key];
                    if (key == 'file') {
                        formData.append('file', element);
                    } else if (key == 'receiver_id') {
                        if(element && element.length > 0){
                            element.forEach(function (value, key) {
                                formData.append('receiver_id[' + key + ']', value);
                            });
                        }

                    } else if (key == 'cc') {
                        if(element && element.length > 0){
                            element.forEach(function (value, key) {
                                formData.append('cc[' + key + ']', value);
                            });
                        }

                    } else {
                        formData.append(key, element);
                    }
                }
            }
            this.authService.memberSendRequest('post', 'message/send-group-message', formData)
                .subscribe(
                    (respData: any) => {
                        this.messageSubmitted = false;
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result'],null);
                            this.messageForm.reset();
                            this.messageForm.controls['kind'].setValue([]);
                            this.messageForm.controls['receiver_id'].setValue([]);
                            this.messageForm.controls['cc'].setValue([]);
                            this.authService
                                .memberSendRequest(
                                    'delete',
                                    'message/delete-draft/' + this.selectedMessage[0].id,
                                    null
                                )
                                .subscribe((respData: any) => {
                                    this.authService.setLoader(false);
                                    this.notificationService.showSuccess(this.language.community_messages.message_sent,null);
                                    setTimeout(() => {
                                        this.groupDraftsMessages();
                                    }, 500);
                                });
                        }else if (respData['code'] == 400) {
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
        this.confirmDialogService.confirmThis(
            this.language.confirmation_message.delete_msg,
            function () {
                self.selectedMessage = [];
                self.authService.setLoader(true);
                self.authService
                    .memberSendRequest(
                        'delete',
                        'message/delete-draft/' + messageId,
                        null
                    )
                    .subscribe((respData: any) => {
                        self.authService.setLoader(false);
                        self.responseMessage = self.language.community_messages.permanently_delete;
                        self.notificationService.showSuccess(self.responseMessage,null);
                        let selectedTab: any = $('.feature_tab .active a').text().trim();
                        setTimeout(() => {
                            self.groupDraftsMessages();
                        }, 500);
                    });
            },
            function () { }
        );
    }

    onReceiverSelect(item: { id: string; name: string }) {
        this.receiverUser.push(item.id);
    }

    onReceiverDeSelect(item: { id: string; name: string }) {
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
