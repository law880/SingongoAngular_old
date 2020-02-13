import {Component, OnInit, SecurityContext} from '@angular/core';
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
import {FileSizePipe} from '../../../general/pipes/file-size.pipe';
import {DatePipe} from '@angular/common';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {DeleteViewComponent} from '../delete-view/delete-view.component';
import {RenameViewComponent} from '../rename-view/rename-view.component';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  public loading = false;

  public isHomeView = false;

  public downloadUrl: SafeUrl = null;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private sizePipe: FileSizePipe,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
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
              this.contentService.update(folderId).subscribe(() => {
                    this.loading = false;
              });
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

  downloadFolder() {
    this.contentService.downloadCurrentFolder()
      .subscribe((url: SafeUrl) => {
        const link = document.createElement('a');
        link.href = this.sanitizer.sanitize(SecurityContext.URL, url);
        link.download = this.currentFolder.name;
        link.click();
      });
  }

  openDeleteModal() {
      const delModal = this.modalService.open(DeleteViewComponent);
      delModal.componentInstance.deletion = this.currentFolder;
  }

  openRenameModal() {
    const renameModal = this.modalService.open(RenameViewComponent);
    renameModal.componentInstance.folder = this.currentFolder;
  }
}
