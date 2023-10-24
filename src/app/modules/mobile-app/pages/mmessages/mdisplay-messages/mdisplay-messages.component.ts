import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { element } from 'protractor';
import {LoginDetails, PersonalMessagesType, ThemeType, UserDetails} from '@core/models';
import {AuthServiceService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';
import {appSetting} from '@core/constants';

declare var $: any;

@Component({
    selector: 'app-mdisplay-messages',
    templateUrl: './mdisplay-messages.component.html',
    styleUrls: ['./mdisplay-messages.component.css']
})
export class MdisplayMessagesComponent implements OnInit {
    @Input() messageData: any;

    language: any;
    searchSentenceForm: UntypedFormGroup;
    replyMsgForm: UntypedFormGroup;
    messageForm: UntypedFormGroup;
    replyMsgFormError: any = [];
    replyMsgSubmitted: boolean = false;
    responseMessage: string = null;
    personalInbox: boolean = false;
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

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder, private themes: ThemeService,
        private confirmDialogService: ConfirmDialogService, private notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
        if (this.messageData.messageType == 'personalInbox') {
            this.clickMessages(this.messageData.id, this.messageData.messages)
            this.personalInbox = true
        } else if (this.messageData.messageType == 'personalStarred') {
            this.clickMessages(this.messageData.id, this.messageData.messages)
            this.personalStarred = true
        } else if (this.messageData.messageType == 'personalSent') {
            this.clickMessages(this.messageData.id, this.messageData.messages)
            this.personalSent = true
        } else if (this.messageData.messageType == 'personalDrafts') {
            this.clickDraftMessages(this.messageData.id, this.messageData.messages)
            this.personalDrafts = true
        } else if (this.messageData.messageType == 'personalAllMail') {
            this.clickMessages(this.messageData.id, this.messageData.messages)
            this.personalAllMail = true
        } else if (this.messageData.messageType == 'personalTrash') {
            this.clickMessages(this.messageData.id, this.messageData.messages)
            this.personalTrash = true
        }

        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.extensions = appSetting.extensions;
        this.imageType = appSetting.imageType;
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
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.keycloak_id] = { member_id: val.member_id };
                            this.alluserDetails[val.keycloak_id] = { firstname: val.firstname, lastname: val.lastname, email: val.email };
                            this.userDropdownList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
                            this.userDropdownCCList.push({ 'id': val.keycloak_id, 'name': val.firstname + ' ' + val.lastname });
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
                    this.userDropdownCCSettings = {
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
                    this.notificationService.showSuccess(this.language.community_messages.move_starreds, null);
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
                    this.notificationService.showSuccess(this.language.community_messages.move_inbox, null);
                    let selectedTab = $('.feature_tab .active a').text().trim();
                }
            )
    }

    clickMessages(id: number, data: any) {
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $(".widget-app-content").removeClass("highlight");
        this.selectedMessage = [];
        if (data && data.length > 0) {
            data.forEach((val, index) => {
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

    clickDraftMessages(id: number, data: any) {
        this.isReplyMsgForm = false;
        this.visiblityDropdownSettings = {};
        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.selectedMessage = [];
        this.authService.setLoader(true);
        this.replyMsgSubmitted = false;
        $(".widget-app-content").removeClass("highlight");
        this.selectedMessage = [];
        if (data && data.length > 0) {
            data.forEach((val, index) => {
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
                        //     this.responseMessage = '';
                        // }, 2000);;
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
                        let selectedTab: any = $('.feature_tab .active a').text().trim();
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
                                this.notificationService.showSuccess(respData.result, null);
                            } else {
                                this.notificationService.showError(respData.result, null);
                            }
                            this.replyMsgForm.reset();
                            this.isReplyMsgForm = false;
                            let selectedTab: any = $('.feature_tab .active a').text().trim();
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
                            let selectedTab: any = $('.feature_tab .active a').text().trim();

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
            this.authService.memberSendRequest('post', 'message/send', formData)
                .subscribe(
                    (respData: any) => {
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
                                    }
                                )
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

    deleteDraftMessages(messageId: number, esdb_id: string) {
        this.isReplyMsgForm = false;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.permanently_delete_msg, () => {
            this.selectedMessage = [];
            this.authService.setLoader(true);
            this.authService.memberSendRequest('delete', 'message/delete-draft/' + messageId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.responseMessage = this.language.community_messages.permanently_delete;
                        this.notificationService.showError(this.responseMessage, null);
                        let selectedTab = $('.feature_tab .active a').text().trim();
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

    back() {
        this.messageData = undefined
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
