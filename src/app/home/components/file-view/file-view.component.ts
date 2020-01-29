import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {File} from '../../models/file';
import {DatePipe, Location} from '@angular/common';
import {DomSanitizer} from "@angular/platform-browser";
import {FileSizePipe} from "../../file-size.pipe";

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
    private sizePipe: FileSizePipe
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
                });
              });
          });
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
          });
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
}
