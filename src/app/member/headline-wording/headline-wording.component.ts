import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { LanguageService } from 'src/app/service/language.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ThemeService } from 'src/app/service/theme.service';

@Component({
  selector: 'app-headline-wording',
  templateUrl: './headline-wording.component.html',
  styleUrls: ['./headline-wording.component.css']
})
export class HeadlineWordingComponent implements OnInit ,OnDestroy {
    language:any;
    headlineForm:UntypedFormGroup;
    headlineControl: FormControl<string>;
    headline_options:any;
    setTheme: ThemeType
    private activatedSub: Subscription;
    userDetails: LoginDetails;
    defaultSelected:any;
    dropdownSettings: IDropdownSettings;
    position:  {item_id: number, item_text: string }[]=[];

    constructor(private lang: LanguageService,  private themes: ThemeService, private router: Router,
        private authService: AuthServiceService,private notificationService: NotificationService,
        private commonFunctionService: CommonFunctionService) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });

        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.defaultSelected = parseInt(localStorage.getItem('headlineOption'));

        this.headlineForm = new UntypedFormGroup({
            select_options: new UntypedFormControl('',Validators.required),
        });

        this.headline_options = [
            { item_id: 0, item_text: 'Standard' },
            { item_id: 1, item_text: 'Unternehmen' },
        ];

        this.dropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            allowSearchFilter: false,
            enableCheckAll: false,
            closeDropDownOnSelection: true
        }

        if(this.headline_options?.length > 0){
            this.headline_options.forEach((val, key) => {
                if (val.item_id == this.defaultSelected) {
                    this.position.push({ 'item_id': val.item_id, 'item_text': val.item_text });
                    this.headlineForm.controls['select_options'].setValue(this.position);
                }
            });
        }
    }

    onItemSelect(item:any){
        this.defaultSelected = item.item_id;
    }

    onItemDeSelect(item:any){
        this.defaultSelected = '';
    }

    changeHeadlines(){
        if(this.headlineForm.valid){
            let data = {
                headline_options: this.defaultSelected,
                user_id: this.userDetails.userId
            }
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'setHeadlineOption/',data)
            .subscribe((respData: any) => {
                this.authService.setLoader(false);
                if (respData['isError'] == false) {
                        localStorage.removeItem('headlineOption');
                        localStorage.setItem('headlineOption', respData['result']['user']['headlineOption']);
                        this.notificationService.showSuccess(respData['result']['message'] , null);
                        this.commonFunctionService.getChangeHeadline(respData['result']['user']['headlineOption'])
                } else if (respData['code'] == 400) {
                    this.notificationService.showError(respData['message'], null);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }
}
