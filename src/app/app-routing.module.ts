import { NgModule } from '@angular/core';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LayoutComponent } from './common/layout/layout.component';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { ClubWallComponent } from './member/club-wall/club-wall.component';
import { ClubNewsDetailsComponent } from './member/news/club-news-details/club-news-details.component';
import { ClubAllNewsComponent } from './member/news/club-all-news/club-all-news.component';
import { CommunityComponent } from './member/community/community.component';
import { DashboardComponent } from './member/dashboard/dashboard.component';
import { OrganizerComponent } from './member/organizer/organizer.component';
import { ProfileClubComponent } from './member/profiles/profile-club/profile-club.component';
import { ProfileBankComponent } from './member/profiles/profile-bank/profile-bank.component';
import { ProfileBankEditComponent } from './member/profiles/profile-bank-edit/profile-bank-edit.component';
import { ProfileEditComponent } from './member/profiles/profile-edit/profile-edit.component';
import { ProfileComponent } from './member/profiles/profile/profile.component';
import { ProfileMyClubComponent } from './member/profiles/profile-my-club/profile-my-club.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { CreateEventComponent } from './member/events/create-event/create-event.component';
import { CreateTaskComponent } from './member/tasks/create-task/create-task.component';
import { CreateNewsComponent } from './member/news/create-news/create-news.component';
import { CreateChatComponent } from './member/create-chat/create-chat.component';
import { CreateMessageComponent } from './member/messages/create-message/create-message.component';
import { CreateGroupComponent } from './member/groups/create-group/create-group.component';
import { GroupDetailComponent } from './member/groups/group-detail/group-detail.component';
import { EventDetailComponent } from './member/events/event-detail/event-detail.component';
import { TaskDetailComponent } from './member/tasks/task-detail/task-detail.component';
import { UpdateNewsComponent } from './member/news/update-news/update-news.component';
import { UpdateEventComponent } from './member/events/update-event/update-event.component';
import { UpdateGroupComponent } from './member/groups/update-group/update-group.component';
import { UpdateTaskComponent } from './member/tasks/update-task/update-task.component';
import { ClubNewsComponent } from './member/news/club-news/club-news.component';
import { ClubDatesComponent } from './member/club-dates/club-dates.component';
import { CommunityMessagesComponent } from './member/messages/community-messages/community-messages.component';
import { CommunityGroupsComponent } from './member/groups/community-groups/community-groups.component';
import { OrganizerEventComponent } from './member/events/organizer-event/organizer-event.component';
import { OrganizerTaskComponent } from './member/tasks/organizer-task/organizer-task.component';
import { OrganizerDocumentComponent } from './member/documents/organizer-document/organizer-document.component';
import { GroupMessagesComponent } from './member/messages/group-messages/group-messages.component';
import { PersonalMessagesComponent } from './member/messages/personal-messages/personal-messages.component';
import { ClubMessagesComponent } from './member/messages/club-messages/club-messages.component';
import { ContactAdminComponent } from './member/messages/contact-admin/contact-admin.component';
import { MemberProfileComponent } from './member/profiles/member-profile/member-profile.component';
import { DashboardEventComponent } from './member/events/dashboard-event/dashboard-event.component';
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
import { ServeyComponent } from './member/servey/servey/servey.component';
import { ViewServeyComponent } from './member/servey/view-servey/view-servey.component';
import { ServeyVoteComponent } from './member/servey/servey-vote/servey-vote.component';
import { CreateServeyComponent } from './member/servey/create-servey/create-servey.component';
import { UpdateServeyComponent } from './member/servey/update-servey/update-servey.component';
import { EmailTemplateComponent } from './member/email/email-template/email-template.component';
import { ShowEmailComponent } from './member/email/show-email/show-email.component';
import { UpdateEmailComponent } from './member/email/update-email/update-email.component';
import { CrmSurveyComponent } from './member/crm-survey/crm-survey/crm-survey.component';
import { CrmSurveyViewComponent } from './member/crm-survey/crm-survey-view/crm-survey-view.component';
import { CrmSurveyVoteComponent } from './member/crm-survey/crm-survey-vote/crm-survey-vote.component';
import { CreateThemeComponent } from './member/theme/create-theme/create-theme.component';
import { UpdateThemeComponent } from './member/theme/update-theme/update-theme.component';
import { UploadCalendarComponent } from './member/events/upload-calendar/upload-calendar.component';
import { ThemesComponent } from './member/theme/themes/themes.component';
import { RouteGuard } from './guard/route.guard';
import { MembersGuard } from './guard/members.guard';
import { ClubEventsComponent } from './member/events/club-events/club-events.component';
import { ThemeOptionComponent } from './member/theme-option/theme-option.component';
// mobile app routing
import { MDashboardComponent } from './mobile-app/pages/m-dashboard/m-dashboard.component';
import { MLayoutComponent } from './mobile-app/shared/m-layout/m-layout.component';
import { MclubwallComponent } from './mobile-app/pages/mclubwall/mclubwall.component';
import { MclubNewsComponent } from './mobile-app/pages/mnews/mclub-news/mclub-news.component';
import { MclubDatesComponent } from './mobile-app/pages/mnews/mclub-dates/mclub-dates.component';
import { McommunityComponent } from './mobile-app/pages/mcommunity/mcommunity.component';
import { McommunityGroupsComponent } from './mobile-app/pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import { MchatComponent } from './mobile-app/pages/mmessages/mchat/mchat.component';
import { McommunityMessagesComponent } from './mobile-app/pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import { MsurveyComponent } from './mobile-app/pages/survey/msurvey/msurvey.component';
import { MactiveSurveyComponent } from './mobile-app/pages/survey/mactive-survey/mactive-survey.component';
import { McompletedSurveyComponent } from './mobile-app/pages/survey/mcompleted-survey/mcompleted-survey.component';
import { MmySurveyComponent } from './mobile-app/pages/survey/mmy-survey/mmy-survey.component';
import { MorganizerComponent } from './mobile-app/pages/morganizer/morganizer.component';
import { MorganizerTaskComponent } from './mobile-app/pages/mtasks/morganizer-task/morganizer-task.component';
import { MorganizerEventsComponent } from './mobile-app/pages/mevents/morganizer-events/morganizer-events.component';
import { MorganizerDocumentsComponent } from './mobile-app/pages/mdocuments/morganizer-documents/morganizer-documents.component';
import { McourseComponent } from './mobile-app/pages/mcourses/mcourse/mcourse.component';
import { ApplicationstateService } from './service/applicationstate.service';
import { MallEventsComponent } from './mobile-app/pages/mevents/mall-events/mall-events.component';
import { McrmSurveyComponent } from './mobile-app/pages/crm-survey/mcrm-survey/mcrm-survey.component';
import { MvereinsFaqComponent } from './mobile-app/pages/mfaq/mvereins-faq/mvereins-faq.component';
import { InstructorDetailsComponent } from './member/courses/instructor-details/instructor-details.component';
import { RoomDetailsComponent } from './member/rooms/room-details/room-details.component';
import { MfaqCategoryComponent } from './mobile-app/pages/mfaq/mfaq-category/mfaq-category.component';
import { CourseDetailComponent } from './member/courses/course-detail/course-detail.component';
import { SurveyDetailComponent } from './member/servey/survey-detail/survey-detail.component';
import { MprofileQrComponent } from './mobile-app/pages/mprofile-qr/mprofile-qr.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { GlobalSearchComponent } from './common/global-search/global-search.component';
import { MemberLightGuard } from './guard/member-light.guard';
import { MprofileComponent } from './mobile-app/pages/mprofile/mprofile/mprofile.component';
import { MgeneralInformationComponent } from './mobile-app/pages/mprofile/mgeneral-information/mgeneral-information.component';
import { MmemberProfileComponent } from './mobile-app/pages/mprofile/mmember-profile/mmember-profile.component';
import { MprofileClubComponent } from './mobile-app/pages/mprofile/mprofile-club/mprofile-club.component';
import { MprofileBankComponent } from './mobile-app/pages/mprofile/mprofile-bank/mprofile-bank.component';
import { MprofileMyClubComponent } from './mobile-app/pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import { MprofileBankEditComponent } from './mobile-app/pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import { MprofileEditComponent } from './mobile-app/pages/mprofile/mprofile-edit/mprofile-edit.component';
import { CreateBannerComponent } from './member/banner/create-banner/create-banner.component';
import { BannerListComponent } from './member/banner/banner-list/banner-list.component';
import { UpdateBannerComponent } from './member/banner/update-banner/update-banner.component';
import { BannerDetailComponent } from './member/banner/banner-detail/banner-detail.component';
import { BannerStatisticsComponent } from './member/banner/banner-statistics/banner-statistics.component';
import { MbannerlistComponent } from './mobile-app/pages/mbanner/mbannerlist/mbannerlist.component';
import { EventsCalendarComponent } from './member/events/events-calendar/events-calendar.component';
import { NewsListComponent } from './member/news/news-list/news-list.component';
import { EventListComponent } from './member/events/event-list/event-list.component';
import { CourseListComponent } from './member/courses/course-list/course-list.component';
import { RoomListComponent } from './member/rooms/room-list/room-list.component';
import { InstructorListComponent } from './member/courses/instructor-list/instructor-list.component';
import { ServeyListComponent } from './member/servey/servey-list/servey-list.component';
import { HeadlineWordingComponent } from './member/headline-wording/headline-wording.component';
import { MobileThemeComponent } from './member/mobile-theme/mobile-theme.component';
import { TaskListComponent } from './member/tasks/task-list/task-list.component';
import { GroupListComponent } from './member/groups/group-list/group-list.component';
import { FaqsListComponent } from './member/faq/faqs-list/faqs-list.component';
import { AppStoreComponent } from './member/app-store/app-store.component';
import { MEmailComponent } from './mobile-app/shared/m-email/m-email.component';
import { MclubEventsComponent } from './mobile-app/pages/mevents/mclub-events/mclub-events.component';
import { MeventDetailComponent } from './mobile-app/pages/mevents/mevent-detail/mevent-detail.component';
import { MorganizerTaskDetailsComponent } from './mobile-app/pages/mtasks/morganizer-task-details/morganizer-task-details.component';


var userDetails = JSON.parse(localStorage.getItem('user-data'));

const desktop_routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        data: { title: 'Recover Password' }
    },
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
                    { path: 'chat', component: CommunityMessagesComponent },
                    { path: 'club-msg', component: ClubMessagesComponent },
                    { path: 'group-msg', component: GroupMessagesComponent },
                    { path: 'personal-msg', component: PersonalMessagesComponent },
                    { path: 'community-groups', component: CommunityGroupsComponent },
                    { path: 'groups', component: CommunityGroupsComponent },
                    { path: 'groups-joined', component: CommunityGroupsComponent },
                ]
            },
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

const mobile_routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    { path: 'recover-password',component: RecoverPasswordComponent,data: { title: 'Recover Password' }},
    { path: 'email', component: MEmailComponent, data: { title: 'Email' } },

    // mobile routing start
    {
        path: '', component: MLayoutComponent, canActivate: [AuthGuard], children: [
            { path: '', component: MDashboardComponent, data: { title: 'MDashboard' } },
            { path: 'dashboard', component: MDashboardComponent, data: { title: 'MDashboard' } },
            {
                path: 'clubwall', component: MclubwallComponent, children: [
                    { path: 'club-news', component: MclubNewsComponent },
                    { path: 'club-dates', component: MclubDatesComponent },
                    { path: 'club-events',component:MorganizerEventsComponent}
                    // { path: 'club-events',component:MclubEventsComponent}
                ]
            },
            {
                path: 'community', component: McommunityComponent, children: [
                    { path: 'community-groups', component: McommunityGroupsComponent },
                    { path: 'community-messages', component: McommunityMessagesComponent },
                    // { path: 'community-groups', component: CommunityGroupsComponent },
                    { path: 'groups', component: CommunityGroupsComponent },
                    { path: 'groups-joined', component: CommunityGroupsComponent },
                ]
            },
            { path: 'chat/:id', component: MchatComponent },
            {
                path: 'survey', component: MsurveyComponent, children: [
                    { path: 'active-survey', component: MactiveSurveyComponent },
                    { path: 'completed-survey', component: McompletedSurveyComponent },
                    { path: 'my-survey', component: MmySurveyComponent },
                ]
            },
            {
                path: 'organizer', component: MorganizerComponent, children: [
                    { path: 'organizer-task', component: MorganizerTaskComponent },
                    { path: 'organizer-event', component: MorganizerEventsComponent },
                    { path: 'organizer-documents', component: MorganizerDocumentsComponent },
                ]
            },
            { path: 'create-email-template', component: EmailTemplateComponent, canActivate: [MemberLightGuard], data: { title: 'Create Event', allow_permission: ['create'] } },
            { path: 'create-event', component: CreateEventComponent, canActivate: [MemberLightGuard], data: { title: 'Create Event', allow_permission: ['create'] } },
            { path: 'create-task', component: CreateTaskComponent, canActivate: [MemberLightGuard], data: { title: 'Create Task', allow_permission: ['create'] } },
            { path: 'create-chat', component: CreateChatComponent, canActivate: [MemberLightGuard], data: { title: 'Create Chat', allow_permission: ['create'] } },
            { path: 'create-news', component: CreateNewsComponent, canActivate: [MemberLightGuard], data: { title: 'Create News', allow_permission: ['create'] } },
            { path: 'create-message', component: CreateMessageComponent, canActivate: [RouteGuard, MembersGuard, MemberLightGuard], data: { title: 'Create Message', allow_permission: ['create'] } },
            { path: 'create-group', component: CreateGroupComponent, canActivate: [RouteGuard, MemberLightGuard], data: { title: 'Create Group', allow_permission: ['create'] } },
            { path: 'create-faq', component: CreateFaqComponent, canActivate: [MemberLightGuard], data: { title: 'Create Faq', allow_permission: ['create'] } },
            { path: 'create-category', component: CreateCategoryComponent, canActivate: [MemberLightGuard], data: { title: 'Create Category', allow_permission: ['create'] } },
            { path: 'create-course', component: CreateCourseComponent, canActivate: [MemberLightGuard], data: { title: 'Create Course', allow_permission: ['create'] } },
            { path: 'create-room', component: CreateRoomComponent, canActivate: [MemberLightGuard], data: { title: 'Create Room', allow_permission: ['create'] } },
            { path: 'create-instructor', component: CreateInstructorComponent, canActivate: [MemberLightGuard], data: { title: 'Create Instructor', allow_permission: ['create'] } },
            { path: 'create-survey', component: CreateServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Create Survey', allow_permission: ['create'] } },
            { path: 'create-theme', component: CreateThemeComponent, canActivate: [MemberLightGuard], data: { title: 'Create Theme', allow_permission: ['create'] } },
            { path: 'create-banner', component: CreateBannerComponent, canActivate: [MemberLightGuard], data: { title: 'Create Banner', allow_permission: ['create'] } },

            { path: 'update-task/:taskId', component: UpdateTaskComponent, canActivate: [MemberLightGuard], data: { title: 'Update Task', allow_permission: ['create'] } },
            { path: 'update-group/:groupId', component: UpdateGroupComponent, canActivate: [MemberLightGuard], data: { title: 'Update Group', allow_permission: ['create'] } },
            { path: 'update-course/:courseId', component: UpdateCoursesComponent, canActivate: [MemberLightGuard], data: { title: 'Update Course', allow_permission: ['create'] } },
            { path: 'update-room/:roomId', component: UpdateRoomComponent, canActivate: [MemberLightGuard], data: { title: 'Update Room', allow_permission: ['create'] } },
            { path: 'update-survey/:surveyId', component: UpdateServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Update Survey', allow_permission: ['create'] } },
            { path: 'update-email/:emailId', component: UpdateEmailComponent, canActivate: [MemberLightGuard], data: { title: 'Update Email', allow_permission: ['create'] } },
            { path: 'update-theme/:clubThemeId', component: UpdateThemeComponent, canActivate: [MemberLightGuard], data: { title: 'Update Theme', allow_permission: ['create'] } },
            { path: 'update-event/:eventId', component: UpdateEventComponent, canActivate: [MemberLightGuard], data: { title: 'Update Event', allow_permission: ['create'] } },
            { path: 'update-news/:newsid', component: UpdateNewsComponent, canActivate: [MemberLightGuard], data: { title: 'Update News', allow_permission: ['create'] } },
            { path: 'update-survey/:surveyId', component: UpdateServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Update Survey', allow_permission: ['create'] } },
            { path: 'update-banner/:bannerId', component: UpdateBannerComponent, canActivate: [MemberLightGuard], data: { title: 'Update Banner', allow_permission: ['create'] } },

            { path: 'task-detail/:taskid', component: MorganizerTaskDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Morganizer-Task-Detail', allow_permission: ['participate']}},
            { path: 'group-detail/:groupid', component: GroupDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Group Detail', allow_permission: ['participate'] } },
            { path: 'instructor-detail/:instructorId', component: InstructorDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Instructor Detail', allow_permission: ['participate'] } },
            { path: 'task-detail/:taskid', component: TaskDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Task Detail', allow_permission: ['participate'] } },
            { path: 'event-detail/:eventid', component: MeventDetailComponent,canActivate:[MemberLightGuard], data: { title: 'Event Detail' ,allow_permission:['participate']} },
            // { path: 'event-detail/:eventid', component: EventDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Event Detail', allow_permission: ['participate'] } },
            { path: 'group-detail/:groupid', component: GroupDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Group Detail', allow_permission: ['participate'] } },
            { path: 'room-detail/:roomId', component: RoomDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Room Detail', allow_permission: ['participate'] } },
            { path: 'clubnews-detail/:newsid', component: ClubNewsDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'vereins-faq-detail/:faqId', component: FaqDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Vereins Faq', allow_permission: ['participate'] } },
            { path: 'course-detail/:courseId', component: CourseDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Course Detail', allow_permission: ['participate'] } },
            { path: 'survey-detail/:surveyId', component: SurveyDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Detail', allow_permission: ['participate'] } },
            { path: 'banner-detail/:bannerId', component: BannerDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Banner Detail', allow_permission: ['participate'] } },

            { path: 'crm-survey-vote/:surveyId', component: CrmSurveyVoteComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Vote', allow_permission: ['participate'] } },
            { path: 'themes', component: ThemesComponent, canActivate: [MemberLightGuard], data: { title: 'Display Themes', allow_permission: ['participate'] } },
            { path: 'course', component: McourseComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'all-event', component: MallEventsComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'show-email', component: ShowEmailComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['create'] } },
            { path: 'clubwall-news/:pageId', component: ClubAllNewsComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['participate'] } },
            { path: 'view-survey/:surveyId', component: ViewServeyComponent, canActivate: [MemberLightGuard], data: { title: 'View Survey', allow_permission: ['participate'] } },
            { path: 'survey-vote/:surveyId', component: ServeyVoteComponent, canActivate: [MemberLightGuard], data: { title: 'Servey Vote', allow_permission: ['participate'] } },
            { path: 'instructor', component: InstructorComponent, canActivate: [MemberLightGuard], data: { title: 'Instructor', allow_permission: ['participate'] } },
            { path: 'room', component: RoomComponent, canActivate: [MemberLightGuard], data: { title: 'Room', allow_permission: ['participate'] } },
            { path: 'survey', component: ServeyComponent, canActivate: [MemberLightGuard], data: { title: 'Survey', allow_permission: ['participate'] } },
            { path: 'crm-news', component: CrmNewsComponent, data: { title: 'CRM news' } },
            { path: 'crm-view-survey/:surveyId', component: CrmSurveyViewComponent, canActivate: [MemberLightGuard], data: { title: 'View Survey', allow_permission: ['participate'] } },
            { path: 'upload-calendar', component: UploadCalendarComponent, canActivate: [MemberLightGuard], data: { title: 'Upload Calendar', allow_permission: ['create'] } },
            { path: 'contact-admin', component: ContactAdminComponent, canActivate: [MemberLightGuard], data: { title: 'News', allow_permission: ['create'] } },
            // { path: 'banner-list', component: BannerListComponent, canActivate:[MemberLightGuard],data: { title: 'Display Banners',allow_permission:['create']} },

            // { path: 'vereins-faq', component: VereinsFaqComponent,canActivate:[MemberLightGuard], data: { title: 'Vereins Faq' ,allow_permission:['participate']} },
            { path: 'vereins-faq', component: MvereinsFaqComponent, canActivate: [MemberLightGuard], data: { title: 'Vereins Faq', allow_permission: ['participate'] } },
            // { path: 'crm-survey', component: CrmSurveyComponent,canActivate:[MemberLightGuard], data: { title: 'CRM Survey' ,allow_permission:['participate']} },
            { path: 'crm-survey', component: McrmSurveyComponent, data: { title: 'CRM Survey' } },
            // { path: 'faq-category', component: FaqCategoryComponent,canActivate:[MemberLightGuard], data: { title: 'Faq Category' ,allow_permission:['participate']} },
            { path: 'faq-category', component: MfaqCategoryComponent, canActivate: [MemberLightGuard], data: { title: 'Faq Category', allow_permission: ['participate'] } },

            { path: 'profile-qr', component: MprofileQrComponent },
            { path: 'theme-option', component: ThemeOptionComponent },
            { path: 'dashboard-event', component: DashboardEventComponent },

            { path: 'profile-club', component: MprofileClubComponent },
            { path: 'profile-bank', component: MprofileBankComponent },
            { path: 'profile-my-club', component: MprofileMyClubComponent },
            { path: 'profile', component: MprofileComponent },
            { path: 'general-information', component: MgeneralInformationComponent },
            { path: 'profile-edit-bank', component: MprofileBankEditComponent, data: { title: 'Profile Bank Edit' } },
            { path: 'edit-profile', component: MprofileEditComponent },
            { path: 'member-profile/:database_id/:team_id/:member_id', component: MmemberProfileComponent },
            { path: 'coming_soon', component: ComingSoonComponent },
            { path: 'banner-list', component: MbannerlistComponent, canActivate: [MemberLightGuard], data: { title: 'Display Banners', allow_permission: ['create'] } },
            { path: 'app-store', component: AppStoreComponent, data: { title: 'App Store' } },

        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    // imports: [
    // 	RouterModule.forRoot(routes),
    // ],

    // exports: [RouterModule]

    // as default we set the desktop routing configuration. if mobile will be started it will be replaced below.
    // note that we must specify some routes here (not an empty array) otherwise the trick below doesn't work...
    imports: [RouterModule.forRoot(desktop_routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
// export class AppRoutingModule { }

export class AppRoutingModule {

    public constructor(private router: Router,
        private applicationStateService: ApplicationstateService) {

        if (applicationStateService.getIsMobileResolution()) {
            router.resetConfig(mobile_routes);
        }
    }

    /**
     * this function inject new routes for the given module instead the current routes. the operation happens on the given current routes object so after
     * this method a call to reset routes on router should be called with the the current routes object.
     * @param currentRoutes
     * @param routesToInject
     * @param childNameToReplaceRoutesUnder - the module name to replace its routes.
     */
    private injectModuleRoutes(currentRoutes: Routes, routesToInject: Routes, childNameToReplaceRoutesUnder: string): void {
        for (let i = 0; i < currentRoutes.length; i++) {
            if (currentRoutes[i].loadChildren != null &&
                currentRoutes[i].loadChildren.toString().indexOf(childNameToReplaceRoutesUnder) != -1) {
                // we found it. taking the route prefix
                let prefixRoute: string = currentRoutes[i].path;
                // first removing the module line
                currentRoutes.splice(i, 1);
                // now injecting the new routes
                // we need to add the prefix route first
                this.addPrefixToRoutes(routesToInject, prefixRoute);
                for (let route of routesToInject) {
                    currentRoutes.push(route);
                }
                // since we found it we can break the injection
                return;
            }

            if (currentRoutes[i].children != null) {
                this.injectModuleRoutes(currentRoutes[i].children, routesToInject, childNameToReplaceRoutesUnder);
            }
        }
    }

    private addPrefixToRoutes(routes: Routes, prefix: string) {
        for (let i = 0; i < routes.length; i++) {
            routes[i].path = prefix + '/' + routes[i].path;
        }
    }

    changeRoute() {
        if (this.applicationStateService.getIsMobileResolution()) {
            this.router.resetConfig(mobile_routes);
        } else {
            this.router.resetConfig(desktop_routes);

        }

    }
}
