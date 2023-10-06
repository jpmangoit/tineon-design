import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebAppRoutingModule } from './web-app-routing.module';
import { GlobalSearchComponent } from 'src/app/modules/web-app/common/global-search/global-search.component';
import { HeaderComponent } from 'src/app/modules/web-app/common/header/header.component';
import { LayoutComponent } from 'src/app/modules/web-app/common/layout/layout.component';
import { MenuComponent } from 'src/app/modules/web-app/common/menu/menu.component';
import { PageNotFoundComponent } from 'src/app/modules/web-app/common/page-not-found/page-not-found.component';
import { LazyImgDirective } from 'src/app/directives/lazyimg.directive';
import { TooltipDirective } from 'src/app/directives/tooltip.directive';
import { ComingSoonComponent } from 'src/app/shared/coming-soon/coming-soon.component';
import { LimitTextPipe } from 'src/app/pipe/limit-text.pipe';
import { AppStoreComponent } from './app-store/app-store.component';
import { BannerDetailComponent } from './banner/banner-detail/banner-detail.component';
import { BannerListComponent } from './banner/banner-list/banner-list.component';
import { BannerStatisticsComponent } from './banner/banner-statistics/banner-statistics.component';
import { CreateBannerComponent } from './banner/create-banner/create-banner.component';
import { UpdateBannerComponent } from './banner/update-banner/update-banner.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { ClubAppointmentsComponent } from './club-appointments/club-appointments.component';
import { ClubDatesComponent } from './club-dates/club-dates.component';
import { ClubWallComponent } from './club-wall/club-wall.component';
import { CommunityComponent } from './community/community.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseComponent } from './courses/course/course.component';
import { CreateCourseComponent } from './courses/create-course/create-course.component';
import { CreateInstructorComponent } from './courses/create-instructor/create-instructor.component';
import { InstructorDetailsComponent } from './courses/instructor-details/instructor-details.component';
import { InstructorListComponent } from './courses/instructor-list/instructor-list.component';
import { InstructorComponent } from './courses/instructor/instructor.component';
import { UpdateCoursesComponent } from './courses/update-courses/update-courses.component';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { CrmNewsComponent } from './crm-news/crm-news/crm-news.component';
import { CrmActiveSurveyComponent } from './crm-survey/crm-active-survey/crm-active-survey.component';
import { CrmCompletedSurveyComponent } from './crm-survey/crm-completed-survey/crm-completed-survey.component';
import { CrmMyVotesComponent } from './crm-survey/crm-my-votes/crm-my-votes.component';
import { CrmSurveyViewComponent } from './crm-survey/crm-survey-view/crm-survey-view.component';
import { CrmSurveyVoteComponent } from './crm-survey/crm-survey-vote/crm-survey-vote.component';
import { CrmSurveyComponent } from './crm-survey/crm-survey/crm-survey.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArchivedDocumentComponent } from './documents/archived-document/archived-document.component';
import { ClubDocumentComponent } from './documents/club-document/club-document.component';
import { CurrentStatusDocumentComponent } from './documents/current-status-document/current-status-document.component';
import { MyDocumentComponent } from './documents/my-document/my-document.component';
import { OrganizerDocumentComponent } from './documents/organizer-document/organizer-document.component';
import { EmailTemplateComponent } from './email/email-template/email-template.component';
import { ShowEmailComponent } from './email/show-email/show-email.component';
import { UpdateEmailComponent } from './email/update-email/update-email.component';
import { ClubEventsComponent } from './events/club-events/club-events.component';
import { CreateEventComponent } from './events/create-event/create-event.component';
import { DashboardEventComponent } from './events/dashboard-event/dashboard-event.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventsCalendarComponent } from './events/events-calendar/events-calendar.component';
import { OrganizerEventComponent } from './events/organizer-event/organizer-event.component';
import { UpdateEventComponent } from './events/update-event/update-event.component';
import { UploadCalendarComponent } from './events/upload-calendar/upload-calendar.component';
import { CreateCategoryComponent } from './faq/create-category/create-category.component';
import { CreateFaqComponent } from './faq/create-faq/create-faq.component';
import { FaqCategoryComponent } from './faq/faq-category/faq-category.component';
import { FaqDetailsComponent } from './faq/faq-details/faq-details.component';
import { FaqsListComponent } from './faq/faqs-list/faqs-list.component';
import { VereinsFaqComponent } from './faq/vereins-faq/vereins-faq.component';
import { CommunityGroupsComponent } from './groups/community-groups/community-groups.component';
import { CreateGroupComponent } from './groups/create-group/create-group.component';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { UpdateGroupComponent } from './groups/update-group/update-group.component';
import { HeadlineWordingComponent } from './headline-wording/headline-wording.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ClubMessagesComponent } from './messages/club-messages/club-messages.component';
import { CommunityMessagesComponent } from './messages/community-messages/community-messages.component';
import { ContactAdminComponent } from './messages/contact-admin/contact-admin.component';
import { CreateMessageComponent } from './messages/create-message/create-message.component';
import { GroupMessagesComponent } from './messages/group-messages/group-messages.component';
import { PersonalMessagesComponent } from './messages/personal-messages/personal-messages.component';
import { MobileThemeComponent } from './mobile-theme/mobile-theme.component';
import { ClubAllNewsComponent } from './news/club-all-news/club-all-news.component';
import { ClubNewsDetailsComponent } from './news/club-news-details/club-news-details.component';
import { ClubNewsComponent } from './news/club-news/club-news.component';
import { CreateNewsComponent } from './news/create-news/create-news.component';
import { GroupNewsComponent } from './news/group-news/group-news.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { UpdateNewsComponent } from './news/update-news/update-news.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { MemberProfileComponent } from './profiles/member-profile/member-profile.component';
import { ProfileBankEditComponent } from './profiles/profile-bank-edit/profile-bank-edit.component';
import { ProfileBankComponent } from './profiles/profile-bank/profile-bank.component';
import { ProfileClubComponent } from './profiles/profile-club/profile-club.component';
import { ProfileEditComponent } from './profiles/profile-edit/profile-edit.component';
import { ProfileMyClubComponent } from './profiles/profile-my-club/profile-my-club.component';
import { ProfileComponent } from './profiles/profile/profile.component';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { RoomDetailsComponent } from './rooms/room-details/room-details.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { RoomComponent } from './rooms/room/room.component';
import { UpdateRoomComponent } from './rooms/update-room/update-room.component';
import { ActiveSurveyComponent } from './servey/active-survey/active-survey.component';
import { CompletedSurveyComponent } from './servey/completed-survey/completed-survey.component';
import { CreateServeyComponent } from './servey/create-servey/create-servey.component';
import { MySurveyComponent } from './servey/my-survey/my-survey.component';
import { PushNotificationComponent } from './servey/push-notification/push-notification.component';
import { ServeyListComponent } from './servey/servey-list/servey-list.component';
import { ServeyVoteComponent } from './servey/servey-vote/servey-vote.component';
import { ServeyComponent } from './servey/servey/servey.component';
import { SurveyDetailComponent } from './servey/survey-detail/survey-detail.component';
import { UpdateServeyComponent } from './servey/update-servey/update-servey.component';
import { ViewServeyComponent } from './servey/view-servey/view-servey.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { OrganizerAllTaskComponent } from './tasks/organizer-all-task/organizer-all-task.component';
import { OrganizerCreatedTaskComponent } from './tasks/organizer-created-task/organizer-created-task.component';
import { OrganizerGroupTaskComponent } from './tasks/organizer-group-task/organizer-group-task.component';
import { OrganizerPersonalTaskComponent } from './tasks/organizer-personal-task/organizer-personal-task.component';
import { OrganizerTaskComponent } from './tasks/organizer-task/organizer-task.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { UpdateTaskComponent } from './tasks/update-task/update-task.component';
import { ThemeOptionComponent } from './theme-option/theme-option.component';
import { CreateThemeComponent } from './theme/create-theme/create-theme.component';
import { ThemesComponent } from './theme/themes/themes.component';
import { UpdateThemeComponent } from './theme/update-theme/update-theme.component';
import { SharedModule } from 'src/app/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    declarations: [
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
        ThemeOptionComponent,
        InstructorDetailsComponent,
        RoomDetailsComponent,
        CourseDetailComponent,
        SurveyDetailComponent,
        ComingSoonComponent,
        GlobalSearchComponent,
        LazyImgDirective,
        BannerListComponent,
        CreateBannerComponent,
        UpdateBannerComponent,
        BannerDetailComponent,
        BannerStatisticsComponent,
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
    ],
    imports: [
        CommonModule,
        SharedModule,
        WebAppRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
    ]
})
export class WebAppModule { }
