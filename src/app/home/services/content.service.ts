import { Injectable } from '@angular/core';
import {Folder} from '../models/folder';
import {File} from '../models/file';
import {AuthService} from '../../auth/services/auth.service';
import {UserInfoService} from '../../auth/services/user-info.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {catchError, concatMap, map, tap} from 'rxjs/operators';
import {MessageService} from '../../auth/services/message.service';
import {Observable, of, Subscription, throwError} from 'rxjs';
import {baseUrl, FILE_UPLOAD_COMPONENT, FOLDER_CREATE_COMPONENT, FOLDER_VIEW_COMPONENT} from '../../constants';
import {FolderContents} from '../models/folder-contents';
import {HistoryService} from './history.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private baseId: string;

  public currentFolder: Folder = null;

  public contents: FolderContents = null;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private messageService: MessageService,
    private history: HistoryService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  initializeContent() {
    if (!this.baseId) {
      return this.http.get(baseUrl + 'api/root', this.httpOptions).pipe(
        map(data => JSON.parse(JSON.stringify(data))),
        tap(data => {
          this.baseId = data.id;
          this.update(data.id).subscribe();
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FOLDER_VIEW_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
          return throwError(error);
        })
      );
    } else {
      return of(null);
    }
  }

  private fetchFolder(folderId: string = this.baseId): Observable<Folder> { // either root or desired folder
    return this.http.get<Folder>(baseUrl + 'api/' + folderId, this.httpOptions)
      .pipe(
        map(data => {
          return new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FOLDER_VIEW_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
          return throwError(error);
        }));
  }

  private fetchFolderContents(folderId: string): Observable<void> {
    console.log(folderId);

    return this.http.get<FolderContents>(baseUrl + 'api/' + folderId + '/contents', this.httpOptions)
      .pipe(
        map((data) => {
          const files: Array<File> = [];
          const folders: Array<Folder> = [];
          data.files.forEach(value => {
            console.log('in iteration');
            files.push(new File(value.id, value.name,
              value.size, value.dateCreated, value.dateModified,
              value.type, value.extension));
          });
          data.folders.forEach(value => {
            folders.push(new Folder(value.id, value.name,
              value.contents, value.parentId, value.dateCreated, value.dateModified));
          });
          this.contents = new FolderContents(files, folders);
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FOLDER_VIEW_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
          return throwError(error);
        }));
  }

  createFolder(currentFolderId: string, folderName: string): Observable<Subscription> {
    return of(this.http.post(baseUrl + 'api/' + currentFolderId + '/create-folder', {
      newFolderName: folderName
    }, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_CREATE_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_CREATE_COMPONENT);
        return throwError(error);
      }))
      .subscribe(() => this.update().subscribe()));
  }

  uploadFile(fileToUpload, folderId: string): Observable<Subscription> {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    console.log(JSON.stringify(formData));
    return of(this.http.post(baseUrl + 'api/' + folderId + '/upload', formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FILE_UPLOAD_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_CREATE_COMPONENT);
          return throwError(error);
        })
      ).subscribe(() => this.update().subscribe()));
  }

  update(folderId: string = this.currentFolder.folderId): Observable<void> {
    return this.fetchFolder(folderId).pipe(
      map(data => {
        this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
        return this.currentFolder;
      }),
      concatMap(data => this.http.get<FolderContents>(baseUrl + 'api/' + data.folderId + '/contents', this.httpOptions)),
      map(contents => {
        const files: Array<File> = [];
        const folders: Array<Folder> = [];
        contents.files.forEach(value => {
          console.log('in iteration');
          files.push(new File(value.id, value.name,
            value.size, value.dateCreated, value.dateModified,
            value.type, value.extension));
        });
        contents.folders.forEach(value => {
          folders.push(new Folder(value.id, value.name,
            value.contents, value.parentId, value.dateCreated, value.dateModified));
        });
        this.contents = new FolderContents(files, folders);
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_VIEW_COMPONENT);
        this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
        return throwError(error);
      }));
  }

  get folder(): Folder { return this.currentFolder; }

  get folderContents(): FolderContents { return this.contents; }
}
