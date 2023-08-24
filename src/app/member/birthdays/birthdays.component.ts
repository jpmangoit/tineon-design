import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { LanguageService } from '../../service/language.service';
import { LoginDetails } from 'src/app/models/login-details.model';

@Component({
    selector: 'app-birthdays',
    templateUrl: './birthdays.component.html',
    styleUrls: ['./birthdays.component.css']
})

export class BirthdaysComponent implements OnInit {
    language: any;
    ageDiff: number; 
    birthdayData: any = [];
    jubileesData: any = [];
    userData: any;
    // alluserInformation: any= [];
    alluserInformation: { member_id: number }[] = [];
    allUser: any[] = [];


    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService
    ) { }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.getAllUserInfo();
            this.getCurrentBirthday();
            this.getCurrentJubilees();

        }
    }

    /**
     * Function to get all the Club Users
     * @author  MangoIt Solutions
     * @param   {}
     * @return  {Array Of Object} all the Users
     */
    getAllUserInfo() {
        this.authService.memberSendRequest('get', 'teamUsers/team/' + this.userData.team_id, null)
            .subscribe(
                (respData: any) => {
                    if (respData && respData.length > 0) {
                        this.allUser = respData;
                        Object(respData).forEach((val, key) => {
                            this.alluserInformation[val.id] = { member_id: val.member_id };
                        })
                    }
                }
            );
    }

    /**
    * Function to get user birthday details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} user birthday details
    */
    getCurrentBirthday() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'check-birthdays/' + this.userData.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.getBirthDay(respData);
                }
            );
    }

    /**
    * Function to get user Jubilees details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} user Jubilees details
    */
    getCurrentJubilees() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'check-jubilees/' + this.userData.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.jubileesData = respData['result'];
                    
                    this.authService.setLoader(false);
                    
                    this.jubileesData?.forEach(val => {
                        if (this.alluserInformation[val?.user?.id]?.member_id != null) {
                            this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.alluserInformation[val?.user?.id].member_id, null)
                                .subscribe(
                                    (resppData: any) => {
                                        val.user.imagePro = resppData;
                                    },
                                    (error: any) => {
                                        val.user.imagePro = null;
                                    }
                                );
                        }
                        else {
                            val.user.imagePro = null;
                        }
                    });
                    console.log(this.jubileesData);

                    
                }
            );
    }

    /**
    * Function to calculate user age
    * @author  MangoIt Solutions
    * @param   {birthday}
    * @return  {object} user age
    */
    getBirthDay(birthday) {
        let self = this;
        this.birthdayData = birthday['result'];

        this.birthdayData?.forEach(val => {
            if (this.alluserInformation[val?.id]?.member_id != null) {
                this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userData.database_id + '&club_id=' + this.userData.team_id + '&member_id=' + this.alluserInformation[val?.id].member_id, null)
                    .subscribe(
                        (resppData: any) => {
                            val.imagePro = resppData;
                        },
                        (error: any) => {
                            val.imagePro = null;
                        }
                    );
            }
            else {
                val.imagePro = null;
            }
        });

        if (this.birthdayData?.length > 0) {
            this.birthdayData.forEach(function (val, key) {
                var age = self.calculateAge(val.bd_notification);
                Object.assign(val, { age: age });
            });
        }
    }

    /**
    * Function to calculate user age with current year
    * @author  MangoIt Solutions
    * @param   {birthdate}
    * @return  user age
    */
    calculateAge(bdate) {
        var ageDifMs = (new Date()).getFullYear() - (new Date(bdate)).getFullYear();
        this.ageDiff = ageDifMs;
        return ageDifMs;
    }
}
