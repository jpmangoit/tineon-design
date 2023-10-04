import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSearchComponent } from 'src/app/modules/web-app/common/global-search/global-search.component';
import { LayoutComponent } from 'src/app/modules/web-app/common/layout/layout.component';
import { PageNotFoundComponent } from 'src/app/modules/web-app/common/page-not-found/page-not-found.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { MemberLightGuard } from 'src/app/guard/member-light.guard';
import { MembersGuard } from 'src/app/guard/members.guard';
import { RouteGuard } from 'src/app/guard/route.guard';
import { ComingSoonComponent } from 'src/app/shared/coming-soon/coming-soon.component';
import { AppStoreComponent } from './app-store/app-store.component';
import { BannerDetailComponent } from './banner/banner-detail/banner-detail.component';
import { BannerListComponent } from './banner/banner-list/banner-list.component';
import { BannerStatisticsComponent } from './banner/banner-statistics/banner-statistics.component';
import { CreateBannerComponent } from './banner/create-banner/create-banner.component';
import { UpdateBannerComponent } from './banner/update-banner/update-banner.component';
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
import { CrmSurveyViewComponent } from './crm-survey/crm-survey-view/crm-survey-view.component';
import { CrmSurveyVoteComponent } from './crm-survey/crm-survey-vote/crm-survey-vote.component';
import { CrmSurveyComponent } from './crm-survey/crm-survey/crm-survey.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { CreateServeyComponent } from './servey/create-servey/create-servey.component';
import { ServeyListComponent } from './servey/servey-list/servey-list.component';
import { ServeyVoteComponent } from './servey/servey-vote/servey-vote.component';
import { ServeyComponent } from './servey/servey/servey.component';
import { SurveyDetailComponent } from './servey/survey-detail/survey-detail.component';
import { UpdateServeyComponent } from './servey/update-servey/update-servey.component';
import { ViewServeyComponent } from './servey/view-servey/view-servey.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { OrganizerTaskComponent } from './tasks/organizer-task/organizer-task.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { UpdateTaskComponent } from './tasks/update-task/update-task.component';
import { ThemeOptionComponent } from './theme-option/theme-option.component';
import { CreateThemeComponent } from './theme/create-theme/create-theme.component';
import { ThemesComponent } from './theme/themes/themes.component';
import { UpdateThemeComponent } from './theme/update-theme/update-theme.component';

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
