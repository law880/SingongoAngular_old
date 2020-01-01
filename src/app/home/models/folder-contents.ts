import {File} from './file';
import {Folder} from './folder';

export class FolderContents {
  constructor(private fileList: Array<File>,
              private folderList: Array<Folder>
  ) { }

  get files() { return this.fileList.sort(File.compare); }

  get folders() { return this.folderList.sort(Folder.compare); }
}
