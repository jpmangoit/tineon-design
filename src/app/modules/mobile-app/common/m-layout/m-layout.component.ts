import { Component, OnInit } from '@angular/core';
import {LoginDetails} from '@core/models';
import {AuthServiceService} from '@core/services';


@Component({
  selector: 'app-m-layout',
  templateUrl: './m-layout.component.html',
  styleUrls: ['./m-layout.component.css']
})
export class MLayoutComponent implements OnInit {
  userDetails: LoginDetails;
  constructor(public authService:AuthServiceService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('user-data'));
  }

}
