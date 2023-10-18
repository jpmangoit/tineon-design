import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MHeaderComponent, MLayoutComponent, SideNavigationComponent} from '@modules/mobile-app/common';
import {
  ActionToolComponent,
  MEmailComponent,
  MnotificationComponent,
  NavigationToolComponent,
  SettingToolComponent
} from '@modules/mobile-app/shared';
import {MDashboardComponent} from '@modules/mobile-app/pages/m-dashboard/m-dashboard.component';
import {MclubwallComponent} from '@modules/mobile-app/pages/mclubwall/mclubwall.component';
import {MclubNewsComponent} from '@modules/mobile-app/pages/mnews/mclub-news/mclub-news.component';
import {MclubDatesComponent} from '@modules/mobile-app/pages/mnews/mclub-dates/mclub-dates.component';
import {MclubEventsComponent} from '@modules/mobile-app/pages/mevents/mclub-events/mclub-events.component';
import {McommunityComponent} from '@modules/mobile-app/pages/mcommunity/mcommunity.component';
import {McommunityGroupsComponent} from '@modules/mobile-app/pages/mgroups/mcommunity-groups/mcommunity-groups.component';
import {McommunityMessagesComponent} from '@modules/mobile-app/pages/mmessages/mcommunity-messages/mcommunity-messages.component';
import {MchatComponent} from '@modules/mobile-app/pages/mmessages/mchat/mchat.component';
import {MactiveSurveyComponent} from '@modules/mobile-app/pages/survey/mactive-survey/mactive-survey.component';
import {MmySurveyComponent} from '@modules/mobile-app/pages/survey/mmy-survey/mmy-survey.component';
import {McompletedSurveyComponent} from '@modules/mobile-app/pages/survey/mcompleted-survey/mcompleted-survey.component';
import {MsurveyComponent} from '@modules/mobile-app/pages/survey/msurvey/msurvey.component';
import {MorganizerComponent} from '@modules/mobile-app/pages/morganizer/morganizer.component';
import {MorganizerEventsComponent} from '@modules/mobile-app/pages/mevents/morganizer-events/morganizer-events.component';
import {MorganizerTaskComponent} from '@modules/mobile-app/pages/mtasks/morganizer-task/morganizer-task.component';
import {MorganizerDocumentsComponent} from '@modules/mobile-app/pages/mdocuments/morganizer-documents/morganizer-documents.component';
import {McourseComponent} from '@modules/mobile-app/pages/mcourses/mcourse/mcourse.component';
import {MdashboardEventComponent} from '@modules/mobile-app/pages/mevents/mdashboard-event/mdashboard-event.component';
import {MeventDetailComponent} from '@modules/mobile-app/pages/mevents/mevent-detail/mevent-detail.component';
import {MallNewsComponent} from '@modules/mobile-app/pages/mnews/mall-news/mall-news.component';
import {MallEventsComponent} from '@modules/mobile-app/pages/mevents/mall-events/mall-events.component';
import {McrmActiveSurveyComponent} from '@modules/mobile-app/pages/crm-survey/mcrm-active-survey/mcrm-active-survey.component';
import {McrmCompletedSurveyComponent} from '@modules/mobile-app/pages/crm-survey/mcrm-completed-survey/mcrm-completed-survey.component';
import {McrmMySurveyComponent} from '@modules/mobile-app/pages/crm-survey/mcrm-my-survey/mcrm-my-survey.component';
import {McrmSurveyComponent} from '@modules/mobile-app/pages/crm-survey/mcrm-survey/mcrm-survey.component';
import {MvereinsFaqComponent} from '@modules/mobile-app/pages/mfaq/mvereins-faq/mvereins-faq.component';
import {MfaqCategoryComponent} from '@modules/mobile-app/pages/mfaq/mfaq-category/mfaq-category.component';
import {MprofileQrComponent} from '@modules/mobile-app/pages/mprofile-qr/mprofile-qr.component';
import {MchatListComponent} from '@modules/mobile-app/pages/mmessages/mchat-list/mchat-list.component';
import {MpersonalMessageComponent} from '@modules/mobile-app/pages/mmessages/mpersonal-message/mpersonal-message.component';
import {MclubMessageComponent} from '@modules/mobile-app/pages/mmessages/mclub-message/mclub-message.component';
import {MgroupMessageComponent} from '@modules/mobile-app/pages/mmessages/mgroup-message/mgroup-message.component';
import {MdisplayMessagesComponent} from '@modules/mobile-app/pages/mmessages/mdisplay-messages/mdisplay-messages.component';
import {MprofileComponent} from '@modules/mobile-app/pages/mprofile/mprofile/mprofile.component';
import {MgeneralInformationComponent} from '@modules/mobile-app/pages/mprofile/mgeneral-information/mgeneral-information.component';
import {MprofileBankComponent} from '@modules/mobile-app/pages/mprofile/mprofile-bank/mprofile-bank.component';
import {MprofileBankEditComponent} from '@modules/mobile-app/pages/mprofile/mprofile-bank-edit/mprofile-bank-edit.component';
import {MprofileClubComponent} from '@modules/mobile-app/pages/mprofile/mprofile-club/mprofile-club.component';
import {MprofileEditComponent} from '@modules/mobile-app/pages/mprofile/mprofile-edit/mprofile-edit.component';
import {MprofileMyClubComponent} from '@modules/mobile-app/pages/mprofile/mprofile-my-club/mprofile-my-club.component';
import {MmemberProfileComponent} from '@modules/mobile-app/pages/mprofile/mmember-profile/mmember-profile.component';
import {MbannerlistComponent} from '@modules/mobile-app/pages/mbanner/mbannerlist/mbannerlist.component';
import {MorganizerTaskDetailsComponent} from '@modules/mobile-app/pages/mtasks/morganizer-task-details/morganizer-task-details.component';
import {MclubAllNewsComponent} from '@modules/mobile-app/pages/mnews/mclub-all-news/mclub-all-news.component';
import {BirthdaysComponent} from '@modules/mobile-app/pages/birthdays/birthdays.component';
import {SharedModule} from '@shared/shared.module';
import {MobileAppRoutingModule} from '@modules/mobile-app/mobile-app-routing.module';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

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
