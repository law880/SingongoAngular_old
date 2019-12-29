import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LoginMessageComponent } from './auth/login-form/login-message/login-message.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { ROUTES} from './app.routes';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { AuthService } from './auth/services/auth.service';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileViewComponent } from './home/profile-view/profile-view.component';
import {UserInfoService } from './auth/services/user-info.service';
import {JwtInterceptor} from './auth/services/jwt-interceptor';
import { PasswordChangeComponent } from './home/profile-view/password-change/password-change.component';
import { FolderViewComponent } from './home/components/folder-view/folder-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    LoginMessageComponent,
    HomeComponent,
    LogoutComponent,
    NavigationComponent,
    ProfileViewComponent,
    PasswordChangeComponent,
    FolderViewComponent,
  ],
  imports: [
    RouterModule.forRoot(
      ROUTES,
      {enableTracing: true}
    ),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    UserInfoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
