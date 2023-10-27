import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { baseUrl } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    uncaughtError: boolean = false;
    chatMessage: any = new Subject();
    chat: any;
    timeoutErrorFlag: Boolean = false;
    loader: Boolean = false;

    constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) {
    }

    sendRequest(method: string, endPoint: string, data: any) {
        return this._actualSendRequest(method, endPoint, data);
    }

    memberSendRequest(method: string, endPoint: string, data: any) {
        return this._actualSendRequest(method, endPoint, data);
    }

    memberInfoRequest(method: string, endPoint: string, data: any) {
        return this._actualSendRequest(method, endPoint, data);
    }

    _actualSendRequest(method: string, endPoint: string, data: any) {
        let isOffile = this.showOffile;
        if (!isOffile) {
            /* Show golbal error cause by HTTP service */
            this.uncaughtError = false;
            setInterval(() => {
                this.uncaughtError = false;
            }, 5000);
            /* ------------------------------------ */
            let endPointUrl: string;
            endPointUrl = `${baseUrl}` + endPoint + ``;
            if (method == 'post') {
                return this.http.post(endPointUrl, data);
            } else if (method == 'put') {
                return this.http.put(endPointUrl, data);
            } else if (method == 'delete') {
                return this.http.delete(endPointUrl);
            } else {
                if (endPoint.includes('profile-photo') || endPoint.includes('member-photo')) {
                    const salt: number = (new Date()).getTime();
                    return this.http.get<Blob>(endPointUrl + '&' + salt, { responseType: 'blob' as 'json' }).pipe(map(blob => {
                        var urlCreator: any = window.URL || window.webkitURL;;
                        return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
                    }))
                }
                return this.http.get(endPointUrl);
            }
        }
    }

    clearStorageLogout() {
        localStorage.clear();
    }

    setLoader(value: Boolean) {
        this.loader = value;
    }

    get showLoader() {
        return this.loader;
    }

    setTimeoutErrorFlag(value: Boolean) {
        this.timeoutErrorFlag = value;
    }
    get getTimeoutErrorFlag() {
        return this.timeoutErrorFlag;
    }

    get showOffile() {
        return !navigator.onLine;
    }

    reloadRequest(method: string, endPoint: string, data: any) {
        return this._actualSendRequest(method, endPoint, data);
    }


    IsLoggedIn() {
        //it returns a boolean value, if the token exsist then true else vice versa
        return !!localStorage.getItem('token');

    }

    getToken() {
        let session: string = 'Bearer ' + localStorage.getItem('token');
        return session;
    }

    sendMessage(chat) {
        this.chat = chat
        this.chatMessage.next(chat);
    }

    get message() {
        return this.chat
    }

    downloadDocument(method: string, endPoint: string, data: any) {
        let isOffile = this.showOffile;
        if (!isOffile) {
            /* Show golbal error cause by HTTP service */
            this.uncaughtError = false;
            setInterval(() => {
                this.uncaughtError = false;
            }, 5000);
            /* ------------------------------------ */
            let endPointUrl: string;
            endPointUrl = `${baseUrl}` + endPoint + ``;
            return this.http.post(endPointUrl, data, { responseType: "blob" });
        }
    }

    /**
     * Function is usesd for return uniqe array
     * @author MangoIt Solutions
     * @param {array}
     * @returns {array} uniqe array
     */

    uniqueData(uniqueData: any) {
        if (uniqueData && uniqueData.length > 0) {
            return uniqueData.filter((value, index, array) => array.indexOf(value) === index);
        } else {
            return [];
        }

    }

    /**
    * Function is usesd for return uniqe object array
    * @author MangoIt Solutions
    * @param {object array}
    * @returns {object array} uniqe object array
    */
    uniqueObjData(uniqueData: any, key: any) {
        return [...new Map(uniqueData.map(item => [item[key], item])).values()];
    }
}
