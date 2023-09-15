import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
    selector: 'app-create-room',
    templateUrl: './create-room.component.html',
    styleUrls: ['./create-room.component.css'],
})

export class CreateRoomComponent implements OnInit, OnDestroy {
    // @HostListener('document:keydown', ['$event'])

    language: any;
    roomForm: UntypedFormGroup;
    weekdayList: UntypedFormArray;
    formSubmit: boolean = false;
    checkNum: boolean = false;
    roomsSubmitted: boolean = false;
    fileToReturn: File;
    file: File;
    userId: string;
    setTheme: ThemeType;
    responseMessage: string;
    teamId: number;
    indax: number;
    weekdayArray: { name: any; id: number; }[];
    weekdayDropdownSettings: object;
    selectDay: any[] = [];
    croppedImage: string = '';
    imageChangedEvent: Event;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        translate: 'no',
        fonts: [
            { class: 'gellix', name: 'Gellix' },
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
        defaultParagraphSeparator: 'p',
    };
    private activatedSub: Subscription;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    minDate: any;


    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private themes: ThemeService,
        private lang: LanguageService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService
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
        let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = userData.team_id;
        this.userId = localStorage.getItem('user-id');
        this.roomForm = this.formBuilder.group({
            name: ['', Validators.required],
            room_type: ['', Validators.required],
            room_email: ['', [Validators.required, Validators.email]],
            room_address: ['', Validators.required],
            no_of_persons: ['', [Validators.required, Validators.pattern('^[0-9]*$')],],
            image: ['', Validators.required],
            description: ['', Validators.required],
            approved_status: [0],
            author: [this.userId],
            weekdays: this.formBuilder.array([
                this.formBuilder.group({
                    day: ['', Validators.required],
                    time_from: ['', Validators.required],
                    time_to: ['', Validators.required],
                }),
            ]),
            active_from: ['', Validators.required],
            active_to: ['', Validators.required],
        });

        this.weekdayArray = [
            { id: 1, name: this.language.new_create_event.monday },
            { id: 2, name: this.language.new_create_event.tuesday },
            { id: 3, name: this.language.new_create_event.wednesday },
            { id: 4, name: this.language.new_create_event.thrusday },
            { id: 5, name: this.language.new_create_event.friday },
            { id: 6, name: this.language.new_create_event.saturday },
            { id: 0, name: this.language.new_create_event.sunday },
        ];

        this.weekdayDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            allowSearchFilter: false,
            selectAllText: false,
            enableCheckAll: false,
            unSelectAllText: false,
            closeDropDownOnSelection: true
        };
    }

    get weekdays() {
        return this.roomForm.get('weekdays') as UntypedFormArray;
    }

    addAvailableTimes() {
        if (this.errorTime.isError == false) {
            if (this.weekdays.valid) {
                const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                    day: ['', Validators.required],
                    time_from: ['', Validators.required],
                    time_to: ['', Validators.required],
                });
                this.weekdays.push(newAvailableTimes);
            }
        }
    }

    removeAvailableTimes(index) {
        this.errorTime = { isError: false, errorMessage: '' };
        this.weekdays.removeAt(index);
    }

    onWeekdayItemSelect(item: any) {
        this.selectDay.push(item.id);
    }

    onWeekdayItemDeSelect(item: string) {
        this.selectDay = [];
    }

    checkNumber() {
        if (this.roomForm.value['no_of_persons'] == '') {
            this.checkNum = false;

        } else if (this.roomForm.value['no_of_persons'] <= 0) {
            this.checkNum = true;

        } else {
            this.checkNum = false;
        }
    }

    createRoomForm() {
        this.formSubmit = true; 
        console.log(this.roomForm.controls.weekdays.value);
        
        if (this.roomForm.valid && (this.errorTime['isError'] == false)) {
            for (let i = 0; i < this.roomForm.controls.weekdays.value.length; i++) {
                this.roomForm.value.weekdays[i].day = this.roomForm.controls.weekdays.value[i].day[0]?.id;
            }
            this.roomForm.value['team_id'] = this.teamId;
            if (this.roomForm.valid && this.roomForm.value['no_of_persons'] != '' && this.roomForm.value['no_of_persons'] > 0) {
                var formData: FormData = new FormData();
                let self = this;
                for (const key in this.roomForm.value) {
                    if (Object.prototype.hasOwnProperty.call(this.roomForm.value, key)) {
                        const element: string = this.roomForm.value[key];
                        if (key == 'name') {
                            formData.append('name', element);
                        }
                        if (key == 'room_type') {
                            formData.append('room_type', element);
                        }
                        if (key == 'room_email') {
                            formData.append('room_email', element);
                        }
                        if (key == 'room_address') {
                            formData.append('room_address', element);
                        }
                        if (key == 'no_of_persons') {
                            formData.append('no_of_persons', element);
                        }
                        if (key == 'weekdays') {
                            formData.append('weekdays', JSON.stringify(element));
                        }
                        if (key == 'description') {
                            formData.append('description', element);
                        }
                        if (key == 'image') {
                            formData.append('file', element);
                        }
                        if (key == 'team_id') {
                            formData.append('team_id', element);
                        } else {
                            if ((key != 'name') && (key != 'room_type') && (key != 'room_email') && (key != 'room_address') && (key != 'no_of_persons') && (key != 'weekdays') && (key != 'description') && (key != 'image') && (key != 'team_id')) {
                                formData.append(key, element);
                            }
                        }
                    }
                }

            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'createRoom', formData)
                .subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.roomsSubmitted = false;
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'], null);
                        var self = this;
                        setTimeout(function () {
                            self.router.navigate(['room-detail/' + respData['result']['room']['id']]);
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
        }

    }


    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    /**
* Function is used to get end date
* @author  MangoIt Solutions
*/
    getEndDate() {
        this.roomForm.get('active_from').valueChanges.subscribe((value) => {
            this.minDate = value;
        });
        if (this.minDate != undefined) {
            return this.minDate
        } else {
            return this.getToday()
        }
    }

    getTime() { }
    errorTime: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    compareTwoTimes(item: number) {
        this.indax = item;
        this.errorTime = { isError: false, errorMessage: '' };
        for (let i = 0; i < this.roomForm?.controls?.weekdays?.value.length; i++) {
            if ((this.roomForm?.controls?.weekdays?.value[i]?.['time_from'] != "" && this.roomForm?.controls?.weekdays?.value[i]?.['time_to'] != "") &&
                (this.roomForm?.controls?.weekdays?.value[i]?.['time_from'] > this.roomForm?.controls?.weekdays?.value[i]?.['time_to'] ||
                    this.roomForm?.controls?.weekdays?.value[i]?.['time_from'] == this.roomForm?.controls?.weekdays?.value[i]?.['time_to'])
            ) {
                this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same, };
                return this.indax;
            } else {
                this.errorTime = { isError: false, errorMessage: '' };
            }
        }
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
            const mimeSize: number = file.size;
            if (mimeType.match(/image\/*/) == null) {
                this.errorImage = {
                    isError: true,
                    errorMessage: this.language.error_message.common_valid,
                };
                this.croppedImage = '';
                this.imageChangedEvent = null;
                $('.preview_txt').hide();
                $('.preview_txt').text('');
                setTimeout(() => {
                    this.errorImage = { isError: false, errorMessage: '' };
                }, 3000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event);
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
            this.errorImage = {
                isError: true,
                errorMessage: this.language.error_message.common_valid,
            };
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
        this.imageCompress.compressFile(this.croppedImage, -1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
            .then(
                (compressedImage) => {
                    this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                    this.roomForm.patchValue({ image: this.fileToReturn });
                    this.roomForm.get('image').updateValueAndValidity();
                    $('.preview_txt').show(this.fileToReturn.name);
                    $('.preview_txt').text(this.fileToReturn.name);
                }
            );
    }

    imageLoaded() { }

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
