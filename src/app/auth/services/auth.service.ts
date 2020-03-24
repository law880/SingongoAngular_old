import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../models/login';
import {Observable, of} from 'rxjs';
import {Token} from '../models/token';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {baseUrl} from '../../constants';
import {LOGIN_FORM_COMPONENT} from '../../constants';

export const jwtHelperService = new JwtHelperService();

@Injectable()
export class AuthService {
  constructor(public messageService: MessageService,
              private http: HttpClient) { }

  loginUrl = baseUrl + 'authenticate';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    return !jwtHelperService.isTokenExpired(token);
  }

  login(loginInfo: Login): Observable<Token> {
    this.messageService.delete(LOGIN_FORM_COMPONENT);
    return this.http.post(this.loginUrl, loginInfo, this.httpOptions).pipe(
      catchError(this.handleError<any>('login'))
    );
  }

  public handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messageService.delete(LOGIN_FORM_COMPONENT);
      if (error.message.includes('40')) {
        this.messageService.add('Invalid username or password. Please try again.', LOGIN_FORM_COMPONENT);
      } else {
        this.messageService.add('An unexpected error occurred. Please try again later.', LOGIN_FORM_COMPONENT);
        console.error(error);
      }
      return of(result as T);
    };
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public validateAndStoreToken(token: Token): boolean {
    if (!jwtHelperService.isTokenExpired(token.token) &&
      !jwtHelperService.isTokenExpired(token.refreshToken)) {
      localStorage.setItem('token', token.token);
      localStorage.setItem('refreshToken', token.refreshToken);
      return true;
    }
    return false;
}

  public refreshToken() {
    return this.http.post<any>(baseUrl + 'refresh', {
      refreshToken: localStorage.getItem('refreshToken')
    }).pipe(tap((token: Token) => {
      localStorage.setItem('token', token.token);
      localStorage.setItem('refreshToken', token.refreshToken);
    }));
  }
}
