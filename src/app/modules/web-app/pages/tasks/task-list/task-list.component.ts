import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {LoginDetails} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService} from '@core/services';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmDialogService} from '@shared/components';


declare var $: any;


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

    userData: LoginDetails;
    language: any;
    isData: boolean = true;
    displayedColumns: string[] = [
        'name',
        'description',
        'picture_video',
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


  constructor(private authService: AuthServiceService, private lang: LanguageService,private commonFunctionService: CommonFunctionService,
        private notificationService: NotificationService,
        private sanitizer: DomSanitizer,
        private confirmDialogService: ConfirmDialogService,

) { }

  ngOnInit(): void {
    this.language = this.lang.getLanguageFile();
    this.userData = JSON.parse(localStorage.getItem('user-data'));
    this.getUserAllTask("");
  }

    /**
     * Function for get All the login user Task
     * @author  MangoIt Solutions(M)
     * @param   {}
     * @return  {all the records of Task} array of object
     */
    getUserAllTask(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;
        if (search && search.target.value != '') {
            endPoint = 'getOwnerTasks/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        }else{
            endPoint = 'getOwnerTasks/' + pageNo + '/' + this.pageSize;
        }
        this.authService.memberSendRequest('get', endPoint, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                respData?.tasks?.forEach(element => {
                    if (element?.['task_image'][0]?.['task_image']) {
                        element['task_image'][0]['task_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.['task_image'][0]?.['task_image'].substring(20)))as string;
                    }
                });
                this.dataSource = new MatTableDataSource(respData.tasks);
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
    * Function for delete the Task
    * @author  MangoIt Solutions
    * @param   {taskId}
    * @return  {}
    */
     deleteTask(eventId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_task, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'DeleteTask/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData.result.message, null);
                        self.getUserAllTask("");
                    }
                )
        }, function () {
            $('.dropdown-toggle').trigger('click');
        })
    }


    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllTask("");
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
