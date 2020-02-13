import {Component, Input, OnInit} from '@angular/core';
import {Folder} from '../../models/folder';
import {File} from '../../models/file';
import {ContentService} from '../../services/content.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-view',
  templateUrl: './delete-view.component.html',
  styleUrls: ['./delete-view.component.css']
})
export class DeleteViewComponent implements OnInit {
  @Input() deletion: File | Folder;

  public type: string;

  public loading = false;

  constructor(
    private contentService: ContentService,
    private activeModal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    if (this.deletion instanceof File) {
      this.type = Folder.FILE_TYPE;
    } else {
      this.type = Folder.FOLDER_TYPE;
    }
    this.loading = false;
  }

  onSubmit() {
    this.loading = true;
    if (this.deletion instanceof Folder) {
      this.contentService.deleteFolder(this.deletion)
        .subscribe(() => {
          this.contentService.update(this.deletion.parentId)
            .subscribe(() => this.handleSuccess());
        }, error => this.handleError(error));
    } else {
      this.contentService.deleteFile(this.deletion)
        .subscribe(() => {
          this.contentService.update(this.deletion.parentId)
            .subscribe(() => this.handleSuccess());
        }, error => this.handleError(error));
    }
  }

  private handleError(error) {
    console.log(error);
    this.loading = false;
    alert('Sorry, the deletion failed. Please try again later.');
    this.activeModal.close('failure');
  }

  private handleSuccess() {
    alert(this.deletion.name + ' deleted successfully. Returning.');
    this.router.navigate(['folder/' + this.deletion.parentId])
      .then(() => this.activeModal.close('success'));
  }

}
