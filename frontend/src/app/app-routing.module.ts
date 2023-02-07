import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminAddWorkshopComponent } from './admin-add-workshop/admin-add-workshop.component';
import { AdminListUsersComponent } from './admin-list-users/admin-list-users.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminWorkshopRequestsComponent } from './admin-workshop-requests/admin-workshop-requests.component';
import { AdminWorkshopsComponent } from './admin-workshops/admin-workshops.component';
import { BecomeOrganizerComponent } from './become-organizer/become-organizer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrganizerAddWorkshopComponent } from './organizer-add-workshop/organizer-add-workshop.component';
import { OrganizerChatComponent } from './organizer-chat/organizer-chat.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ProfileOrganizerComponent } from './profile-organizer/profile-organizer.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import { ResetLinkComponent } from './reset-link/reset-link.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';

const routes: Routes = [
  // user
  {path: 'login', component: LoginComponent},
  {path: 'password_change', component: PasswordChangeComponent},
  {path: 'reset_password', component: ResetPasswordComponent},
  {path: 'reset_link', component: ResetLinkComponent},
  {path: 'register', component: RegisterComponent},

  // admin routes
  {path: 'requests', component: RegistrationRequestsComponent},
  {path: 'users', component: AdminListUsersComponent},
  {path: 'add_user', component: AdminAddUserComponent},
  {path: 'admin_login', component: AdminLoginComponent},
  {path: 'workshops', component: AdminWorkshopsComponent},
  {path: 'add_workshop', component: AdminAddWorkshopComponent},
  {path: 'workshop_requests', component: AdminWorkshopRequestsComponent},
  
  // home
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  
  // participant routes
  {path: 'become_organizer', component: BecomeOrganizerComponent},
  {path: 'workshop_details', component: WorkshopDetailsComponent},
  {path: 'profile', component: ProfileComponent},

  // organizer
  {path: 'organizer', component: ProfileOrganizerComponent},
  {path: 'organize_workshop', component: OrganizerAddWorkshopComponent},
  {path: 'workshop_chat', component: OrganizerChatComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
