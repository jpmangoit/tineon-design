import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ViewportScroller } from "@angular/common";
import { NotificationService } from 'src/app/service/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-community-messages',
    templateUrl: './community-messages.component.html',
    styleUrls: ['./community-messages.component.css']
})

export class CommunityMessagesComponent implements OnInit, OnDestroy {
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
    imageSrc: any;
    thumb: string;
    selectedChat: { count: number, id: number, image: string, members: ChatUsers[], name: string, type: string };
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
    filteredArray: any[] = [];
    @ViewChild('scrollBottom') private scrollBottom: ElementRef;
    @ViewChildren('item') itemElements: QueryList<any>;
    scrollContainer: any;
    isNearBottom: boolean = true;
    headline_word_option: number = 0;
    chatId: any


    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router, private themes: ThemeService,
        private route: ActivatedRoute,
        private scroller: ViewportScroller,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,

    ) {
        var getParamFromUrl = this.router.url.split("/")['2'];
        if (getParamFromUrl == 'personal-msg') {
            this.displayPersonal = true;

        } else if (getParamFromUrl == 'club-msg') {
            this.displayClub = true;

        } else if (getParamFromUrl == 'group-msg') {
            this.displayGroup = true;

        } else {
            this.displayChats = true;
        }
    }

    ngOnInit(): void {
        this.socket = io(serverUrl, { transports: ['websocket'] });

        this.route.queryParams.subscribe(params => {
            this.chatId = params.id;
        });

        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
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
                (error: any) => {
                    this.userDetails.image = null;
                });
        if (localStorage.getItem('backItem')) {
            if (localStorage.getItem('backItem') == 'personalMsg') {
                localStorage.removeItem('backItem');
                this.displayMessage('personal');
            } else if (localStorage.getItem('backItem') == 'clubMsg') {
                localStorage.removeItem('backItem');
                this.displayMessage('club');
            } else if (localStorage.getItem('backItem') == 'groupMsg') {
                localStorage.removeItem('backItem');
                this.displayMessage('group');
            }
        }
        if (this.userDetails.roles[0] == 'guest') {
            this.displayChats = false;
            this.displayPersonal = true;
            this.displayClub = false;
            this.displayGroup = false;
        }
        this.getAllUserInfo();
        this.chatForm = new UntypedFormGroup({
            'message': new UntypedFormControl('', [Validators.required,
            Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])
        });
        this.socket.on('firstusermsg', (msg: any) => {
            this.chats();
            this.authService.sendRequest('get', 'get-chat/' + this.roomId, '').subscribe((data) => {
                this.finalMessages = []
                this.finalMessages = data;
                if (this.finalMessages && this.finalMessages.length > 0) {
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
        } else {
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
                if (respData && respData.length > 0) {
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
                        // this.chats();
                        if (respData['isError'] == true) {
                            this.notificationService.showError(respData['message'], null);
                        } else {
                            this.groups = respData;
                            this.chats();

                        }
                    }
                );
        }
    }

    chats() {
        this.chatUserArr = [];
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userDetails.userId, '')
            .subscribe(
                (resp: any) => {

                    setTimeout(() => {
                        this.authService.setLoader(false);
                    }, 2000);
                    this.chatUserArr = resp
                    let grp: any;
                    if (this.chatUserArr && this.chatUserArr.length > 0) {
                        this.chatUserArr.forEach((element:any) => {
                            if (element.type == 'group') {

                                if (this.groups && this.groups.length > 0) {
                                    grp = this.groups.find((o: any) => o.id == element.id)
                                    element.name = grp ? grp.name : element.id
                                    element.image = grp.image ? grp.image : ''
                                    element.image = (grp.group_images[0]?.group_image) ? (grp.group_images[0]?.group_image) : ''
                                    if (element?.image) {
                                        element.image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.image.substring(20)));
                                    }
                                    if (element.id != 4) {
                                        element.lastMessage = JSON.parse(element.lastMessage)
                                        element.lastMsgTime = new Date(element.lastMessage.timestamp).toISOString();
                                        let cudate = new Date().toISOString().split('T')[0]
                                        let msgdate = element.lastMsgTime.split('T')[0]
                                        if (new Date(msgdate).getTime() == new Date(cudate).getTime()) {
                                            element.lastMsgTimming = element.lastMsgTime
                                        } else {
                                            element.lastMsgDate = msgdate
                                        }
                                    }
                                }
                            } else {
                                element.lastMessage = JSON.parse(element.lastMessage)
                                element.lastMsgTime = new Date(element.lastMessage.timestamp).toISOString();
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
                                            (error: any) => {
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
                    this.filteredArray = [...this.chatUserArr.sort((a: any, b: any) => Number(new Date(a.lastMessage.timestamp)) - Number(new Date(b.lastMessage.timestamp))).reverse()];

                    // if (this.chatId) {
                    //     let chatDetails = this.chatUserArr.filter(x => x.id == this.chatId);

                    //     if (chatDetails.length > 0) {
                    //         setTimeout(() => {
                    //             $("#chat-" + this.chatId).click();
                    //         }, 3000);
                    //     }

                    // }
                    if (this.chatId) {
                        let chatDetails = this.chatUserArr.filter(x => x.id == this.chatId && x.type == 'individual');
                        if (chatDetails.length > 0) {
                            setTimeout(() => {
                                this.clickChat(chatDetails[0])
                            }, 3000);
                        }
                    }
                    setTimeout(() => {
                        this.authService.setLoader(false);
                    }, 2000);

                }
            );
    }

    uploadFile(event: Event) {
        this.chatForm.controls['message'].clearValidators();
        this.chatForm.controls['message'].updateValueAndValidity();
        const file: File = event.target['files'][0];
        const mimeType: string = file.type;
        this.imageSrc = file;
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        var url: any;
        let self = this
        reader.onload = function (_event) {
            url = reader.result;
            var imagee: HTMLImageElement = new Image();
            imagee.src = URL.createObjectURL(file);
            imagee.onload = (e: any) => {
                //const imagee = e.path[0] as HTMLImageElement;
            }

            $('.message-upload-list').show();
            if (mimeType.match(/image\/*/)) {
                $('.preview_img').attr('src', url);
            } else {
                $('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
            }
            $('#selectedImage').modal('show');
            $('#selectedImage').modal({
                backdrop: 'static',
            });
        }
    }


    unselectImage() {
        this.imageSrc = '';
        this.chatForm.controls['message'].setValue('');
        this.chatForm.controls['message'].setValidators(Validators.required);
        this.chatForm.controls['message'].updateValueAndValidity();
        $('#selectedImage').modal('hide')
    }


    // clickChat(chat: { count: number, id: any, image: string, members: ChatUsers[], name: string, type: string }) {
    clickChat(chat: any) {
        $('html,body').animate({ scrollTop: document.body.scrollHeight }, "fast");
        this.selectedChat = chat;
        this.selectdChatCommonGroup = []
        if (this.selectedChat.count > 0) {
            this.readChat(this.selectedChat);
        }
        let count: number = 0;
        if (chat.type == 'individual') {
            this.getCommonGroups(chat.id);
            let userarr: string[] = [this.userDetails.userId, chat.id];
            userarr.sort();
            this.frndId = chat.id
            this.roomId = userarr[0] + ',' + userarr[1];
            let obj: { 'sender': string, 'room': string };
            obj = { 'sender': this.userDetails.userId, 'room': userarr[0] + ',' + userarr[1] }
            this.socket.emit('join', obj, (error: any) => {
            })
            this.socket.on('roomData', (roomData: any) => {
            })
            this.authService.sendRequest('get', 'get-chat/' + this.roomId, '').subscribe((data) => {
                this.finalMessages = []
                this.finalMessages = data;
                if (this.finalMessages && this.finalMessages.length > 0) {
                    this.finalMessages.forEach((element: any) => {
                        element.msg = JSON.parse(element.message);
                        if (element.receiver_id == this.userDetails.userId && element.msg.read == false) {
                            count++;
                        }
                    });
                }
                this.scrollToBottom();
            })
        } else if (chat.type == 'group') {
            this.frndId = chat.id;
            this.roomId = chat.id
            this.authService.sendRequest('get', 'getGroupParticipants/group/' + this.roomId, '').subscribe((data) => {
                this.groupUsers = data
                this.selectedChat.members = this.groupUsers.filter((o: any) => o.approved_status == 1);
                let obj: { 'sender': string, 'room': string };
                obj = { 'sender': this.userDetails.userId, 'room': chat.id }
                this.socket.emit('join', obj, (error: any) => {
                })
                this.socket.on('roomData', (roomData: any) => {
                })
                this.authService.sendRequest('get', 'get-chat/' + this.roomId, '').subscribe((data) => {
                    this.finalMessages = []
                    this.finalMessages = data;
                    if (this.finalMessages && this.finalMessages.length > 0) {
                        this.finalMessages.forEach((element: any) => {
                            element.sender = this.groupUsers.find((o: any) => o.id == JSON.parse(element.sender_id))
                            element.msg = JSON.parse(element.message);
                        });
                    }
                    this.scrollToBottom();
                })
            })
        }
        this.getMedia()
        $(".widget-app-content").removeClass("highlight");
        $("#chat-" + chat.id).addClass("highlight");
    }

    getMedia() {
        this.selectedChatMedia = [];
        if (this.finalMessages && this.finalMessages.length > 0) {
            this.finalMessages.forEach(element => {
                if (element.msg.messageType != 'text') {
                    this.selectedChatMedia.push(element.msg)
                }
            });
        }
    }

    readChat(chat) {
        let senderId = { 'id': chat.id, 'type': chat.type }
        this.authService.sendRequest('post', 'read-messages-mysql/' + this.userDetails.userId, senderId).subscribe((data) => {
            this.chats()
        })
    }

    getCommonGroups(chatId) {
        let userIds = { 'login_userId': this.userDetails.userId, 'chat_userId': chatId }
        this.authService.sendRequest('post', 'get-common-groups', userIds).subscribe((data) => {
            this.selectdChatCommonGroup = data
        })
    }

    deleteChat() {
        let roomDetails = { 'roomId': this.roomId }
        this.authService.sendRequest('post', 'delete-chat/' + this.userDetails.userId, roomDetails).subscribe((data) => {
            this.chats();
            this.selectedChat = null;
        })
    }

    displayMessage(msg) {
        if (msg == 'chat') {
            this.displayChats = true;
            this.displayPersonal = false;
            this.displayClub = false;
            this.displayGroup = false;
        } else if (msg == 'personal') {
            this.displayChats = false;
            this.displayPersonal = true;
            this.displayClub = false;
            this.displayGroup = false;
        } else if (msg == 'club') {
            this.displayChats = false;
            this.displayPersonal = false;
            this.displayClub = true;
            this.displayGroup = false;
        } else if (msg == 'group') {
            this.displayChats = false;
            this.displayPersonal = false;
            this.displayClub = false;
            this.displayGroup = true;
        }
    }

    messageProcess() {
        this.chatFormSubmitted = true;
        if ((sessionStorage.getItem('token')) && ((this.chatForm.valid) || (this.imageSrc))) {
            let reqData: object;
            if (this.chatForm.controls['message'].value == '' || this.chatForm.controls['message'].value == null) {
                $('#selectedImage').modal('hide')
                reqData = {
                    file: this.imageSrc,
                    friendUid: this.frndId,
                    currentUid: this.userDetails.userId,
                    roomId: this.roomId
                }
            } else {
                reqData = {
                    message: { 'message': this.chatForm.controls['message'].value },
                    friendUid: this.frndId,
                    currentUid: this.userDetails.userId,
                    roomId: this.roomId
                }
            }
            let self = this;
            var formData: FormData = new FormData();
            for (const key in reqData) {
                if (Object.prototype.hasOwnProperty.call(reqData, key)) {
                    const element: string = reqData[key];
                    if (key == 'file') {
                        formData.append('file', this.imageSrc);
                    } else if (key == 'message') {
                        formData.append('message', JSON.stringify(element));
                    } else {
                        if ((key != 'file') && (key != 'message')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'store-messages-mysql', formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.socket.emit('msgsent', formData, (error: any) => { });
                            this.responseMessage = respData['result'];
                            // this.notificationService.showSuccess(this.responseMessage,null);
                            this.imageSrc = null;
                            this.chatForm.reset();
                            this.chatFormSubmitted = false;
                            var self = this;
                            this.clickChat(this.selectedChat)
                            this.chats();
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                );
        }
    }

    previewImage(id: number, image: string) {
        this.viewImage[id] = true;
        this.preImage = image;
        $('#imagePriview').modal('show')
    }

    closePreviewImage() {
        $('#imagePriview').modal('hide')
    }

    /** To Search the user by filter */
    filterArray() {
        // No users, empty list.
        if (!this.chatUserArr && !this.chatUserArr.length) {
            this.filteredArray = [];
            return;
        }
        var input, filter;
        input = document.getElementById("myInput");
        filter = input.value;

        // no search text, all users.
        if (!filter) {
            this.filteredArray = [...this.chatUserArr]; // keep your chatUserArr immutable
            return;
        }
        const users = [...this.chatUserArr]; // keep your usersList immutable
        const properties = Object.keys(users[0]); // get user properties
        // check all properties for each user and return user if matching to searchText
        this.filteredArray = users.filter((user) => {
            return properties.find((property) => {
                const valueString = user[property]?.toString().toLowerCase();
                return valueString?.includes(filter.toLowerCase());
            }) ? user : null;
        });

    }

    ngAfterViewChecked() {
        if (this.finalMessages && this.finalMessages.length > 0) {
            this.scrollContainer = this.scrollBottom.nativeElement;
            this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
        }
    }

    private onItemElementsChanged(): void {
        if (this.isNearBottom) {
            this.scrollToBottom();
        }
    }

    scrollToBottom(): void {
        try {
            this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
        } catch (err) {console.log(err);
         }
    }

    private isUserNearBottom(): boolean {
        const threshold = 150;
        const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
        const height = this.scrollContainer.scrollHeight;
        return position > height - threshold;
    }

    scrolled(event: any): void {
        this.isNearBottom = this.isUserNearBottom();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
