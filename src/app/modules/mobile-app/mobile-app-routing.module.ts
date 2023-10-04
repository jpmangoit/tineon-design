import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/modules/web-app/common/page-not-found/page-not-found.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { MemberLightGuard } from 'src/app/guard/member-light.guard';
import { MembersGuard } from 'src/app/guard/members.guard';
import { RouteGuard } from 'src/app/guard/route.guard';
import { AppStoreComponent } from 'src/app/modules/web-app/app-store/app-store.component';
import { BannerDetailComponent } from 'src/app/modules/web-app/banner/banner-detail/banner-detail.component';
import { CreateBannerComponent } from 'src/app/modules/web-app/banner/create-banner/create-banner.component';
import { UpdateBannerComponent } from 'src/app/modules/web-app/banner/update-banner/update-banner.component';
import { CourseDetailComponent } from 'src/app/modules/web-app/courses/course-detail/course-detail.component';
import { CreateCourseComponent } from 'src/app/modules/web-app/courses/create-course/create-course.component';
import { CreateInstructorComponent } from 'src/app/modules/web-app/courses/create-instructor/create-instructor.component';
import { InstructorDetailsComponent } from 'src/app/modules/web-app/courses/instructor-details/instructor-details.component';
import { InstructorComponent } from 'src/app/modules/web-app/courses/instructor/instructor.component';
import { UpdateCoursesComponent } from 'src/app/modules/web-app/courses/update-courses/update-courses.component';
import { CreateChatComponent } from 'src/app/modules/web-app/create-chat/create-chat.component';
import { CrmNewsComponent } from 'src/app/modules/web-app/crm-news/crm-news/crm-news.component';
import { CrmSurveyViewComponent } from 'src/app/modules/web-app/crm-survey/crm-survey-view/crm-survey-view.component';
import { CrmSurveyVoteComponent } from 'src/app/modules/web-app/crm-survey/crm-survey-vote/crm-survey-vote.component';
import { EmailTemplateComponent } from 'src/app/modules/web-app/email/email-template/email-template.component';
import { ShowEmailComponent } from 'src/app/modules/web-app/email/show-email/show-email.component';
import { UpdateEmailComponent } from 'src/app/modules/web-app/email/update-email/update-email.component';
import { CreateEventComponent } from 'src/app/modules/web-app/events/create-event/create-event.component';
import { DashboardEventComponent } from 'src/app/modules/web-app/events/dashboard-event/dashboard-event.component';
import { UpdateEventComponent } from 'src/app/modules/web-app/events/update-event/update-event.component';
import { UploadCalendarComponent } from 'src/app/modules/web-app/events/upload-calendar/upload-calendar.component';
import { CreateCategoryComponent } from 'src/app/modules/web-app/faq/create-category/create-category.component';
import { CreateFaqComponent } from 'src/app/modules/web-app/faq/create-faq/create-faq.component';
import { FaqDetailsComponent } from 'src/app/modules/web-app/faq/faq-details/faq-details.component';
import { CommunityGroupsComponent } from 'src/app/modules/web-app/groups/community-groups/community-groups.component';
import { CreateGroupComponent } from 'src/app/modules/web-app/groups/create-group/create-group.component';
import { GroupDetailComponent } from 'src/app/modules/web-app/groups/group-detail/group-detail.component';
import { UpdateGroupComponent } from 'src/app/modules/web-app/groups/update-group/update-group.component';
import { ContactAdminComponent } from 'src/app/modules/web-app/messages/contact-admin/contact-admin.component';
import { CreateMessageComponent } from 'src/app/modules/web-app/messages/create-message/create-message.component';
import { ClubAllNewsComponent } from 'src/app/modules/web-app/news/club-all-news/club-all-news.component';
import { ClubNewsDetailsComponent } from 'src/app/modules/web-app/news/club-news-details/club-news-details.component';
import { CreateNewsComponent } from 'src/app/modules/web-app/news/create-news/create-news.component';
import { UpdateNewsComponent } from 'src/app/modules/web-app/news/update-news/update-news.component';
import { CreateRoomComponent } from 'src/app/modules/web-app/rooms/create-room/create-room.component';
import { RoomDetailsComponent } from 'src/app/modules/web-app/rooms/room-details/room-details.component';
import { RoomComponent } from 'src/app/modules/web-app/rooms/room/room.component';
import { UpdateRoomComponent } from 'src/app/modules/web-app/rooms/update-room/update-room.component';
import { CreateServeyComponent } from 'src/app/modules/web-app/servey/create-servey/create-servey.component';
import { ServeyVoteComponent } from 'src/app/modules/web-app/servey/servey-vote/servey-vote.component';
import { ServeyComponent } from 'src/app/modules/web-app/servey/servey/servey.component';
import { SurveyDetailComponent } from 'src/app/modules/web-app/servey/survey-detail/survey-detail.component';
import { UpdateServeyComponent } from 'src/app/modules/web-app/servey/update-servey/update-servey.component';
import { ViewServeyComponent } from 'src/app/modules/web-app/servey/view-servey/view-servey.component';
import { CreateTaskComponent } from 'src/app/modules/web-app/tasks/create-task/create-task.component';
import { TaskDetailComponent } from 'src/app/modules/web-app/tasks/task-detail/task-detail.component';
import { UpdateTaskComponent } from 'src/app/modules/web-app/tasks/update-task/update-task.component';
import { ThemeOptionComponent } from 'src/app/modules/web-app/theme-option/theme-option.component';
import { CreateThemeComponent } from 'src/app/modules/web-app/theme/create-theme/create-theme.component';
import { ThemesComponent } from 'src/app/modules/web-app/theme/themes/themes.component';
import { UpdateThemeComponent } from 'src/app/modules/web-app/theme/update-theme/update-theme.component';
import { ComingSoonComponent } from 'src/app/shared/coming-soon/coming-soon.component';
// import { LoginComponent } from 'src/app/pages/login/login.component';
// import { RecoverPasswordComponent } from 'src/app/pages/recover-password/recover-password.component';
import { McrmSurveyComponent } from './pages/crm-survey/mcrm-survey/mcrm-survey.component';
import { MDashboardComponent } from './pages/m-dashboard/m-dashboard.component';
import { MbannerlistComponent } from './pages/mbanner/mbannerlist/mbannerlist.component';
import { MclubwallComponent } from './pages/mclubwall/mclubwall.component';
import { McommunityComponent } from './pages/mcommunity/mcommunity.component';
import { McourseComponent } from './pages/mcourses/mcourse/mcourse.component';
import { MorganizerDocumentsComponent } from './pages/mdocuments/morganizer-documents/morganizer-documents.component';
import { MallEventsComponent } from './pages/mevents/mall-events/mall-events.component';
import { MeventDetailComponent } from './pages/mevents/mevent-detail/mevent-detail.component';
import { MorganizerEventsComponent } from './pages/mevents/morganizer-events/morganizer-events.component';
import { MfaqCategoryComponent } from './pages/mfaq/mfaq-category/mfaq-category.component';
import { MvereinsFaqComponent } from './pages/mfaq/mvereins-faq/mvereins-faq.component';
import { McommunityGroupsComponent } from './pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import { MchatComponent } from './pages/mmessages/mchat/mchat.component';
import { McommunityMessagesComponent } from './pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import { MclubAllNewsComponent } from './pages/mnews/mclub-all-news/mclub-all-news.component';
import { MclubDatesComponent } from './pages/mnews/mclub-dates/mclub-dates.component';
import { MclubNewsComponent } from './pages/mnews/mclub-news/mclub-news.component';
import { MorganizerComponent } from './pages/morganizer/morganizer.component';
import { MprofileQrComponent } from './pages/mprofile-qr/mprofile-qr.component';
import { MgeneralInformationComponent } from './pages/mprofile/mgeneral-information/mgeneral-information.component';
import { MmemberProfileComponent } from './pages/mprofile/mmember-profile/mmember-profile.component';
import { MprofileBankEditComponent } from './pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import { MprofileBankComponent } from './pages/mprofile/mprofile-bank/mprofile-bank.component';
import { MprofileClubComponent } from './pages/mprofile/mprofile-club/mprofile-club.component';
import { MprofileEditComponent } from './pages/mprofile/mprofile-edit/mprofile-edit.component';
import { MprofileMyClubComponent } from './pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import { MprofileComponent } from './pages/mprofile/mprofile/mprofile.component';
import { MorganizerTaskDetailsComponent } from './pages/mtasks/morganizer-task-details/morganizer-task-details.component';
import { MorganizerTaskComponent } from './pages/mtasks/morganizer-task/morganizer-task.component';
import { MactiveSurveyComponent } from './pages/survey/mactive-survey/mactive-survey.component';
import { McompletedSurveyComponent } from './pages/survey/mcompleted-survey/mcompleted-survey.component';
import { MmySurveyComponent } from './pages/survey/mmy-survey/mmy-survey.component';
import { MsurveyComponent } from './pages/survey/msurvey/msurvey.component';
import { MEmailComponent } from './shared/m-email/m-email.component';
import { MLayoutComponent } from './shared/m-layout/m-layout.component';


const routes: Routes = [
    // {
    //     path: 'login',
    //     component: LoginComponent
    // },
    // { path: 'recover-password', component: RecoverPasswordComponent, data: { title: 'Recover Password' } },
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
                    { path: 'club-events', component: MorganizerEventsComponent }
                ]
            },
            {
                path: 'community', component: McommunityComponent, children: [
                    { path: 'community-groups', component: McommunityGroupsComponent },
                    { path: 'community-messages', component: McommunityMessagesComponent },
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

            { path: 'morganizer-task-detail/:taskid', component: MorganizerTaskDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Morganizer Task Detail', allow_permission: ['participate'] } },
            { path: 'group-detail/:groupid', component: GroupDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Group Detail', allow_permission: ['participate'] } },
            { path: 'instructor-detail/:instructorId', component: InstructorDetailsComponent, canActivate: [MemberLightGuard], data: { title: 'Instructor Detail', allow_permission: ['participate'] } },
            { path: 'task-detail/:taskid', component: TaskDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Task Detail', allow_permission: ['participate'] } },
            { path: 'event-detail/:eventid', component: MeventDetailComponent, canActivate: [MemberLightGuard], data: { title: 'Event Detail', allow_permission: ['participate'] } },
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

            { path: 'vereins-faq', component: MvereinsFaqComponent, canActivate: [MemberLightGuard], data: { title: 'Vereins Faq', allow_permission: ['participate'] } },
            { path: 'crm-survey', component: McrmSurveyComponent, data: { title: 'CRM Survey' } },
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
            { path: 'mclub-all-news', component: MclubAllNewsComponent, canActivate: [MemberLightGuard], data: { title: 'Club-all-news', allow_permission: ['participate'] } },

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
export class MobileAppRoutingModule {

}
