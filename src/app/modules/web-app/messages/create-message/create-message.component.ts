import { Component, OnDestroy, OnInit } from '@angular/core';
import { appSetting } from '../../../../app-settings';
import { LanguageService } from '../../../../service/language.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { AuthorizationAccess, CreateAccess, ParticipateAccess, UserAccess } from 'src/app/models/user-access.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
declare var $: any;

@Component({
    selector: 'app-create-message',
    templateUrl: './create-message.component.html',
    styleUrls: ['./create-message.component.css']
})

export class CreateMessageComponent implements OnInit, OnDestroy {
    language: any;

    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    visiblityDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    userDropdownCCSettings: IDropdownSettings;
    userDropdownSettings: IDropdownSettings;
    userDropdownList: { 'id': string, 'name': string }[] = [];
    userDropdownCCList: { 'id': string, 'name': string }[] = [];
    alluserDetails: { firstname: string, lastname: string, email: string }[] = [];
    ccUser: number[] = [];
    responseMessage: string = null;
    messageForm: UntypedFormGroup;
    messageSubmitted: boolean = false;
    personalVisiable: boolean = true;
    groupVisiable: boolean = false;
    clubVisiable: boolean = false;
    groups: CommunityGroup[];
    teamId: number;
    setTheme: ThemeType;
    receiverUser: any[] = [];
    visiblity: { id: string, name: string }[] = [];
    alluserInformation: { firstname: string, lastname: string, email: string }[] = [];
    kindIds: number[] = [];
    selectedVisiblity: string;
    selectedKindId: number;
    files: string[] = [];
    receipientUsers: { approved_status: number, group_id: number, groupusers: { email: string, firstname: string, id: number, lastname: string, username: string }[], id: number, user_id: number }[] = [];
    alluserInfo: any;
    private activatedSub: Subscription;
    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private confirmDialogService: ConfirmDialogService,
        private router: Router,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,


    ) { }

    ngOnInit(): void {
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

        this.visiblity = [
            { "id": "personal", "name": this.language.create_message.personalMsg },
            { "id": "group", "name": this.language.create_message.groupMsg },
        ];

        if (this.createAccess.message == 'Yes') {
            this.visiblity.push({ "id": "club", "name": this.language.create_message.clubMsg })
        }

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

        this.messageForm = new UntypedFormGroup({
            'kind': new UntypedFormControl('', Validators.required),
            'receiver_id': new UntypedFormControl('', Validators.required),
            'subject': new UntypedFormControl('', Validators.required),
            'content': new UntypedFormControl('', Validators.required),
            'type': new UntypedFormControl('text'),
            'sender_id': new UntypedFormControl(this.userDetails.id),
            'file': new UntypedFormControl(''),
            'message_type': new UntypedFormControl('inbox'),
            'kind_id': new UntypedFormControl(''),
            'cc': new UntypedFormControl('')
        });
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
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.keycloak_id] = { firstname: val.firstname, lastname: val.lastname, email: val.email };
                            this.userDropdownList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
                            this.userDropdownCCList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
                        })
                    }
                    this.alluserDetails = respData;
                    this.alluserInfo = respData;
                    self.userDropdownSettings = {
                        singleSelection: false,
                        idField: 'id',
                        textField: 'name',
                        selectAllText: this.language.profile.select_all,
                        enableCheckAll: true,
                        unSelectAllText: 'UnSelect All',
                        allowSearchFilter: true,
                        searchPlaceholderText: this.language.header.search
                    };
                    self.userDropdownCCSettings = {
                        singleSelection: false,
                        idField: 'id',
                        textField: 'name',
                        selectAllText: this.language.profile.select_all,
                        enableCheckAll: false,
                        unSelectAllText: 'UnSelect All',
                        allowSearchFilter: true,
                        searchPlaceholderText: this.language.header.search
                    };
                }
            );
    }

    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'teamgroups/' + this.teamId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groups = respData;
                        this.groupDropdownSettings = {
                            singleSelection: true,
                            idField: 'id',
                            textField: 'name',
                            selectAllText: 'this.language.profile.select_all',
                            enableCheckAll: false,
                            unSelectAllText: 'UnSelect All',
                            allowSearchFilter: true,
                            searchPlaceholderText: this.language.header.search,
                            closeDropDownOnSelection: true
                        };
                    }
                );
        }
    }

    messageProcess() {
        this.messageSubmitted = true;
        if (this.messageForm.valid) {
            var formData: FormData = new FormData();
            this.messageForm.controls["kind"].setValue(this.selectedVisiblity);
            var uniqueReceiverUsers = this.authService.uniqueData(this.receiverUser);
            this.messageForm.controls["receiver_id"].setValue(uniqueReceiverUsers);

            var uniqueCcUser = this.authService.uniqueData(this.ccUser);
            this.messageForm.controls["cc"].setValue(uniqueCcUser);

            if (this.selectedKindId) {
                //var uniqueKindUser = this.authService.uniqueData(this.selectedKindId);
                this.messageForm.controls["kind_id"].setValue(this.selectedKindId);
            } else {
                this.messageForm.controls["kind_id"].setValue('');
            }
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
            let kindValue: string = this.messageForm.controls["kind"].value;

            if (kindValue == 'personal') {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('post', 'message/send', formData)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.messageSubmitted = false;
                            if (respData['isError'] == false) {
                                this.receipientUsers = [];
                                this.receiverUser = [];
                                this.ccUser = [];
                                this.notificationService.showSuccess(respData['result']['message'], null);
                                this.messageForm.reset();
                                this.messageForm.controls["kind"].setValue([]);
                                this.messageForm.controls["receiver_id"].setValue([]);
                                this.messageForm.controls["cc"].setValue([]);
                                $(".message_title").click();
                                setTimeout(() => {
                                    localStorage.setItem('backItem', 'personalMsg');
                                    const url: string[] = ["/community"];
                                    this.router.navigate(url);
                                }, 1000);
                            } else if (respData['code'] == 400) {
                                this.notificationService.showError(respData['message']['message'], null)
                            }
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
            } else if (kindValue == 'group') {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('post', 'message/send-group-message', formData)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.messageSubmitted = false;

                            if (respData['isError'] == false) {
                                this.receipientUsers = [];
                                this.receiverUser = [];
                                this.ccUser = [];
                                this.notificationService.showSuccess(respData['result'], null);
                                this.messageForm.controls["kind"].setValue([]);
                                this.messageForm.controls["kind_id"].setValue([]);
                                this.messageForm.reset();
                                $(".message_title").click();
                                setTimeout(() => {
                                    localStorage.setItem('backItem', 'groupMsg');
                                    const url: string[] = ["/community"];
                                    this.router.navigate(url);
                                }, 1000);
                            } else if (respData['code'] == 400) {
                                this.notificationService.showError(respData['message'], null);
                            }
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
            } else if (kindValue == 'club') {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('post', 'message/send-club-message', formData)
                    .subscribe(
                        (respData: any) => {
                            this.authService.setLoader(false);
                            this.messageSubmitted = false;
                            if (respData['isError'] == false) {
                                this.receipientUsers = [];
                                this.receiverUser = [];
                                this.ccUser = [];
                                this.notificationService.showSuccess(respData['result'], null);
                                this.messageForm.controls["kind"].setValue([]);
                                this.messageForm.controls["receiver_id"].setValue([]);
                                this.messageForm.controls["cc"].setValue([]);
                                this.messageForm.reset();
                                $(".message_title").click();
                                setTimeout(() => {
                                    localStorage.setItem('backItem', 'clubMsg');
                                    const url: string[] = ["/community"];
                                    this.router.navigate(url);
                                }, 1000);
                            } else if (respData['code'] == 400) {
                                this.notificationService.showError(respData['message'], null);
                            }
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
            }
        }
    }

    close() {
        let self = this;
        if (this.receiverUser.length > 0 || this.kindIds.length > 0 || this.kindIds.length > 0) {
            this.confirmDialogService.confirmThis(this.language.confirmation_message.save_msg_draft, function () {
                var formData: FormData = new FormData();
                self.messageForm.controls["kind"].setValue(self.selectedVisiblity);
                self.messageForm.controls["receiver_id"].setValue(self.receiverUser);
                self.messageForm.controls["cc"].setValue(self.ccUser);

                if (self.selectedKindId) {
                    self.messageForm.controls["kind_id"].setValue(self.selectedKindId);
                } else {
                    self.messageForm.controls["kind_id"].setValue(1);
                }

                self.messageForm.controls["message_type"].setValue('draft');
                for (const key in self.messageForm.value) {
                    if (Object.prototype.hasOwnProperty.call(self.messageForm.value, key)) {
                        const element: any = self.messageForm.value[key];
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

                let kindValue: string = self.messageForm.controls["kind"].value;
                if (kindValue == 'personal') {
                    self.authService.setLoader(true);
                    self.authService.memberSendRequest('post', 'message/send', formData)
                        .subscribe(
                            (respData: any) => {
                                self.authService.setLoader(false);
                                self.messageSubmitted = false;
                                if (respData['isError'] == false) {
                                    self.responseMessage = self.language.community_messages.email_draft;
                                    self.notificationService.showSuccess(self.responseMessage, null);
                                    setTimeout(() => {
                                        //   self.responseMessage = ''
                                        self.messageForm.reset();
                                    }, 3000);
                                    self.messageForm.controls["kind"].setValue([]);
                                    self.messageForm.controls["receiver_id"].setValue([]);
                                    self.messageForm.controls["cc"].setValue([]);
                                    $(".message_title").click();
                                    setTimeout(() => {
                                        localStorage.setItem('backItem', 'personalMsg');
                                        const url: string[] = ["/community"];
                                        self.router.navigate(url);
                                    }, 1000);
                                } else if (respData['code'] == 400) {
                                    self.responseMessage = respData['message'];
                                    self.notificationService.showError(self.responseMessage, null);
                                }
                            },
                            (err) => {
                                console.log(err);
                            }
                        );
                } else if (kindValue == 'group') {
                    self.authService.setLoader(true);
                    self.authService.memberSendRequest('post', 'message/send-group-message', formData)
                        .subscribe(
                            (respData: any) => {
                                self.authService.setLoader(false);
                                self.messageSubmitted = false;
                                if (respData['isError'] == false) {
                                    self.responseMessage = self.language.community_messages.email_draft;
                                    self.notificationService.showSuccess(self.responseMessage, null);
                                    self.messageForm.controls["kind"].setValue([]);
                                    self.messageForm.controls["kind_id"].setValue([]);
                                    self.messageForm.reset();
                                    $(".message_title").click();
                                    setTimeout(() => {
                                        localStorage.setItem('backItem', 'groupMsg');
                                        const url: string[] = ["/community"];
                                        self.router.navigate(url);
                                    }, 1000);
                                } else if (respData['code'] == 400) {
                                    self.responseMessage = respData['message'];
                                    self.notificationService.showError(self.responseMessage, null);
                                }
                            },
                            (err) => {
                                console.log(err);
                            }
                        );
                } else if (kindValue == 'club') {
                    self.authService.setLoader(true);
                    self.authService.memberSendRequest('post', 'message/send-club-message', formData)
                        .subscribe(
                            (respData: any) => {
                                self.authService.setLoader(false);
                                self.messageSubmitted = false;
                                if (respData['isError'] == false) {
                                    self.responseMessage = self.language.community_messages.email_draft;
                                    self.notificationService.showSuccess(self.responseMessage, null);
                                    self.messageForm.controls["kind"].setValue([]);
                                    self.messageForm.controls["receiver_id"].setValue([]);
                                    self.messageForm.controls["cc"].setValue([]);
                                    self.messageForm.reset();
                                    $(".message_title").click();
                                    setTimeout(() => {
                                        localStorage.setItem('backItem', 'clubMsg');
                                        const url: string[] = ["/community"];
                                        self.router.navigate(url);
                                    }, 1000);
                                } else if (respData['code'] == 400) {
                                    self.responseMessage = respData['message'];
                                    self.notificationService.showError(self.responseMessage, null)
                                }
                            },
                            (err) => {
                                console.log(err);
                            }
                        );
                }
            }, function () {
                self.router.navigate(['community']);
            });
        } else {
            self.router.navigate(['community']);
        }
    }

    onVisiblityDeSelect(item: { id: string, name: string }) {
        this.receipientUsers = [];
        this.receiverUser = [];
        this.ccUser = [];
        this.messageForm.controls["receiver_id"].setValue('');
        this.messageForm.controls["cc"].setValue('');
        this.messageForm.controls["kind_id"].setValue('');
    }

    onVisiblitySelect(item: { id: string, name: string }) {
        this.selectedVisiblity = item.id;
        this.receipientUsers = [];
        this.receiverUser = [];
        this.ccUser = [];
        if (this.selectedVisiblity == "personal") {
            this.messageForm.controls["kind_id"].clearValidators();
            this.messageForm.controls["receiver_id"].setValidators(Validators.required);
            this.messageForm.controls["receiver_id"].setValue('');
            this.messageForm.controls["cc"].setValue('');
            this.messageForm.controls["receiver_id"].updateValueAndValidity();
            this.personalVisiable = true;
            this.groupVisiable = false;
            this.clubVisiable = false;
        }
        else if (this.selectedVisiblity == "group") {
            this.messageForm.controls["receiver_id"].clearValidators();
            this.messageForm.controls["receiver_id"].setValue('');
            this.messageForm.controls["cc"].setValue('');
            this.messageForm.controls["kind_id"].setValidators(Validators.required);
            this.messageForm.controls["kind_id"].setValue('');
            this.messageForm.controls["kind_id"].updateValueAndValidity();
            this.personalVisiable = false;
            this.groupVisiable = true;
            this.clubVisiable = false;
        } else {
            this.messageForm.controls["kind_id"].clearValidators();
            this.messageForm.controls["receiver_id"].setValidators(Validators.required);
            this.messageForm.controls["receiver_id"].setValue('');
            this.messageForm.controls["cc"].setValue('');
            this.messageForm.controls["receiver_id"].updateValueAndValidity();
            this.personalVisiable = true;
            this.groupVisiable = false;
            this.clubVisiable = true;
        }
    }

    onKindIdSelect(item: { id: number, name: string }) {
        this.kindIds = [];
        this.selectedKindId = item.id;
        this.kindIds.push(this.selectedKindId);
        this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + this.selectedKindId, null)
            .subscribe(
                (respData: any) => {
                    if (respData[0].participants) {
                        respData[0].participants.forEach((element: any) => {
                            if (element.approved_status == 1) {
                                this.receipientUsers.push(element);
                                let obj = this.alluserInfo.find(o => o.id == element.user_id);
                                this.receiverUser.push(obj.keycloak_id);
                            }
                        })
                    }
                }
            )
    }

    onKindIdDeSelect(item: { id: number, name: string }) {
        this.selectedKindId = item.id;
        this.receipientUsers = [];
        const index: number = this.kindIds.indexOf(this.selectedKindId);
        if (index > -1) {
            this.kindIds.splice(index, 1);
        }
    }

    onReceiverSelect(item: { id: string; name: string }) {
        this.receiverUser.push(item.id);
    }

    onReceiverSelectAll(item: { id: string; name: string }) {
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const element = item[key];
                this.receiverUser.push(element.id);
            }
        }
    }

    onReceiverDeSelectAll(item: { id: string; name: string }) {
        this.receiverUser = [];
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

    onCCDeSelect(item: { 'id': number, 'name': string }) {
        const index = this.ccUser.indexOf(item.id);
        if (index > -1) {
            this.ccUser.splice(index, 1);
        }
    }

    uploadFile(event: Event) {
        const file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
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
                if (mimeType.match(/image\/*/)) {
                    $('.preview_img').attr('src', url);
                } else {
                    $('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
                }
            }
            $('.message-upload-list').show();
            $('.preview_txt').show();
            $('.preview_txt').text(file.name);
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
