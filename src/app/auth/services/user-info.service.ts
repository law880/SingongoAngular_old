import { Injectable } from '@angular/core';
import {UserInformation} from '../models/user-information';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Observable, of, throwError} from 'rxjs';
import {baseUrl} from '../../constants';
import {Router} from '@angular/router';
import {MessageService} from './message.service';
import {PASSWORD_CHANGE_COMPONENT} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public currentUser: UserInformation = new UserInformation();

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient,
              private authService: AuthService,
              private messageService: MessageService
  ) { }

  setCredentials(username: string, password: string) {
    console.log('in setting ');
    this.currentUser.setUsername(username);
    this.currentUser.setPassword(password);
  }

  fetchInfo(): Observable<any> {
    console.log('fetching user');
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return this.http.get<UserInformation>(baseUrl + 'user', this.httpOptions)
      .pipe(map(data => {
        data.setPassword(this.currentUser.userPassword);
        return data;
      }),
        tap(user => {
          this.currentUser = user;
        }));
  }

  update(updatedUser: UserInformation) {
    console.log('updating user');
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    // check what's changed
    let body = {};
    let updated = false;
    if (this.currentUser.userUsername !== updatedUser.userUsername) {
      body = {
        ...body,
        username: updatedUser.userUsername
      };
      updated = true;
    }
    if (this.currentUser.userName !== updatedUser.userName) {
      body = {
        ...body,
        name: updatedUser.userName
      };
      updated = true;
    }
    if (this.currentUser.userPassword !== updatedUser.userPassword) {
      body = {
        ...body,
        password: updatedUser.userPassword
      };
      updated = true;
    }
    if (this.currentUser.userAuthLevel !== updatedUser.userAuthLevel) {
      body = {
        ...body,
        authLevel: updatedUser.userAuthLevel === true ? UserInformation.ADMIN_ROLE : UserInformation.USER_ROLE
      };
      updated = true;
    }
    if (updated === true) {
      return this.http.patch(baseUrl + 'user/' + this.currentUser.userUsername, body, this.httpOptions);
    } else {
      return of(null);
    }
  }

  changePassword(currPassword: string, newPassword: string, newPassConfirm: string) {
    this.messageService.delete(PASSWORD_CHANGE_COMPONENT);
    if (currPassword !== this.currentUser.userPassword) {
      return of(null);
    }
    this.currentUser.setPassword(newPassword);
    return this.http.patch(baseUrl + 'user/' + this.currentUser.userUsername, {
      password: newPassword,
      passwordConfirm: newPassConfirm
    }, this.httpOptions).pipe(
      catchError((err: HttpErrorResponse) => {
        this.messageService.add('An error occurred. Please try again later.', PASSWORD_CHANGE_COMPONENT);
        return throwError(err);
      })
    );
  }

  fetchAllUsers(): Observable<Array<UserInformation>> {
    if (this.currentUser && this.currentUser.userAuthLevel === UserInformation.ADMIN_ROLE) {
      return this.http.get<Array<UserInformation>>(baseUrl + 'users');
    } else {
      return throwError(new HttpErrorResponse( {
        error: {
          message: 'User is not authorized to get a list of all users',
          fix: 'Sign in to an ADMINISTRATOR account to perform this request'
        },
        status: 401,
        statusText: 'Unauthorized'}));
    }
  }

  getSpecificUser(username: string): Observable<UserInformation> {
  if (this.currentUser && this.currentUser.userAuthLevel === UserInformation.ADMIN_ROLE) {
  return this.http.get<UserInformation>(baseUrl + 'user/' + username);
} else {
  return throwError(new HttpErrorResponse( {
    error: {
      message: 'User is not authorized to get a list of all users',
      fix: 'Sign in to an ADMINISTRATOR account to perform this request'
    },
    status: 401,
    statusText: 'Unauthorized'}));
}
}

  get correctPassword() { return this.currentUser.userPassword; }

  get authLevel() { return this.currentUser.userAuthLevel; }

  deleteUser(user: UserInformation) {
    return this.http.delete(baseUrl + 'user/' + user.userUsername);
  }

  resetUserPassword(user: UserInformation) {

  }

  forgotPassword(email: string) {
    return this.http.post(baseUrl, {
      emailIn: email
    });
  }
}
