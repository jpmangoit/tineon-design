import { Injectable } from '@angular/core';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { LoginDetails } from '../models/login-details.model';
import { Room } from '../models/room.model';
import { AuthServiceService } from './auth-service.service';
import { LanguageService } from './language.service';
import { CalendarOptions } from '@fullcalendar/angular';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare var $:any
@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
    userDetails: LoginDetails;
    language: any;
    userId: string;
    calendarOptions: CalendarOptions;
    selectLanguage: string;
    changeHeadline:any = new Subject()
    changeMobileTheme:any = new Subject()
    docViewOption:any = new Subject();
    docViewOrder:any = new Subject();

    constructor(private authService: AuthServiceService, private lang: LanguageService,
        private confirmDialogService: ConfirmDialogService, private sanitizer: DomSanitizer) { }


     /**
     * Function is used to set the view(list/grid) of the documents
     * @author MangoIt Solutions (M)
     * @param {number}
     */
    getSelectedDocView(view_id:number){
        this.docViewOption.next(view_id);
    }

    /**
     * Function is used to set the view(ascending/descending) of the documents
     * @author MangoIt Solutions (M)
     * @param {number}
     */
    getSelectedDocOrder(selectedDocOrder:any){
        this.docViewOrder.next(selectedDocOrder);
    }

    /**
     * Function is used to set the value of Headlines wording
     * @author MangoIt Solutions (M)
     * @param {number}
     */
    getChangeHeadline(changeHeadlineOption:string){
        this.changeHeadline.next(changeHeadlineOption);
    }

    getChangeMobileTheme(changeMobileThemeOption:string){
        this.changeMobileTheme.next(changeMobileThemeOption);
    }

    // Function to convert time to required format
       convertTime(time) {
        const parts = time.split(":");
        // Remove seconds if present
        if (parts.length > 2) {
            parts.pop();
        }
        // Pad with leading zero if necessary
        if (parts[1].length === 1) {
        parts[1] = "0" + parts[1];
        }
        return parts.join(":");
    }

    // Function to convert time to required format
    formatTime(time: string): string {
        if (time?.length === 5) { // check if time is in "hh:mm" format
            return time + ":00";
        } else {
            return time;
        }
    }


    /**
     * Function for the get particular users profile Information
     * @author MangoIt Solutions (M)
     * @param {user id}
     * @returns {Object} Details of the User
     */
    getMemberId(id: number) {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        var memberInfo:any = {};
        $("#profileSpinner").show();
        return new Promise((resolve,reject) =>{
            if (sessionStorage.getItem('token')) {
                this.authService.memberSendRequest('get', 'get-club-info/' + this.userDetails.database_id + '/' + this.userDetails.team_id, this.userDetails,)
                .subscribe(
                    (respData: any) => {
                        if(toString.call(respData) == '[object Object]'){
                            memberInfo.getclubInfo = respData;
                        }
                    },
                    (err:any) =>{
                        console.log(err);
                    });
            }
            this.authService.memberSendRequest('get', 'usersDetails/user_id/'+id+'/team/' + this.userDetails.team_id, null)
                .subscribe(
                    (respUser: any) => {
                        if(respUser?.length > 0){
                            this.authService.memberSendRequest('get', 'member-info/'+ this.userDetails.database_id + '/' + this.userDetails.team_id + '/' + respUser[0].member_id,null)
                            .subscribe(
                            (respData: any) => {
                                if(respData.isError == true){
                                    memberInfo.birthdateStatus = false;
                                }else{
                                    memberInfo.birthdateStatus = respData['shareBirthday'];
                                }
                            })
                            this.authService.memberSendRequest('get', 'profile-info/' +this.userDetails.database_id + '/' + this.userDetails.team_id + '/' +  respUser[0].member_id, null)
                            .subscribe(
                                (resp: any) => {
                                    if (toString.call(resp) == '[object Object]') {
                                        memberInfo.profile_data = resp;
                                        memberInfo.memberStartDateStatus = resp.membershipStartDate;
                                        this.authService.memberInfoRequest('get', 'profile-photo?database_id=' + this.userDetails.database_id + '&club_id=' + this.userDetails.team_id + '&member_id=' + respUser[0].member_id, null)
                                            .subscribe(
                                                (respData: any) => {
                                                    $("#profileSpinner").hide();
                                                    if(respData == '' || respData == null){
                                                        memberInfo.thumbnail = 'assets/img/defaultProfile.jpeg';
                                                    }else{
                                                        memberInfo.thumbnail = respData;
                                                    }
                                                    resolve(memberInfo);
                                                },
                                                (err) => {
                                                    memberInfo.thumbnail = 'assets/img/defaultProfile.jpeg';
                                                    resolve(memberInfo);
                                                    $("#profileSpinner").hide();

                                                }
                                            );
                                    } else {
                                        setTimeout(() => {
                                            memberInfo.displayError = true;
                                            resolve(memberInfo);
                                            $("#profileSpinner").hide();
                                        }, 2000);
                                    }
                                },
                            );
                        }else{
                            setTimeout(() => {
                                memberInfo.displayError = true
                                resolve(memberInfo);
                                $("#profileSpinner").hide();
                            }, 2000);
                        }
                    }
            );
        })
    }

    /**
    * Function is used to  get date differance
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
    getDays(cudate: any, date: any) {
        let cuday = cudate.getDate().toString().padStart(2, '0');
        let cumonth = (cudate.getMonth() + 1).toString().padStart(2, '0');
        let cuyear = cudate.getFullYear();
        var date1 = cuyear + '-' + cumonth + '-' + cuday + 'T00:0.000Z;';

        var d1 = new Date(date1.split('T')[0]);
        var date2 = new Date(date.split('T')[0]);
        var time = (date2.getTime() - d1.getTime()) / 1000;
        var days = Math.abs(Math.round(time / (3600 * 24)));
        return days;
    }

    /**
    * Function is used to  get progress bar calculation
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
    progressBarCalculation(startDate: any, EndDate: any) {
        var de1 = new Date(startDate.split('T')[0]).valueOf();
        var de2 = new Date(EndDate.split('T')[0]).valueOf();
        const diffTime = Math.abs(de2 - de1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var difCurrent = new Date(new Date().toISOString().split('T')[0]).valueOf();
        var difStartDate = new Date(startDate.split('T')[0]).valueOf();
        const diffCalTime = Math.abs(difCurrent - difStartDate);
        const diffCalDays = Math.ceil(diffCalTime / (1000 * 60 * 60 * 24));
        var progress = 100 * Math.round(diffCalDays) / Math.round(diffDays)
        return Math.round(progress);
    }

    /**
    * Function is used to get date differance
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
    getDayDifference(startDate: any, endDate: any) {
        var d1 = new Date(startDate?.split('T')[0]);
        var date2 = new Date(endDate?.split('T')[0]);
        var time = (d1.getTime() - date2.getTime()) / 1000;
        var days = Math.abs(Math.round(time / (3600 * 24)));
        return days;
    }


    /**
    * Function to get dates
    * @author  MangoIt Solutions
    * @param   {StartDate,EndDate}
    * @return  {Array} dates
    */
    getDates(startDate: Date, endDate: Date) {
        const dates = []
        let currentDate: Date = startDate
        const addDays = function (days) {
            const date = new Date(this.valueOf())
            date.setDate(date.getDate() + days)
            return date
        }
        while (currentDate <= endDate) {
            dates.push(currentDate)
            currentDate = addDays.call(currentDate, 1)
        }
        return dates
    }

    /**
    * Function is used to delete news by news Id
    * @author  MangoIt Solutions
    * @param   {newsId}
    * @return  success/ error message
    */
    deleteNews(newsId:any){
        let self = this;
        this.language = this.lang.getLanguaageFile();
        this.userId = localStorage.getItem('user-id');
        return new Promise((resolve,reject) =>{
            this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_article, function () {
                self.authService.setLoader(true);
                self.authService.memberSendRequest('delete', 'news/' + newsId + '/user/' + self.userId, null)
                    .subscribe(
                        (respData: any) => {
                            self.authService.setLoader(false);;
                            if (respData['isError'] == false) {
                                resolve(respData['result']['message']);
                            } else if (respData['code'] == 400) {
                                reject(respData['message']);
                            }
                        }
                    )
            }, function () {
            })
        })
    }

    /**
   * Function is used get the weeks of 6 month
   * @author  MangoIt Solutions
   * @param   {date}
   * @return  {array of object of dates} all the week dates
   */
    getFullWeekDays(date: Date) {
        const weeklyAllDays = [];
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // one week in milliseconds
        const oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
        for (let i = 0; i < 26; i++) { // 26 weeks = 6 months approximate
            const weeklyDays = [];
            const weekStart = new Date(date.getTime() + i * oneWeek);
            for (let j = 0; j < 7; j++) {
                weeklyDays.push(new Date(weekStart.getTime() + j * oneDay));
            }
            weeklyAllDays.push(weeklyDays);
        }
        return weeklyAllDays;
    }

    /**
    * Function is used to  get aspect Ratio
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
    getAspectRatio(imgHeight: any, imgWidth: any) {
        // let height = 780 * imgHeight / imgWidth;
        // let width  = 480 * imgWidth / imgHeight;
        // let aspectRatio = (imgHeight / imgWidth);
        // width = (width < imgWidth)? width: imgWidth;
        // height = (height < imgHeight) ? height: imgHeight;

        let height = 500;
        let width  = height * imgWidth / imgHeight;

        let aspectRatio = (imgHeight / imgWidth);

        width = imgWidth;
        height = imgHeight;

        let ratio = (width == imgWidth && height == imgHeight)? 100 :aspectRatio*100;
        return [Math.round(width),Math.round(height),Math.round(ratio)];
    }

    /**
    * Function is used to convert image to base 64
    * @author  MangoIt Solutions
    */
    base64ToFile(data: any, filename: string) {
        const arr: string = data.split(',');
        const mime: string = arr[0].match(/:(.*?);/)[1];  //image type formate
        const bstr: string = atob(arr[1]);  //atob() function decodes a string of data which has been encoded using Base64 encoding.
        let n: number = bstr.length;
        let u8arr: any = new Uint8Array(n); //The Uint8Array() constructor creates a typed array of 8-bit unsigned integers. The contents are initialized to 0.
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    /**
     * Function is used to get room by Id
     * @author  MangoIt Solutions
     * @param   {id}
     * @return  {object array}
     */
    roomsById(id: number) {
        this.authService.setLoader(true);
        return new Promise((resolve,reject) =>{
            this.authService.memberSendRequest('get', 'getRoomsById/' + id, null)
            .subscribe((respData: Room) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                    let roomsByIdData = respData['result'];
                    resolve(roomsByIdData);
                } else if (respData['code'] == 400) {
                    reject(respData['message']);
                }
            });
        });
    }

    /**
     * Function to get the room availability and booked room details
     * @author  MangoIt Solutions(M)
     * @param   {Room data by id}
     * @return  {object array}
     */
     getRoomCalendar(roomsByIdData:any){
        this.authService.setLoader(true);
        // var date_end:any = this.datePipe.transform(new Date(roomsByIdData.active_to),'YYYY-MM-DD' );
        var date_end:any = new Date(roomsByIdData.active_to)
        var calendarRooms = [];
        var count: number = 0;
        var count1: number = 0;
        var selectedDay: number;
        const inputDate = new Date(roomsByIdData.active_from);
        const weekDays = this.getDates(inputDate,date_end);
        var weekDates:any[]=[];
        var room_Booked = [];
        var room_avail = [];
        var same_date:any[]=[];
        weekDays.forEach((element) => {    // active from -to- active to
            const originalTime = new Date(element);
            const year = originalTime.getFullYear();
            const month = (originalTime.getMonth() + 1).toString().padStart(2, '0');
            const date = originalTime.getDate().toString().padStart(2, '0');
            const newTime = year + '-' + month + '-' + date;
            weekDates.push(newTime);
        })

        if (roomsByIdData?.room_availablity?.length > 0) {
            roomsByIdData.room_availablity.forEach((keys: any, vals: any) => {
                if(keys.weekday == '0' || keys.weekday == 'Sunday' || keys.weekday == 'Sonntag'|| keys.weekday == 'Воскресенье'|| keys.weekday == 'Pazar'|| keys.weekday == 'domingo'|| keys.weekday == 'dimanche'|| keys.weekday == 'domenica'){
                    selectedDay = 0;

                }else if(keys.weekday == '1' || keys.weekday == 'Monday' || keys.weekday == 'Montag'|| keys.weekday == 'понедельник'|| keys.weekday == 'Pazartesi'|| keys.weekday == 'lunes'|| keys.weekday == 'lundi' || keys.weekday == 'lunedì'){
                    selectedDay = 1;

                }else if(keys.weekday == '2' || keys.weekday == 'Tuesday' || keys.weekday == 'Dienstag'|| keys.weekday == 'вторник'|| keys.weekday == 'Salı'|| keys.weekday == 'martes'|| keys.weekday == 'mardi'|| keys.weekday == 'martedì'){
                selectedDay = 2;

                }else if(keys.weekday == '3' || keys.weekday == 'Wednesday' || keys.weekday == 'Mittwoch'|| keys.weekday == 'среда'|| keys.weekday == 'Çarşamba'|| keys.weekday == 'miércoles'|| keys.weekday == 'mercredi'|| keys.weekday == 'mercoledì'){
                selectedDay = 3;

                }else if(keys.weekday == '4' || keys.weekday == 'Thursday' || keys.weekday == 'Donnerstag'|| keys.weekday == 'четверг'|| keys.weekday == 'Perşembe'|| keys.weekday == 'jueves'|| keys.weekday == 'jeudi'|| keys.weekday == 'giovedì'){
                selectedDay = 4;

                }else if(keys.weekday == '5' || keys.weekday == 'Friday' || keys.weekday == 'Freitag'|| keys.weekday == 'Пятница'|| keys.weekday == 'Cuma'|| keys.weekday == 'viernes'|| keys.weekday == 'vendredi'|| keys.weekday == 'venerdì'){
                selectedDay = 5;

                }else if(keys.weekday == '6' || keys.weekday == 'Saturday' || keys.weekday == 'Samstag'|| keys.weekday == 'Суббота'|| keys.weekday == 'Cumartesi'|| keys.weekday == 'sábado'|| keys.weekday == 'samedi'|| keys.weekday == 'sabato'){
                selectedDay = 6;
                }

                weekDates.forEach((elem:any,i:any) =>{
                    if(new Date(elem).getDay() == selectedDay){
                        room_avail[count] = {
                            'start': elem + 'T' + keys.time_from, 'end': elem + 'T' + keys.time_to,
                            'date_start': elem, 'date_end': date_end ,'classNames': 'room-availability',
                        };
                        count++;
                    }
                })
            });
        }
        if (roomsByIdData?.roomBooking?.length > 0) {
            roomsByIdData.roomBooking.forEach((vals: any ,keys: any) => {
                weekDates.forEach((elem:any) =>{
                    if(elem ==  vals.date_from){
                        if(vals.course_id != null){
                            var title_name = vals.course.name;
                            var type = vals.course.type;
                            var evt_or_cour_id = vals.course.id;
                        }else if(vals.event_id != null){
                            var title_name = vals.event.name;
                            var type = vals.event.type;
                            var evt_or_cour_id = vals.event.id;
                        }
                        room_Booked[count1] = {
                            'start': elem + 'T' + vals.start_time, 'end': elem + 'T' + vals.end_time,'type': type,'id':evt_or_cour_id,
                            'title': title_name, 'date_start': elem,'date_end': elem,'classNames': 'room-booked',
                        };
                        count1++;
                    }
                })
            });
        }
        room_avail?.forEach((element:any)=>{
            room_Booked?.forEach((elem:any)=>{
                if(elem.date_start == element.date_start &&
                     elem.start.split('T')[1] >= element.start.split('T')[1] &&
                     elem.end.split('T')[1] <= element.end.split('T')[1]
                     ){
                    same_date.push(element)
                }
            })
        })
        let final_availability = room_avail.filter(item1 => !same_date?.some(item2 => (item1.start === item2.start && item1.end === item2.end)));
        calendarRooms = [...room_Booked, ...final_availability];
        return [{'cal':calendarRooms},{'avail': room_avail}];
        // return calendarRooms;
    }

       /**
     * Function to get the instructor availability and booked instructor details
     * @author  MangoIt Solutions(M)
     * @param   {Room data by id}
     * @return  {object array}
     */
       externalInstructorCalendar(instructorById:any){
        this.authService.setLoader(true);
        var instructorCalendar = [];
        var count: number = 0;
        var count1: number = 0;
        var selectedDay: number;
        var external_Booked = [];
        var external_avail = [];
        var same_date:any[]=[];
        const inputDate = new Date(instructorById.active_from);
        var date_end:any = new Date(instructorById.active_to)
        const weekDays = this.getDates(inputDate,date_end);
        var weekDates:any[]=[];
        weekDays.forEach((element) => {    // active from -to- active to
            const originalTime = new Date(element);
            const year = originalTime.getFullYear();
            const month = (originalTime.getMonth() + 1).toString().padStart(2, '0');
            const date = originalTime.getDate().toString().padStart(2, '0');
            const newTime = year + '-' + month + '-' + date;
            weekDates.push(newTime);
        })
        if (instructorById?.availablity?.length > 0) {
            instructorById.availablity.forEach((keys: any, vals: any) => {
                if(["Sonntag","Sunday","dimanche","domenica","Воскресенье","domingo","Pazar","0"].includes(keys.weekday)){
                    selectedDay = 0;
                }else if(["Montag","Monday","lundi","lunedì","понедельник","lunes","Pazartesi","1"].includes(keys.weekday)){
                    selectedDay = 1;
                }else if(["Dienstag","Tuesday","mardi","martedì","вторник", "martes","Salı","2"].includes(keys.weekday)){
                    selectedDay = 2;
                }else if(["Mittwoch","Wednesday","mercredi","mercoledì","среда","miércoles","Çarşamba","3"].includes(keys.weekday)){
                    selectedDay = 3;
                }else if(["Donnerstag","Thursday","jeudi","giovedì","четверг","jueves","Perşembe","4"].includes(keys.weekday)){
                    selectedDay = 4;
                }else if(["Freitag","Friday","vendredi","venerdì","Пятница","viernes","Cuma","5"].includes(keys.weekday)){
                    selectedDay = 5;
                }else if(["Samstag", "Saturday","samedi","sabato","Суббота","sábado","Cumartesi","6"].includes(keys.weekday)){
                    selectedDay = 6;
                }
                weekDates.forEach((elem:any,i:any) =>{
                    if(new Date(elem).getDay() == selectedDay){
                        external_avail[count] = {
                            'start': elem + 'T' + keys.time_from, 'end': elem + 'T' + keys.time_to,
                            'date_start': elem, 'date_end': date_end ,'classNames': 'exInstruct-availability',
                        };
                        count++;
                    }
                })
            });
        }
        if (instructorById?.instructorBooking?.length > 0) {
            instructorById.instructorBooking.forEach((vals: any ,keys: any) => {
                weekDates.forEach((elem:any) =>{

                    if(elem ==  vals.date_from){
                        if(vals.course_id != null){
                            var title_name = vals.course.name;
                            var type = vals.course.type;
                            var evt_or_cour_id = vals.course.id;
                        }
                        external_Booked[count1] = {
                            'start': elem + 'T' + vals.start_time, 'end': elem + 'T' + vals.end_time,'type': type,'id':evt_or_cour_id,
                            'title': title_name, 'date_start': elem,'date_end': elem,'classNames': 'exInstruct-booked',
                        };
                        count1++;
                    }
                })
            });
        }
        external_avail.forEach((element:any)=>{
            external_Booked.forEach((elem:any)=>{
                if(elem.date_start == element.date_start && elem.start.split('T')[1] >= element.start.split('T')[1]
                 && elem.end.split('T')[1] <= element.end.split('T')[1])
                {
                    same_date.push(element)
                }
            })
        })
        let final_availability = external_avail.filter(item1 => !same_date.some(item2 => (item1.start === item2.start && item1.end === item2.end)));
        instructorCalendar = [...external_Booked, ...final_availability];
        return [{'cal':instructorCalendar},{'avail': external_avail}];
        // return instructorCalendar
    }

    convertImages(image: any) {
        return new Promise((resolve,reject) =>{
            this.imageUrlToBlob(image)
            .then(imageBlob => {
                const blob = new Blob([imageBlob], { type: 'image/png' });
                let imgURL =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
                resolve(imgURL);
            })
            .catch(error => {
                console.error('Error converting image URL to blob:', error);
            });

        });
    }

    imageUrlToBlob(imageUrl) {
        return fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => blob);
    }

    convertBase64ToBlobUrl(base64Url: string): string {
        // Remove the prefix (e.g., data:image/jpeg;base64,) from the Base64 URL
        const base64Data = base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        // Convert the Base64 data to a Blob
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: 'image/jpeg' });

        // Create a Blob URL from the Blob object
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    }
}
