import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router , ActivatedRoute} from '@angular/router';
import { appSetting } from 'src/app/app-settings';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { serverUrl } from 'src/environments/environment';
import { io, Socket } from "socket.io-client";
import { Extentions } from 'src/app/models/extentions.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { ChatUsers, UserMessages } from 'src/app/models/chat-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';

declare var $: any;

@Component({
    selector: 'app-mchat-list', 
    templateUrl: './mchat-list.component.html',
    styleUrls: ['./mchat-list.component.css'] 
})
export class MchatListComponent implements OnInit {
    @Input() ischatData: any;
    language: any;
    alluserDetails: any = [];
    userDetails: LoginDetails;
    chatHistoryForm: UntypedFormGroup;
    displayChats: boolean = false;
    displayPersonal: boolean = false;
    displayClub: boolean = false;
    displayGroup: boolean = false;
    private activatedSub: Subscription;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    teamId: number;
    chatForm: UntypedFormGroup;
    chatFormSubmitted: boolean = false;
    alluserInformation: { member_id: number }[] = [];
    docExt: string[] = [];
    extArr: string[] = [];
    fileNameArr: string[] = [];
    extensions: any;
    viewImage: boolean[] = [];
    preImage: string;
    setTheme: ThemeType;
    groups: CommunityGroup[];
    roomId: string;
    socket: Socket;
    responseMessage: string;
    imageSrc: File;
    thumb: string;
    selectedChat: { count: number, id: number, image: string, members: ChatUsers[], name: string, type: string };
    chatInfo:  { count: number, id: any, image: string, members: ChatUsers[], name: string, type: string };
    chatUserArr: {
        lastMsgTime: string;
        lastMsgDate: string;
        lastMsgTimming: string;
        lastMessage: any; count: number, id: number, image: string, name: string, type: string
    }[];
    selectedChatMedia = []
    selectdChatCommonGroup = []
    frndId: number;
    finalMessages: UserMessages[] = []
    groupUsers: ChatUsers[] = [];
    menuOpened: boolean = true;
    chatData:any;
    chatId:any
    constructor(
        private lang: LanguageService,private notificationService: NotificationService,
        private authService: AuthServiceService, private themes: ThemeService,
        private _router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
    ) {
    }

    ngOnInit(): void {
          if(this.ischatData == true){
            this.chatData = undefined
          }
        this.socket = io(serverUrl, { transports: ['websocket'] });
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.route.queryParams.subscribe(params => {
            this.chatId = params.id;
        });

        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.userDetails.member_id, null)
            .subscribe(
                (resppData: any) => {
                    this.thumb = resppData;
                    this.userDetails.image = this.thumb;
                },
                (error:any) => {
                    this.userDetails.image = null;
                });

        this.getAllUserInfo();

        this.socket.on('firstusermsg', (msg: any) => {
            this.chats();
            this.authService.sendRequest('get', 'get-chat/' + this.roomId, '').subscribe((data) => {
                this.finalMessages = []
                this.finalMessages = data;
                if(this.finalMessages && this.finalMessages.length > 0){
                    this.finalMessages.forEach((element: any) => {
                        element.msg = JSON.parse(element.message);
                        if (this.groupUsers) {
                            element.sender = this.groupUsers.find((o: any) => o.id == JSON.parse(element.sender_id))
                        }
                    });
                }
            })
        })
    }

    noWhitespace(control: UntypedFormControl) {
        if (control.value.length != 0) {
            let isWhitespace: boolean = (control.value || '').trim().length === 0;
            let isValid: boolean = !isWhitespace;
            return isValid ? null : { 'whitespace': true }
        }
        else {
            let isValid: boolean = true;
            return isValid ? null : { 'whitespace': true }
        }
    }

    /**
   * Function to get all the Club Users
   * @author  MangoIt Solutions
   * @param   {}
   * @return  {Array Of Object} all the Users
   */
    getAllUserInfo() {
        let self = this;
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.alluserDetails = respData;
                    if(respData && respData.length > 0){
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                    }
                    this.getGroup();
                }
            );
    }

    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'web/get-groups-by-user-id/' + this.userDetails.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.chats();
                        if (respData['isError'] == true) {
                            this.notificationService.showError(respData['result']['message'],null);
                        } else {
                            this.groups = respData;
                            this.groups.forEach((element:any) => {
                                if ( element?.['group_images'][0]?.group_image) {
                                    element['group_images'][0].group_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl( element?.['group_images'][0].group_image.substring(20)));
                                }
                            })
                        }
                    }
                );
        }
    }

    chats() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userDetails.userId, '')
        .subscribe(
            (resp: any) => {
                setTimeout(() => {
                    this.authService.setLoader(false);
                }, 2000);
                this.chatUserArr = resp;
                let grp: any;
                if(this.chatUserArr && this.chatUserArr.length > 0){
                    this.chatUserArr.forEach(element => { 
                        if (element.type == 'group') {                                                 
                            if (this.groups && this.groups.length > 0) {
                                grp = this.groups.find((o: any) => o.id == element.id);
                                element.name = grp ? grp.name : element.id
                                element.image = (grp.group_images[0]?.group_image) ? (grp.group_images[0]?.group_image) : ''
                                element.lastMessage = JSON.parse(element.lastMessage)
                                element.lastMsgTime = (element?.lastMessage?.timestamp) ? new Date(element.lastMessage.timestamp).toISOString() :  new Date().toISOString().split('T')[0];
                                let cudate = new Date().toISOString().split('T')[0]
                                let msgdate = (element?.lastMsgTime) ? element.lastMsgTime.split('T')[0]: new Date().toISOString().split('T')[0];
                                if (new Date(msgdate).getTime() == new Date(cudate).getTime()) {
                                    element.lastMsgTimming = element.lastMsgTime
                                } else {
                                    element.lastMsgDate = msgdate
                                }
                            }
                        } else {
                            element.lastMessage = JSON.parse(element.lastMessage)
                            element.lastMsgTime = new Date(element.lastMessage.timestamp).toISOString()
                            let cudate = new Date().toISOString().split('T')[0]
                            let msgdate = element.lastMsgTime.split('T')[0]
                            if (new Date(msgdate).getTime() == new Date(cudate).getTime()) {
                                element.lastMsgTimming = element.lastMsgTime
                            } else {
                                element.lastMsgDate = msgdate
                            }
                            if (this.alluserInformation[element.id].member_id != null) {
                                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[element.id].member_id, null)
                                    .subscribe(
                                        (resppData: any) => {
                                            this.thumb = resppData;
                                            element.image = this.thumb;
                                        },
                                        (error:any) => {
                                            element.image = null;
                                        });
                            } else {
                                element.image = null;
                            }
                        }
                    });
                }
                if (this.selectedChat && this.chatUserArr) {
                    let found = this.chatUserArr.find(o => o.id == this.selectedChat.id)
                    if (found && found.count > 0 && this.selectedChat) {
                        this.readChat(this.selectedChat);
                    }
                }
                this.chatUserArr = this.chatUserArr.sort((a: any, b: any) => Number(new Date(a.lastMessage.timestamp)) - Number(new Date(b.lastMessage.timestamp))).reverse()
                if(this.chatId){

                    let chatDetails = this.chatUserArr.filter(x => x.id == this.chatId);
                    if(chatDetails.length > 0){
                        setTimeout(() => {
                            $("#chat-"+this.chatId).click();
                        }, 3000);
                    }

                }
            }

        );

    }

    readChat(chat) {
        let senderId = { 'id': chat.id, 'type': chat.type }
        this.authService.sendRequest('post', 'read-messages-mysql/' + this.userDetails.userId, senderId).subscribe((data) => {
            this.chats()
        })
    }

    clickChat(chat: { count: number, id: any, image: string, members: ChatUsers[], name: string, type: string },event:any) {
        this.chatData = ''
        this.chatData = chat
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
