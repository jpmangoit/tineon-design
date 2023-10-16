import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppRoutingModule } from './mobile-app-routing.module';
import { MHeaderComponent } from '../mobile-app/shared/m-header/m-header.component';
import { NavigationToolComponent } from '../mobile-app/shared/navigation-tool/navigation-tool.component';
import { MLayoutComponent } from '../mobile-app/shared/m-layout/m-layout.component';
import { SideNavigationComponent } from '../mobile-app/shared/side-navigation/side-navigation.component';
import { MDashboardComponent } from '../mobile-app/pages/m-dashboard/m-dashboard.component';
import { MclubwallComponent } from '../mobile-app/pages/mclubwall/mclubwall.component';
import { MclubNewsComponent } from '../mobile-app/pages/mnews/mclub-news/mclub-news.component';
import { MclubDatesComponent } from '../mobile-app/pages/mnews/mclub-dates/mclub-dates.component';
import { MclubEventsComponent } from '../mobile-app/pages/mevents/mclub-events/mclub-events.component';
import { McommunityComponent } from '../mobile-app/pages/mcommunity/mcommunity.component';
import { McommunityGroupsComponent } from '../mobile-app/pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import { McommunityMessagesComponent } from '../mobile-app/pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import { MchatComponent } from '../mobile-app/pages/mmessages/mchat/mchat.component';
import { MactiveSurveyComponent } from '../mobile-app/pages/survey/mactive-survey/mactive-survey.component';
import { MmySurveyComponent } from '../mobile-app/pages/survey/mmy-survey/mmy-survey.component';
import { McompletedSurveyComponent } from '../mobile-app/pages/survey/mcompleted-survey/mcompleted-survey.component';
import { MsurveyComponent } from '../mobile-app/pages/survey/msurvey/msurvey.component';
import { MorganizerComponent } from '../mobile-app/pages/morganizer/morganizer.component';
import { MorganizerEventsComponent } from '../mobile-app/pages/mevents/morganizer-events/morganizer-events.component';
import { MorganizerTaskComponent } from '../mobile-app/pages/mtasks/morganizer-task/morganizer-task.component';
import { MorganizerDocumentsComponent } from '../mobile-app/pages/mdocuments/morganizer-documents/morganizer-documents.component';
import { McourseComponent } from '../mobile-app/pages/mcourses/mcourse/mcourse.component';
import { ActionToolComponent } from '../mobile-app/shared/action-tool/action-tool.component';
import { SettingToolComponent } from '../mobile-app/shared/setting-tool/setting-tool.component';
import { MdashboardEventComponent } from '../mobile-app/pages/mevents/mdashboard-event/mdashboard-event.component';
import { MeventDetailComponent } from '../mobile-app/pages/mevents/mevent-detail/mevent-detail.component';
import { MallNewsComponent } from '../mobile-app/pages/mnews/mall-news/mall-news.component';
import { MallEventsComponent } from '../mobile-app/pages/mevents/mall-events/mall-events.component';
import { McrmActiveSurveyComponent } from '../mobile-app/pages/crm-survey/mcrm-active-survey/mcrm-active-survey.component';
import { McrmCompletedSurveyComponent } from '../mobile-app/pages/crm-survey/mcrm-completed-survey/mcrm-completed-survey.component';
import { McrmMySurveyComponent } from '../mobile-app/pages/crm-survey/mcrm-my-survey/mcrm-my-survey.component';
import { McrmSurveyComponent } from '../mobile-app/pages/crm-survey/mcrm-survey/mcrm-survey.component';
import { MnotificationComponent } from '../mobile-app/shared/mnotification/mnotification.component';
import { MvereinsFaqComponent } from '../mobile-app/pages/mfaq/mvereins-faq/mvereins-faq.component';
import { MfaqCategoryComponent } from '../mobile-app/pages/mfaq/mfaq-category/mfaq-category.component';
import { MprofileQrComponent } from '../mobile-app/pages/mprofile-qr/mprofile-qr.component';
import { MchatListComponent } from '../mobile-app/pages/mmessages/mchat-list/mchat-list.component';
import { MpersonalMessageComponent } from '../mobile-app/pages/mmessages/mpersonal-message/mpersonal-message.component';
import { MclubMessageComponent } from '../mobile-app/pages/mmessages/mclub-message/mclub-message.component';
import { MgroupMessageComponent } from '../mobile-app/pages/mmessages/mgroup-message/mgroup-message.component';
import { MdisplayMessagesComponent } from '../mobile-app/pages/mmessages/mdisplay-messages/mdisplay-messages.component';
import { MprofileComponent } from '../mobile-app/pages/mprofile/mprofile/mprofile.component';
import { MgeneralInformationComponent } from '../mobile-app/pages/mprofile/mgeneral-information/mgeneral-information.component';
import { MprofileBankComponent } from '../mobile-app/pages/mprofile/mprofile-bank/mprofile-bank.component';
import { MprofileBankEditComponent } from '../mobile-app/pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import { MprofileClubComponent } from '../mobile-app/pages/mprofile/mprofile-club/mprofile-club.component';
import { MprofileEditComponent } from '../mobile-app/pages/mprofile/mprofile-edit/mprofile-edit.component';
import { MprofileMyClubComponent } from '../mobile-app/pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import { MmemberProfileComponent } from '../mobile-app/pages/mprofile/mmember-profile/mmember-profile.component';
import { MbannerlistComponent } from '../mobile-app/pages/mbanner/mbannerlist/mbannerlist.component';
import { MEmailComponent } from '../mobile-app/shared/m-email/m-email.component';
import { MorganizerTaskDetailsComponent } from '../mobile-app/pages/mtasks/morganizer-task-details/morganizer-task-details.component';
import { MclubAllNewsComponent } from '../mobile-app/pages/mnews/mclub-all-news/mclub-all-news.component';
import { SharedModule } from 'src/app/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShortNumberPipe } from 'src/app/pipe/short-number.pipe';
import { BirthdaysComponent } from './pages/birthdays/birthdays.component';


@NgModule({
    declarations: [
        MHeaderComponent,
        NavigationToolComponent,
        MLayoutComponent,
        SideNavigationComponent,
        MDashboardComponent,
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
        SettingToolComponent,
        MdashboardEventComponent,
        MeventDetailComponent,
        MallNewsComponent,
        MallEventsComponent,
        McrmActiveSurveyComponent,
        McrmCompletedSurveyComponent,
        McrmMySurveyComponent,
        McrmSurveyComponent,
        MnotificationComponent,
        MvereinsFaqComponent,
        MfaqCategoryComponent,
        MprofileQrComponent,
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
        MbannerlistComponent,
        MEmailComponent,
        MorganizerTaskDetailsComponent,
        MclubAllNewsComponent,
        ShortNumberPipe,
        BirthdaysComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MobileAppRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
    ]
})
export class MobileAppModule { }
