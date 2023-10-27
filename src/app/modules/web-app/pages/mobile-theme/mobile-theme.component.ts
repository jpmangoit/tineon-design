import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import {LoginDetails, ThemeType} from '@core/models';
import {AuthService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';


@Component({
	selector: 'app-mobile-theme',
	templateUrl: './mobile-theme.component.html',
	styleUrls: ['./mobile-theme.component.css']
})
export class MobileThemeComponent implements OnInit, OnDestroy {
	language: any;
	mobileThemeForm: UntypedFormGroup;
	mobileThemeControl: FormControl<string>;
	mobileTheme_options: any;
	setTheme: ThemeType
	private activatedSub: Subscription;
	userDetails: LoginDetails;
	defaultSelected: any;
	dropdownSettings: IDropdownSettings;
	position: { item_id: number, item_text: string }[] = [];

	constructor(private lang: LanguageService, private themes: ThemeService, private router: Router,
		private authService: AuthService, private notificationService: NotificationService,
		private commonFunctionService: CommonFunctionService) { }


	ngOnInit(): void {
		if (localStorage.getItem('club_theme') != null) {
			let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
			this.setTheme = resp;
		});

		this.language = this.lang.getLanguageFile();
		this.userDetails = JSON.parse(localStorage.getItem('user-data'));
		this.defaultSelected = localStorage.getItem('mobileThemeOption');
		this.mobileThemeForm = new UntypedFormGroup({
			select_options: new UntypedFormControl('', Validators.required),
		});

		this.mobileTheme_options = [
			{ item_id: "mobile-red", item_text: 'Red' },
			{ item_id: "mobile-green", item_text: 'Green' },
		];

		this.dropdownSettings = {
			singleSelection: true,
			idField: 'item_id',
			textField: 'item_text',
			allowSearchFilter: false,
			enableCheckAll: false,
			closeDropDownOnSelection: true
		}

		if (this.mobileTheme_options?.length > 0) {
			this.mobileTheme_options.forEach((val, key) => {
				if (val.item_id == this.defaultSelected) {
					this.position.push({ 'item_id': val.item_id, 'item_text': val.item_text });
					this.mobileThemeForm.controls['select_options'].setValue(this.position);
				}
			});
		}
	}
	onItemSelect(item: any) {
		this.defaultSelected = item.item_id;
	}

	onItemDeSelect(item: any) {
		this.defaultSelected = '';
	}

	changeMobileThemes() {
		if (this.mobileThemeForm.valid) {
			let data = {
				theme_colour: this.defaultSelected,
				user_id: this.userDetails.userId,
				team_id: this.userDetails.team_id
			}
			this.authService.setLoader(true);
			this.authService.memberSendRequest('post', 'set-mobile-theme/', data)
				.subscribe((respData: any) => {
					this.authService.setLoader(false);
					if (respData['isError'] == false) {
						localStorage.removeItem('mobileThemeOption');
						localStorage.setItem('mobileThemeOption', respData['result']['mobileTheme']['theme_colour']);
						this.notificationService.showSuccess(respData['result']['message'], null);
						const bodyTag = document.body;
						bodyTag.classList.remove('mobile-red');
						bodyTag.classList.remove('mobile-green');
						bodyTag.classList.add(respData['result']['mobileTheme']['theme_colour']);
						this.commonFunctionService.getChangeMobileTheme(respData['result']['mobileTheme']['theme_colour'])
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
