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
          this.isHomeView = true;
          this.contentService.update(this.contentService.homeId).subscribe(() => {
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

  goTo(event) {
    const target = event.target || event.currentTarget;
    const idAttr = target.attributes.id;
    const clickedIndex: string = idAttr.nodeValue;
    const index: number = +clickedIndex;
    const clickedId: string = this.contents.contents[index].id;
    if (this.contents.contents[index] instanceof Folder) {
      this.router.navigate(['folder/' + clickedId]);
    } else {
      this.router.navigate(['file/' + clickedId]);
    }
  }

  get compName() { return FOLDER_VIEW_COMPONENT; }

  get currentFolder(): Folder { return this.contentService.folder; }

  get contents(): FolderContents { return this.contentService.folderContents; }

}
