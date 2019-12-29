import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';
import {Folder} from '../../models/folder';
import {File} from '../../models/file';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  public loading = false;

  private currentFolder: Folder;

  private fileList: Array<File> = [];

  private folderList: Array<Folder> = [];

  constructor(
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.contentService.initializeContent()
      .subscribe(() => {
        let folderId;
        if (this.currentFolder) {
          folderId = this.currentFolder.folderId;
        }
        this.contentService.fetchFolder(folderId)
          .subscribe(data => {
            this.currentFolder = data;
            console.log(typeof this.currentFolder.contents);
            this.contentService.fetchFolderContents(this.currentFolder)
              .subscribe();
            this.loading = false;
            console.log(this.fileList);
            console.log(this.folderList);
            console.log(this.currentFolder);
          });
        /*if (this.currentFolder) {
          this.contentService.fetchFolder(this.currentFolder.folderId);
        } else {
          this.contentService.fetchFolder();
        }*/
      });
  }

  get baseId() { return this.contentService.baseId; }

  get folderName() { return this.currentFolder.folderName; }

  get contents(): Array<string> {
    if (!this.loading) {
      const contentArray = [];
      this.folderList.forEach(value => {
        contentArray.concat(value.folderName);
      });
      this.fileList.forEach(value => {
        contentArray.concat(value.fileName);
      });
      return contentArray;
    } else {
      return [];
    }
  }
}
