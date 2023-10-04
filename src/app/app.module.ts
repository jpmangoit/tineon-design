import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEl from '@angular/common/locales/en';
import myLocaleTr from '@angular/common/locales/tr';
import myLocaleRu from '@angular/common/locales/ru';
import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeSp from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { LanguageService } from './service/language.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './shared/confirm-dialog/confirm-dialog.service';
import { UpdateConfirmDialogComponent } from '../app/shared/update-confirm-dialog/update-confirm-dialog.component';
import { UpdateConfirmDialogService } from '../app/shared/update-confirm-dialog/update-confirm-dialog.service';

import { AuthServiceService } from './service/auth-service.service';
import { DenyReasonConfirmDialogService } from '../app/shared/deny-reason-confirm-dialog/deny-reason-confirm-dialog.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { CustomDateAdapter } from './service/custom.date.adapter';
import { DateAdapter } from '@angular/material/core';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LayoutModule } from '@angular/cdk/layout';
import { ProgressBarModule } from 'angular-progress-bar';
import { NgChartsModule } from 'ng2-charts';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthorizationModule } from './modules/authorization/authorization.module';

export function getCulture() {
    let language = localStorage.getItem('language');
    if (language == 'en') {
        registerLocaleData(localeEl, 'en');
        return 'en';
    } else if (language == 'ru') {
        registerLocaleData(myLocaleRu);
        return 'ru';
    } else if (language == 'tr') {
        registerLocaleData(myLocaleTr);
        return 'tr';
    } else if (language == 'it') {
        registerLocaleData(localeIt);
        return 'it';
    } else if (language == 'es') {
        registerLocaleData(localeSp);
        return 'es';
    } else if (language == 'fr') {
        registerLocaleData(localeFr);
        return 'fr';
    } else {
        registerLocaleData(localeDe);
        return 'de';
    }
}

FullCalendarModule.registerPlugins([
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
]);

@NgModule({
	declarations: [
		AppComponent,
        ConfirmDialogComponent,
        UpdateConfirmDialogComponent,
	],
	imports: [
        SharedModule,
        BrowserModule,
		AppRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 2000,
            disableTimeOut: false,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: false,
          }),
	],
	exports: [
		ConfirmDialogComponent,
        UpdateConfirmDialogComponent,
	],

    providers: [
        AuthServiceService,
        LanguageService,
        AuthGuard,
        ConfirmDialogService,
        UpdateConfirmDialogService,
        DenyReasonConfirmDialogService,
		NgxImageCompressService,
        { provide: LOCALE_ID, useValue: getCulture()},
        { provide: DateAdapter, useClass: CustomDateAdapter },
        // { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    ],

    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
