import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { WebAppRoutingModule } from './web-app-routing.module';
import {DashboardComponent} from '@modules/web-app/pages/dashboard/dashboard.component';
import {HeaderComponent} from '@modules/web-app/common/header/header.component';
import {PageNotFoundComponent} from '@modules/web-app/shared/page-not-found/page-not-found.component';
import {MenuComponent} from '@modules/web-app/common/menu/menu.component';
import {LayoutComponent} from '@modules/web-app/common/layout/layout.component';
import {ClubNewsComponent} from '@modules/web-app/pages/news/club-news/club-news.component';
import {ClubAllNewsComponent} from '@modules/web-app/pages/news/club-all-news/club-all-news.component';
import {ClubNewsDetailsComponent} from '@modules/web-app/pages/news/club-news-details/club-news-details.component';
import {ClubDatesComponent} from '@modules/web-app/pages/club-dates/club-dates.component';
import {ClubEventsComponent} from '@modules/web-app/pages/events/club-events/club-events.component';
import {ClubAppointmentsComponent} from '@modules/web-app/pages/club-appointments/club-appointments.component';
import {ClubWallComponent} from '@modules/web-app/pages/club-wall/club-wall.component';
import {GroupNewsComponent} from '@modules/web-app/pages/news/group-news/group-news.component';
import {BirthdaysComponent} from '@modules/web-app/pages/birthdays/birthdays.component';
import {CommunityComponent} from '@modules/web-app/pages/community/community.component';
import {CommunityMessagesComponent} from '@modules/web-app/pages/messages/community-messages/community-messages.component';
import {CommunityGroupsComponent} from '@modules/web-app/pages/groups/community-groups/community-groups.component';
import {DashboardEventComponent} from '@modules/web-app/pages/events/dashboard-event/dashboard-event.component';
import {OrganizerComponent} from '@modules/web-app/pages/organizer/organizer.component';
import {OrganizerEventComponent} from '@modules/web-app/pages/events/organizer-event/organizer-event.component';
import {OrganizerTaskComponent} from '@modules/web-app/pages/tasks/organizer-task/organizer-task.component';
import {OrganizerDocumentComponent} from '@modules/web-app/pages/documents/organizer-document/organizer-document.component';
import {ProfileComponent} from '@modules/web-app/pages/profiles/profile/profile.component';
import {ProfileEditComponent} from '@modules/web-app/pages/profiles/profile-edit/profile-edit.component';
import {ProfileBankComponent} from '@modules/web-app/pages/profiles/profile-bank/profile-bank.component';
import {CreateEventComponent} from '@modules/web-app/pages/events/create-event/create-event.component';
import {CreateTaskComponent} from '@modules/web-app/pages/tasks/create-task/create-task.component';
import {CreateNewsComponent} from '@modules/web-app/pages/news/create-news/create-news.component';
import {UpdateNewsComponent} from '@modules/web-app/pages/news/update-news/update-news.component';
import {UpdateEventComponent} from '@modules/web-app/pages/events/update-event/update-event.component';
import {UpdateGroupComponent} from '@modules/web-app/pages/groups/update-group/update-group.component';
import {UpdateTaskComponent} from '@modules/web-app/pages/tasks/update-task/update-task.component';
import {CreateMessageComponent} from '@modules/web-app/pages/messages/create-message/create-message.component';
import {ProfileClubComponent} from '@modules/web-app/pages/profiles/profile-club/profile-club.component';
import {ImageViewerComponent} from '@modules/web-app/pages/image-viewer/image-viewer.component';
import {CreateGroupComponent} from '@modules/web-app/pages/groups/create-group/create-group.component';
import {GroupDetailComponent} from '@modules/web-app/pages/groups/group-detail/group-detail.component';
import {EventDetailComponent} from '@modules/web-app/pages/events/event-detail/event-detail.component';
import {OrganizerAllTaskComponent} from '@modules/web-app/pages/tasks/organizer-all-task/organizer-all-task.component';
import {OrganizerPersonalTaskComponent} from '@modules/web-app/pages/tasks/organizer-personal-task/organizer-personal-task.component';
import {OrganizerGroupTaskComponent} from '@modules/web-app/pages/tasks/organizer-group-task/organizer-group-task.component';
import {OrganizerCreatedTaskComponent} from '@modules/web-app/pages/tasks/organizer-created-task/organizer-created-task.component';
import {ProfileMyClubComponent} from '@modules/web-app/pages/profiles/profile-my-club/profile-my-club.component';
import {ProfileBankEditComponent} from '@modules/web-app/pages/profiles/profile-bank-edit/profile-bank-edit.component';
import {GroupMessagesComponent} from '@modules/web-app/pages/messages/group-messages/group-messages.component';
import {ClubMessagesComponent} from '@modules/web-app/pages/messages/club-messages/club-messages.component';
import {PersonalMessagesComponent} from '@modules/web-app/pages/messages/personal-messages/personal-messages.component';
import {MyDocumentComponent} from '@modules/web-app/pages/documents/my-document/my-document.component';
import {ClubDocumentComponent} from '@modules/web-app/pages/documents/club-document/club-document.component';
import {ArchivedDocumentComponent} from '@modules/web-app/pages/documents/archived-document/archived-document.component';
import {CurrentStatusDocumentComponent} from '@modules/web-app/pages/documents/current-status-document/current-status-document.component';
import {TaskDetailComponent} from '@modules/web-app/pages/tasks/task-detail/task-detail.component';
import {LazyImgDirective, TooltipDirective} from '@shared/directives';
import {CreateChatComponent} from '@modules/web-app/pages/create-chat/create-chat.component';
import {ContactAdminComponent} from '@modules/web-app/pages/messages/contact-admin/contact-admin.component';
import {MemberProfileComponent} from '@modules/web-app/pages/profiles/member-profile/member-profile.component';
import {VereinsFaqComponent} from '@modules/web-app/pages/faq/vereins-faq/vereins-faq.component';
import {CreateFaqComponent} from '@modules/web-app/pages/faq/create-faq/create-faq.component';
import {FaqCategoryComponent} from '@modules/web-app/pages/faq/faq-category/faq-category.component';
import {FaqDetailsComponent} from '@modules/web-app/pages/faq/faq-details/faq-details.component';
import {CreateCategoryComponent} from '@modules/web-app/pages/faq/create-category/create-category.component';
import {CourseComponent} from '@modules/web-app/pages/courses/course/course.component';
import {InstructorComponent} from '@modules/web-app/pages/courses/instructor/instructor.component';
import {CreateCourseComponent} from '@modules/web-app/pages/courses/create-course/create-course.component';
import {RoomComponent} from '@modules/web-app/pages/rooms/room/room.component';
import {CreateRoomComponent} from '@modules/web-app/pages/rooms/create-room/create-room.component';
import {CreateInstructorComponent} from '@modules/web-app/pages/courses/create-instructor/create-instructor.component';
import {UpdateCoursesComponent} from '@modules/web-app/pages/courses/update-courses/update-courses.component';
import {UpdateRoomComponent} from '@modules/web-app/pages/rooms/update-room/update-room.component';
import {CrmNewsComponent} from '@modules/web-app/pages/crm-news/crm-news/crm-news.component';
import {ViewServeyComponent} from '@modules/web-app/pages/servey/view-servey/view-servey.component';
import {ServeyComponent} from '@modules/web-app/pages/servey/servey/servey.component';
import {ServeyVoteComponent} from '@modules/web-app/pages/servey/servey-vote/servey-vote.component';
import {CreateServeyComponent} from '@modules/web-app/pages/servey/create-servey/create-servey.component';
import {UpdateServeyComponent} from '@modules/web-app/pages/servey/update-servey/update-servey.component';
import {PushNotificationComponent} from '@modules/web-app/pages/servey/push-notification/push-notification.component';
import {ActiveSurveyComponent} from '@modules/web-app/pages/servey/active-survey/active-survey.component';
import {MySurveyComponent} from '@modules/web-app/pages/servey/my-survey/my-survey.component';
import {CompletedSurveyComponent} from '@modules/web-app/pages/servey/completed-survey/completed-survey.component';
import {EmailTemplateComponent} from '@modules/web-app/pages/email/email-template/email-template.component';
import {ShowEmailComponent} from '@modules/web-app/pages/email/show-email/show-email.component';
import {UpdateEmailComponent} from '@modules/web-app/pages/email/update-email/update-email.component';
import {CrmSurveyComponent} from '@modules/web-app/pages/crm-survey/crm-survey/crm-survey.component';
import {CrmActiveSurveyComponent} from '@modules/web-app/pages/crm-survey/crm-active-survey/crm-active-survey.component';
import {CrmMyVotesComponent} from '@modules/web-app/pages/crm-survey/crm-my-votes/crm-my-votes.component';
import {CrmCompletedSurveyComponent} from '@modules/web-app/pages/crm-survey/crm-completed-survey/crm-completed-survey.component';
import {CrmSurveyVoteComponent} from '@modules/web-app/pages/crm-survey/crm-survey-vote/crm-survey-vote.component';
import {CrmSurveyViewComponent} from '@modules/web-app/pages/crm-survey/crm-survey-view/crm-survey-view.component';
import {CreateThemeComponent} from '@modules/web-app/pages/theme/create-theme/create-theme.component';
import {UpdateThemeComponent} from '@modules/web-app/pages/theme/update-theme/update-theme.component';
import {UploadCalendarComponent} from '@modules/web-app/pages/events/upload-calendar/upload-calendar.component';
import {ThemesComponent} from '@modules/web-app/pages/theme/themes/themes.component';
import {ThemeOptionComponent} from '@modules/web-app/pages/theme-option/theme-option.component';
import {InstructorDetailsComponent} from '@modules/web-app/pages/courses/instructor-details/instructor-details.component';
import {RoomDetailsComponent} from '@modules/web-app/pages/rooms/room-details/room-details.component';
import {CourseDetailComponent} from '@modules/web-app/pages/courses/course-detail/course-detail.component';
import {SurveyDetailComponent} from '@modules/web-app/pages/servey/survey-detail/survey-detail.component';
import {ComingSoonComponent} from '@shared/pages';
import {GlobalSearchComponent} from '@modules/web-app/common/global-search/global-search.component';
import {BannerListComponent} from '@modules/web-app/pages/banner/banner-list/banner-list.component';
import {CreateBannerComponent} from '@modules/web-app/pages/banner/create-banner/create-banner.component';
import {UpdateBannerComponent} from '@modules/web-app/pages/banner/update-banner/update-banner.component';
import {BannerDetailComponent} from '@modules/web-app/pages/banner/banner-detail/banner-detail.component';
import {BannerStatisticsComponent} from '@modules/web-app/pages/banner/banner-statistics/banner-statistics.component';
import {EventsCalendarComponent} from '@modules/web-app/pages/events/events-calendar/events-calendar.component';
import {NewsListComponent} from '@modules/web-app/pages/news/news-list/news-list.component';
import {EventListComponent} from '@modules/web-app/pages/events/event-list/event-list.component';
import {CourseListComponent} from '@modules/web-app/pages/courses/course-list/course-list.component';
import {RoomListComponent} from '@modules/web-app/pages/rooms/room-list/room-list.component';
import {InstructorListComponent} from '@modules/web-app/pages/courses/instructor-list/instructor-list.component';
import {ServeyListComponent} from '@modules/web-app/pages/servey/servey-list/servey-list.component';
import {HeadlineWordingComponent} from '@modules/web-app/pages/headline-wording/headline-wording.component';
import {MobileThemeComponent} from '@modules/web-app/pages/mobile-theme/mobile-theme.component';
import {TaskListComponent} from '@modules/web-app/pages/tasks/task-list/task-list.component';
import {GroupListComponent} from '@modules/web-app/pages/groups/group-list/group-list.component';
import {FaqsListComponent} from '@modules/web-app/pages/faq/faqs-list/faqs-list.component';
import {AppStoreComponent} from '@modules/web-app/pages/app-store/app-store.component';
import {SharedModule} from '@shared/shared.module';
import { GroupsComponent } from './pages/community/groups/groups.component';

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
        GroupsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        WebAppRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
    ]
})
export class WebAppModule { }
