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
import {Location} from "@angular/common";

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
    private location: Location
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
        const contentList: Array<File | Folder> = new Array<File|Folder>();
        contents.contentList.forEach((value: Folder | File) => {
          if ((value as Folder).contents !== undefined) {
            value = value as Folder;
            contentList.push(new Folder(value.id, value.name,
              value.contents, value.parentId, value.dateCreated, value.dateModified, value.size));
          } else {
            value = value as File;
            contentList.push(new File(value.id, value.fileName,
              value.size, value.dateCreated, value.dateModified,
              value.type, value.extension));
          }
          });

        this.contents = new FolderContents(contentList);
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.delete(FOLDER_VIEW_COMPONENT);
        this.messageService.add(error.message, FOLDER_VIEW_COMPONENT);
        return throwError(error);
      }));
  }

  get folder(): Folder { return this.currentFolder; }

  get folderContents(): FolderContents { return this.contents; }

  getFile(id: string): File {
      let returnValue: File = null;
      this.folderContents.contentList.forEach(value => {
        if (value instanceof File && value.id === id) {
          console.log('in getting if ' + value.name);
          returnValue = value;
        }
      });
      return returnValue;
  }

  public getStream(fileInfo: File): Observable<any>{
    const valueFound = this.getFile(fileInfo.id);
    if (!valueFound) {
      alert('An error occurred. Please try again later');
      this.location.back();
      return of(null);
    }
    return this.http.get(baseUrl + 'api/' + fileInfo.id + '/stream', {responseType: 'blob'});
  }
}
