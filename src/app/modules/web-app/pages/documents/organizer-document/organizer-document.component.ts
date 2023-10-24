import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import {
  AuthorizationAccess,
  CreateAccess,
  DocumentsType,
  LoginDetails,
  ParticipateAccess,
  ThemeType,
  UploadDocVisibility,
  UserAccess
} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';

declare var $: any;

@Component({
    selector: 'app-organizer-document',
    templateUrl: './organizer-document.component.html',
    styleUrls: ['./organizer-document.component.css']
})

export class OrganizerDocumentComponent implements OnInit ,OnDestroy{
    @Input() tabId;
    @ViewChild(MatSelect) matSelect: MatSelect;


    language :any;
    userDetails: LoginDetails;
    userAccess: UserAccess;
    createAccess: CreateAccess;
    participateAccess: ParticipateAccess;
    authorizationAccess: AuthorizationAccess;
    displayAllDocument: boolean = false;
    displayMyDocument: boolean = true;
    displayClubDocument: boolean = false;
    displayCurrentStatus: boolean = false;
    displayArchivedDocument: boolean = false;
    setTheme: ThemeType;
    uploadDocVisibility:UploadDocVisibility;
    extensions:any;
    guestRole:string;
    myData:DocumentsType[];
    clubData:DocumentsType[];
    archivedData:DocumentsType[];
    myDocExtArr: string[] = [];
    myDocExt: string[] = [];
    myDocFileNameArr: string[] = [];
    clubDocExtArr: string[] = [];
    clubDocExt: string[] = [];
    clubDocFileNameArr: string[] = [];
    archivedDocExtArr: string[] = [];
    archivedDocExt: string[] = [];
    archivedDocFileNameArr: string[] = [];
    private activatedSub: Subscription;
    headline_word_option: number = 0
    selected_view:any = 0;
    selected_order:any = '2';
    private selectedView_subscrip:Subscription;
    private selectedorder_subscrip:Subscription;
    selected:any = '2';

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        private _router: Router,private themes: ThemeService,
        private commonFunctionService: CommonFunctionService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('selectedView') != null) {
            this.selected_view  = JSON.parse(localStorage.getItem('selectedView'));
        }
        this.selectedView_subscrip = this.commonFunctionService.docViewOption.subscribe((resp:any) => {
            this.selected_view  = resp;
        });
        if (localStorage.getItem('selectedDocOrder') != null) {
            this.selected_order  = localStorage.getItem('selectedDocOrder');
        }
        this.selectedorder_subscrip = this.commonFunctionService.docViewOrder.subscribe((resp:any) => {
            this.selected_order  = resp;
            // this.ngOnInit();
        });
        if (localStorage.getItem('club_theme') != null) {
            let theme :ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp:ThemeType) => {
            this.setTheme = resp;
        });
        this.displayDocumentByTabs(this.tabId)
        this.language = this.lang.getLanguageFile();
        this.extensions = appSetting.extensions;
        this.uploadDocVisibility = appSetting.uploadDocument;
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.headline_word_option = parseInt(localStorage.getItem('headlineOption'));
        let userRole:string = this.userDetails.roles[0];
        this.guestRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.createAccess = this.userAccess[userRole].create;
        this.participateAccess = this.userAccess[userRole].participate;
        this.authorizationAccess = this.userAccess[userRole].authorization;
        if (this.guestRole == 'guest') {
            this.displayAllDocument = false;
            this.displayMyDocument = true;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
        }
        this.authService.setLoader(false);
    }

    displayDocumentByTabs(tabId:string){
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if(this.userDetails.isAdmin || this.userDetails.isFunctionary || this.userDetails.isSecretary){
            $('.doc_upload_btn').show();
        }
        if(tabId == 'tabs-2'){
            this.displayAllDocument = false;
            this.displayMyDocument = true;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
            $('.doc_upload_btn').show();
        }else if(tabId == 'tabs-4'){
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = true;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
        }else if(tabId == 'tabs-5'){
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = false;
            this.displayCurrentStatus = true;
            this.displayArchivedDocument = false;
        }else if(tabId == 'tabs-6'){
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = true;
        }
    }

    displayDocument(type:string) {
        if (type == 'allDocument') {
            this.displayAllDocument = true;
            this.displayMyDocument = false;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
        }else if (type == 'myDocument') {
            this.displayAllDocument = false;
            this.displayMyDocument = true;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
            $('.doc_upload_btn').show();
        }else if (type == 'clubDocument') {
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = true;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = false;
            this.checkUpload(type);
        }else if (type == 'currentStatus') {
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = false;
            this.displayCurrentStatus = true;
            this.displayArchivedDocument = false;
            this.checkUpload(type);
        }else if (type == 'archivedDocument') {
            this.displayAllDocument = false;
            this.displayMyDocument = false;
            this.displayClubDocument = false;
            this.displayCurrentStatus = false;
            this.displayArchivedDocument = true;
            this.checkUpload(type);
        }
    }

    /**
     * Function to check the Accessbility
     * @param type
     */
    checkUpload(type:string) {
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        if(this.userDetails.isAdmin || this.userDetails.isFunctionary || this.userDetails.isSecretary){
            $('.doc_upload_btn').show();
        }else{
            $('.doc_upload_btn').hide();
        }
    }

    selectDocView(view_id:any){
        localStorage.setItem('selectedView', view_id);
        this.commonFunctionService.getSelectedDocView(view_id);
    }

    /**
     * Function to get the documents in the ascending & descending order
     * @author  MangoIt Solutions
     * @retuns it return the in the order wise documents
     */
        onSelectionChange(event:any){
            const selectedDocOrder = event.value;
            this.selected_order = selectedDocOrder;
            localStorage.setItem('selectedDocOrder', selectedDocOrder);
            this.commonFunctionService.getSelectedDocOrder(selectedDocOrder);
        }

        selectView(view_id:number){
            // this.selected_view = view_id;
        }

    ngOnDestroy(): void {
        this.activatedSub.unsubscribe();
        this.selectedView_subscrip.unsubscribe();
        this.selectedorder_subscrip.unsubscribe();
    }


}
