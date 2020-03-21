import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {File} from '../../models/file';
import {DatePipe, Location} from '@angular/common';
import {FileSizePipe} from '../../../general/pipes/file-size.pipe';
import {DeleteViewComponent} from '../delete-view/delete-view.component';
import {RenameViewComponent} from '../rename-view/rename-view.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserInfoService} from '../../../auth/services/user-info.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  public loading = false;

  public currentFile: File = null;

  public url: string = null;

  constructor(
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private sizePipe: FileSizePipe,
    private modalService: NgbModal,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('folderId') && params.has('fileId')) {
        const folderId: string = params.get('folderId');
        const fileId: string = params.get('fileId');
        if (this.contentService.folder === null) {
          this.contentService.initializeContent().subscribe(() => {
            this.contentService.update(folderId)
              .subscribe(() => {
                this.currentFile = this.contentService.getFile(fileId);
                console.log(this.currentFile.type);
                if (this.currentFile === null) {
                  alert('File not found. Returning to previous page');
                  this.location.back();
                  this.loading = false;
                  return;
                }
                // TO-DO: fetch stream for media player
                this.contentService.getStream(this.currentFile).subscribe((url: string) => {
                  this.url = url;
                  this.loading = false;
                }, error => this.handleUnknownError(error));
              });
          }, error => this.handleUnknownError(error));
        } else {
          this.currentFile = this.contentService.getFile(fileId);
          if (this.currentFile === null) {
            alert('File not found. Returning to previous page');
            this.location.back();
            this.loading = false;
            return;
          }
          // TO-DO: fetch stream for media player
          this.contentService.getStream(this.currentFile).subscribe((url: string) => {
            this.url = url;
            this.loading = false;
          }, error => this.handleUnknownError(error));
        }
      }
    });
  }

  get type(): string {
    if (this.currentFile.type.includes('pdf')) {
      return 'pdf';
    } else if (this.currentFile.type.includes('video')) {
      return 'video';
    } else if (this.currentFile.type.includes('audio')) {
      return 'audio';
    } else if (this.currentFile.type.includes('image')) {
      return 'image';
    } else {
      return 'unknown';
    }
  }

  private handleUnknownError(error: any) {
    alert('An unknown error occurred. Please try again later.\nReturning to the previous page');
    this.location.back();
    this.loading = false;
  }

  openDeleteModal() {
    const delModal = this.modalService.open(DeleteViewComponent);
    delModal.componentInstance.deletion = this.currentFile;
  }

  openRenameModal() {
    const renameModal = this.modalService.open(RenameViewComponent);
    renameModal.componentInstance.renameItem = this.currentFile;
    renameModal.result.then(() => {
      this.ngOnInit();
    });
  }
}
