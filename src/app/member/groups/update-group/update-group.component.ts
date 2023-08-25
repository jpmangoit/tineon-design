import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import {NgxImageCompressService} from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-group',
    templateUrl: './update-group.component.html',
    styleUrls: ['./update-group.component.css']
})

export class UpdateGroupComponent implements OnInit, OnDestroy {
    language: any;
    receiveData: any;
    submitted: boolean = false;
    updateGroupForm: UntypedFormGroup;
    userDetails: LoginDetails;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    file: File;
    fileToReturn: File
    showImage: any;
    groupData: CommunityGroup[];
    groupid: number;
    groupParticipant: { id: number, user_email: string, user_name: string }[] = [];
    showParticipants: boolean = false;
    participant: { id: number, user_email: string, user_name: string }[] = [];
    user_dropdown: { id: number, user_email: string, user_name: string }[] = [];
    participantSelectedItem: number[] = [];
    participantSelectedToShow: any[] = [];
    participantDropdownSettings: IDropdownSettings = {};
    participantList: { user_id: number, approved_status: number }[] = [];
    setTheme: ThemeType;
    thumb: any;
    alluserInformation = [];
    organizerDetails: any[] = [];
    private activatedSub: Subscription;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    group_img: string = '';


    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
    ) { }

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p',
        fonts: [
            {class: 'gellix', name: 'Gellix'},
        ],
        toolbarHiddenButtons: [
            [
                'link',
                'unlink',
                'subscript',
                'superscript',
                'insertUnorderedList',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode',
                'insertImage',
                'insertVideo',
                'italic',
                'fontSize',
                'undo',
                'redo',
                'underline',
                'strikeThrough',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
                'heading',
                'textColor',
                'backgroundColor',
                'customClasses',
                'insertOrderedList',
                'fontName'
            ]
        ]
    };

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
        this.getUsers();

        this.route.params.subscribe(params => {
            this.groupid = params['groupId'];
            setTimeout(function () {
                $('.trigger_class').trigger('click');
                $('#triggerr_class').trigger('click');
            }, 3000);
        });
        this.participantDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'user_name',
            allowSearchFilter: true,
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search
        };

        this.updateGroupForm = this.formBuilder.group({
            name: ['', [Validators.required, this.noWhitespace]],
            description: ['', Validators.required],
            add_image: ["null"],
            created_by: [localStorage.getItem('user-id')],
            team_id: [''],
            approved_status: [''],
            participants: ['', Validators.required]
        });
    }

    noWhitespace(control: UntypedFormControl) {
        if (control.value && control.value.length != 0) {
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
    * Function is used to get user details by team id
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} get all user list
    */
    getUsers() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userDetails.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.receiveData = respData;
                    if(respData?.length > 0){
                        Object(respData).forEach((val, key) => {
                            if (val.id != localStorage.getItem('user-id') && (val.role != 'guest')) {
                                this.participant.push({
                                    'id': val.id,
                                    'user_email': val.email,
                                    'user_name': val.firstname + " " + val.lastname + " (" + val.email + " )"
                                });
                                this.user_dropdown.push({
                                    'id': val.id,
                                    'user_email': val.email,
                                    'user_name': val.firstname + " " + val.lastname + " (" + val.email + " )"
                                });
                            }
                        });
                    }
                    this.setGroupData(this.groupid);
                }
            );
        }
    }

    /**
    * Function is used to get group information by id and set this value in form input fields
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} single group data
    */
    setGroupData(group_id: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.memberSendRequest('get', 'approvedGroupUsers/group/' + group_id, null).subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.groupData = respData[0];
                    console.log(this.groupData);

                    if (this.groupData?.['participants']?.length > 0) {
                        this.groupData['participants'].forEach((val, key) => {
                            let participant_id: number = val.user_id;
                            if (this.receiveData?.length > 0) {
                                this.receiveData.forEach((value, key) => {
                                    if ((value.id == participant_id)) {
                                        this.groupParticipant.push({
                                            'id': value.id,
                                            'user_email': value.email,
                                            'user_name': value.firstname + " " + value.lastname + " (" + value.email + " )"
                                        });
                                        this.participantSelectedItem.push(value.id);
                                        if (val.user_id != this.groupData['created_by']) {
                                            this.participantSelectedToShow.push({
                                                'id': value.id,
                                                'user_name': value.firstname + " " + value.lastname + " (" + value.email + " )",
                                                'approved_status': val.approved_status
                                            });
                                        }
                                        if(this.participantSelectedToShow?.length > 0){
                                            Object(this.participantSelectedToShow).forEach((valu, key) => {
                                                if (this.alluserInformation && this.alluserInformation[valu.id] && this.alluserInformation[valu.id].member_id != null) {
                                                    this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + this.alluserInformation[valu.id].member_id, null)
                                                        .subscribe(
                                                            (resppData: any) => {
                                                                this.thumb = resppData;
                                                                valu.image = this.thumb;
                                                            },
                                                            (error:any) => {
                                                                valu.image = null;
                                                            });
                                                } else {
                                                    valu.image = null;
                                                }
                                            });
                                        }
                                        if (val.user_id == this.groupData['created_by']) {
                                            this.organizerDetails.push(val);
                                            console.log(this.organizerDetails);

                                        }
                                    }
                                });
                            }
                        });
                        this.participantSelectedItem= this.authService.uniqueData(this.participantSelectedItem);
                        this.groupParticipant = Object.assign(this.authService.uniqueObjData(this.groupParticipant,'id'));
                        this.participantSelectedToShow = Object.assign(this.authService.uniqueObjData(this.participantSelectedToShow,'id'))

                        if (this.groupData['group_images'].length > 0 && this.groupData['group_images'][0]?.['group_image']){
                            this.group_img = this.groupData['group_images'][0]['group_image'];
                            this.groupData['group_images'][0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.groupData['group_images'][0]['group_image'].substring(20)));
                            this.showImage = this.groupData['group_images'][0]['group_image'];
                        }
                        this.showParticipants = true;
                        if (this.groupData) {
                            this.updateGroupForm.controls['name'].setValue(this.groupData['name']);
                            this.updateGroupForm.controls['description'].setValue(this.groupData['description']);

                            this.updateGroupForm.controls['add_image'].setValue(this.group_img);

                            this.updateGroupForm.controls['created_by'].setValue(this.groupData['created_by']);
                            this.updateGroupForm.controls['team_id'].setValue(this.groupData['team_id']);
                            this.updateGroupForm.controls['participants'].setValue(this.groupParticipant);
                            this.updateGroupForm.controls['approved_status'].setValue(this.groupData['approved_status']);
                        }
                    }else{
                        this.notificationService.showError(this.language.community_groups.no_groups,null);
                    }
                }
            );
            $('.trigger_class').trigger('click');
        }
    }

    /**
    * Function is used to update group and send data in formData formate in API
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} return success message
    */
    updateGroup() {
        this.submitted = true;
        if ((sessionStorage.getItem('token')) && (this.updateGroupForm.valid) && (!this.errorImage.isError)) {
            if(this.participantSelectedItem?.length > 0){
                this.participantSelectedItem.forEach((value, index) => {
                    let status: number = 0;
                    if (this.groupData['created_by'] == value) {
                        status = 1;
                        this.participantList.push({ 'user_id': value, 'approved_status': status });
                    } else {
                        this.participantList.push({ 'user_id': value, 'approved_status': status })
                    }
                });
            }
            this.updateGroupForm.get('participants').setValue(this.participantList);
            var formData: FormData = new FormData();
            for (const key in this.updateGroupForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.updateGroupForm.value, key)) {
                    const element: any = this.updateGroupForm.value[key];
                    if (key == 'add_image') {
                        formData.append('file', element);
                    }
                    if (key == 'participants') {
                        let self = this;
                        let ifAuthor = 0;
                        if(element && element.length > 0){
                            element.forEach(function (value, key) {
                                if (value.user_id == self.groupData['created_by']) {
                                    ifAuthor++;
                                }
                            });
                        }
                        if (ifAuthor == 0) {
                            element.push({ 'user_id': self.groupData['created_by'], 'approved_status': 1 });
                        }
                        var uniqueUsers = this.authService.uniqueData(element);
                        formData.append("participants", JSON.stringify(uniqueUsers));
                    }
                    else {
                        if (key != 'add_image')
                            formData.append(key, element);
                    }
                }
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'updateGroup/' + this.groupid, formData)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'],null);
                        var self = this;
                        var redirectUrl = 'group-detail/' + this.groupid;
                            self.router.navigate([redirectUrl]);
                    }else  if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            );
        }
    }

    /**
    * Function is used to select Participant
    * @author  MangoIt Solutions
    * @param   {}
    * @return {}
    */
    onParticipantSelect(item: any) {
        this.showParticipants = true;
        this.participantSelectedToShow.push(item);
        this.participantSelectedItem.push(item.id);
    }

    /**
    * Function is used to DeSelect Participant
    * @author  MangoIt Solutions
    * @param   {}
    * @return {}
    */
    onParticipantDeSelect(item: any) {
        this.participantSelectedToShow.forEach((value, index) => {
            if (value.id == item.id) {
                this.participantSelectedToShow.splice(index, 1);
            }
        });
        this.participantSelectedItem.forEach((value, index) => {
            if (value == item.id) {
                this.participantSelectedItem.splice(index, 1);
            }
        });
    }

    /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    uploadFile(event: Event) {
        var file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
            const mimeType: string = file.type;
            if (mimeType.match(/image\/*/) == null) {
                this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 2000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event)
            }
        }
    }

    fileChangeEvent(event: Event): void {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        this.imageChangedEvent = event;
        this.file = (event.target as HTMLInputElement).files[0];
        var mimeType: string = this.file.type;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
        }
        const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                this.imgWidth = img.width;
                this.imgHeight = img.height;
                };
                img.src = reader.result as string;
            };
        reader.readAsDataURL(this.file);
    }

    /**
    * Function is used to cropped and compress the uploaded image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} file object
    */

    imageCropped(event: ImageCroppedEvent) {
        let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage,-1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile( compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.updateGroupForm.patchValue({ add_image: this.fileToReturn });
                    this.updateGroupForm.get('add_image').updateValueAndValidity();
                    $('.preview_txt').show(this.fileToReturn.name);
                    $('.preview_txt').text(this.fileToReturn.name);
                }
            );
    }

    imageLoaded() {
    }

    cropperReady() {
        /* cropper ready */
        this.isImage = false;
    }

    loadImageFailed() {
        /* show message */
    }

    onCancel() {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
