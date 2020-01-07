import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Token} from '../models/token';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private refreshing = false;
  private refreshTokenSubject: BehaviorSubject<any>;

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercept');
    const token = localStorage.getItem('token');

    if (token) {
      request = this.addTokenHead(request, token);
    }

    return next
      .handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 402 || err.status === 403) {
            return this.handleAuthError(request, next);
          } else {
            return throwError(err);
          }
        }
      ));
  }

  private handleAuthError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshing) {
      this.refreshing = true;
      this.refreshTokenSubject.next(null);
      return this.auth.refreshToken().pipe(
        switchMap((token: Token) => {
          this.refreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addTokenHead(request, token.token));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenHead(request, token));
        }));
    }


  }

  private addTokenHead(request: HttpRequest<any>, token: string) {
    console.log(request.headers);
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
  }
}
