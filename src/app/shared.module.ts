import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProgressBarModule } from 'angular-progress-bar';
import { NgChartsModule } from 'ng2-charts';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastContainerModule } from 'ngx-toastr';
import { MaterialModule } from './material.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

FullCalendarModule.registerPlugins([
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
]);

@NgModule({
    declarations: [],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AngularEditorModule,
        FullCalendarModule,
        NgxPaginationModule,
        NgxDocViewerModule,
        ProgressBarModule,
        ImageCropperModule,
        ColorPickerModule,
        CarouselModule,
        ToastContainerModule,
        NgChartsModule,
        LayoutModule,
        NgxMaterialTimepickerModule,
        MaterialModule,
    ]
})
export class SharedModule { }