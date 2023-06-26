import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { MatSidenav } from '@angular/material/sidenav';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-mchat',
    templateUrl: './mchat.component.html',
    styleUrls: ['./mchat.component.css']
})

export class MchatComponent implements OnInit {
    @Input() chat: any;
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
    selectedChat: any;
    chatUserArr: {
        lastMsgTime: string;
        lastMessage: any; count: number, id: number, image: string, name: string, type: string
    }[];
    selectedChatMedia = []
    selectdChatCommonGroup = []
    frndId: number;
    finalMessages: UserMessages[] = []
    groupUsers: ChatUsers[] = [];
    menuOpened: boolean = true;
    show: boolean = false;
    @ViewChild('scrollBottom') private scrollBottom: ElementRef;
    @ViewChildren('item') itemElements: QueryList<any>;
    scrollContainer: any;
    isNearBottom: boolean = true;
    @ViewChild('drawer') public sidenav: MatSidenav;

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,private notificationService: NotificationService,
        public formBuilder: UntypedFormBuilder,
        private router: Router, private themes: ThemeService
    ) {
    }

    ngOnInit(): void {
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
        this.chatForm = new UntypedFormGroup({
            'message': new UntypedFormControl('', [Validators.required,
            Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])
        });
        this.socket.on('firstusermsg', (msg: any) => {
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
        this.required(this.chat)
    }

    required(chat: any) {
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
            this.selectedChatMedia = [];
            this.authService.sendRequest('get', 'get-chat/' + this.roomId, '').subscribe((data) => {
                this.finalMessages = []
                this.finalMessages = data;
                if(this.finalMessages && this.finalMessages.length > 0){
                    this.finalMessages.forEach((element: any) => {
                        element.msg = JSON.parse(element.message);
                        if (element.receiver_id == this.userDetails.userId && element.msg.read == false) {
                            count++;
                        }
                        if (element.msg.messageType != 'text') {
                            this.selectedChatMedia.push(element.msg)
                        }
                    });
                }
            })

        } else if (chat.type == 'group') {
            this.frndId = chat.id;
            this.roomId = chat.id
            this.selectedChatMedia = [];
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
                    if(this.finalMessages && this.finalMessages.length > 0){
                        this.finalMessages.forEach((element: any) => {
                            element.sender = this.groupUsers.find((o: any) => o.id == JSON.parse(element.sender_id))
                            element.msg = JSON.parse(element.message);
                            if (element.msg.messageType != 'text') {
                                this.selectedChatMedia.push(element.msg)
                            }
                        });
                    }

                })
            })
        }

        this.selectedChatMedia = [];
        if(this.finalMessages && this.finalMessages.length > 0){
            this.finalMessages.forEach(element => {
                if (element.msg.messageType != 'text') {
                    this.selectedChatMedia.push(element.msg)
                }
            });
        }
        $(".widget-app-content").removeClass("highlight");
        $("#chat-" + this.chat.id).addClass("highlight");
    }

    readChat(chat) {
        let senderId = { 'id': chat.id, 'type': chat.type }
        this.authService.sendRequest('post', 'read-messages-mysql/' + this.userDetails.userId, senderId).subscribe((data) => {
        })
    }

    getCommonGroups(chatId) {
        let userIds = { 'login_userId': this.userDetails.userId, 'chat_userId': chatId }
        this.authService.sendRequest('post', 'get-common-groups', userIds).subscribe((data) => {
            this.selectdChatCommonGroup = data
        })
    }

    getMedia() {
        this.selectedChatMedia = [];
        if(this.finalMessages && this.finalMessages.length > 0){
            this.finalMessages.forEach(element => {
                if (element.msg.messageType != 'text') {
                    this.selectedChatMedia.push(element.msg)
                }
            });
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
                            this.socket.emit('msgsent', formData, (error: any) => {
                            });
                            //this.notificationService.showSuccess(respData['result']['message'],null);
                            this.imageSrc = null;
                            this.chatForm.reset();
                            this.chatFormSubmitted = false;
                            var self = this;
                            this.required(this.selectedChat)
                        }else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                );
        }
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
    }

    unselectImage() {
        this.imageSrc ='';
        this.chatForm.controls['message'].setValue('');
        this.chatForm.controls['message'].setValidators(Validators.required);
        this.chatForm.controls['message'].updateValueAndValidity();
        $('#selectedImage').modal('hide')
    }

    back() {
        this.sidenav.close();
        this.finalMessages = []
        this.chat = undefined
        this.show = true
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
        } catch (err) { }
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

    isShowing: boolean = false
    toggle() {
        this.sidenav.close();
    }

}
