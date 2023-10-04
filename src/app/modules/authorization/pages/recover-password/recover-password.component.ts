import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { LanguageService } from '../../../../service/language.service';

@Component({
	selector: 'app-recover-password',
	templateUrl: './recover-password.component.html',
	styleUrls: ['./recover-password.component.css']
})

export class RecoverPasswordComponent implements OnInit{
	language:any;

	forgotSubmit: boolean = false;
	validError: boolean = false;
	successMsg: boolean = false;
	formError:string;

	constructor(
		public authService: AuthServiceService,
		private lang: LanguageService,
	) { }

	ngOnInit(): void {
		this.language = this.lang.getLanguaageFile();
	}

	forgotForm = new UntypedFormGroup({
		username: new UntypedFormControl('', [Validators.required])
	});

	forgotProcess() {
		this.formError = '';
		this.forgotSubmit = true;
		this.validError = false;
		this.successMsg = false;

		if (this.forgotForm.valid) {
			this.authService.setLoader(true);
			this.authService.sendRequest('post', 'forgot-password', this.forgotForm.value)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						this.forgotSubmit = false;
						this.validError = false;

						if (respData['code'] == 400) {
							this.validError = true;
							this.formError = respData['message'];
							if(respData['message']['message']){
								this.formError = respData['message']['message'];
							}else{
								this.formError = respData['message'];
							}
						} else {
							this.successMsg = true;
						}
					}
				);
		}
	}
}
