import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { LanguageService } from '../../service/language.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-birthdays',
    templateUrl: './birthdays.component.html',
    styleUrls: ['./birthdays.component.css']
})

export class BirthdaysComponent implements OnInit {
    language: any;
    ageDiff: number;
    birthdayData: any[] = [];
    jubileesData: any[] = [];
    userData: any;
    // alluserInformation: any= [];
    alluserInformation: { member_id: number }[] = [];
    allUser: any[] = [];
    selected = '1';
    currentBirthday: any;
    chatUserArr: {
        lastMsgTime: string;
        lastMsgDate: string;
        lastMsgTimming: string;
        lastMessage: any; count: number, id: number, image: string, name: string, type: string
    }[];

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private router: Router,

    ) { }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        if (sessionStorage.getItem('token')) {
            this.language = this.lang.getLanguaageFile();
            this.getAllUserInfo();
            this.getCurrentBirthday();
            // this.getCurrentJubilees();
            this.onFilter(1);
            this.chats();

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
                        this.getCurrentJubilees();
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
                    this.currentBirthday = respData
                    this.getBirthDay(respData);
                }
            );
    }

    onFilter(selectedValue: any) {
        ;
        if (selectedValue === '1') {
            this.getBirthDay(this.currentBirthday);
            this.getCurrentJubilees();
        } else if (selectedValue === '2') {
            this.birthdayData = [];
            this.getBirthDay(this.currentBirthday);
            this.jubileesData = [];
        } else if (selectedValue === '3') {
            this.birthdayData = [];
            this.jubileesData = [];
            this.getCurrentJubilees();
        }
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


    chats() {
        this.authService.setLoader(true);
        this.authService.memberSendRequest('get', 'get-usersgroup-chat/' + this.userData.userId, '')
            .subscribe(
                (resp: any) => {
                    setTimeout(() => {
                        this.authService.setLoader(false);
                    }, 2000);
                    this.chatUserArr = resp;
                    let grp: any;
                    if (this.chatUserArr && this.chatUserArr.length > 0) {
                        this.chatUserArr.forEach(element => {
                            if (element.type == 'individual') {
                                element.lastMessage = JSON.parse(element.lastMessage)
                                element.lastMsgTime = new Date(element.lastMessage.timestamp).toISOString()
                                let cudate = new Date().toISOString().split('T')[0]
                                let msgdate = element.lastMsgTime.split('T')[0]
                                if (new Date(msgdate).getTime() == new Date(cudate).getTime()) {
                                    element.lastMsgTimming = element.lastMsgTime
                                } else {
                                    element.lastMsgDate = msgdate
                                }
                            }
                        });
                    }
                    this.chatUserArr = this.chatUserArr.sort((a: any, b: any) => Number(new Date(a.lastMessage.timestamp)) - Number(new Date(b.lastMessage.timestamp))).reverse()
                    this.chatUserArr = this.chatUserArr.filter(x => x.type == 'individual');
                    console.log(this.chatUserArr);
                    

                }
            );
    }

    checkChatDetails(userId: any) {
        console.log(userId);
        
        let chatUser = this.chatUserArr.filter(x => x.id == userId);
        console.log(chatUser);
        
        if (chatUser?.length > 0) {
            this.router.navigate(['/community/'], { queryParams: { id: userId } });
        } else {
            this.router.navigate(['create-chat']);
        }
    }


}
