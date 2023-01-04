import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListUsersComponent } from './admin-list-users/admin-list-users.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RegisterComponent } from './register/register.component';
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import { ResetLinkComponent } from './reset-link/reset-link.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'password_change', component: PasswordChangeComponent},
  {path: 'reset_password', component: ResetPasswordComponent},
  {path: 'reset_link', component: ResetLinkComponent},
  {path: 'register', component: RegisterComponent},

  // admin routes
  {path: 'requests', component: RegistrationRequestsComponent},
  {path: 'users', component: AdminListUsersComponent},

  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
