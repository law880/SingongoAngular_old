export class Folder {
  public static FOLDER_TYPE = 'folder';
  public static FILE_TYPE = 'file';

  constructor(
    public id: string,
    public name: string,
    public contents: Map<string, string>, // id=key, type=value
    public parentId: string,
    public dateCreated: Date,
    public dateModified: Date
  ) { }

  get folderId() { return this.id; }

  get folderName() { return this.name; }

  get folderContents() { return this.contents; }

  get folderParentId() { return this.parentId; }

  get folderCreated() { return this.dateCreated; }

  get folderModified() { return this.dateModified; }

  public static compare(fOne: Folder, fTwo: Folder) {
    if (fOne.folderName < fTwo.folderName) {
      return -1;
    } else if (fOne.folderName > fTwo.folderName) {
      return 1;
    }
    return 0;
  }
}
