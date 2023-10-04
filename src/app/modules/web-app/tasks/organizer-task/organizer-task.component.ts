import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LanguageService } from '../../../../service/language.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;
@Component({
    selector: 'app-organizer-task',
    templateUrl: './organizer-task.component.html',
    styleUrls: ['./organizer-task.component.css']
})

export class OrganizerTaskComponent implements OnInit, OnDestroy {
    language: any;
    displayAllTasks: boolean = true;
    displayPersonalTasks: boolean = false;
    displayGroupTasks: boolean = false;
    displayCreatedTasks: boolean = false;
    setTheme: ThemeType;
    userDetails: any;
    private activatedSub: Subscription;
    organizerTask: any;

    constructor(
        private themes: ThemeService, private authService: AuthServiceService, private notificationService: NotificationService,
        private lang: LanguageService,
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
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));

        this.authService.memberSendRequest('get', 'getAllApprovedTasks/user/' + this.userDetails.userId, null)
            .subscribe(
                (respData: any) => {
                    if (respData['isError'] == false) {
                        this.organizerTask = respData['result'];
                        this.organizerTask?.forEach((element) => {
                            if (element?.['task_image'] && element?.['task_image'][0] && element?.['task_image'][0]?.['task_image']) {
                                element['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['task_image'][0]?.['task_image'].substring(20))) as string;
                            }
                        })
                    } else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                })
    }

    /**
    * Function is used to active task tab
    * @author  MangoIt Solutions
    */
    onTasks(id: number) {
        $('.tab-pane').removeClass('active');
        $('.nav-link').removeClass('active');
        if (id == 1) {
            this.displayAllTasks = true;
            this.displayPersonalTasks = false;
            this.displayGroupTasks = false;
            this.displayCreatedTasks = false;
            $('#tabs-1').addClass('active');
            $('#head-allTask').addClass('active');
        } else if (id == 2) {
            this.displayAllTasks = false;
            this.displayPersonalTasks = true;
            this.displayGroupTasks = false;
            this.displayCreatedTasks = false;
            $('#tabs-2').addClass('active');
            $('#head-personalTask').addClass('active');
        } else if (id == 3) {
            this.displayAllTasks = false;
            this.displayPersonalTasks = false;
            this.displayGroupTasks = true;
            this.displayCreatedTasks = false;
            $('#tabs-3').addClass('active');
            $('#head-groupTask').addClass('active');
        } else if (id == 4) {
            this.displayAllTasks = false;
            this.displayPersonalTasks = false;
            this.displayGroupTasks = false;
            this.displayCreatedTasks = true;
            $('#tabs-4').addClass('active');
            $('#head-createdTask').addClass('active');
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}

