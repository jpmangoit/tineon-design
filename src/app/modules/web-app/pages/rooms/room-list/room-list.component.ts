import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {LoginDetails} from '@core/models';
import {AuthService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {ConfirmDialogService} from '@shared/components';


@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

    userData: LoginDetails;
    language: any;
    isData: boolean = true;
    displayedColumns: string[] = [
        'title',
        'description',
        'image',
        'no_of_persons',
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
        private authService: AuthService,
        private lang: LanguageService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
        private router: Router,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.getUserAllRooms("");
    }

    /**
  * Function for get All the login user news
  * @author  MangoIt Solutions(T)
  * @param   {}
  * @return  {all the records of news} array of object
  */
    getUserAllRooms(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;
        if (search && search.target.value != '') {
            endPoint = 'getOwnerRooms/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        }else{
            endPoint = 'getOwnerRooms/' + pageNo + '/' + this.pageSize;
        }

        this.authService.memberSendRequest('get', endPoint, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.dataSource = new MatTableDataSource(respData.rooms);
                    this.totalRows = respData.pagination.rowCount;
                    this.dataSource.sort = this.matsort;
                    this.isData = true;
                    this.dataSource.filteredData.forEach((element:any) =>{
                        if(element?.room_image[0]?.room_image){
                            element.room_image[0].room_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.room_image?.[0].room_image.substring(20))) as string;
                        }
                    })
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

    updateRoom(room_id: number) {
        this.router.navigate(['/web/update-room/' + room_id])
    }

    deleteRoom(room_id: number) {
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_Room, () =>{
            this.authService.memberSendRequest('delete', 'deleteRooms/' + room_id, null)
                .subscribe(
                    (respData: any) => {
                        this.responseMessage = respData.result.message;
                        this.notificationService.showSuccess(this.responseMessage, null);
                        this.getUserAllRooms("");
                        // this.router.navigate(['/web/room'])
                    }
                )
        }, () =>{
        })
    }

    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllRooms("");
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
