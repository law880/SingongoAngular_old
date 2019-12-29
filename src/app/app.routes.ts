import {Routes} from '@angular/router';
import {LoginFormComponent} from './auth/login-form/login-form.component';
import {AuthGuardService} from './auth/services/auth-guard.service';
import {HomeComponent} from './home/home.component';
import {LogoutComponent} from './auth/components/logout/logout.component';
import {ProfileViewComponent} from './home/profile-view/profile-view.component';

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
  },
];
