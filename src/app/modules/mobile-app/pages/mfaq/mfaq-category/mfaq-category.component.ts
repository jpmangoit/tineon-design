import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {FAQCategory, LoginDetails, ThemeType} from '@core/models';
import {IDropdownSettings} from 'ng-multiselect-dropdown/multiselect.model';
import {Subscription} from 'rxjs';
import {AuthServiceService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';

declare var $: any;

@Component({
  selector: 'app-mfaq-category',
  templateUrl: './mfaq-category.component.html',
  styleUrls: ['./mfaq-category.component.css']
})
export class MfaqCategoryComponent implements OnInit {

    language: any;
    userRole: string;
    userDetails: LoginDetails;
    submitted: boolean = false;
    editFormSubmit: boolean = false;
    editFaqForm: UntypedFormGroup;
    responseMessage: string = null;
    responseMessage1: string = null;
    visiblityDropdownSettings: IDropdownSettings;
    groupDropdownSettings: IDropdownSettings;
    positionDropdownSettings: IDropdownSettings;
    dropdownSettings: IDropdownSettings;
    positionSelectedItem: number;
    PositionItemDeSelect: number;
    positionList: { id: number; name: number }[] = [];
    editId: number;
    getParamFromUrl: string;
    teamId: number;
    FaqCategory: FAQCategory[];
    setTheme: ThemeType;
    displayFaq: boolean;
    displayFaqCategory: boolean = true;
    private activatedSub: Subscription;
    FaqCat:FAQCategory;
    pos:number;
    position:{ id: number; name: number }[] = [];

    editorConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      minHeight: '5rem',
      maxHeight: '15rem',
      translate: 'no',
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
    ],
      sanitize: true,
      toolbarPosition: 'top',
      defaultFontName: 'Arial',
      defaultFontSize: '2',
      defaultParagraphSeparator: 'p',
    };


    constructor(
      private authService: AuthServiceService,
      private router: Router,
      public formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute,
      private lang: LanguageService,
      private themes: ThemeService,private notificationService: NotificationService,
      private confirmDialogService: ConfirmDialogService
    ) {
      this.getParamFromUrl = this.router.url;
    }

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
      this.teamId = this.userDetails.team_id;
      this.userRole = this.userDetails.roles[0];
      this.getAllFAQCategory();
      this.positionList = [
        { id: 1, name: 1 },
        { id: 2, name: 2 },
        { id: 3, name: 3 },
        { id: 4, name: 4 },
        { id: 5, name: 5 },
        { id: 6, name: 6 },
        { id: 7, name: 7 },
        { id: 8, name: 8 },
        { id: 9, name: 9 },
        { id: 10, name: 10 },
      ];

      this.editFaqForm = this.formBuilder.group({
        category_title: ['', [Validators.required]],
        category_position: [''],
      });

      this.positionDropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'name',
        allowSearchFilter: false,
        enableCheckAll: false,
        closeDropDownOnSelection: true,
      };
    }

    onFaq() {
      this.displayFaq = true;
      this.displayFaqCategory = false;
    }

    onFaqCategory() {
      this.displayFaqCategory = true;
      this.displayFaq = false;
    }

    onPositionItemSelect(item: { id: number; name: number }) {
      this.positionSelectedItem = item.id;
    }

    onPositionItemDeSelect(item: { id: number; name: number }) {
      this.PositionItemDeSelect = item.id;
      this.editFaqForm.controls['category_position'].setValue('');
    }

    getAllFAQCategory() {
      this.authService.setLoader(true);
      this.authService.memberSendRequest('get', 'category', null).subscribe(
        (respData: any) => {
          this.authService.setLoader(false);
          this.FaqCategory = respData;
        },
        (error) => {
          this.authService.setLoader(false);
        }
      );
    }

    editFAQcategoryById(id:number) {
      this.authService.setLoader(true);
      this.authService .memberSendRequest('get', 'categoriesById/' + id, null)
        .subscribe(
          (respData: any) => {
            this.authService.setLoader(false);
            this.editId = respData[0].id;
            if(respData && respData.length > 0){
                respData.forEach((val:FAQCategory, key:number) => {
                  this.FaqCat = val;
                  this.position = [];
                  this.setEditFAQCategory();
                });
            }
          },
          (error) => {
            this.authService.setLoader(false);
          }
        );
    }

    setEditFAQCategory() {
        if (this.FaqCat.category_position) {
            if(this.positionList && this.positionList.length > 0){
                this.positionList.forEach((val, key) => {
                    if (val.id == this.FaqCat.category_position) {
                        this.position.push({ id: val.id, name: val.name });
                        this.editFaqForm.controls['category_position'].setValue(this.position);
                    }
                });
            }

            this.editFaqForm.controls['category_title'].setValue(
                this.FaqCat.category_title
            );
        } else if (this.FaqCat.category_position == null) {
            this.editFaqForm.controls['category_position'].setValue('');
            this.editFaqForm.controls['category_title'].setValue(
                this.FaqCat.category_title
            );
        }
        $('#exModal').modal('show');
        $('#editCat').click();
    }

    editFAQCategory() {
      this.editFormSubmit = true;
      if (this.positionSelectedItem) {
        this.editFaqForm.controls['category_position'].setValue(  this.positionSelectedItem );
      } else if (this.PositionItemDeSelect) {
        this.editFaqForm.controls['category_position'].setValue('');
      } else if (this.FaqCat.category_position) {
        if(this.position && this.position.length > 0){
            this.position.forEach((val, key) => {
              this.pos = val.name;
            });
        }

        this.editFaqForm.controls['category_position'].setValue(this.pos);
      } else if (this.FaqCat.category_position == null) {
        this.editFaqForm.controls['category_position'].setValue('');
      }
      this.editFaqForm.value['team_id'] = this.teamId;
      this.authService.setLoader(true);
      this.authService.memberSendRequest('put','category/' + this.editId,this.editFaqForm.value)
        .subscribe(
          (respData:any) => {
            this.authService.setLoader(false);
            // this.FaqCat = respData;
            if (respData['isError'] == false) {
              this.notificationService.showSuccess(respData['result']['message'],null);
              this.getAllFAQCategory();
              setTimeout(function () {
                $('#exModal').modal('hide');
              }, 2000);
            } else if (respData['code'] == 400) {
              this.notificationService.showError(respData['message'], null);
              if(this.positionList?.length > 0){
                this.positionList.forEach((val, key) => {
                    if (val.id == this.FaqCat.category_position) {
                        this.positionSelectedItem = val.id;
                        this.position.push({ id: val.id, name: val.name });
                        this.editFaqForm.controls['category_position'].setValue(this.position);
                    }
                });
            }
            this.editFaqForm.value['approved_status'] = this.FaqCat.approved_status;
            this.editFaqForm.value['author'] = this.FaqCat.author;
            }
          },
          (error) => {
            this.authService.setLoader(false);
          }
        );
    }

    deleteCategory(id:number) {
      this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_category,() => {
          this.authService.setLoader(true);
          this.authService.memberSendRequest('delete', 'category/' + id, null)
            .subscribe((respData:any) => {
              this.authService.setLoader(false);
              if (respData['isError'] == false) {
                // $('#responseMessage').show();
                this.responseMessage = respData['result']['message'];
                this.notificationService.showSuccess(this.responseMessage,null);
                this.getAllFAQCategory();
                // setTimeout(function () {
                //   $('#responseMessage').delay(1000).fadeOut();
                // }, 4000);

              } else if (respData['code'] == 400) {
                this.responseMessage = respData['message'];
                this.notificationService.showError(this.responseMessage,null);
              }
            });
        },() => {}
      );
    }

    ngOnDestroy(): void {
      this.activatedSub.unsubscribe();
    }
}
