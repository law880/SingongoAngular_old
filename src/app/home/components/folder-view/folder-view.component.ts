import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';
import {Folder} from '../../models/folder';
import {FolderContents} from '../../models/folder-contents';
import {FOLDER_VIEW_COMPONENT} from '../../../constants';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FolderCreateComponent} from './folder-create/folder-create.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {ActivatedRoute, ParamMap, Router, UrlSegment} from '@angular/router';
import {File} from '../../models/file';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  public loading = false;

  public isHomeView = false;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.contentService.initializeContent().subscribe(() => {
      this.route.url.subscribe((segments: UrlSegment[]) => {
        if (segments[0].path === 'home') { // home view
          console.log('home view');
          this.isHomeView = true;
          this.contentService.update(this.contentService.homeId).subscribe(() => {
            console.log('done loading');
            this.loading = false;
          });
        } else { // get parameter for folder id
          this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.has('id')) {
              const folderId = params.get('id');
              this.contentService.update(folderId).subscribe(() => this.loading = false);
            }
          });
        }
      }, (error) => {
        if (error) {
          this.loading = false;
        }
      });
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

  goTo(chosen: File | Folder) {
    if (chosen instanceof Folder) {
      this.router.navigate(['folder/' + chosen.id]);
    } else if (chosen instanceof File) {
      this.router.navigate(['folder/' + this.contentService.folder.id + '/file/' + chosen.id]);
    }
  }

  get compName() { return FOLDER_VIEW_COMPONENT; }

  get currentFolder(): Folder { return this.contentService.folder; }

  get contents(): FolderContents { return this.contentService.contents; }

  sortBy(attribute: string) {
    if (attribute === 'name') {
      this.contentService.sortByName();
    } else if (attribute === 'created') {
      this.contentService.sortByCreation();
    } else if (attribute === 'modified') {
      this.contentService.sortByModification();
    } else if (attribute === 'size') {
      this.contentService.sortBySize();
    } else if (attribute === 'type') {
      this.contentService.sortByType();
    }
  }

}
