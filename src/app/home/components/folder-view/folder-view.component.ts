import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';
import {Folder} from '../../models/folder';
import {File} from '../../models/file';
import {FolderContents} from '../../models/folder-contents';
import {FOLDER_VIEW_COMPONENT} from '../../../constants';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FolderCreateComponent} from './folder-create/folder-create.component';
import {FileUploadComponent} from "./file-upload/file-upload.component";

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {
  creationForm = this.fb.group({
    folderName: ''
  });

  public loading = false;

  private currentFolder: Folder;

  private contents: FolderContents;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loading = true;
    this.contentService.initializeContent()
      .subscribe(() => {
        if (this.currentFolder) {
          this.contentService.fetchFolder(this.currentFolder.folderId)
            .subscribe(data => {
              this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
              console.log(this.currentFolder);
              this.contentService.fetchFolderContents(this.currentFolder.folderId).subscribe(
                folData => {
                  this.contents = folData;
                  this.loading = false;
                  console.log(this.contents);
                }
              );
            });
        } else {
          this.contentService.fetchFolder()
            .subscribe(data => {
              this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
              console.log(this.currentFolder);
              this.contentService.fetchFolderContents(this.currentFolder.folderId).subscribe(
                folData => {
                  this.contents = folData;
                  this.loading = false;
                  console.log(this.contents);
                }
              );
            });
        }
      });
  }

  uploadFile() {
    const fileModalRef = this.modalService.open(FileUploadComponent);
    fileModalRef.componentInstance.folderId = this.currentFolder.folderId;
    fileModalRef.result.then((result) => {
      if (result === true) {
        this.contentService.fetchFolder(this.currentFolder.folderId)
          .subscribe(data => {
            this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
            console.log(this.currentFolder);
            this.contentService.fetchFolderContents(this.currentFolder.folderId).subscribe(
              folData => {
                this.contents = folData;
                this.loading = false;
                console.log(this.contents);
              }
            );
          });
      }
    }, (error) => {
      console.log(error);
    });
  }

  openCreateFolModal() {
    const folModalRef = this.modalService.open(FolderCreateComponent);
    folModalRef.componentInstance.folderId = this.currentFolder.folderId;
    folModalRef.result.then((result) => {
      if (result === true) {
        this.contentService.fetchFolder(this.currentFolder.folderId)
          .subscribe(data => {
            this.currentFolder = new Folder(data.id, data.name, data.contents, data.parentId, data.dateCreated, data.dateModified);
            console.log(this.currentFolder);
            this.contentService.fetchFolderContents(this.currentFolder.folderId).subscribe(
              folData => {
                this.contents = folData;
                this.loading = false;
                console.log(this.contents);
              }
            );
          });
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }

  get compName() { return FOLDER_VIEW_COMPONENT; }

  get folderName() { return this.creationForm.get('folderName'); }
}
