import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.css']
})
export class AppStoreComponent implements OnInit {

  selectedOption:any;
  constructor() { }

  ngOnInit(): void {
    this.selectedOption = parseInt(localStorage.getItem('headlineOption'));
  }

}
