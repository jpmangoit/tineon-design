import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {LoginDetails} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmDialogService} from '@shared/components';


@Component({
    selector: 'app-instructor-list',
    templateUrl: './instructor-list.component.html',
    styleUrls: ['./instructor-list.component.css']
})
export class InstructorListComponent implements OnInit {

    userData: LoginDetails;
    language: any;
    isData: boolean = true;
    displayedColumns: string[] = [
        'first_name',
        'last_name',
        'emaill',
        'add_img',
        'created_at',
        // 'author',
        'View',
    ];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    dataSource !: MatTableDataSource<any>;
    result: any;
    @ViewChild(MatPaginator) matpaginator!: MatPaginator;
    @ViewChild(MatSort) matsort!: MatSort;
    totalRows: number = 0;
    pageSize: number = 10;
    currentPage: any = 0;
    pageSizeOptions: number[] = [10, 25, 50];
    responseMessage:any;

    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private themes: ThemeService,
        private commonFunctionService: CommonFunctionService,
        private sanitizer: DomSanitizer,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.getUserAllInstructor("");
    }

    /**
  * Function for get All the login user instructors
  * @author  MangoIt Solutions(T)
  * @param   {}
  * @return  {all the records of instructors} array of object
  */
    getUserAllInstructor(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;
        if (search && search.target.value != '') {
            endPoint = 'getOwnerInstructors/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        }else{
            endPoint = 'getOwnerInstructors/' + pageNo + '/' + this.pageSize;
        }

        this.authService.memberSendRequest('get', endPoint, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    respData?.instructors?.forEach((element:any) =>{
                        if(element['instructor_image'][0]?.['instructor_image']){
                            element['instructor_image'][0]['instructor_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element['instructor_image'][0]?.['instructor_image'].substring(20)))as string;
                        }
                    })
                    this.dataSource = new MatTableDataSource(respData.instructors);
                    this.totalRows = respData.pagination.rowCount;
                    this.dataSource.sort = this.matsort;
                    this.isData = true;
                }
            )
    }

    /**
     * Function for sort column date
     * @author  MangoIt Solutions(T)
     */
    sortData(sort: Sort) {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            return this._compare(a[sort.active], b[sort.active], isAsc);
        });
    }


    private _compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

     /**
    * Function is used to delete Instructor by id
    * @author MangoIt Solutions
    * @param {id}
    * @returns {Object} message
    */
     deleteInstructor(instructor_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_instructor, ()=> {
            this.authService.setLoader(true);
            this.authService.memberSendRequest('delete', 'deleteInstructor/' + instructor_id, null)
                .subscribe(
                    (respData: any) => {
                        this.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            this.responseMessage = respData['result']['message'];
                            this.notificationService.showSuccess(this.responseMessage,null);
                            this.getUserAllInstructor("")
                        } else if (respData['code'] == 400) {
                            this.responseMessage = respData['message'];
                            this.notificationService.showError(this.responseMessage,null);
                        }
                    }
                )
        }, ()=> { }
        )
    }

    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllInstructor("");
    }

    /**
     * Function for apply Filter
     * @author  MangoIt Solutions(T)
     */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
