import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent implements OnInit {

    language: any;

  constructor( private lang: LanguageService,) { }

  ngOnInit(): void {
    this.language = this.lang.getLanguaageFile();
  }

}
