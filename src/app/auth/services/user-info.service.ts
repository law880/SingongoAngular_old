import { Injectable } from '@angular/core';
import {UserInformation} from '../models/user-information';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
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
  public user: UserInformation = new UserInformation();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private messageService: MessageService
  ) { }

  setCredentials(username: string, password: string) {
    console.log('in setting ');
    this.user.setUsername(username);
    this.user.setPassword(password);
  }

  fetchInfo(): Observable<any> {
    console.log('fetching user');
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return this.http.get<any>(baseUrl + 'current');
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
    if (this.user.userUsername !== updatedUser.userUsername) {
      body = {
        ...body,
        username: updatedUser.userUsername
      };
      updated = true;
    }
    if (this.user.userName !== updatedUser.userName) {
      body = {
        ...body,
        name: updatedUser.userName
      };
      updated = true;
    }
    if (this.user.userPassword !== updatedUser.userPassword) {
      body = {
        ...body,
        password: updatedUser.userPassword
      };
      updated = true;
    }
    if (this.user.userAuthLevel !== updatedUser.userAuthLevel) {
      body = {
        ...body,
        authLevel: updatedUser.userAuthLevel === true ? UserInformation.ADMIN_ROLE : UserInformation.USER_ROLE
      };
      updated = true;
    }
    if (updated === true) {
      return this.http.patch('http://localhost:8080/user/' + this.user.userUsername, body);
    } else {
      return of(null);
    }
  }

  changePassword(currPassword: string, newPassword: string, newPassConfirm: string) {
    this.messageService.delete(PASSWORD_CHANGE_COMPONENT);
    if (currPassword !== this.user.userPassword) {
      return of(null);
    }
    this.user.setPassword(newPassword);
    return this.http.patch(baseUrl + 'user/' + this.user.userUsername, {
      password: newPassword,
      passwordConfirm: newPassConfirm
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        this.messageService.add('An error occurred. Please try again later.', PASSWORD_CHANGE_COMPONENT);
        return throwError(err);
      })
    );
  }

  get correctPassword() { return this.user.userPassword; }
}
