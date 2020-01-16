import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';
import {Folder} from '../../models/folder';
import {File} from '../../models/file';
import {FolderContents} from '../../models/folder-contents';
import {FOLDER_VIEW_COMPONENT} from '../../../constants';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FolderCreateComponent} from './folder-create/folder-create.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {HistoryService} from '../../services/history.service';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  public loading = false;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private history: HistoryService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.contentService.initializeContent().subscribe(() => {
      this.history.push(Folder.FOLDER_TYPE, this.contentService.folder.id);
      this.loading = false;
      this.route.paramMap.subscribe(params => {
        console.log(params);
      })
    });
  }

  openFileUploadModal() {
    const fileModalRef = this.modalService.open(FileUploadComponent);
    fileModalRef.componentInstance.folderId = this.currentFolder.folderId;
  }

  openCreateFolderModal() {
    const folModalRef = this.modalService.open(FolderCreateComponent);
    folModalRef.componentInstance.folderId = this.currentFolder.folderId;
  }

  goToFolder(event) {
    const target = event.target || event.currentTarget;
    const idAttr = target.attributes.id;
    const clickedId: string = idAttr.nodeValue;
    console.log(clickedId);
    this.contentService.update(clickedId).subscribe(() => {
      console.log(this.contentService.currentFolder);
      this.router.navigate(['home/' + this.contentService.currentFolder.folderName])
        .then(() => {
          this.history.push(Folder.FOLDER_TYPE, this.contentService.folder.id);
        });
    });
  }

  get compName() { return FOLDER_VIEW_COMPONENT; }

  get currentFolder(): Folder { return this.contentService.folder; }

  get contents(): FolderContents { return this.contentService.folderContents; }
}
