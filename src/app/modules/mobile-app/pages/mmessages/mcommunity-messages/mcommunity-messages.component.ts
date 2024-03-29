import { Component, OnInit } from '@angular/core';
import {DropdownService, LanguageService} from '@core/services';


@Component({
    selector: 'app-mcommunity-messages',
    templateUrl: './mcommunity-messages.component.html',
    styleUrls: ['./mcommunity-messages.component.css']
})

export class McommunityMessagesComponent implements OnInit {
    activeClass: string = 'personal';
    displayPersonalMsg: boolean = true;
    displayClubMsg: boolean = false;
    displayGroupMsg: boolean = false;
    displayGroups: boolean = false;
    language: any;
    headline_word_option: number = 0;
    selected = '1';
    messageFilterVal : number = 1;
    messageTypeVal : number = 1;
    selectedType = '1';
    constructor(
        private lang: LanguageService,private dropdownService: DropdownService
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguageFile();
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
        this.messageFilter('1')
    }

    messageFilter(id:any){
        this.messageFilterVal = id;
        if(id == 1){
            this.peronalMsg()
        }else if(id == 2){
            this.clubMsg()
        }else if(id == 3){
            this.groupMsg()
        }
    }

    onSelectMsgType(value:any) {
        this.messageTypeVal = value;
        this.dropdownService.updateDropdownValue(value);
    }


    peronalMsg() {
        this.displayPersonalMsg = true;
        this.displayClubMsg = false;
        this.displayGroupMsg = false;
    }

    clubMsg() {
        this.displayPersonalMsg = false;
        this.displayClubMsg = true;
        this.displayGroupMsg = false;
    }

    groupMsg() {
        this.displayPersonalMsg = false;
        this.displayClubMsg = false;
        this.displayGroupMsg = true;
    }



    // active class functions
    onClick(check) {
        this.activeClass = check == 1 ? "personal" : check == 2 ? "club" : check == 3 ? "group" : "personal";
    }
}
