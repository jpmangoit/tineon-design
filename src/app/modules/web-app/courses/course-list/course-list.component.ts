import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../../../../service/auth-service.service';
import { LanguageService } from '../../../../service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

    eventTypeList: { name: string }[] = [];
    userData: LoginDetails;
    language: any;
    isData: boolean = true;
    displayedColumns: string[] = [
        'name',
        'description',
        'place',
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
    responseMessage: any;


    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
        private router: Router,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.getUserAllCourse("");
    }

    /**
     * Function for get All the login user Cours
     * @author  MangoIt Solutions(T)
     * @param   {}
     * @return  {all the records of Banners} array of object
     */
    getUserAllCourse(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;
        if (search && search.target.value != '') {
            endPoint = 'getOwnerCourses/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        }else{
            endPoint = 'getOwnerCourses/' + pageNo + '/' + this.pageSize;
        }
        this.authService.memberSendRequest('get', endPoint, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    var url: string[] = [];
                    this.dataSource = new MatTableDataSource(respData.courses);
                    this.dataSource.filteredData.forEach((element:any)=>{
                        if (element?.course_image[0]?.course_image){
                            element.course_image[0].course_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.course_image[0]?.course_image.substring(20)));
                        }
                    })
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

    updateCourse(id: number) {
        var redirectUrl: string = 'web/update-course/' + id;
        this.router.navigate([redirectUrl]);
    }

       /**
     * Function to delete a course
     * @author  MangoIt Solutions
     * @param   {courseId}
     * @return  Response Success or Error Message
     */
       deleteCourse(id: number) {
        let self = this;
        self.confirmDialogService.confirmThis(self.language.confirmation_message.delete_course, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'deleteCourse/' + id, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        if (respData['isError'] == false) {
                            self.responseMessage = respData['result']['message'];
                            self.notificationService.showSuccess(self.responseMessage, null);
                            self.getUserAllCourse("");
                            // setTimeout(function () {
                            //     // $('#responseMessage').delay(1000).fadeOut();
                            //     self.router.navigate(["/course"]);
                            // }, 3000);

                        } else if (respData['code'] == 400) {
                            self.responseMessage = respData['message'];
                            self.notificationService.showError(self.responseMessage, null);
                        }
                    }
                )
        }, function () { }
        )
    }

    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllCourse("");
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
