import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-option',
  templateUrl: './theme-option.component.html',
  styleUrls: ['./theme-option.component.css']
})
export class ThemeOptionComponent implements OnInit {

  layout1: any;
  layout2: any;
  layout3: any;
  layout4: any;
  layout5: any;
  layout6: any;
  layout7: any;
  layout8: any;

  bodyClass: string;

  constructor(@Inject(DOCUMENT) private document: any) {
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
  }

}
