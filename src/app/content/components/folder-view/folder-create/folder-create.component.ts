import {Component, Input} from '@angular/core';
import {ContentService} from '../../../services/content.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FOLDER_CREATE_COMPONENT} from '../../../../constants';

@Component({
  selector: 'app-folder-create',
  templateUrl: './folder-create.component.html',
  styleUrls: ['./folder-create.component.css']
})


export class FolderCreateComponent {
  @Input() public folderId: string;

  creationForm = this.fb.group({
    folderName: ''
  });

  public loading = false;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }


  createSubmit() {
    this.loading = true;
    this.contentService.createFolder(this.folderId, this.folderName.value)
      .subscribe(data => {
        alert('Folder created successfully');
        this.loading = false;
        this.activeModal.close(true);
      });
  }

  get folderName() { return this.creationForm.get('folderName'); }

  get compName() { return FOLDER_CREATE_COMPONENT; }
}
