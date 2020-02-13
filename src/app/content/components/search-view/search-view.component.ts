import {Component, Input, OnInit} from '@angular/core';
import {FolderContents} from '../../models/folder-contents';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {File} from '../../models/file';
import {Folder} from '../../models/folder';
import {SEARCH_VIEW_COMPONENT} from '../../../constants';
import {ContentService} from '../../services/content.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {

  private keywords: string;

  public searchResults: FolderContents = null;

  public loading = false;

  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    console.log('init search');
    this.loading = true;
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('keywords')) {
        this.keywords = params.get('keywords');
        this.contentService.search(this.keywords)
          .subscribe(results => {
              this.searchResults = results;
              console.log(this.searchResults);
              this.loading = false;
          });
      } else {
        console.log('no params');
      }
    });
  }

  get contents(): FolderContents { return this.searchResults; }

  sortBy(attribute: string) {
    if (attribute === 'name') {
      this.searchResults.contentList.sort(FolderContents.compare('name'));
    } else if (attribute === 'created') {
      this.searchResults.contentList.sort(FolderContents.compare('dateCreated'));
    } else if (attribute === 'modified') {
      this.searchResults.contentList.sort(FolderContents.compare('dateModified'));
    } else if (attribute === 'size') {
      this.searchResults.contentList.sort(FolderContents.compare('size'));
    } else if (attribute === 'type') {
      this.searchResults.contentList.sort(FolderContents.compare('type'));
    }
  }

  goTo(chosen: File | Folder) {
    if (chosen instanceof Folder) {
      this.router.navigate(['folder/' + chosen.id]);
    } else if (chosen instanceof File) {
      this.router.navigate(['folder/' + chosen.parentId + '/file/' + chosen.id]);
    }
  }

  get compName() { return SEARCH_VIEW_COMPONENT; }
}
