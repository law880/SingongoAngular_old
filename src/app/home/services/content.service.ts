import { Injectable } from '@angular/core';
import {Folder} from '../models/folder';
import {File} from '../models/file';
import {AuthService} from '../../auth/services/auth.service';
import {UserInfoService} from '../../auth/services/user-info.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, concatMap, map, tap} from 'rxjs/operators';
import {MessageService} from '../../auth/services/message.service';
import {Observable, of, Subscription, throwError} from 'rxjs';
import {baseUrl, FILE_UPLOAD_COMPONENT, FOLDER_CREATE_COMPONENT, FOLDER_VIEW_COMPONENT} from '../../constants';
import {FolderContents} from '../models/folder-contents';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public homeId: string;

  public currentFolder: Folder = null;

  public contents: FolderContents = null;

  constructor(
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  public initializeContent() {
    if (!this.homeId) {
      return this.http.get(baseUrl + 'api/home', this.httpOptions).pipe(
        map(data => JSON.parse(JSON.stringify(data))),
        tap(data => {
          this.homeId = data.id;
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

  private fetchFolder(folderId: string = this.homeId): Observable<Folder> { // either home or desired folder
    return this.http.get<Folder>(baseUrl + 'api/' + folderId, this.httpOptions)
      .pipe(
        map(data => {
          return new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified, data.size);
        }),
        catchError((error: HttpErrorResponse) => {
          this.messageService.delete(FOLDER_VIEW_COMPONENT);
          this.messageService.add(error.error.message, FOLDER_VIEW_COMPONENT);
          return throwError(error);
        }));
  }

  public createFolder(currentFolderId: string, folderName: string): Observable<Subscription> {
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

  public uploadFile(fileToUpload, folderId: string): Observable<Subscription> {
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

  public update(folderId: string = this.currentFolder.folderId): Observable<void> {
    return this.fetchFolder(folderId).pipe(
      map(data => {
        this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified, data.size);
        return this.currentFolder;
      }),
      concatMap(data => this.http.get<FolderContents>(baseUrl + 'api/' + data.folderId + '/contents', this.httpOptions)),
      map(contents => {
        const contentList: Array<File | Folder> = [];
        contents.contents.forEach(value => {
          if (value instanceof File) {
            contentList.push(new File(value.id, value.name,
              value.size, value.dateCreated, value.dateModified,
              value.type, value.extension));
          } else if (value instanceof Folder) {
            contentList.push(new Folder(value.id, value.name,
              value.contents, value.parentId, value.dateCreated, value.dateModified, value.size));
          }
        });
        this.contents = new FolderContents(contentList);
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
