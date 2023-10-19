import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {LoginDetails, ParticipateAccess, ThemeType, UserAccess} from '@core/models';
import {AuthServiceService, CommonFunctionService, LanguageService, NotificationService, ThemeService} from '@core/services';
import {appSetting} from '@core/constants';


@Component({
    selector: 'app-news-list',
    templateUrl: './news-list.component.html',
    styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
    userData: LoginDetails;
    language: any;
    isData: boolean = true;
    displayedColumns: string[] = [
        'title',
        'headline',
        'imageUrls',
        'created_at',
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
    participateAccess: ParticipateAccess;
    userDetails: LoginDetails;
    userRole: string;
    userAccess: UserAccess;
    displayNews: boolean = true;
    displayEvents: boolean = false;
    displayCourses: boolean = false;
    displayRooms: boolean = false;
    displayInstructors: boolean = false;
    displaySurvey: boolean = false;
    displayTasks: boolean = false;
    displayGroup: boolean = false;
    displayFaq: boolean = false;
    setTheme: ThemeType;
    private activatedSub: Subscription;


    constructor(
        private authService: AuthServiceService,
        private lang: LanguageService,
        private themes: ThemeService,
        private sanitizer: DomSanitizer,
        private commonFunctionService: CommonFunctionService,
        private _router: Router,
        private notificationService: NotificationService,

    ) {
        if (localStorage.getItem('club_theme') != null) {
            let theme: ThemeType = JSON.parse(localStorage.getItem('club_theme'));
            this.setTheme = theme;
        }
        this.activatedSub = this.themes.club_theme.subscribe((resp: ThemeType) => {
            this.setTheme = resp;
        });
    }

    ngOnInit(): void {
        this.language = this.lang.getLanguaageFile();
        this.userData = JSON.parse(localStorage.getItem('user-data'));
        this.getUserAllNews("");
        this.userDetails = JSON.parse(localStorage.getItem('user-data'));
        this.userRole = this.userDetails.roles[0];
        this.userAccess = appSetting.role;
        this.participateAccess = this.userAccess[this.userRole].participate;
    }

    /**
* Function is used to display news tab
* @author  MangoIt Solutions
*/
    onNews() {
        // this.authService.setLoader(true);
        this.displayNews = true;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false
    }

    /**
    * Function is used to display event tab
    * @author  MangoIt Solutions
    */
    onEvents() {
        this.displayNews = false;
        this.displayEvents = true;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false
    }

    /**
    * Function is used to display dates tab
    * @author  MangoIt Solutions
    */
    onCourses() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = true;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false

    }

    onRoom() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = true;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false
    }

    onInstructor() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = true;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false
    }

    onSurvey() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = true
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = false
    }

    onTasks() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = true
        this.displayGroup = false;
        this.displayFaq = false
    }

    onGroup() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = true;
        this.displayFaq = false
    }

    onFaq() {
        this.displayNews = false;
        this.displayEvents = false;
        this.displayCourses = false;
        this.displayRooms = false;
        this.displayInstructors = false;
        this.displaySurvey = false
        this.displayTasks = false
        this.displayGroup = false;
        this.displayFaq = true
    }


    /**
  * Function for get All the login user news
  * @author  MangoIt Solutions(T)
  * @param   {}
  * @return  {all the records of news} array of object
  */
    getUserAllNews(search: any) {
        var pageNo = this.currentPage + 1
        this.authService.setLoader(true);
        var endPoint: string;

        if (search && search.target.value != '') {
            endPoint = 'getOwnerNews/' + pageNo + '/' + this.pageSize + '?search=' + search.target.value;
        } else {
            endPoint = 'getOwnerNews/' + pageNo + '/' + this.pageSize;
        }
        this.authService.memberSendRequest('get', endPoint, null)
            .subscribe(
                (respData: any) => {
                    this.authService.setLoader(false);
                    this.dataSource = new MatTableDataSource(respData.news);
                    this.dataSource?.filteredData.forEach((element: any) => {
                        if (element?.news_image[0]?.news_image) {
                            element.news_image[0].news_image = this.sanitizer.bypassSecurityTrustUrl(this.commonFunctionService.convertBase64ToBlobUrl(element?.news_image[0]?.news_image.substring(20))) as string;
                        }
                    })
                    this.totalRows = respData.pagination.rowCount;
                    this.dataSource.sort = this.matsort;
                    this.isData = true;
                }
            )
    }

    /**
    * Function for apply Filter
    * @author  MangoIt Solutions(T)
    */
    searchValue: string;
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
   * Function is used to redirect on update news page
   * @author  MangoIt Solutions
   */
    updateNews(newsId: number) {
        const url: string[] = ["/web/update-news/" + newsId];
        this._router.navigate(url);
    }

    /**
  * Function is used to delete news by news Id
  * @author  MangoIt Solutions
  * @param   {newsId}
  * @return  success/ error message
  */
    deleteNews(newsId: number) {
        let self = this;
        this.commonFunctionService.deleteNews(newsId)
            .then((resp: any) => {
                self.notificationService.showSuccess(resp, null);
                this.searchValue = '';
                this.dataSource.filter = '';
                this.getUserAllNews("");
                // const url: string[] = ["/web/all-list"];
                // self._router.navigate(url);

            })
            .catch((err: any) => {
                self.notificationService.showError(err, null);
            });
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
     * Function for pagination page changed
     * @author  MangoIt Solutions(T)
     */
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUserAllNews("");
    }

}
