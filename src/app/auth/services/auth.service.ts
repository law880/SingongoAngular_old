import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Login} from '../models/login';
import {Observable, of} from 'rxjs';
import {Token} from '../models/token';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from './message.service';

const jwtHelperService = new JwtHelperService();

@Injectable()
export class AuthService {

  constructor(public messageService: MessageService,
              private http: HttpClient) { }
  loginUrl = 'http://localhost:8080/authenticate';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    return !jwtHelperService.isTokenExpired(token);
  }

  login(loginInfo: Login): Observable<Token> {
    this.messageService.clear();
    return this.http.post(this.loginUrl, loginInfo, this.httpOptions).pipe(
      catchError(this.handleError<any>('login'))
    );
  }

  public handleError<T>(operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.message.includes('40')) {
        this.log('Invalid username or password. Please try again.');
      } else {
        this.log('An unexpected error occurred. Please try again later.');
        console.error(error);
      }
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(message);
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public refreshToken() {
    return this.http.post<any>('http://localhost:8080/refresh', {
      refreshToken: localStorage.getItem('refreshToken')
    }).pipe(tap((token: Token) => {
      localStorage.setItem('token', token.token);
      localStorage.setItem('refreshToken', token.refreshToken);
    }));
  }
}
