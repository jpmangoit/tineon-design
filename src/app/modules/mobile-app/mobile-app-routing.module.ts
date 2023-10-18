import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard, MemberLightGuard, MembersGuard, RouteGuard} from '@core/guards';
import {MLayoutComponent} from '@modules/mobile-app/common';
import {MDashboardComponent} from '@modules/mobile-app/pages/m-dashboard/m-dashboard.component';
import {MclubwallComponent} from '@modules/mobile-app/pages/mclubwall/mclubwall.component';
import {MclubNewsComponent} from '@modules/mobile-app/pages/mnews/mclub-news/mclub-news.component';
import {MclubDatesComponent} from '@modules/mobile-app/pages/mnews/mclub-dates/mclub-dates.component';
import {MorganizerEventsComponent} from '@modules/mobile-app/pages/mevents/morganizer-events/morganizer-events.component';
import {McommunityComponent} from '@modules/mobile-app/pages/mcommunity/mcommunity.component';
import {McommunityGroupsComponent} from '@modules/mobile-app/pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import {McommunityMessagesComponent} from '@modules/mobile-app/pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import {CommunityGroupsComponent} from '@modules/web-app/pages/groups/community-groups/community-groups.component';
import {MchatComponent} from '@modules/mobile-app/pages/mmessages/mchat/mchat.component';
import {MsurveyComponent} from '@modules/mobile-app/pages/survey/msurvey/msurvey.component';
import {MactiveSurveyComponent} from '@modules/mobile-app/pages/survey/mactive-survey/mactive-survey.component';
import {McompletedSurveyComponent} from '@modules/mobile-app/pages/survey/mcompleted-survey/mcompleted-survey.component';
import {MmySurveyComponent} from '@modules/mobile-app/pages/survey/mmy-survey/mmy-survey.component';
import {MorganizerComponent} from '@modules/mobile-app/pages/morganizer/morganizer.component';
import {MorganizerTaskComponent} from '@modules/mobile-app/pages/mtasks/morganizer-task/morganizer-task.component';
import {MorganizerDocumentsComponent} from '@modules/mobile-app/pages/mdocuments/morganizer-documents/morganizer-documents.component';
import {EmailTemplateComponent} from '@modules/web-app/pages/email/email-template/email-template.component';
import {CreateEventComponent} from '@modules/web-app/pages/events/create-event/create-event.component';
import {CreateTaskComponent} from '@modules/web-app/pages/tasks/create-task/create-task.component';
import {CreateChatComponent} from '@modules/web-app/pages/create-chat/create-chat.component';
import {CreateNewsComponent} from '@modules/web-app/pages/news/create-news/create-news.component';
import {CreateMessageComponent} from '@modules/web-app/pages/messages/create-message/create-message.component';
import {CreateGroupComponent} from '@modules/web-app/pages/groups/create-group/create-group.component';
import {CreateFaqComponent} from '@modules/web-app/pages/faq/create-faq/create-faq.component';
import {CreateCategoryComponent} from '@modules/web-app/pages/faq/create-category/create-category.component';
import {CreateCourseComponent} from '@modules/web-app/pages/courses/create-course/create-course.component';
import {CreateRoomComponent} from '@modules/web-app/pages/rooms/create-room/create-room.component';
import {CreateInstructorComponent} from '@modules/web-app/pages/courses/create-instructor/create-instructor.component';
import {CreateServeyComponent} from '@modules/web-app/pages/servey/create-servey/create-servey.component';
import {CreateThemeComponent} from '@modules/web-app/pages/theme/create-theme/create-theme.component';
import {CreateBannerComponent} from '@modules/web-app/pages/banner/create-banner/create-banner.component';
import {UpdateTaskComponent} from '@modules/web-app/pages/tasks/update-task/update-task.component';
import {UpdateGroupComponent} from '@modules/web-app/pages/groups/update-group/update-group.component';
import {UpdateCoursesComponent} from '@modules/web-app/pages/courses/update-courses/update-courses.component';
import {UpdateRoomComponent} from '@modules/web-app/pages/rooms/update-room/update-room.component';
import {UpdateServeyComponent} from '@modules/web-app/pages/servey/update-servey/update-servey.component';
import {UpdateEmailComponent} from '@modules/web-app/pages/email/update-email/update-email.component';
import {UpdateThemeComponent} from '@modules/web-app/pages/theme/update-theme/update-theme.component';
import {UpdateEventComponent} from '@modules/web-app/pages/events/update-event/update-event.component';
import {UpdateNewsComponent} from '@modules/web-app/pages/news/update-news/update-news.component';
import {UpdateBannerComponent} from '@modules/web-app/pages/banner/update-banner/update-banner.component';
import {MorganizerTaskDetailsComponent} from '@modules/mobile-app/pages/mtasks/morganizer-task-details/morganizer-task-details.component';
import {GroupDetailComponent} from '@modules/web-app/pages/groups/group-detail/group-detail.component';
import {InstructorDetailsComponent} from '@modules/web-app/pages/courses/instructor-details/instructor-details.component';
import {TaskDetailComponent} from '@modules/web-app/pages/tasks/task-detail/task-detail.component';
import {MeventDetailComponent} from '@modules/mobile-app/pages/mevents/mevent-detail/mevent-detail.component';
import {RoomDetailsComponent} from '@modules/web-app/pages/rooms/room-details/room-details.component';
import {ClubNewsDetailsComponent} from '@modules/web-app/pages/news/club-news-details/club-news-details.component';
import {FaqDetailsComponent} from '@modules/web-app/pages/faq/faq-details/faq-details.component';
import {CourseDetailComponent} from '@modules/web-app/pages/courses/course-detail/course-detail.component';
import {SurveyDetailComponent} from '@modules/web-app/pages/servey/survey-detail/survey-detail.component';
import {BannerDetailComponent} from '@modules/web-app/pages/banner/banner-detail/banner-detail.component';
import {CrmSurveyVoteComponent} from '@modules/web-app/pages/crm-survey/crm-survey-vote/crm-survey-vote.component';
import {ThemesComponent} from '@modules/web-app/pages/theme/themes/themes.component';
import {McourseComponent} from '@modules/mobile-app/pages/mcourses/mcourse/mcourse.component';
import {MallEventsComponent} from '@modules/mobile-app/pages/mevents/mall-events/mall-events.component';
import {ShowEmailComponent} from '@modules/web-app/pages/email/show-email/show-email.component';
import {ClubAllNewsComponent} from '@modules/web-app/pages/news/club-all-news/club-all-news.component';
import {ViewServeyComponent} from '@modules/web-app/pages/servey/view-servey/view-servey.component';
import {ServeyVoteComponent} from '@modules/web-app/pages/servey/servey-vote/servey-vote.component';
import {InstructorComponent} from '@modules/web-app/pages/courses/instructor/instructor.component';
import {RoomComponent} from '@modules/web-app/pages/rooms/room/room.component';
import {ServeyComponent} from '@modules/web-app/pages/servey/servey/servey.component';
import {CrmNewsComponent} from '@modules/web-app/pages/crm-news/crm-news/crm-news.component';
import {CrmSurveyViewComponent} from '@modules/web-app/pages/crm-survey/crm-survey-view/crm-survey-view.component';
import {UploadCalendarComponent} from '@modules/web-app/pages/events/upload-calendar/upload-calendar.component';
import {ContactAdminComponent} from '@modules/web-app/pages/messages/contact-admin/contact-admin.component';
import {MvereinsFaqComponent} from '@modules/mobile-app/pages/mfaq/mvereins-faq/mvereins-faq.component';
import {McrmSurveyComponent} from '@modules/mobile-app/pages/crm-survey/mcrm-survey/mcrm-survey.component';
import {MfaqCategoryComponent} from '@modules/mobile-app/pages/mfaq/mfaq-category/mfaq-category.component';
import {MprofileQrComponent} from '@modules/mobile-app/pages/mprofile-qr/mprofile-qr.component';
import {ThemeOptionComponent} from '@modules/web-app/pages/theme-option/theme-option.component';
import {DashboardEventComponent} from '@modules/web-app/pages/events/dashboard-event/dashboard-event.component';
import {MprofileClubComponent} from '@modules/mobile-app/pages/mprofile/mprofile-club/mprofile-club.component';
import {MprofileBankComponent} from '@modules/mobile-app/pages/mprofile/mprofile-bank/mprofile-bank.component';
import {MprofileMyClubComponent} from '@modules/mobile-app/pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import {MprofileComponent} from '@modules/mobile-app/pages/mprofile/mprofile/mprofile.component';
import {MgeneralInformationComponent} from '@modules/mobile-app/pages/mprofile/mgeneral-information/mgeneral-information.component';
import {MprofileBankEditComponent} from '@modules/mobile-app/pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import {MprofileEditComponent} from '@modules/mobile-app/pages/mprofile/mprofile-edit/mprofile-edit.component';
import {MmemberProfileComponent} from '@modules/mobile-app/pages/mprofile/mmember-profile/mmember-profile.component';
import {ComingSoonComponent} from '@shared/pages';
import {MbannerlistComponent} from '@modules/mobile-app/pages/mbanner/mbannerlist/mbannerlist.component';
import {AppStoreComponent} from '@modules/web-app/pages/app-store/app-store.component';
import {MclubAllNewsComponent} from '@modules/mobile-app/pages/mnews/mclub-all-news/mclub-all-news.component';
import {PageNotFoundComponent} from '@modules/web-app/shared/page-not-found/page-not-found.component';


const routes: Routes = [

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
    // { path: 'email', component: MEmailComponent, data: { title: 'Email' } },
    { path: '**', component: PageNotFoundComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileAppRoutingModule {
}
