import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { LanguageService } from '../../service/language.service';

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

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService
    ) { }

    ngOnInit(): void {
        this.userData= JSON.parse( localStorage.getItem('user-data') );
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.getCurrentBirthday();
            this.getCurrentJubilees();
        }
    }

    /**
    * Function to get user birthday details
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} user birthday details
    */
    getCurrentBirthday() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'check-birthdays/'+this.userData.team_id, null)
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
        this.authService.memberSendRequest('get', 'check-jubilees/'+this.userData.team_id, null)
            .subscribe(
                (respData: any) => {
                    this.jubileesData = respData['result'];
                    this.authService.setLoader(false);
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
