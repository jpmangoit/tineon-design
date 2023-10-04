import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LoginDetails } from 'src/app/models/login-details.model';
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
