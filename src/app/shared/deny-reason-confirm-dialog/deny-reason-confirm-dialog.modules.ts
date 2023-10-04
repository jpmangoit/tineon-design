import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DenyReasonConfirmDialogService } from './deny-reason-confirm-dialog.service';

@NgModule({
    declarations: [
        // DenyReasonConfirmDialogComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule
    ],
    exports: [
        // DenyReasonConfirmDialogComponent
    ],
    providers: [
        DenyReasonConfirmDialogService
    ]
})
export class DenyReasonConfirmDialogModule
{
}
