import {Folder} from '../models/folder';
import {Injectable} from '@angular/core';
import {VisitedItem} from '../models/visited-item';
import {ContentService} from './content.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  private history: Array<VisitedItem> = new Array<VisitedItem>();
  private current = 0;

  goBack() {
    --this.current;
    const item = this.history[this.current];
    if (item.itemType === Folder.FOLDER_TYPE) {
      this.contentService.update(item.itemId).subscribe();
    }
    // something else for files
  }

  goForward() {
    ++this.current;
    const item = this.history[this.current];
    if (item.itemType === Folder.FOLDER_TYPE) {
      this.contentService.update(item.itemId).subscribe();
    }
    // something else for files
  }

  push(contentType: string, id: string) {
    if (contentType === Folder.FOLDER_TYPE || contentType === Folder.FILE_TYPE) {
      this.history.push(new VisitedItem(id, contentType));
      ++this.current;
    }
  }
}


