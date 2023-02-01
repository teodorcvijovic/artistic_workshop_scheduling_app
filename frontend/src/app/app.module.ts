// import 'rxjs/add/operator/filter';
// import 'rxjs/Observable';
// import 'rxjs/Subject';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/toArray';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetLinkComponent } from './reset-link/reset-link.component';
import { RegisterComponent } from './register/register.component'
import { HeadersInterceptor } from './utils/headers.interceptor';
import { HomeComponent } from './home/home.component';
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminListUsersComponent } from './admin-list-users/admin-list-users.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminWorkshopsComponent } from './admin-workshops/admin-workshops.component';
import { AdminAddWorkshopComponent } from './admin-add-workshop/admin-add-workshop.component';
import { AdminWorkshopRequestsComponent } from './admin-workshop-requests/admin-workshop-requests.component';
import { BecomeOrganizerComponent } from './become-organizer/become-organizer.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { SafePipe } from './utils/safe.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    ResetLinkComponent,
    RegisterComponent,
    HomeComponent,
    RegistrationRequestsComponent,
    PasswordChangeComponent,
    NavbarComponent,
    AdminListUsersComponent,
    AdminAddUserComponent,
    AdminLoginComponent,
    AdminWorkshopsComponent,
    AdminAddWorkshopComponent,
    AdminWorkshopRequestsComponent,
    BecomeOrganizerComponent,
    WorkshopDetailsComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  exports: [
    SafePipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
