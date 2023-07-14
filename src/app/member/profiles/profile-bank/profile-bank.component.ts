import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ProfileDetails } from 'src/app/models/profile-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { ThemeService } from 'src/app/service/theme.service';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-profile-bank',
  templateUrl: './profile-bank.component.html',
  styleUrls: ['./profile-bank.component.css'],
})

export class ProfileBankComponent implements OnInit, OnDestroy {
  language: any;
  role: string = '';
  userDetails: ProfileDetails;
  loginsubmitted: boolean = false;
  displayGeneral: boolean;
  displayPayment: boolean = true;
  displayMaster: boolean;
  displayClub: boolean;
  userData: any;
  user: ProfileDetails;
  setTheme: ThemeType;
  private activatedSub: Subscription;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  thumbnail: SafeUrl = null;
  memberPhoto: string;
  responseMessage: string;
  private activatedPro: Subscription;
  userDataProfile: any;
  headline_word_option: number = 0;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private lang: LanguageService,
    private themes: ThemeService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService

  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('club_theme') != null) {
      let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
      this.setTheme = theme;
    }
    this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
      this.setTheme = resp;
    });
    this.userDataProfile = JSON.parse(localStorage.getItem('user-data'));
    this.headline_word_option =parseInt(localStorage.getItem('headlineOption'));

    this.language = this.lang.getLanguaageFile();
    this.getBankDetails();

    this.activatedPro = this.themes.profile_imge.subscribe((resp) => {
        let pro = resp;
        this.getUserImage();
       });

      this.language = this.lang.getLanguaageFile();
      this.getProfileData();
      this.getUserImage();
  }

  getBankDetails() {
    this.loginsubmitted = true;
    let userDetail: LoginDetails = JSON.parse(
      localStorage.getItem('user-data')
    );
    this.authService.setLoader(true);
    if (sessionStorage.getItem('token')) {
      this.authService
        .memberSendRequest('get','member-info/' + userDetail.database_id + '/' + userDetail.team_id + '/' + userDetail.member_id, userDetail)
        .subscribe((respData: any) => {
          this.loginsubmitted = false;
          this.authService.setLoader(false);
          this.user = respData;

          if(respData.changeRequest.bank.status === 'pending'){
            this.userData = respData.changeRequest.bank.dataChanges;
            console.log(this.userData);

          }else{
              this.userData = respData['bankData'];
          }
        });
    }
  }

  inEdit() {
    this.router.navigate(['/profile-edit-bank']);
  }

  print() {
    window.print();
  }

  onGeneralInfo() {
    this.displayGeneral = true;
    this.displayPayment = false;
    this.displayMaster = false;
    this.displayClub = false;
  }

  onPaymentData() {
    this.displayGeneral = false;
    this.displayPayment = true;
    this.displayMaster = false;
    this.displayClub = false;
  }

  onMasterData() {
    this.displayGeneral = false;
    this.displayPayment = false;
    this.displayMaster = true;
    this.displayClub = false;
  }

  onClubData() {
    this.displayGeneral = false;
    this.displayPayment = false;
    this.displayMaster = false;
    this.displayClub = true;
  }

  getProfileData() {
    if (sessionStorage.getItem('token')) {
      let userData: LoginDetails = JSON.parse(
        localStorage.getItem('user-data')
      );
      this.authService.setLoader(true);
      this.authService
        .memberSendRequest(
          'get',
          'member-info/' +
            userData.database_id +
            '/' +
            userData.team_id +
            '/' +
            userData.member_id,
          userData
        )
        .subscribe((respData: any) => {
          this.authService.setLoader(false);
          this.userDetails = respData;
          this.role = userData.roles[0];
        });
    }
  }

  getUserImage() {
    if (sessionStorage.getItem('token')) {
        let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        this.authService.memberInfoRequest('get', 'member-photo?database_id=' + userData.database_id + '&club_id=' + userData.team_id + '&member_id=' + userData.member_id, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'].message,null);
                } else {
                    this.memberPhoto = respData;
                    this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(respData.changingThisBreaksApplicationSecurity) as string;
                }
            }
        );
    }
  }

  ngOnDestroy(): void {
    this.activatedSub.unsubscribe();
  }
}
