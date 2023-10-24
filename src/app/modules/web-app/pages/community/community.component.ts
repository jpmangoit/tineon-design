import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CreateAccess, LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {AuthServiceService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';
import {BreadcrumbItem} from '@shared/components/page-header/breadcrumb.type';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit, OnDestroy {
  language: any;
  userDetails: LoginDetails;
  userAccess: UserAccess;
  createAccess: CreateAccess;
  participateAccess: ParticipateAccess;
  communityCount: number;
  displayMessages = false;
  displayGroups = false;
  setTheme: ThemeType;
  breadCrumbItems: Array<BreadcrumbItem>;
  private activatedSub: Subscription;

  constructor(private lang: LanguageService, private authService: AuthServiceService,
              private router: Router, private themes: ThemeService) {
    const getParamFromUrl: string = this.router.url.split('/')[3];
    if (getParamFromUrl === 'community-groups' || getParamFromUrl === 'groups' || getParamFromUrl === 'groups-joined') {
      this.displayGroups = true;
    } else {
      this.displayMessages = true;
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('club_theme') != null) {
      this.setTheme = JSON.parse(localStorage.getItem('club_theme'));
    }
    this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
      this.setTheme = resp;
    });
    this.language = this.lang.getLanguageFile();
    this.userDetails = JSON.parse(localStorage.getItem('user-data'));
    const userRole = this.userDetails.roles[0];
    this.userAccess = appSetting.role;
    this.createAccess = this.userAccess[userRole].create;
    this.participateAccess = this.userAccess[userRole].participate;

    if (localStorage.getItem('backItem')) {
      if (localStorage.getItem('backItem') === 'groups') {
        localStorage.removeItem('backItem');
        this.onGroups();
      }
    }
    if (this.participateAccess.message === 'Yes') {
      this.authService.setLoader(true);
      this.authService.memberSendRequest('get', 'message/get-message-count', null)
        .subscribe(
          (respData: any) => {
            this.authService.setLoader(false);
            this.communityCount = respData.value;
          }
        );
    }
    this.initBreadcrumb();

  }

  /**
   * Function is used to display message tab
   * @author  MangoIt Solutions
   */
  onMessages() {
    this.displayMessages = true;
    this.displayGroups = false;
    this.initBreadcrumb();
  }

  /**
   * Function is used to display group tab
   * @author  MangoIt Solutions
   */
  onGroups() {
    this.displayGroups = true;
    this.displayMessages = false;
    this.initBreadcrumb();
  }

  ngOnDestroy(): void {
    this.activatedSub.unsubscribe();
  }

  private initBreadcrumb(): void {
    this.breadCrumbItems = [
      {title: 'Community', link: '/web/community'},
      {title: this.displayGroups ? this.language.community.groups : this.language.community.messages}
    ];
  }
}
