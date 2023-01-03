import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetLinkComponent } from './reset-link/reset-link.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'reset_password', component: ResetPasswordComponent},
  {path: 'reset_link', component: ResetLinkComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
