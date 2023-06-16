import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-m-email',
  templateUrl: './m-email.component.html',
  styleUrls: ['./m-email.component.css']
})
export class MEmailComponent implements OnInit {
    language: any;
    isMobile: boolean = false;
    emailForm: UntypedFormGroup;
    emailsubmitted: boolean = false;
    formError: string;
    validError: boolean = false;

  constructor(
    public authService: AuthServiceService,private lang: LanguageService,
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 768) {
        this.isMobile = true;
    }
    this.language = this.lang.getLanguaageFile();
    this.emailForm = new UntypedFormGroup({
        email: new UntypedFormControl('', [Validators.required]),
        isMobile: new UntypedFormControl('')
    });
  }

  emailProcess() {
    this.formError = '';
    this.emailsubmitted = true;
    this.validError = false;
  }

}
