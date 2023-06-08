import { Injectable } from '@angular/core';
import  *  as deutschLanguage from "../deutsch_language.json";
import  *  as englishLanguage from "../english_language.json";
import  *  as turkischLanguage from "../turkisch_language.json";
import  *  as italianLanguage from "../italian_language.json";
import  *  as spanishLanguage from "../spanish_language.json";
import  *  as frenchLanguage from "../french_language.json";

import * as Language from "../language.json";


@Injectable({
  providedIn: 'root'
})
export class LanguageService{
    constructor() { }
    deutschlanguage: any = (deutschLanguage as any).default;
    englishlanguage: any = (englishLanguage as any).default;
    turkischLanguage: any = (turkischLanguage as any).default;
    italianLanguage: any = (italianLanguage as any).default;
    spanishLanguage: any = (spanishLanguage as any).default;
    frenchLanguage: any = (frenchLanguage as any).default;

    language: any = (Language as any).default;

    getLanguaageFile() {
        let language:string = localStorage.getItem('language');
        if(language == "en"){
            return this.englishlanguage;
        }else if(language == "tr"){
            return this.turkischLanguage;
        }else if(language == "it"){
            return this.italianLanguage;
        }else if(language == "sp"){
            return this.spanishLanguage;
        }else if(language == "fr"){
            return this.frenchLanguage;
        }else{
            return this.deutschlanguage;
        }
    }

    getBanner(){
        return this.language
    }
}
