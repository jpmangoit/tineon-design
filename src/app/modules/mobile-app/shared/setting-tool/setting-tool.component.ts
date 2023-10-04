import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/service/language.service';

@Component({
    selector: 'app-setting-tool',
    templateUrl: './setting-tool.component.html',
    styleUrls: ['./setting-tool.component.css']
})

export class SettingToolComponent {
    layout1: any;
    layout2: any;
    layout3: any;
    layout4: any;
    language: any;

    constructor(@Inject(DOCUMENT) private document: any, private _bottomSheetRef: MatBottomSheetRef<SettingToolComponent>, private _router: Router, private lang: LanguageService) { }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    addClass($event) {
        if (this.document.body.classList) {
            let className = Object['values'](this.document.body.classList).filter(d => d !== $event);
            className.map(d => this.document.body.classList.remove(d));
            this.document.body.classList.add($event);
        }
        else {
            this.document.body.classList.add($event);
        }

    }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
    }

    onLanguageSelect(lan: string) {
        localStorage.setItem('language', lan);
        window.location.reload();
    }

    logout() {
        this._bottomSheetRef.dismiss();
        sessionStorage.clear();
        localStorage.clear();
        this._router.navigate(["/login"]);
    }

}
