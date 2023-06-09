import { Component, OnDestroy, OnInit } from '@angular/core';
import { appSetting } from '../../app-settings';
import { LanguageService } from '../../service/language.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../service/auth-service.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { io, Socket } from "socket.io-client";
import { serverUrl } from 'src/environments/environment';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { LoginDetails, UserDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-create-chat',
    templateUrl: './create-chat.component.html',
    styleUrls: ['./create-chat.component.css']
})

export class CreateChatComponent implements OnInit, OnDestroy {
    language: any;
    alluserDetails: any[] = [];
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    messageSubmitted: boolean = false;
    chatFormSubmitted: boolean = false;
    personalVisiable: boolean = true;
    groupVisiable: boolean = false;
    clubVisiable: boolean = false;
    clubChatVisible: boolean = false;
    groupChatVisible: boolean = false;
    visiblityDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    userDropdownList: { id: number, name: string }[] = [];
    files: string[] = [];
    responseMessage: string = null;
    messageForm: UntypedFormGroup;
    chatForm: UntypedFormGroup;
    groups: CommunityGroup[];
    selectedVisiblity: string;
    visiblity: { id: string, name: string }[] = [];
    alluserInformation: { firstname: string, lastname: string, email: string }[] = [];
    receipientUsers: { approved_status: number, group_id: number, groupusers: { email: string, firstname: string, id: number, lastname: string, username: string }[], id: number, user_id: number }[] = [];
    teamId: number;
    roomId: string;
    clubChatUsers: number[] = [];
    groupSelected: number[] = [];
    socket: Socket;
    frndId: number;
    imageSrc: File;
    chatUserArr: UserDetails[] = [];
    setTheme: ThemeType;
    obj: { 'sender': string, 'room': string };
    private activatedSub: Subscription;

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private confirmDialogService: ConfirmDialogService,
        private router: Router,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.socket = io(serverUrl);
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        let userRole: string = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        this.getGroup();
        this.getAllUserInfo();

        this.chatForm = new UntypedFormGroup({
            'kind': new UntypedFormControl('', Validators.required),
            'currentUid': new UntypedFormControl(this.userDetails.userId),
            'friendUid': new UntypedFormControl(''),
            'groupId': new UntypedFormControl(''),
            'message': new UntypedFormControl('', Validators.required)
        });
        this.visiblity = [
            { "id": "personal", "name": this.language.create_chat.personal_chat },
            { "id": "group", "name": this.language.create_chat.group_chat },
        ];

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
    }

    /**
     * Funtion to display all the chats
     * @author  MangoIt Solutions
     * @returns {Object} users chats
     */
    chats() {
        let self = this;
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userDetails.userId, '')
            .subscribe(
                (resp: any) => {
                    this.authService.setLoader(false);
                    this.chatUserArr = resp;
                    this.userDropdownList = [];
                    var userData: UserDetails[];
                    if (this.chatUserArr.length > 0) {
                        userData = this.alluserDetails.filter(entry1 => !this.chatUserArr.some(entry2 => entry1.id == entry2.id || entry1.id == this.userDetails.userId));
                    } else {
                        userData = this.alluserDetails.filter(o => o.id != this.userDetails.userId)
                    }
                    if (userData && userData.length > 0) {
                        Object(userData).forEach((val, key) => {
                            this.userDropdownList.push({ 'id': val.id, 'name': val.firstname + ' ' + val.lastname });
                            self.userDropdownSettings = {
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
                    let groupData: CommunityGroup[];
                    if (this.chatUserArr.length > 0) {
                        groupData = this.groups.filter(entry1 => !this.chatUserArr.some(entry2 => entry1.id == entry2.id));
                    } else {
                        groupData = this.groups;
                    }
                    this.groups = groupData
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
                }
            );
    }

    close() {
        window.history.back();
    }

    /**
     * Funtion is used to select visiblity
     * @author  MangoIt Solutions
     */

    onVisiblitySelect(item: { id: string, name: string }) {
        this.selectedVisiblity = item.id;
        if (this.selectedVisiblity == "personal") {
            this.personalVisiable = true;
            this.groupVisiable = false;
            this.clubVisiable = false;
            this.clubChatVisible = true;
            this.groupChatVisible = false;
            if (this.chatForm.contains('groupId')) {
                this.chatForm.removeControl('groupId');
                this.chatForm.addControl('friendUid', this.formBuilder.control('', [Validators.required]));
            }

        } else if (this.selectedVisiblity == "group") {
            this.personalVisiable = false;
            this.groupVisiable = true;
            this.clubVisiable = false;
            this.clubChatVisible = false;
            this.groupChatVisible = true;
            if (this.chatForm.contains('friendUid')) {
                this.chatForm.removeControl('friendUid');
                this.chatForm.addControl('groupId', this.formBuilder.control('', [Validators.required]));
            }

        } else {
            this.personalVisiable = true;
            this.groupVisiable = false;
            this.clubVisiable = true;
        }
    }

    onVisiblityDeSelect(item: { id: string, name: string }) {
    }

    /**
    * Function to get all the Club Users
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the Users
    */
    getAllUserInfo() {
        let self = this;
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.keycloak_id] = { firstname: val.firstname, lastname: val.lastname, email: val.email };
                            this.alluserDetails = respData;
                        });
                        this.chats();
                    }
                }
            );
    }

    /**
    * Function to get all the Groups
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {Array Of Object} all the Groups
    */
    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'web/get-groups-by-user-id/' + this.userDetails.userId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groups = respData;
                        this.chats();
                    }
                );
        }
    }

    /**
     * Funtion to used select friend
     * @author  MangoIt Solution
     */

    onFriendSelect(item: { id: any, name: string }) {
        this.clubChatUsers.push(item.id);
        let userarr: number[] = [this.userDetails.userId, item.id];
        userarr.sort();
        this.frndId = item.id
        this.roomId = userarr[0] + ',' + userarr[1];
        this.obj = { 'sender': this.userDetails.userId, 'room': userarr[0] + ',' + userarr[1] }
        this.socket.emit('join', this.obj, (error: any) => {
        })
        this.socket.on('roomData', (roomData: any) => {
        })
    }

    /**
    * Funtion to used sde elect friend
    * @author  MangoIt Solution
    */
    onFriendDeSelect(item: { id: number, name: string }) {
        if (this.clubChatUsers && this.clubChatUsers.length > 0) {
            this.clubChatUsers.forEach((value, index) => {
                if (value == item.id) {
                    this.clubChatUsers.splice(index, 1);
                }
            });
        }
    }

    /**
    * Funtion to used select group
    * @author  MangoIt Solution
    */
    onGroupSelect(item: { id: any, name: string }) {
        this.groupSelected.push(item.id);
        this.frndId = item.id;
        this.roomId = item.id
        this.obj = { 'sender': this.userDetails.userId, 'room': item.id }
        this.socket.emit('join', this.obj, (error: any) => {
        })
        this.socket.on('roomData', (roomData: any) => {
        })
    }

    /**
    * Funtion to used de select group
    * @author  MangoIt Solution
    */
    onGroupDeSelect(item: { id: any, name: string }) {
        if (this.groupSelected && this.groupSelected.length > 0) {
            this.groupSelected.forEach((value, index) => {
                if (value == item.id) {
                    this.groupSelected.splice(index, 1);
                }
            });
        }
    }

    /**
    * Funtion to used upload file
    * @author  MangoIt Solution
    */
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
            }
        }
    }

    /**
    * Funtion to used for sending  and store messages
    * @author  MangoIt Solution
    */
    messageProcess() {
        this.chatFormSubmitted = true;
        if ((sessionStorage.getItem('token')) && (this.chatForm.valid)) {

            let reqData: object;
            if (this.chatForm.controls['message'].value == '' || this.chatForm.controls['message'].value == null) {
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
                    }
                    else {
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
                            this.notificationService.showSuccess(respData['result'], null);
                            this.imageSrc = null;
                            this.chatForm.reset();
                            this.chatFormSubmitted = false;
                            var self = this;
                            setTimeout(function () {
                                self.router.navigate(['community']);
                            }, 2000);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                );
        }
    }

    onFileChange(event: Event) {
        for (var i = 0; i < event.target['files'].length; i++) {
            this.files.push(event.target['files'][i]);
        }
    }

    onCancel() {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
