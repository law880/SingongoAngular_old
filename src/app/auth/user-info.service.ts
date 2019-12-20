import { Injectable } from '@angular/core';
import {UserInformation} from './user-information';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private user: UserInformation,
              private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token')})
  };

  setCredentials(username: string, password: string) {
    this.user.setUsername(username);
    this.user.setPassword(password);
  }

  fetchInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    this.http.get('http://localhost:8080/user/' + this.user.userUsername, this.httpOptions).pipe(
      map((response: Response) => {
        response.json();
      })
    );
  }
}
