import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Folder} from '../../models/folder';
import {ContentService} from '../../services/content.service';
import {File} from '../../models/file';

@Component({
  selector: 'app-rename-view',
  templateUrl: './rename-view.component.html',
  styleUrls: ['./rename-view.component.css']
})
export class RenameViewComponent implements OnInit {

  @Input() renameItem: File | Folder;

  public loading = false;
  public type: string;

  renameForm = this.fb.group({
    newName: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loading = true;
    if (this.renameItem instanceof File) {
      this.type = Folder.FILE_TYPE;
    } else {
      this.type = Folder.FOLDER_TYPE;
    }
    this.loading = false;
  }

  constructor(private fb: FormBuilder,
              private activeModal: NgbActiveModal,
              private contentService: ContentService) { }

  get fName() { return this.renameForm.get('newName'); }

  onSubmit() {
    const confirmResult = confirm('Are you sure you want to change ' + this.renameItem.name + ' to ' + this.fName.value + '?');
    if (confirmResult) {
      this.loading = true;
      if (this.renameItem instanceof Folder) {
        this.contentService.renameFolder(this.renameItem, this.fName.value)
          .subscribe(() => {
            this.contentService.update()
              .subscribe(() => this.handleSuccess(), error => this.handleError(error));
          }, error => this.handleError(error));
      } else {
        this.contentService.renameFile(this.renameItem, this.fName.value)
          .subscribe(() => {
            this.contentService.update()
              .subscribe(() => this.handleSuccess(), error => this.handleError(error));
          }, error => this.handleError(error));
      }
    }
  }

  private handleError(error) {
    console.log(error);
    this.loading = false;
    alert('Sorry, the rename failed. Please try again later.');
    this.activeModal.close('failure');
  }

  private handleSuccess() {
    alert(this.renameItem.name + ' renamed successfully. Returning.');
    this.activeModal.close('success');
  }

}
