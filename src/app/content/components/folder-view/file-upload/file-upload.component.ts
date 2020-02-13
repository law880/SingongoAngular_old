import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ContentService} from '../../../services/content.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {baseUrl, FILE_UPLOAD_COMPONENT} from '../../../../constants';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})


export class FileUploadComponent {
  @Input() public folderId: string;

  filesToUpload: Array<File> = [];

  public loading = false;

  constructor(
    private contentService: ContentService,
    private activeModal: NgbActiveModal,
  ) { }

  onFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
      this.filesToUpload.push(file);
      }
    }
  }


  onSubmit() {
    this.loading = true;
    this.contentService.uploadFile(this.filesToUpload, this.folderId)
      .subscribe(data => {
        alert('File uploaded successfully');
        this.loading = false;
        this.activeModal.close(true);
      });
  }

  get files() { return this.filesToUpload; }

  get compName() { return FILE_UPLOAD_COMPONENT; }

}
