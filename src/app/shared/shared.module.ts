import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ProgressBarModule} from 'angular-progress-bar';
import {NgChartsModule} from 'ng2-charts';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {ImageCropperModule} from 'ngx-image-cropper';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToastContainerModule} from 'ngx-toastr';
import {MaterialModule} from './material.module';
import {FullCalendarModule} from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {LimitTextPipe, ShortNumberPipe} from '@shared/pipes';
import {BackButtonDirective, LazyImgDirective, TooltipDirective} from '@shared/directives';
import {DropdownComponent, GroupCardComponent, IconComponent, PageHeaderComponent} from '@shared/components';
import {RouterLinkWithHref} from '@angular/router';


FullCalendarModule.registerPlugins([
  interactionPlugin,
  dayGridPlugin,
  timeGridPlugin,
]);

// List of shared components
const components: any = [
  GroupCardComponent,
  IconComponent,
  DropdownComponent,
  PageHeaderComponent
  // ConfirmDialogComponent,
  // DenyReasonConfirmDialogComponent,
  // UpdateConfirmDialogComponent
];

// List of shared pipes
const pipes: any = [
  LimitTextPipe,
  ShortNumberPipe
];

// List of shared directives
const directives: any = [
  BackButtonDirective,
  LazyImgDirective,
  TooltipDirective
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLinkWithHref,
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
