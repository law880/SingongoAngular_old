import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './content/home.component';
import { RouterModule } from '@angular/router';
import { ROUTES} from './app.routes';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { AuthService } from './auth/services/auth.service';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { NavigationComponent } from './general/components/navigation/navigation.component';
import { ProfileViewComponent } from './content/profile-view/profile-view.component';
import {UserInfoService } from './auth/services/user-info.service';
import {JwtInterceptor} from './auth/services/jwt-interceptor';
import { PasswordChangeComponent } from './content/profile-view/password-change/password-change.component';
import { FolderViewComponent } from './content/components/folder-view/folder-view.component';
import { MessageComponent } from './general/components/message/message.component';
import {ContentService} from './content/services/content.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FolderCreateComponent } from './content/components/folder-view/folder-create/folder-create.component';
import {FileSelectDirective} from "ng2-file-upload";
import { FileUploadComponent } from './content/components/folder-view/file-upload/file-upload.component';
import { FileViewComponent } from './content/components/file-view/file-view.component';
import {DatePipe} from "@angular/common";
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import { FileSizePipe } from './general/pipes/file-size.pipe';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import { LoadDisplayComponent } from './general/components/load-display/load-display.component';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import {VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { SearchViewComponent } from './content/components/search-view/search-view.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import { DeleteViewComponent } from './content/components/delete-view/delete-view.component';
import { RenameViewComponent } from './content/components/rename-view/rename-view.component';

// noinspection AngularInvalidImportedOrDeclaredSymbol
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    LogoutComponent,
    NavigationComponent,
    ProfileViewComponent,
    PasswordChangeComponent,
    FolderViewComponent,
    MessageComponent,
    FolderCreateComponent,
    FileSelectDirective,
    FileUploadComponent,
    FileViewComponent,
    FileSizePipe,
    LoadDisplayComponent,
    SearchViewComponent,
    DeleteViewComponent,
    RenameViewComponent
  ],
  imports: [
    NgbModule,
    RouterModule.forRoot(
      ROUTES,
      {enableTracing: true}
    ),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    NgxAudioPlayerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    MatProgressSpinnerModule,
    AngularFileUploaderModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    UserInfoService,
    ContentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    DatePipe,
  FileSizePipe],
  bootstrap: [AppComponent],
  entryComponents: [FolderCreateComponent, FileUploadComponent, DeleteViewComponent, RenameViewComponent]
})
export class AppModule { }
