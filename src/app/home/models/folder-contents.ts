import {File} from './file';
import {Folder} from './folder';

export class FolderContents {
  constructor(private contentList: Array<File | Folder>){ }

  get contents() { return this.contentList.sort(File.compare); }
}
