import {File} from './file';
import {Folder} from './folder';

export class FolderContents {
  constructor( public contentList: Array<File | Folder>) {}

  get contents() { return this.contentList; }
}
