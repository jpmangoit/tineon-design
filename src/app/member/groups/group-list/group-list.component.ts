import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

    userData: LoginDetails;
    language: any; 
    isData: boolean = true;
    displayedColumns: string[] = [
        'name',
        'description',
        'picture_video',
        'author',
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
    private confirmDialogService: ConfirmDialogService,

    private sanitizer: DomSanitizer) { }

  ngOnInit(): void { 
    this.language = this.lang.getLanguaageFile();
    this.userData = JSON.parse(localStorage.getItem('user-data'));
    this.getUserAllGroup("");
  }

   /**
     * Function for get All the login user Task
     * @author  MangoIt Solutions(M)
     * @param   {}
     * @return  {all the records of Task} array of object
     */
   getUserAllGroup(search: any) {
    var pageNo = this.currentPage + 1
    this.authService.setLoader(true);
    var endPoint: string;
    if (search && search.target.value != '') {
        endPoint = 'getOwnerGroups/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
    }else{
        endPoint = 'getOwnerGroups/' + pageNo + '/' + this.pageSize;
    }
    this.authService.memberSendRequest('get', endPoint, null)
        .subscribe(
            (respData: any) => {
                this.authService.setLoader(false);
                respData?.groups?.forEach(element => {
                    if (element?.['group_images'][0]?.['group_image']) {
                        element['group_images'][0]['group_image'] = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.['group_images'][0]?.['group_image'].substring(20)))as string;
                    }
                });
                this.dataSource = new MatTableDataSource(respData.groups);
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
   * Function is used to delete group
   * @author  MangoIt Solutions
   * @param   {GroupId}
   * @return  {}
   */
     deleteGroup(groupId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.community_groups.delete_group_popup, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteGroup/' + groupId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData.result.message, null);
                        self.getUserAllGroup("");
                    }
                )
        }, function () {
        })
    }


    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllGroup("");
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
