import {Folder} from './folder';

export class VisitedItem {
  constructor(
    private id: string,
    private type: string
  ) {
    if (type !== Folder.FOLDER_TYPE && type !== Folder.FILE_TYPE) {
      throw new Error('type must be either file or folder');
    }
  }

  get itemId(): string { return this.id; }

  get itemType(): string { return this.type; }
}
