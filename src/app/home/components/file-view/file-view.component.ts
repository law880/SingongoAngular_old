import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {File} from '../../models/file';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  public loading = false;

  public contentIndex = -1;

  constructor(
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        const folderId = params.get('id');
        console.log(folderId);
        if (folderId !== this.contentService.folder.id) {
          alert('An error occurred. Please try again later. Returning to the previous page.');
          this.router.navigate(['folder/' + folderId]);
        }
        this.route.queryParamMap.subscribe((queryData: ParamMap) => {
          if (queryData.has('index')) {
            this.contentIndex = +queryData.get('index');
          }
          // TO-DO: fetch stream for media player
        });
      }
    });
  }

  get fileInfo(): File {
    return this.contentIndex === -1 ? null : this.contentService.folderContents.files[this.contentIndex]
  }

}
