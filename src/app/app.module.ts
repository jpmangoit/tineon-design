import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEl from '@angular/common/locales/en';
import myLocaleTr from '@angular/common/locales/tr';
import myLocaleRu from '@angular/common/locales/ru';
import localeIt from '@angular/common/locales/it';
import localeFr from '@angular/common/locales/fr';
import localeSp from '@angular/common/locales/es';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
    ConfirmDialogComponent,
    ConfirmDialogService,
    DenyReasonConfirmDialogComponent,
    DenyReasonConfirmDialogService,
    UpdateConfirmDialogComponent,
    UpdateConfirmDialogService
} from '@shared/components';
import { SharedModule } from '@shared/shared.module';
import { AuthService, LanguageService } from '@core/services';
import { AuthGuard } from '@core/guards';
import { CustomDateAdapter } from '@core/helpers';
import { AuthInterceptor } from '@core/interceptor/auth-interceptor';


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

@NgModule({
    declarations: [
        AppComponent,
        ConfirmDialogComponent,
        DenyReasonConfirmDialogComponent,
        UpdateConfirmDialogComponent
    ],
    imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule,
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
        DenyReasonConfirmDialogComponent
    ],

    providers: [
        AuthService,
        LanguageService,
        AuthGuard,
        ConfirmDialogService,
        UpdateConfirmDialogService,
        DenyReasonConfirmDialogService,
        NgxImageCompressService,
        { provide: LOCALE_ID, useValue: getCulture() },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],

    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
