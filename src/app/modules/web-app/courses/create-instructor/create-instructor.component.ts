import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LanguageService } from 'src/app/service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs'
import { ThemeType } from 'src/app/models/theme-type.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService } from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
declare var $: any;

@Component({
	selector: 'app-create-instructor',
	templateUrl: './create-instructor.component.html',
	styleUrls: ['./create-instructor.component.css']
})

export class CreateInstructorComponent implements OnInit, OnDestroy {
	language: any;
	instructorForm: UntypedFormGroup
	weekdayList: UntypedFormArray;
	qualificationList: UntypedFormArray;
	formSubmit: boolean = false;
	setTheme: ThemeType;
	idx: number;
	indax: number;
	responseMessage: string;
	teamId: number;
	selectDay: string[] = [];
	imageChangedEvent: Event = null;
	croppedImage: string = '';
	file: File;
	fileToReturn: File;
	coursesTypeList: { id: number, name: number }[] = [];
	weekdayArray: { name: any; id: number; }[];
	errorFromTime: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	errorTime: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	errorQualification: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	weekdayDropdownSettings: IDropdownSettings;
	private activatedSub: Subscription;
	isImage: boolean = false;
	imgHeight: any;
	imgWidth: any;
	minDate: any;

	constructor(private formbuilder: UntypedFormBuilder,
		private themes: ThemeService,
		private lang: LanguageService,
		private router: Router,
		private authService: AuthServiceService,
		public navigation: NavigationService,
		private notificationService: NotificationService,
		private imageCompress: NgxImageCompressService,
		private commonFunctionService: CommonFunctionService
	) { }

	ngOnInit(): void {
		if (localStorage.getItem('club_theme') != null) {
			let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
			this.setTheme = theme;
		}
		this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
			this.setTheme = resp;
		});

		this.language = this.lang.getLanguaageFile()
		let userData: LoginDetails = JSON.parse(localStorage.getItem('user-data'));
		this.teamId = userData.team_id;
		this.instructorForm = this.formbuilder.group({
			first_name: ['', [Validators.required]],
			last_name: ['', Validators.required],
			emaill: ['', [Validators.required, Validators.email]],
			phone_no: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
			address: ['', Validators.required],
			add_img: ['', Validators.required],
			author: [userData.userId],
			approved_status: [0],
			weekdays: this.formbuilder.array([
				this.formbuilder.group({
					day: ['', Validators.required],
					time_from: ['', Validators.required],
					time_to: ['', Validators.required]
				})
			]),
			qualifications: this.formbuilder.array([
				this.formbuilder.control('', Validators.required)
			]),
			active_from: ['', Validators.required],
			active_to: ['', Validators.required],
		});

		this.weekdayArray = [
			{ id: 1, name: this.language.new_create_event.monday },
			{ id: 2, name: this.language.new_create_event.tuesday },
			{ id: 3, name: this.language.new_create_event.wednesday },
			{ id: 4, name: this.language.new_create_event.thrusday },
			{ id: 5, name: this.language.new_create_event.friday },
			{ id: 6, name: this.language.new_create_event.saturday },
			{ id: 0, name: this.language.new_create_event.sunday },
		];

		this.weekdayDropdownSettings = {
			singleSelection: true,
			idField: 'id',
			textField: 'name',
			allowSearchFilter: false,
			enableCheckAll: false,
			closeDropDownOnSelection: true
		};

		this.coursesTypeList = [
			{ "id": 1, "name": 1 }, { "id": 2, "name": 2 }, { "id": 3, "name": 3 }
		]

		// this.weekdayDropdownSettings = {
		// 	singleSelection: true,
		// 	allowSearchFilter: false,
		// 	enableCheckAll: false,
		//     closeDropDownOnSelection: true
		// }
	}

	get qualifications() {
		return this.instructorForm.get('qualifications') as UntypedFormArray
	}

	/**
	 * Add More Qualification
	 * @author  MangoIt Solutions
	 */
	addQualifications() {
		if (this.qualifications.valid) {
			this.qualifications.push(this.formbuilder.control('', Validators.required))
		}
	}

	/**
	 * remove More Qualification
	 * @author  MangoIt Solutions
	 */
	removeQualification(index: number) {
		this.qualifications.removeAt(index);
	}

	get weekdays() {
		return this.instructorForm.get('weekdays') as UntypedFormArray;
	}

	/**
	 * Add More Available Day and time
	 * @author  MangoIt Solutions
	 */
	addAvailableTimes() {
		if (this.errorTime.isError == false) {
			if (this.weekdays.valid) {
				const newAvailableTimes: UntypedFormGroup = this.formbuilder.group({
					day: ['', Validators.required],
					time_from: ['', Validators.required],
					time_to: ['', Validators.required]
				})
				this.weekdays.push(newAvailableTimes)
			}
		}
	}

	/**
	 * Remove More Available Day and time
	 * @author  MangoIt Solutions
	 */
	removeAvailableTimes(index: number) {
		this.weekdays.removeAt(index);
	}

	/**
	 * Function is used to select week day
	 * @author  MangoIt Solutions
	 */
	onWeekdayItemSelect(item: any) {
		this.selectDay.push(item.id);
	}

	/**
	 * Function is used to de select week day
	 * @author  MangoIt Solutions
	 */
	onWeekdayItemDeSelect(item: string) {
		this.selectDay = [];
	}

	/**
	* Function is used to create Instructor
	* @author  MangoIt Solutions
	* @param   {}
	* @return  {}
	*/
	createInstructor() {
		this.formSubmit = true;

		if (this.instructorForm.valid && (this.errorTime['isError'] == false)) {
			for (let i = 0; i < this.instructorForm?.controls?.weekdays?.value?.length; i++) {
				this.instructorForm.value.weekdays[i].day = this.instructorForm.controls.weekdays.value[i].day[0]?.id;
				//this.instructorForm.value.weekdays[i].day = (this.instructorForm.controls?.weekdays?.value[i]?.day[0]?.length == 1) ? this.instructorForm.controls?.weekdays?.value[i]?.day : this.instructorForm.controls?.weekdays?.value[i]?.day[0];
			}

			this.instructorForm.value['team_id'] = this.teamId;
			var formData: FormData = new FormData();
			for (const key in this.instructorForm.value) {
				if (Object.prototype.hasOwnProperty.call(this.instructorForm.value, key)) {
					const element = this.instructorForm.value[key];
					if (key == 'first_name') {
						formData.append('first_name', element);
					}
					if (key == 'last_name') {
						formData.append('last_name', element);
					}
					if (key == 'emaill') {
						formData.append('emaill', element);
					}
					if (key == 'phone_no') {
						formData.append('phone_no', element);
					}
					if (key == 'address') {
						formData.append('address', element);
					}
					if (key == 'add_img') {
						formData.append('file', element);
					}
					if (key == 'qualifications') {
						formData.append('qualifications', JSON.stringify(element));
					}
					if (key == 'weekdays') {
						formData.append('weekdays', JSON.stringify(element));
					}
					if (key == 'team_id') {
						formData.append('team_id', element);
					} else {
						if ((key != 'first_name') && (key != 'last_name') && (key != 'emaill') && (key != 'phone_no') && (key != 'address') && (key != 'add_img') && (key != 'qualifications')
							&& (key != 'weekdays') && (key != 'team_id')) {
							formData.append(key, element);
						}
					}
				}
			}

			this.authService.setLoader(true);
			this.authService.memberSendRequest('post', 'createInstructor', formData)
				.subscribe(
					(respData: any) => {
						this.authService.setLoader(false);
						if (respData['isError'] == false) {
							this.notificationService.showSuccess(respData['result']['message'], null);
							setTimeout(() => {
								this.router.navigate(['/web/instructor-detail/' + respData['result']['instructor']['id']]);
							}, 2000);
						} else if (respData['code'] == 400) {
							this.notificationService.showError(respData['message'], null);
						}
					}
				);
		}
		// if (this.instructorForm.valid && (this.errorTime['isError'] == false)) {
		// 	this.authService.setLoader(true);
		// 	this.authService.memberSendRequest('post', 'createInstructor', formData)
		// 		.subscribe(
		// 			(respData: any) => {
		// 				this.authService.setLoader(false);
		// 				if (respData['isError'] == false) {
		// 					this.notificationService.showSuccess(respData['result']['message'], null);
		// 					setTimeout(() => {
		// 						this.router.navigate(['/instructor-detail/' + respData['result']['instructor']['id']]);
		// 					}, 2000);
		// 				} else if (respData['code'] == 400) {
		// 					this.notificationService.showError(respData['message'], null);
		// 				}
		// 			}
		// 		);
		// }
	}

	getToday(): string {
		return new Date().toISOString().split('T')[0];
	}

	/**
	* Function is used to compare two time
	* @author  MangoIt Solutions
	*/
	compareTwoTimes(item: any) {
		this.indax = item;
		this.idx = item
		this.errorTime = { isError: false, errorMessage: '' };
		this.errorFromTime = { isError: false, errorMessage: '' };

		for (let i = 0; i < this.instructorForm?.controls?.weekdays?.value.length; i++) {
			if ((this.instructorForm?.controls?.weekdays?.value[i]?.['time_from'] != "" && this.instructorForm?.controls?.weekdays?.value[i]?.['time_to'] != "") &&
				(this.instructorForm?.controls?.weekdays?.value[i]?.['time_from'] > this.instructorForm?.controls?.weekdays?.value[i]?.['time_to']) ||
				(this.instructorForm?.controls?.weekdays?.value[i]?.['time_from'] == this.instructorForm?.controls?.weekdays?.value[i]?.['time_to'])) {
				this.errorTime = { isError: true, errorMessage: this.language.error_message.end_time_same };
				return this.indax;
			} else {
				this.errorTime = { isError: false, errorMessage: '' };
			}
			for (let j = 0; j < this.instructorForm.value?.weekdays?.length; j++) {
				if (this.instructorForm?.controls?.weekdays?.value[i]?.['day'][0] == this.instructorForm.controls.weekdays.value[j]['day'][0]) {
					if (((i != j) && this.instructorForm?.controls?.weekdays?.value[i]?.['time_from'] < this.instructorForm.controls.weekdays.value[j]['time_to'])) {
						this.errorFromTime = { isError: true, errorMessage: this.language.error_message.sameTimeNotSelect };
						return this.idx;
					}
				}
			}
		}
	}


	/**
	* Function is used to get end date
	* @author  MangoIt Solutions
	*/
	getEndDate() {
		this.instructorForm.get('active_from').valueChanges.subscribe((value) => {
			this.minDate = value;
		});
		if (this.minDate != undefined) {
			return this.minDate
		} else {
			return this.getToday()
		}
	}

	/**
	 * Function is used to go to back button
	 * @author  MangoIt Solutions
	 */
	onCancel() {
		window.history.back();
	}

	/**
	* Function is used to validate file type is image and upload images
	* @author  MangoIt Solutions
	* @param   {}
	* @return  error message if file type is not image
	*/
	errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
	uploadFile(event: Event) {
		var file: File = (event.target as HTMLInputElement).files[0];
		if (file) {
			const mimeType: string = file.type;
			if (mimeType.match(/image\/*/) == null) {
				this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
				this.croppedImage = '';
				this.imageChangedEvent = null;
				$('.preview_txt').hide();
				$('.preview_txt').text('');
				setTimeout(() => {
					this.errorImage = { isError: false, errorMessage: '' };
				}, 3000);
			} else {
				this.errorImage = { isError: false, errorMessage: '' };
				this.fileChangeEvent(event)
			}
		}
	}

	fileChangeEvent(event: Event): void {
		if (event && event.type == 'change') {
			this.croppedImage = '';
			this.imageChangedEvent = null;
			$('.preview_txt').hide();
			$('.preview_txt').text('');
			this.isImage = true;
		}
		this.imageChangedEvent = event;
		this.file = (event.target as HTMLInputElement).files[0];
		var mimeType: string = this.file.type;
		if (mimeType.match(/image\/*/) == null) {
			this.errorImage = { isError: true, errorMessage: this.language.error_message.common_valid };
		}
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				this.imgWidth = img.width;
				this.imgHeight = img.height;
			};
			img.src = reader.result as string;
		};
		reader.readAsDataURL(this.file);
	}

	/**
	* Function is used to cropped and compress the uploaded image
	* @author  MangoIt Solutions
	* @param   {}
	* @return  {object} file object
	*/
	imageCropped(event: ImageCroppedEvent) {
		let imgData = this.commonFunctionService.getAspectRatio(this.imgHeight, this.imgWidth);
		this.croppedImage = event.base64;
		this.imageCompress.compressFile(this.croppedImage, -1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
			.then(
				(compressedImage) => {
					this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
					this.instructorForm.patchValue({ add_img: this.fileToReturn });
					this.instructorForm.get('add_img').updateValueAndValidity();
					$('.preview_txt').show(this.fileToReturn.name);
					$('.preview_txt').text(this.fileToReturn.name);
				}
			);
	}

	imageLoaded() {
	}

	cropperReady() {
		/* cropper ready */
		this.isImage = false;
	}

	loadImageFailed() {
		/* show message */
	}

	ngOnDestroy(): void {
		this.activatedSub.unsubscribe();
	}
}
