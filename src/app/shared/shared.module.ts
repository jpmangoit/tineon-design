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
import { ConfirmDialogComponent, DenyReasonConfirmDialogComponent, UpdateConfirmDialogComponent } from '@shared/components';
import { LimitTextPipe, ShortNumberPipe } from '@shared/pipes';
import { BackButtonDirective, LazyImgDirective, TooltipDirective } from '@shared/directives';


FullCalendarModule.registerPlugins([
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
]);

// List of shared compoenents
const components: any = [
    // ConfirmDialogComponent,
    // DenyReasonConfirmDialogComponent,
    // UpdateConfirmDialogComponent
];

// List of shared pipes
const pipes: any = [
    LimitTextPipe,
    ShortNumberPipe
];

const directives: any = [
    BackButtonDirective,
    LazyImgDirective,
    TooltipDirective
];

@NgModule({
    declarations: [
        ...components,
        ...pipes
    ],
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
        ...components,
        ...pipes
    ]
})
export class SharedModule {
}
