import { Injectable } from '@angular/core';
import {UserInformation} from './user-information';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public user: UserInformation = new UserInformation();

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token')})
  };

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
    return this.http.get<any>('http://localhost:8080/current', this.httpOptions);
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

  get correctPassword() { return this.user.userPassword; }
}
