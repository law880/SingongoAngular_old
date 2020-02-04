import {File} from './file';
import {Folder} from './folder';

export class FolderContents {
  constructor( public contentList: Array<File | Folder>) {}

  get contents() { return this.contentList; }

  static compare(key: string, order: number = 1) {
    return (recOne, recTwo) => {
      if (!recOne.hasOwnProperty(key) || !recTwo.hasOwnProperty(key)) {
        return 0;
      }

      const attributeA = recOne[key];
      const attributeB = recTwo[key];

      let comp = 0;

      if (attributeA > attributeB) {
        comp = 1;
      } else if (attributeA < attributeB) {
        comp = -1;
      }

      return comp * order;
    };
  }
}
