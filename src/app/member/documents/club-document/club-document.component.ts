import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../service/language.service';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { AuthServiceService } from '../../../service/auth-service.service';
import { appSetting } from '../../../app-settings';
import { DocumentsType, UploadDocVisibility } from 'src/app/models/documents-type.model';
import { Extentions } from 'src/app/models/extentions.model';
import { LoginDetails } from 'src/app/models/login-details.model';
import { NotificationService } from 'src/app/service/notification.service';
import { saveAs } from 'file-saver';

declare var $: any;
declare var require: any
const FileSaver = require('file-saver');

@Component({
    selector: 'app-club-document',
    templateUrl: './club-document.component.html',
    styleUrls: ['./club-document.component.css']
})

export class ClubDocumentComponent implements OnInit {
    language :any;
    clubData:DocumentsType[];
    extensions:any;
    userData:LoginDetails;
    optionVisibility:boolean;
    eventForm: UntypedFormGroup;
    responseMessage:string;
    uploadDocVisibility:UploadDocVisibility;
    preImage:string;
    viewImage:boolean[] = [];
    docExt: string[] = [];
    extArr: string[] = [];
    fileNameArr: string[] = [];
    result: any;
    documentData: any;
    dowloading: boolean = false;
    selected_view:number = 0;
    final_clubData: DocumentsType[];
    active_class: any = '';

    zipExtanis = ["zip"];
    docExtanis = ["ppt","pptx","pdf","docx","docs","txt","xls","xlsx"];
    imgExtanis = ["jpg","png","jpeg","gif", "webp"];
    zipData = [];
    docData = [];
    imageData = [];
    otherData = [];

    constructor(
        private lang: LanguageService,
        private authService: AuthServiceService,
        private notificationService: NotificationService

    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.extensions = appSetting.extensions;
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.uploadDocVisibility = appSetting.uploadDocument;
        let category_text:string  = '';

        for (let index:number = 0; index < $('.nav-tabs').children().length; index++) {
            const element:any = $('.nav-tabs').children().children();
            if (element[index] && element[index].classList.length >= 2) {
                category_text = element[index].text;
            }
        }
        if (category_text != '') {
            let category:string;
            if (category_text == this.language.club_document.current_status) {
                category = 'currentStatus';
                this.checkUpload(category);
            }else  if (category_text == this.language.club_document.club_documents) {
                category = 'clubDocument';
                this.checkUpload(category);
            }else  if (category_text == this.language.club_document.archived_documents) {
                category = 'archivedDocument';
                this.checkUpload(category);
            }else  if (category_text == this.language.club_document.my_documents) {
                category = 'myDocument';
                this.checkUpload(category);
            }
        }

        if (sessionStorage.getItem('token')) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('get', 'documents/fetch/club', null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    // let cData:DocumentsType[] = respData;
                    // this.clubData = cData.sort((a,b) => b.id - a.id);
                    this.clubData = respData;
                    this.clubData.forEach(item => {
                        const fileName = item.doc_name;
                        const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
                        if(this.imgExtanis.includes(extension) ){
                            this.imageData.push(item);
                        }else if(this.docExtanis.includes(extension) ){
                            this.docData.push(item);
                        }else if(this.zipExtanis.includes(extension) ){
                            this.zipData.push(item);
                        }else{
                            this.otherData.push(item);
                        }
                    });

                    if (this.clubData.length) {
                        this.fileFilter('all');
                    }
                }
            );
        }
    }

    fileFilter(fileType:any){
        this.final_clubData = [];
        this.active_class = '';
        if(fileType == 'doc'){
            this.active_class = 'doc';
            let club_doc = this.clubData
                this.final_clubData = club_doc.filter(file => {
                const extension = file.doc_name.substring(file.doc_name.lastIndexOf('.') + 1);
                return ( extension === 'ppt' || extension === 'pptx' || extension === 'pdf' || extension === 'docx'
                        || extension === 'docs' || extension === 'txt' ||  extension === 'zip'
                 );
              });
        }else if(fileType == 'tab'){
            this.active_class = 'tab';
            let club_tab = this.clubData
                this.final_clubData = club_tab.filter(file => {
                const extension = file.doc_name.substring(file.doc_name.lastIndexOf('.') + 1);
                return ( extension === 'xls' ||  extension === 'xlsx');
              });
        }else if(fileType == 'pic'){
            this.active_class = 'pic';
            let club_pic = this.clubData;
                this.final_clubData = club_pic.filter(file => {
                const extension = file.doc_name.substring(file.doc_name.lastIndexOf('.') + 1);
                return ( extension === 'png' ||  extension === 'jpg' || extension === 'jpeg' || extension === 'svg');
              });
        }else{
            this.active_class = 'all';
            this.final_clubData = this.clubData
        }
        if (this.final_clubData.length > 0) {
            this.order_view();
        }
    }

    /**
     * Function to get the documents in the ascending & descending order
     * @author  MangoIt Solutions
     * @retuns it return the in the order wise documents
     */
        order_view(){
            if($('#filter_events').val() == 1){
                this.final_clubData.sort((a, b) => a.created_at.localeCompare(b.created_at));
            }else if($('#filter_events').val() == 2){
                this.final_clubData.sort((a, b) => b.created_at.localeCompare(a.created_at));
            }
            this.getType();
        }

    /**
     * Function to check the type of the document
     * @author  MangoIt Solutions
     * @retuns it return the extention of the documents
     */
    getType() {
        for (const key in this.final_clubData) {
            if (Object.prototype.hasOwnProperty.call(this.final_clubData, key)) {
                const element:DocumentsType = this.final_clubData[key];
                if (element.doc_name) {
                    var ext:string[] = element.doc_name.split(".");
                    this.extArr[key] = ext[(ext.length) - 1];
                    var fileName:string[] = element.doc_name.split("/");
                    this.fileNameArr[key] = decodeURIComponent(fileName[(fileName.length) - 1]);
                    var docExtt:string = this.extArr[key];
                    var count:string = key;
                    for (const key in this.extensions) {
                        if (Object.prototype.hasOwnProperty.call(this.extensions, key)) {
                            const element:string = this.extensions[key];
                            if (key == 'png' || key == 'jpg' || key == 'jpeg'|| key == 'svg') {
                                this.docExt[count] = '../../../../assets/img/doc-icons/image_icon.png';
                            }else {
                                if(docExtt == 'pptx'){
                                        this.docExt[count] = 'assets/img/doc-icons/p.svg';
                                }
                                if(docExtt == 'ppt'){
                                    this.docExt[count] = '../../../../assets/img/doc-icons/p.svg';
                                }
                                if(docExtt == 'zip'){
                                        this.docExt[count] = 'assets/img/doc-icons/folder.svg';
                                }
                                if (key == docExtt){
                                    this.docExt[count] = element;   //.svg images
                                }
                            }
                        }
                    }
                }
            }
        }
    }

     /**
     * Function to check the Accessbility who can upload or move the documents
     * @author  MangoIt Solutions
     * @param {Document Type(Current,club,archived,mydocument)}
     */
    checkUpload(type:string) {
        let userRole :string[]= this.userData.roles;
        let roles:string[] = [];
        for (const key in this.uploadDocVisibility) {
            if (Object.prototype.hasOwnProperty.call(this.uploadDocVisibility, key)) {
                if (key == type) {
                    roles = this.uploadDocVisibility[key];
                }
            }
        }
        if (roles.length) {
            for (let j:number = 0; j < userRole.length; j++) {
                const element:string = userRole[j];
                if (roles.includes(element)) {
                    this.optionVisibility = true;
                }else {
                    this.optionVisibility = false;
                }
            }
        }
    }


     /**
    * Function is used to move document
    * @author  MangoIt Solutions
    * @param   {id, category}
    * @return  {string} success message
    */
    moveDoc(id: number, category: string) {
        if (sessionStorage.getItem('token')) {
            this.eventForm = new UntypedFormGroup({
                'category': new UntypedFormControl(category),
                'id': new UntypedFormControl(id)
            });
            this.authService.setLoader(true);
            this.authService.memberSendRequest('post', 'documents/move', this.eventForm.value)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['category'] == category) {
                        this.notificationService.showSuccess(this.language.move_document.move_doc_success,null);
                        const self = this;
                        setTimeout(function () {
                            self.ngOnInit();
                        }, 2000);
                    }
                    else {
                        this.notificationService.showError(this.language.move_document.move_doc_error,null);
                    }
                }
            );
        }
    }

    /**
    * Function is used to delete document
    * @author  MangoIt Solutions
    * @param   {id, index}
    * @return  {string} success message
    */
    deleteDoc(id: number, index: number) {
        let userData:LoginDetails = JSON.parse(localStorage.getItem('user-data'));
        if (sessionStorage.getItem('token') && (this.clubData[index].created_by == userData['id'] || userData.isAdmin)) {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('delete', 'documents/delete/' + id, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    if (respData['isError'] == false) {
                        this.notificationService.showSuccess(this.language.move_document.delete_doc_success,null);
                            setTimeout(() => {
                                this.ngOnInit();
                            }, 2000);
                    }else if (respData['code'] == 400) {
                        this.notificationService.showError(respData['message'], null);
                    }
                }
            );
        }
    }

    /**
    * Function is used to download document
    * @author  MangoIt Solutions
    * @param   {path}
    */
    download(path: any) {
        let data = {
            name: path
        }
        this.dowloading = true;
        var endPoint = 'get-documentbyname';
        if (data && data.name) {
            let filename = data.name.split('/')[2]
            this.authService.downloadDocument('post', endPoint, data).toPromise()
                .then((blob: any) => {
                    saveAs(blob, filename);
                    this.authService.setLoader(false);
                    this.dowloading = false;
                    setTimeout(() => {
                        this.authService.sendRequest('post', 'document-delete/uploads', data).subscribe((result: any) => {
                            this.result = result;
                            this.authService.setLoader(false);
                            if (this.result.success == false) {
                                this.notificationService.showError(this.result['result']['message'], null);

                            } else if (this.result.success == true) {
                                this.documentData = this.result['result']['message'];
                            }
                        })
                    }, 7000);
                })
                .catch(err => {
                    this.responseMessage = err;
                })
        }
    }

    selectView(view_id:number){
        this.selected_view = view_id;
    }

}
