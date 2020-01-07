import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ContentService} from '../../../services/content.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FILE_UPLOAD_COMPONENT} from '../../../../constants';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})


export class FileUploadComponent {
  @Input() public folderId: string;

  uploadForm = this.fb.group({
    file: [null, Validators.required]
  });

  public loading = false;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private cd: ChangeDetectorRef
  ) { }

  onFileSelect(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadForm.patchValue({file: reader.result});
      };
      this.cd.markForCheck();
    }
  }


  onSubmit() {
    this.loading = true;
    this.contentService.uploadFile(this.uploadForm.get('file').value, this.folderId)
      .subscribe(data => {
        alert('Folder created successfully');
        this.loading = false;
        this.activeModal.close(true);
      });
  }

  get file() { return this.uploadForm.get('file'); }

  get compName() { return FILE_UPLOAD_COMPONENT; }

}
