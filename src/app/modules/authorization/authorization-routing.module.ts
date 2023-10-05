import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { NoauthGuard } from 'src/app/guard/noauth.guard';
import { MEmailComponent } from '../mobile-app/shared/m-email/m-email.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NoauthGuard], data: { title: 'Login' } },
    { path: 'recover-password', component: RecoverPasswordComponent,canActivate:[NoauthGuard], data: { title: 'Recover Password' } },
    { path: 'email', component: MEmailComponent, data: { title: 'Email' } },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
