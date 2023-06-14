import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';

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

    constructor(
        private lang: LanguageService,
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
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
