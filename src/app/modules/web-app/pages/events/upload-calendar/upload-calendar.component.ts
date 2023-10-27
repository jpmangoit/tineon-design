import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import {LoginDetails, ThemeType} from '@core/models';
import {AuthService, LanguageService, NotificationService, ThemeService} from '@core/services';

declare var $: any;

@Component({
    selector: 'app-upload-calendar',
    templateUrl: './upload-calendar.component.html',
    styleUrls: ['./upload-calendar.component.css']
})

export class UploadCalendarComponent implements OnInit, OnDestroy {
    language: any;
    submitted: boolean = false;
    userDetails: LoginDetails;
    calendarForm: UntypedFormGroup;
    eventTypeDropdownSettings: IDropdownSettings;
    responseMessage: string = null;
    setTheme: ThemeType;
    eventTypeDropdownList: { item_id: number, item_text: string }[] = [];
    event_type: number;
    private activatedSub: Subscription;

    constructor(
        private authService: AuthService,
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private lang: LanguageService,
        private themes: ThemeService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.language = this.lang.getLanguageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.calendarForm = this.formBuilder.group({
            add_calendar: ['', Validators.required],
            author: [localStorage.getItem('user-id')],
            event_type: ['', Validators.required],
        });

        this.eventTypeDropdownList = [
            { item_id: 1, item_text: this.language.create_event.club_event },
            { item_id: 2, item_text: this.language.create_event.group_event },
            { item_id: 3, item_text: this.language.create_event.functionaries_event },
            { item_id: 4, item_text: this.language.create_event.courses },
            { item_id: 5, item_text: this.language.create_event.seminar }
        ];

        this.eventTypeDropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            closeDropDownOnSelection: true
        };
    }

    onTypeSelect(item: { item_id: number, item_text: string }) {
        this.event_type = item.item_id;
    }

    uploadFile(event: Event) {
        const file: File = (event.target as HTMLInputElement).files[0];
        if (file) {
            this.calendarForm.patchValue({
                add_calendar: file
            });
            this.calendarForm.get('add_calendar').updateValueAndValidity();
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

    uploadCalendar() {
        this.submitted = true;
        this.calendarForm.controls['event_type'].setValue(this.event_type);
        if (this.calendarForm.valid) {
            var formData: FormData = new FormData();
            for (const key in this.calendarForm.value) {
                if (Object.prototype.hasOwnProperty.call(this.calendarForm.value, key)) {
                    const element: any = this.calendarForm.value[key];
                    if (key == 'event_type') {
                        formData.append('event_type', element);
                    }
                    if (key == 'add_calendar') {
                        formData.append('file', element);
                    }
                    else {
                        if (key != 'add_calendar' && key != 'event_type') {
                            formData.append(key, element);
                        }
                    }
                }
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'update-calendar', formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData['result']['message'],null);
                            setTimeout(() => {
                                this.router.navigate(['/web/dashboard']);
                            }, 2000);
                        }else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    }
                );
        }
    }

    onCancel() {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
