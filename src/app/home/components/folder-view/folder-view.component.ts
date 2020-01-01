import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';
import {Folder} from '../../models/folder';
import {File} from '../../models/file';
import {FolderContents} from '../../models/folder-contents';
import {FOLDER_VIEW_COMPONENT} from '../../../constants';
import {FormBuilder} from '@angular/forms';

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

  public creating = false;

  private currentFolder: Folder;

  private contents: FolderContents;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
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
          console.log('else');
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

  createSubmit() {
    this.creating = true;
    this.contentService.createFolder(this.currentFolder.folderId, this.folderName.value)
      .subscribe(data => {
        this.contentService.fetchFolderContents(this.currentFolder.folderId).subscribe(
          folData => {
            alert('Folder created successfully');
            this.creationForm.setValue({folderName: ''});
            this.contents = folData;
            this.creating = false;
          }
        );
      });
  }

  get compName() { return FOLDER_VIEW_COMPONENT; }

  get folderName() { return this.creationForm.get('folderName'); }
}
