import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../service/auth-service.service';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../../service/language.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ThemeService } from 'src/app/service/theme.service';
import { Subscription } from 'rxjs';
import { LoginDetails } from 'src/app/models/login-details.model';
import { GroupsDetail, NewsType } from 'src/app/models/news-type.model';
import { CommunityGroup } from 'src/app/models/community-group.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ThemeType } from 'src/app/models/theme-type.model';
import { NavigationService } from 'src/app/service/navigation.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxImageCompressService} from "ngx-image-compress";
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
@Component({
    selector: 'app-update-news',
    templateUrl: './update-news.component.html',
    styleUrls: ['./update-news.component.css'],
    providers: [DatePipe]
})

export class UpdateNewsComponent implements OnInit ,OnDestroy{
    language:any;
    userDetails:LoginDetails;
    newsData:NewsType;
    viewImage: boolean = false;
    submitted : boolean= false;
    imageChangedEvent: Event = null;
    croppedImage: string = '';
    file: File;
    fileToReturn: File;
    updateNewsForm: UntypedFormGroup;
    responseMessage: string = '';
    visiblity: {id: number,name: string }[] = [];
    groupVisiblity:number;
    visiblityDropdownSettings:IDropdownSettings;
    groupDropdownSettings:IDropdownSettings;
    categoryDropdownSettings:IDropdownSettings;
    dropdownSettings:IDropdownSettings; 
    groups:CommunityGroup;
    newsid:number;
    groupSelectedItem :number[]= [];
    teamId: number;
    setTheme: ThemeType;
    isImage: boolean = false;
    private activatedSub: Subscription;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        maxHeight: '15rem',
        placeholder: 'Write your content here...',
        translate: 'no',
        sanitize: true,
        toolbarPosition: 'top',
        defaultFontName: 'Arial',
        defaultFontSize: '2',
        defaultParagraphSeparator: 'p',
        fonts: [
            {class: 'gellix', name: 'Gellix'},
        ],
        toolbarHiddenButtons: [
            [
                'link',
                'unlink',
                'subscript',
                'superscript',
                'insertUnorderedList',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode',
                'insertImage',
                'insertVideo',
                'italic',
                'fontSize',
                'undo',
                'redo',
                'underline',
                'strikeThrough',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
                'heading',
                'textColor',
                'backgroundColor',
                'customClasses',
                'insertOrderedList',
                'fontName'
            ]
        ]
    };
    imgHeight: any;
    imgWidth: any;
    originalImg:string;

    constructor(
        private authService: AuthServiceService,
        private router: Router,
        public formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private lang: LanguageService,
        private themes: ThemeService,
        public navigation: NavigationService,
        private notificationService: NotificationService,
        private imageCompress: NgxImageCompressService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('club_theme') != null) {
            let theme:ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }

        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
            this.setTheme = resp;
        });

        this.language = this.lang.getLanguaageFile();
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.teamId = this.userDetails.team_id;
        this.getGroup();

        this.route.params.subscribe(params => {
            this.newsid = params['newsid'];
            this.getNewsDetails(this.newsid);
        });

        this.visiblity = [
            { "id": 0, "name": this.language.create_news.title },
            { "id": 2, "name": this.language.create_news.group_news },
            { "id": 3, "name": this.language.create_news.chairman },
        ];

        this.visiblityDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search,
            closeDropDownOnSelection: true
        };

        this.groupDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search
        };

        this.categoryDropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            idField: 'id',
            textField: 'title',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: this.language.header.search
        };

        this.updateNewsForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            add_image: [''],
            visible_dropdown: ['', Validators.required],
            group_dropdown: [''],
            category_dropdown: [''],
            show_guest: ['']
        });
    }

    /**
    * Function is used to get news details by id
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} news object
    */
    getNewsDetails(newsid: number) {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'get-news-by-id/' + newsid, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false && Object.keys(respData.result).length > 0) {
                            let userId: string = localStorage.getItem('user-id');
                            if ((respData.result.user.id == userId) || (this.userDetails.roles[0] == 'admin')) {
                                this.setNews(respData);
                            } else {
                                var redirectUrl: string = 'clubwall/';
                                this.router.navigate([redirectUrl]);
                            }
                        } else {
                            this.notificationService.showError(this.language.community_groups.no_news, null);
                        }
                    }
                );
        }
    }

    /**
    * Function is used to set news in form feilds
    * @author  MangoIt Solutions
    */
    setNews(allNews: NewsType) {
        let news: NewsType = allNews['result'];
        this.newsData = news;

        var type: { "id": string, "name": string }[];
        if (this.newsData.audience != null && this.newsData.audience == 2) {
            this.groupVisiblity = 2;
            type = [{ "id": "2", "name": this.language.create_news.group_news }];

        }else if (this.newsData.audience != null && this.newsData.audience == 0) {
            this.groupVisiblity = 0;
            type = [{ "id": "0", "name": this.language.create_news.title }];

        }else if (this.newsData.audience != null && this.newsData.audience == 3) {
            this.groupVisiblity = 3;
            type = [{ "id": "3", "name": this.language.create_news.chairman }];
        }

        if (this.newsData?.groups?.length) {
            let group_selected: { "id": number, "name": string }[] = [];
            for (const key in this.newsData.groups) {
                if (Object.prototype.hasOwnProperty.call(this.newsData.groups, key)) {
                    const element: GroupsDetail = this.newsData.groups[key];
                    let item: { "id": number, "name": string };
                    if ("id" in element.group) {
                        item = { "id": element.group.id, "name": element.group.name };
                        group_selected.push(item);
                        this.groupSelectedItem.push(item.id);
                    }
                }
            }
            this.updateNewsForm.controls['group_dropdown'].setValue(group_selected);
        }
        this.updateNewsForm.controls['title'].setValue(this.newsData.title);
        this.updateNewsForm.controls['content'].setValue(this.newsData.text);

        
        if (this.newsData?.news_image[0]?.news_image){
            this.originalImg = this.newsData?.news_image[0]?.news_image
            this.newsData.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(this.newsData?.news_image[0]?.news_image.substring(20)));
            // this.updateNewsForm.controls['add_image'].setValue(this.newsData?.news_image[0]?.news_image);
        }

        this.updateNewsForm.controls['visible_dropdown'].setValue(type);
        if (this.newsData.show_guest_list == 'false') {
            this.updateNewsForm.controls['show_guest'].setValue('');
        } else if (this.newsData.show_guest_list == 'true') {
            this.updateNewsForm.controls['show_guest'].setValue(this.newsData.show_guest_list);
        }
    }

    /**
    * Function is used to update news and send data in formData formate
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {string} return success message
    */
    updateNews() {
        this.submitted = true;
        if ((sessionStorage.getItem('token')) && (this.updateNewsForm.valid) && (!this.errorImage.isError)) {
            this.authService.setLoader(true);
            var priority:number = 1;
            var audience:number = this.groupVisiblity;
            var tags:any = null;
            var attachment:any = null;
            var show_guest:boolean = this.updateNewsForm.get('show_guest').value;
            var formData: any = new FormData();
            if(this.fileToReturn){
                formData.append("file", this.updateNewsForm.get('add_image').value);
            }else{
                // this.updateNewsForm.controls['add_image'].setValue(this.newsData?.news_image[0]?.news_image);
                formData.append("file", this.originalImg );
            }
            formData.append("team_id", this.userDetails.team_id);
            formData.append("title", this.updateNewsForm.get('title').value);
            formData.append("headline", this.updateNewsForm.get('content').value);
            formData.append("text", this.updateNewsForm.get('content').value);
            formData.append("author", this.newsData.author);
            formData.append("priority", priority);
            if ((attachment == null) || (tags == null)) {
                formData.append("attachment", attachment);
                formData.append("tags", tags);
            }
            formData.append("audience", audience);
            formData.append("approved_statud", this.newsData.approved_status);
            if (this.groupSelectedItem && this.groupSelectedItem.length) {
                var uniqueGroupItem = this.authService.uniqueData(this.groupSelectedItem);
                formData.append("groups", "[" + uniqueGroupItem + "]");
            }
            if (show_guest) {
                formData.append("show_guest_list", show_guest.toString());
            }
            else {
                formData.append("show_guest_list", false);
            }
            formData.append("publication_date_to", new Date().toISOString());
            formData.append("publication_date_from", new Date().toISOString());
            this.authService.setLoader(true);
            this.authService.memberSendRequest('put', 'news/' + this.newsData.id, formData)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.submitted = false;
                        if (respData['isError'] == false) {
                            this.notificationService.showSuccess(respData.result.message, null);
                            var self = this;
                            setTimeout(function () {
                                const url: string[] = ['clubnews-detail/' + self.newsData.id];
                                self.router.navigate(url);
                            }, 1500);
                        } else if (respData['code'] == 400) {
                            this.notificationService.showError(respData['message'], null);
                        }
                    },
                );
        }
    }

    /**
    * Function is used to add validation as per Visiblity selection
    * @author  MangoIt Solutions
    */
    onVisiblitySelect(item: {id: number, name: string}) {
        this.groupVisiblity = item.id;
        if (this.groupVisiblity == 2) {
            this.updateNewsForm.get('group_dropdown').setValidators(Validators.required);
            this.updateNewsForm.get('group_dropdown').updateValueAndValidity();
        }else {
            this.groupSelectedItem = [];
            this.updateNewsForm.get('group_dropdown').clearValidators();
            this.updateNewsForm.get('group_dropdown').updateValueAndValidity();
        }
    }

    /**
    * Function is used to get groups list as per team id
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} groups object
    */
    getGroup() {
        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'teamgroups/' + this.teamId, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        this.groups = respData;
                    }
                );
        }
    }

    /**
    * Function is used to select group
    * @author  MangoIt Solutions
    */
    onGroupItemSelect(item: { id: number, name: string }) {
        this.groupSelectedItem.push(item.id);
    }

    /**
    * Function is used to un-select group
    * @author  MangoIt Solutions
    */
    onGroupItemDeSelect(item: { id: number, name: string }) {
        if (this.groupSelectedItem && this.groupSelectedItem.length > 0) {
            this.groupSelectedItem.forEach((value, index) => {
                if (value == item.id) {
                    this.groupSelectedItem.splice(index, 1);
                }
            });
        }
    }

    /**
    * Function is used to validate file type is image and upload images
    * @author  MangoIt Solutions
    * @param   {}
    * @return  error message if file type is not image
    */
    errorImage:  { isError: boolean, errorMessage: string} = { isError: false, errorMessage: '' };
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
                }, 2000);
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
        const file = (event.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                this.imgWidth = img.width;
                this.imgHeight = img.height;
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);

    }
    /**
    * Function is used to cropped and compress the uploaded image
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {object} file object
    */
    imageCropped(event: ImageCroppedEvent) {
        this.errorImage = { isError: false, errorMessage: ''};
        let imgData = this.commonFunctionService.getAspectRatio(event.height, event.width);
        this.croppedImage = event.base64;
        this.imageCompress.compressFile(this.croppedImage,-1, imgData[2], 100, imgData[0], imgData[1]) // 50% ratio, 50% quality
        .then(
            (compressedImage) => {
                this.fileToReturn = this.commonFunctionService.base64ToFile(compressedImage, this.imageChangedEvent.target['files'][0].name,);
                this.updateNewsForm.patchValue({ add_image: this.fileToReturn });
                this.updateNewsForm.get('add_image').updateValueAndValidity();
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

    onCancel() {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
    }

}
