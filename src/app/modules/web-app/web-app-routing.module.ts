import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSearchComponent } from 'src/app/modules/web-app/common/global-search/global-search.component';
import { LayoutComponent } from 'src/app/modules/web-app/common/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {AuthGuard, MemberLightGuard, MembersGuard, RouteGuard} from '@core/guards';
import {ClubWallComponent} from '@modules/web-app/pages/club-wall/club-wall.component';
import {ClubNewsComponent} from '@modules/web-app/pages/news/club-news/club-news.component';
import {ClubDatesComponent} from '@modules/web-app/pages/club-dates/club-dates.component';
import {ClubEventsComponent} from '@modules/web-app/pages/events/club-events/club-events.component';
import {CommunityComponent} from '@modules/web-app/pages/community/community.component';
import {CommunityMessagesComponent} from '@modules/web-app/pages/messages/community-messages/community-messages.component';
import {ClubMessagesComponent} from '@modules/web-app/pages/messages/club-messages/club-messages.component';
import {GroupMessagesComponent} from '@modules/web-app/pages/messages/group-messages/group-messages.component';
import {PersonalMessagesComponent} from '@modules/web-app/pages/messages/personal-messages/personal-messages.component';
import {CommunityGroupsComponent} from '@modules/web-app/pages/groups/community-groups/community-groups.component';
import {OrganizerComponent} from '@modules/web-app/pages/organizer/organizer.component';
import {OrganizerEventComponent} from '@modules/web-app/pages/events/organizer-event/organizer-event.component';
import {OrganizerTaskComponent} from '@modules/web-app/pages/tasks/organizer-task/organizer-task.component';
import {OrganizerDocumentComponent} from '@modules/web-app/pages/documents/organizer-document/organizer-document.component';
import {CreateEventComponent} from '@modules/web-app/pages/events/create-event/create-event.component';
import {CreateTaskComponent} from '@modules/web-app/pages/tasks/create-task/create-task.component';
import {CreateChatComponent} from '@modules/web-app/pages/create-chat/create-chat.component';
import {CreateNewsComponent} from '@modules/web-app/pages/news/create-news/create-news.component';
import {CreateCourseComponent} from '@modules/web-app/pages/courses/create-course/create-course.component';
import {CreateMessageComponent} from '@modules/web-app/pages/messages/create-message/create-message.component';
import {CreateGroupComponent} from '@modules/web-app/pages/groups/create-group/create-group.component';
import {EmailTemplateComponent} from '@modules/web-app/pages/email/email-template/email-template.component';
import {CreateServeyComponent} from '@modules/web-app/pages/servey/create-servey/create-servey.component';
import {CreateInstructorComponent} from '@modules/web-app/pages/courses/create-instructor/create-instructor.component';
import {CreateRoomComponent} from '@modules/web-app/pages/rooms/create-room/create-room.component';
import {CreateFaqComponent} from '@modules/web-app/pages/faq/create-faq/create-faq.component';
import {CreateCategoryComponent} from '@modules/web-app/pages/faq/create-category/create-category.component';
import {CreateThemeComponent} from '@modules/web-app/pages/theme/create-theme/create-theme.component';
import {CreateBannerComponent} from '@modules/web-app/pages/banner/create-banner/create-banner.component';
import {UpdateCoursesComponent} from '@modules/web-app/pages/courses/update-courses/update-courses.component';
import {UpdateRoomComponent} from '@modules/web-app/pages/rooms/update-room/update-room.component';
import {UpdateServeyComponent} from '@modules/web-app/pages/servey/update-servey/update-servey.component';
import {UpdateEmailComponent} from '@modules/web-app/pages/email/update-email/update-email.component';
import {UpdateThemeComponent} from '@modules/web-app/pages/theme/update-theme/update-theme.component';
import {UpdateNewsComponent} from '@modules/web-app/pages/news/update-news/update-news.component';
import {UpdateTaskComponent} from '@modules/web-app/pages/tasks/update-task/update-task.component';
import {UpdateGroupComponent} from '@modules/web-app/pages/groups/update-group/update-group.component';
import {UpdateEventComponent} from '@modules/web-app/pages/events/update-event/update-event.component';
import {UpdateBannerComponent} from '@modules/web-app/pages/banner/update-banner/update-banner.component';
import {ClubNewsDetailsComponent} from '@modules/web-app/pages/news/club-news-details/club-news-details.component';
import {GroupDetailComponent} from '@modules/web-app/pages/groups/group-detail/group-detail.component';
import {EventDetailComponent} from '@modules/web-app/pages/events/event-detail/event-detail.component';
import {TaskDetailComponent} from '@modules/web-app/pages/tasks/task-detail/task-detail.component';
import {InstructorDetailsComponent} from '@modules/web-app/pages/courses/instructor-details/instructor-details.component';
import {RoomDetailsComponent} from '@modules/web-app/pages/rooms/room-details/room-details.component';
import {CourseDetailComponent} from '@modules/web-app/pages/courses/course-detail/course-detail.component';
import {SurveyDetailComponent} from '@modules/web-app/pages/servey/survey-detail/survey-detail.component';
import {FaqDetailsComponent} from '@modules/web-app/pages/faq/faq-details/faq-details.component';
import {BannerDetailComponent} from '@modules/web-app/pages/banner/banner-detail/banner-detail.component';
import {DashboardEventComponent} from '@modules/web-app/pages/events/dashboard-event/dashboard-event.component';
import {ClubAllNewsComponent} from '@modules/web-app/pages/news/club-all-news/club-all-news.component';
import {VereinsFaqComponent} from '@modules/web-app/pages/faq/vereins-faq/vereins-faq.component';
import {FaqCategoryComponent} from '@modules/web-app/pages/faq/faq-category/faq-category.component';
import {CourseComponent} from '@modules/web-app/pages/courses/course/course.component';
import {InstructorComponent} from '@modules/web-app/pages/courses/instructor/instructor.component';
import {RoomComponent} from '@modules/web-app/pages/rooms/room/room.component';
import {ServeyComponent} from '@modules/web-app/pages/servey/servey/servey.component';
import {ShowEmailComponent} from '@modules/web-app/pages/email/show-email/show-email.component';
import {CrmNewsComponent} from '@modules/web-app/pages/crm-news/crm-news/crm-news.component';
import {ThemesComponent} from '@modules/web-app/pages/theme/themes/themes.component';
import {BannerListComponent} from '@modules/web-app/pages/banner/banner-list/banner-list.component';
import {ViewServeyComponent} from '@modules/web-app/pages/servey/view-servey/view-servey.component';
import {ServeyVoteComponent} from '@modules/web-app/pages/servey/servey-vote/servey-vote.component';
import {CrmSurveyComponent} from '@modules/web-app/pages/crm-survey/crm-survey/crm-survey.component';
import {CrmSurveyViewComponent} from '@modules/web-app/pages/crm-survey/crm-survey-view/crm-survey-view.component';
import {CrmSurveyVoteComponent} from '@modules/web-app/pages/crm-survey/crm-survey-vote/crm-survey-vote.component';
import {BannerStatisticsComponent} from '@modules/web-app/pages/banner/banner-statistics/banner-statistics.component';
import {UploadCalendarComponent} from '@modules/web-app/pages/events/upload-calendar/upload-calendar.component';
import {ContactAdminComponent} from '@modules/web-app/pages/messages/contact-admin/contact-admin.component';
import {ProfileComponent} from '@modules/web-app/pages/profiles/profile/profile.component';
import {ProfileEditComponent} from '@modules/web-app/pages/profiles/profile-edit/profile-edit.component';
import {ProfileBankComponent} from '@modules/web-app/pages/profiles/profile-bank/profile-bank.component';
import {ProfileBankEditComponent} from '@modules/web-app/pages/profiles/profile-bank-edit/profile-bank-edit.component';
import {ProfileClubComponent} from '@modules/web-app/pages/profiles/profile-club/profile-club.component';
import {ProfileMyClubComponent} from '@modules/web-app/pages/profiles/profile-my-club/profile-my-club.component';
import {MemberProfileComponent} from '@modules/web-app/pages/profiles/member-profile/member-profile.component';
import {ThemeOptionComponent} from '@modules/web-app/pages/theme-option/theme-option.component';
import {ComingSoonComponent} from '@shared/pages';
import {EventsCalendarComponent} from '@modules/web-app/pages/events/events-calendar/events-calendar.component';
import {NewsListComponent} from '@modules/web-app/pages/news/news-list/news-list.component';
import {EventListComponent} from '@modules/web-app/pages/events/event-list/event-list.component';
import {CourseListComponent} from '@modules/web-app/pages/courses/course-list/course-list.component';
import {RoomListComponent} from '@modules/web-app/pages/rooms/room-list/room-list.component';
import {InstructorListComponent} from '@modules/web-app/pages/courses/instructor-list/instructor-list.component';
import {ServeyListComponent} from '@modules/web-app/pages/servey/servey-list/servey-list.component';
import {TaskListComponent} from '@modules/web-app/pages/tasks/task-list/task-list.component';
import {GroupListComponent} from '@modules/web-app/pages/groups/group-list/group-list.component';
import {FaqsListComponent} from '@modules/web-app/pages/faq/faqs-list/faqs-list.component';
import {HeadlineWordingComponent} from '@modules/web-app/pages/headline-wording/headline-wording.component';
import {MobileThemeComponent} from '@modules/web-app/pages/mobile-theme/mobile-theme.component';
import {AppStoreComponent} from '@modules/web-app/pages/app-store/app-store.component';
import {PageNotFoundComponent} from '@modules/web-app/shared/page-not-found/page-not-found.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
            { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
            {
                path: 'clubwall', component: ClubWallComponent, children: [
                    { path: 'club-news', component: ClubNewsComponent },
                    { path: 'club-dates', component: ClubDatesComponent },
                    { path: 'club-events', component: ClubEventsComponent }
                ]
            },
            {
                path: 'community', component: CommunityComponent, data: { title: 'Community' }, children: [
                    { path: 'community-messages', component: CommunityMessagesComponent },
                    { path: 'chat/:id', component: CommunityMessagesComponent },
                    { path: 'club-msg', component: ClubMessagesComponent },
                    { path: 'group-msg', component: GroupMessagesComponent },
                    { path: 'personal-msg', component: PersonalMessagesComponent },
                    { path: 'community-groups', component: CommunityGroupsComponent },
                    { path: 'groups', component: CommunityGroupsComponent },
                    { path: 'groups-joined', component: CommunityGroupsComponent },
                ]
            },
            // { path: 'chat/:id', component: MchatComponent },
            {
                path: 'organizer', component: OrganizerComponent, data: { title: 'Organizer' }, children: [
                    { path: 'organizer-event', component: OrganizerEventComponent },
                    { path: 'organizer-task', component: OrganizerTaskComponent },
                    { path: 'organizer-documents', component: OrganizerDocumentComponent },
                ]
            },
            { path: 'create-event', component: CreateEventComponent, canActivate: [MemberLightGuard], data: { title: 'Create Event', allow_permission: ['create'] } },
            { path: 'create-task', component: CreateTaskComponent, canActivate: [MemberLightGuard], data: { title: 'Create Task', allow_permission: ['create'] } },
            { path: 'create-chat', component: CreateChatComponent, canActivate: [MemberLightGuard], data: { title: 'Create Chat', allow_permission: ['create'] } },
            { path: 'create-news', component: CreateNewsComponent, data: { title: 'Create News', allow_permission: ['create'] } },
            { path: 'create-course', component: CreateCourseComponent, canActivate: [MemberLightGuard], data: { title: 'Create Course', allow_permission: ['create'] } },
            { path: 'create-message', component: CreateMessageComponent, canActivate: [RouteGuard, MemberLightGuard, MembersGuard], data: { title: 'Create Message', allow_permission: ['create'] } },
            { path: 'create-group', component: CreateGroupComponent, canActivate: [MemberLightGuard], data: { title: 'Create Group', allow_permission: ['create'] } },
            { path: 'create-email-template', component: EmailTemplateComponent, canActivate: [MemberLightGuard], data: { title: 'Create Event', allow_permission: ['create'] } },
            { path: 'create-survey', component: CreateServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Create Survey', allow_permission: ['create'] } },
            { path: 'create-instructor', component: CreateInstructorComponent, canActivate: [MemberLightGuard], data: { title: 'Create Instructor', allow_permission: ['create'] } },
            { path: 'create-room', component: CreateRoomComponent, canActivate: [MemberLightGuard], data: { title: 'Create Room', allow_permission: ['create'] } },
            { path: 'create-faq', component: CreateFaqComponent, canActivate: [MemberLightGuard], data: { title: 'Create Faq', allow_permission: ['create'] } },
            { path: 'create-category', component: CreateCategoryComponent, canActivate: [MemberLightGuard], data: { title: 'Create Category', allow_permission: ['create'] } },
            { path: 'create-theme', component: CreateThemeComponent, canActivate: [MemberLightGuard], data: { title: 'Create Theme', allow_permission: ['create'] } },
            { path: 'create-banner', component: CreateBannerComponent, canActivate: [MemberLightGuard], data: { title: 'Create Banner', allow_permission: ['create'] } },

            { path: 'update-course/:courseId', component: UpdateCoursesComponent, canActivate: [MemberLightGuard], data: { title: 'Update Course', allow_permission: ['create'] } },
            { path: 'update-room/:roomId', component: UpdateRoomComponent, canActivate: [MemberLightGuard], data: { title: 'Update Room', allow_permission: ['create'] } },
            { path: 'update-survey/:surveyId', component: UpdateServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Update Survey', allow_permission: ['create'] } },
            { path: 'update-email/:emailId', component: UpdateEmailComponent, canActivate: [MemberLightGuard], data: { title: 'Update Email', allow_permission: ['create'] } },
            { path: 'update-theme/:clubThemeId', component: UpdateThemeComponent, canActivate: [MemberLightGuard], data: { title: 'Update Theme', allow_permission: ['create'] } },
            { path: 'update-news/:newsid', component: UpdateNewsComponent, canActivate: [MemberLightGuard], data: { title: 'Update News', allow_permission: ['create'] } },
            { path: 'update-task/:taskId', component: UpdateTaskComponent, canActivate: [MemberLightGuard], data: { title: 'Update Task', allow_permission: ['create'] } },
            { path: 'update-group/:groupId', component: UpdateGroupComponent, canActivate: [MemberLightGuard], data: { title: 'Update Group', allow_permission: ['create'] } },
            { path: 'update-event/:eventId', component: UpdateEventComponent, canActivate: [MemberLightGuard], data: { title: 'Update Event', allow_permission: ['create'] } },
            { path: 'update-banner/:bannerId', component: UpdateBannerComponent, canActivate: [MemberLightGuard], data: { title: 'Update Banner', allow_permission: ['create'] } },

            { path: 'clubnews-detail/:newsid', component: ClubNewsDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'group-detail/:groupid', component: GroupDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Group Detail', allow_permission: ['participate'] } },
            { path: 'event-detail/:eventid', component: EventDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Event Detail', allow_permission: ['participate'] } },
            { path: 'task-detail/:taskid', component: TaskDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Task Detail', allow_permission: ['participate'] } },
            { path: 'instructor-detail/:instructorId', component: InstructorDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Instructor Detail', allow_permission: ['participate'] } },
            { path: 'room-detail/:roomId', component: RoomDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Room Detail', allow_permission: ['participate'] } },
            { path: 'course-detail/:courseId', component: CourseDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Course Detail', allow_permission: ['participate'] } },
            { path: 'survey-detail/:surveyId', component: SurveyDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Detail', allow_permission: ['participate'] } },
            { path: 'vereins-faq-detail/:faqId', component: FaqDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Vereins Faq Detail', allow_permission: ['participate'] } },
            { path: 'banner-detail/:bannerId', component: BannerDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Banner Detail', allow_permission: ['participate'] } },

            { path: 'dashboard-event', component: DashboardEventComponent, canActivate: [MemberLightGuard], data: { title: 'Dashboard Event', allow_permission: ['participate'] } },
            { path: 'clubwall-news/:pageId', component: ClubAllNewsComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'vereins-faq', component: VereinsFaqComponent, data: { title: 'Vereins Faq' } },
            { path: 'faq-category', component: FaqCategoryComponent, canActivate: [MemberLightGuard], data: { title: 'Faq Category', allow_permission: ['participate'] } },
            { path: 'course', component: CourseComponent, data: { title: 'Course' } },
            { path: 'instructor', component: InstructorComponent, canActivate: [MemberLightGuard], data: { title: 'Instructor', allow_permission: ['participate'] } },
            { path: 'room', component: RoomComponent, canActivate: [MemberLightGuard], data: { title: 'Room', allow_permission: ['participate'] } },
            { path: 'survey', component: ServeyComponent, data: { title: 'Survey' } },
            { path: 'show-email', component: ShowEmailComponent, canActivate: [MemberLightGuard], data: { title: 'Show Email', allow_permission: ['create'] } },
            { path: 'crm-news', component: CrmNewsComponent, data: { title: 'CRM news' } },
            { path: 'themes', component: ThemesComponent, canActivate: [MemberLightGuard], data: { title: 'Display Themes', allow_permission: ['create'] } },
            { path: 'banner-list', component: BannerListComponent, canActivate: [MemberLightGuard], data: { title: 'Display Banners', allow_permission: ['create'] } },

            { path: 'view-survey/:surveyId', component: ViewServeyComponent, canActivate: [MemberLightGuard], data: { title: 'View Survey', allow_permission: ['participate'] } },
            { path: 'survey-vote/:surveyId', component: ServeyVoteComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Vote', allow_permission: ['participate'] } },
            { path: 'crm-survey', component: CrmSurveyComponent, data: { title: 'CRM Survey' } },
            { path: 'crm-view-survey/:surveyId', component: CrmSurveyViewComponent, canActivate: [MemberLightGuard], data: { title: 'View Survey', allow_permission: ['participate'] } },
            { path: 'crm-survey-vote/:surveyId', component: CrmSurveyVoteComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Vote', allow_permission: ['participate'] } },
            { path: 'banner-statistics', component: BannerStatisticsComponent, canActivate: [MemberLightGuard], data: { title: 'Banner Statistics', allow_permission: ['participate'] } },

            { path: 'upload-calendar', component: UploadCalendarComponent, canActivate: [MemberLightGuard], data: { title: 'Upload Calendar', allow_permission: ['create'] } },
            { path: 'search/:searchValue', component: GlobalSearchComponent, data: { title: 'Global Search' } },
            { path: 'contact-admin', component: ContactAdminComponent, canActivate: [MemberLightGuard], data: { title: 'Contact Admin', allow_permission: ['create'] } },

            { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
            { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
            { path: 'edit-profile', component: ProfileEditComponent, data: { title: 'Edit Profile' } },
            { path: 'profile-bank', component: ProfileBankComponent, data: { title: 'Profile Bank' } },
            { path: 'profile-edit-bank', component: ProfileBankEditComponent, data: { title: 'Profile Bank Edit' } },
            { path: 'profile-club', component: ProfileClubComponent, data: { title: 'Profile Club' } },
            { path: 'profile-my-club', component: ProfileMyClubComponent, data: { title: 'Profile My Club' } },
            { path: 'member-profile/:database_id/:team_id/:member_id', component: MemberProfileComponent },
            { path: 'theme-option', component: ThemeOptionComponent },
            { path: 'coming_soon', component: ComingSoonComponent },
            { path: 'event-calendar', component: EventsCalendarComponent },

            { path: 'all-list', component: NewsListComponent, data: { title: 'Club News List' } },
            { path: 'list/event-list', component: EventListComponent, data: { title: 'Event List' } },
            { path: 'course-list', component: CourseListComponent, data: { title: 'Course List' } },
            { path: 'room-list', component: RoomListComponent, data: { title: 'Room List' } },
            { path: 'instructor-list', component: InstructorListComponent, data: { title: 'Instructor List' } },
            { path: 'survey-list', component: ServeyListComponent, data: { title: 'Survey List' } },
            { path: 'task-list', component: TaskListComponent, data: { title: 'Task List' } },
            { path: 'group-list', component: GroupListComponent, data: { title: 'Group List' } },
            { path: 'faqs-list', component: FaqsListComponent, data: { title: 'Faq List' } },

            { path: 'headline-wording', component: HeadlineWordingComponent, data: { title: 'Headline Wording' } },
            { path: 'mobile-themes', component: MobileThemeComponent, data: { title: 'Mobile Themes' } },
            { path: 'app-store', component: AppStoreComponent, data: { title: 'App Store' } },

        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebAppRoutingModule { }
