import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import { Survey } from 'src/app/models/language.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LanguageService } from 'src/app/service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { AuthServiceService } from '../../../service/auth-service.service';
import { io, Socket } from "socket.io-client";
import { serverUrl } from 'src/environments/environment';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-servey',
    templateUrl: './update-servey.component.html',
    styleUrls: ['./update-servey.component.css'],
})

export class UpdateServeyComponent implements OnInit, OnDestroy {
    language: any;
    surveyDetails: Survey;
    updateServeyForm: UntypedFormGroup;
    formSubmit: boolean = false;
    TypeDropdownSettings: IDropdownSettings;
    groupTypeDropdownSettings: IDropdownSettings;
    surveyType: string;
    TypeDropdownList: { item_id: string, item_text: string }[];
    groupTypeDropdownList: { id: number, name: string }[] = []; 
    selectedGroup: number[] = [];
    choiceData: { name: string, value: number, noti_id: any }[];
    teamId: number;
    surveyId: number;
    surveyTypeValue: string
    groupData: { id: number, name: string }[] = [];
    finalSurveyNotify: number[];
    surveynotify: any = [];
    type: { item_id: string, item_text: string }[] = [];
    surveyVoteResult: { TotalCount: number, answerCount: { AnswerId: number, count: number }, result: Survey, userCount: number };
    setTheme: ThemeType;
    voteResult: number;
    btnDisable: string;
    socket: Socket;
    private activatedSub: Subscription;
    file: File;
    fileToReturn: File;
    croppedImage: string = '';
    imageChangedEvent: Event = null;
    image: File
    isImage: boolean = false;
    hasPicture: boolean = false;
    showImage: string;
    originalImage: string;
    showFile: string;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
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
        ],
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p'
    };
    imgHeight: any;
    imgWidth: any;
    minDate: any;

    constructor(private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private route: ActivatedRoute,
        private themes: ThemeService,
        private notificationService: NotificationService,
        public navigation: NavigationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,
        ) { }

    ngOnInit(): void {
        this.authService.setLoader(false);
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
        let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        this.socket = io(serverUrl);
        this.teamId = userData.team_id;
        this.language = this.lang.getLanguaageFile();

        this.getGroups();
        this.route.params.subscribe(params => {
            this.surveyId = params['surveyId'];
            this.getSurveyInfo(this.surveyId);
            setTimeout(function () {
                $('.trigger_class').trigger('click');
            }, 3000);
        });

        this.choiceData = [
            { name: this.language.Survey.web_notification, value: 1, noti_id: '' },
            { name: this.language.Survey.email_notification, value: 2, noti_id: '' },
        ];

        this.updateServeyForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', Validators.required],
            surveyOption: ['', Validators.required],
            surveyType: ['', Validators.required],
            groupType: ['', Validators.required],
            surveyStartDate: ['', Validators.required],
            surveyEndDate: ['', Validators.required],
            surveyViewOption: ['',],
            additional_anonymous_voting: ['',],
            additional_cast_vote: ['',],
            surveyNotificationOption: this.formBuilder.array([],),
            survey_Answers: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
            image: [''],
        });

        this.TypeDropdownList = [
            { item_id: "Group", item_text: this.language.header.group },
            { item_id: "All Club", item_text: this.language.Survey.all_club },
        ],

            this.TypeDropdownSettings = {
                singleSelection: true,
                idField: 'item_id',
                textField: 'item_text',
                enableCheckAll: false,
                closeDropDownOnSelection: true
            }
        this.addAnswerOptions()
    }

    get survey_Answers() {
        return this.updateServeyForm.get('survey_Answers') as UntypedFormArray
    }

    addAnswerOptions() {
        this.survey_Answers.push(this.formBuilder.control('', Validators.required))
    }

    removeAnswerOptions(index: number) {
        this.survey_Answers.removeAt(index);
    }

    getSurveyInfo(surveyId: number) {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getSurveyById/' + surveyId, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        if (respData?.['result']?.length > 0) {
                            this.surveyDetails = respData['result'][0];
                            this.setSurveyData();
                        } else {
                            this.notificationService.showError(this.language.Survey.no_survey, null);
                        }
                    } else {
                        this.notificationService.showError(respData['result'], null);
                    }
                }
            );
    }

    setSurveyData() {
        var date: Date = new Date() // Today's date
        var date1: string = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
        var dt2: any = new Date(this.surveyDetails['surveyStartDate'].split("T")["0"]);
        var date2: string = ((dt2.getMonth() > 8) ? (dt2.getMonth() + 1) : ('0' + (dt2.getMonth() + 1))) + '/' + ((dt2.getDate() > 9) ? dt2.getDate() : ('0' + dt2.getDate())) + '/' + dt2.getFullYear()
        if (date2 > date1) {
            this.btnDisable = "false";
        } else {
            this.btnDisable = "true";
        }
        var survey_date: Date;
        var survey_start_date: Date;
        this.type = [];
        this.survey_Answers.reset();
        if (this.surveyDetails['surveyAnswer']) {
            for (let i: number = 0; i < this.surveyDetails['surveyAnswer'].length; i++) {
                if (this.survey_Answers.value[i] == null) {
                    this.survey_Answers.removeAt(i);
                }
            }
            this.survey_Answers.removeAt(0);
            if (this.surveyDetails && this.surveyDetails['surveyAnswer'] && this.surveyDetails['surveyAnswer'].length > 0) {
                this.surveyDetails['surveyAnswer'].forEach(element => {
                    this.survey_Answers.push(this.formBuilder.control(element.surveyAnswer))
                });
            }
        }
        if (this.surveyDetails['surveyType']) {
            this.surveyType = this.surveyDetails['surveyType'];
            this.surveyTypeValue = this.surveyDetails['surveyType'].charAt(0).toUpperCase() + this.surveyDetails['surveyType'].slice(1)
            if (this.surveyTypeValue == 'Group') {
                this.type.push({ item_id: "Group", item_text: this.language.header.group });
                setTimeout(() => {
                    this.groupData = [];
                    if (this.groupTypeDropdownList?.length > 0) {
                        this.groupTypeDropdownList.forEach((val, key) => {
                            let info: any = this.surveyDetails['survey_type'];
                            if (info) {
                                info.forEach((value, key) => {
                                    if (val.id == value.surveyTypeId) {
                                        this.selectedGroup.push(value.surveyTypeId);
                                        this.groupData.push({ id: value.surveyTypeId, name: value.survey_group.name })
                                    }
                                });
                            }
                        });
                    }

                    this.updateServeyForm.controls["groupType"].setValue(this.groupData);
                    $('#voteRelated').trigger('click');
                }, 1000);

            } else if (this.surveyTypeValue == 'All_club') {
                this.type.push({ item_id: "All Club", item_text: this.language.Survey.all_club },);
            }
        }
        if (this.surveyDetails['surveyStartDate']) {
            survey_start_date = this.surveyDetails['surveyStartDate'].split("T");
        }

        if (this.surveyDetails['surveyEndDate']) {
            survey_date = this.surveyDetails['surveyEndDate'].split("T");
        }

        if (this.surveyDetails['surveyNotificationOption']) {
            this.surveynotify = JSON.parse(this.surveyDetails['surveyNotificationOption']);
            // this.surveynotify = JSON.parse(this.surveynotify)
            let self = this;
            if (self.choiceData?.length > 0) {
                self.choiceData.forEach((element: any, index: any) => {
                    if (self.surveynotify?.length > 0) {
                        let noti_id: number = self.surveynotify.find((o: any) => JSON.parse(o) === element.value);
                        if (noti_id) {
                            const formArray: UntypedFormArray = this.updateServeyForm.get('surveyNotificationOption') as UntypedFormArray;
                            formArray.push(new UntypedFormControl(noti_id));
                            self.choiceData[index]['noti_id'] = noti_id;
                        } else {
                            self.choiceData[index]['noti_id'] = '';
                        }
                    }
                });
            }
        }

        this.updateServeyForm.controls["title"].setValue(this.surveyDetails.title);
        this.updateServeyForm.controls["description"].setValue(this.surveyDetails['description']);
        this.updateServeyForm.controls["surveyOption"].setValue(this.surveyDetails['surveyOption']);
        this.updateServeyForm.controls["surveyType"].setValue(this.type);
        this.updateServeyForm.controls["surveyEndDate"].setValue(survey_date[0]);
        this.updateServeyForm.controls["surveyStartDate"].setValue(survey_start_date[0]);
        this.updateServeyForm.controls["surveyViewOption"].setValue(this.surveyDetails['surveyViewOption']);
        if (this.surveyDetails['additional_anonymous_voting'] == 'true') {
            this.updateServeyForm.controls["additional_anonymous_voting"].setValue(this.surveyDetails['additional_anonymous_voting']);
        } else {
            this.updateServeyForm.controls["additional_anonymous_voting"].setValue('');
        }

        if (this.surveyDetails['additional_cast_vote'] == 'true') {
            this.updateServeyForm.controls["additional_cast_vote"].setValue(this.surveyDetails['additional_cast_vote']);
        } else {
            this.updateServeyForm.controls["additional_cast_vote"].setValue('');
        }
        
        this.updateServeyForm.controls['image'].setValue(this.surveyDetails.image);

        if (this.surveyDetails?.surevyImage[0]) {
            if (this.surveyDetails?.surevyImage[0]?.survey_image)
             {
                this.hasPicture = true;
                this.originalImage = this.surveyDetails?.surevyImage[0]?.survey_image
                this.surveyDetails.surevyImage[0].survey_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.surveyDetails?.surevyImage[0]?.survey_image.substring(20))) as string;
                this.showImage = this.surveyDetails?.surevyImage[0]?.survey_image;
            } else if (this.surveyDetails?.surevyImage[0]?.surevy_document) {
                this.hasPicture = false;
                this.showFile = this.surveyDetails?.surevyImage[0]?.surevy_document;
            }
        }
        

        // this.updateServeyForm.controls['image'].setValue(this.surveyDetails.image);
        // if (this.surveyDetails.image) {
        //     if ((this.surveyDetails.image.endsWith(".jpg")) || (this.surveyDetails.image.endsWith(".jpeg")) || (this.surveyDetails.image.endsWith(".png")) ||
        //         (this.surveyDetails.image.endsWith(".gif")) || (this.surveyDetails.image.endsWith(".svg")) || (this.surveyDetails.image.endsWith(".webp")) ||
        //         (this.surveyDetails.image.endsWith(".avif")) || (this.surveyDetails.image.endsWith(".apng")) || (this.surveyDetails.image.endsWith(".jfif")) ||
        //         (this.surveyDetails.image.endsWith(".pjpeg")) || (this.surveyDetails.image.endsWith(".pjp"))
        //     ) {
        //         this.hasPicture = true;
        //         this.showImage = this.surveyDetails.image;
        //         $('.preview_img').attr('src', this.showImage);
        //     } else if ((this.surveyDetails.image.endsWith(".pdf")) || (this.surveyDetails.image.endsWith(".doc")) || (this.surveyDetails.image.endsWith(".zip")) ||
        //         (this.surveyDetails.image.endsWith(".docx")) || (this.surveyDetails.image.endsWith(".docm")) || (this.surveyDetails.image.endsWith(".dot")) ||
        //         (this.surveyDetails.image.endsWith(".odt")) || (this.surveyDetails.image.endsWith(".txt")) || (this.surveyDetails.image.endsWith(".xml")) ||
        //         (this.surveyDetails.image.endsWith(".wps")) || (this.surveyDetails.image.endsWith(".xps")) || (this.surveyDetails.image.endsWith(".html")) ||
        //         (this.surveyDetails.image.endsWith(".htm")) || (this.surveyDetails.image.endsWith(".rtf"))) {
        //         this.hasPicture = false;
        //         this.showFile = this.surveyDetails.image;
        //         $('.preview_img').attr('src', '../../../../assets/img/doc-icons/folder.svg');
        //         // $('.preview_txt').text(this.showFile);
        //         // $('.preview_img').attr('src', '/src/assets/img/doc-icons/folder.svg');
        //     }
        // }

    }

    serveyUpdateProcess() {
        this.formSubmit = true;
        var anonymous: string = this.updateServeyForm.get('additional_anonymous_voting').value;
        if (anonymous) {
            this.updateServeyForm.value['additional_anonymous_voting'] = anonymous.toString();
        } else {
            this.updateServeyForm.value['additional_anonymous_voting'] = 'false';
        }
        var cast_vote: string = this.updateServeyForm.get('additional_cast_vote').value;
        if (cast_vote) {
            this.updateServeyForm.value['additional_cast_vote'] = cast_vote.toString();
        } else {
            this.updateServeyForm.value['additional_cast_vote'] = 'false';
        }
        if (this.surveyType == 'all_club' || this.surveyType == 'All Club') {
            this.updateServeyForm.value['surveyType'] = 'all_club';
        } else {
            this.updateServeyForm.value['surveyType'] = this.surveyType;
        }
        if (this.selectedGroup) {
            this.updateServeyForm.value['groupType'] = this.selectedGroup;
        }
        if (this.fileToReturn) {
            this.updateServeyForm.value['image'] = this.fileToReturn;
        } else {
            if (this.showImage) {
                this.updateServeyForm.value['survey_image'] = this.originalImage;
                this.updateServeyForm.value['surevy_document'] = "";


            } else if (this.showFile) {
                this.updateServeyForm.value['surevy_document'] = this.showFile;
                this.updateServeyForm.value['survey_image'] = "";

            }
            //  else{
            //     this.updateServeyForm.value['image'] = ;
            // }
        }
        this.updateServeyForm.value.team_id = this.teamId;
        this.updateServeyForm.value.user_id = this.surveyDetails.user_id;
        this.updateServeyForm.value.approved_status = this.surveyDetails.approved_status;

        var formData: any = new FormData();
        let self = this;
        for (const key in this.updateServeyForm.value) {
            if (Object.prototype.hasOwnProperty.call(this.updateServeyForm.value, key)) {
                const element: any = this.updateServeyForm.value[key];
                
                if (key == 'surveyNotificationOption') {
                    formData.append('surveyNotificationOption', JSON.stringify(element))
                }
                if (key == 'survey_Answers') {
                    formData.append('survey_Answers', JSON.stringify(element))
                }
                if (key == 'groupType') {
                    formData.append('groupType', JSON.stringify(element))
                }
                if (key == 'image') {
                    formData.append('image', element);
                } else {
                    if ((key != 'image') && (key != 'survey_Answers') && (key != 'surveyNotificationOption') && (key != 'groupType')) {
                        formData.append(key, element);
                    }
                }
            }
        }

        this.authService.setLoader(true);
        this.authService.memberSendRequest('put', 'updateSurvey/' + this.surveyId, formData)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'], null);
                        this.socket.emit('pushNotify', 'surveyCreated')
                        var self = this
                        setTimeout(function () {
                            self.router.navigate(["/survey-detail/" + self.surveyId]);
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            );
    }

    /**
    * Function is used to get end date
    * @author  MangoIt Solutions
    */
        getEndDate() {
        this.updateServeyForm.get('surveyStartDate').valueChanges.subscribe((value) => {
            this.minDate = value;
        });
        if(this.minDate != undefined){
            return this.minDate
        }else {
            return this.updateServeyForm.controls['surveyStartDate'].value
        }
    }

    onCheckboxChange(e: Event) {
        this.surveynotify
        var surveyNotificationOption: UntypedFormArray = this.updateServeyForm.get('surveyNotificationOption') as UntypedFormArray;
        if (e.target['checked']) {
            surveyNotificationOption.push(new UntypedFormControl(e.target['value']));
        } else {
            let i: number = 0;
            if (surveyNotificationOption.controls) {
                surveyNotificationOption.controls.forEach((item: UntypedFormControl) => {
                    if (item.value == e.target['value']) {
                        surveyNotificationOption.removeAt(i);
                        return;
                    }
                    i++;
                });
            }
        }
    }

    changeType() {
        if (this.updateServeyForm.controls.surveyType.status == 'INVALID') {
            this.updateServeyForm.controls["groupType"].setValue('');
            this.surveyType = null;
            this.surveyType = '';
            this.selectedGroup = [];
            this.groupData = [];
        }
    }

    onTypeSelect(item: { item_id: string, item_text: string }) {
        this.surveyType = item.item_id;
        this.surveyTypeValue = item.item_id;
        if (this.surveyType == "Group") {
            this.updateServeyForm.get('groupType').setValidators(Validators.required);
            this.updateServeyForm.get('groupType').updateValueAndValidity();

        } else if (this.surveyType == "All Club") {
            this.updateServeyForm.get('groupType').clearValidators();
            this.updateServeyForm.get('groupType').updateValueAndValidity();
            this.selectedGroup = [];
        }
    }

    onTypeDeSelect(item: { item_id: string, item_text: string }) {
        this.updateServeyForm.controls["groupType"].setValue('');
        this.surveyType = null;
        this.surveyType = '';
        this.selectedGroup = [];
        this.groupData = [];
    }

    getGroups() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'teamgroups/' + this.teamId, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData && respData.length > 0) {
                        Object(respData).forEach((val, key) => {
                            this.groupTypeDropdownList.push({ 'id': val.id, 'name': val.name });
                        })
                    }
                    this.groupTypeDropdownSettings = {
                        singleSelection: true,
                        idField: 'id',
                        textField: 'name',
                        enableCheckAll: false,
                        allowSearchFilter: false,
                        closeDropDownOnSelection: true
                    }
                }
            );
    }



    onGroupTypeSelect(item: { id: number, name: string }) {
        this.selectedGroup[0] = item.id;
    }

    onGroupTypeDeSelect(item: { id: number, name: string }) {
        this.selectedGroup = []
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    onCancel() {
        window.history.back();
    }

    /**
   * Function is used to validate file type is image and upload images
   * @author  MangoIt Solutions
   * @param   {}
   * @return  error message if file type is not image or application or text
   */
    errorFile: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    uploadFile(event: Event) {
        var file: File = (event.target as HTMLInputElement).files[0];
        const mimeType: string = file.type;
        const mimeSize: number = file.size;
        if ((mimeType.match(/image\/*/) != null) || (mimeType.match(/application\/*/) != null)) {
            if ((mimeType.match(/application\/*/))) {
                if (mimeSize > 20000000) {
                    this.errorFile = { isError: true, errorMessage: this.language.create_message.file_size };
                } else {
                    this.fileToReturn = null;
                    this.errorFile = { isError: false, errorMessage: '' };
                    this.fileToReturn = file;
                    this.updateServeyForm.patchValue({
                        image: this.fileToReturn
                    });
                    this.updateServeyForm.get('image').updateValueAndValidity();

                    this.fileToReturn = file;
                    const reader: FileReader = new FileReader();
                    reader.readAsDataURL(file);
                    var url: any;
                    let self = this
                    reader.onload = (_event) => {
                        url = reader.result;
                        $('.preview_img').attr('src', 'assets/img/doc-icons/chat_doc_ic.png');
                    }
                    $('.preview_txt').show();
                    $('.preview_txt').text(file.name);
                }
            }
            if ((mimeType.match(/image\/*/))) {

                this.fileChangeEvent(event)
            }
        }
    }

    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    fileChangeEvent(event: Event): void {
        if (event && event.type == 'change') {
            this.croppedImage = '';
            this.imageChangedEvent = null;
            $('.preview_txt').hide();
            $('.preview_txt').text('');
            this.isImage = true;
        }
        $("#imageCrope").show();
        this.fileToReturn = null;
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
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.updateServeyForm.patchValue({ image: this.fileToReturn });
                    this.updateServeyForm.get('image').updateValueAndValidity();
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


    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
