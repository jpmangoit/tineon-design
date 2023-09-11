import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-update-room',
    templateUrl: './update-room.component.html',
    styleUrls: ['./update-room.component.css'],
})

export class UpdateRoomComponent implements OnInit, OnDestroy {
    language: any;
    roomForm: UntypedFormGroup;
    weekdayList: UntypedFormArray;
    formSubmit: boolean = false;
    roomsSubmitted: boolean = false;
    responseMessage: string;
    checkNum: boolean = false;
    fileToReturn: File;
    roomId: number;
    // roomData: Room;
    roomData: any;
    imageUrl: string;
    hasPicture: boolean = false;
    weekdayArray: { name: any; id: number; }[];
    weekdayDropdownSettings: object;
    selectDay: string[] = [];
    errorTime: { isError: boolean; errorMessage: string } = { isError: false, errorMessage: '' };
    indax: number;
    teamId: number;
    imageChangedEvent: Event;
    croppedImage: string = '';
    file: File;
    setTheme: ThemeType;
    private activatedSub: Subscription;
    isImage: boolean = false;
    imgHeight: any;
    imgWidth: any;
    minDate: any;
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
    allWeekDayArray: any[];
    allWeekDayArrayName: any[];

    constructor(
        private authService: AuthServiceService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private route: ActivatedRoute,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer
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

        this.roomForm = this.formBuilder.group({
            name: ['', Validators.required],
            room_type: ['', Validators.required],
            room_email: ['', Validators.required],
            room_address: ['', Validators.required],
            no_of_persons: ['', [Validators.required, Validators.pattern('^[0-9]*$')],],
            image: ['', Validators.required],
            description: ['', Validators.required],
            approved_status: [''],
            author: [userData.userId],
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

        this.allWeekDayArray = [
            this.language.new_create_event.sunday,
            this.language.new_create_event.monday,
            this.language.new_create_event.tuesday,
            this.language.new_create_event.wednesday,
            this.language.new_create_event.thrusday,
            this.language.new_create_event.friday,
            this.language.new_create_event.saturday
        ];

        this.weekdayArray = [
            { id: 1, name: this.language.new_create_event.monday },
            { id: 2, name: this.language.new_create_event.tuesday },
            { id: 3, name: this.language.new_create_event.wednesday },
            { id: 4, name: this.language.new_create_event.thrusday },
            { id: 5, name: this.language.new_create_event.friday },
            { id: 6, name: this.language.new_create_event.saturday },
            { id: 0, name: this.language.new_create_event.sunday },
        ];

        this.allWeekDayArrayName = [
            { id: 0, name: ["Sonntag", "Sunday", "dimanche", "domenica", "Воскресенье", "domingo", "Pazar"] },
            { id: 1, name: ["Montag", "Monday", "lundi", "lunedì", "понедельник", "lunes", "Pazartesi"] },
            { id: 2, name: ["Dienstag", "Tuesday", "mardi", "martedì", "вторник", "martes", "Salı"] },
            { id: 3, name: ["Mittwoch", "Wednesday", "mercredi", "mercoledì", "среда", "miércoles", "Çarşamba"] },
            { id: 4, name: ["Donnerstag", "Thursday", "jeudi", "giovedì", "четверг", "jueves", "Perşembe"] },
            { id: 5, name: ["Freitag", "Friday", "vendredi", "venerdì", "Пятница", "viernes", "Cuma"] },
            { id: 6, name: ["Samstag", "Saturday", "samedi", "sabato", "Суббота", "sábado", "Cumartesi"] }
        ]
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

        this.route.params.subscribe((params) => {
            this.roomId = params.roomId;
        });

        this.getRoomInfo();
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

    removeAvailableTimes(index: number) {
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

    /**
    * Function is used to get room by Id
    * @author  MangoIt Solutions
    * @param   {id}
    * @return  {object array}
    */
    originalImg: any;
    getRoomInfo() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'getRoomsById/' + this.roomId, null)
            .subscribe((respData: Room) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    this.roomData = respData['result'];
                    this.roomForm.controls['author'].setValue(this.roomData.author);
                    this.roomForm.controls['approved_status'].setValue(this.roomData.approved_status);
                    this.roomForm.controls['name'].setValue(this.roomData.name);
                    this.roomForm.controls['description'].setValue(this.roomData.description);
                    this.roomForm.controls['room_type'].setValue(this.roomData.room_type);
                    this.roomForm.controls['room_email'].setValue(this.roomData.room_email);
                    this.roomForm.controls['room_address'].setValue(this.roomData.room_address);
                    this.roomForm.controls['no_of_persons'].setValue(this.roomData.no_of_persons);

                    if (this.roomData.room_image.length == 0) {
                        this.imageUrl = '../../../assets/img/no_image.png'

                    } else if (this.roomData?.room_image[0]?.room_image) {
                        this.hasPicture = true;
                        this.roomForm.controls['image'].setValue(this.roomData?.room_image[0]?.room_image);
                        this.originalImg = this.roomData?.room_image[0]?.room_image;
                        this.roomData.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomData?.room_image[0]?.room_image.substring(20)));
                        this.imageUrl = this.roomData?.room_image[0]?.room_image;
                    }

                    // if (this.roomData['room_image']?.[0]['room_image']){
                    //     this.hasPicture = true;
                    //     this.roomForm.controls['image'].setValue(this.roomData['room_image']?.[0]['room_image']);
                    //     this.originalImg = this.roomData['room_image']?.[0]['room_image']
                    //     this.roomData['room_image'][0]['room_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.roomData['room_image']?.[0]['room_image'].substring(20)));
                    //     this.imageUrl = this.roomData['room_image']?.[0]['room_image'];
                    // }

                    if (this.roomData['active_from']) {
                        this.roomForm.controls['active_from'].setValue(this.roomData['active_from'].split('T')[0]);
                    }
                    if (this.roomData['active_to']) {
                        this.roomForm.controls['active_to'].setValue(this.roomData['active_to'].split('T')[0])
                    }

                    // if (['.jpg','.jpeg','.png','.gif','.svg','.webp','.avif','.apng','.jfif','.pjpeg', '.pjp'].some(char => this.roomData.image.endsWith(char))) {
                    // this.hasPicture = true;
                    //     this.imageUrl = this.roomData.image;
                    // }
                    this.weekdays.reset();
                    //-------------------set weekdays-------------
                    for (let i = 0; i < this.roomData.room_availablity.length; i++) {
                        this.weekdays.removeAt(i);
                        if (this.weekdays.value[i] && this.weekdays.value[i].day == null && this.weekdays.value[i].time_from == null && this.weekdays.value[i].time_to == null) {
                            this.weekdays.removeAt(i);
                        }
                    }
                    this.weekdays.removeAt(0);
                    if (this.roomData?.room_availablity?.length > 0) {

                        this.roomData.room_availablity.forEach((key, value) => {
                            if (key.time_from.includes(':00') && key.time_to.includes(':00')) {
                                key.time_from = key.time_from.slice(0, 5)
                                key.time_to = key.time_to.slice(0, 5)
                            }
                            let room_info = [];
                            room_info.push({ id: key.weekday, name: this.allWeekDayArray[this.getDayId(key.weekday)] });
                            const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
                                day: [room_info, Validators.required],
                                time_from: [key.time_from, Validators.required],
                                time_to: [key.time_to, Validators.required],
                            });
                            this.weekdays.push(newAvailableTimes);
                        });
                    }
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            });
    }

    updateRoomForm() {
        this.formSubmit = true;
        // for (let i = 0; i < this.roomForm.controls.weekdays.value.length; i++) {
        //     this.roomForm.value.weekdays[i].day = ( this.roomForm.controls.weekdays.value[i].day[0].length == 1) ? this.roomForm.controls.weekdays.value[i].day: this.roomForm.controls.weekdays.value[i].day[0];
        // }

        for (let i = 0; i < this.roomForm.controls.weekdays.value.length; i++) {
            this.roomForm.value.weekdays[i].day = this.roomForm.controls.weekdays.value[i].day[0].id;
        }
        this.roomForm.value['team_id'] = this.teamId;
        if (this.fileToReturn) {
            this.roomForm.value['image'] = this.fileToReturn;
        } else {
            this.roomForm.value['image'] = this.originalImg;
            // this.roomForm.value['image'] = this.imageUrl;
        }
        if (this.roomForm.value['no_of_persons'] != '' && this.roomForm.value['no_of_persons'] > 0) {
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
                    if (key == 'team_id') {
                        formData.append('team_id', element);
                    }
                    if (key == 'image') {
                        formData.append('file', element);
                    } else {
                        if ((key != 'name') && (key != 'room_type') && (key != 'room_email') && (key != 'room_address') && (key != 'no_of_persons') && (key != 'weekdays') && (key != 'description') && (key != 'image') && (key != 'team_id')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            if (this.roomForm.valid && (this.errorTime['isError'] == false)) {
                this.authService.setLoader(true);
                this.authService.memberSendRequest('put', 'updateRooms/' + this.roomId, formData).subscribe((respData: any) => {
                    this.authService.setLoader(false);
                    this.roomsSubmitted = false;
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(respData['result']['message'], null);
                        var self = this;
                        setTimeout(function () {
                            self.router.navigate(['room-detail/' + self.roomId]);
                        }, 2000);
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                });
            }

        }
    }

    compareTwoTimes(item: number) {
        this.indax = item;
        this.errorTime = { isError: false, errorMessage: '' };
        for (let i = 0; i < this.roomForm?.controls?.weekdays?.value?.length; i++) {
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
            return this.roomForm.controls['active_from'].value
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
                }, 2000);
            } else {
                this.errorImage = { isError: false, errorMessage: '' };
                this.fileChangeEvent(event);
            }
        }
    }

    fileChangeEvent(event: Event) {
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

    getDayName(id: any) {
        if (!isNaN(id)) {
            return this.allWeekDayArray[id];
        } else {
            let obj = this.allWeekDayArrayName.find(o => o.name.includes(id));
            if (obj?.name) {
                return this.allWeekDayArray[obj.id];
            } else {
                return id;
            }
        }
    }

    getDayId(id: any) {
        if (!isNaN(id)) {
            return id;
        } else {
            let obj = this.allWeekDayArrayName.find(o => o.name.includes(id));
            if (obj?.name) {
                return obj.id;
            } else {
                return id;
            }
        }
    }


    ngOnDestroy() {
        this.activatedSub.unsubscribe();
    }
}
