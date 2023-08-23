import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEl from '@angular/common/locales/en';
import myLocaleTr from '@angular/common/locales/tr';
import myLocaleRu from '@angular/common/locales/ru';
import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeSp from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { LimitTextPipe } from './pipe/limit-text.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { LanguageService } from './service/language.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TooltipDirective } from './tooltip.directive';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogComponent } from './update-confirm-dialog/update-confirm-dialog.component';
import { UpdateConfirmDialogService } from './update-confirm-dialog/update-confirm-dialog.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'angular-progress-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDatepickerModule} from '@angular/material/datepicker';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './member/dashboard/dashboard.component';
import { HeaderComponent } from './common/header/header.component';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { MenuComponent } from './common/menu/menu.component';
import { LayoutComponent } from './common/layout/layout.component';
import { ClubNewsComponent } from './member/news/club-news/club-news.component';
import { ClubAllNewsComponent } from './member/news/club-all-news/club-all-news.component';
import { ClubNewsDetailsComponent } from './member/news/club-news-details/club-news-details.component';
import { ClubDatesComponent } from './member/club-dates/club-dates.component';
import { ClubEventsComponent } from './member/events/club-events/club-events.component';
import { ClubAppointmentsComponent } from './member/club-appointments/club-appointments.component';
import { AuthServiceService } from './service/auth-service.service';
import { ClubWallComponent } from './member/club-wall/club-wall.component';
import { GroupNewsComponent } from './member/news/group-news/group-news.component';
import { BirthdaysComponent } from './member/birthdays/birthdays.component';
import { CommunityComponent } from './member/community/community.component';
import { CommunityMessagesComponent } from './member/messages/community-messages/community-messages.component';
import { CommunityGroupsComponent } from './member/groups/community-groups/community-groups.component';
import { OrganizerComponent } from './member/organizer/organizer.component';
import { DashboardEventComponent } from './member/events/dashboard-event/dashboard-event.component';
import { OrganizerEventComponent } from './member/events/organizer-event/organizer-event.component';
import { OrganizerTaskComponent } from './member/tasks/organizer-task/organizer-task.component';
import { OrganizerDocumentComponent } from './member/documents/organizer-document/organizer-document.component';
import { ProfileComponent } from './member/profiles/profile/profile.component';
// import { ProfileViewComponent } from './member/profiles/profile-view/profile-view.component';
import { ProfileEditComponent } from './member/profiles/profile-edit/profile-edit.component';
import { ProfileBankComponent } from './member/profiles/profile-bank/profile-bank.component';
import { CreateEventComponent } from './member/events/create-event/create-event.component';
import { CreateTaskComponent } from './member/tasks/create-task/create-task.component';
import { CreateNewsComponent } from './member/news/create-news/create-news.component';
import { CreateGroupComponent } from './member/groups/create-group/create-group.component';
import { CreateMessageComponent } from './member/messages/create-message/create-message.component';
import { ProfileClubComponent } from './member/profiles/profile-club/profile-club.component';
import { UpdateNewsComponent } from './member/news/update-news/update-news.component';
import { UpdateEventComponent } from './member/events/update-event/update-event.component';
import { UpdateGroupComponent } from './member/groups/update-group/update-group.component';
import { UpdateTaskComponent } from './member/tasks/update-task/update-task.component';
import { ImageViewerComponent } from './member/image-viewer/image-viewer.component';
import { GroupDetailComponent } from './member/groups/group-detail/group-detail.component';
import { EventDetailComponent } from './member/events/event-detail/event-detail.component';
import { OrganizerAllTaskComponent } from './member/tasks/organizer-all-task/organizer-all-task.component';
import { OrganizerPersonalTaskComponent } from './member/tasks/organizer-personal-task/organizer-personal-task.component';
import { OrganizerGroupTaskComponent } from './member/tasks/organizer-group-task/organizer-group-task.component';
import { OrganizerCreatedTaskComponent } from './member/tasks/organizer-created-task/organizer-created-task.component';
import { ProfileMyClubComponent } from './member/profiles/profile-my-club/profile-my-club.component';
import { ProfileBankEditComponent } from './member/profiles/profile-bank-edit/profile-bank-edit.component';
import { GroupMessagesComponent } from './member/messages/group-messages/group-messages.component';
import { ClubMessagesComponent } from './member/messages/club-messages/club-messages.component';
import { PersonalMessagesComponent } from './member/messages/personal-messages/personal-messages.component';
import { MyDocumentComponent } from './member/documents/my-document/my-document.component';
import { ClubDocumentComponent } from './member/documents/club-document/club-document.component';
import { ArchivedDocumentComponent } from './member/documents/archived-document/archived-document.component';
import { CurrentStatusDocumentComponent } from './member/documents/current-status-document/current-status-document.component';
// import { AllDocumentsComponent } from './member/documents/all-documents/all-documents.component';
import { TaskDetailComponent } from './member/tasks/task-detail/task-detail.component';
import { CreateChatComponent } from './member/create-chat/create-chat.component';
import { ContactAdminComponent } from './member/messages/contact-admin/contact-admin.component';
import { MemberProfileComponent } from './member/profiles/member-profile/member-profile.component';
import { VereinsFaqComponent } from './member/faq/vereins-faq/vereins-faq.component';
import { CreateFaqComponent } from './member/faq/create-faq/create-faq.component';
import { FaqCategoryComponent } from './member/faq/faq-category/faq-category.component';
import { FaqDetailsComponent } from './member/faq/faq-details/faq-details.component';
import { CreateCategoryComponent } from './member/faq/create-category/create-category.component';
import { CourseComponent } from './member/courses/course/course.component';
import { InstructorComponent } from './member/courses/instructor/instructor.component';
import { CreateCourseComponent } from './member/courses/create-course/create-course.component';
import { RoomComponent } from './member/rooms/room/room.component';
import { CreateRoomComponent } from './member/rooms/create-room/create-room.component';
import { CreateInstructorComponent } from './member/courses/create-instructor/create-instructor.component';
import { UpdateCoursesComponent } from './member/courses/update-courses/update-courses.component';
import { UpdateRoomComponent } from './member/rooms/update-room/update-room.component';
import { CrmNewsComponent } from './member/crm-news/crm-news/crm-news.component';
import { ViewServeyComponent } from './member/servey/view-servey/view-servey.component';
import { ServeyComponent } from './member/servey/servey/servey.component';
import { ServeyVoteComponent } from './member/servey/servey-vote/servey-vote.component';
import { CreateServeyComponent } from './member/servey/create-servey/create-servey.component';
import { UpdateServeyComponent } from './member/servey/update-servey/update-servey.component';
import { PushNotificationComponent } from './member/servey/push-notification/push-notification.component';
import { ActiveSurveyComponent } from './member/servey/active-survey/active-survey.component';
import { MySurveyComponent } from './member/servey/my-survey/my-survey.component';
import { CompletedSurveyComponent } from './member/servey/completed-survey/completed-survey.component';
import { EmailTemplateComponent } from './member/email/email-template/email-template.component';
import { ShowEmailComponent } from './member/email/show-email/show-email.component';
import { UpdateEmailComponent } from './member/email/update-email/update-email.component';
import { CrmSurveyComponent } from './member/crm-survey/crm-survey/crm-survey.component';
import { CrmActiveSurveyComponent } from './member/crm-survey/crm-active-survey/crm-active-survey.component';
import { CrmMyVotesComponent } from './member/crm-survey/crm-my-votes/crm-my-votes.component';
import { CrmCompletedSurveyComponent } from './member/crm-survey/crm-completed-survey/crm-completed-survey.component';
import { CrmSurveyVoteComponent } from './member/crm-survey/crm-survey-vote/crm-survey-vote.component';
import { CrmSurveyViewComponent } from './member/crm-survey/crm-survey-view/crm-survey-view.component';
import { CreateThemeComponent } from './member/theme/create-theme/create-theme.component';
import { UpdateThemeComponent } from './member/theme/update-theme/update-theme.component';
import { UploadCalendarComponent } from './member/events/upload-calendar/upload-calendar.component';
import { ThemesComponent } from './member/theme/themes/themes.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MHeaderComponent } from './mobile-app/shared/m-header/m-header.component';
import { NavigationToolComponent } from './mobile-app/shared/navigation-tool/navigation-tool.component';
import { MLayoutComponent } from './mobile-app/shared/m-layout/m-layout.component';
import { SideNavigationComponent } from './mobile-app/shared/side-navigation/side-navigation.component';
import { MDashboardComponent } from './mobile-app/pages/m-dashboard/m-dashboard.component';
import { ShortNumberPipe } from 'src/app/pipe/short-number.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { MclubwallComponent } from './mobile-app/pages/mclubwall/mclubwall.component';
import { MclubNewsComponent } from './mobile-app/pages/mnews/mclub-news/mclub-news.component';
import { MclubDatesComponent } from './mobile-app/pages/mnews/mclub-dates/mclub-dates.component';
import { MclubEventsComponent } from './mobile-app/pages/mevents/mclub-events/mclub-events.component';
import { McommunityComponent } from './mobile-app/pages/mcommunity/mcommunity.component';
import { McommunityGroupsComponent } from './mobile-app/pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import { McommunityMessagesComponent } from './mobile-app/pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import { MchatComponent } from './mobile-app/pages/mmessages/mchat/mchat.component';
import { MactiveSurveyComponent } from './mobile-app/pages/survey/mactive-survey/mactive-survey.component';
import { MmySurveyComponent } from './mobile-app/pages/survey/mmy-survey/mmy-survey.component';
import { McompletedSurveyComponent } from './mobile-app/pages/survey/mcompleted-survey/mcompleted-survey.component';
import { MsurveyComponent } from './mobile-app/pages/survey/msurvey/msurvey.component';
import { MorganizerComponent } from './mobile-app/pages/morganizer/morganizer.component';
import { MorganizerEventsComponent } from './mobile-app/pages/mevents/morganizer-events/morganizer-events.component';
import { MorganizerTaskComponent } from './mobile-app/pages/mtasks/morganizer-task/morganizer-task.component';
import { MorganizerDocumentsComponent } from './mobile-app/pages/mdocuments/morganizer-documents/morganizer-documents.component';
import { McourseComponent } from './mobile-app/pages/mcourses/mcourse/mcourse.component';
import { ActionToolComponent } from './mobile-app/shared/action-tool/action-tool.component';
import { ThemeOptionComponent } from './member/theme-option/theme-option.component';
import { SettingToolComponent } from './mobile-app/shared/setting-tool/setting-tool.component';
import { MdashboardEventComponent } from './mobile-app/pages/mevents/mdashboard-event/mdashboard-event.component';
import { MeventDetailComponent } from './mobile-app/pages/mevents/mevent-detail/mevent-detail.component';
import { MallNewsComponent } from './mobile-app/pages/mnews/mall-news/mall-news.component';
import { MallEventsComponent } from './mobile-app/pages/mevents/mall-events/mall-events.component';
import { DenyReasonConfirmDialogComponent } from './deny-reason-confirm-dialog/deny-reason-confirm-dialog.component';
import { DenyReasonConfirmDialogService } from './deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { McrmActiveSurveyComponent } from './mobile-app/pages/crm-survey/mcrm-active-survey/mcrm-active-survey.component';
import { McrmCompletedSurveyComponent } from './mobile-app/pages/crm-survey/mcrm-completed-survey/mcrm-completed-survey.component';
import { McrmMySurveyComponent } from './mobile-app/pages/crm-survey/mcrm-my-survey/mcrm-my-survey.component';
import { McrmSurveyComponent } from './mobile-app/pages/crm-survey/mcrm-survey/mcrm-survey.component';
import { MnotificationComponent } from './mobile-app/shared/mnotification/mnotification.component';
import { InstructorDetailsComponent } from './member/courses/instructor-details/instructor-details.component';
import { RoomDetailsComponent } from './member/rooms/room-details/room-details.component';
import { MvereinsFaqComponent } from './mobile-app/pages/mfaq/mvereins-faq/mvereins-faq.component';
import { MfaqCategoryComponent } from './mobile-app/pages/mfaq/mfaq-category/mfaq-category.component';
import { CourseDetailComponent } from './member/courses/course-detail/course-detail.component';
import { SurveyDetailComponent } from './member/servey/survey-detail/survey-detail.component';
import { MprofileQrComponent } from './mobile-app/pages/mprofile-qr/mprofile-qr.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { GlobalSearchComponent } from './common/global-search/global-search.component';
import { MchatListComponent } from './mobile-app/pages/mmessages/mchat-list/mchat-list.component';
import { MpersonalMessageComponent } from './mobile-app/pages/mmessages/mpersonal-message/mpersonal-message.component';
import { MclubMessageComponent } from './mobile-app/pages/mmessages/mclub-message/mclub-message.component';
import { MgroupMessageComponent } from './mobile-app/pages/mmessages/mgroup-message/mgroup-message.component';
import { MdisplayMessagesComponent } from './mobile-app/pages/mmessages/mdisplay-messages/mdisplay-messages.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MprofileComponent } from './mobile-app/pages/mprofile/mprofile/mprofile.component';
import { MgeneralInformationComponent } from './mobile-app/pages/mprofile/mgeneral-information/mgeneral-information.component';
import { MprofileBankComponent } from './mobile-app/pages/mprofile/mprofile-bank/mprofile-bank.component';
import { MprofileBankEditComponent } from './mobile-app/pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import { MprofileClubComponent } from './mobile-app/pages/mprofile/mprofile-club/mprofile-club.component';
import { MprofileEditComponent } from './mobile-app/pages/mprofile/mprofile-edit/mprofile-edit.component';
import { MprofileMyClubComponent } from './mobile-app/pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import { MmemberProfileComponent } from './mobile-app/pages/mprofile/mmember-profile/mmember-profile.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LazyImgDirective } from './lazyimg.directive';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { BannerListComponent } from './member/banner/banner-list/banner-list.component';
import { CreateBannerComponent } from './member/banner/create-banner/create-banner.component';
import { UpdateBannerComponent } from './member/banner/update-banner/update-banner.component';
import { BannerDetailComponent } from './member/banner/banner-detail/banner-detail.component';
import { BannerStatisticsComponent } from './member/banner/banner-statistics/banner-statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { MbannerlistComponent } from './mobile-app/pages/mbanner/mbannerlist/mbannerlist.component';
import { EventsCalendarComponent } from './member/events/events-calendar/events-calendar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { NewsListComponent } from './member/news/news-list/news-list.component';
import { EventListComponent } from './member/events/event-list/event-list.component';
import { CourseListComponent } from './member/courses/course-list/course-list.component';
import { RoomListComponent } from './member/rooms/room-list/room-list.component';
import { InstructorListComponent } from './member/courses/instructor-list/instructor-list.component';
import { ServeyListComponent } from './member/servey/servey-list/servey-list.component';
import { HeadlineWordingComponent } from './member/headline-wording/headline-wording.component';

import { CustomDateAdapter } from './service/custom.date.adapter';
import { DateAdapter } from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MobileThemeComponent } from './member/mobile-theme/mobile-theme.component';
import { TaskListComponent } from './member/tasks/task-list/task-list.component';
import { GroupListComponent } from './member/groups/group-list/group-list.component';
import { FaqsListComponent } from './member/faq/faqs-list/faqs-list.component';
import { AppStoreComponent } from './member/app-store/app-store.component';
import { MEmailComponent } from './mobile-app/shared/m-email/m-email.component';
// import { FlexLayoutModule } from '@angular/flex-layout';

export function getCulture() {
    let language = localStorage.getItem('language');
    if (language == 'en') {
        registerLocaleData(localeEl, 'en');
        return 'en';
    } else if (language == 'ru') {
        registerLocaleData(myLocaleRu);
        return 'ru';
    } else if (language == 'tr') {
        registerLocaleData(myLocaleTr);
        return 'tr';
    } else if (language == 'it') {
        registerLocaleData(localeIt);
        return 'it';
    } else if (language == 'es') {
        registerLocaleData(localeSp);
        return 'es';
    } else if (language == 'fr') {
        registerLocaleData(localeFr);
        return 'fr';
    } else {
        registerLocaleData(localeDe);
        return 'de';
    }
}

FullCalendarModule.registerPlugins([
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
]);

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RecoverPasswordComponent,
		DashboardComponent,
		HeaderComponent,
		PageNotFoundComponent,
		MenuComponent,
		LayoutComponent,
		ClubNewsComponent,
		ClubAllNewsComponent,
		ClubNewsDetailsComponent,
		ClubDatesComponent,
		ClubEventsComponent,
		ClubAppointmentsComponent,
		ClubWallComponent,
		GroupNewsComponent,
		BirthdaysComponent,
		LimitTextPipe,
		CommunityComponent,
		CommunityMessagesComponent,
		CommunityGroupsComponent,
		DashboardEventComponent,
		OrganizerComponent,
		OrganizerEventComponent,
		OrganizerTaskComponent,
		OrganizerDocumentComponent,
		ProfileComponent,
		// ProfileViewComponent,
		ProfileEditComponent,
		ProfileBankComponent,
		CreateEventComponent,
		CreateTaskComponent,
		CreateNewsComponent,
		UpdateNewsComponent,
		UpdateEventComponent,
		UpdateGroupComponent,
		UpdateTaskComponent,
		CreateMessageComponent,
		ProfileClubComponent,
		ConfirmDialogComponent,
        UpdateConfirmDialogComponent,
		ImageViewerComponent,
		CreateGroupComponent,
		GroupDetailComponent,
		EventDetailComponent,
		OrganizerAllTaskComponent,
		OrganizerPersonalTaskComponent,
		OrganizerGroupTaskComponent,
		OrganizerCreatedTaskComponent,
		ProfileMyClubComponent,
		ProfileBankEditComponent,
		GroupMessagesComponent,
		ClubMessagesComponent,
		PersonalMessagesComponent,
		MyDocumentComponent,
		ClubDocumentComponent,
		ArchivedDocumentComponent,
		CurrentStatusDocumentComponent,
		// AllDocumentsComponent,
		TaskDetailComponent,
		TooltipDirective,
		CreateChatComponent,
		ContactAdminComponent,
		MemberProfileComponent,
		VereinsFaqComponent,
		CreateFaqComponent,
		FaqCategoryComponent,
		FaqDetailsComponent,
		CreateCategoryComponent,
		CourseComponent,
		InstructorComponent,
		CreateCourseComponent,
		RoomComponent,
		CreateRoomComponent,
		CreateInstructorComponent,
		UpdateCoursesComponent,
		UpdateRoomComponent,
		CrmNewsComponent,
		ViewServeyComponent,
		ServeyComponent,
		ServeyVoteComponent,
		CreateServeyComponent,
		UpdateServeyComponent,
		PushNotificationComponent,
		ActiveSurveyComponent,
		MySurveyComponent,
		CompletedSurveyComponent,
		EmailTemplateComponent,
		ShowEmailComponent,
		UpdateEmailComponent,
		CrmSurveyComponent,
		CrmActiveSurveyComponent,
		CrmMyVotesComponent,
		CrmCompletedSurveyComponent,
		CrmSurveyVoteComponent,
		CrmSurveyViewComponent,
		CreateThemeComponent,
		UpdateThemeComponent,
        UploadCalendarComponent,
        ThemesComponent,
        MHeaderComponent,
        NavigationToolComponent,
        MLayoutComponent,
        SideNavigationComponent,
        MDashboardComponent,
        ShortNumberPipe,
        MclubwallComponent,
        MclubNewsComponent,
        MclubDatesComponent,
        MclubEventsComponent,
        McommunityComponent,
        McommunityGroupsComponent,
        McommunityMessagesComponent,
        MchatComponent,
        MactiveSurveyComponent,
        MmySurveyComponent,
        McompletedSurveyComponent,
        MsurveyComponent,
        MorganizerComponent,
        MorganizerEventsComponent,
        MorganizerTaskComponent,
        MorganizerDocumentsComponent,
        McourseComponent,
        ActionToolComponent,
        ThemeOptionComponent,
        SettingToolComponent,
        MdashboardEventComponent,
        MeventDetailComponent,
        MallNewsComponent,
        MallEventsComponent,
        DenyReasonConfirmDialogComponent,
        McrmActiveSurveyComponent,
        McrmCompletedSurveyComponent,
        McrmMySurveyComponent,
        McrmSurveyComponent,
        MvereinsFaqComponent,
        MnotificationComponent,
        InstructorDetailsComponent,
        RoomDetailsComponent,
        MfaqCategoryComponent,
        CourseDetailComponent,
        SurveyDetailComponent,
        MprofileQrComponent,
        ComingSoonComponent,
        GlobalSearchComponent,
        MchatListComponent,
        MpersonalMessageComponent,
        MclubMessageComponent,
        MgroupMessageComponent,
        MdisplayMessagesComponent,
        MprofileComponent,
        MgeneralInformationComponent,
        MprofileBankComponent,
        MprofileBankEditComponent,
        MprofileClubComponent,
        MprofileEditComponent,
        MprofileMyClubComponent,
        MmemberProfileComponent,
		LazyImgDirective,
        BannerListComponent,
        CreateBannerComponent,
        UpdateBannerComponent,
        BannerDetailComponent,
        BannerStatisticsComponent,
        MbannerlistComponent,
        EventsCalendarComponent,
        NewsListComponent,
        EventListComponent,
        CourseListComponent,
        RoomListComponent,
        InstructorListComponent,
        ServeyListComponent,
        HeadlineWordingComponent,
        MobileThemeComponent,
        TaskListComponent,
        GroupListComponent,
        FaqsListComponent,
        AppStoreComponent,
        MEmailComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		AngularEditorModule,
		FullCalendarModule,
		NgMultiSelectDropDownModule.forRoot(),
		NgxPaginationModule,
		NgxDocViewerModule,
		MatTabsModule,
		MatProgressBarModule,
		ProgressBarModule,
		ImageCropperModule,
		// NgxMatColorPickerModule,
		ColorPickerModule,
		MatButtonToggleModule,
		CarouselModule,
		MatMenuModule,
		MatSidenavModule,
		MatBottomSheetModule,
		MatSelectModule,
		MatInputModule,
		MatExpansionModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            disableTimeOut: false,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: false,
          }),
        ToastContainerModule,
        NgChartsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatRadioModule,
        MatGridListModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
        // FlexLayoutModule,
        NgxMaterialTimepickerModule
	],
	exports: [
		ConfirmDialogComponent,UpdateConfirmDialogComponent
	],

    providers: [
        AuthServiceService,
        LanguageService,
        AuthGuard,
        ConfirmDialogService,
        UpdateConfirmDialogService,
        DenyReasonConfirmDialogService,
		NgxImageCompressService,
        { provide: LOCALE_ID, useValue: getCulture()},
        { provide: DateAdapter, useClass: CustomDateAdapter }
        // { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    ],

    bootstrap: [AppComponent],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
