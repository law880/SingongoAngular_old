import { Injectable } from '@angular/core';
import {Folder} from '../models/folder';
import {File} from '../models/file';
import {AuthService} from '../../auth/services/auth.service';
import {UserInfoService} from '../../auth/services/user-info.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, concatMap, map, tap} from 'rxjs/operators';
import {MessageService} from '../../auth/services/message.service';
import {Observable, of, Subscription, throwError} from 'rxjs';
import {baseUrl, FILE_UPLOAD_COMPONENT, FILE_VIEW_COMPONENT, FOLDER_CREATE_COMPONENT, FOLDER_VIEW_COMPONENT} from '../../constants';
import {FolderContents} from '../models/folder-contents';
import {Location} from '@angular/common';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

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
    private location: Location,
    private sanitizer: DomSanitizer
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
          let errorMessage: string;
          if (error.message && error.message.toLocaleLowerCase().includes('unknown')) {
            errorMessage = 'An unknown error occurred. Please try again later';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = error.message;
          }
          return this.handleError(FOLDER_VIEW_COMPONENT, error, errorMessage);
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
        catchError((error: HttpErrorResponse) =>
          this.handleError(FILE_UPLOAD_COMPONENT, error, error.error ? error.error.message : error.message)
        )
      );
  }

  public createFolder(currentFolderId: string, folderName: string): Observable<Subscription> {
    return of(this.http.post(baseUrl + 'api/' + currentFolderId + '/create-folder', {
      newFolderName: folderName
    }, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) =>
        this.handleError(FILE_UPLOAD_COMPONENT, error, error.error ? error.error.message : error.message)
      )
    )
      .subscribe(() => this.update().subscribe()));
  }

  public uploadFile(filesToUpload: Array<any>, folderId: string): Observable<Subscription> {
    const formData = new FormData();
    for (const file of filesToUpload) {
      formData.append('file', file);
    }
    console.log(JSON.stringify(formData));
    return of(this.http.post(baseUrl + 'api/' + folderId + '/upload', formData)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(FILE_UPLOAD_COMPONENT, error, error.error ? error.error.message : error.message)
        )
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
              value.type, value.extension, value.parentId));
          }
          });

        this.contents = new FolderContents(contentList);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(FOLDER_VIEW_COMPONENT, error, error.message))
    );
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

  public getStream(fileInfo: File): Observable<SafeUrl> {
    const valueFound = this.getFile(fileInfo.id);
    if (!valueFound) {
      alert('An error occurred. Please try again later');
      this.location.back();
      return of(null);
    }
    return this.http.get(baseUrl + 'api/' + fileInfo.id + '/stream', {responseType: 'blob'})
      .pipe(
        map((stream: Blob) => {
          return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
        }),
        catchError(error =>
          this.handleError(FILE_VIEW_COMPONENT, error, 'An unknown error occured while acquiring this file. Please try again later.')
        )
      );
  }

  public sortByName() {
    this.contents.contentList.sort(FolderContents.compare('name'));
  }

  public sortByCreation() {
    this.contents.contentList.sort(FolderContents.compare('dateCreated'));
  }

  public sortByModification() {
    this.contents.contentList.sort(FolderContents.compare('dateModified'));
  }

  public sortBySize() {
    this.contents.contentList.sort(FolderContents.compare('size'));
  }

  public sortByType() {
    this.contents.contentList.sort(FolderContents.compare('type'));
  }

  public downloadCurrentFolder(): Observable<SafeUrl> {
    if (this.currentFolder) {
      return this.http.get(baseUrl + 'api/' + this.currentFolder.id + '/download', {responseType: 'blob'})
        .pipe(
          map((stream: Blob) => {
            return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
          }),
          catchError(error => this.handleError(FOLDER_VIEW_COMPONENT, error,
            'An unknown error occurred while attempting to download this file. Please try again later.'))
        );
    } else {
      return this.handleError(FOLDER_VIEW_COMPONENT, null,
        'An unknown error occurred while attempting to download this file. Please try again later.');
    }

  }

  private handleError(throwingComponent: string, error: any, message?: string): Observable<never> {
    this.messageService.delete(throwingComponent);
    this.messageService.add(message, throwingComponent);
    if (error) {
      return throwError(error);
    } else {
      return throwError(null);
    }
  }

  public search(keywords: string) {
    console.log(keywords);
    const searchParams = new HttpParams()
      .set('keywords', keywords);
    return this.http.get<FolderContents>(baseUrl + 'api/search', {params: searchParams})
      .pipe(
        map(data => {
          console.log(data);
          const contentList: Array<File | Folder> = new Array<File|Folder>();
          data.contentList.forEach((value: Folder | File) => {
            if ((value as Folder).contents !== undefined) {
              value = value as Folder;
              contentList.push(new Folder(value.id, value.name,
                value.contents, value.parentId, value.dateCreated, value.dateModified, value.size));
            } else {
              value = value as File;
              contentList.push(new File(value.id, value.fileName,
                value.size, value.dateCreated, value.dateModified,
                value.type, value.extension, value.parentId));
            }
          });

          return new FolderContents(contentList);
        }),
        catchError(error => this.handleError('SEARCH', error)));
  }

  public deleteFolder(deletion: Folder) {
    return this.http.delete(baseUrl + 'api/' + deletion.id);
  }

  public deleteFile(deletion: File) {
    return this.http.delete(baseUrl + 'api/' + deletion.parentId + '/' + deletion.id);
  }

  public renameFolder(rename: Folder, renameName: string) {
    const params = new HttpParams()
      .set('newName', renameName)
    return this.http.patch(baseUrl + 'api/folder/' + rename.id, params);
  }

  public renameFile(rename: File, renameName: string) {
    const params = new HttpParams()
      .set('newName', renameName);
    return this.http.patch(baseUrl + 'api/file/' + rename.id, params);
  }
}
