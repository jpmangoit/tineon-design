import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationRoutingModule } from './authorization-routing.module';
import { SharedModule } from 'src/app/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';


@NgModule({
    declarations: [
        LoginComponent,
        RecoverPasswordComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AuthorizationRoutingModule,
    ]
})
export class AuthorizationModule { }
