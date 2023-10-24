import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UpdateConfirmDialogService} from '@shared/components';
import {LanguageService} from '@core/services';

@Component({
    selector: 'app-update-confirm-dialog',
    templateUrl: 'update-confirm-dialog.component.html',
    styleUrls: ['update-confirm-dialog.component.scss']
})

export class UpdateConfirmDialogComponent implements OnInit {
    language :any;
    message: any;
    updateForm: UntypedFormGroup;

    constructor(
        private updateConfirmDialogService: UpdateConfirmDialogService,  private lang : LanguageService,  public formBuilder: UntypedFormBuilder,) { }

    ngOnInit(): any {
       /**
        *
        *   This function waits for a message from alert service, it gets
        *   triggered when we call this from any other component
        */

        this.updateForm = this.formBuilder.group({
            reason: ['', Validators.required]
        });

        this.language = this.lang.getLanguageFile();
        this.updateConfirmDialogService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
}
