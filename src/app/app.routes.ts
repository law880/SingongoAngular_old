import {Routes} from '@angular/router';
import {LoginFormComponent} from './auth/components/login-form/login-form.component';
import {AuthGuardService} from './auth/services/auth-guard.service';
import {HomeComponent} from './content/home.component';
import {LogoutComponent} from './auth/components/logout/logout.component';
import {ProfileViewComponent} from './content/profile-view/profile-view.component';
import {FolderViewComponent} from './content/components/folder-view/folder-view.component';
import {FileViewComponent} from './content/components/file-view/file-view.component';
import {SearchViewComponent} from './content/components/search-view/search-view.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'folder/:id',
    component: FolderViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'folder/:folderId/file/:fileId',
    component: FileViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'search',
    component: SearchViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'profile',
    component: ProfileViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
