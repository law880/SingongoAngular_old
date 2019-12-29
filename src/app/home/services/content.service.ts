import { Injectable } from '@angular/core';
import {Folder} from '../models/folder';
import {File} from '../models/file';
import {AuthService} from '../../auth/services/auth.service';
import {UserInfoService} from '../../auth/services/user-info.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../../auth/services/message.service';
import {Observable, of, throwError} from 'rxjs';
import {baseUrl} from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public baseId: string;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  initializeContent() {
    if (!this.baseId) {
      return this.http.get(baseUrl + 'api/root').pipe(
        map(data => JSON.parse(JSON.stringify(data))),
        tap(data => {
          this.baseId = data.id;
        }),
        catchError(this.handleError)
      );
    } else {
      return of(null);
    }
  }

  fetchFolder(folderId: string = this.baseId): Observable<Folder> { // either root or desired folder
    return this.http.get<Folder>(baseUrl + 'api/' + folderId);
  }

  fetchFile(folderId: string, fileId: string): Observable<File> {
    return this.http.get<File>(baseUrl + 'api/' + folderId + '/' + fileId);
  }

  fetchFolderContents(folder: Folder) {
    return this.http.get(baseUrl + 'api/' + folder.folderId + '/contents');
  }

  handleError(error: HttpErrorResponse): Observable<string> {
    this.messageService.clear();
    this.messageService.add(error.message);
    return throwError(error);
  }
}
