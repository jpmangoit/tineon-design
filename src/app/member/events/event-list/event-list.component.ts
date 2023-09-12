import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../../../service/auth-service.service';
import { LanguageService } from '../../../service/language.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginDetails } from 'src/app/models/login-details.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonFunctionService } from 'src/app/service/common-function.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
declare var $: any;


@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
    eventTypeList: { name: string }[] = [];
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
    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private router: Router,

    ) { }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.eventTypeList[1] = { name: this.language.create_event.club_event };
        this.eventTypeList[2] = { name: this.language.create_event.group_event };
        this.eventTypeList[3] = { name: this.language.create_event.functionaries_event };
        this.eventTypeList[4] = { name: this.language.create_event.course_event };
        this.eventTypeList[5] = { name: this.language.create_event.seminar };
        this.getUserAllEvents("");
    }

    /**
     * Function for get All the login user events
     * @author  MangoIt Solutions(T)
     * @param   {}
     * @return  {all the records of Banners} array of object
     */
    getUserAllEvents(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;
        if (search && search.target.value != '') {
            endPoint = 'getOwnerEvents/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        } else {
            endPoint = 'getOwnerEvents/' + pageNo + '/' + this.pageSize;
        }
        this.authService.memberSendRequest('get', endPoint, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    var url: string[] = [];
                    respData.events && respData.events.forEach(element => {
                        if (element && element.picture_video && element.picture_video != null && element.picture_video != '') {
                            if (element.picture_video) {
                                url = element.picture_video.split('"');
                                if (url && url.length > 0) {
                                    url.forEach((el) => {
                                        if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.apng', '.jfif', '.pjpeg', '.pjp'].some(char => el.endsWith(char))) {
                                            element.picture_video = el;
                                        }
                                    });
                                } else {
                                    element['picture_video'] = '';
                                }
                            }
                        }
                    });

                    respData.events.forEach((element: any) => {
                        if (element?.event_images[0]?.event_image) {
                            element.event_images[0].event_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element.event_images[0]?.event_image.substring(20)));
                        }
                    });

                    this.dataSource = new MatTableDataSource(respData.events);
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


    deleteEvents(eventId: number) {
        let self = this;
        this.confirmDialogService.confirmThis(this.language.confirmation_message.delete_event, function () {
            self.authService.setLoader(true);
            self.authService.memberSendRequest('delete', 'event/' + eventId, null)
                .subscribe(
                    (respData: any) => {
                        self.authService.setLoader(false);
                        self.notificationService.showSuccess(respData['result']['message'], null);
                        self.getUserAllEvents("");
                        // const url: string[] = ["/all-list"];
                        // self.router.navigate(url);
                    }
                )
        }, function () {
            $('.dropdown-toggle').trigger('click');
        })
    }

    // deleteNews(newsId: number) {
    //     // console.log(this.searchValue);

    //     let self = this;
    //     this.commonFunctionService.deleteNews(newsId)
    //         .then((resp: any) => {
    //             self.notificationService.showSuccess(resp, null);
    //             this.searchValue = '';
    //             this.dataSource.filter = '';
    //             this.getUserAllNews("");
    //             // const url: string[] = ["/all-list"];
    //             // self._router.navigate(url);

    //         })
    //         .catch((err: any) => {
    //             self.notificationService.showError(err, null);
    //         });
    // }

    /**
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllEvents("");
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
